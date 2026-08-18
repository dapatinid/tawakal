<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BranchAdminController extends Controller
{

public function index(Request $request)
{
    if (Auth::user()->level === 'Super Admin') {
        $baseQuery = Branch::with('partner');
    } else {
        // Pastikan hanya melihat cabang dalam satu partner yang sama
        $baseQuery = Branch::wherePartnerId(Auth::user()->branch->partner_id)->with('partner');
    }

    $branches = $baseQuery->when($request->filled('search'), function ($q) use ($request) {
        // Normalisasi input ke huruf kecil
        $searchTerm = strtolower($request->search);

        // Bungkus dalam nested where agar logika OR tidak merusak filter partner_id di atas
        $q->where(function ($qq) use ($searchTerm) {
            $qq->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
               ->orWhereRaw('LOWER(slug) like ?', ["%{$searchTerm}%"])
               ->orWhereRaw('LOWER(street_address) like ?', ["%{$searchTerm}%"])
               ->orWhere('phone', 'like', "%{$searchTerm}%");

            // Keamanan PostgreSQL: Cari ID hanya jika input adalah angka
            if (is_numeric($searchTerm)) {
                $qq->orWhere('id', $searchTerm);
            }
        });
    });

    return Inertia::render('Admin/Branch/Index', [
        'branches' => $branches->orderBy('name')->paginate(50)->withQueryString(),
        'filters'  => $request->only('search'),
    ]);
}


public function create()
{
    return Inertia::render('Admin/Branch/Create', [
        'partners' => Partner::select('id', 'name')->orderBy('name')->get(),
    ]);
}


public function store(Request $request)
{
    $data = $request->validate([
        'partner_id'     => 'required|exists:partners,id',
        'name'           => 'required|string|max:255',
        'slug'           => 'required|string|max:255|unique:branches,slug',
        'phone'          => 'nullable|string|max:50',
        'street_address' => 'nullable|string',
        'type'           => 'nullable|string',
        'is_open'        => 'boolean',
        'is_active'      => 'boolean',
        'logo'           => 'nullable|image|max:2048',
        'image'          => 'nullable|image|max:4096',
    ]);

    if ($request->hasFile('logo')) {
        $path = $request->file('logo')->store('branches/logo', 'public');
        $data['logo'] = '/storage/' . $path;
    }

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('branches/image', 'public');
        $data['image'] = '/storage/' . $path;
    }

    $data['created_by'] = $request->user()->id;

    Branch::create($data);

    return redirect()
        ->route('admin.cabang.index')
        ->with('success', 'Cabang berhasil ditambahkan');
}

 
    public function edit(Branch $branch)
    {
        return Inertia::render('Admin/Branch/Edit', [
            'branch' => [
                'id'             => $branch->id,
                'partner_id'     => $branch->partner_id,
                'name'           => $branch->name,
                'slug'           => $branch->slug,
                'phone'          => $branch->phone,
                'street_address' => $branch->street_address,
                'type'           => $branch->type,
                'is_open'        => $branch->is_open,
                'is_active'      => $branch->is_active,
                'logo'           => $branch->logo ? asset($branch->logo) : null,
                'image'          => $branch->image ? asset($branch->image) : null,
            ],
            'partners' => Partner::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

public function update(Request $request, Branch $branch)
{
    $data = $request->validate([
        'partner_id'      => 'required|exists:partners,id',
        'name'            => 'required|string|max:255',
        'slug'            => 'required|string|max:255|unique:branches,slug,' . $branch->id,
        'phone'           => 'nullable|string|max:50',
        'street_address'  => 'nullable|string',
        'type'            => 'nullable|string',
        'is_open'         => 'boolean',
        'is_active'       => 'boolean',
        'logo'            => 'nullable|image|max:2048',
        'image'           => 'nullable|image|max:4096',
    ]);

    // ===== LOGO =====
    if ($request->hasFile('logo')) {

        // hapus logo lama
        if ($branch->logo) {
            Storage::disk('public')->delete($branch->logo);
        }

        $data['logo'] = $request
            ->file('logo')
            ->store('branches/logo', 'public');
    }

    // ===== IMAGE =====
    if ($request->hasFile('image')) {

        // hapus image lama
        if ($branch->image) {
            Storage::disk('public')->delete($branch->image);
        }

        $data['image'] = $request
            ->file('image')
            ->store('branches/image', 'public');
    }

    $data['updated_by'] = $request->user()->id;

    $branch->update($data);

    return redirect()
        ->route('admin.cabang.index')
        ->with('success', 'Cabang berhasil diperbarui');
}


public function destroy(Branch $branch)
{
    if ($branch->logo) {
        Storage::disk('public')->delete(str_replace('/storage/', '', $branch->logo));
    }

    if ($branch->image) {
        Storage::disk('public')->delete(str_replace('/storage/', '', $branch->image));
    }

    $branch->delete();

    return redirect()
        ->route('admin.cabang.index')
        ->with('success', 'Cabang berhasil dihapus');
}


}
