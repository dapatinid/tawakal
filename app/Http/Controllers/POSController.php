<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class POSController extends Controller
{
    
 public function index(Request $request)
{
    $query = Product::query();

    $perpage = (int) $request->get('per_page', 100);
    $sortBy = $request->get('sort_by', 'updated_at');
    $sortDirection = $request->get('sort_direction', 'desc');

    // 🔍 Search produk (Case-Insensitive & Anti-Crash Postgres)
    if ($request->filled('search')) {
        $searchTerm = strtolower($request->search);

        $query->where(function ($q) use ($searchTerm) {
            // Pencarian Nama, SKU, dan Barcode menggunakan LOWER
            $q->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
              ->orWhereRaw('LOWER(sku) like ?', ["%{$searchTerm}%"])
              ->orWhereRaw('LOWER(barcode) like ?', ["%{$searchTerm}%"]);

            // Keamanan PostgreSQL: Cari ID hanya jika input adalah angka
            if (is_numeric($searchTerm)) {
                $q->orWhere('id', $searchTerm);
            }
        });
    }

    // 🏷️ Filter kategori (MANY TO MANY)
    if ($request->filled('categories')) {
        $categoryIds = explode(',', $request->categories);

        $query->whereHas('categories', function ($q) use ($categoryIds) {
            $q->whereIn('categories.id', $categoryIds);
        });
    }

    // 🏭 Filter brand (masih single)
    if ($request->filled('brands')) {
        $brandIds = explode(',', $request->brands);
        $query->whereIn('brand_id', $brandIds);
    }

    // 📦 Produk
    $products = $query
        ->whereIsActive(true)
        ->whereBranchId(Auth::user()->branch_id)
        ->with(['categories:id,name', 'brand:id,name'])
        ->orderBy($sortBy, $sortDirection)
        ->paginate($perpage)
        ->withQueryString();

    return Inertia::render('POS/Index', [
        'products' => $products,
        'search' => $request->get('search', ''),
        // Tetap menggunakan standard Eloquent untuk customer
        'users' => User::where(function($q) {
                    $q->where('class', 'like', '%customer%');
                })
                ->select('id', 'name', 'username')
                ->get(),

        // 🏷️ Kategori aktif berdasarkan produk & cabang
        'categories' => Category::whereIn('id',
            DB::table('category_product')
                ->join('products', 'products.id', '=', 'category_product.product_id')
                ->where('products.branch_id', Auth::user()->branch_id)
                    ->where('products.is_active', true) 
                ->select('category_product.category_id')
                ->distinct()
                ->pluck('category_id')
        )->select('id', 'name')->get(),

        // 🏭 Brand aktif
        'brands' => Brand::whereIn('id',
            Product::where('branch_id', Auth::user()->branch_id)
                    ->where('is_active', true)
                ->select('brand_id')
                ->distinct()
                ->pluck('brand_id')
        )->select('id', 'name')->get(),

        'allProductForText' => Product::select('id', 'sku', 'barcode', 'name', 'slug', 'price')
            ->whereBranchId(Auth::user()->branch_id)
            ->get(),
    ]);
}


    
    public function checkout(Request $request)
    {
        $payload = $request->validate([
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
            'items.*.product_id' => 'nullable|integer|exists:products,id',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity_mins' => 'required|integer|min:1',
        ]);

        try {
            $order = DB::transaction(function () use ($payload) {

                $productIds = collect($payload['items'])
                    ->pluck('product_id')
                    ->filter()
                    ->unique()
                    ->values();

                $products = collect();

                if ($productIds->isNotEmpty()) {
                    $products = Product::whereIn('id', $productIds)
                        ->lockForUpdate()
                        ->get()
                        ->keyBy('id');
                }

                $queue = Order::where('branch_id', Auth::user()->branch_id)
                    ->whereBetween('date', [
                        Carbon::parse($payload['date'])->startOfDay(),
                        Carbon::parse($payload['date'])->endOfDay(),
                    ])
                    // ->lockForUpdate()
                    ->max('q');
                $queue = ($queue ?? 0) + 1;

                $order = Order::create([
                    'q' => $queue ,
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
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                    'branch_id' => Auth::user()->branch_id,
                    'date' => Carbon::parse($payload['date'])->toDateTimeString(),
                    'type' => $payload['type'],
                ]);

                // refresh untuk memastikan timestamp terisi
                $order->refresh();
                $createdAt = $order->created_at->format('YmdHis');
                $order->update([
                    'code' => 'ORD'.$createdAt.'#'.Auth::user()->branch_id.'-'.Auth::user()->id,
                ]);

                $qtyPerProduct = collect($payload['items'])
                    ->whereNotNull('product_id')
                    ->groupBy('product_id')
                    ->map(fn ($rows) => $rows->sum('quantity_mins'));

                // VALIDASI STOK SAJA (karena decrement dilakukan di DB)
                foreach ($qtyPerProduct as $productId => $totalQty) {

                    $product = $products->get($productId);

                    if (!$product) {
                        throw new \Exception("Product tidak ditemukan");
                    }

                    // if ($product->stock < $totalQty) {
                    //     throw new \Exception("Stok {$product->name} tidak mencukupi");
                    // }
                }

                /**
                 * SIMPAN ORDER ITEMS (loop terpisah)
                 */
                foreach ($payload['items'] as $it) {

                    $product = null;

                    if (!empty($it['product_id'])) {
                        $product = $products->get((int) $it['product_id']); // 🔑 CAST INT
                    }

                    $order->items()->create([
                        'product_id' => $it['product_id'] ?? null,
                        'name'       => $it['name'],
                        'cost'       => $product?->cost ?? 0, // ✅ BENAR
                        'price'      => $it['price'],
                        'quantity_mins'   => $it['quantity_mins'],
                        'subtotal'   => $it['price'] * $it['quantity_mins'],
                        'totalcost'   => $product->cost * $it['quantity_mins'],
                        'totalweight'   => $product->weight * $it['quantity_mins'],
                        'user_id'    => $order->user_id,
                        'created_by' => Auth::id(),
                        'updated_by' => Auth::id(),
                        'branch_id'  => Auth::user()->branch_id,
                        'date'       => $order->date,
                    ]);
                }


                /**
                 * DECREMENT STOK KE DATABASE
                 */
                foreach ($qtyPerProduct as $productId => $totalQty) {
                    Product::where('id', $productId)
                        ->decrement('stock', $totalQty);
                }

                $stokPayment = $order->payments()->create([
                    'mutation_type' => 'Stok Terjual',
                    'currency' => 'IDR',
                    'debit_akun' => 'LR-DB Stok Terjual',
                    'kredit_akun' => 'NR-DB Persediaan',
                    'nominal' => $order->items()->sum('totalcost'),
                    'user_id' => $order->user_id,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                    'branch_id' => Auth::user()->branch_id,
                    'date' => $order->date,
                ]);

                $this->applyPaymentMutation($stokPayment);

                $piutangPayment = $order->payments()->create([
                    'mutation_type' => 'Piutang Penjualan',
                    'currency' => 'IDR',
                    'debit_akun' => 'NR-DB Piutang Penjualan',
                    'kredit_akun' => 'LR-KR Penjualan Kasir',
                    'nominal' => $order->grand_total,
                    'user_id' => $order->user_id,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                    'branch_id' => Auth::user()->branch_id,
                    'date' => $order->date,
                ]);

                $this->applyPaymentMutation($piutangPayment);

                $cashPayment = $order->payments()->create([
                    'mutation_type' => 'Penjualan',
                    'currency' => 'IDR',
                    'payment_method' => $order->payment_method,
                    'debit_akun' => $this->resolveAkunCashBank($order->payment_method),
                    'kredit_akun' => 'NR-DB Piutang Penjualan',
                    'nominal_plus' => $order->paid_amount,
                    'nominal_mins' => $order->change_amount > 0 ? $order->change_amount : 0,
                    'nominal' => $order->paid_amount > 0
                        ? ($order->paid_amount - max($order->change_amount, 0))
                        : 0,
                    'user_id' => $order->user_id,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                    'branch_id' => Auth::user()->branch_id,
                    'date' => $order->date,
                ]);

                $this->applyPaymentMutation($cashPayment);

                return $order;

            });

            return response()->json([
                'ok' => true,
                'order_antrian' => $order->q,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => $e->getMessage(),
            ], 500);
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