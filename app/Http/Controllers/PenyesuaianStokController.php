<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use App\Models\AdjustmentStock;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PenyesuaianStokController extends Controller
{
    /* =====================================================
     * INDEX
     * ===================================================== */
public function index(Request $request)
{
    $status = $request->get('status');

    $adjustments = AdjustmentStock::query()
        ->where('branch_id', Auth::user()->branch_id)
        ->with(['items'])
        ->when($request->filled('search'), function ($q) use ($request) {
            // Normalisasi input ke huruf kecil
            $searchTerm = strtolower($request->search);

            $q->where(function ($q2) use ($searchTerm) {
                // Gunakan LOWER() untuk pencarian string agar Case-Insensitive
                $q2->whereRaw('LOWER(code) like ?', ["%{$searchTerm}%"])
                   ->orWhereRaw('LOWER(notes) like ?', ["%{$searchTerm}%"])
                   ->orWhereRaw('LOWER(transfer_token) like ?', ["%{$searchTerm}%"]);

                // Keamanan PostgreSQL: Cari ID hanya jika input adalah angka
                if (is_numeric($searchTerm)) {
                    $q2->orWhere('id', $searchTerm);
                }
            });
        })
        ->when($request->flag, fn ($q) => $q->where('flag', $request->flag))
        ->when(
            $status,
            fn ($q) => $q->where('status', $status),
            fn ($q) => $q->where('status', '!=', 'canceled')
        )
        ->latest()
        ->paginate(60)
        ->withQueryString();

    /*
    |--------------------------------------------------------------------------
    | Inject counterpart_branch_name
    |--------------------------------------------------------------------------
    */
    $adjustments->getCollection()->transform(function ($adj) {
        if (!$adj->transfer_token) {
            $adj->counterpart_branch_name = null;
            return $adj;
        }

        $counterpart = AdjustmentStock::where('transfer_token', $adj->transfer_token)
            ->where('branch_id', '!=', $adj->branch_id)
            ->with('branch')
            ->first();

        $adj->counterpart_branch_name = $counterpart?->branch?->name;

        return $adj;
    });

    return Inertia::render('PenyesuaianStok/Index', [
        'adjustments' => $adjustments,
        'filters'     => $request->only('search', 'status', 'flag'),
    ]);
}


/* =====================================================
    * CREATE
    * ===================================================== */
public function create()
{

    return Inertia::render('PenyesuaianStok/Create', [
        'products' => Product::where('branch_id', Auth::user()->branch_id)
            ->select('id', 'sku', 'name', 'stock', 'cost')
            ->orderBy('name')
            ->get(),

        'pendingAdjustments' => OrderItem::where('branch_id', Auth::user()->branch_id)
            ->whereIn('status', ['new', 'canceled'])
            ->select('product_id', 'quantity_plus', 'quantity_mins')
            ->get(),            

        'flags' => [
            'opname' => 'Stok Opname',
        ],

        'defaultFlag' => 'opname',
        'today' => now()->toDateString(),
    ]);
}

/* =====================================================
    * STORE
    * ===================================================== */
public function store(Request $request)
{
    $data = $request->validate([
        'flag'           => 'required|string|in:opname,production,tf_in,tf_out',
        'date'           => 'required|date',
        'notes'          => 'required|string',
        'transfer_token' => 'nullable|string', // untuk TF IN

        'items' => 'required_if:flag,opname,production,tf_out|array|min:1',
        'items.*.product_id' => 'required_if:flag,opname,production,tf_out|integer',

        // opname
        'items.*.qty_system' => 'nullable|numeric',
        'items.*.qty_real'   => 'nullable|numeric',

        // non opname
        'items.*.qty'        => 'required_if:flag,production,tf_in,tf_out|numeric',

        'items.*.notes'      => 'nullable|string',
    ]);

    DB::transaction(function () use ($data, &$adjustment) {

        // =======================
        // HEADER ADJUSTMENT
        // =======================
        $adjustmentData = [
            'code'       => 'ADJ' . now()->format('YmdHis').'#'.Auth::user()->branch_id.'-'.Auth::user()->id,
            'flag'       => $data['flag'],
            'status'     => $data['flag'] === 'tf_in' ? 'done' : 'new',
            'notes'      => $data['notes'] ?? null,
            'branch_id'  => auth()->user()->branch_id,
            'date'       => $data['date'],
            'created_by' => auth()->id(),
        ];

        // TF IN: simpan token yang diinput user
        if ($data['flag'] === 'tf_in') {
            $adjustmentData['transfer_token'] = $data['transfer_token'] ?? null;
        }

        // TF OUT: generate token otomatis
        if ($data['flag'] === 'tf_out') {
            $adjustmentData['transfer_token'] = strtoupper(Str::random(12));
        }

        $adjustment = AdjustmentStock::create($adjustmentData);

        // =======================
        // ITEM TRANSFER IN DARI TOKEN
        // =======================
        if ($data['flag'] === 'tf_in' && !empty($data['transfer_token'])) {
            $tfOut = AdjustmentStock::with('items.product')
                ->where('transfer_token', $data['transfer_token'])
                ->where('flag', 'tf_out')
                ->where('status', 'new')
                ->lockForUpdate()
                ->firstOrFail();

            foreach ($data['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                $qtyIn = (float)($item['qty'] ?? 0);
                if ($qtyIn === 0) continue; // skip kalau qty 0

                $totalcost = $qtyIn * $product->cost;

                // CREATE ITEM
                $adjustmentItem = $adjustment->items()->create([
                    'product_id'    => $product->id,
                    'name'          => $product->name,
                    'cost'          => $product->cost,
                    'quantity_plus' => $qtyIn,
                    'quantity_mins' => 0,
                    'totalcost'      => $totalcost,
                    'notes'         => $item['notes'] ?? null,
                    'branch_id'     => auth()->user()->branch_id,
                    'date'          => $data['date'],
                    'created_by'    => auth()->id(),
                ]);

                // UPDATE STOCK
                $product->increment('stock', $qtyIn);

                // CREATE PAYMENT
                $payment = $adjustment->payments()->create([
                    'mutation_type' => 'Stok Transfer Masuk',
                    'currency'      => 'IDR',
                    'debit_akun'    => 'NR-DB Persediaan',
                    'kredit_akun'   => 'NR-DB Akum. Stok Transfer In',
                    'nominal'       => $totalcost,
                    'branch_id'     => $adjustment->branch_id,
                    'created_by'    => auth()->id(),
                    'date'          => $data['date'],
                ]);

                $this->applyPaymentMutation($payment);
            }

            $tfOut->update(['status' => 'done']);
        }


        // =======================
        // ITEM UNTUK OPNAME / PRODUCTION / TF OUT
        // =======================
        if ($data['flag'] !== 'tf_in') {
            foreach ($data['items'] ?? [] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                $cost    = (float)($product->cost ?? 0);

                $qty = $this->resolveQuantity($data['flag'], $item);

                if ($qty['plus'] === 0 && $qty['min'] === 0) {
                    continue;
                }

                $totalcost = ($qty['min'] === 0 ) ? 0 : $qty['min'] * $cost ;
                $subtotal = ($qty['plus'] === 0 ) ? 0 : $qty['plus'] * $cost ;

                $adjustmentItem = $adjustment->items()->create([
                    'product_id'    => $product->id,
                    'name'          => $product->name,
                    'cost'          => $cost,
                    'quantity_plus' => $qty['plus'],
                    'quantity_mins' => $qty['min'],
                    'totalcost'     => $totalcost,
                    'subtotal'      => $subtotal,
                    'totalweight'      => ($qty['plus'] + $qty['min']) * $product->weight,
                    'notes'         => $item['notes'] ?? null,
                    'branch_id'     => auth()->user()->branch_id,
                    'date'          => $adjustment->date,
                    'created_by'    => auth()->id(),
                ]);

                // APPLY STOCK
                if ($qty['plus'] > 0) {
                    $product->increment('stock', $qty['plus']);
                }
                if ($qty['min'] > 0) {
                    $product->decrement('stock', $qty['min']);
                }

                // PAYMENT
                if ($qty['plus'] > 0) {
                    $Debitnya = 'NR-DB Persediaan';
                    $Kreditnya = $data['flag'] === 'production' ? 'NR-DB WIP Berkembang'
                                : ($data['flag'] === 'tf_in' ? 'NR-DB Akum. Stok Transfer In' : 'NR-DB Stok Plus');
                } else {
                    $Debitnya = $data['flag'] === 'production' ? 'NR-DB WIP Menyusut'
                                : ($data['flag'] === 'tf_out' ? 'NR-DB Akum. Stok Transfer Out' : 'NR-DB Stok Minus');
                    $Kreditnya = 'NR-DB Persediaan';
                }

                $payment = $adjustment->payments()->create([
                    'mutation_type' => $this->resolveMutationType($data['flag'], $qty['plus'], $qty['min']),
                    'currency'      => 'IDR',
                    'debit_akun'    => $Debitnya,
                    'kredit_akun'   => $Kreditnya,
                    'nominal'       => ($qty['plus'] + $qty['min']) * $cost,
                    'branch_id'     => $adjustment->branch_id,
                    'created_by'    => auth()->id(),
                    'date'          => $adjustment->date,
                ]);

                $this->applyPaymentMutation($payment);
            }
        }
    });

    return redirect()
        ->route('penyesuaian-stok.index')
        ->with('success', 'Adjustment berhasil disimpan');
}



public function getTransferToken($token)
{
    $tfOut = AdjustmentStock::with('items.product')
        ->where('transfer_token', $token)
        ->where('flag', 'tf_out')
        ->where('status', 'new')
        ->first();

    // Ambil semua product di cabang penerima
    $products = Product::where('branch_id', auth()->user()->branch_id)
                       ->select('id','sku','name','stock')->get();

    // Map items TF OUT ke product penerima
    if ($tfOut) {
        foreach ($tfOut->items as $item) {
            $p = $products->firstWhere('sku', $item->product->sku);
            if ($p) {
                $item->product_id = $p->id;
                $item->product->name = $p->name; // nama cabang penerima
                $item->product->stock = $p->stock;
            }
        }
    }

    return Inertia::render('PenyesuaianStok/Create', [
        'tfOut' => $tfOut,
        'products' => $products,
    ]);
}




/* =====================================================
* EDIT
* ===================================================== */
public function edit(AdjustmentStock $adjustmentStock)
{
    $adjustmentStock->load('items.product', 'payments', 'branch');

    // Ambil semua adjustment lain dengan token yang sama
    $relatedAdjustments = collect();

    if ($adjustmentStock->transfer_token) {
        $relatedAdjustments = AdjustmentStock::with(['items.product', 'branch'])
            ->where('transfer_token', $adjustmentStock->transfer_token)
            ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | Tentukan lawan branch
    |--------------------------------------------------------------------------
    */
    $counterpart = $relatedAdjustments
        ->firstWhere('branch_id', '!=', $adjustmentStock->branch_id);

    $adjustmentStock->counterpart_branch_name = $counterpart?->branch?->name;

    // Mapping token => adjustments (existing logic Anda)
    $adjustmentItemsByToken = [];
    foreach ($relatedAdjustments as $adj) {
        $adjustmentItemsByToken[$adj->transfer_token][] = $adj;
    }

    return Inertia::render('PenyesuaianStok/Edit', [
        'adjustment' => $adjustmentStock,
        'products'   => Product::where('branch_id', Auth::user()->branch_id)
            ->select('id', 'sku', 'name', 'stock', 'cost')
            ->orderBy('name')
            ->get(),
        'adjustmentItemsByToken' => $adjustmentItemsByToken,
        'pendingAdjustments' => OrderItem::where('branch_id', Auth::user()->branch_id)
            ->whereIn('status', ['new', 'canceled'])
            ->whereNull('deleted_at')
            ->select('product_id', 'quantity_plus', 'quantity_mins')
            ->get(),        
    ]);
}
    


/* =====================================================
* UPDATE
* ===================================================== */
public function update(Request $request, AdjustmentStock $adjustment)
{
    $data = $request->validate([
        'date'  => 'required|date',
        'notes' => 'required|string',

        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|distinct|integer|exists:products,id',

        // opname
        'items.*.qty_system' => 'nullable|numeric',
        'items.*.qty_real'   => 'nullable|numeric',

        // non opname
        'items.*.qty'        => 'required_if:flag,production,tf_in,tf_out|numeric',

        'items.*.notes'      => 'nullable|string',
    ]);

    DB::transaction(function () use ($adjustment, $data) {

        // ==================================================
        // 1️⃣ ROLLBACK STOK & PAYMENT LAMA
        // ==================================================
        $adjustment->load('items.product', 'payments');

        foreach ($adjustment->items as $oldItem) {

            $product = Product::lockForUpdate()->find($oldItem->product_id);

            if (! $product) continue;

            // rollback stok
            if ($oldItem->quantity_plus > 0) {
                $product->decrement('stock', $oldItem->quantity_plus);
            }

            if ($oldItem->quantity_mins > 0) {
                $product->increment('stock', $oldItem->quantity_mins);
            }
        }

        foreach ($adjustment->payments as $payment) {
            $this->rollbackPaymentMutation($payment);
        }

        // ==================================================
        // 2️⃣ SOFT DELETE ITEM & PAYMENT LAMA
        // ==================================================
        $adjustment->items()->update(['deleted_by' => auth()->id()]);
        $adjustment->items()->delete();

        $adjustment->payments()->update(['deleted_by' => auth()->id()]);
        $adjustment->payments()->delete();

        // ==================================================
        // 3️⃣ UPDATE HEADER
        // ==================================================
        $adjustment->update([
            'date'       => $data['date'],
            'notes'      => $data['notes'] ?? null,
            'updated_by' => auth()->id(),
        ]);

        // ==================================================
        // 4️⃣ CREATE ITEM BARU + APPLY STOK & PAYMENT
        // ==================================================
        foreach ($data['items'] as $item) {

            $product = Product::lockForUpdate()->findOrFail($item['product_id']);
            $cost    = (float)($product->cost ?? 0);

            $qty = $this->resolveQuantity($adjustment->flag, $item);

            if ($qty['plus'] === 0 && $qty['min'] === 0) {
                continue;
            }
                $totalcost = ($qty['min'] === 0 ) ? 0 : $qty['min'] * $cost ;
                $subtotal = ($qty['plus'] === 0 ) ? 0 : $qty['plus'] * $cost ;
            // ======================
            // ITEM BARU
            // ======================
            $adjustment->items()->create([
                'product_id'    => $product->id,
                'name'          => $product->name,
                'cost'          => $cost,
                'quantity_plus' => $qty['plus'],
                'quantity_mins'      => $qty['min'],
                'totalcost'     => $totalcost,
                'subtotal'      => $subtotal,
                'totalweight'      => ($qty['plus'] + $qty['min']) * $product->weight,
                'status'         => $adjustment->status,
                'notes'         => $item['notes'] ?? null,
                'branch_id'     => auth()->user()->branch_id,
                'date'          => $adjustment->date,
                'created_by'    => auth()->id(),
                'updated_by'    => auth()->id(),
            ]);

            // ======================
            // APPLY STOK BARU
            // ======================
            if ($qty['plus'] > 0) {
                $product->increment('stock', $qty['plus']);
            }

            if ($qty['min'] > 0) {
                $product->decrement('stock', $qty['min']);
            }

            // ======================
            // PAYMENT BARU
            // ======================
            if ($qty['plus'] > 0) {
                $Debitnya = 'NR-DB Persediaan' ;
                if ($adjustment->flag === 'production') {
                    $Kreditnya = 'NR-DB WIP Berkembang' ;
                } elseif ($adjustment->flag === 'tf_in') {
                    $Kreditnya = 'NR-DB Akum. Stok Transfer In' ;
                } else {
                    $Kreditnya = 'NR-DB Stok Plus' ;
                }
            } else {
                if ($adjustment->flag === 'production') {
                    $Debitnya = 'NR-DB WIP Menyusut' ;
                } elseif ($adjustment->flag === 'tf_out') {
                    $Debitnya = 'NR-DB Akum. Stok Transfer Out' ;
                } else {
                    $Debitnya = 'NR-DB Stok Minus' ;
                }                
                $Kreditnya = 'NR-DB Persediaan' ;
            }
            

            $payment = $adjustment->payments()->create([
                'mutation_type' => $this->resolveMutationType(
                    $adjustment->flag,
                    $qty['plus'],
                    $qty['min']
                ),
                'currency'    => 'IDR',
                'debit_akun'  => $Debitnya,
                'kredit_akun' => $Kreditnya,
                'nominal'     => ($qty['plus'] + $qty['min']) * $cost,
                'branch_id'   => $adjustment->branch_id,
                'created_by'  => auth()->id(),
                'updated_by'  => auth()->id(),
                'date'        => $adjustment->date,
            ]);

            $this->applyPaymentMutation($payment);
        }

        // RESOLVE STATUS TRANSFER (TF IN / TF OUT)
        if (in_array($adjustment->flag, ['tf_in', 'tf_out'])) {

            // reload items baru
            $adjustment->load('items');

            $status = $this->resolveTransferStatus($adjustment);

            // update adjustment ini
            $adjustment->update([
                'status' => $status,
                'updated_by' => auth()->id(),
            ]);

            $adjustment->items()->update([
                'status' => $status,
                'updated_by' => auth()->id(),
            ]);

            // update pasangan (pengirim / penerima)
            $pair = AdjustmentStock::where('transfer_token', $adjustment->transfer_token)
                ->where('id', '!=', $adjustment->id)
                ->first();

            if ($pair) {
                $pair->update([
                    'status' => $status,
                    'updated_by' => auth()->id(),
                ]);

                $pair->items()->update([
                    'status' => $status,
                    'updated_by' => auth()->id(),
                ]);
            }
        }



        
    });

    return redirect()
        ->route('penyesuaian-stok.index')
        ->with('success', 'Adjustment berhasil diperbarui');

}


/* =====================================================
* DESTROY
* ===================================================== */
public function destroy(AdjustmentStock $adjustmentStock)
{
    DB::transaction(function () use ($adjustmentStock) {

        foreach ($adjustmentStock->items as $item) {
            $product = Product::lockForUpdate()->find($item->product_id);

            if ($product) {
                $product->decrement('stock', $item->quantity_plus);
                $product->increment('stock', $item->quantity_mins);
            }

            $item->update(['deleted_by' => Auth::id()]);
            $item->delete();
        }

        foreach ($adjustmentStock->payments as $payment) {
            $this->rollbackPaymentMutation($payment);
            $payment->update(['deleted_by' => Auth::id()]);
            $payment->delete();
        }

        $adjustmentStock->update(['deleted_by' => Auth::id()]);
        $adjustmentStock->delete();
    });

    return redirect()
        ->route('penyesuaian-stok.index')
        ->with('success', 'Transaksi berhasil dihapus');
}


/* =====================================================
* UPDATE STATUS
* ===================================================== */
public function editInfo(Request $request, AdjustmentStock $adjustment)
{
    $request->validate([
        'status' => 'required|in:new,done,canceled',
    ]);

    $adjustment->update([
        'status' => $request->status,
        'updated_by' => Auth::id(),
    ]);

    $adjustment->items()->update([
        'status'   => $adjustment->status,
        'updated_by' => Auth::id(),
    ]);

    return back()->with('success', 'Info Transaksi berhasil diperbarui.');
}    



/* =====================================================
* HELPER
* ===================================================== */
private function resolveQuantity(string $flag, array $item): array
{
    return match ($flag) {

        // ==========================
        // STOK OPNAME
        // ==========================
        'opname' => (function () use ($item) {
            $qtySystem = (float) ($item['qty_system'] ?? 0);
            $qtyReal   = (float) ($item['qty_real'] ?? 0);
            $diff      = $qtyReal - $qtySystem;

            return [
                'plus' => $diff > 0 ? abs($diff) : 0,
                'min'  => $diff < 0 ? abs($diff) : 0,
            ];
        })(),

        // ==========================
        // PRODUCTION (BEBAS +/-)
        // qty: + tambah, - kurang
        // ==========================
        'production' => (function () use ($item) {
            if (! isset($item['qty'])) {
                abort(422, 'Qty wajib diisi untuk Production');
            }

            $qty = (float) $item['qty'];

            return [
                'plus' => $qty > 0 ? abs($qty) : 0,
                'min'  => $qty < 0 ? abs($qty) : 0,
            ];
        })(),

        // ==========================
        // TRANSFER IN (SELALU +)
        // ==========================
        'tf_in' => (function () use ($item) {
            if (! isset($item['qty'])) {
                abort(422, 'Qty wajib diisi untuk Transfer In');
            }

            return [
                'plus' => abs((float) $item['qty']),
                'min'  => 0,
            ];
        })(),

        // ==========================
        // TRANSFER OUT (SELALU -)
        // ==========================
        'tf_out' => (function () use ($item) {
            if (! isset($item['qty'])) {
                abort(422, 'Qty wajib diisi untuk Transfer Out');
            }

            return [
                'plus' => 0,
                'min'  => abs((float) $item['qty']),
            ];
        })(),

        default => abort(400, 'Flag tidak valid'),
    };
}

private function resolveTransferStatus(AdjustmentStock $adjustment): string
{
    if (!in_array($adjustment->flag, ['tf_in', 'tf_out'])) {
        return $adjustment->status;
    }

    if (!$adjustment->transfer_token) {
        return 'new';
    }

    $pair = AdjustmentStock::where('transfer_token', $adjustment->transfer_token)
        ->where('id', '!=', $adjustment->id)
        ->with('items.product')
        ->first();

    if (!$pair) {
        return 'new';
    }

    // =========================================
    // GROUP QTY BY SKU (ABS VALUE)
    // =========================================
    $current = $adjustment->items
        ->groupBy(fn ($i) => $i->product?->sku)
        ->map(fn ($items) =>
            $items->sum(fn ($i) => abs($i->quantity_plus) + abs($i->quantity_mins))
        );

    $paired = $pair->items
        ->groupBy(fn ($i) => $i->product?->sku)
        ->map(fn ($items) =>
            $items->sum(fn ($i) => abs($i->quantity_plus) + abs($i->quantity_mins))
        );

    // =========================================
    // SKU & QTY MUST MATCH EXACTLY
    // =========================================
    if ($current->count() !== $paired->count()) {
        return 'new';
    }

    foreach ($current as $sku => $qty) {
        if (!$sku || !isset($paired[$sku])) {
            return 'new';
        }

        if ((int)$paired[$sku] !== (int)$qty) {
            return 'new';
        }
    }

    return 'done';
}




private function resolveMutationType(string $flag, int $plus, int $min): string
{
    return match ($flag) {
        'opname'     => $plus > 0
            ? 'Stok Bertambah-Ketemu'
            : 'Stok Hilang-Rusak-Basi',

        'production' => 'Production Adjustment',
        'tf_in'      => 'Stok Transfer Masuk',
        'tf_out'     => 'Stok Transfer Keluar',

        default      => 'Adjustment',
    };
}



    /* =====================================================
     * ACCOUNT MUTATION
     * ===================================================== */
    private function applyPaymentMutation(Payment $payment)
    {
        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->debit_akun,
            $payment->nominal,
            'debit'
        );

        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->kredit_akun,
            $payment->nominal,
            'credit'
        );
    }

    private function rollbackPaymentMutation(Payment $payment)
    {
        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->debit_akun,
            $payment->nominal,
            'credit'
        );

        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->kredit_akun,
            $payment->nominal,
            'debit'
        );
    }

    private function mutateAccountBalance(
        int $branchId,
        string $akun,
        float $amount,
        string $type
    ) {
        $account = AccountBalance::where('branch_id', $branchId)
            ->where('akun', $akun)
            ->lockForUpdate()
            ->first();

        if (! $account) {
            $account = AccountBalance::create([
                'branch_id' => $branchId,
                'akun'      => $akun,
                'balance'   => 0,
            ]);
        }

        $type === 'debit'
            ? $account->increment('balance', $amount)
            : $account->decrement('balance', $amount);
    }




    public function print(AdjustmentStock $adjustmentStock)
    {
        // Pastikan relasi dimuat sesuai kebutuhan
        $adjustmentStock->load(['userCre', 'items.product']);
        // dd($adjustmentStock->toArray());
        return Inertia::render('PenyesuaianStok/Print', [
            'adjustmentStock' => $adjustmentStock,
        ])->withViewData(['layout' => false]);
    }     
    public function printSuratJalan(AdjustmentStock $adjustmentStock)
    {
        // Pastikan relasi dimuat sesuai kebutuhan
        $adjustmentStock->load(['userCre', 'items.product']);
        // dd($adjustmentStock->toArray());
        return Inertia::render('PenyesuaianStok/PackingSlip', [
            'adjustmentStock' => $adjustmentStock,
        ])->withViewData(['layout' => false]);
    }     
    


}
