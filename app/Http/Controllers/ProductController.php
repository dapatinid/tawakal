<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class ProductController extends Controller
{
    // public function index()
    // {
    //     $products = Product::with('categories')->paginate(20);
    //     return Inertia::render('Product/Index', compact('products'));
    // }

    public function show(Product $product)
    {
        $product->load(['categories', 'brand', 'branch.partner']); // pastikan relasi sudah diset di model
        $variants = Product::where('group', $product->group)
            ->whereNotNull('group')        // Pastikan tidak NULL
            ->where('group', '!=', '')     // Pastikan bukan string kosong
            ->where('branch_id', $product->branch_id)
            ->orderBy('name')
            ->get();
        $relatedProducts = Product::where('id', '!=', $product->id)->where('is_active', true)->where('is_public', true)
            ->where('branch_id', $product->branch_id)
            ->where(function ($q) use ($product) {
                $q->whereHas('categories', function ($qc) use ($product) {
                    $qc->whereIn('categories.id', $product->categories->pluck('id'));
                })
                ->orWhere('brand_id', $product->brand_id);
            })
            ->inRandomOrder()
            ->limit(10)
            ->get();

        $branchId = $product->branch_id;

        // batas aktif (misal 5 menit terakhir)
        $onlineThreshold = Carbon::now()->subMinutes(5)->timestamp;

        $hasOnlineAdmin = DB::table('sessions')
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->where('users.is_admin', true)
            ->where('users.branch_id', $branchId)
            ->where('sessions.last_activity', '>=', $onlineThreshold)
            ->exists();    

        return Inertia::render('Product/Show', compact(
            'product',
            'variants',
            'relatedProducts',
            'hasOnlineAdmin',
        ));
        // return response()->json($product);
    }

    // public function store(Request $request)
    // {
    //     $data = $request->validate([
    //         'name' => 'required|string',
    //         'price' => 'required|numeric',
    //     ]);
    //     $product = Product::create($data);
    //     return response()->json($product);
    // }

    // public function update(Request $request, Product $product)
    // {
    //     $product->update($request->only(['name','price','stock','category_id','description','image']));
    //     return response()->json($product);
    // }

    // public function destroy(Product $product)
    // {
    //     $product->delete();
    //     return response()->json(['deleted'=>true]);
    // }
}