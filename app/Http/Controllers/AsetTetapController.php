<?php

namespace App\Http\Controllers;

use App\Models\AccountBalance;
use App\Models\FixedAsset;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AsetTetapController extends Controller
{
    /**
     * Menampilkan daftar aset dengan filter dan pagination. ...
     */
    public function index(Request $request)
    {
        $query = FixedAsset::where('branch_id', Auth::user()->branch_id);

        // 🔍 Search (berdasarkan nama atau kode aset) - CASE INSENSITIVE
        if ($request->filled('search')) {
            $searchTerm = strtolower($request->search);

            $query->where(function ($q) use ($searchTerm) {
                // Gunakan LOWER() agar aman di PostgreSQL/MySQL untuk pencarian teks
                $q->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
                ->orWhereRaw('LOWER(asset_code) like ?', ["%{$searchTerm}%"]);
                
                // Keamanan PostgreSQL: Cari ID hanya jika input adalah angka
                if (is_numeric($searchTerm)) {
                    $q->orWhere('id', $searchTerm);
                }
            });
        }

        // 🗂 Filter Kategori
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // ✅ Filter Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } 

        // 🔢 Sorting
        $allowedSorts = ['name', 'purchase_date', 'purchase_cost', 'created_at'];
        $sortBy = in_array($request->sort_by, $allowedSorts) ? $request->sort_by : 'created_at';
        $sortDir = $request->sort_dir === 'asc' ? 'asc' : 'desc';
        
        $query->orderBy($sortBy, $sortDir);

        // 💰 Hitung Total Nilai Buku (Sum of Book Value)
        // Gunakan COALESCE agar hasil tetap 0 (bukan null) jika data kosong
        $totalBookValue = 0;
        if ($request->boolean('calculate')) {
            $totalBookValue = (clone $query)
                ->select(DB::raw('SUM(purchase_cost - accumulated_depreciation) as total'))
                ->value('total') ?? 0;
        }

        return Inertia::render('AsetTetap/Index', [
            'assets' => $query->paginate(15)->withQueryString(),
            'totalBookValue' => $totalBookValue,
            // Sertakan semua filter agar state di frontend tetap sinkron
            'filters' => $request->only(['search', 'category', 'status', 'sort_by', 'sort_dir', 'calculate']),
        ]);
    }   

    /**
     * Form tambah aset baru.
     */
    public function create()
    {
        return Inertia::render('AsetTetap/Create');
    }

    /**
     * Simpan aset baru ke database.
     */
    public function store(Request $request)
    {
        $branchId = Auth::user()->branch_id;

        $data = $request->validate([
            'asset_code' => 'required|string|max:50|unique:fixed_assets,asset_code',
            'name' => 'required|string|max:255',
            'category' => 'required|in:bangunan,kendaraan,peralatan',
            'purchase_date' => 'required|date',
            'purchase_cost' => 'required|numeric|min:0',
            'residual_value' => 'nullable|numeric|min:0',
            'useful_life_months' => 'required|integer|min:1',
            'images_new.*' => 'nullable|image|max:2048', // Max 2MB per image
            'notes' => 'nullable|string',
            'sold_value' => 'default:0|numeric|min:0',
        ]);

        // Upload gambar jika ada
        $imagePaths = [];
        if ($request->hasFile('images_new')) {
            foreach ($request->file('images_new') as $file) {
                $imagePaths[] = $file->store('fixed-assets', 'public');
            }
        }

        $FixedAsset = FixedAsset::create(array_merge($data, [
            'branch_id' => $branchId,
            'images' => $imagePaths,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'accumulated_depreciation' => 0, // Aset baru mulai dari nol
            'status' => 'active',
        ]));

        $addAsset = $FixedAsset->payments()->create([
            'mutation_type' => 'Pengadaan Aset Tetap',
            'currency' => 'IDR',
            'debit_akun' => 'NR-DB Asset Tetap',
            'kredit_akun' => 'NR-KR Hutang Aset Tetap',
            'nominal' => $FixedAsset->purchase_cost,
            'user_id' => Auth::id(),
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'branch_id' => Auth::user()->branch_id,
            'date' => $FixedAsset->purchase_date,
        ]);
        $this->applyPaymentMutation($addAsset);        

        return redirect()->route('aset-tetap.index')
            ->with('success', 'Aset tetap berhasil didaftarkan.');
    }

    /**
     * Detail aset (untuk melihat nilai buku saat ini).
     */
    public function show(FixedAsset $asetTetap)
    {
        return Inertia::render('AsetTetap/Show', [
            'asset' => $asetTetap->load(['creator', 'branch', 'payments' => function($query) {
            $query->orderBy('date', 'desc'); // Urutkan dari yang terbaru
        }])
        ]);
    }

    /**
     * PEYUSUSTAN ASET: Form untuk melakukan penyusutan manual (jika diperlukan).
     */
    public function depreciate(Request $request, FixedAsset $asetTetap)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'date' => 'required|date',
            'note' => 'nullable|string|max:255',
        ]);

        // Pastikan penyusutan tidak membuat nilai buku di bawah nilai residu
        $currentBookValue = $asetTetap->purchase_cost - $asetTetap->accumulated_depreciation;
        if (($currentBookValue - $request->amount) < $asetTetap->residual_value) {
            return back()->withErrors(['amount' => 'Nilai susut melebihi batas nilai residu aset.']);
        }

        DB::transaction(function () use ($request, $asetTetap) {
            // 1. Update Akumulasi di tabel FixedAsset
            $asetTetap->increment('accumulated_depreciation', $request->amount);

            // 2. Catat di tabel Payments (Jurnal Akuntansi)
            $depreciationEntry = $asetTetap->payments()->create([
                'mutation_type' => 'Penyusutan Aset Tetap',
                'currency' => 'IDR',
                'debit_akun' => 'LR-DB Penyusutan Aset', // Beban bertambah
                'kredit_akun' => 'NR-DB Akumulasi Penyusutan', // Akumulasi (Kontra-Aset) bertambah
                'nominal' => $request->amount,
                'notes' => $request->notes ?? "Penyusutan asset {$asetTetap->name}",
                'user_id' => Auth::id(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'branch_id' => Auth::user()->branch_id,
                'date' => $request->date,
            ]);

            // 3. Update Saldo Akun (COA)
            $this->applyPaymentMutation($depreciationEntry);
        });

        return back()->with('success', 'Penyusutan berhasil diposting.');
    }

    /**
     * FUNGSI JUAL (SELL)
     */
    public function sell(Request $request, FixedAsset $asetTetap)
    {
        $request->validate([
            'sell_price' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        DB::transaction(function () use ($request, $asetTetap) {
            $branchId = Auth::user()->branch_id;
            $userId = Auth::id();
            
            // 1. Hitung Nilai Buku (Book Value)
            $bookValue = $asetTetap->purchase_cost - $asetTetap->accumulated_depreciation;
            
            // 2. Hitung Selisih Laba atau Rugi
            $isLaba = $request->sell_price > $bookValue;
            $isRugi = $request->sell_price < $bookValue;
            $selisih = abs($request->sell_price - $bookValue);

            // --- STEP A: ELIMINASI AKUMULASI PENYUSUTAN ---
            // (Debit: Akumulasi, Kredit: Aset Tetap) -> Agar saldo akumulasi jadi 0
            $adjAccumulated = $asetTetap->payments()->create([
                'mutation_type' => 'Penyesuaian Jual Aset (Akumulasi)',
                'currency' => 'IDR',
                'debit_akun' => 'NR-DB Akumulasi Penyusutan',
                'kredit_akun' => 'NR-DB Asset Tetap',
                'nominal' => $asetTetap->accumulated_depreciation,
                'user_id' => $userId,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'branch_id' => $branchId,
                'date' => $request->date,
            ]);
            $this->applyPaymentMutation($adjAccumulated);

            // --- STEP B: CATAT PENERIMAAN KAS/PIUTANG ---
            // (Debit: Piutang, Kredit: Aset Tetap) -> Mengurangi sisa nilai aset di neraca
            $sellEntry = $asetTetap->payments()->create([
                'mutation_type' => 'Penjualan Aset Tetap',
                'currency' => 'IDR',
                'debit_akun' => 'NR-DB Piutang Jual Aset',
                'kredit_akun' => 'NR-DB Asset Tetap',
                'nominal' => $request->sell_price,
                'user_id' => $userId,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'branch_id' => $branchId,
                'date' => $request->date,
            ]);
            $this->applyPaymentMutation($sellEntry);

            // --- STEP C: CATAT SELISIH LABA / RUGI ---
            if ($isLaba) {
                // Jika untung: Debit Aset Tetap (untuk mengnolkan sisa kredit berlebih), Kredit Laba
                $profitEntry = $asetTetap->payments()->create([
                    'mutation_type' => 'Laba Penjualan Aset',
                    'currency' => 'IDR',
                    'debit_akun' => 'NR-DB Asset Tetap', // Penyeimbang sisa kredit di akun aset
                    'kredit_akun' => 'LR-KR Laba Jual Aset',
                    'nominal' => $selisih,
                    'user_id' => $userId,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                    'branch_id' => $branchId,
                    'date' => $request->date,
                ]);
                $this->applyPaymentMutation($profitEntry);
            } 
            elseif ($isRugi) {
                // Jika rugi: Debit Rugi, Kredit Aset Tetap (untuk mengnolkan sisa debit aset)
                $lossEntry = $asetTetap->payments()->create([
                    'mutation_type' => 'Rugi Penjualan Aset',
                    'currency' => 'IDR',
                    'debit_akun' => 'LR-DB Rugi Jual Aset',
                    'kredit_akun' => 'NR-DB Asset Tetap', // Menghabiskan sisa debit aset
                    'nominal' => $selisih,
                    'user_id' => $userId,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                    'branch_id' => $branchId,
                    'date' => $request->date,
                ]);
                $this->applyPaymentMutation($lossEntry);
            }

            // Update status aset
            $asetTetap->update([
                'status' => 'sold',
                'sold_value' => $request->sell_price
            ]);
        });

        return back()->with('success', 'Aset berhasil terjual dan jurnal telah dicatat.');
    }   

    /**
     * FUNGSI BUANG (DISPOSE)
     */
    public function dispose(Request $request, FixedAsset $asetTetap)
    {
        $request->validate(['date' => 'required|date']);

        DB::transaction(function () use ($request, $asetTetap) {
            // 2.a Balik Akumulasi (Debit Akumulasi, Kredit Aset Tetap)
            $adjAccumulated = $asetTetap->payments()->create([
                'mutation_type' => 'Penyesuaian Buang Aset (Akumulasi)',
                'currency' => 'IDR',
                'debit_akun' => 'NR-DB Akumulasi Penyusutan',
                'kredit_akun' => 'NR-DB Asset Tetap',
                'nominal' => $asetTetap->accumulated_depreciation,
                'user_id' => Auth::id(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'branch_id' => Auth::user()->branch_id,
                'date' => $request->date,
            ]);
            $this->applyPaymentMutation($adjAccumulated);

            // 2.b Catat Kerugian/Beban Buang (Debit Beban, Kredit Aset Tetap)
            // Nominalnya adalah Nilai Buku saat ini
            $bookValue = $asetTetap->purchase_cost - $asetTetap->accumulated_depreciation;
            
            $disposeEntry = $asetTetap->payments()->create([
                'mutation_type' => 'Pembuangan Aset Tetap',
                'currency' => 'IDR',
                'debit_akun' => 'LR-DB Buang Aset',
                'kredit_akun' => 'NR-DB Asset Tetap',
                'nominal' => $bookValue,
                'user_id' => Auth::id(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'branch_id' => Auth::user()->branch_id,
                'date' => $request->date,
            ]);
            $this->applyPaymentMutation($disposeEntry);

            $asetTetap->update(['status' => 'disposed']);
        });

        return back()->with('success', 'Aset telah dibuang (disposed) dan kerugian buku telah dicatat.');
    }    

    /**
     * Update status aset ke ARCHIVED
     */
    public function archive(FixedAsset $asetTetap)
    {
        if ($asetTetap->status === 'active') {
                return back()->with('error', 'Aset aktif tidak dapat diarsipkan langsung.');
            }

            $asetTetap->update([
                'status' => 'archived',
                'updated_by' => Auth::id()
            ]);

            return back()->with('success', 'Aset berhasil dipindahkan ke arsip.');
    }

    /**
     * Hapus aset (Soft Delete).
     */
    public function destroy(FixedAsset $asetTetap)
    {
        $asetTetap->update(['deleted_by' => Auth::id()]);
        $asetTetap->delete();

        return response()->json(['deleted' => true]);
    }


    /**
     * FUNGSI PEMBAYARAN (Pay Debt / Receive Receivable)
     */
    public function pay(Request $request, FixedAsset $asetTetap)
    {
        $request->validate([
            'nominal' => 'required|numeric|min:1',
            'date' => 'required|date',
            'type' => 'required|in:debt,receivable',
            'payment_method' => 'required|string', // Contoh: CASH, BANK_BCA, QRIS
            'notes' => 'required|string'
        ]);

        DB::transaction(function () use ($request, $asetTetap) {
            $branchId = Auth::user()->branch_id;
            $userId = Auth::id();
            
            // Dinamis mencari akun berdasarkan metode (CASH -> NR-DB CASH / BANK (CASH))
            $cashAccount = "NR-DB CASH / BANK (" . strtoupper($request->payment_method) . ")";

            if ($request->type === 'debt') {
                // KELUAR UANG (Bayar Hutang Pembelian Aset)
                $mutationType = 'Pembayaran Hutang Aset';
                $debitAkun = 'NR-KR Hutang Aset Tetap'; // Mengurangi saldo hutang
                $kreditAkun = $cashAccount;            // Mengurangi saldo kas/bank
            } else {
                // MASUK UANG (Terima Piutang Penjualan Aset)
                $mutationType = 'Pembayaran Piutang Jual Aset';
                $debitAkun = $cashAccount;             // Menambah saldo kas/bank
                $kreditAkun = 'NR-DB Piutang Jual Aset'; // Mengurangi saldo piutang
            }

            $paymentEntry = $asetTetap->payments()->create([
                'mutation_type' => $mutationType,
                'currency' => 'IDR',
                'debit_akun' => $debitAkun,
                'kredit_akun' => $kreditAkun,
                'nominal' => $request->nominal,
                'payment_method' => $request->payment_method, // Simpan metodenya
                'notes' => $request->notes,
                'user_id' => $userId,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'branch_id' => $branchId,
                'date' => $request->date,
            ]);

            $this->applyPaymentMutation($paymentEntry);
        });

        return back();
    }

    public function addImage(Request $request, FixedAsset $asset) 
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        // Ambil array gambar yang sudah ada (atau array kosong jika belum ada)
        $currentImages = $asset->images ?? [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                // Simpan file ke storage
                $path = $file->store('assets', 'public');
                // Tambahkan path baru ke array
                $currentImages[] = $path;
            }
        }

        // Simpan kembali ke database
        $asset->update([
            'images' => $currentImages
        ]);

        return back();
    }

    public function deleteImage(Request $request, FixedAsset $asset) {
        $path = $request->path;
        $images = $asset->images;

        // Hapus dari array
        if (($key = array_search($path, $images)) !== false) {
            unset($images[$key]);
            // Hapus file fisik
            Storage::disk('public')->delete($path);
        }

        $asset->update(['images' => array_values($images)]);
        return back();
    }



    ////////////// ACCOUNT BALANCE HELPERS //////////

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
}