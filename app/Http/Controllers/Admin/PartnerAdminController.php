<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PartnerAdminController extends Controller
{
    /* =========================
       INDEX
    ========================= */
    public function index(Request $request)
    {
        $partners = Partner::query()
            ->when($request->filled('search'), function ($q) use ($request) {
                // Normalisasi input ke huruf kecil
                $searchTerm = strtolower($request->search);

                $q->where(function ($qq) use ($searchTerm) {
                    // Pencarian Nama, Slug, dan Alamat (Case-Insensitive)
                    $qq->whereRaw('LOWER(name) like ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(slug) like ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(street_address) like ?', ["%{$searchTerm}%"]);

                    // Pencarian Nomor Telepon
                    $qq->orWhere('phone', 'like', "%{$searchTerm}%");

                    // Keamanan PostgreSQL: Cari ID hanya jika input adalah angka
                    if (is_numeric($searchTerm)) {
                        $qq->orWhere('id', $searchTerm);
                    }
                });
            })
            ->orderBy('name')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Partner/Index', [
            'partners' => $partners,
            'filters'  => $request->only('search'),
        ]);
    }
 
    /* =========================
       CREATE
    ========================= */
    public function create()
    {
        return Inertia::render('Admin/Partner/Create');
    }

    /* =========================
       STORE
    ========================= */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'slug'           => 'nullable|string|max:255|unique:partners,slug',
            'phone'          => 'nullable|string|max:50',
            'street_address' => 'nullable|string',
            'type'           => 'nullable|string',
            'is_open'        => 'boolean',
            'is_active'      => 'boolean',
            'logo'           => 'nullable|image|max:2048',
            'image'          => 'nullable|image|max:4096',
            'registered'     => 'nullable|date',   // ✅
            'expires_on'     => 'nullable|date',   // ✅
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('partners/logo', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('partners/image', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $data['created_by'] = $request->user()->id ?? null;

        Partner::create($data);

        return redirect()
            ->route('admin.mitra.index')
            ->with('success', 'Partner berhasil ditambahkan');
    }

    /* =========================
       EDIT (SUDAH ANDA BUAT)
    ========================= */
    public function edit(Partner $partner)
    {
        return Inertia::render('Admin/Partner/Edit', [
            'partner' => [
                'id'             => $partner->id,
                'name'           => $partner->name,
                'slug'           => $partner->slug,
                'phone'          => $partner->phone,
                'street_address' => $partner->street_address,
                'type'           => $partner->type,
                'is_open'        => $partner->is_open,
                'is_active'      => $partner->is_active,
                'logo'           => $partner->logo ? asset($partner->logo) : null,
                'image'          => $partner->image ? asset($partner->image) : null,
                'registered' => $partner->registered,   // ✅
                'expires_on' => $partner->expires_on,   // ✅
            ],
        ]);
    }

    /* =========================
       UPDATE (SUDAH ANDA BUAT)
    ========================= */
public function update(Request $request, Partner $partner)
{
    $data = $request->validate([
        'name'           => 'required|string|max:255',
        'slug'           => 'nullable|string|max:255|unique:partners,slug,' . $partner->id,
        'phone'          => 'nullable|string|max:30',
        'street_address' => 'nullable|string|max:255',
        'type'           => 'nullable|string',
        'is_open'        => 'required|boolean',
        'is_active'      => 'required|boolean',
        'logo'           => 'nullable|image|max:2048',
        'image'          => 'nullable|image|max:4096',
            'registered'     => 'nullable|date',   // ✅
            'expires_on'     => 'nullable|date',   // ✅
    ]);

    // ===== SLUG =====
    if (empty($data['slug'])) {
        $data['slug'] = Str::slug($data['name']);
    }

    // ===== LOGO =====
    if ($request->hasFile('logo')) {

        // hapus logo lama
        if ($partner->logo) {
            Storage::disk('public')->delete($partner->logo);
        }

        $data['logo'] = $request
            ->file('logo')
            ->store('partners/logo', 'public');
    }

    // ===== IMAGE =====
    if ($request->hasFile('image')) {

        // hapus image lama
        if ($partner->image) {
            Storage::disk('public')->delete($partner->image);
        }

        $data['image'] = $request
            ->file('image')
            ->store('partners/image', 'public');
    }

    $data['updated_by'] = $request->user()->id ?? null;

    $partner->update($data);

    return redirect()
        ->route('admin.mitra.index')
        ->with('success', 'Partner berhasil diperbarui');
}   

    /* =========================
       DESTROY
    ========================= */
    public function destroy(Partner $partner)
    {
        if ($partner->logo) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $partner->logo));
        }

        if ($partner->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $partner->image));
        }

        $partner->delete();

        return redirect()
            ->route('admin.mitra.index')
            ->with('success', 'Partner berhasil dihapus');
    }
}
