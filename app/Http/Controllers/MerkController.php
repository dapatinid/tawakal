<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MerkController extends Controller
{
   // ======================
    // INDEX
    // ======================
    public function index()
    {
        $branchId = Auth::user()->branch_id;

        $merk = Brand::withCount([
            'products as products_count' => function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            }
        ])->latest()->get();

        return Inertia::render('Merk/Index', compact('merk'));
    }

    // ======================
    // CREATE
    // ======================
    public function create()
    {
        return Inertia::render('Merk/Create');
    }

    // ======================
    // STORE
    // ======================
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'slug'      => 'nullable|string|max:255|unique:brands,slug',
            'image'     => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('brands', 'public');
            $data['image'] = '/storage/' . $path;
        }

        Brand::create($data);

        return redirect()
            ->route('merk.index')
            ->with('success', 'Merk berhasil ditambahkan');
    }

    // ======================
    // EDIT
    // ======================
    public function edit(Brand $brand)
    {
        return Inertia::render('Merk/Edit', compact('brand'));
    }

    // ======================
    // UPDATE
    // ======================
    public function update(Request $request, Brand $brand)
    {
        // Validasi
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'slug'         => 'nullable|string|max:255|unique:brands,slug,' . $brand->id,
            'image'        => 'nullable|image|max:2048',
            'is_active'    => 'boolean',
            'remove_image' => 'nullable|boolean',
        ]);

        // Jika slug kosong, buat otomatis dari name
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        // Hapus image lama jika remove_image = true
        if (!empty($data['remove_image']) && $brand->image) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $brand->image), '/'));
            $data['image'] = null;
        }

        // Upload image baru
        if ($request->hasFile('image')) {
            // Hapus image lama
            if ($brand->image) {
                Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $brand->image), '/'));
            }

            $path = $request->file('image')->store('brands', 'public');
            $data['image'] = '/storage/' . $path;
        }

        // Update brand
        $brand->update($data);

        return redirect()
            ->route('merk.index')
            ->with('success', 'Merk berhasil diperbarui');
    }    

    // ======================
    // DESTROY
    // ======================
    public function destroy(Brand $brand)
    {
        if ($brand->image) {
            Storage::disk('public')->delete(
                ltrim(str_replace('/storage/', '', $brand->image), '/')
            );
        }

        $brand->delete();

        return back()->with('success', 'Merk berhasil dihapus');
    }
}