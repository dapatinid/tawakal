<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Rap2hpoutre\FastExcel\FastExcel;

class StokController extends Controller
{
    public function index(Request $request)
    {
        // =======================
        // SMART DATE DEFAULT
        // =======================
        $isFirstLoad = $request->query->count() === 0;

        $startDate = $request->get('date_from');
        $endDate   = $request->get('date_to');

        if ($isFirstLoad) {
            $startDate = Carbon::parse('2026-01-01 00:00:00')->toDateString();
            $endDate   = Carbon::today()->toDateString();
        }

        $allowedColumns = ['date','name','status','created_at','updated_at'];
        $orderBy  = $request->input('order_by', 'date');
        $orderDir = $request->input('order_dir', 'desc');

        if (!in_array($orderBy, $allowedColumns)) $orderBy = 'date';
        if (!in_array($orderDir, ['asc','desc'])) $orderDir = 'desc';

        // Tentukan kolom tanggal berdasarkan orderBy
        $dateColumn = match ($orderBy) {
            'created_at' => 'order_items.created_at',  // tambah prefix
            'updated_at' => 'order_items.updated_at',  // tambah prefix
            default      => 'order_items.date',         // tambah prefix
        };

        $status = $request->get('status');
        $viewMode = $request->get('view', 'list'); // 'list' atau 'grouped'

        // =======================
        // BASE QUERY
        // =======================
        $baseQuery = OrderItem::query()->with(['branch','userCre','userUpd','itemable', 'userName'])
            ->where('order_items.branch_id', Auth::user()->branch_id)
            ->when(
                $status,
                fn ($q) => $q->where('order_items.status', $status),
                fn ($q) => $q->where('order_items.status', '!=', 'canceled')
            )
            ->when($startDate, fn ($q) => $q->whereDate($dateColumn, '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate($dateColumn, '<=', $endDate));


        // =======================
        // FILTER PRODUCT
        // =======================
        if ($request->filled('product_id')) {
            $baseQuery->where('product_id', $request->product_id);
        }

        // =======================
        // FILTER FLAG (polymorphic)
        // =======================
        if ($request->filled('flag')) {
            $flag = $request->flag;
            $baseQuery->whereHasMorph(
                'itemable',
                [
                    \App\Models\Order::class,
                    \App\Models\PurchaseOrder::class,
                    \App\Models\AdjustmentStock::class
                ],
                fn ($m) => $m->where('flag', $flag)
            );
        }

        // =======================
        // FILTER USER ADMIN
        // =======================
        if ($request->filled('user_admin')) {
            $baseQuery->where(function ($q) use ($request) {
                $q->where('created_by', $request->user_admin)
                ->orWhere('updated_by', $request->user_admin);
            });
        }

        // =======================
        // GROUPED VIEW
        // =======================
        if ($viewMode === 'grouped') {
            $groupedData = $this->getGroupedData($baseQuery);

            return Inertia::render('Stok/Index', [
                'admins' => User::where('branch_id', Auth::user()->branch_id)->whereIsAdmin(true)->get(['id', 'name']),
                'stokList' => null,
                'summary'  => null,
                'groupedData' => $groupedData,
                'products' => Product::query()
                    ->where('branch_id', Auth::user()->branch_id)
                    ->orderBy('stock','desc')
                    ->when($request->filled('product_search'), function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->product_search}%")
                          ->orWhere('id', $request->product_search);
                    })
                    ->limit(20)
                    ->get(['id','name','stock']),
                'filters'  => [
                    'product_id'     => $request->product_id,
                    'product_search' => $request->product_search,
                    'date_from'      => $startDate,
                    'date_to'        => $endDate,
                    'flag'           => $request->flag,
                    'status'         => $status,
                    'order_by'       => 'name',
                    'order_dir'      => 'asc',
                    'user_admin'     => $request->user_admin,
                    'view'           => $viewMode,
                ],
            ]);
        }

        // =======================
        // LIST VIEW (existing logic)
        // =======================
        $baseQuery->orderBy($orderBy, $orderDir);

        // SUMMARY
        $summaryQuery = clone $baseQuery;
        $summary = [
            'total_qty_plus' => $summaryQuery->sum('quantity_plus'),
            'total_qty_mins' => $summaryQuery->sum('quantity_mins'),
            'total_totalcost' => (clone $summaryQuery)->sum('totalcost'),
            'total_subtotal' => (clone $summaryQuery)->sum('subtotal'),
        ];

        // PAGINATION
        $stokList = $baseQuery
            ->paginate(10)
            ->through(function ($item) {
                $item->itemable_url = match ($item->itemable_type) {
                    \App\Models\Order::class => route('penjualan.show', $item->itemable_id),
                    \App\Models\PurchaseOrder::class => route('pembelian.show', $item->itemable_id),
                    \App\Models\AdjustmentStock::class => route('penyesuaian-stok.edit', $item->itemable_id),
                    \App\Models\Product::class => route('produk.preview', $item->itemable_id),
                    default => null,
                };
                $item->flag = $item->itemable?->flag;
                $item->code = $item->itemable?->code ?? '-';
                $item->user_name = $item->itemable?->userName->name ?? '-';
                return $item;
            })
            ->withQueryString();

        $products = Product::query()
            ->where('branch_id', Auth::user()->branch_id)
            ->orderBy('stock','desc')
            ->when($request->filled('product_search'), function ($q) use ($request) {
                $search = strtolower($request->product_search);
                $q->where(function($inner) use ($search) {
                    // Pencarian nama case-insensitive
                    $inner->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                    
                    // Pencarian ID hanya jika input adalah angka (mencegah error Postgres)
                    if (is_numeric($search)) {
                        $inner->orWhere('id', $search);
                    }
                });
            })
            ->limit(20)
            ->get(['id','name','stock']);

        return Inertia::render('Stok/Index', [
            'admins' => User::where('branch_id', Auth::user()->branch_id)->whereIsAdmin(true)->get(['id', 'name']),
            'stokList' => $stokList,
            'summary'  => $summary,
            'groupedData' => null,
            'products' => $products,
            'filters'  => [
                'product_id'     => $request->product_id,
                'product_search' => $request->product_search,
                'date_from'      => $startDate,
                'date_to'        => $endDate,
                'flag'           => $request->flag,
                'status'         => $status,
                'order_by'       => $orderBy,
                'order_dir'      => $orderDir,
                'user_admin'     => $request->user_admin,
                'view'           => $viewMode,
            ],
        ]);
    }

    /**
     * Get grouped data by product with flag aggregation
     */
    private function getGroupedData($baseQuery)
    {
        // Clone query untuk join dengan itemable
        $query = clone $baseQuery;

        // Join dengan tabel Order untuk mendapatkan flag
        $query->leftJoin('orders', function ($join) {
            $join->on('order_items.itemable_id', '=', 'orders.id')
                 ->where('order_items.itemable_type', '=', \App\Models\Order::class);
        })
        ->leftJoin('purchase_orders', function ($join) {
            $join->on('order_items.itemable_id', '=', 'purchase_orders.id')
                 ->where('order_items.itemable_type', '=', \App\Models\PurchaseOrder::class);
        })
        ->leftJoin('adjustment_stocks', function ($join) {
            $join->on('order_items.itemable_id', '=', 'adjustment_stocks.id')
                 ->where('order_items.itemable_type', '=', \App\Models\AdjustmentStock::class);
        });

        $query->from('order_items');

        // Grouping dengan conditional SUM
        $grouped = $query->select([
            'order_items.product_id',
            'order_items.name as product_name',

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'Penjualan'
                THEN order_items.quantity_mins ELSE 0 END) as qty_jual"),

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'Pembelian'
                THEN order_items.quantity_plus ELSE 0 END) as qty_beli"),

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'opname'
                THEN order_items.quantity_plus ELSE 0 END) as qty_opname_plus"),
            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'opname'
                THEN order_items.quantity_mins ELSE 0 END) as qty_opname_mins"),

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'production'
                THEN order_items.quantity_plus ELSE 0 END) as qty_production_plus"),
            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'production'
                THEN order_items.quantity_mins ELSE 0 END) as qty_production_mins"),

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'tf_out'
                THEN order_items.quantity_mins ELSE 0 END) as qty_tf_out"),

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag, adjustment_stocks.flag) = 'tf_in'
                THEN order_items.quantity_plus ELSE 0 END) as qty_tf_in"),

            DB::raw("SUM(order_items.quantity_plus) as total_qty_plus"),
            DB::raw("SUM(order_items.quantity_mins) as total_qty_mins"),
            DB::raw("SUM(CASE WHEN order_items.status NOT IN ('new', 'canceled')
                THEN order_items.quantity_plus - order_items.quantity_mins ELSE 0 END) as total_gudang"),

        ])
        ->groupBy('order_items.product_id', 'order_items.name')
        ->orderByDesc('qty_jual')  
        ->orderBy('order_items.name', 'asc')
        ->get();


        return $grouped;
    }


    public function export(Request $request)
    {
        $startDate = $request->get('date_from');
        $endDate   = $request->get('date_to');
        $status    = $request->get('status');

        $query = OrderItem::query()
            ->where('order_items.branch_id', Auth::user()->branch_id)
            ->when(
                $status,
                fn ($q) => $q->where('order_items.status', $status),
                fn ($q) => $q->where('order_items.status', '!=', 'canceled')
            )
            ->when($startDate, fn ($q) => $q->whereDate('order_items.date', '>=', $startDate))
            ->when($endDate,   fn ($q) => $q->whereDate('order_items.date', '<=', $endDate))
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->product_id))
            ->when($request->filled('flag'), function ($q) use ($request) {
                $q->whereHasMorph(
                    'itemable',
                    [
                        \App\Models\Order::class,
                        \App\Models\PurchaseOrder::class,
                        \App\Models\AdjustmentStock::class,
                    ],
                    fn ($m) => $m->where('flag', $request->flag)
                );
            })
            ->when($request->filled('user_admin'), function ($q) use ($request) {
                $q->where(function ($inner) use ($request) {
                    $inner->where('created_by', $request->user_admin)
                        ->orWhere('updated_by', $request->user_admin);
                });
            })
            ->orderBy('order_items.date', 'asc')
            ->select('order_items.*');
            
            $totalsQuery = (clone $query);
            $totalsQuery->getQuery()->columns = []; 
            $totalsQuery->getQuery()->orders  = []; 

            $totals = $totalsQuery->selectRaw('
                SUM(cost) as total_cost, 
                SUM(price) as total_price, 
                SUM(subtotal) as total_stok_plus, 
                SUM(totalcost) as total_stok_mins
            ')->first();

        $rows = (function () use ($query, $totals) {
            $page   = 1;
            $chunk  = 200;
            $lastId = 0;

            while (true) {
                $items = (clone $query)
                    ->with(['branch', 'userCre', 'userUpd', 'itemable'])
                    ->where('order_items.id', '>', $lastId)
                    ->orderBy('order_items.id')   // chunkById butuh order by id
                    ->limit($chunk)
                    ->get();

                if ($items->isEmpty()) break;

                foreach ($items as $item) {
                    yield $item;
                }

                $lastId = $items->last()->id;

                if ($items->count() < $chunk) break;
            }

            yield (object) [
                    'is_summary'      => true,
                    'total_cost'      => $totals->total_cost,
                    'total_price'     => $totals->total_price,
                    'total_stok_plus' => $totals->total_stok_plus,
                    'total_stok_mins' => $totals->total_stok_mins,
                ];   

        })();

        $filename = 'stok_' . ($startDate ?? 'all') . '_sd_' . ($endDate ?? 'all') . '.xlsx';

        return (new FastExcel($rows))->download($filename, function ($item) {
                // 3. Cek apakah ini baris summary atau data biasa
                if (isset($item->is_summary)) {
                    return [
                        'Tanggal'     => 'SUMMARY',
                        'Kode'        => '',
                        'Nama User'   => 'Perkiaraan Margin',
                        'Nama Alias'  => (int) $item->total_price - (int) $item->total_cost,
                        'Produk'      => '',
                        'ID Produk'   => '',
                        'Type'        => '',
                        'Status'      => '',
                        'Cost'        => (int) $item->total_cost, // Isi total cost
                        'Qty+'        => '',
                        'Stok(Rp)+'   => '',
                        'Price'       => (int) $item->total_price, // Isi total price
                        'Qty-'        => '',
                        'Stok(Rp)-'   => '',
                        'Dibuat Oleh' => '',
                        'Dibuat Pada' => '',
                        'Diubah Oleh' => '',
                        'Diubah Pada' => '',
                        'Cabang'      => '',
                    ];
                }

                // Mapping data biasa (Gunakan (int) untuk hilangkan desimal)
                $flag = $item->itemable?->flag ?? 'Perubahan Harga';
                return [
                    'Tanggal'     => $item->date,
                    'Kode'        => $item->itemable?->code ?? '-',
                    'Nama User'   => $item->itemable?->user?->name ?? '-',
                    'Nama Alias'  => $item->itemable?->user_alias ?? '-',
                    'Produk'      => $item->name,
                    'ID Produk'   => $item->product_id,
                    'Type'        => $flag,
                    'Status'      => $item->status,
                    'Cost'        => (int) $item->cost,
                    'Qty+'        => $item->quantity_plus,
                    'Stok(Rp)+'   => (int) $item->subtotal,
                    'Price'       => (int) $item->price,
                    'Qty-'        => $item->quantity_mins,
                    'Stok(Rp)-'   => (int) $item->totalcost,
                    'Dibuat Oleh' => $item->userCre?->name  ?? '-',
                    'Dibuat Pada' => $item->created_at?->format('Y-m-d H:i:s'),
                    'Diubah Oleh' => $item->userUpd?->name  ?? '-',
                    'Diubah Pada' => $item->updated_at?->format('Y-m-d H:i:s'),
                    'Cabang'      => $item->branch?->name   ?? '-',
                ];
            });
    }
}