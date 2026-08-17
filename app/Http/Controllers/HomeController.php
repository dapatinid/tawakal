<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Ambil produk aktif dan publik, HANYA dari cabang yang aktif dan buka
        $query = Product::query()
            ->where('is_active', true)
            ->where('is_public', true)
            ->whereHas('branch', function ($q) {
                $q->where('is_active', true)
                  ->where('is_open', true);
            });

        $perpage = (int) $request->get('per_page', 600); // Default 40 produk ala marketplace
        $sortBy = $request->get('sort_by', 'updated_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        // 🔍 Pencarian Global Lintas Toko
        if ($request->filled('search')) {
            $searchTerm = strtolower($request->search);
            $query->where(function ($q) use ($searchTerm) {
                $q->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(sku) like ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(barcode) like ?', ["%{$searchTerm}%"]);
            });
        }

        // 🏷️ Filter Kategori Global
        if ($request->filled('categories')) {
            $categoryIds = explode(',', $request->categories);
            $query->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            });
        }

        // 🏭 Filter Brand Global
        if ($request->filled('brands')) {
            $brandIds = explode(',', $request->brands);
            $query->whereIn('brand_id', $brandIds);
        }

        $products = $query->with(['categories:id,name', 'brand:id,name', 'branch:id,name,slug'])
            ->when($sortBy === 'random', 
                fn($q) => $q->inRandomOrder(),
                fn($q) => $q->orderBy($sortBy, $sortDirection)
            )
            // Ubah default per_page menjadi nilai rasional untuk masonry grid (misal: 24 atau 36)
            ->paginate((int) $request->get('per_page', 24)) 
            ->withQueryString();

        // ✨ JIKA DIKIRIM VIA AJAX / INFINITE SCROLL, KEMBALIKAN FORMAT JSON SAJA
        if ($request->wantsJson() || $request->header('X-Infinitemarketplace')) {
            return response()->json($products);
        }

        return Inertia::render('HomeMarketplace', [
            'products'   => $products,
            'search'     => $request->get('search', ''),
            'categories' => Category::whereIn('id',
                DB::table('category_product')
                    ->join('products', 'products.id', '=', 'category_product.product_id')
                    ->where('products.is_active', true)
                    ->select('category_product.category_id')
                    ->distinct()
                    ->pluck('category_id')
            )->select('id', 'name')->get(),
            'brands'     => Brand::whereIn('id',
                Product::where('is_active', true)
                    ->select('brand_id')
                    ->distinct()
                    ->pluck('brand_id')
            )->select('id', 'name')->get(),
            
            // Catatan: Anda mungkin ingin memfilter 'stores' ini juga agar sinkron dengan produk yang tampil
            'stores'     => Branch::with('partner')
                                  ->where('is_active', true)
                                  ->where('is_open', true) // <-- Tambahan opsional jika ingin filter daftar toko di UI
                                  ->get(),
        ]);
    }
}