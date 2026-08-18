<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    
    public function index()
    {

        if (Auth::user()->is_admin != 1) {
                return redirect()->route('transaksi.index');
        } else {
            
                $user = Auth::user();

                // ======================
                // DASHBOARD STATS
                // ======================
                $dashboardStats = [
                    'orderCount' => Order::whereBranchId($user->branch_id)
                        ->where('status', '!=', 'canceled')
                        ->count(),

                    'orderCountNominal' => Order::whereBranchId($user->branch_id)
                        ->where('status', '!=', 'canceled')
                        ->sum('grand_total'),

                    'orderPending' => Order::whereBranchId($user->branch_id)
                        ->where('status', '!=', 'canceled')
                        ->where('change_amount', '<', 0)
                        ->count(),

                    'orderPendingNominal' => Order::whereBranchId($user->branch_id)
                        ->where('status', '!=', 'canceled')
                        ->where('change_amount', '<', 0)
                        ->sum('change_amount'),

                    'orderPaid' => Order::whereBranchId($user->branch_id)
                        ->where('status', '!=', 'canceled')
                        ->whereColumn('paid_amount', '>=', 'grand_total')
                        ->count(),

                    'orderPaidNominal' => Order::whereBranchId($user->branch_id)
                        ->where('status', '!=', 'canceled')
                        ->whereColumn('paid_amount', '>=', 'grand_total')
                        ->sum('grand_total'),
                ];

                // ======================
                // CHART (kode kamu tetap)
                // ======================
                $today = Carbon::now('Asia/Jakarta')->startOfDay();

                $dates = collect();
                for ($i = 6; $i >= 0; $i--) {
                    $dates->push($today->copy()->subDays($i));
                }

                $ordersRaw = Order::whereBranchId($user->branch_id)
                    ->whereBetween('date', [$today->copy()->subDays(6), $today->copy()->endOfDay()])
                    ->get(['date', 'grand_total']);

                $paymentsRaw = Payment::whereBranchId($user->branch_id)
                    ->where('mutation_type', 'Penjualan')
                    ->whereBetween('date', [$today->copy()->subDays(6), $today->copy()->endOfDay()])
                    ->get(['date', 'nominal']);

                $ordersMap = [];
                foreach ($ordersRaw as $o) {
                    $d = Carbon::parse($o->date)->timezone('Asia/Jakarta')->format('Y-m-d');
                    $ordersMap[$d] = ($ordersMap[$d] ?? 0) + $o->grand_total;
                }

                $paymentsMap = [];
                foreach ($paymentsRaw as $p) {
                    $d = Carbon::parse($p->date)->timezone('Asia/Jakarta')->format('Y-m-d');
                    $paymentsMap[$d] = ($paymentsMap[$d] ?? 0) + $p->nominal;
                }

                $chartData = $dates->map(function ($d) use ($ordersMap, $paymentsMap) {
                    $key = $d->format('Y-m-d');
                    return [
                        'date' => $key,
                        'order_total' => $ordersMap[$key] ?? 0,
                        'payment_total' => $paymentsMap[$key] ?? 0,
                    ];
                });

                // 1. TOP 10 PRODUK (30 Bulan Terakhir)
                $thirtyMonthsAgo = Carbon::now()->subMonths(30)->startOfDay();
                $topProducts = OrderItem::where('branch_id', $user->branch_id)
                    ->where('date', '>=', $thirtyMonthsAgo)
                    ->select('name', DB::raw('SUM(quantity_mins) as total_qty'))
                    ->groupBy('name')
                    ->orderByDesc('total_qty')
                    ->limit(10)
                    ->get();

                // 2. PAYMENT METHODS (Today & Yesterday)
                $todayStr = Carbon::now('Asia/Jakarta')->format('Y-m-d');
                $yesterdayStr = Carbon::now('Asia/Jakarta')->subDay()->format('Y-m-d');

                $todayPayments = Payment::where('branch_id', $user->branch_id)
                    ->whereDate('date', $todayStr)
                    ->where('mutation_type', 'Penjualan')
                    ->select('payment_method', DB::raw('SUM(nominal) as total'))
                    ->groupBy('payment_method')
                    ->get();

                $yesterdayPayments = Payment::where('branch_id', $user->branch_id)
                    ->whereDate('date', $yesterdayStr)
                    ->where('mutation_type', 'Penjualan')
                    ->select('payment_method', DB::raw('SUM(nominal) as total'))
                    ->groupBy('payment_method')
                    ->get();

                return Inertia::render('Dashboard', [
                    'dashboardStats' => $dashboardStats,
                    'chartData'      => $chartData,
                    'topProducts'    => $topProducts,
                    'paymentStats'   => [
                        'today'     => $todayPayments->values(),
                        'yesterday' => $yesterdayPayments->values(),
                    ],
                ]);
        }
    }

}
