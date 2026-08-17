<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderNowController extends Controller
{
    public function index(Request $request, Branch $branch = null)
    {
        $query = Product::query()->where('is_active', true)->where('is_public', true);

        $perpage = (int) $request->get('per_page', 100);
        $sortBy = $request->get('sort_by', 'updated_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        // --- 🚀 PERBAIKAN LOGIKA PENANGANAN TOKO (BRANCH) ---
        if ($branch) {
            // Jika toko ditemukan dari URL (misal: /@lapak-zahara)
            if (!$branch->is_active) {
                // Jika toko sedang TIDAK AKTIF, kembalikan ke beranda utama, BUKAN ke partner
                return redirect()->route('home'); 
            }
            $branch->load('partner');
        } else {
            // Jika tidak ada branch di parameter (Fallback untuk cache yang hilang)
            $storeId = (int) $request->get('store', 1);
            $branch = Branch::with('partner')
                ->where('is_active', true)
                ->find($storeId);

            // Jika toko default (ID 1) sudah dihapus/tidak aktif, cari toko pertama yang aktif di database
            if (!$branch) {
                $branch = Branch::with('partner')->where('is_active', true)->first();
            }

            // Jika database toko memang benar-benar kosong sama sekali
            if (!$branch) {
                return redirect()->route('home');
            }
        }

        $storeId = $branch->id;
        $query->where('branch_id', $storeId);

        // 🔍 Search Produk (Case-Insensitive & Postgres Safe)
        if ($request->filled('search')) {
            $searchTerm = strtolower($request->search);

            $query->where(function ($q) use ($searchTerm) {
                // Pencarian Nama, SKU, dan Barcode menggunakan LOWER
                $q->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(sku) like ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(barcode) like ?', ["%{$searchTerm}%"]);

                // Keamanan PostgreSQL: Cari ID hanya jika input adalah angka
                if (is_numeric($searchTerm)) {
                    $q->orWhere('id', $searchTerm);
                }
            });
        }

        // 🏷️ Filter kategori (MANY TO MANY)
        if ($request->filled('categories')) {
            $categoryIds = explode(',', $request->categories);
            $query->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            });
        }

        // 🏭 Filter brand (masih single)
        if ($request->filled('brands')) {
            $brandIds = explode(',', $request->brands);
            $query->whereIn('brand_id', $brandIds);
        }

        // (Saya menghapus $query->whereIsActive(true) di sini karena sudah dipanggil di baris paling atas, supaya query tidak double)
        $products = $query
            ->with(['categories:id,name', 'brand:id,name'])
            ->when($sortBy === 'random', 
                fn($q) => $q->inRandomOrder(),
                fn($q) => $q->orderBy($sortBy, $sortDirection)
            )
            ->paginate($perpage)
            ->withQueryString();

        $userName = Auth::check() ? Auth::user()->username : '';

        return Inertia::render('OrderNow/Index', [
            'userName'     => $userName,
            'products'     => $products,
            'search'       => $request->get('search', ''),
            'categories'   => Category::whereIn('id',
                DB::table('category_product')
                    ->join('products', 'products.id', '=', 'category_product.product_id')
                    ->where('products.branch_id', $storeId)
                    ->where('products.is_active', true) 
                    ->where('products.is_public', true)
                    ->select('category_product.category_id')
                    ->distinct()
                    ->pluck('category_id')
            )->select('id', 'name')->get(),
            'brands'       => Brand::whereIn('id',
                Product::where('branch_id', $storeId)
                    ->where('is_active', true)
                    ->where('is_public', true)
                    ->select('brand_id')
                    ->distinct()
                    ->pluck('brand_id')
            )->select('id', 'name')->get(),
            'stores'       => Branch::with('partner')->where('is_active', true)->get(),
            'currentStore' => $branch,
        ]);
    }
}