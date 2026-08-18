<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class BalanceController extends Controller
{
    public function index(Request $request)
    {
        /* =======================
         | SMART DATE DEFAULT
         ======================= */
        $isFirstLoad = $request->query->count() === 0;

        $startDate = $request->get('date_from');
        $endDate   = $request->get('date_to');

        if ($isFirstLoad) {
            $startDate = Carbon::today()->toDateString();
            $endDate   = Carbon::today()->toDateString();
        }

        /* =======================
         | BASE QUERY (LEDGER SOURCE)
         ======================= */
        $baseQuery = Payment::query()
            ->where('branch_id', Auth::user()->branch_id)
            ->where('mutation_type', '!=', 'Kembalian')
            ->when($startDate, fn ($q) => $q->whereDate('date', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate('date', '<=', $endDate));

        /* =====================================================
         | 1. ASSET (NR-DB)
         ===================================================== */
        $assetDebit = (clone $baseQuery)
            ->where('debit_akun', 'LIKE', '%NR-DB%')
            ->select(
                'debit_akun as akun',
                DB::raw('SUM(nominal) as total')
            )
            ->groupBy('debit_akun');

        $assetCredit = (clone $baseQuery)
            ->where('kredit_akun', 'LIKE', '%NR-DB%')
            ->select(
                'kredit_akun as akun',
                DB::raw('SUM(-nominal) as total')
            )
            ->groupBy('kredit_akun');

        $assets = DB::query()
            ->fromSub(
                $assetDebit->unionAll($assetCredit),
                'x'
            )
            ->select('akun', DB::raw('SUM(total) as total'))
            ->groupBy('akun')
            ->orderBy('akun')
            ->get();

        $totalAssets = $assets->sum('total');

        /* =====================================================
         | 2. LIABILITAS + EKUITAS (NR-KR)
         ===================================================== */
        $liabilityCredit = (clone $baseQuery)
            ->where('kredit_akun', 'LIKE', '%NR-KR%')
            ->select(
                'kredit_akun as akun',
                DB::raw('SUM(nominal) as total')
            )
            ->groupBy('kredit_akun');

        $liabilityDebit = (clone $baseQuery)
            ->where('debit_akun', 'LIKE', '%NR-KR%')
            ->select(
                'debit_akun as akun',
                DB::raw('SUM(-nominal) as total')
            )
            ->groupBy('debit_akun');

        $liabilities = DB::query()
            ->fromSub(
                $liabilityCredit->unionAll($liabilityDebit),
                'x'
            )
            ->select('akun', DB::raw('SUM(total) as total'))
            ->groupBy('akun')
            ->orderBy('akun')
            ->get();

        $totalLiabilities = $liabilities->sum('total');

        /* =====================================================
         | 3. LABA / RUGI BERJALAN (LR)
         ===================================================== */
        $lrCredit = (clone $baseQuery)
            ->where('kredit_akun', 'LIKE', '%LR-KR%')
            ->sum('nominal');

        $lrDebit = (clone $baseQuery)
            ->where('debit_akun', 'LIKE', '%LR-DB%')
            ->sum('nominal');

        $labaRugi = $lrCredit - $lrDebit;

        /* =====================================================
         | 4. INJEKSI LABA RUGI KE EKUITAS
         ===================================================== */
        $liabilities->push([
            'akun'  => 'NR-KR Laba / Rugi Berjalan',
            'total' => $labaRugi,
        ]);

        $totalLiabilitiesFinal = $totalLiabilities + $labaRugi;

        /* =====================================================
         | 5. VALIDASI NERACA IMBANG
         ===================================================== */
        $isBalance = round($totalAssets, 2) === round($totalLiabilitiesFinal, 2);

        /* =====================================================
         | 6. RENDER
         ===================================================== */
        return Inertia::render('Balance/Index', [
            'accountBalance' => AccountBalance::where('branch_id', Auth::user()->branch_id)->orderBy('akun')->get(),

            'assets' => [
                'rows'  => $assets,
                'total' => $totalAssets,
            ],

            'liabilities' => [
                'rows'  => $liabilities,
                'total' => $totalLiabilitiesFinal,
            ],

            'labaRugi' => [
                'nilai'  => $labaRugi,
                'kredit' => $lrCredit,
                'debit'  => $lrDebit,
            ],

            'meta' => [
                'is_balance' => $isBalance,
            ],

            'filters' => [
                'date_from' => $startDate,
                'date_to'   => $endDate,
            ],
        ]);
    }
}
