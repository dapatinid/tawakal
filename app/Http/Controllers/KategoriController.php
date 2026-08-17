<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KategoriController extends Controller
{
    // ======================
    // INDEX
    // ======================
    public function index()
    {
        $branchId = Auth::user()->branch_id;

        $kategori = Category::withCount([
            'products as products_count' => function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            }
        ])->latest()->get();

        return Inertia::render('Kategori/Index', compact('kategori'));
    }

    // ======================
    // CREATE
    // ======================
    public function create()
    {
        return Inertia::render('Kategori/Create');
    }

    // ======================
    // STORE
    // ======================
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'slug'      => 'nullable|string|max:255|unique:categories,slug',
            'image'     => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        Category::create($data);

        return redirect()
            ->route('kategori.index')
            ->with('success', 'Kategori berhasil ditambahkan');
    }

    // ======================
    // EDIT
    // ======================
    public function edit(Category $category)
    {
        return Inertia::render('Kategori/Edit', compact('category'));
    }

    // ======================
    // UPDATE
    // ======================
    public function update(Request $request, Category $category)
    {
        // Validasi
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'slug'         => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'image'        => 'nullable|image|max:2048',
            'is_active'    => 'boolean',
            'remove_image' => 'nullable|boolean',
        ]);

        // Jika slug kosong, buat otomatis dari name
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        // Hapus image lama jika remove_image = true
        if (!empty($data['remove_image']) && $category->image) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $category->image), '/'));
            $data['image'] = null;
        }

        // Upload image baru
        if ($request->hasFile('image')) {
            // Hapus image lama
            if ($category->image) {
                Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $category->image), '/'));
            }

            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        // Update category
        $category->update($data);

        return redirect()
            ->route('kategori.index')
            ->with('success', 'Kategori berhasil diperbarui');
    }    

    // ======================
    // DESTROY
    // ======================
    public function destroy(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete(
                ltrim(str_replace('/storage/', '', $category->image), '/')
            );
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus');
    }
}
