<?php

namespace App\Http\Controllers;

use App\Models\ReturnItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReturController extends Controller
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
            'created_at' => 'return_items.created_at',  // tambah prefix
            'updated_at' => 'return_items.updated_at',  // tambah prefix
            default      => 'return_items.date',         // tambah prefix
        };

        $status = $request->get('status');
        $viewMode = $request->get('view', 'list'); // 'list' atau 'grouped'

        // =======================
        // BASE QUERY
        // =======================
        $baseQuery = ReturnItem::query()->with(['branch','userCre','userUpd','returnable'])
            ->where('return_items.branch_id', Auth::user()->branch_id)
            ->when(
                $status,
                fn ($q) => $q->where('return_items.status', $status),
                fn ($q) => $q->where('return_items.status', '!=', 'canceled')
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
                'returnable',
                [
                    \App\Models\Order::class,
                    \App\Models\PurchaseOrder::class,
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

            return Inertia::render('Retur/Index', [
                'admins' => User::where('branch_id', Auth::user()->branch_id)->whereIsAdmin(true)->get(['id', 'name']),
                'stokList' => null,
                'summary'  => null,
                'groupedData' => $groupedData,
                'products' => Product::query()
                    ->where('branch_id', Auth::user()->branch_id)
                    ->orderBy('stock','desc')
                    ->when($request->filled('product_search'), function ($q) use ($request) {
                        $q->where(function ($qq) use ($request) {
                            $qq->where('name', 'like', "%{$request->product_search}%")
                            ->orWhere('id', $request->product_search);
                        });
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
                $item->returnable_url = match ($item->returnable_type) {
                    \App\Models\Order::class => route('penjualan.show', $item->returnable_id),
                    \App\Models\PurchaseOrder::class => route('pembelian.show', $item->returnable_id),
                    default => null,
                };
                $item->flag = $item->returnable?->flag;
                $item->code = $item->returnable?->code ?? '-';
                return $item;
            })
            ->withQueryString();

        $products = Product::query()
            ->where('branch_id', Auth::user()->branch_id)
            ->orderBy('stock', 'desc')
            ->when($request->filled('product_search'), function ($q) use ($request) {
                $search = strtolower($request->product_search);
                
                $q->where(function ($qq) use ($search) {
                    // Gunakan LOWER untuk pencarian Nama (Case-Insensitive)
                    $qq->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                    
                    // Cek is_numeric agar tidak error di PostgreSQL saat membandingkan ID
                    if (is_numeric($search)) {
                        $qq->orWhere('id', $search);
                    }
                });
            })
            ->limit(20)
            ->get(['id', 'name', 'stock']);

        return Inertia::render('Retur/Index', [
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
        // Clone query untuk join dengan returnable
        $query = clone $baseQuery;

        // Join dengan tabel Order untuk mendapatkan flag
        $query->leftJoin('orders', function ($join) {
            $join->on('return_items.returnable_id', '=', 'orders.id')
                 ->where('return_items.returnable_type', '=', \App\Models\Order::class);
        })
        ->leftJoin('purchase_orders', function ($join) {
            $join->on('return_items.returnable_id', '=', 'purchase_orders.id')
                 ->where('return_items.returnable_type', '=', \App\Models\PurchaseOrder::class);
        });


        // Grouping dengan conditional SUM
        $grouped = $query->select([
            'return_items.product_id',
            'return_items.name as product_name',

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag) = 'Penjualan'
                THEN return_items.quantity_mins ELSE 0 END) as qty_jual"),

            DB::raw("SUM(CASE WHEN COALESCE(orders.flag, purchase_orders.flag) = 'Pembelian'
                THEN return_items.quantity_plus ELSE 0 END) as qty_beli"),

        ])
        ->groupBy('return_items.product_id', 'return_items.name')
        ->orderByDesc('qty_jual')  
        ->orderBy('return_items.name', 'asc')
        ->get();


        return $grouped;
    }


}