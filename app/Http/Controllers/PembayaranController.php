<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class PembayaranController extends Controller
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

        $allowedColumns = ['date', 'payment_method', 'mutation_type', 'created_at', 'updated_at'];
        $orderBy  = $request->input('order_by', 'date');
        $orderDir = $request->input('order_dir', 'desc');

        if (!in_array($orderBy, $allowedColumns)) $orderBy = 'date';
        if (!in_array($orderDir, ['asc','desc'])) $orderDir = 'desc';

        // Tentukan kolom tanggal berdasarkan orderBy
        $dateColumn = match ($orderBy) {
            'created_at' => 'created_at',
            'updated_at' => 'updated_at',
            default      => 'date',
        };

        // =======================
        // BASE QUERY
        // =======================
        $baseQuery = Payment::whereBranchId(Auth::user()->branch_id)
            ->where('mutation_type', '!=', 'Kembalian')
            ->where(function ($q) {
                $q->where('debit_akun', 'like', '%CASH / BANK%')
                  ->orWhere('kredit_akun', 'like', '%CASH / BANK%');
            })
            ->with([
                'branch:id,name',
                'user:id,name',
                'userCre:id,name',
                'userUpd:id,name',
                'paymentable',
            ])
            // FILTER TANGGAL
            ->when($startDate, fn($q) => $q->whereDate($dateColumn, '>=', $startDate))
            ->when($endDate,   fn($q) => $q->whereDate($dateColumn, '<=', $endDate));

        // =======================
        // FILTER PAYMENT METHOD
        // =======================
        if ($request->filled('payment_method')) {
            $baseQuery->where('payment_method', $request->payment_method);
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
        // FILTER PAYMENT METHOD
        // =======================
        if ($request->filled('payment_method')) {
            $baseQuery->where('payment_method', $request->payment_method);
        }

        // =======================
        // SEARCH (USER NAME, MUTATION, POLYMORPHIC USER_ALIAS)
        // =======================
        if ($request->filled('search')) {
            // Ubah search string menjadi huruf kecil
            $search = strtolower($request->search);

            $baseQuery->where(function ($q) use ($search) {
                $q->whereHas('user', fn($u) =>
                    // Gunakan whereRaw untuk memaksa perbandingan huruf kecil
                    $u->whereRaw('LOWER(name) like ?', ["%{$search}%"])
                )
                // Gunakan whereRaw juga untuk kolom di tabel payments
                ->orWhereRaw('LOWER(mutation_type) like ?', ["%{$search}%"])
                ->orWhereHasMorph(
                    'paymentable',
                    [
                        \App\Models\Order::class,
                        \App\Models\PurchaseOrder::class,
                        \App\Models\Journal::class
                    ],
                    fn($m) => $m->whereRaw('LOWER(user_alias) like ?', ["%{$search}%"])
                                ->orWhereRaw('LOWER(notes) like ?', ["%{$search}%"])
                );
            });
        }

        // =======================
        // ORDER BY
        // =======================

        $baseQuery->orderBy($orderBy, $orderDir);

        // =======================
        // SUMMARY (dihitung terpisah dari paginate)
        // =======================
        $summaryQuery = clone $baseQuery;

        $summary = [
            'total_nominal' =>
                (clone $summaryQuery)->where('debit_akun', 'like', '%CASH / BANK%')->sum('nominal')
              - (clone $summaryQuery)->where('kredit_akun', 'like', '%CASH / BANK%')->sum('nominal'),
        ];

        // =======================
        // PAGINATION
        // =======================
        $payments = $baseQuery
            ->paginate(10)
            ->through(function ($payment) {
                $payment->paymentable_url = match ($payment->paymentable_type) {
                    \App\Models\Order::class => route('penjualan.show', $payment->paymentable_id),
                    \App\Models\PurchaseOrder::class => route('pembelian.show', $payment->paymentable_id),
                    \App\Models\Journal::class => route('jurnal.edit', $payment->paymentable_id),
                    default => null,
                };
                $payment->paymentable_notes = $payment->paymentable?->notes;
                $payment->code = $payment->paymentable?->code ?? '-'; 
                return $payment;
            })
            ->withQueryString();

        // =======================
        // ACCOUNT BALANCE
        // =======================
        $accountBalance = AccountBalance::where('branch_id', Auth::user()->branch_id)
            ->where('akun', 'like', '%CASH / BANK%')
            ->select('akun','balance','updated_at')
            ->orderByDesc('updated_at')
            ->get();

        // =======================
        // RENDER
        // =======================
        return Inertia::render('Pembayaran/Index', [
            'admins' => User::where('branch_id', Auth::user()->branch_id)->whereIsAdmin(true)->get(['id', 'name']),
            'payments' => $payments,
            'summary' => $summary,
            'accountBalance' => $accountBalance,
            'filters' => [
                'date_from' => $startDate,
                'date_to'   => $endDate,
                'payment_method' => $request->payment_method,
                'search' => $request->search,
                'order_by' => $orderBy,
                'order_dir' => $orderDir,
                'user_admin' => $request->user_admin,
            ],
        ]);
    }
}
