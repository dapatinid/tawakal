<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Picqer\Barcode\BarcodeGeneratorSVG;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class PembelianController extends Controller
{
    // Tampilkan form
    public function create()
    {
        return inertia('Pembelian/Create', [
            'defaultDate' => now()->format('Y-m-d\TH:i'),
            'users' => User::whereNotIn('id', [1])->where('class', 'like', "%supplier%")->get(),
        ]);
    }

    // Simpan Pembelian baru
public function store(Request $request)
{
    $data = $request->validate([
        'date'       => 'required|date',
        'type'       => 'required|in:dine_in,self_pickup,delivery',
        'notes'      => 'nullable|string',
        'user_id'    => 'required|exists:users,id',
        'user_alias' => 'nullable|string|max:255',
    ]);

    $purchaseOrder = DB::transaction(function () use ($data) {

        // Hitung nomor antrian (Q) per cabang & tanggal
        $queue = PurchaseOrder::where('branch_id', Auth::user()->branch_id)
            ->whereBetween('date', [
                Carbon::parse($data['date'])->startOfDay(),
                Carbon::parse($data['date'])->endOfDay(),
            ])
            // ->lockForUpdate()
            ->max('q');

        $queue = ($queue ?? 0) + 1;

        // Buat Pembelian
        $purchaseOrder = PurchaseOrder::create([
            'q' => $queue,
            'status' => 'new',
            'notes' => $data['notes'] ?? null,
            'user_id' => $data['user_id'],
            'user_alias' => $data['user_alias'] ?? null,
            'branch_id' => Auth::user()->branch_id,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'type' => $data['type'],
            'date' => Carbon::parse($data['date'])->toDateTimeString(),
            'sub_total' => 0,
            'discount' => 0,
            'charge' => 0,
            'tax' => 0,
            'grand_total' => 0,
            'paid_amount' => 0,
            'change_amount' => 0,
        ]);

        // Refresh & buat code transaksi
        $purchaseOrder->refresh();
        $createdAt = $purchaseOrder->created_at->format('YmdHis');
        $purchaseOrder->update([
            'code' => 'POD'.$createdAt.'#'.Auth::user()->branch_id.'-'.Auth::user()->id,
        ]);

        // --- Buat jejak payment sesuai Checkout POP ---
        // 1. Stok Terbeli
        $stokPayment = $purchaseOrder->payments()->create([
            'mutation_type' => 'Stok Terbeli',
            'currency' => 'IDR',
            'debit_akun' => 'NR-DB Persediaan',
            'kredit_akun' => 'LR-KR Stok Terbeli',
            'nominal' => $purchaseOrder->sub_total,
            'user_id' => $purchaseOrder->user_id,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'branch_id' => Auth::user()->branch_id,
            'date' => $purchaseOrder->date,
        ]);
        $this->applyPaymentMutation($stokPayment);

        // 2. Hutang Pembelian
        $piutangPayment = $purchaseOrder->payments()->create([
            'mutation_type' => 'Hutang Pembelian',
            'currency' => 'IDR',
            'debit_akun' => 'LR-DB Pembelian Persediaan',
            'kredit_akun' => 'NR-KR Hutang Pembelian',
            'nominal' => $purchaseOrder->grand_total,
            'user_id' => $purchaseOrder->user_id,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'branch_id' => Auth::user()->branch_id,
            'date' => $purchaseOrder->date,
        ]);
        $this->applyPaymentMutation($piutangPayment);

        // 3. Pembelian (Cash)
        $cashPayment = $purchaseOrder->payments()->create([
            'mutation_type' => 'Pembelian',
            'currency' => 'IDR',
            'payment_method' => 'cash',
            'debit_akun' => 'NR-KR Hutang Pembelian',
            'kredit_akun' => $this->resolveAkunCashBank('cash'),
            'nominal_mins' => $purchaseOrder->paid_amount,
            'nominal_plus' => $purchaseOrder->change_amount > 0 ? $purchaseOrder->change_amount : 0,
            'nominal' => $purchaseOrder->paid_amount > 0
                ? ($purchaseOrder->paid_amount - max($purchaseOrder->change_amount, 0))
                : 0,
            'user_id' => $purchaseOrder->user_id,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'branch_id' => Auth::user()->branch_id,
            'date' => $purchaseOrder->date,
        ]);
        $this->applyPaymentMutation($cashPayment);

        return $purchaseOrder;
    });

    return redirect()
        ->route('pembelian.show', $purchaseOrder)
        ->with('success', 'Transaksi baru berhasil dibuat');
}

public function destroy(PurchaseOrder $purchaseOrder)
{
    // Safety: pastikan order milik cabang aktif
    if ($purchaseOrder->branch_id !== Auth::user()->branch_id) {
        abort(403);
    }

            if (Auth::user()->level == null) {
                return back()->with('error', 'Anda tidak berhak menghapus');
            }    

    DB::transaction(function () use ($purchaseOrder) {

        if ($purchaseOrder->change_amount > 0) {
        $kembalianIni = $purchaseOrder->payments()->where('mutation_type', 'Kembalian')->get()->sortBy('date')->last()->debit_akun;
        $this->mutateAccountBalance(
            $purchaseOrder->branch_id,
            $kembalianIni,
            $purchaseOrder->change_amount,
            'debit'
            );
        $this->mutateAccountBalance(
            $purchaseOrder->branch_id,
            'NR-KR Hutang Pembelian',
            $purchaseOrder->change_amount,
            'credit'
            );
        }     

        /**
         * ============================
         * 1️⃣ ROLLBACK PAYMENT
         * ============================
         */
        $payments = $purchaseOrder->payments()
            ->lockForUpdate()
            ->get();

        foreach ($payments as $payment) {
            $this->rollbackPaymentMutation($payment);

            $payment->update(['deleted_by' => Auth::id()]);
            $payment->delete();
        }

        /**
         * ============================
         * 2️⃣ ROLLBACK ITEM & PRODUCT
         * ============================
         */

        // Ambil semua item
        $items = $purchaseOrder->items()->get();

        // Kumpulkan product_id unik & urutkan (ANTI DEADLOCK)
        $productIds = $items->pluck('product_id')
            ->unique()
            ->sort()
            ->values();

        // Lock semua product sekaligus
        $products = Product::whereIn('id', $productIds)
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($items as $item) {

            // catat retur
            $purchaseOrder->returns()->create([
                'branch_id' => $purchaseOrder->branch_id,
                'date' => now(),
                'notes' => 'dihapus',
                'product_id' => $item->product->id,
                'name' => $item->name,
                'cost' => $item->cost,
                'quantity_plus' => $item->quantity_plus,
                'price' => $item->price,
                'quantity_mins' => $item->quantity_mins, 
                'totalcost' => $item->totalcost,        
                'totalweight' => $item->totalweight,        
                'status' => 'return',        
                'user_id' => $item->user_id,
                'created_by' => Auth::user()->id,
                'updated_by' => Auth::user()->id,
            ]);

            $product = $products->get($item->product_id);

            if (! $product) {
                continue;
            }

            $qty  = $item->quantity_plus;
            $cost = $item->cost;

            /**
             * =========================
             * 1️⃣ HITUNG NILAI SEBELUM
             * =========================
             */
            $nilaiSebelum = $product->cost;            

            /**
             * -------------------------
             * ROLLBACK STOCK
             * -------------------------
             */
            $product->decrement('stock', $qty);

            /**
             * -------------------------
             * ROLLBACK AVERAGE COST
             * -------------------------
             */
            if ($product->stock > 0) {

                // total sebelum rollback
                $totalSebelum = $product->cost * ($product->stock + $qty);

                // keluarkan nilai item
                $totalSesudah = $totalSebelum - ($cost * $qty);

                $product->update([
                    'cost' => round($totalSesudah / $product->stock, 0),
                ]);

                $nilaiSesudah = round($totalSesudah / $product->stock, 0);
            } else {

                $nilaiSesudah = $nilaiSebelum;
                $qty = 0;
            }

            /**
             * =========================
             * 4️⃣ HITUNG DELTA NILAI
             * =========================
             */
            $deltaRollback = ($nilaiSebelum - $nilaiSesudah) * ($product->stock + $qty);

            /**
             * =========================
             * 5️⃣ JURNAL ROLLBACK COST
             * =========================
             */
            if ($deltaRollback != 0) {

                if ($deltaRollback > 0) {
                    // Persediaan naik (rollback cost turun sebelumnya)
                    $product->payments()->create([
                        'branch_id'     => $purchaseOrder->branch_id,
                        'date'          => $purchaseOrder->date,
                        'mutation_type' => 'Perubahan Harga Dasar',
                        'notes'        => $product->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.($product->stock + $qty). ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Hapus] qty: ' . $qty . ' x Rp ' . ($deltaRollback / $qty *-1) . ' = ' . ($deltaRollback *-1),
                        'debit_akun'    => 'LR-DB Harga Dasar Naik (dibatalkan)',
                        'kredit_akun'   => 'NR-DB Persediaan',
                        'nominal'       => 0,
                        'created_by'    => Auth::id(),
                    ]);

                } else {
                    // Persediaan turun
                    $product->payments()->create([
                        'branch_id'     => $purchaseOrder->branch_id,
                        'date'          => $purchaseOrder->date,
                        'mutation_type' => 'Perubahan Harga Dasar',
                        'notes'        => $product->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.($product->stock + $qty). ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Hapus] qty: ' . $qty . ' x Rp ' . ($deltaRollback / $qty *-1) . ' = ' . ($deltaRollback *-1),
                        'debit_akun'    => 'NR-DB Persediaan',
                        'kredit_akun'   => 'LR-KR Harga Dasar Turun (dibatalkan)',
                        'nominal'       => 0,
                        'created_by'    => Auth::id(),
                    ]);
                }
            }

            /**
             * -------------------------
             * DELETE ITEM
             * -------------------------
             */
            $item->update(['deleted_by' => Auth::id()]);
            $item->delete();
        }

        /**
         * ============================
         * 3️⃣ DELETE ORDER INDUK
         * ============================
         */
        $purchaseOrder->update([
            'updated_by' => Auth::id(),
        ]);

        $purchaseOrder->delete();
    });

    return back()->with(
        'success',
        'Data berhasil dihapus & seluruh transaksi di-rollback'
    );
}


public function index(Request $request)
    {
        $paymentStatus = $request->get('payment_status', 'all');
        $purchaseOrderStatus   = $request->get('order_status');
        $search        = $request->get('search', '');
                
        $startDate = $request->get('start_date')
            ?? Carbon::parse('2026-01-01 00:00:00')->toDateString();

        $endDate = $request->get('end_date')
            ?? Carbon::today()->addDays(7)->toDateString();

        // ===============================
        // BASE QUERY (SATU SUMBER KEBENARAN)
        // ===============================
        $baseQuery = PurchaseOrder::query()->whereBranchId(Auth::user()->branch_id)
            ->with(['items', 'user'])

            ->when($startDate, function ($q) use ($startDate) {
                $q->whereDate('date', '>=', $startDate);
            })
            ->when($endDate, function ($q) use ($endDate) {
                $q->whereDate('date', '<=', $endDate);
            })

            ->when($paymentStatus === 'paid', fn ($q) =>
                $q->whereColumn('paid_amount', '>=', 'grand_total')
            )
            ->when($paymentStatus === 'unpaid', fn ($q) =>
                $q->whereColumn('paid_amount', '<', 'grand_total')
            )
            ->when(
                $purchaseOrderStatus,
                fn ($q) => $q->where('status', $purchaseOrderStatus),
                fn ($q) => $q->where('status', '!=', 'canceled')
            )
            ->when($search, function ($q) use ($search) {
                // Normalisasi search ke huruf kecil
                $searchTerm = strtolower($search);

                $q->where(function ($x) use ($searchTerm) {
                    // Search Code (Case-Insensitive)
                    $x->whereRaw('LOWER(code) like ?', ["%{$searchTerm}%"])
                    
                    // Search Nama Supplier/User melalui Relasi
                    ->orWhereHas('user', fn ($u) =>
                        $u->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
                    )
                    
                    // Search User Alias & Notes
                    ->orWhereRaw('LOWER(user_alias) like ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(notes) like ?', ["%{$searchTerm}%"]);
                    
                    // Opsional: Jika ingin search ID Purchase Order juga
                    if (is_numeric($searchTerm)) {
                        $x->orWhere('id', $searchTerm);
                    }
                });
            });

        // ===============================
        // SUMMARY (TIDAK TERPENGARUH PAGINATION)
        // ===============================
        $summary = (clone $baseQuery)
            ->selectRaw('
                COUNT(*) as total_order,
                SUM(grand_total) as total_grand,
                SUM(paid_amount) - SUM(GREATEST(paid_amount - grand_total, 0)) as total_paid,
                SUM(GREATEST(grand_total - paid_amount, 0)) as total_unpaid
            ')
            ->first();

        // ===============================
        // PAGINATED DATA
        // ===============================
        $purchaseOrders = (clone $baseQuery)
            ->latest()
            ->paginate(60)
            ->withQueryString();

        $orderUnpaid = PurchaseOrder::whereBranchId(Auth::user()->branch_id)
            ->where('change_amount', '<', 0)
            ->count();

        return inertia('Pembelian/Index', [
            'orders'  => $purchaseOrders,
            'orderUnpaid' => $orderUnpaid,
            'summary' => $summary,
            'filters' => [
                'payment_status' => $paymentStatus,
                'order_status'   => $purchaseOrderStatus,
                'search'         => $search, // Tetap kirim original search ke frontend untuk isi input
                'start_date'     => $startDate,
                'end_date'       => $endDate,
            ],
        ]);
    }



    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load([
            'user',
            'userCre',
            'userUpd',
            'items.product',
            'payments' => fn($q) => $q
                ->where('mutation_type', 'Pembelian')
                ->orderBy('date', 'asc'),
        ]);
        $products = Product::select('id','name','cost','stock')->whereBranchId(Auth::user()->branch_id)->where('is_active', true)->orderBy('name')->get();
        return Inertia::render('Pembelian/Show', [
            'order' => $purchaseOrder,
            'products' => $products,
        ]);
    }

    public function editInfo(Request $request, PurchaseOrder $purchaseOrder)
    {
        $request->validate([
            'date'   => 'required|date',
            'status' => 'required|in:new,processing,shipped,delivered,canceled',
            'type' => 'required|in:dine_in,self_pickup,delivery',
        ]);

        $purchaseOrder->update([
            'date'   => $request->date,
            'status' => $request->status,
            'type' => $request->type,
            'notes' => $request->notes ?? '',
            'updated_by' => Auth::id(),
        ]);

        $purchaseOrder->items()->update([
            'date'   => $purchaseOrder->date,
            'status'   => $purchaseOrder->status,
            'updated_by' => Auth::id(),
        ]);

        return back()->with('success', 'Info Transaksi berhasil diperbarui.');
    }

public function storeItem(Request $request, PurchaseOrder $purchaseOrder)
{
    $data = $request->validate([
        'product_id'    => 'required|exists:products,id',
        'cost'          => 'required|numeric|min:0',
        'quantity_plus' => 'required|numeric|min:1',
    ]);

    DB::transaction(function () use ($data, $purchaseOrder) {

        $branchId = $purchaseOrder->branch_id;

        $product = Product::where('id', $data['product_id'])
            ->lockForUpdate()
            ->firstOrFail();

        /**
         * =========================
         * NILAI SEBELUM
         * =========================
         */
        $nilaiSebelum = $product->cost;

        /**
         * =========================
         * HITUNG AVERAGE COST BARU
         * =========================
         */
        $stockLama = $product->stock;
        $totalLama = $product->cost * $stockLama;

        $totalBaru = $data['cost'] * $data['quantity_plus'];
        $stockBaru = $stockLama + $data['quantity_plus'];

        $costBaru = $stockBaru > 0
            ? ($totalLama + $totalBaru) / $stockBaru
            : $data['cost'];

        /**
         * =========================
         * UPDATE PRODUCT
         * =========================
         */
        $product->update([
            'cost'  => round($costBaru, 0),
            'stock' => $stockBaru,
        ]);

        /**
         * =========================
         * NILAI SESUDAH
         * =========================
         */
        $nilaiSesudah = round($costBaru, 0);
        $delta = ($nilaiSesudah - $nilaiSebelum) * $stockBaru;

        /**
         * =========================
         * JURNAL PERUBAHAN HARGA DASAR
         * =========================
         */
        if ($delta != 0) {

            if ($delta > 0) {
                // Harga dasar naik
                $product->payments()->create([
                    'branch_id'    => $branchId,
                    'date'         => $purchaseOrder->date,
                    'mutation_type'=> 'Perubahan Harga Dasar',
                    'notes'        => $product->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.$stockBaru. ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian] qty: ' . $data['quantity_plus'] . ' x Rp ' . (abs($delta) / $data['quantity_plus']) . ' = ' . abs($delta),
                    'debit_akun'   => 'NR-DB Persediaan',
                    'kredit_akun'  => 'LR-KR Harga Dasar Naik',
                    'nominal'      => 0,
                    'created_by'   => Auth::id(),
                ]);                

            } else {
                // Harga dasar turun
                $product->payments()->create([
                    'branch_id'    => $branchId,
                    'date'         => $purchaseOrder->date,
                    'mutation_type'=> 'Perubahan Harga Dasar',
                    'notes'        => $product->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.$stockBaru. ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian] qty: ' . $data['quantity_plus'] . ' x Rp ' . (abs($delta) / $data['quantity_plus']) . ' = ' . abs($delta),
                    'debit_akun'   => 'LR-DB Harga Dasar Turun',
                    'kredit_akun'  => 'NR-DB Persediaan',
                    'nominal'      => 0,
                    'created_by'   => Auth::id(),
                ]);
            }
        }

        /**
         * =========================
         * SIMPAN ITEM PO
         * =========================
         */
        $purchaseOrder->items()->create([
            'product_id'     => $product->id,
            'name'           => $product->name,
            'cost'           => $data['cost'],
            'quantity_plus'  => $data['quantity_plus'],
            'subtotal'       => $data['cost'] * $data['quantity_plus'],
            'totalcost'      => $data['cost'] * $data['quantity_plus'],
            'totalweight'    => $product->weight * $data['quantity_plus'],
            'user_id'        => $purchaseOrder->user_id,
            'created_by'     => Auth::id(),
            'branch_id'      => $branchId,
            'date'           => $purchaseOrder->date,
            'status'         => $purchaseOrder->status,
        ]);

        $this->recalculate($purchaseOrder);
    });

    return back()->with('success', 'Item berhasil ditambahkan');
}


public function updateItem(Request $request, OrderItem $item)
{
    $data = $request->validate([
        'product_id'    => 'required|exists:products,id',
        'cost'          => 'required|numeric|min:0',
        'quantity_plus' => 'required|numeric|min:0',
    ]);

    DB::transaction(function () use ($data, $item) {

        $purchaseOrder     = $item->itemable;

        $oldProductId = $item->product_id;
        $newProductId = (int) $data['product_id'];

        $oldQty  = (int) $item->quantity_plus;
        $oldQtyReturn  = (int) $item->quantity_plus;
        $oldCost = (float) $item->cost;

        $newQty  = (int) $data['quantity_plus'];
        $newQtyReturn  = (int) $data['quantity_plus'];
        $newCost = (float) $data['cost'];

        /**
         * LOCK PRODUCT (ANTI DEADLOCK)
         */
        $productIds = collect([$oldProductId, $newProductId])
            ->unique()
            ->sort()
            ->values();

        $products = Product::whereIn('id', $productIds)
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        $oldProduct = $products->get($oldProductId);
        $newProduct = $products->get($newProductId);

        $branchId = $item->branch_id ?? $item->itemable->branch_id;
        $date     = $item->itemable->date ?? now();

        /**
         * =====================================================
         * 1️⃣ ROLLBACK ITEM LAMA (STOK + COST + JURNAL)
         * =====================================================
         */
        $nilaiSebelum = $oldProduct->cost;

        // rollback stok
        $oldProduct->decrement('stock', $oldQty);

        // rollback average cost
        if ($oldProduct->stock > 0) {
            $totalBaru = ($oldProduct->cost * ($oldProduct->stock + $oldQty))
                       - ($oldCost * $oldQty);

            $oldProduct->update([
                'cost' => round($totalBaru / $oldProduct->stock, 0),
            ]);

            $nilaiSesudah = round($totalBaru / $oldProduct->stock, 0);
        } else {

            $nilaiSesudah = $nilaiSebelum;
            $oldQty = 0;
        }

        $deltaRollback = ($nilaiSebelum - $nilaiSesudah) * ($oldProduct->stock + $oldQty);

        // jurnal rollback cost
        if ($deltaRollback != 0) {

            if ($deltaRollback > 0) {
                // persediaan naik (rollback cost turun sebelumnya)
                $oldProduct->payments()->create([
                    'branch_id'     => $branchId,
                    'date'          => $date,
                    'mutation_type' => 'Perubahan Harga Dasar',
                    'notes'        => $oldProduct->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.($oldProduct->stock + $oldQty). ' x ' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Rollback] qty: ' . $oldQty . ' x ' . ($deltaRollback / $oldQty *-1) . ' = ' . $deltaRollback*-1,
                    'debit_akun'    => 'LR-DB Harga Dasar Naik (dibatalkan)',
                    'kredit_akun'   => 'NR-DB Persediaan',
                    'nominal'       => 0,
                    'created_by'    => Auth::id(),
                ]);

            } else {
                // persediaan turun
                $oldProduct->payments()->create([
                    'branch_id'     => $branchId,
                    'date'          => $date,
                    'mutation_type' => 'Perubahan Harga Dasar',
                    'notes'        => $oldProduct->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.($oldProduct->stock + $oldQty). ' x ' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Rollback] qty: ' . $oldQty . ' x ' . ($deltaRollback / $oldQty *-1) . ' = ' . $deltaRollback*-1,
                    'debit_akun'    => 'NR-DB Persediaan',
                    'kredit_akun'   => 'LR-KR Harga Dasar Turun (dibatalkan)',
                    'nominal'       => 0,
                    'created_by'    => Auth::id(),
                ]);

            }
        }

        /**
         * =====================================================
         * 2️⃣ APPLY ITEM BARU (STOK + COST + JURNAL)
         * =====================================================
         */
        $nilaiSebelum = $newProduct->cost;

        $stockLama = $newProduct->stock;
        $totalLama = $newProduct->cost * $stockLama;
        $totalBaru = $newCost * $newQty;

        $stockBaru = $stockLama + $newQty;

        $costBaru = $stockBaru > 0
            ? ($totalLama + $totalBaru) / $stockBaru
            : $newCost;

        $newProduct->update([
            'cost' => round($costBaru, 0),
        ]);

        $newProduct->increment('stock', $newQty);

        $nilaiSesudah = round($costBaru, 0);
        $deltaApply = ($nilaiSesudah - $nilaiSebelum) * $stockBaru;

        if ($deltaApply != 0) {

            if ($deltaApply > 0) {
                $newProduct->payments()->create([
                    'branch_id'     => $branchId,
                    'date'          => $date,
                    'mutation_type' => 'Perubahan Harga Dasar',
                    'notes'        => $newProduct->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.$stockBaru. ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Update] qty: ' . $data['quantity_plus'] . ' x Rp ' . (abs($deltaApply) / $data['quantity_plus']) . ' = ' . abs($deltaApply),
                    'debit_akun'    => 'NR-DB Persediaan',
                    'kredit_akun'   => 'LR-KR Harga Dasar Naik',
                    'nominal'       => 0,
                    'created_by'    => Auth::id(),
                ]);
            } else {
                $newProduct->payments()->create([
                    'branch_id'     => $branchId,
                    'date'          => $date,
                    'mutation_type' => 'Perubahan Harga Dasar',
                    'notes'        => $newProduct->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.$stockBaru. ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Update] qty: ' . $data['quantity_plus'] . ' x Rp ' . (abs($deltaApply) / $data['quantity_plus']) . ' = ' . abs($deltaApply),
                    'debit_akun'    => 'LR-DB Harga Dasar Turun',
                    'kredit_akun'   => 'NR-DB Persediaan',
                    'nominal'       => 0,
                    'created_by'    => Auth::id(),
                ]);
            }
        }

        
        // catat retur
        if ($oldProductId == $newProductId) {
                $returnQty = $oldQtyReturn - $newQtyReturn;
                $purchaseOrder->returns()->create([
                    'branch_id' => $purchaseOrder->branch_id,
                    'date' => now(),
                    'notes' => 'diubah (item sama)',
                    'product_id' => $oldProduct->id,
                    'name' => $oldProduct->name,
                    'cost' => $oldProduct->cost,
                    'quantity_plus' => $returnQty,       
                    'price' => $oldProduct->price,
                    'quantity_mins' => 0,
                    'totalcost' => $returnQty * $oldProduct->cost,        
                    'totalweight' => $returnQty * $oldProduct->weight,         
                    'status' => 'return',        
                    'user_id' => $item->user_id,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                ]);  
        } else {
                // catat retur
                $purchaseOrder->returns()->create([
                    'branch_id' => $purchaseOrder->branch_id,
                    'date' => now(),
                    'notes' => 'diubah (item beda)',
                    'product_id' => $oldProduct->id,
                    'name' => $oldProduct->name,
                    'cost' => $oldProduct->cost,
                    'quantity_plus' => $item->quantity_plus,      
                    'price' => $oldProduct->price,
                    'quantity_mins' => 0,
                    'totalcost' => $oldProduct->cost * $item->quantity_plus,        
                    'totalweight' => $oldProduct->weight * $item->quantity_plus,         
                    'status' => 'return',        
                    'user_id' => $item->user_id,
                    'created_by' => Auth::user()->id,
                    'updated_by' => Auth::user()->id,
                ]); 
        }
        

        /**
         * =====================================================
         * 3️⃣ UPDATE ITEM
         * =====================================================
         */
        $item->update([
            'product_id'    => $newProductId,
            'name'          => $newProduct->name,
            'cost'          => $newCost,
            'quantity_plus' => $newQty,
            'subtotal'      => $newCost * $newQty,
            'totalcost'     => $newCost * $newQty,
            'totalweight'   => $newProduct->weight * $newQty,
            'updated_by'    => Auth::id(),
        ]);

        $purchaseOrder = $item->itemable()->first();
        $this->recalculate($purchaseOrder);
    });

    return back()->with('success', 'Item berhasil diupdate');
}


public function destroyItem(OrderItem $item)
{
    $purchaseOrder = $item->itemable;

    if (Auth::user()->level == null) {
        return back()->with('error', 'Anda tidak berhak menghapus');
    }

    if (! $purchaseOrder) {
        return back()->with('error', 'Data tidak ditemukan');
    }

    // Minimal harus tersisa 1 item
    if ($purchaseOrder->items()->count() <= 1) {
        return back()->with('error', 'Minimal harus ada satu item');
    }

    DB::transaction(function () use ($item, $purchaseOrder) {

        /**
         * 🔒 LOCK PRODUCT
         */
        $product = Product::where('id', $item->product_id)
            ->lockForUpdate()
            ->firstOrFail();

        $qty  = (int) $item->quantity_plus;
        $cost = (float) $item->cost;

        $branchId = $purchaseOrder->branch_id;
        $date     = $purchaseOrder->date ?? now();

        /**
         * =========================
         * 1️⃣ HITUNG NILAI SEBELUM
         * =========================
         */
        $nilaiSebelum = $product->cost;

        /**
         * =========================
         * 2️⃣ ROLLBACK STOCK
         * =========================
         */
        $product->decrement('stock', $qty);

        /**
         * =========================
         * 3️⃣ ROLLBACK AVERAGE COST
         * =========================
         */
        if ($product->stock > 0) {
            $totalSesudah = ($product->cost * ($product->stock + $qty))
                          - ($cost * $qty);

            $product->update([
                'cost' => round($totalSesudah / $product->stock, 0),
            ]);

            $nilaiSesudah = round($totalSesudah / $product->stock, 0);

        } else {

            $nilaiSesudah = $nilaiSebelum;
            $qty = 0;
        }

        /**
         * =========================
         * 4️⃣ HITUNG DELTA NILAI
         * =========================
         */
        $delta = ($nilaiSebelum - $nilaiSesudah) * ($product->stock + $qty);

        /**
         * =========================
         * 5️⃣ JURNAL ROLLBACK COST
         * =========================
         */
        if ($delta != 0) {

            if ($delta > 0) {
                // Persediaan naik (rollback cost turun sebelumnya)
                $product->payments()->create([
                    'branch_id'     => $branchId,
                    'date'          => $date,
                    'mutation_type' => 'Perubahan Harga Dasar',
                    'notes'        => $product->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.($product->stock + $qty). ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Hapus] qty: ' . $qty . ' x Rp ' . ($delta / $qty *-1) . ' = ' . ($delta *-1),
                    'debit_akun'    => 'LR-DB Harga Dasar Naik (dibatalkan)',
                    'kredit_akun'   => 'NR-DB Persediaan',
                    'nominal'       => 0,
                    'created_by'    => Auth::id(),
                ]);

            } else {
                // Persediaan turun
                $product->payments()->create([
                    'branch_id'     => $branchId,
                    'date'          => $date,
                    'mutation_type' => 'Perubahan Harga Dasar',
                    'notes'        => $product->name . ' (Dari: '.$nilaiSebelum.' Ke: '.$nilaiSesudah.') qty: '.($product->stock + $qty). ' x Rp' .($nilaiSesudah - $nilaiSebelum) . ' [Pembelian Hapus] qty: ' . $qty . ' x Rp ' . ($delta / $qty *-1) . ' = ' . ($delta *-1),
                    'debit_akun'    => 'NR-DB Persediaan',
                    'kredit_akun'   => 'LR-KR Harga Dasar Turun (dibatalkan)',
                    'nominal'       => 0,
                    'created_by'    => Auth::id(),
                ]);
            }
        }

        // catat retur
        $purchaseOrder->returns()->create([
            'branch_id' => $purchaseOrder->branch_id,
            'date' => now(),
            'notes' => 'dihapus',
            'product_id' => $item->product->id,
            'name' => $item->name,
            'cost' => $item->cost,
            'quantity_plus' => $item->quantity_plus,
            'price' => $item->price,
            'quantity_mins' => $item->quantity_mins,
            'totalcost' => $item->totalcost,        
            'totalweight' => $item->totalweight,        
            'status' => 'return',        
            'user_id' => $item->user_id,
            'created_by' => Auth::user()->id,
            'updated_by' => Auth::user()->id,
        ]);        

        /**
         * =========================
         * 6️⃣ DELETE ITEM
         * =========================
         */
        $item->update([
            'deleted_by' => Auth::id(),
        ]);

        $item->delete();

        /**
         * =========================
         * 7️⃣ RECALCULATE ORDER
         * =========================
         */
        $this->recalculate($purchaseOrder);
    });

    return back()->with('success', 'Item berhasil dihapus');
}

    public function biayaLain(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Validasi nilai angka (boleh 0)
        $data = $request->validate([
            'discount' => ['required', 'numeric', 'min:0'],
            'charge'   => ['required', 'numeric', 'min:0'],
            'tax'      => ['required', 'numeric', 'min:0'],
        ]);

        // Update langsung
        $purchaseOrder->update([
            'discount' => $data['discount'],
            'charge'   => $data['charge'],
            'tax'      => $data['tax'],
            'updated_by' => Auth::id(),
        ]);

        // Jika grand_total dihitung manual, tinggal panggil helper:
        if (method_exists($purchaseOrder, 'hitungTotal')) {
            $purchaseOrder->hitungTotal(); // opsional
        }

        $this->recalculate($purchaseOrder);

        return back()->with('success', 'Biaya lain berhasil diperbarui.');
    }

    // ============================
    // CREATE PAYMENT
    // ============================
    public function storePayment(Request $request, PurchaseOrder $purchaseOrder)
    {
        $data = $request->validate([
            'payment_method' => 'required|string',
            'nominal_mins' => 'nullable|numeric',
            'date' => 'required|date',
        ]);

        DB::transaction(function () use ($data, $purchaseOrder) {

            $data['nominal'] = $data['nominal_mins'];
            $data['mutation_type'] = 'Pembelian';
            $data['user_id'] = $purchaseOrder->user_id;
            $data['branch_id'] = Auth::user()->branch_id;
            $data['created_by'] = Auth::id();
            $data['currency'] = 'IDR';
            $data['debit_akun'] = 'NR-KR Hutang Pembelian';
            $data['kredit_akun'] = $this->resolveAkunCashBank($data['payment_method']);

            $payment = $purchaseOrder->payments()->create($data);

            // 🔁 hitung dulu summary (ini set nominal FINAL)
            $this->updateOrderPaymentSummary($purchaseOrder);

            $payment->refresh();

            // 💰 apply saldo pakai nominal FINAL
            $this->applyPaymentMutation($payment);

        });

        return back()->with('success', 'Payment berhasil ditambahkan');
    }


    // ============================
    // UPDATE PAYMENT
    // ============================
    public function updatePayment(Request $request, Payment $payment)
    {

        if (! $this->canEditOrDeletePayment($payment)) {
            return back()->with('error', 'Hanya payment terakhir atau payment yang terdapat kembalian yang boleh diedit dan hapus.');
        }

        $data = $request->validate([
            'payment_method' => 'required|string',
            'nominal_mins'   => 'nullable|numeric',
            'date'           => 'required|date',
        ]);

        DB::transaction(function () use ($payment, $data) {

            // 🔒 simpan kondisi LAMA
            $oldNominal    = $payment->nominal;
            $oldDebitAkun  = $payment->debit_akun;
            $oldKreditAkun = $payment->kredit_akun;

            // ♻️ rollback saldo LAMA (PAKAI AKUN LAMA)
            $this->mutateAccountBalance(
                $payment->branch_id,
                $oldDebitAkun,
                $oldNominal,
                'credit'
            );

            $this->mutateAccountBalance(
                $payment->branch_id,
                $oldKreditAkun,
                $oldNominal,
                'debit'
            );

            // ✏️ update data payment
            $payment->update([
                'payment_method' => $data['payment_method'],
                'nominal_mins'   => $data['nominal_mins'],
                'kredit_akun'     => $this->resolveAkunCashBank($data['payment_method']),
                'date'           => $data['date'],
                'updated_by'     => Auth::id(),
            ]);

            // 🔁 HITUNG ULANG SUMMARY (SET nominal FINAL)
            $purchaseOrder = $payment->paymentable;
            $this->updateOrderPaymentSummary($purchaseOrder);

            // 🔄 refresh agar nominal FINAL kebaca
            $payment->refresh();

            // 💰 APPLY saldo BARU (PAKAI AKUN BARU)
            $this->applyPaymentMutation($payment);
        });

        return back()->with('success', 'Payment berhasil diupdate');
    }

    // ============================
    // DELETE PAYMENT
    // ============================
    public function destroyPayment(Payment $payment)
    {
        $purchaseOrder = $payment->paymentable;

            if (Auth::user()->level == null) {
                return back()->with('error', 'Anda tidak berhak menghapus');
            }        

        if (! $this->canEditOrDeletePayment($payment)) {
            return back()->with('error', 'Hanya payment terakhir atau payment yang terdapat kembalian yang boleh diedit dan hapus.');
        }

        if (! $purchaseOrder) {
            return back()->with('error', 'Transaksi tidak ditemukan');
        }

        $jumlahPembelian = $purchaseOrder->payments()
            ->where('mutation_type', 'Pembelian')
            ->count();

        if ($jumlahPembelian <= 1) {
            return back()->with('error', 'Minimal harus ada satu payment');
        }

        DB::transaction(function () use ($payment, $purchaseOrder) {

            if ($purchaseOrder->change_amount > 0) {

                $nominalRollback = $payment->where('mutation_type', 'Pembelian')
                    ->orderBy('date')
                    ->orderBy('id')
                    ->get()
                    ->last()->nominal
                ;

                // rollback debit
                $this->mutateAccountBalance(
                    $payment->branch_id,
                    $payment->kredit_akun,
                    $nominalRollback,
                    'debit'
                );

                // rollback kredit
                $this->mutateAccountBalance(
                    $payment->branch_id,
                    $payment->debit_akun,
                    $nominalRollback,
                    'credit'
                );
            } else {

                $this->rollbackPaymentMutation($payment);
            }

            // 🗑 soft delete payment
            $payment->update(['deleted_by' => Auth::id()]);
            $payment->delete();

            // 🔄 update summary
            $this->updateOrderPaymentSummary($purchaseOrder);
        });

        return back()->with('success', 'Payment berhasil dihapus');
    }



    ////////// RECALCULATE HELPERS //////////

    private function recalculate(PurchaseOrder $purchaseOrder)
    {
            $kembalianSebelumnya = ($purchaseOrder->change_amount > 0) ? $purchaseOrder->change_amount : 0 ;    
            $gtSebelumnya = ($purchaseOrder->grand_total > 0) ? $purchaseOrder->grand_total : 0 ;    

            // 🔢 hitung ulang order
            $totalCost = $purchaseOrder->items()->sum('totalcost');

            $purchaseOrder->update([
                'sub_total' => $totalCost,
                'grand_total' => $totalCost
                    - $purchaseOrder->discount
                    + $purchaseOrder->charge
                    + $purchaseOrder->tax,
            ]);

            // 🔄 STOK TERBELI
            $stokPayment = $purchaseOrder->payments()
                ->where('mutation_type', 'Stok Terbeli')
                ->first();

            if ($stokPayment) {
                $this->updatePaymentNominalSafely($stokPayment, $totalCost);
            }

            // 🔄 HUTANG PEMBELIAN
            $hutangPayment = $purchaseOrder->payments()
                ->where('mutation_type', 'Hutang Pembelian')
                ->first();

            if ($hutangPayment) {
                $this->updatePaymentNominalSafely(
                    $hutangPayment,
                    $purchaseOrder->grand_total
                );
            }

            // 🔁 terakhir: cash, kembalian, dll
            $this->updateOrderPaymentSummary($purchaseOrder);

            if ($kembalianSebelumnya > 0 || $purchaseOrder->change_amount > 0) {
                if ($purchaseOrder->grand_total < $gtSebelumnya) {
                    $this->mutateAccountBalance(
                        $purchaseOrder->branch_id,
                        $purchaseOrder->payments()->where('mutation_type', 'Pembelian')->get()->sortBy('date')->last()->kredit_akun,
                        abs($kembalianSebelumnya - $purchaseOrder->change_amount),
                        'debit'
                        );
                    $this->mutateAccountBalance(
                        $purchaseOrder->branch_id,
                        'NR-KR Hutang Pembelian',
                        abs($kembalianSebelumnya - $purchaseOrder->change_amount),
                        'credit'
                        );
                } 
                if ($purchaseOrder->grand_total > $gtSebelumnya) {
                    $this->mutateAccountBalance(
                        $purchaseOrder->branch_id,
                        $purchaseOrder->payments()->where('mutation_type', 'Pembelian')->get()->sortBy('date')->last()->kredit_akun,
                        abs($kembalianSebelumnya - $purchaseOrder->change_amount),
                        'credit'
                        );
                    $this->mutateAccountBalance(
                        $purchaseOrder->branch_id,
                        'NR-KR Hutang Pembelian',
                        abs($kembalianSebelumnya - $purchaseOrder->change_amount),
                        'debit'
                        );
                } 
            }

            if ($purchaseOrder->change_amount <= 0) {
                if ($kembalianSebelumnya > 0) {
                    $this->mutateAccountBalance(
                        $purchaseOrder->branch_id,
                        $purchaseOrder->payments()->where('mutation_type', 'Pembelian')->get()->sortBy('date')->last()->kredit_akun,
                        abs($purchaseOrder->grand_total - $purchaseOrder->paid_amount),
                        'debit'
                        );
                    $this->mutateAccountBalance(
                        $purchaseOrder->branch_id,
                        'NR-KR Hutang Pembelian',
                        abs($purchaseOrder->grand_total - $purchaseOrder->paid_amount),
                        'credit'
                        );
                }            
            } 
            

    }


    private function updateOrderPaymentSummary(PurchaseOrder $purchaseOrder)
    {
        // ======================
        // AMBIL PAYMENT PEMBELIAN
        // ======================
        $payments = $purchaseOrder->payments()
            ->where('mutation_type', 'Pembelian')
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        if ($payments->isEmpty()) {
            return;
        }

        // ======================
        // HITUNG TOTAL BAYAR
        // ======================
        $totalPaid = $payments->sum(fn ($p) => $p->nominal_mins);
        $changeAmount = $totalPaid - $purchaseOrder->grand_total;

        $purchaseOrder->update([
            'paid_amount'   => $totalPaid,
            'change_amount' => $changeAmount,
        ]);

        // ======================
        // RESET PAYMENT PENJUALAN
        // ======================
        foreach ($payments as $payment) {
            $payment->update([
                'nominal_plus' => 0,
                'nominal'      => $payment->nominal_mins,
            ]);
        }

        // ======================
        // HAPUS KEMBALIAN LAMA
        // ======================
        $refunds = $purchaseOrder->payments()
            ->where('mutation_type', 'Kembalian')
            ->get();

        foreach ($refunds as $refund) {
            $refund->update(['deleted_by' => Auth::id()]);
            $refund->delete();
        }

        // ======================
        // APPLY KEMBALIAN
        // ======================
        if ($changeAmount > 0) {

            // ⬅️ payment pembelian terakhir yang sah
            $target = $payments
                ->sortBy(fn ($p) => [$p->updated_at, $p->id])
                ->last();

            if (!$target) {
                return;
            }

            // 1️⃣ potong payment target
            $target->update([
                'nominal_plus' => $changeAmount,
                'nominal'      => $target->nominal_mins - $changeAmount,
            ]);

            // 2️⃣ buat jurnal kembalian
            $refund = $purchaseOrder->payments()->create([
                'mutation_type'  => 'Kembalian',
                'currency'       => 'IDR',
                'payment_method' => $target->payment_method,

                'debit_akun'     => $target->kredit_akun,
                'kredit_akun'    => 'NR-KR Hutang Pembelian',

                'nominal'        => $changeAmount,

                'user_id'        => $purchaseOrder->user_id,
                'created_by'     => Auth::id(),
                'updated_by'     => Auth::id(),
                'branch_id'      => $purchaseOrder->branch_id,
                'date'           => $target->date,
            ]);


            // $payment->refresh();
            // 3️⃣ apply saldo
            // dd($refund->debit_akun);

            // rollback debit
            // $this->mutateAccountBalance(
            //     $refund->branch_id,
            //     $refund->debit_akun,
            //     $target->nominal - $target->nominal,
            //     'credit'
            // );
       
        }
    }

    private function canEditOrDeletePayment(Payment $payment): bool
    {
        $payments = $payment->paymentable
            ->payments()
            ->where('mutation_type', 'Pembelian')
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        // 1. Jika payment ini memiliki nominal_plus != 0 → BOLEH
        if ($payment->nominal_plus != 0) {
            return true;
        }

        // 2. Cek apakah ada payment lain yang punya nominal_plus != 0
        $hasNominalPlus = $payments->contains(fn ($p) => $p->nominal_plus != 0);

        // Jika ADA nominal_plus (tapi bukan payment ini), maka payment ini TIDAK BOLEH
        if ($hasNominalPlus) {
            return false;
        }

        // 3. Jika SEMUA nominal_plus = 0 → hanya last payment yang boleh
        $lastPayment = $payments->last();

        return $lastPayment && $lastPayment->id === $payment->id;
    }




    ////////////// ACCOUNT BALANCE HELPERS //////////

    private function resolveAkunCashBank(string $paymentMethod): string
    {
        return 'NR-DB CASH / BANK (' . strtoupper($paymentMethod) . ')';
    }

    private function updatePaymentNominalSafely(Payment $payment, float $newNominal)
    {
        if ($payment->nominal == $newNominal) {
            return;
        }

        // rollback saldo lama
        $this->rollbackPaymentMutation($payment);

        // update nominal
        $payment->update([
            'nominal' => $newNominal,
        ]);

        $payment->refresh();

        // apply saldo baru
        $this->applyPaymentMutation($payment);
    }

    private function applyPaymentMutation(Payment $payment)
    {
        // Debit
        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->debit_akun,
            $payment->nominal,
            'debit'
        );

        // Kredit
        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->kredit_akun,
            $payment->nominal,
            'credit'
        );
    }

    private function rollbackPaymentMutation(Payment $payment)
    {
        // rollback debit
        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->debit_akun,
            $payment->nominal,
            'credit'
        );

        // rollback kredit
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
        string $type // 'debit' | 'credit'
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

        /**
         * Konvensi:
         * debit  => balance + amount
         * credit => balance - amount
         */
        if ($type === 'debit') {
            $account->increment('balance', $amount);
        }

        if ($type === 'credit') {
            $account->decrement('balance', $amount);
        }
    }

    public function print(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['user', 'items.product']);

        // ✅ Generate barcode SVG
        $generator = new BarcodeGeneratorSVG();
        $barcodeSvg = $generator->getBarcode(
            $purchaseOrder->code, 
            $generator::TYPE_CODE_128,
            2,  // lebar bar
            40  // tinggi bar
        );

        // ✅ QR Code
        $renderer = new ImageRenderer(
            new RendererStyle(150),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrSvg = $writer->writeString($purchaseOrder->code);        

        return Inertia::render('Pembelian/Print', [
            'purchaseOrder'      => $purchaseOrder,
            'barcodeSvg' => $barcodeSvg, 
            'qrSvg'      => $qrSvg,
        ])->withViewData(['layout' => false]);
    }        

}