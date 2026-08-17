<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountBalance;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncApiController extends Controller
{
    public function getCustomers(Request $request)
    {
        try {
            $user = $request->user();

            $customers = \App\Models\User::where(function($q) {
                    $q->where('class', 'like', '%customer%')
                    ->orWhere('class', 'like', '%Customer%');
                })
                ->where('id', '!=', $user->id)
                ->whereNull('deleted_at')
                ->get();

            return response()->json([
                'status'  => 'success',
                'data'    => $customers,
            ], 200);

        } catch (\Throwable $e) {
            Log::error("ERROR GET CUSTOMERS: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getProducts(Request $request)
    {
        try {
            $user = $request->user();

            $products = Product::where('branch_id', $user->branch_id)
                ->where('is_active', 1)
                ->with(['brand', 'categories']) // ✅ include relasi
                ->get();

            // Ambil semua brand & category yang aktif di branch ini
            $brands = \App\Models\Brand::where('is_active', 1)->get();
            $categories = \App\Models\Category::where('is_active', 1)->get();

            return response()->json([
                'status'     => 'success',
                'message'    => 'Data produk cabang ' . $user->branch_id . ' berhasil ditarik',
                'data'       => $products,
                'brands'     => $brands,     // ✅ tambah
                'categories' => $categories, // ✅ tambah
            ], 200);

        } catch (\Throwable $e) {
            Log::error("DETAIL ERROR SYNC BRANCH: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal sinkronisasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getOrderCodes(Request $request)
    {
        try {
            $user = $request->user();

            $codes = Order::where('branch_id', $user->branch_id)
                ->where('created_by', $user->id)
                ->pluck('code'); // hanya ambil kolom code, ringan

            return response()->json([
                'ok'    => true,
                'codes' => $codes,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json(['ok' => false, 'message' => $e->getMessage()], 500);
        }
    }    

    public function uploadOrders(Request $request)
    {
        try {
            // 1. Validasi Input
            $payload = $request->validate([
                'code' => 'required|string', // Ambil kode unik dari Flutter
                'user_id' => 'required|integer|exists:users,id',
                'user_alias'  => 'nullable|string|max:255',
                'date' => 'required|date',
                'type' => 'required|in:dine_in,self_pickup,delivery',
                'notes' => 'nullable|string',
                'payment_method' => 'required|string',
                'sub_total' => 'required|numeric',
                'discount' => 'required|numeric',
                'charge' => 'required|numeric',
                'tax' => 'required|numeric',
                'grand_total' => 'required|numeric',
                'paid_amount' => 'required|numeric',
                'change_amount' => 'required|numeric',
                'items' => 'required|array|min:1',
                'items.*.slug'         => 'nullable|string|exists:products,slug',
                'items.*.product_id'   => 'nullable|integer',
                'items.*.name' => 'required|string',
                'items.*.price' => 'required|numeric|min:0',
                'items.*.quantity_mins' => 'required|integer|min:1',
                'items.*.created_by'         => 'nullable|numeric',
                'items.*.updated_by'         => 'nullable|numeric',
                'items.*.branch_id'         => 'nullable|numeric',
                'payments'                 => 'nullable|array',
                'payments.*.id'        => 'nullable|integer',
                'payments.*.is_synced' => 'nullable|integer',
                'payments.*.mutation_type' => 'nullable|string',
                'payments.*.debit_akun'    => 'nullable|string',
                'payments.*.kredit_akun'   => 'nullable|string',
                'payments.*.payment_method'=> 'nullable|string',
                'payments.*.currency'      => 'nullable|string',
                'payments.*.nominal_plus'  => 'nullable|numeric',
                'payments.*.nominal_mins'  => 'nullable|numeric',
                'payments.*.nominal'       => 'nullable|numeric',
                'payments.*.created_by'         => 'nullable|numeric',
                'payments.*.updated_by'         => 'nullable|numeric',
                'payments.*.branch_id'         => 'nullable|numeric',
                'payments.*.notes'         => 'nullable|string',
                'payments.*.date'         => 'nullable|string',
            ]);

            // 2. Cek Duplikat (Idempotency) sebelum transaksi
            $existingOrder = Order::where('code', $payload['code'])->first();

            if ($existingOrder) {
                // Order sudah ada → proses hanya payment yang belum sync
                $syncedPaymentIds = [];

                DB::transaction(function () use ($payload, $existingOrder, &$syncedPaymentIds) {
                    foreach ($payload['payments'] ?? [] as $pm) {
                        // Skip payment yang sudah sync
                        if (isset($pm['is_synced']) && $pm['is_synced'] == 1) continue;

                        $cashPayment = $existingOrder->payments()->create([
                            'mutation_type'  => 'Penjualan',
                            'currency'       => 'IDR',
                            'payment_method' => $pm['payment_method'],
                            'debit_akun'     => $this->resolveAkunCashBank($pm['payment_method']),
                            'kredit_akun'    => 'NR-DB Piutang Penjualan',
                            'nominal_plus'   => $pm['nominal_plus'] ?? 0,
                            'nominal_mins'   => ($pm['nominal_mins'] ?? 0) > 0 ? $pm['nominal_mins'] : 0,
                            'nominal'        => ($pm['nominal_plus'] ?? 0) - max($pm['nominal_mins'] ?? 0, 0),
                            'user_id'        => $existingOrder->user_id,
                            'created_by'     => $pm['created_by'] ?? Auth::id(),
                            'updated_by'     => $pm['updated_by'] ?? Auth::id(),
                            'branch_id'      => $existingOrder->branch_id,
                            'date'           => Carbon::parse($pm['date'])->toDateTimeString(),
                            'notes'          => $pm['notes'] ?? null,
                        ]);
                        $this->applyPaymentMutation($cashPayment);

                        if (isset($pm['id'])) {
                            $syncedPaymentIds[] = $pm['id']; // local Flutter ID
                        }
                    }

                    // Hitung ulang summary order
                    $this->updateOrderPaymentSummary($existingOrder);
                });

                return response()->json([
                    'ok' => true,
                    'message' => 'Payment baru berhasil disinkron',
                    'order_id' => $existingOrder->id,
                    'synced_payment_ids' => $syncedPaymentIds,
                ]);
            }

            $order = DB::transaction(function () use ($payload) {
                $user = Auth::user();

                // Ambil Produk & Lock
                $productIds = collect($payload['items'])->pluck('product_id')->filter()->unique()->values();
                $products = $productIds->isNotEmpty() 
                    ? Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id') 
                    : collect();

                // Hitung Antrian Lokal Cabang
                $queue = Order::where('branch_id', $user->branch_id)
                    ->whereBetween('date', [
                        Carbon::parse($payload['date'])->startOfDay(),
                        Carbon::parse($payload['date'])->endOfDay(),
                    ])->lockForUpdate()->max('q');
                $queue = ($queue ?? 0) + 1;

                // Buat Order menggunakan CODE dari Flutter
                $order = Order::create([
                    'code' => $payload['code'], // <--- PAKAI KODE DARI FLUTTER
                    'q' => $queue,
                    'status' => 'new',
                    'notes' => $payload['notes'],
                    'payment_method' => $payload['payment_method'],
                    'sub_total' => $payload['sub_total'],
                    'discount' => $payload['discount'],
                    'charge' => $payload['charge'],
                    'tax' => $payload['tax'],
                    'grand_total' => $payload['grand_total'],
                    'paid_amount' => $payload['paid_amount'],
                    'change_amount' => $payload['change_amount'],
                    'meta' => [],                    
                    'user_id' => $payload['user_id'],
                    'user_alias' => $payload['user_alias'] ?? null,
                    'created_by' => $user->id,
                    'updated_by' => $user->id,
                    'branch_id' => $user->branch_id,
                    'date' => Carbon::parse($payload['date'])->toDateTimeString(),
                    'type' => $payload['type'],
                ]);

                // Ambil products by slug (bukan by id)
                $slugs = collect($payload['items'])->pluck('slug')->filter()->unique()->values();
                $products = $slugs->isNotEmpty()
                    ? Product::whereIn('slug', $slugs)->lockForUpdate()->get()->keyBy('slug')
                    : collect();

                // Simpan Item & Kurangi Stok
                foreach ($payload['items'] as $it) {
                    $product = isset($it['slug']) ? $products->get($it['slug']) : null;
                    
                    $order->items()->create([
                        'product_id' => $product?->id ?? null,
                        'name'       => $it['name'],
                        'cost'       => $product?->cost ?? 0,
                        'price'      => $it['price'],
                        'quantity_mins'   => $it['quantity_mins'],
                        'subtotal'   => $it['price'] * $it['quantity_mins'],
                        'totalcost'   => ($product?->cost ?? 0) * $it['quantity_mins'],
                        'totalweight' => ($product?->weight ?? 0) * $it['quantity_mins'],
                        'user_id'    => $order->user_id,
                        'created_by' => $it['created_by'],
                        'updated_by' => $it['updated_by'],
                        'branch_id'  => $order->branch_id,
                        'date'       => $order->date,
                    ]);

                    if ($product) {
                        $product->decrement('stock', $it['quantity_mins']);
                    }
                }

                // JURNAL AKUNTANSI (Gunakan Helper Papa)
                // 1. Stok Terjual
                $stokPayment = $order->payments()->create([
                    'mutation_type' => 'Stok Terjual',
                    'currency' => 'IDR',
                    'debit_akun' => 'LR-DB Stok Terjual',
                    'kredit_akun' => 'NR-DB Persediaan',
                    'nominal' => $order->items()->sum('totalcost'),
                    'user_id' => $order->user_id,
                    'created_by' => $order->created_by,
                    'updated_by' => $order->updated_by,
                    'branch_id' => $order->branch_id,
                    'date' => $order->date,
                ]);
                $this->applyPaymentMutation($stokPayment);

                // 2. Piutang
                $piutangPayment = $order->payments()->create([
                    'mutation_type' => 'Piutang Penjualan',
                    'currency' => 'IDR',
                    'debit_akun' => 'NR-DB Piutang Penjualan',
                    'kredit_akun' => 'LR-KR Penjualan Kasir',
                    'nominal' => $order->grand_total,
                    'user_id' => $order->user_id,
                    'created_by' => $order->created_by,
                    'updated_by' => $order->updated_by,
                    'branch_id' => $order->branch_id,
                    'date' => $order->date,
                ]);
                $this->applyPaymentMutation($piutangPayment);

                // 3. Kas/Bank
                foreach ($payload['payments'] as $pm) {
                    $cashPayment = $order->payments()->create([
                        'mutation_type' => 'Penjualan',
                        'currency' => 'IDR',
                        'payment_method' => $pm['payment_method'],
                        'debit_akun' => $this->resolveAkunCashBank($pm['payment_method']),
                        'kredit_akun' => 'NR-DB Piutang Penjualan',
                        'nominal_plus' => $pm['nominal_plus'],
                        'nominal_mins' => $pm['nominal_mins'] > 0 ? $pm['nominal_mins'] : 0,
                        'nominal' => $pm['nominal_plus'] - max($pm['nominal_mins'], 0),
                        'user_id' => $order->user_id,
                        'created_by' => $pm['created_by'],
                        'updated_by' => $pm['updated_by'],
                        'branch_id'  => $order->branch_id,
                        'date' => Carbon::parse($pm['date'])->toDateTimeString(),
                        'notes' => $pm['notes'] ?? null,
                    ]);
                    $this->applyPaymentMutation($cashPayment);
                }


                return $order;
            });

            return response()->json([
                'ok' => true,
                'message' => 'Order berhasil sinkron',
                'order_id' => $order->id,
                'order_antrian' => $order->q,
                'synced_payment_ids' => collect($payload['payments'])->pluck('id')->filter()->values()->toArray(),
            ], 200);

        } catch (\Throwable $e) {
            Log::error("ERROR UPLOAD ORDER: " . $e->getMessage());
            return response()->json(['ok' => false, 'message' => $e->getMessage()], 500);
        }
    }


   public function getOrders(Request $request)
    {
        try {
            $user = $request->user();

            $baseQuery = Order::where('branch_id', $user->branch_id)
                ->where('created_by', $user->id)
                ->with(['items', 'payments']);

            // ✅ Ambil semua yang belum lunas dulu
            $unpaid = (clone $baseQuery)
                ->whereRaw('grand_total > paid_amount')
                ->orderByDesc('date')
                ->limit(1000)
                ->get();

            $unpaidCount = $unpaid->count();
            $paidLimit = 1000 - $unpaidCount; // sisa slot untuk yang lunas

            // ✅ Ambil yang lunas sesuai sisa slot
            $paid = $paidLimit > 0
                ? (clone $baseQuery)
                    ->whereRaw('grand_total <= paid_amount')
                    ->orderByDesc('date')
                    ->limit($paidLimit)
                    ->get()
                : collect();

            $orders = $unpaid->merge($paid);

            return response()->json([
                'ok'   => true,
                'data' => $orders,
            ], 200);

        } catch (\Throwable $e) {
            Log::error("ERROR GET ORDERS: " . $e->getMessage());
            return response()->json(['ok' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function updateOrderPaymentSummary(Order $order)
    {
        // ======================
        // AMBIL PAYMENT PENJUALAN
        // ======================
        $payments = $order->payments()
            ->where('mutation_type', 'Penjualan')
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        if ($payments->isEmpty()) {
            return;
        }

        // ======================
        // HITUNG TOTAL BAYAR
        // ======================
        $totalPaid = $payments->sum(fn ($p) => $p->nominal_plus);
        $changeAmount = $totalPaid - $order->grand_total;

        $order->update([
            'paid_amount'   => $totalPaid,
            'change_amount' => $changeAmount,
        ]);

        // ======================
        // RESET PAYMENT PENJUALAN
        // ======================
        foreach ($payments as $payment) {
            $payment->update([
                'nominal_mins' => 0,
                'nominal'      => $payment->nominal_plus,
            ]);
        }

        // ======================
        // HAPUS KEMBALIAN LAMA
        // ======================
        $refunds = $order->payments()
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
                'nominal_mins' => $changeAmount,
                'nominal'      => $target->nominal_plus - $changeAmount,
            ]);

            // 2️⃣ buat jurnal kembalian
            $refund = $order->payments()->create([
                'mutation_type'  => 'Kembalian',
                'currency'       => 'IDR',
                'payment_method' => $target->payment_method,

                'debit_akun'     => 'NR-DB Piutang Penjualan',
                'kredit_akun'    => $target->debit_akun,

                'nominal'        => $changeAmount,

                'user_id'        => $order->user_id,
                'created_by'     => Auth::id(),
                'updated_by'     => Auth::id(),
                'branch_id'      => $order->branch_id,
                'date'           => $target->date,
            ]);

        }

    }    


    ////////////// ACCOUNT BALANCE HELPERS //////////

    private function resolveAkunCashBank(string $paymentMethod): string
    {
        return 'NR-DB CASH / BANK (' . strtoupper($paymentMethod) . ')';
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
}