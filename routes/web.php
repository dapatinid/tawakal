<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Partner;

use App\Http\Controllers\Admin\PartnerAdminController;
use App\Http\Controllers\Admin\BranchAdminController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\AsetTetapController;
use App\Http\Controllers\QuestionerController;

use App\Http\Controllers\CabangController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\ProfitLossController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\StokController;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\MerkController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PenyesuaianStokController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderNowController;
use App\Http\Controllers\ReturController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\HomeController;


// Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('@{branch:slug}', [OrderNowController::class, 'index'])
    ->name('ordernow.store')
    ->missing(function () {
        return redirect()->route('home');
    });
Route::get('product/{product:slug}', [ProductController::class, 'show'])->name('product.show');

Route::get('partners', function () {
    return Inertia::render('Partner/Index', [
        'partners' => Partner::where('is_active', true)
        ->select('id', 'slug', 'name', 'logo', 'image', 'is_open')
        ->orderBy('name')
        ->get(),
    ]);
})->name('partner.index');

Route::get('questioner', [QuestionerController::class, 'index'])->name('questioner.index');

Route::group(['middleware' => ['auth', 'verified', 'is_active', 'profile.complete']], function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
        
    // NOTIFIKASI
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');

    Route::middleware(['admin', 'partner.subscription'])->group(function () {
        
        // KASIR AREA
        Route::get('kategori', [KategoriController::class, 'index'])->name('kategori.index');
        Route::get('merk', [MerkController::class, 'index'])->name('merk.index');

        Route::get('produk', [ProdukController::class, 'index'])->name('produk.index');
        Route::get('produk/{produk}/show', [ProdukController::class, 'show'])->name('produk.show');
        Route::get('produk/{produk}/preview', [ProdukController::class, 'preview'])->name('produk.preview');
        Route::get('produk/buat/baru', [ProdukController::class, 'create'])->name('produk.create');
        Route::post('produk/store', [ProdukController::class, 'store'])->name('produk.store');
        Route::get('produk/{produk}/edit', [ProdukController::class, 'edit'])->name('produk.edit');
        Route::put('produk/{produk}/update', [ProdukController::class, 'update'])->name('produk.update');
        Route::put('produk/{produk}/toggle-active', [ProdukController::class, 'toggleActive'])->name('produk.toggleActive');      

        ////// PENJUALAN ////////
        Route::get('/penjualan/export', [PenjualanController::class, 'export'])->name('penjualan.export');

        Route::get('penjualan', [PenjualanController::class, 'index'])->name('penjualan.index');
        Route::get('penjualan/buat/baru', [PenjualanController::class, 'create'])->name('penjualan.create');
        Route::post('penjualan/store', [PenjualanController::class, 'store'])->name('penjualan.store');
        Route::get('penjualan/{order}/print', [PenjualanController::class, 'print'])->name('penjualan.print');
        Route::get('penjualan/{order}', [PenjualanController::class, 'show'])->name('penjualan.show');
        Route::put('penjualan/{order}/editinfo', [PenjualanController::class, 'editInfo']);
        Route::delete('/penjualan/{order}', [PenjualanController::class, 'destroy'])->name('penjualan.destroy');

        Route::post('penjualan/{order}/item', [PenjualanController::class, 'storeItem']);
        Route::put('item-penjualan/{item}', [PenjualanController::class, 'updateItem']);
        Route::delete('/item-penjualan/{item}', [PenjualanController::class, 'destroyItem']);

        Route::put('penjualan/{order}/biayalain', [PenjualanController::class, 'biayaLain']);

        Route::post('penjualan/{order}/pembayaran', [PenjualanController::class, 'storePayment']);
        Route::put('pembayaran-penjualan/{payment}', [PenjualanController::class, 'updatePayment']);
        Route::delete('/pembayaran-penjualan/{payment}', [PenjualanController::class, 'destroyPayment']);

        
        ////// PEMBELIAN ////////
        Route::get('pembelian', [PembelianController::class, 'index'])->name('pembelian.index');
        Route::get('pembelian/buat/baru', [PembelianController::class, 'create'])->name('pembelian.create');
        Route::post('pembelian/store', [PembelianController::class, 'store'])->name('pembelian.store');
        Route::get('/pembelian/{purchaseOrder}/print', [PembelianController::class, 'print'])->name('pembelian.print');
        Route::get('pembelian/{purchaseOrder}', [PembelianController::class, 'show'])->name('pembelian.show');
        Route::put('pembelian/{purchaseOrder}/editinfo', [PembelianController::class, 'editInfo']);
        Route::delete('pembelian/{purchaseOrder}', [PembelianController::class, 'destroy'])->name('pembelian.destroy');

        Route::post('pembelian/{purchaseOrder}/item', [PembelianController::class, 'storeItem']);
        Route::put('item-pembelian/{item}', [PembelianController::class, 'updateItem']);
        Route::delete('item-pembelian/{item}', [PembelianController::class, 'destroyItem']);

        Route::put('pembelian/{purchaseOrder}/biayalain', [PembelianController::class, 'biayaLain']);

        Route::post('pembelian/{purchaseOrder}/pembayaran', [PembelianController::class, 'storePayment']);
        Route::put('pembayaran-pembelian/{payment}', [PembelianController::class, 'updatePayment']);
        Route::delete('/pembayaran-pembelian/{payment}', [PembelianController::class, 'destroyPayment']);

        ////// PENYESUAIAN ////////
        Route::get('penyesuaian-stok', [PenyesuaianStokController::class, 'index'])->name('penyesuaian-stok.index');
        Route::get('penyesuaian-stok/create', [PenyesuaianStokController::class, 'create'])->name('penyesuaian-stok.create');
        Route::get('/penyesuaian-stok/{adjustmentStock}/print', [PenyesuaianStokController::class, 'print'])->name('penyesuaian-stok.print');
        Route::get('/penyesuaian-stok/{adjustmentStock}/print-surat-jalan', [PenyesuaianStokController::class, 'printSuratJalan'])->name('penyesuaian-stok.print-surat-jalan');
        Route::post('penyesuaian-stok', [PenyesuaianStokController::class, 'store'])->name('penyesuaian-stok.store');
        Route::get('penyesuaian-stok/{adjustmentStock}/edit', [PenyesuaianStokController::class, 'edit'])->name('penyesuaian-stok.edit');
        Route::put('penyesuaian-stok/{adjustmentStock}', [PenyesuaianStokController::class, 'update'])->name('penyesuaian-stok.update');
        Route::delete('penyesuaian-stok/{adjustmentStock}', [PenyesuaianStokController::class, 'destroy'])->name('penyesuaian-stok.destroy');
        Route::put('penyesuaian-stok/{adjustmentStock}/editinfo', [PenyesuaianStokController::class, 'editInfo']);
        Route::get('/penyesuaian-stok/transfer-token/{token}', [PenyesuaianStokController::class, 'getTransferToken']);


        ////// POS atau HALAMAN KASIR ////////
        Route::get('pos', [POSController::class, 'index'])->name('pos.index');
        Route::post('pos/checkout', [POSController::class, 'checkout'])->name('pos.checkout');

        Route::get('stok', [StokController::class, 'index'])->name('stok.index');
        Route::get('retur', [ReturController::class, 'index'])->name('stok.index');
        Route::get('pembayaran', [PembayaranController::class, 'index'])->name('pembayaran.index');
        Route::get('/stok/export', [StokController::class, 'export'])->name('stok.export');

        Route::get('jurnal', [JournalController::class, 'index'])->name('jurnal.index');
        Route::get('jurnal/create', [JournalController::class, 'create'])->name('jurnal.create');
        Route::post('jurnal/store', [JournalController::class, 'store'])->name('jurnal.store');
        Route::get('jurnal/{journal}/edit', [JournalController::class, 'edit'])->name('jurnal.edit');
        Route::put('jurnal/{journal}', [JournalController::class, 'update'])->name('jurnal.update');
        Route::delete('jurnal/{journal}', [JournalController::class, 'destroy'])->name('jurnal.destroy');
        
        Route::get('jurnal-transfer', [JournalController::class, 'transfer'])->name('jurnal.transfer');
        Route::post('jurnal-transfer/store', [JournalController::class, 'createTransfer'])->name('jurnal.transfer.store');
        Route::get('jurnal-transfer/{journal}/edit', [JournalController::class, 'editTransfer'])->name('jurnal.transfer.edit');
        Route::put('jurnal-transfer/{journal}', [JournalController::class, 'updateTransfer'])->name('jurnal.transfer.update');
        Route::delete('jurnal-transfer/{journal}', [JournalController::class, 'destroyTransfer'])->name('jurnal.transfer.destroy');

        Route::middleware('control.panel')->group(function () {
            // OWNER / ADMIN CABANG
            Route::post('/produk/bulk-queue', [ProdukController::class, 'addToQueue'])->name('produk.bulk-queue');
            Route::post('/produk/bulk-remove/{product:id}', [ProdukController::class, 'removeFromQueue'])->name('produk.bulk-remove');
            Route::post('/produk/bulk-remove-all', [ProdukController::class, 'removeFromQueueAll'])->name('produk.bulk-remove-all');
            Route::get('/produk/bulk-price', [ProdukController::class, 'bulkPriceIndex'])->name('produk.bulk-price');
            Route::post('/produk/bulk-process-price', [ProdukController::class, 'processQueuePrice'])->name('produk.bulk-process-price');  

            Route::post('/produk/bulk-queue-alumunium', [ProdukController::class, 'addToQueueAlumunium'])->name('produk.bulk-queue-alumunium');
            Route::post('/produk/bulk-remove-alumunium/{product:id}', [ProdukController::class, 'removeFromQueueAlumunium'])->name('produk.bulk-remove-alumunium');
            Route::post('/produk/bulk-remove-all-alumunium', [ProdukController::class, 'removeFromQueueAllAlumunium'])->name('produk.bulk-remove-all-alumunium');
            Route::get('/produk/bulk-price-alumunium', [ProdukController::class, 'bulkPriceAlumuniumIndex'])->name('produk.bulk-price-alumunium');
            Route::post('/produk/bulk-process-price-alumunium', [ProdukController::class, 'processQueuePriceAlumunium'])->name('produk.bulk-process-price-alumunium');                    
            
            Route::get('aset-tetap', [AsetTetapController::class, 'index'])->name('aset-tetap.index');
            Route::get('/aset-tetap/tambah', [AsetTetapController::class, 'create'])->name('aset-tetap.create');
            Route::post('/aset-tetap', [AsetTetapController::class, 'store'])->name('aset-tetap.store');
            Route::get('/aset-tetap/{asetTetap}', [AsetTetapController::class, 'show'])->name('aset-tetap.show');
            Route::put('/aset-tetap/{asetTetap}/depreciate', [AsetTetapController::class, 'depreciate'])->name('aset-tetap.depreciate');
            Route::post('/aset-tetap/{aset_tetap}/sell', [AsetTetapController::class, 'sell'])->name('aset-tetap.sell');
            Route::post('/aset-tetap/{aset_tetap}/dispose', [AsetTetapController::class, 'dispose'])->name('aset-tetap.dispose');
            Route::patch('/aset-tetap/{asetTetap}/archive', [AsetTetapController::class, 'archive'])->name('aset-tetap.archive');
            Route::delete('/aset-tetap/{asetTetap}', [AsetTetapController::class, 'destroy'])->name('aset-tetap.destroy');
            Route::post('/aset-tetap/{asetTetap}/pay', [AsetTetapController::class, 'pay'])->name('aset-tetap.pay');
            Route::post('/aset-tetap/{asset}/images', [AsetTetapController::class, 'addImage']);
            Route::delete('/aset-tetap/{asset}/images', [AsetTetapController::class, 'deleteImage']);

            Route::get('laba-rugi', [ProfitLossController::class, 'index'])->name('laba-rugi.index');
            Route::get('laba-rugi/export', [ProfitLossController::class, 'export'])->name('laba-rugi.export');
            Route::get('neraca', [BalanceController::class, 'index'])->name('neraca.index');

            Route::get('kategori/buat/baru', [KategoriController::class, 'create'])->name('kategori.create');
            Route::post('kategori', [KategoriController::class, 'store'])->name('kategori.store');
            Route::get('kategori/{category}/edit', [KategoriController::class, 'edit'])->name('kategori.edit');
            Route::put('kategori/{category}', [KategoriController::class, 'update'])->name('kategori.update');

            Route::get('merk/buat/baru', [MerkController::class, 'create'])->name('merk.create');
            Route::post('merk', [MerkController::class, 'store'])->name('merk.store');
            Route::get('merk/{brand}/edit', [MerkController::class, 'edit'])->name('merk.edit');
            Route::put('merk/{brand}', [MerkController::class, 'update'])->name('merk.update');

            Route::get('cabang-saya', [CabangController::class, 'index'])->name('cabang-saya.index');
            Route::put('cabang-saya/switch', [CabangController::class, 'switch'])->name('cabang-saya.switch');

            Route::get('admin/cabang/create', [BranchAdminController::class, 'create'])->name('admin.cabang.create');
            Route::post('admin/cabang', [BranchAdminController::class, 'store'])->name('admin.cabang.store');
            Route::get('admin/cabang', [BranchAdminController::class, 'index'])->name('admin.cabang.index');
            Route::get('admin/cabang/{branch}/edit', [BranchAdminController::class, 'edit'])->name('admin.cabang.edit');
            Route::put('admin/cabang/{branch}', [BranchAdminController::class, 'update'])->name('admin.cabang.update');

            Route::get('admin/pengguna', [UserAdminController::class, 'index'])->name('admin.pengguna.index');
            Route::get('admin/pengguna/create', [UserAdminController::class, 'create'])->name('admin.pengguna.create');
            Route::post('admin/pengguna', [UserAdminController::class, 'store'])->name('admin.pengguna.store');
            Route::get('admin/pengguna/{user}/edit', [UserAdminController::class, 'edit'])->name('admin.pengguna.edit');
            Route::put('admin/pengguna/{user}', [UserAdminController::class, 'update'])->name('admin.pengguna.update');            
            
            Route::middleware('super.admin')->group(function () {
                // SUPER ADMIN AREA

                        Route::delete('kategori/{category}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
                        Route::delete('merk/{brand}', [MerkController::class, 'destroy'])->name('merk.destroy');
                        Route::delete('admin/cabang/{branch}', [BranchAdminController::class, 'destroy'])->name('admin.cabang.destroy');    

                        Route::get('admin/mitra', [PartnerAdminController::class, 'index'])->name('admin.mitra.index');
                        Route::get('admin/mitra/create', [PartnerAdminController::class, 'create'])->name('admin.mitra.create');
                        Route::post('admin/mitra', [PartnerAdminController::class, 'store'])->name('admin.mitra.store');
                        Route::get('admin/mitra/{partner}/edit', [PartnerAdminController::class, 'edit'])->name('admin.mitra.edit');
                        Route::put('admin/mitra/{partner}', [PartnerAdminController::class, 'update'])->name('admin.mitra.update');
                        Route::delete('admin/mitra/{partner}', [PartnerAdminController::class, 'destroy'])->name('admin.mitra.destroy');
                });
        });
    });
});


// Route::get('@{partner:slug}', function (Partner $partner) { // tampilkan halaman partner berdasarkan slug
//     return Inertia::render('Partner', [ // tampilkan halaman partner berdasarkan slug
//         'partner' => $partner, // tampilkan halaman partner berdasarkan slug
//     ]); // tampilkan halaman partner berdasarkan slug
// })->name('store'); // tampilkan halaman partner berdasarkan slug
Route::fallback(function () {
    $path = request()->path(); // ambil 'lapak-zahara'

    // Cek apakah path cocok dengan slug partner
    $partner = Partner::where('slug', $path)->first();

    if ($partner) {
        return Inertia::render('Partner/PartnerDetail', [
            'partner' => $partner,
            'branches' => $partner->branches()->where('is_active', true)->get(),
        ]);
    }

    // Jika bukan slug partner → tampilkan 404 Laravel
    abort(404);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
