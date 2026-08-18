<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionerController extends Controller
{
    public function index()
    {
        $questions = [
            ['question' => 'Seberapa mudah menggunakan fitur kasir?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Star'],
            ['question' => 'Apakah integrasi toko online membantu penjualan?', 'answers' => ['Tidak Sama Sekali','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'Heart'],
            ['question' => 'Seberapa cepat aplikasi merespon transaksi?', 'answers' => ['Sangat Lambat','Lambat','Biasa','Cepat','Sangat Cepat'], 'icon' => 'Zap'],
            ['question' => 'Apakah laporan penjualan mudah dipahami?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'FileText'],
            ['question' => 'Seberapa nyaman desain antarmuka aplikasi?', 'answers' => ['Sangat Tidak Nyaman','Tidak Nyaman','Biasa','Nyaman','Sangat Nyaman'], 'icon' => 'Smile'],
            ['question' => 'Seberapa mudah menambahkan produk baru?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'PlusSquare'],
            ['question' => 'Seberapa mudah mengatur stok produk?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Archive'],
            ['question' => 'Apakah notifikasi transaksi jelas?', 'answers' => ['Sangat Tidak Jelas','Tidak Jelas','Biasa','Jelas','Sangat Jelas'], 'icon' => 'Bell'],
            ['question' => 'Seberapa puas dengan fitur diskon?', 'answers' => ['Sangat Tidak Puas','Tidak Puas','Biasa','Puas','Sangat Puas'], 'icon' => 'Tag'],
            ['question' => 'Apakah fitur laporan laba rugi membantu?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'BarChart2'],

            ['question' => 'Seberapa mudah melakukan retur produk?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'RotateCcw'],
            ['question' => 'Apakah fitur multi-cabang jelas?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Jelas','Sangat Jelas'], 'icon' => 'MapPin'],
            ['question' => 'Seberapa mudah membuat promo?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Gift'],
            ['question' => 'Apakah integrasi pembayaran online memuaskan?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'CreditCard'],
            ['question' => 'Seberapa cepat checkout di toko online?', 'answers' => ['Sangat Lambat','Lambat','Biasa','Cepat','Sangat Cepat'], 'icon' => 'ShoppingCart'],
            ['question' => 'Seberapa mudah melacak pesanan online?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Eye'],
            ['question' => 'Apakah desain aplikasi menarik?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Menarik','Sangat Menarik'], 'icon' => 'Smile'],
            ['question' => 'Seberapa mudah melihat histori transaksi?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Clock'],
            ['question' => 'Apakah fitur laporan real-time membantu?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'Activity'],
            ['question' => 'Seberapa mudah membuat kategori produk?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Grid'],

            ['question' => 'Seberapa mudah melakukan pembayaran hutang/piutang?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'DollarSign'],
            ['question' => 'Apakah fitur reminder pembayaran jelas?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Jelas','Sangat Jelas'], 'icon' => 'BellRing'],
            ['question' => 'Seberapa mudah mengatur pajak penjualan?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Percent'],
            ['question' => 'Apakah fitur stok minimum membantu?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'AlertCircle'],
            ['question' => 'Seberapa mudah menambahkan foto produk?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Image'],
            ['question' => 'Apakah notifikasi stok habis jelas?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Jelas','Sangat Jelas'], 'icon' => 'BellOff'],
            ['question' => 'Seberapa mudah menghubungi customer support?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Headphones'],
            ['question' => 'Apakah fitur laporan penjualan harian cukup?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Cukup','Sangat Cukup'], 'icon' => 'Calendar'],
            ['question' => 'Seberapa mudah membuat voucher promo?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Gift'],
            ['question' => 'Seberapa nyaman notifikasi aplikasi?', 'answers' => ['Sangat Tidak Nyaman','Tidak Nyaman','Biasa','Nyaman','Sangat Nyaman'], 'icon' => 'Bell'],
            
            ['question' => 'Apakah laporan kasir jelas?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Jelas','Sangat Jelas'], 'icon' => 'FileText'],
            ['question' => 'Seberapa mudah melakukan refund online?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'CornerUpLeft'],
            ['question' => 'Apakah integrasi marketplace memuaskan?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'ShoppingBag'],
            ['question' => 'Seberapa mudah menambahkan varian produk?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Layers'],
            ['question' => 'Apakah fitur loyalty program menarik?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Menarik','Sangat Menarik'], 'icon' => 'Gift'],
            ['question' => 'Seberapa mudah mengatur jam operasional toko?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Clock'],
            ['question' => 'Apakah fitur notifikasi promo efektif?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Efektif','Sangat Efektif'], 'icon' => 'BellRing'],
            ['question' => 'Seberapa mudah mengatur ongkir online?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Truck'],
            ['question' => 'Apakah laporan omset mudah dipahami?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'BarChart2'],
            ['question' => 'Seberapa cepat aplikasi melakukan sync data?', 'answers' => ['Sangat Lambat','Lambat','Biasa','Cepat','Sangat Cepat'], 'icon' => 'RefreshCcw'],

            ['question' => 'Apakah fitur scan barcode membantu?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'Barcode'],
            ['question' => 'Seberapa mudah melakukan split bill?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'DivideSquare'],
            ['question' => 'Apakah fitur reminder stok jelas?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Jelas','Sangat Jelas'], 'icon' => 'AlertCircle'],
            ['question' => 'Seberapa mudah mengubah harga produk?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Edit2'],
            ['question' => 'Apakah fitur laporan keuntungan jelas?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Jelas','Sangat Jelas'], 'icon' => 'TrendingUp'],
            ['question' => 'Seberapa puas dengan fitur checkout cepat?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Puas','Sangat Puas'], 'icon' => 'ShoppingCart'],
            ['question' => 'Seberapa mudah membuat kategori baru online?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'Grid'],
            ['question' => 'Apakah notifikasi transaksi online memuaskan?', 'answers' => ['Sangat Tidak','Kurang','Biasa','Ya','Sangat Ya'], 'icon' => 'Bell'],
            ['question' => 'Seberapa mudah membuat laporan custom?', 'answers' => ['Sangat Sulit','Sulit','Biasa','Mudah','Sangat Mudah'], 'icon' => 'FileText'],
            ['question' => 'Apakah aplikasi kasir terhitung aplikasi mahal?', 'answers' => ['Mahal Sekali','Mahal','Biasa','Murah','Sangat Murah'], 'icon' => 'CircleDollarSign'],
        ];

        return Inertia::render('Questioner', [
            'questions' => $questions
        ]);
    }

}
