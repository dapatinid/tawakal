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

class TransaksiController extends Controller
{



    public function index(Request $request)
    {
        $paymentStatus = $request->get('payment_status', 'all');
        $orderStatus   = $request->get('order_status');
        $search        = $request->get('search', '');
                
        $startDate = $request->get('start_date')
            // ?? Carbon::now()->startOfYear()->toDateString();
            ?? Carbon::parse('2026-01-01 00:00:00')->toDateString();

        $endDate = $request->get('end_date')
            ?? Carbon::now()->endOfMonth()->toDateString();


        // ===============================
        // BASE QUERY (SATU SUMBER KEBENARAN)
        // ===============================
        $baseQuery = Order::query()->whereUserId(Auth::user()->id)
            ->with(['items', 'user', 'branch'])

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
                $q->where(function ($x) use ($search) {
                    $x->where('code', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) =>
                        $u->where('name', 'like', "%{$search}%")
                    )
                    ->orWhere('user_alias', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
                });
            });

        // ===============================
        // SUMMARY (TIDAK TERPENGARUH PAGINATION)
        // ===============================
        $summary = (clone $baseQuery)
            ->selectRaw('
                COUNT(*) as total_order,
                SUM(grand_total) as total_grand,
                SUM(paid_amount) as total_paid,
                SUM(GREATEST(grand_total - paid_amount, 0)) as total_unpaid
            ')
            ->first();

        // ===============================
        // PAGINATED DATA
        // ===============================
        $orders = (clone $baseQuery)
            ->latest()
            ->paginate(100)
            ->withQueryString();

        $orderUnpaid =  Order::whereUserId(Auth::user()->id)->where('change_amount', '<', 0)->count();

        return inertia('Transaksi/Index', [
            'orders'  => $orders,
            'orderUnpaid' => $orderUnpaid,
            'summary' => $summary,
            'filters' => [
                'payment_status' => $paymentStatus,
                'order_status'   => $orderStatus,
                'search'         => $search,
                'start_date'     => $startDate,
                'end_date'       => $endDate,
            ],
        ]);
    }


}