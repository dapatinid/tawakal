<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Notification;
use App\Models\ReturnItem;
use App\Services\SupabaseService;
use Picqer\Barcode\BarcodeGeneratorSVG;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Rap2hpoutre\FastExcel\FastExcel;

class PenjualanController extends Controller
{
    // Tampilkan form
    public function create()
    {
        return inertia('Penjualan/Create', [
            'defaultDate' => now()->format('Y-m-d\TH:i'),
            'users' => User::whereNotIn('id', [1])->where('class', 'like', "%customer%")->get(),
        ]);
    }

    // Simpan penjualan baru
public function store(Request $request)
{
    $data = $request->validate([
        'date'       => 'required|date',
        'type'       => 'required|in:dine_in,self_pickup,delivery',
        'notes'      => 'nullable|string',
        'user_id'    => 'required|exists:users,id',
        'user_alias' => 'nullable|string|max:255',
    ]);

    $order = DB::transaction(function () use ($data) {

        // Hitung nomor antrian (Q) per cabang & tanggal
        $queue = Order::where('branch_id', Auth::user()->branch_id)
            ->whereBetween('date', [
                Carbon::parse($data['date'])->startOfDay(),
                Carbon::parse($data['date'])->endOfDay(),
            ])
            // ->lockForUpdate()
            ->max('q');

        $queue = ($queue ?? 0) + 1;

        // Buat penjualan
        $order = Order::create([
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
        $order->refresh();
        $createdAt = $order->created_at->format('YmdHis');
        $order->update([
            'code' => 'ORD'.$createdAt.'#'.Auth::user()->branch_id.'-'.Auth::user()->id,
        ]);

        // --- Buat jejak payment sesuai Checkout POS ---
        // 1. Stok Terjual
        $stokPayment = $order->payments()->create([
            'mutation_type' => 'Stok Terjual',
            'currency' => 'IDR',
            'debit_akun' => 'LR-DB Stok Terjual',
            'kredit_akun' => 'NR-DB Persediaan',
            'nominal' => $order->sub_total,
            'user_id' => $order->user_id,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'branch_id' => Auth::user()->branch_id,
            'date' => $order->date,
        ]);
        $this->applyPaymentMutation($stokPayment);

        // 2. Piutang Penjualan
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

        // 3. Penjualan (Cash)
        $cashPayment = $order->payments()->create([
            'mutation_type' => 'Penjualan',
            'currency' => 'IDR',
            'payment_method' => 'cash',
            'debit_akun' => $this->resolveAkunCashBank('cash'),
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

    return redirect()
        ->route('penjualan.show', $order)
        ->with('success', 'Order baru berhasil dibuat');
}

public function destroy(Order $order)
{
    // Safety: pastikan order milik cabang aktif
    if ($order->branch_id !== Auth::user()->branch_id) {
        abort(403);
    }

            if (Auth::user()->level == null) {
                return back()->with('error', 'Anda tidak berhak menghapus');
            }    

    $notifPayload = null;

    DB::transaction(function () use ($order, &$notifPayload) {

        $nominalDeleted = $order->grand_total;

        if ($order->change_amount > 0) {
        $kembalianIni = $order->payments()->where('mutation_type', 'Kembalian')->get()->sortBy('date')->last()->kredit_akun;
        $this->mutateAccountBalance(
            $order->branch_id,
            $kembalianIni,
            $order->change_amount,
            'credit'
            );
        $this->mutateAccountBalance(
            $order->branch_id,
            'NR-DB Piutang Penjualan',
            $order->change_amount,
            'debit'
            );
        }            

        /**
         * ============================
         * 1️⃣ ROLLBACK PAYMENT (SEMUA)
         * ============================
         */
        $payments = $order->payments()->lockForUpdate()->get();

        foreach ($payments as $payment) {
            // rollback saldo akun
            $this->rollbackPaymentMutation($payment);

            // soft delete payment
            $payment->update(['deleted_by' => Auth::id()]);
            $payment->delete();
        }

        /**
         * ============================
         * 2️⃣ ROLLBACK STOK ITEM
         * ============================
         */
        $items = $order->items()->lockForUpdate()->get();

        foreach ($items as $item) {

            // catat retur
            $order->returns()->create([
                'branch_id' => $order->branch_id,
                'date' => now(),
                'notes' => 'dihapus',
                'product_id' => $item->product->id,
                'name' => $item->name,
                'cost' => $item->cost,
                'quantity_plus' => $item->quantity_plus,
                'price' => $item->price,
                'quantity_mins' => $item->quantity_mins, 
                'subtotal' => $item->subtotal,        
                'totalweight' => $item->totalweight,        
                'status' => 'return',        
                'user_id' => $item->user_id,
                'created_by' => Auth::user()->id,
                'updated_by' => Auth::user()->id,
            ]);

            // lock product
            $product = Product::where('id', $item->product_id)
                ->lockForUpdate()
                ->first();

            if ($product) {
                // kembalikan stok
                $product->increment('stock', $item->quantity_mins);
            }

            // soft delete item
            $item->update(['deleted_by' => Auth::id()]);

            $item->delete();
        }

        /**
         * ============================
         * 3️⃣ HAPUS ORDER INDUK
         * ============================
         */
        $order->update([
            'updated_by' => Auth::id(),
        ]);

        $order->delete();

        /**
         * ============================
         * Notifikasi
         * ============================
         */        
        $notif = Notification::create([
            'branch_id' => $order->branch_id,
            'actor_id'  => Auth::user()->id,
            'audience'  => 'admin',
            'type'      => 'order.deleted',
            'notifiable_type' => Order::class,
            'notifiable_id'   => $order->id,
            'data' => [
                'actor_name' => Auth::user()->name,
                'order_id' => $order->id,
                'order_code' => $order->code,
                'nominal'     => $nominalDeleted,
            ],
        ]);

        // Simpan payload untuk dikirim setelah transaction selesai
        $notifPayload = $notif->toArray(); // ✅ capture, belum push
    });

    // ✅ Push ke Supabase DI LUAR transaction
    // Kalau Supabase sleep/timeout → payment TETAP berhasil
    // Hanya notifikasi realtime yang tidak muncul, tapi data sudah ada di MySQL
    if ($notifPayload) {
        app(SupabaseService::class)->pushNotification($notifPayload);
    }

    return back()->with('success', 'Order berhasil dihapus & seluruh transaksi di-rollback');
}


public function index(Request $request)
    {
        $paymentStatus = $request->get('payment_status', 'all');
        $orderStatus   = $request->get('order_status');
        $search        = $request->get('search', '');
                
        $startDate = $request->get('start_date')
            ?? Carbon::parse('2026-01-01 00:00:00')->toDateString();

        $endDate = $request->get('end_date')
            ?? Carbon::today()->addDays(7)->toDateString();

        // ===============================
        // BASE QUERY (SATU SUMBER KEBENARAN)
        // ===============================
        $baseQuery = Order::query()->whereBranchId(Auth::user()->branch_id)
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
                $orderStatus,
                fn ($q) => $q->where('status', $orderStatus),
                fn ($q) => $q->where('status', '!=', 'canceled')
            )
            ->when($search, function ($q) use ($search) {
                // Normalisasi input ke huruf kecil
                $searchTerm = strtolower($search);

                $q->where(function ($x) use ($searchTerm) {
                    // Pencarian Kode Nota
                    $x->whereRaw('LOWER(code) like ?', ["%{$searchTerm}%"])
                    
                    // Pencarian Nama Customer melalui Relasi
                    ->orWhereHas('user', fn ($u) =>
                        $u->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
                    )
                    
                    // Pencarian User Alias (Nama manual) & Catatan
                    ->orWhereRaw('LOWER(user_alias) like ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(notes) like ?', ["%{$searchTerm}%"]);

                    // Keamanan PostgreSQL: Cari ID hanya jika input adalah angka
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
        $orders = (clone $baseQuery)
            ->latest()
            ->paginate(60)
            ->withQueryString();

        $orderUnpaid = Order::whereBranchId(Auth::user()->branch_id)
            ->where('change_amount', '<', 0)
            ->count();

        return inertia('Penjualan/Index', [
            'orders'  => $orders,
            'orderUnpaid' => $orderUnpaid,
            'summary' => $summary,
            'filters' => [
                'payment_status' => $paymentStatus,
                'order_status'   => $orderStatus,
                'search'         => $search, // Kirim teks asli agar input di UI tetap nyaman dibaca
                'start_date'     => $startDate,
                'end_date'       => $endDate,
            ],
        ]);
    }



    public function show(Order $order)
    {
        $order->load([
            'user',
            'userCre',
            'userUpd',
            'items.product',
            'payments' => fn($q) => $q
                ->where('mutation_type', 'Penjualan')
                ->orderBy('date', 'asc'),
        ]);
        $products = Product::select('id','name','price','stock')->whereBranchId(Auth::user()->branch_id)->where('is_active', true)->orderBy('name')->get();
        return Inertia::render('Penjualan/Show', [
            'order' => $order,
            'products' => $products,
        ]);
    }

    public function editInfo(Request $request, Order $order)
    {
        if ($order->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        } 
    
        $request->validate([
            'date'   => 'required|date',
            'status' => 'required|in:new,processing,shipped,delivered,canceled',
            'type' => 'required|in:dine_in,self_pickup,delivery',
        ]);

        $order->update([
            'date'   => $request->date,
            'status' => $request->status,
            'type' => $request->type,
            'notes' => $request->notes ?? '',
            'updated_by' => Auth::id(),
        ]);

        $order->items()->update([
            'date'   => $order->date,
            'status'   => $order->status,
            'updated_by' => Auth::id(),
        ]);

        return back()->with('success', 'Info Order berhasil diperbarui.');
        
    }

    public function storeItem(Request $request, Order $order)
    {
        if ($order->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        } 

        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'price' => 'required|numeric',
            'quantity_mins' => 'required|numeric|min:1',
        ]);

        DB::transaction(function () use ($data, $order) {

            // 🔒 Lock product
            $product = Product::where('id', $data['product_id'])
                ->lockForUpdate()
                ->firstOrFail();

            // ❌ stok tidak cukup
            // if ($product->stock < $data['quantity_mins']) {
            //     throw new \Exception("Stok {$product->name} tidak mencukupi");
            // }

            $data['name'] = $product->name;
            $data['cost'] = $product->cost;
            $data['subtotal'] = $data['price'] * $data['quantity_mins'];
            $data['totalcost'] = $product->cost * $data['quantity_mins'];
            $data['totalweight'] = $product->weight * $data['quantity_mins'];
            $data['user_id'] = $order->user_id;
            $data['created_by'] = Auth::id();
            $data['branch_id'] = $order->branch_id;
            $data['date'] = $order->date;
            $data['status'] = $order->status;

            // ➕ tambah item
            $order->items()->create($data);

            // ➖ kurangi stok (atomic)
            Product::where('id', $product->id)
                ->decrement('stock', $data['quantity_mins']);

            // 🔄 recalculate total
            $this->recalculate($order);
        });

        return back()->with('success', 'Item berhasil ditambahkan');
    
    }

    public function updateItem(Request $request, OrderItem $item)
    {
        if ($item->itemable->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        }      

        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'price' => 'required|numeric',
            'quantity_mins' => 'required|numeric|min:0',
        ]);

        $notifPayload = null;

        DB::transaction(function () use ($data, $item, &$notifPayload) {

            /**
             * =====================================================
             * 1. SNAPSHOT DATA LAMA (UNTUK NOTIFIKASI)
             * =====================================================
             */
            $oldProductName = $item->product->name ?? '-';
            $oldProductId   = $item->product_id;
            $oldQty         = (int) $item->quantity_mins;
            $oldSubtotal         = $item->subtotal;

            $order     = $item->itemable;
            $orderId   = $order?->id;
            $orderCode   = $order?->code;
            $branchId  = Auth::user()->branch_id;
            $actorId   = Auth::id();

            /**
             * =====================================================
             * 2. DATA BARU
             * =====================================================
             */
            $newProductId   = (int) $data['product_id'];
            $newQty         = (int) $data['quantity_mins'];

            /**
             * LOCK PRODUCT (URUT BERDASARKAN ID → ANTI DEADLOCK)
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
            
            if (!$oldProduct || !$newProduct) {
                throw new \Exception('Product tidak ditemukan');
                }

            /**
             * =========================
             * CASE 1: PRODUCT TIDAK BERUBAH
             * =========================
             */
            if ($oldProductId == $newProductId) {
                $delta = $newQty - $oldQty;
                $returnQty = $oldQty - $newQty;

                //CATAT RETUR 
                $order->returns()->create([
                    'branch_id' => $order->branch_id,
                    'date' => now(),
                    'notes' => 'diubah (item sama)',
                    'product_id' => $oldProduct->id,
                    'name' => $oldProduct->name,
                    'cost' => $oldProduct->cost,
                    'quantity_plus' => 0,
                    'price' => $oldProduct->price,
                    'quantity_mins' => $returnQty,
                    'subtotal' => $returnQty * $oldProduct->price,
                    'totalweight' => $returnQty * $oldProduct->weight,
                    'status' => 'return',
                    'user_id' => $item->user_id,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                ]);
                        

                $item->update([
                    'price'        => $data['price'],
                    'quantity_mins'=> $newQty,
                    'subtotal'     => $data['price'] * $newQty,
                    'totalcost'    => $oldProduct->cost * $newQty,
                    'totalweight'  => $oldProduct->weight * $newQty,
                    'updated_by'   => $actorId,
                ]);

                if ($delta > 0) {
                    Product::where('id', $oldProductId)->decrement('stock', $delta);
                } elseif ($delta < 0) {
                    Product::where('id', $oldProductId)->increment('stock', abs($delta));
                }

                $newProductName = $oldProductName;
                $newSubtotal = $data['price'] * $newQty;

            /**
             * =========================
             * CASE 2: PRODUCT BERUBAH
             * =========================
             */
            } else {

                // catat retur
                $order->returns()->create([
                    'branch_id' => $order->branch_id,
                    'date' => now(),
                    'notes' => 'diubah (item beda)',
                    'product_id' => $oldProduct->id,
                    'name' => $oldProduct->name,
                    'cost' => $oldProduct->cost,
                    'quantity_plus' => 0,
                    'price' => $oldProduct->price,
                    'quantity_mins' => $item->quantity_mins,      
                    'subtotal' => $oldProduct->price * $item->quantity_mins,        
                    'totalweight' => $oldProduct->weight * $item->quantity_mins,         
                    'status' => 'return',        
                    'user_id' => $item->user_id,
                    'created_by' => Auth::user()->id,
                    'updated_by' => Auth::user()->id,
                ]);               

                Product::where('id', $oldProductId)
                    ->increment('stock', $oldQty);

                Product::where('id', $newProductId)
                    ->decrement('stock', $newQty);

                $item->update([
                    'product_id'   => $newProductId,
                    'name'         => $newProduct->name,
                    'cost'         => $newProduct->cost,
                    'price'        => $data['price'],
                    'quantity_mins'=> $newQty,
                    'subtotal'     => $data['price'] * $newQty,
                    'totalcost'    => $newProduct->cost * $newQty,
                    'totalweight'  => $newProduct->weight * $newQty,
                    'updated_by'   => $actorId,
                ]);

                $newProductName = $newProduct->name;
                $newSubtotal = $data['price'] * $newQty;
            }

            /**
             * =====================================================
             * 3. RECALCULATE ORDER
             * =====================================================
             */
            $this->recalculate($order);

            /**
             * =====================================================
             * 4. BUAT NOTIFIKASI (SETELAH UPDATE SUKSES)
             * =====================================================
             */
            $notif = Notification::create([
                'branch_id' => $branchId,
                'actor_id'  => $actorId,
                'audience'  => 'admin',
                'type'      => 'order_item.updated',
                'notifiable_type' => OrderItem::class,
                'notifiable_id'   => $item->id,
                'data' => [
                    'actor_name' => Auth::user()->name,
                    'order_id' => $orderId,
                    'order_code' => $orderCode,
                    'product_before' => $oldProductName,
                    'product_after'  => $newProductName,
                    'qty_before'     => $oldQty,
                    'qty_after'      => $newQty,
                    'subtotal_before'      => $oldSubtotal,
                    'subtotal_after'      => $newSubtotal,
                ],
            ]);

            // Simpan payload untuk dikirim setelah transaction selesai
            $notifPayload = $notif->toArray(); // ✅ capture, belum push
        });

        // ✅ Push ke Supabase DI LUAR transaction
        // Kalau Supabase sleep/timeout → payment TETAP berhasil
        // Hanya notifikasi realtime yang tidak muncul, tapi data sudah ada di MySQL
        if ($notifPayload) {
            app(SupabaseService::class)->pushNotification($notifPayload);
        }

        return back()->with('success', 'Item berhasil diupdate');
    }    

    public function destroyItem(OrderItem $item)
    {
        if ($item->itemable->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        }      
            
        if (Auth::user()->level == null) {
            return back()->with('error', 'Anda tidak berhak menghapus');
        }        

        $order = $item->itemable;

        if (! $order) {
            return back()->with('error', 'Order tidak ditemukan');
        }

        $jumlahItem = $order->items()->count();

        if ($jumlahItem <= 1) {
            return back()->with('error', 'Minimal harus ada satu item');
        }

            $notifPayload = null;

        DB::transaction(function () use ($item, $order, &$notifPayload) {

            /**
             * =====================================================
             * 1. SIMPAN DATA UNTUK NOTIFIKASI (SEBELUM DELETE)
             * =====================================================
             */
            $productName = $item->product->name ?? '-';
            $qty         = $item->quantity_mins;
            $subtotal         = $item->subtotal;
            $orderId     = $order->id;
            $orderCode     = $order->code;
            $branchId    = Auth::user()->branch_id;
            $actorId     = Auth::id();

            /**
             * =====================================================
             * 2. LOGIKA LAMA ANDA (TIDAK DIUBAH)
             * =====================================================
             */

            // catat retur
            $order->returns()->create([
                'branch_id' => $order->branch_id,
                'date' => now(),
                'notes' => 'dihapus',
                'product_id' => $item->product->id,
                'name' => $item->name,
                'cost' => $item->cost,
                'quantity_plus' => $item->quantity_plus,
                'price' => $item->price,
                'quantity_mins' => $item->quantity_mins,
                'subtotal' => $item->subtotal,        
                'totalweight' => $item->totalweight,        
                'status' => 'return',        
                'user_id' => $item->user_id,
                'created_by' => Auth::user()->id,
                'updated_by' => Auth::user()->id,
            ]);

            // 🔒 lock product
            $product = Product::where('id', $item->product_id)
                ->lockForUpdate()
                ->firstOrFail();

            // ♻️ kembalikan stok
            Product::where('id', $product->id)
                ->increment('stock', $qty);

            // tandai siapa yang menghapus
            $item->update(['deleted_by' => $actorId]);

            // hapus item
            $item->delete();

            // hitung ulang order
            $this->recalculate($order);

            /**
             * =====================================================
             * 3. BUAT NOTIFIKASI (SETELAH DELETE BERHASIL)
             * =====================================================
             */

            $notif = Notification::create([
                'branch_id' => $branchId,
                'actor_id'  => $actorId,
                'audience'  => 'admin',
                'type'      => 'order_item.deleted',
                'notifiable_type' => OrderItem::class,
                'notifiable_id'   => $item->id,
                'data' => [
                    'actor_name' => Auth::user()->name,
                    'order_id' => $orderId,
                    'order_code' => $orderCode,
                    'product'  => $productName,
                    'qty'      => $qty,
                    'subtotal'      => $subtotal,
                ],
            ]);

            // Simpan payload untuk dikirim setelah transaction selesai
            $notifPayload = $notif->toArray(); // ✅ capture, belum push
        });

        // ✅ Push ke Supabase DI LUAR transaction
        // Kalau Supabase sleep/timeout → payment TETAP berhasil
        // Hanya notifikasi realtime yang tidak muncul, tapi data sudah ada di MySQL
        if ($notifPayload) {
            app(SupabaseService::class)->pushNotification($notifPayload);
        }

        return back()->with('success', 'Item berhasil dihapus');
    }


    public function biayaLain(Request $request, Order $order)
    {
        if ($order->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        } 
                 
        // Validasi nilai angka (boleh 0)
        $data = $request->validate([
            'discount' => ['required', 'numeric', 'min:0'],
            'charge'   => ['required', 'numeric', 'min:0'],
            'tax'      => ['required', 'numeric', 'min:0'],
        ]);

        // Update langsung
        $order->update([
            'discount' => $data['discount'],
            'charge'   => $data['charge'],
            'tax'      => $data['tax'],
            'updated_by' => Auth::id(),
        ]);

        // Jika grand_total dihitung manual, tinggal panggil helper:
        if (method_exists($order, 'hitungTotal')) {
            $order->hitungTotal(); // opsional
        }

        $this->recalculate($order);

        return back()->with('success', 'Biaya lain berhasil diperbarui.');
    
    }

    // ============================
    // CREATE PAYMENT
    // ============================
    public function storePayment(Request $request, Order $order)
    {
        if ($order->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        }         

        $data = $request->validate([
            'payment_method' => 'required|string',
            'nominal_plus' => 'nullable|numeric',
            'date' => 'required|date',
        ]);

        DB::transaction(function () use ($data, $order) {

            $data['nominal'] = $data['nominal_plus'];
            $data['mutation_type'] = 'Penjualan';
            $data['user_id'] = $order->user_id;
            $data['branch_id'] = Auth::user()->branch_id;
            $data['created_by'] = Auth::id();
            $data['currency'] = 'IDR';
            $data['debit_akun'] = $this->resolveAkunCashBank($data['payment_method']);
            $data['kredit_akun'] = 'NR-DB Piutang Penjualan';

            $payment = $order->payments()->create($data);

            // 🔁 hitung dulu summary (ini set nominal FINAL)
            $this->updateOrderPaymentSummary($order);

            $payment->refresh();

            // 💰 apply saldo pakai nominal FINAL
            $this->applyPaymentMutation($payment);

        });

        if ($order->paid_amount >= $order->grand_total) {
            $order->update([
                'status' => 'delivered',
            ]);

            $order->items()->update([
                'date'   => $order->date,
                'status'   => $order->status,
                'updated_by' => Auth::id(),
            ]);
        }

        return back()->with('success', 'Payment berhasil ditambahkan');
        
    }


    // ============================
    // UPDATE PAYMENT
    // ============================
    public function updatePayment(Request $request, Payment $payment)
    {
        if ($payment->paymentable->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        }   

        if (! $this->canEditOrDeletePayment($payment)) {
            return back()->with('error', 'Hanya payment terakhir atau payment yang terdapat kembalian yang boleh diedit dan hapus.');
        }

        $data = $request->validate([
            'payment_method' => 'required|string',
            'nominal_plus'   => 'nullable|numeric',
            'date'           => 'required|date',
        ]);

        $notifPayload = null;

        DB::transaction(function () use ($payment, $data, &$notifPayload) {

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
                'nominal_plus'   => $data['nominal_plus'],
                'debit_akun'     => $this->resolveAkunCashBank($data['payment_method']),
                'date'           => $data['date'],
                'updated_by'     => Auth::id(),
            ]);

            // 🔁 HITUNG ULANG SUMMARY (SET nominal FINAL)
            $order = $payment->paymentable;
            $this->updateOrderPaymentSummary($order);

            // 🔄 refresh agar nominal FINAL kebaca
            $payment->refresh();

            // 💰 APPLY saldo BARU (PAKAI AKUN BARU)
            $this->applyPaymentMutation($payment);

            $notif = Notification::create([
                'branch_id'       => $order->branch_id,
                'actor_id'        => Auth::user()->id,
                'audience'        => 'admin',
                'type'            => 'payment.updated',
                'notifiable_type' => Payment::class,
                'notifiable_id'   => $payment->id,
                'data' => [
                    'actor_name'     => Auth::user()->name,
                    'order_id'       => $order->id,
                    'order_code'     => $order->code,
                    'nominal_before' => $oldNominal,
                    'nominal_after'  => $payment->nominal_plus,
                ],
            ]);  

            // Simpan payload untuk dikirim setelah transaction selesai
            $notifPayload = $notif->toArray(); // ✅ capture, belum push
        });

        // ✅ Push ke Supabase DI LUAR transaction
        // Kalau Supabase sleep/timeout → payment TETAP berhasil
        // Hanya notifikasi realtime yang tidak muncul, tapi data sudah ada di MySQL
        if ($notifPayload) {
            app(SupabaseService::class)->pushNotification($notifPayload);
        }

        return back()->with('success', 'Payment berhasil diupdate');
                
    }

    // ============================
    // DELETE PAYMENT
    // ============================
    public function destroyPayment(Payment $payment)
    {
        if ($payment->paymentable->user_id == Auth::user()->id) {
            return back()->with('error', 'Tidak bisa edit milik sendiri.');
        }       

        $order = $payment->paymentable;

        if (Auth::user()->level == null) {
            return back()->with('error', 'Anda tidak berhak menghapus');
        }

        if (! $this->canEditOrDeletePayment($payment)) {
            return back()->with('error', 'Hanya payment terakhir atau payment yang terdapat kembalian yang boleh diedit dan hapus.');
        }

        if (! $order) {
            return back()->with('error', 'Order tidak ditemukan');
        }

        $jumlahPenjualan = $order->payments()
            ->where('mutation_type', 'Penjualan')
            ->count();

        if ($jumlahPenjualan <= 1) {
            return back()->with('error', 'Minimal harus ada satu payment');
        }

        $notifPayload = null;

        DB::transaction(function () use ($payment, $order, &$notifPayload) {

            $nominalDeleted = $payment->nominal;

            if ($order->change_amount > 0) {

                $nominalRollback = $payment->where('mutation_type', 'Penjualan')
                    ->orderBy('date')
                    ->orderBy('id')
                    ->get()
                    ->last()->nominal
                ;

                // rollback debit
                $this->mutateAccountBalance(
                    $payment->branch_id,
                    $payment->debit_akun,
                    $nominalRollback,
                    'credit'
                );

                // rollback kredit
                $this->mutateAccountBalance(
                    $payment->branch_id,
                    $payment->kredit_akun,
                    $nominalRollback,
                    'debit'
                );
            } else {

                $this->rollbackPaymentMutation($payment);
            }

            // 🗑 soft delete payment
            $payment->update(['deleted_by' => Auth::id()]);
            $payment->delete();

            // 🔄 update summary
            $this->updateOrderPaymentSummary($order);

            $notif = Notification::create([
                'branch_id' => $order->branch_id,
                'actor_id'  => Auth::user()->id,
                'audience'  => 'admin',
                'type'      => 'payment.deleted',
                'notifiable_type' => Payment::class,
                'notifiable_id'   => $payment->id,
                'data' => [
                    'actor_name' => Auth::user()->name,
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'nominal'     => $nominalDeleted,
                ],
            ]);

            // Simpan payload untuk dikirim setelah transaction selesai
            $notifPayload = $notif->toArray(); // ✅ capture, belum push
        });

        // ✅ Push ke Supabase DI LUAR transaction
        // Kalau Supabase sleep/timeout → payment TETAP berhasil
        // Hanya notifikasi realtime yang tidak muncul, tapi data sudah ada di MySQL
        if ($notifPayload) {
            app(SupabaseService::class)->pushNotification($notifPayload);
        }

        return back()->with('success', 'Payment berhasil dihapus');
                    
    }



    ////////// RECALCULATE HELPERS //////////

    private function recalculate(Order $order)
    {
            $kembalianSebelumnya = ($order->change_amount > 0) ? $order->change_amount : 0 ;    
            $gtSebelumnya = ($order->grand_total > 0) ? $order->grand_total : 0 ;    

            // 🔢 hitung ulang order
            $subTotal = $order->items()->sum('subtotal');
            $totalCost = $order->items()->sum('totalcost');

            $order->update([
                'sub_total' => $subTotal,
                'grand_total' => $subTotal
                    - $order->discount
                    + $order->charge
                    + $order->tax,
            ]);

            // 🔄 STOK TERJUAL
            $stokPayment = $order->payments()
                ->where('mutation_type', 'Stok Terjual')
                ->first();

            if ($stokPayment) {
                $this->updatePaymentNominalSafely($stokPayment, $totalCost);
            }

            // 🔄 PIUTANG PENJUALAN
            $piutangPayment = $order->payments()
                ->where('mutation_type', 'Piutang Penjualan')
                ->first();

            if ($piutangPayment) {
                $this->updatePaymentNominalSafely(
                    $piutangPayment,
                    $order->grand_total
                );
            }           
                    
            // 🔁 terakhir: cash, kembalian, dll
            $this->updateOrderPaymentSummary($order);


            if ($kembalianSebelumnya > 0 || $order->change_amount > 0) {
                if ($order->grand_total < $gtSebelumnya) {
                    $this->mutateAccountBalance(
                        $order->branch_id,
                        $order->payments()->where('mutation_type', 'Penjualan')->get()->sortBy('date')->last()->debit_akun,
                        abs($kembalianSebelumnya - $order->change_amount),
                        'credit'
                        );
                    $this->mutateAccountBalance(
                        $order->branch_id,
                        'NR-DB Piutang Penjualan',
                        abs($kembalianSebelumnya - $order->change_amount),
                        'debit'
                        );
                } 
                if ($order->grand_total > $gtSebelumnya) {
                    $this->mutateAccountBalance(
                        $order->branch_id,
                        $order->payments()->where('mutation_type', 'Penjualan')->get()->sortBy('date')->last()->debit_akun,
                        abs($kembalianSebelumnya - $order->change_amount),
                        'debit'
                        );
                    $this->mutateAccountBalance(
                        $order->branch_id,
                        'NR-DB Piutang Penjualan',
                        abs($kembalianSebelumnya - $order->change_amount),
                        'credit'
                        );
                } 
            }

            if ($order->change_amount <= 0) {
                if ($kembalianSebelumnya > 0) {
                    $this->mutateAccountBalance(
                        $order->branch_id,
                        $order->payments()->where('mutation_type', 'Penjualan')->get()->sortBy('date')->last()->debit_akun,
                        abs($order->grand_total - $order->paid_amount),
                        'credit'
                        );
                    $this->mutateAccountBalance(
                        $order->branch_id,
                        'NR-DB Piutang Penjualan',
                        abs($order->grand_total - $order->paid_amount),
                        'debit'
                        );
                }            
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

            // $payment->refresh();
            // 3️⃣ apply saldo
            // rollback debit

            // $this->mutateAccountBalance(
            //     $refund->branch_id,
            //     $refund->kredit_akun,
            //     $target->nominal - $target->nominal,
            //     'debit'
            // );

        }

    }

    private function canEditOrDeletePayment(Payment $payment): bool
    {
        $payments = $payment->paymentable
            ->payments()
            ->where('mutation_type', 'Penjualan')
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        // 1. Jika payment ini memiliki nominal_mins != 0 → BOLEH
        if ($payment->nominal_mins != 0) {
            return true;
        }

        // 2. Cek apakah ada payment lain yang punya nominal_mins != 0
        $hasNominalMins = $payments->contains(fn ($p) => $p->nominal_mins != 0);

        // Jika ADA nominal_mins (tapi bukan payment ini), maka payment ini TIDAK BOLEH
        if ($hasNominalMins) {
            return false;
        }

        // 3. Jika SEMUA nominal_mins = 0 → hanya last payment yang boleh
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

    public function print(Order $order)
    {
        $order->load(['user', 'items.product']);

        // ✅ Generate barcode SVG
        $generator = new BarcodeGeneratorSVG();
        $barcodeSvg = $generator->getBarcode(
            $order->code, 
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
        $qrSvg = $writer->writeString($order->code);

        return Inertia::render('Penjualan/Print', [
            'order'      => $order,
            'barcodeSvg' => $barcodeSvg, 
            'qrSvg'      => $qrSvg,
        ])->withViewData(['layout' => false]);
    } 

public function export(Request $request)
{
    $paymentStatus = $request->get('payment_status', 'all');
    $orderStatus   = $request->get('order_status');
    $search        = $request->get('search', '');

    $startDate = $request->get('start_date')
        ?? Carbon::parse('2026-01-01 00:00:00')->toDateString();

    $endDate = $request->get('end_date')
        ?? Carbon::today()->toDateString();

    $orders = Order::query()
        ->whereBranchId(Auth::user()->branch_id)
        ->with([
            'user',
            'items.product',
            'payments' => fn($q) => $q->where('mutation_type', 'Penjualan')->orderBy('date'),
        ])
        ->when($startDate, fn($q) => $q->whereDate('date', '>=', $startDate))
        ->when($endDate,   fn($q) => $q->whereDate('date', '<=', $endDate))
        ->when($paymentStatus === 'paid',   fn($q) => $q->whereColumn('paid_amount', '>=', 'grand_total'))
        ->when($paymentStatus === 'unpaid', fn($q) => $q->whereColumn('paid_amount', '<',  'grand_total'))
        ->when(
            $orderStatus,
            fn($q) => $q->where('status', $orderStatus),
            fn($q) => $q->where('status', '!=', 'canceled')
        )
        ->when($search, function ($q) use ($search) {
            $q->where(function ($x) use ($search) {
                $x->where('code', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"))
                  ->orWhere('user_alias', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        })
        ->orderBy('date', 'asc')
        ->get();

    // ============================================================
    // BUILD ROWS: Section 1 (Orders) + gap + Section 2 (Items) + gap + Section 3 (Payments)
    // ============================================================
    $rows = collect();

    // ── SECTION 1: HEADER ORDERS ─────────────────────────────
    $rows->push([
        'A' => '== DAFTAR PENJUALAN ==',
        'B' => '', 'C' => '', 'D' => '', 'E' => '',
        'F' => '', 'G' => '', 'H' => '', 'I' => '',
        'J' => '', 'K' => '', 'L' => '', 'M' => '',
        'N' => '', 'O' => '', 'P' => '', 'Q' => '',
    ]);

    $rows->push([
        'A' => 'Tanggal',
        'B' => 'Kode',
        'C' => 'Q',
        'D' => 'Status Order',
        'E' => 'Type',
        'F' => 'Customer',
        'G' => 'Alias',
        'H' => 'Notes',
        'I' => 'Sub Total',
        'J' => 'Diskon',
        'K' => 'Charge',
        'L' => 'Pajak',
        'M' => 'Grand Total',
        'N' => 'Dibayar',
        'O' => 'Sisa',
        'P' => 'Metode',
        'Q' => 'Status Bayar',
    ]);

    foreach ($orders as $order) {
        $sisa           = max($order->grand_total - $order->paid_amount, 0);
        $paymentMethods = $order->payments->pluck('payment_method')->filter()->unique()->implode(', ');

        $rows->push([
            'A' => $order->date,
            'B' => $order->code,
            'C' => $order->q,
            'D' => $order->status,
            'E' => $order->type,
            'F' => $order->user?->name ?? '-',
            'G' => $order->user_alias ?? '-',
            'H' => $order->notes ?? '-',
            'I' => (int) $order->sub_total,
            'J' => (int) $order->discount,
            'K' => (int) $order->charge,
            'L' => (int) $order->tax,
            'M' => (int) $order->grand_total,
            'N' => (int) $order->paid_amount,
            'O' => (int) $sisa,
            'P' => $paymentMethods,
            'Q' => $order->paid_amount >= $order->grand_total ? 'Paid' : 'Unpaid',
        ]);
    }

    // ── GAP ──────────────────────────────────────────────────
    $rows->push(['A' => '', 'B' => '', 'C' => '', 'D' => '', 'E' => '',
                 'F' => '', 'G' => '', 'H' => '', 'I' => '',
                 'J' => '', 'K' => '', 'L' => '', 'M' => '',
                 'N' => '', 'O' => '', 'P' => '', 'Q' => '']);

    // ── SECTION 2: HEADER ITEMS ───────────────────────────────
    $rows->push([
        'A' => '== DETAIL ITEM TERJUAL ==',
        'B' => '', 'C' => '', 'D' => '', 'E' => '',
        'F' => '', 'G' => '', 'H' => '', 'I' => '',
        'J' => '', 'K' => '', 'L' => '', 'M' => '',
        'N' => '', 'O' => '', 'P' => '', 'Q' => '',
    ]);

    $rows->push([
        'A' => 'Tanggal',
        'B' => 'Kode Order',
        'C' => 'Customer',
        'D' => 'Alias',
        'E' => 'Produk',
        'F' => 'ID Produk',
        'G' => 'Harga (Price)',
        'H' => 'Qty',
        'I' => 'Subtotal',
        'J' => 'Cost',
        'K' => 'Total Cost',
        'L' => 'Status',
        'M' => '',
        'N' => '', 'O' => '', 'P' => '', 'Q' => '',
    ]);

    foreach ($orders as $order) {
        foreach ($order->items as $item) {
            $rows->push([
                'A' => $item->date ?? $order->date,
                'B' => $order->code,
                'C' => $order->user?->name ?? '-',
                'D' => $order->user_alias ?? '-',
                'E' => $item->name,
                'F' => $item->product_id,
                'G' => (int) $item->price,
                'H' => (int) $item->quantity_mins,
                'I' => (int) $item->subtotal,
                'J' => (int) $item->cost,
                'K' => (int) $item->totalcost,
                'L' => $item->status,
                'M' => '',
                'N' => '', 'O' => '', 'P' => '', 'Q' => '',
            ]);
        }
    }

    // ── GAP ──────────────────────────────────────────────────
    $rows->push(['A' => '', 'B' => '', 'C' => '', 'D' => '', 'E' => '',
                 'F' => '', 'G' => '', 'H' => '', 'I' => '',
                 'J' => '', 'K' => '', 'L' => '', 'M' => '',
                 'N' => '', 'O' => '', 'P' => '', 'Q' => '']);

    // ── SECTION 3: HEADER PAYMENTS ────────────────────────────
    $rows->push([
        'A' => '== PEMBAYARAN ==',
        'B' => '', 'C' => '', 'D' => '', 'E' => '',
        'F' => '', 'G' => '', 'H' => '', 'I' => '',
        'J' => '', 'K' => '', 'L' => '', 'M' => '',
        'N' => '', 'O' => '', 'P' => '', 'Q' => '',
    ]);

    $rows->push([
        'A' => 'Tanggal Bayar',
        'B' => 'Kode Order',
        'C' => 'Customer',
        'D' => 'Alias',
        'E' => 'Metode',
        'F' => 'Nominal',
        'G' => 'Kembalian',
        'H' => 'Nett',
        'I' => '',
        'J' => '', 'K' => '', 'L' => '', 'M' => '',
        'N' => '', 'O' => '', 'P' => '', 'Q' => '',
    ]);

    foreach ($orders as $order) {
        foreach ($order->payments as $payment) {
            $rows->push([
                'A' => $payment->date,
                'B' => $order->code,
                'C' => $order->user?->name ?? '-',
                'D' => $order->user_alias ?? '-',
                'E' => $payment->payment_method ?? '-',
                'F' => (int) $payment->nominal_plus,
                'G' => (int) ($payment->nominal_mins ?? 0),
                'H' => (int) $payment->nominal,
                'I' => '',
                'J' => '', 'K' => '', 'L' => '', 'M' => '',
                'N' => '', 'O' => '', 'P' => '', 'Q' => '',
            ]);
        }
    }

    $filename = 'penjualan_' . $startDate . '_sd_' . $endDate . '.xlsx';

    return (new \Rap2hpoutre\FastExcel\FastExcel($rows))
        ->download($filename, function ($row) {
            return $row;
        });
}

}