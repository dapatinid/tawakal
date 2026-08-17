<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Payment;
use App\Models\AccountBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Rap2hpoutre\FastExcel\FastExcel;
use OpenSpout\Writer\XLSX\Writer;
use OpenSpout\Writer\XLSX\Options;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Cell;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Common\Entity\Style\Color;

class ProfitLossController extends Controller
{
    /* ======================
     |  INDEX
     ====================== */
    public function index(Request $request)
    {
        // =======================
        // SMART DATE DEFAULT
        // =======================
        $isFirstLoad = $request->query->count() === 0;

        $startDate = $request->get('date_from');
        $endDate   = $request->get('date_to');

        if ($isFirstLoad) {
            $startDate = Carbon::now()->startOfMonth()->toDateString();
            $endDate   = Carbon::now()->endOfMonth()->toDateString();
        }

        // =======================
        // BASE QUERY
        // =======================
        $baseQuery = Payment::query()
            ->where('branch_id', Auth::user()->branch_id) // pastikan filter branch tetap berlaku
            ->where('mutation_type', '!=', 'Kembalian')
            ->where(function ($q) {
                $q->where('debit_akun', 'LIKE', '%LR-%')
                ->orWhere('kredit_akun', 'LIKE', '%LR-%');
            })
            ->with([
                'branch:id,name',
                'user:id,name',
                'userCre:id,name',
                'userUpd:id,name',
                'paymentable:id',
                'journal:id,code,description',
            ])
            ->when($startDate, fn ($q) => $q->whereDate('date', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate('date', '<=', $endDate));

        // =======================
        // ORDER BY
        // =======================
        $allowedColumns = ['date', 'mutation_type', 'created_at', 'updated_at'];
        $orderBy  = $request->input('order_by', 'date');
        $orderDir = $request->input('order_dir', 'desc');

        if (!in_array($orderBy, $allowedColumns)) $orderBy = 'date';
        if (!in_array($orderDir, ['asc','desc'])) $orderDir = 'desc';

        $baseQuery->orderBy($orderBy, $orderDir);

        // =======================
        // SUMMARY (total_nominal)
        // =======================
        $summary = [
            'total_nominal' => 
                (clone $baseQuery)->where('kredit_akun', 'LIKE', '%LR-%')->sum('nominal')
            - (clone $baseQuery)->where('debit_akun', 'LIKE', '%LR-%')->sum('nominal'),
        ];

        // =======================
        // PAGINATION
        // =======================
        $payments = $baseQuery->get()->map(function ($payment) {
            $payment->paymentable_url = match ($payment->paymentable_type) {
                \App\Models\Order::class => route('penjualan.show', $payment->paymentable_id),
                \App\Models\PurchaseOrder::class => route('pembelian.show', $payment->paymentable_id),
                \App\Models\AdjustmentStock::class => route('penyesuaian-stok.edit', $payment->paymentable_id),
                \App\Models\Journal::class => route('jurnal.edit', $payment->paymentable_id),
                default => null,
            };
            $payment->code = $payment->paymentable?->code ?? '-';
            return $payment;
        });

        // =======================
        // ACCOUNT BALANCE
        // =======================
        $accountBalance = AccountBalance::where('branch_id', Auth::user()->branch_id)
            ->select('akun')
            ->orderBy('akun')
            ->get();

            // dd($payments->toArray());
        // =======================
        // RENDER
        // =======================
        return Inertia::render('ProfitLoss/Index', [
            'payments' => $payments,
            'summary' => $summary,
            'accountBalance' => $accountBalance,
            'filters' => [
                'date_from' => $startDate,
                'date_to'   => $endDate,
                'order_by' => $orderBy,
                'order_dir' => $orderDir,
            ],
        ]);
    }


    
public function export(Request $request)
{
    $startDate = $request->get('date_from');
    $endDate   = $request->get('date_to');

    $baseWhere = function ($q) use ($startDate, $endDate) {
        $q->where('branch_id', Auth::user()->branch_id)
          ->where('mutation_type', '!=', 'Kembalian')
          ->when($startDate, fn ($q) => $q->whereDate('date', '>=', $startDate))
          ->when($endDate,   fn ($q) => $q->whereDate('date', '<=', $endDate));
    };

    $pemasukan = Payment::query()
        ->where($baseWhere)
        ->where('kredit_akun', 'LIKE', '%LR-%')
        ->groupBy('kredit_akun')
        ->orderBy('kredit_akun')
        ->select(['kredit_akun as akun', DB::raw("SUM(nominal) as total")])
        ->get();

    $pengeluaran = Payment::query()
        ->where($baseWhere)
        ->where('debit_akun', 'LIKE', '%LR-%')
        ->groupBy('debit_akun')
        ->orderBy('debit_akun')
        ->select(['debit_akun as akun', DB::raw("SUM(nominal) as total")])
        ->get();

    $totalPemasukan   = $pemasukan->sum('total');
    $totalPengeluaran = $pengeluaran->sum('total');
    $labaRugi         = $totalPemasukan - $totalPengeluaran;

    // Factory — fresh object setiap panggilan, hindari style inheritance
    $makeStyle = function (bool $bold, ?string $bgColor = null): Style {
        $style = new Style();
        if ($bold) $style->setFontBold(true);
        if ($bgColor) $style->setBackgroundColor($bgColor);
        return $style;
    };

    $makeRow = function (array $values, Style $style) {
        $cells = array_map(fn ($v) => Cell::fromValue($v, $style), $values);
        return new Row($cells);
    };

    $filename = 'laba_rugi_' . ($startDate ?? 'all') . '_sd_' . ($endDate ?? 'all') . '.xlsx';
    $filepath = storage_path('app/temp_' . $filename);

    $writer = new Writer();
    $writer->openToFile($filepath);

    // Header kolom
    $writer->addRow($makeRow(['Tipe', 'Akun', 'Total'], $makeStyle(true)));

    // Baris kosong
    $writer->addRow($makeRow(['', '', ''], $makeStyle(false)));

    // == PEMASUKAN ==
    $writer->addRow($makeRow(['PEMASUKAN', '', ''], $makeStyle(true, 'D1FAE5')));

    foreach ($pemasukan as $r) {
        $writer->addRow($makeRow([
            'Pemasukan',
            ltrim(substr($r->akun, 5)),
            (int) $r->total,
        ], $makeStyle(false)));
    }

    $writer->addRow($makeRow(['', 'Total Pemasukan', (int) $totalPemasukan], $makeStyle(true, 'D1FAE5')));

    // Baris kosong
    $writer->addRow($makeRow(['', '', ''], $makeStyle(false)));

    // == PENGELUARAN ==
    $writer->addRow($makeRow(['PENGELUARAN', '', ''], $makeStyle(true, 'FEE2E2')));

    foreach ($pengeluaran as $r) {
        $writer->addRow($makeRow([
            'Pengeluaran',
            ltrim(substr($r->akun, 5)),
            (int) $r->total,
        ], $makeStyle(false)));
    }

    $writer->addRow($makeRow(['', 'Total Pengeluaran', (int) $totalPengeluaran], $makeStyle(true, 'FEE2E2')));

    // Baris kosong
    $writer->addRow($makeRow(['', '', ''], $makeStyle(false)));

    // Laba / Rugi Bersih
    $bgLaba = $labaRugi >= 0 ? 'D1FAE5' : 'FEE2E2';
    $writer->addRow($makeRow(['', 'Laba / Rugi Bersih', (int) $labaRugi], $makeStyle(true, $bgLaba)));

    $writer->close();

    return response()->download($filepath, $filename)->deleteFileAfterSend(true);
}
    

}
