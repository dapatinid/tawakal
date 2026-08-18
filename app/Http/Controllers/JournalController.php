<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Payment;
use App\Models\AccountBalance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class JournalController extends Controller
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
            $startDate = Carbon::parse('2026-01-01 00:00:00')->toDateString();
            $endDate   = Carbon::today()->toDateString();
        }

        $allowedColumns = ['date', 'akun_akun', 'mutation_type', 'created_at', 'updated_at'];
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
        $baseQuery = Payment::query()
            ->where('branch_id', Auth::user()->branch_id) // pastikan filter branch tetap berlaku
            ->where('mutation_type', '!=', 'Kembalian')
            ->with([
                'branch:id,name',
                'user:id,name',
                'userCre:id,name',
                'userUpd:id,name',
                'paymentable',
                'journal:id,code,description',
            ])
            ->when($startDate, fn($q) => $q->whereDate($dateColumn, '>=', $startDate))
            ->when($endDate,   fn($q) => $q->whereDate($dateColumn, '<=', $endDate));

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
        if ($request->filled('akun_akun')) {
            $baseQuery->where(function ($q) use ($request) {
                $q->where('debit_akun', $request->akun_akun)
                ->orWhere('kredit_akun', $request->akun_akun);
            });
        }

        // =======================
        // SEARCH
        // =======================
        if ($request->filled('search')) {
            // Ubah input pencarian menjadi huruf kecil
            $search = strtolower($request->search);

            $baseQuery->where(function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    // 1. Search di semua Paymentable (Polymorphic)
                    $qq->orWhereHasMorph(
                        'paymentable',
                        [
                            \App\Models\Order::class,
                            \App\Models\PurchaseOrder::class,
                            \App\Models\Journal::class,
                            \App\Models\AdjustmentStock::class,
                        ],
                        fn($q) => $q->whereRaw('LOWER(code) like ?', ["%{$search}%"])
                                    ->orWhereRaw('LOWER(user_alias) like ?', ["%{$search}%"])
                                    ->orWhereRaw('LOWER(notes) like ?', ["%{$search}%"])
                    );

                    // 2. Search field langsung di tabel payments
                    $qq->orWhereRaw('LOWER(notes) like ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(mutation_type) like ?', ["%{$search}%"])
                    // Untuk nominal (numeric), biasanya database bisa otomatis cast ke string saat LIKE
                    ->orWhere('nominal', 'like', "%{$search}%") 
                    ->orWhereHas('user', fn($u) => 
                            $u->whereRaw('LOWER(name) like ?', ["%{$search}%"])
                    );

                    // Jika ingin mengaktifkan pencarian user pembuat/pengubah:
                    // ->orWhereHas('userCre', fn($u) => $u->whereRaw('LOWER(name) like ?', ["%{$search}%"]))
                    // ->orWhereHas('userUpd', fn($u) => $u->whereRaw('LOWER(name) like ?', ["%{$search}%"]));
                });
            });
        }

        // =======================
        // ORDER BY
        // =======================

        $baseQuery->orderBy($orderBy, $orderDir);

        // =======================
        // SUMMARY (total_nominal)
        // =======================
        $summary = [
            'total_nominal' => 
                (clone $baseQuery)->where('debit_akun', $request->akun_akun)->sum('nominal')
            - (clone $baseQuery)->where('kredit_akun', $request->akun_akun)->sum('nominal'),
        ];

        // =======================
        // PAGINATION
        // =======================
        $payments = $baseQuery
            ->paginate(10)
            ->through(function ($payment) {
                // URL untuk frontend
                $payment->paymentable_url = match ($payment->paymentable_type) {
                    \App\Models\Order::class => route('penjualan.show', $payment->paymentable_id),
                    \App\Models\PurchaseOrder::class => route('pembelian.show', $payment->paymentable_id),
                    \App\Models\AdjustmentStock::class => route('penyesuaian-stok.edit', $payment->paymentable_id),
                    \App\Models\Journal::class => route('jurnal.edit', $payment->paymentable_id),
                    \App\Models\Product::class => route('produk.preview', $payment->paymentable_id),
                    default => null,
                };
                // pastikan code ada untuk semua paymentable
                $payment->paymentable_notes = $payment->paymentable?->notes;
                $payment->code = $payment->paymentable?->code ?? '-';
                $payment->sku = $payment->paymentable?->sku ?? '-';
                return $payment;
            })
            ->withQueryString();

        // =======================
        // ACCOUNT BALANCE
        // =======================
        $accountBalance = AccountBalance::where('branch_id', Auth::user()->branch_id)
            // ->where('akun', 'like', '%CASH / BANK%')
            ->select('akun','balance','updated_at')
            ->orderByDesc('updated_at')
            ->get();

        // =======================
        // RENDER
        // =======================
        return Inertia::render('Journal/Index', [
            'admins' => User::where('branch_id', Auth::user()->branch_id)->whereIsAdmin(true)->get(['id', 'name']),
            'payments' => $payments,
            'summary' => $summary,
            'accountBalance' => $accountBalance,
            'filters' => [
                'date_from' => $startDate,
                'date_to'   => $endDate,
                'akun_akun' => $request->akun_akun,
                'search' => $request->search,
                'order_by' => $orderBy,
                'order_dir' => $orderDir,
            ],
        ]);
    }



     

    /* ======================
     |  CREATE
     ====================== */
    public function create()
    {
        return Inertia::render('Journal/Create', [
            'presets' => $this->journalPresets(),   // mutation_type
            'accounts' => $this->accounts(),        // chart of account
            'defaultDate' => now()->format('Y-m-d\TH:i'),
            'users' => User::whereNotIn('id', [1])->get(),
        ]);
    }


    /* ======================
     |  STORE
     ====================== */
public function store(Request $request)
{
    $validated = $request->validate([
        'date' => ['required', 'date_format:Y-m-d\TH:i'],
        'user_id'    => 'required|exists:users,id',
        'user_alias' => 'nullable|string|max:255',
        'description'   => ['required', 'string'],
        'payment_method' => ['nullable', 'string'],
        'mutation_type' => ['required', 'string'],
        'debit_akun'    => ['required', 'string'],
        'kredit_akun'   => ['required', 'string'],
        'nominal'       => ['required', 'numeric', 'min:1'],
    ]);

// 1. Guard: Pastikan debit dan kredit tidak sama
    if ($validated['debit_akun'] === $validated['kredit_akun']) {
        return back()->with('error', 'Akun debit dan kredit tidak boleh sama');
    }

    // 2. Guard: Cegah transfer antar Cash/Bank di menu Journal
    $stringToSearch = 'NR-DB CASH / BANK';
    if (str_contains($validated['debit_akun'], $stringToSearch) && str_contains($validated['kredit_akun'], $stringToSearch)) {
        return back()->with('error', 'Transfer tidak bisa di lakukan disini');
    }

    DB::beginTransaction();

    try {
        $journal = Journal::create([
            'code'          => 'JRN' . now()->format('YmdHis').'#'.Auth::user()->branch_id.'-'.Auth::user()->id,
            'date'          => Carbon::createFromFormat('Y-m-d\TH:i', $validated['date']),
            'user_id'       => $validated['user_id'],
            'user_alias'    => $validated['user_alias'] ?? null,
            'branch_id'     => Auth::user()->branch_id,
            'created_by'    => Auth::id(),
        ]);

        $payment = $journal->payments()->create([
            'date' => Carbon::createFromFormat('Y-m-d\TH:i', $validated['date']),
            'notes' => $validated['description'],
            'payment_method' => $this->resolveAkunCashBank($validated['debit_akun'].$validated['kredit_akun']),
            'mutation_type' => $validated['mutation_type'],
            'debit_akun'    => $validated['debit_akun'],
            'kredit_akun'   => $validated['kredit_akun'],
            'nominal'       => $validated['nominal'],
            'user_id'       => $validated['user_id'],
            'branch_id'     => Auth::user()->branch_id,
            'created_by'    => Auth::id(),
        ]);

        $this->applyPaymentMutation($payment);

        DB::commit();

        return redirect()
            ->route('jurnal.index')
            ->with('success', 'Journal berhasil disimpan');

    } catch (\Throwable $e) {
        DB::rollBack();
        report($e);

        return back()->withErrors([
            'error' => $e->getMessage(),
        ]);
    }
}


/* ======================
 |  EDIT
 ====================== */
public function edit(Journal $journal)
{
    // Ambil payment terkait (diasumsikan 1 journal = 1 payment)
    $payment = $journal->payments()->firstOrFail();

    return Inertia::render('Journal/Edit', [
        'journal' => [
            'id'           => $journal->id,
            'code'         => $journal->code,
            'date'         => $journal->date->format('Y-m-d\TH:i'),
            'user_id'  => $journal->user_id,
            'user_alias'  => $journal->user_alias,
            'description'  => $payment->notes,
            'mutation_type'=> $payment->mutation_type,
            'debit_akun'   => $payment->debit_akun,
            'kredit_akun'  => $payment->kredit_akun,
            'nominal'      => $payment->nominal,
        ],
        'presets' => $this->journalPresets(),
        'accounts'=> $this->accounts(),
        'users' => User::all(),
    ]);
}


/* ======================
 |  UPDATE
 ====================== */
public function update(Request $request, Journal $journal)
{
    $validated = $request->validate([
        'date' => ['required', 'date_format:Y-m-d\TH:i'],
        'user_id'    => 'required|exists:users,id',
        'user_alias' => 'nullable|string|max:255',
        'description'   => ['required', 'string'],
        'payment_method' => ['nullable', 'string'],
        'mutation_type' => ['required', 'string'],
        'debit_akun'    => ['required', 'string'],
        'kredit_akun'   => ['required', 'string'],
        'nominal'       => ['required', 'numeric', 'min:1'],
    ]);

    if ($validated['debit_akun'] === $validated['kredit_akun']) {
        return back()->withErrors([
            'debit_akun' => 'Akun debit dan kredit tidak boleh sama',
        ]);
    }

    DB::beginTransaction();

    try {
        // ======================
        // UPDATE JOURNAL
        // ======================
        $journal->update([
            'date'       => Carbon::createFromFormat('Y-m-d\TH:i', $validated['date']),
            'user_id'       => $validated['user_id'],
            'user_alias'    => $validated['user_alias'],
            'branch_id'  => $journal->branch_id, // tetap cabang lama
            'updated_by' => Auth::id(),
        ]);

        // Ambil payment yang terkait (diasumsikan 1 journal = 1 payment)
        $payment = $journal->payments()->firstOrFail();

        // ======================
        // UNDO MUTATION LAMA
        // ======================
        $this->rollbackPaymentMutation($payment);

        // ======================
        // UPDATE PAYMENT
        // ======================
        $payment->update([
            'date'          => Carbon::createFromFormat('Y-m-d\TH:i', $validated['date']),
            'notes'         => $validated['description'],
            'mutation_type' => $validated['mutation_type'],
            'payment_method' => $this->resolveAkunCashBank($validated['debit_akun'].$validated['kredit_akun']),
            'debit_akun'    => $validated['debit_akun'],
            'kredit_akun'   => $validated['kredit_akun'],
            'nominal'       => $validated['nominal'],
            'user_id'       => $validated['user_id'],
            'updated_by'    => Auth::id(),
        ]);

        // ======================
        // APPLY MUTATION BARU
        // ======================
        $this->applyPaymentMutation($payment);

        DB::commit();

        return redirect()
            ->route('jurnal.index')
            ->with('success', 'Journal berhasil diperbarui');

    } catch (\Throwable $e) {
        DB::rollBack();
        report($e);

        return back()->withErrors([
            'error' => $e->getMessage(),
        ]);
    }
}


    /* ======================
     |  DESTROY
     ====================== */
public function destroy(Journal $journal)
{
    // ===============================
    // 🔒 BLOCK JOURNAL TRANSFER
    // ===============================
    if ($journal->pair_journal_id) {
        // abort(403, 'Journal transfer tidak boleh dihapus lewat menu ini');
        return back()->with('error', 'Journal transfer tidak boleh dihapus lewat menu ini');
    }

    // Optional extra safety
    if ($journal->transfer_type) {
        // abort(403, 'Journal transfer wajib dibatalkan lewat pihak pengirim, atau balas dengan transfer kembali');
        return back()->with('error', 'Journal transfer wajib dibatalkan lewat pihak pengirim, atau balas dengan transfer kembali');
    }

    DB::transaction(function () use ($journal) {

        foreach ($journal->payments as $payment) {
            $this->rollbackPaymentMutation($payment);
            $payment->update(['deleted_by' => Auth::id()]);
            $payment->delete();
        }

        $journal->update(['deleted_by' => Auth::id()]);
        $journal->delete();
    });

    return back()->with('success', 'Journal berhasil dihapus');
}


    /* ======================
     |  PRESET
     ====================== */
protected function journalPresets(): array
{
    return [
        [
            'label' => 'Manual',
            'mutation_type' => 'Manual',
            'debit_akun'  => '',
            'kredit_akun' => '',
        ],
        [
            'label' => 'Tambah Modal',
            'mutation_type' => 'Tambah Modal',
            'debit_akun'  => 'NR-DB CASH / BANK (CASH)',
            'kredit_akun' => 'NR-KR Modal',
        ],
        [
            'label' => 'Kembalikan Modal',
            'mutation_type' => 'Kembalikan Modal',
            'debit_akun'  => 'NR-KR Modal',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Karyawan Hutang',
            'mutation_type' => 'Karyawan Hutang',
            'debit_akun'  => 'NR-DB Piutang Karyawan',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Karyawan Hutang Dikembalikan',
            'mutation_type' => 'Karyawan Hutang Dikembalikan',
            'debit_akun'  => 'NR-DB CASH / BANK (CASH)',
            'kredit_akun' => 'NR-DB Piutang Karyawan',
        ],
        [
            'label' => 'Pendapatan di luar Kasir',
            'mutation_type' => 'Pendapatan di luar Kasir',
            'debit_akun' => 'NR-DB CASH / BANK (CASH)',
            'kredit_akun'  => 'LR-KR Pendapatan di luar Kasir',
        ],
        [
            'label' => 'Pendapatan lain lain',
            'mutation_type' => 'Pendapatan lain lain',
            'debit_akun' => 'NR-DB CASH / BANK (CASH)',
            'kredit_akun'  => 'LR-KR Pendapatan lain lain',
        ],
        [
            'label' => 'Blj Persediaan Dagang',
            'mutation_type' => 'Blj Persediaan Dagang',
            'debit_akun'  => 'LR-DB Blj Persediaan Dagang',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Blj Persediaan Packaging',
            'mutation_type' => 'Blj Persediaan Packaging',
            'debit_akun'  => 'LR-DB Blj Persediaan Packaging',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Blj Persediaan Produksi Bahan Baku',
            'mutation_type' => 'Blj Persediaan Produksi Bahan Baku',
            'debit_akun'  => 'LR-DB Blj Persediaan Produksi Bahan Baku',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Blj Persediaan Produksi Bahan Konsumtif',
            'mutation_type' => 'Blj Persediaan Produksi Bahan Konsumtif',
            'debit_akun'  => 'LR-DB Blj Persediaan Produksi Bahan Konsumtif',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Blj Persediaan Produksi Utilitas',
            'mutation_type' => 'Blj Persediaan Produksi Utilitas',
            'debit_akun'  => 'LR-DB Blj Persediaan Produksi Utilitas',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Blj Persediaan Lain Lain',
            'mutation_type' => 'Blj Persediaan Lain Lain',
            'debit_akun'  => 'LR-DB Blj Persediaan Lain Lain',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Administrasi dan Alat Kantor',
            'mutation_type' => 'Biaya Administrasi dan Alat Kantor',
            'debit_akun'  => 'LR-DB Biaya Administrasi dan Alat Kantor',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Tenaga Kerja',
            'mutation_type' => 'Biaya Tenaga Kerja',
            'debit_akun'  => 'LR-DB Biaya Tenaga Kerja',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Tunjangan',
            'mutation_type' => 'Biaya Tunjangan',
            'debit_akun'  => 'LR-DB Biaya Tunjangan',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Transportasi',
            'mutation_type' => 'Biaya Transportasi',
            'debit_akun'  => 'LR-DB Biaya Transportasi',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Konsumsi',
            'mutation_type' => 'Biaya Konsumsi',
            'debit_akun'  => 'LR-DB Biaya Konsumsi',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Advertising dan Marketing',
            'mutation_type' => 'Biaya Advertising dan Marketing',
            'debit_akun'  => 'LR-DB Biaya Advertising dan Marketing',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Telepon dan Pulsa',
            'mutation_type' => 'Biaya Telepon dan Pulsa',
            'debit_akun'  => 'LR-DB Biaya Telepon dan Pulsa',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Listrik dan Air',
            'mutation_type' => 'Biaya Listrik dan Air',
            'debit_akun'  => 'LR-DB Biaya Listrik dan Air',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Kebersihan dan Keamanan',
            'mutation_type' => 'Biaya Kebersihan dan Keamanan',
            'debit_akun'  => 'LR-DB Biaya Kebersihan dan Keamanan',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Sewa atau Langganan',
            'mutation_type' => 'Biaya Sewa atau Langganan',
            'debit_akun'  => 'LR-DB Biaya Sewa atau Langganan',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Biaya Instalasi Perawatan dan Perbaikan',
            'mutation_type' => 'Biaya Instalasi Perawatan dan Perbaikan',
            'debit_akun'  => 'LR-DB Biaya Instalasi Perawatan dan Perbaikan',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Bagikan Dividen',
            'mutation_type' => 'Bagikan Dividen',
            'debit_akun'  => 'NR-KR Dividen',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
        [
            'label' => 'Sedekah / Donasi',
            'mutation_type' => 'Sedekah / Donasi',
            'debit_akun'  => 'NR-KR Sedekah / Donasi',
            'kredit_akun' => 'NR-DB CASH / BANK (CASH)',
        ],
    ];
}


protected function accounts(): array
{
    return [
        
        // ======================
        // CASH & BANK
        // ======================
        [
            'code' => 'NR-DB CASH / BANK (MAIN CASH)',
            'name' => 'Main Cash',
            'group' => 'dompet',
        ],
        [
            'code' => 'NR-DB CASH / BANK (CASH)',
            'name' => 'Cash',
            'group' => 'dompet',
        ],
        [
            'code' => 'NR-DB CASH / BANK (PETTY CASH)',
            'name' => 'Petty Cash',
            'group' => 'dompet',
        ],
        [
            'code' => 'NR-DB CASH / BANK (BANK)',
            'name' => 'Bank',
            'group' => 'dompet',
        ],
        [
            'code' => 'NR-DB CASH / BANK (EWALLET)',
            'name' => 'EWallet',
            'group' => 'dompet',
        ],
        [
            'code' => 'NR-DB CASH / BANK (QRIS)',
            'name' => 'QRIS',
            'group' => 'dompet',
        ],
        [
            'code' => 'NR-DB Tabungan',
            'name' => 'Tabungan',
            'group' => 'dompet',
        ],

        // ======================
        // PIUTANG
        // ======================
        [
            'code' => 'NR-DB Piutang Karyawan',
            'name' => 'Piutang Karyawan',
            'group' => 'piutang',
        ],
        [
            'code' => 'NR-DB Piutang Usaha (Nominal)',
            'name' => 'Piutang Usaha (Nominal)',
            'group' => 'piutang',
        ],
        [
            'code' => 'NR-DB Piutang Persediaan Dagang',
            'name' => 'Piutang Persediaan Dagang',
            'group' => 'piutang',
        ],
        [
            'code' => 'NR-DB Piutang Penjualan',
            'name' => 'Piutang Penjualan',
            'group' => 'piutang',
        ],

        // ======================
        // LIABILITAS
        // ======================
        [
            'code' => 'NR-KR Hutang Usaha (Nominal)',
            'name' => 'Hutang Usaha (Nominal)',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Pembelian',
            'name' => 'Hutang Pembelian',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Persediaan Dagang',
            'name' => 'Hutang Persediaan Dagang',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Persediaan Packaging',
            'name' => 'Hutang Persediaan Packaging',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Persediaan Bahan Baku',
            'name' => 'Hutang Persediaan Bahan Baku',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Persediaan Bahan Konsumtif',
            'name' => 'Hutang Persediaan Bahan Konsumtif',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Persediaan Utilitas',
            'name' => 'Hutang Persediaan Utilitas',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Operasional',
            'name' => 'Hutang Operasional',
            'group' => 'liability',
        ],
        [
            'code' => 'NR-KR Hutang Pajak',
            'name' => 'Hutang Pajak',
            'group' => 'liability',
        ],

        // ======================
        // MODAL & EKUITAS
        // ======================
        [
            'code' => 'NR-KR Modal',
            'name' => 'Modal',
            'group' => 'equity',
        ],
        [
            'code' => 'NR-KR Investasi / Ekspansi',
            'name' => 'Investasi / Ekspansi',
            'group' => 'equity',
        ],
        [
            'code' => 'NR-KR Transfer Antar Cabang',
            'name' => 'Transfer Antar Cabang',
            'group' => 'equity',
        ],
        [
            'code' => 'NR-KR Dividen',
            'name' => 'Dividen',
            'group' => 'equity',
        ],
        [
            'code' => 'NR-KR Sedekah / Donasi',
            'name' => 'Sedekah / Donasi',
            'group' => 'equity',
        ],
        [
            'code' => 'NR-KR Laba Ditahan',
            'name' => 'Laba Ditahan',
            'group' => 'equity',
        ],

        // ======================
        // BIAYA (LABA RUGI)
        // ======================
        [
            'code' => 'LR-KR Pendapatan di luar Kasir',
            'name' => 'Pendapatan di luar Kasir',
            'group' => 'pemasukan',
        ],
        [
            'code' => 'LR-KR Pendapatan lain lain',
            'name' => 'Pendapatan lain lain',
            'group' => 'pemasukan',
        ],
        [
            'code' => 'LR-DB Blj Persediaan Dagang',
            'name' => 'Blj Persediaan Dagang',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Blj Persediaan Packaging',
            'name' => 'Blj Persediaan Packaging',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Blj Persediaan Produksi Bahan Baku',
            'name' => 'Blj Persediaan Produksi Bahan Baku',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Blj Persediaan Produksi Bahan Konsumtif',
            'name' => 'Blj Persediaan Produksi Bahan Konsumtif',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Blj Persediaan Produksi Utilitas',
            'name' => 'Blj Persediaan Produksi Utilitas',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Blj Persediaan Lain Lain',
            'name' => 'Blj Persediaan Lain Lain',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Administrasi dan Alat Kantor',
            'name' => 'Biaya Administrasi dan Alat Kantor',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Tenaga Kerja',
            'name' => 'Biaya Tenaga Kerja',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Tunjangan',
            'name' => 'Biaya Tunjangan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Transportasi',
            'name' => 'Biaya Transportasi',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Konsumsi',
            'name' => 'Biaya Konsumsi',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Advertising dan Marketing',
            'name' => 'Biaya Advertising dan Marketing',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Telepon dan Pulsa',
            'name' => 'Biaya Telepon dan Pulsa',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Listrik dan Air',
            'name' => 'Biaya Listrik dan Air',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Kebersihan dan Keamanan',
            'name' => 'Biaya Kebersihan dan Keamanan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Sewa atau Langganan',
            'name' => 'Biaya Sewa atau Langganan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Biaya Instalasi Perawatan dan Perbaikan',
            'name' => 'Biaya Instalasi Perawatan dan Perbaikan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Beban Overhead Kantor',
            'name' => 'Beban Overhead Kantor',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Beban Overhead Lapangan',
            'name' => 'Beban Overhead Lapangan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Beban Peny. Bangunan',
            'name' => 'Beban Peny. Bangunan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Beban Peny. Peralatan',
            'name' => 'Beban Peny. Peralatan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Beban Peny. Kendaraan',
            'name' => 'Beban Peny. Kendaraan',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Beban Bencana',
            'name' => 'Beban Bencana',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Beban Kesalahan Kerja',
            'name' => 'Beban Kesalahan Kerja',
            'group' => 'pengeluaran',
        ],
        [
            'code' => 'LR-DB Pajak',
            'name' => 'Pajak',
            'group' => 'pengeluaran',
        ],


        // ======================
        // ASET TETAP
        // ======================
        [
            'code' => 'NR-DB Tanah',
            'name' => 'Tanah',
            'group' => 'asset',
        ],
        [
            'code' => 'NR-DB Bangunan',
            'name' => 'Bangunan',
            'group' => 'asset',
        ],
        [
            'code' => 'NR-DB Kendaraan',
            'name' => 'Kendaraan',
            'group' => 'asset',
        ],
        [
            'code' => 'NR-DB Peralatan',
            'name' => 'Peralatan',
            'group' => 'asset',
        ],

        [
            'code' => 'NR-DB Akum. Penyusutan Tanah',
            'name' => 'Akum. Penyusutan Tanah',
            'group' => 'asset',
        ],
        [
            'code' => 'NR-DB Akum. Penyusutan Bangunan',
            'name' => 'Akum. Penyusutan Bangunan',
            'group' => 'asset',
        ],
        [
            'code' => 'NR-DB Akum. Penyusutan Kendaraan',
            'name' => 'Akum. Penyusutan Kendaraan',
            'group' => 'asset',
        ],
        [
            'code' => 'NR-DB Akum. Penyusutan Peralatan',
            'name' => 'Akum. Penyusutan Peralatan',
            'group' => 'asset',
        ],
    ];
}


    /* ======================
     |  ACCOUNT BALANCE
     ====================== */
    private function resolveAkunCashBank(string $paymentMethod): string
    {
        preg_match('/\(([^)]+)\)/', strtolower($paymentMethod), $matches);
        return $matches[1] ?? null;
    }

    private function applyPaymentMutation(Payment $payment)
    {
        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->debit_akun,
            $payment->nominal,
            'debit'
        );

        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->kredit_akun,
            $payment->nominal,
            'credit'
        );
    }

    private function rollbackPaymentMutation(Payment $payment)
    {
        $this->mutateAccountBalance(
            $payment->branch_id,
            $payment->debit_akun,
            $payment->nominal,
            'credit'
        );

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
        string $type
    ) {
        $account = AccountBalance::where('branch_id', $branchId)
            ->where('akun', $akun)
            ->lockForUpdate()
            ->first();

        if (! $account) {
            $account = AccountBalance::create([
                'branch_id' => $branchId,
                'akun' => $akun,
                'balance' => 0,
            ]);
        }

        $type === 'debit'
            ? $account->increment('balance', $amount)
            : $account->decrement('balance', $amount);
    }



    ///////////// KHUSUS TRANSFER ////////////////////

public function transfer()
{
    return Inertia::render('Journal/Transfer', [
        'accounts' => $this->accounts(),
        'branches' => \App\Models\Branch::wherePartnerId(Auth::user()->branch->partner_id)->select('id','name')->get(),
        'defaultDate' => now()->format('Y-m-d\TH:i'),
    ]);
}


public function createTransfer(Request $request)
{
    $validated = $request->validate([
        'date' => ['required', 'date_format:Y-m-d\TH:i'],
        'description' => ['required', 'string'],
        'nominal' => ['required', 'numeric', 'min:1'],

        // 🔑 USER INPUT (FINAL)
        'source_cash_account' => ['required', 'string'],
        'target_cash_account' => ['required', 'string'],

        'target_branch_id' => ['required', 'exists:branches,id'],
    ]);

    $sourceBranch = Auth::user()->branch_id;
    $targetBranch = $validated['target_branch_id'];

    // if ($sourceBranch == $targetBranch) {
    //     return back()->withErrors([
    //         'target_branch_id' => 'Cabang tujuan tidak boleh sama'
    //     ]);
    // }

    DB::transaction(function () use ($validated, $sourceBranch, $targetBranch) {

        $trxDate = Carbon::createFromFormat('Y-m-d\TH:i', $validated['date']);
        $code = 'TRF' . now()->format('YmdHis').'#'.Auth::user()->branch_id.'-'.Auth::user()->id;

        // ===============================
        // JOURNAL PENGIRIM (OUT)
        // ===============================
        $journalOut = Journal::create([
            'code' => $code,
            'date' => $trxDate,
            'branch_id' => $sourceBranch,
            'transfer_type' => 'out',
            'created_by' => Auth::id(),
        ]);

        $paymentOut = $journalOut->payments()->create([
            'date' => $trxDate,
            'notes' => $validated['description'] . " ke " . \App\Models\Branch::find($targetBranch)->name,
            'mutation_type' => 'Transfer Antar Cabang',

            // 🔴 OUT
            'debit_akun'  => 'NR-KR Transfer Antar Cabang',
            'kredit_akun' => $validated['source_cash_account'],
            'payment_method' => $this->resolveAkunCashBank($validated['source_cash_account']),

            'nominal' => $validated['nominal'],
            'branch_id' => $sourceBranch,
            'target_branch_id' => $targetBranch,
            'created_by' => Auth::id(),
        ]);

        $this->applyPaymentMutation($paymentOut);

        // ===============================
        // JOURNAL PENERIMA (IN)
        // ===============================
        $journalIn = Journal::create([
            'code' => $code,
            'date' => $trxDate,
            'branch_id' => $targetBranch,
            'transfer_type' => 'in',
            'created_by' => Auth::id(),
        ]);

        $paymentIn = $journalIn->payments()->create([
            'date' => $trxDate,
            'notes' => '[TRANSFER MASUK] ' . $validated['description'] . " dari " . \App\Models\Branch::find($sourceBranch)->name,
            'mutation_type' => 'Transfer Antar Cabang',

            // 🟢 IN
            'debit_akun'  => $validated['target_cash_account'],
            'kredit_akun' => 'NR-KR Transfer Antar Cabang',
            'payment_method' => $this->resolveAkunCashBank($validated['target_cash_account']),

            'nominal' => $validated['nominal'],
            'branch_id' => $targetBranch,
            'target_branch_id' => $sourceBranch,
            'created_by' => Auth::id(),
        ]);

        $this->applyPaymentMutation($paymentIn);

        // ===============================
        // PAIRING
        // ===============================
        $journalOut->update([
            'pair_journal_id' => $journalIn->id
        ]);

        $journalIn->update([
            'pair_journal_id' => $journalOut->id
        ]);
    });

    return redirect()
        ->route('jurnal.index')
        ->with('success', 'Transfer antar cabang berhasil');
}



public function destroyTransfer(Journal $journal)
{
    // ===============================
    // 1️⃣ HARUS JOURNAL TRANSFER
    // ===============================
    if (!$journal->pair_journal_id) {
        abort(403, 'Ini bukan journal transfer');
    }

    // ===============================
    // 2️⃣ TENTUKAN JOURNAL OUT (ROOT)
    // ===============================
    if ($journal->transfer_type === 'in') {
        $journal = Journal::findOrFail($journal->pair_journal_id);
    }

    // ===============================
    // 3️⃣ VALIDASI PENGIRIM
    // ===============================
    if ($journal->transfer_type !== 'out') {
        // abort(403, 'Hanya pengirim yang boleh membatalkan transfer');
        return back()->with('error', 'Hanya pengirim yang boleh membatalkan transfer');
    }

    if ($journal->branch_id !== Auth::user()->branch_id) {
        // abort(403, 'Tidak berhak menghapus journal cabang lain');
        return back()->with('error', 'Transfer hanya bisa di hapus oleh Pengirim ');
    }

    DB::transaction(function () use ($journal) {

        $pair = Journal::find($journal->pair_journal_id);

        foreach ([$journal, $pair] as $j) {
            if (! $j) continue;

            foreach ($j->payments as $payment) {
                $this->rollbackPaymentMutation($payment);
                $payment->delete();
            }

            $j->delete();
        }
    });

    return back()->with('success','Transfer antar cabang dibatalkan');
}


    



}
