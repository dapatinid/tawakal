<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\User;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class UserAdminController extends Controller
{
public function index(Request $request)
{
    $users = User::query()->whereNotIn('id',[1,2,3,4])
        ->with([
            'branch',
            'province',
            'cityRelation',
            'districtRelation',
            'villageRelation',
        ])
        ->when($request->search, function ($q) use ($request) {
            $search = strtolower($request->search); // Normalisasi input

            $q->where(function ($qq) use ($search) {
                $qq->whereRaw('LOWER(name) like ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(email) like ?', ["%{$search}%"])

                // PROVINSI
                ->orWhereHas('province', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                })

                // KABUPATEN / KOTA
                ->orWhereHas('cityRelation', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                })

                // KECAMATAN
                ->orWhereHas('districtRelation', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                })

                // DESA
                ->orWhereHas('villageRelation', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                });
            });
        })

        ->latest()
        ->paginate(50)
        ->withQueryString();

    return Inertia::render('Admin/User/Index', [
        'users' => $users,
        'filters' => $request->only('search'),
    ]);
}



public function create(Request $request)
{
    // ===============================
    // BRANCHES (SELALU ADA)
    // ===============================
    $branches = Branch::select('id as value', 'name as label')
        ->orderBy('name')
        ->get();

    // ===============================
    // PROVINCES (SELALU ADA)
    // ===============================
    $provinces = Province::selectRaw('code as value, name as label')
        ->orderBy('name')
        ->get();

    // ===============================
    // DEPENDENT CITIES, DISTRICTS, VILLAGES
    // ===============================
    $cities = $request->province_code
        ? City::where('province_code', $request->province_code)
            ->selectRaw('code as value, name as label')
            ->orderBy('name')
            ->get()
        : [];

    $districts = $request->city_code
        ? District::where('city_code', $request->city_code)
            ->selectRaw('code as value, name as label')
            ->orderBy('name')
            ->get()
        : [];

    $villages = $request->district_code
        ? Village::where('district_code', $request->district_code)
            ->selectRaw('code as value, name as label')
            ->orderBy('name')
            ->get()
        : [];

    // ===============================
    // RENDER CREATE INERTIA
    // ===============================
    return Inertia::render('Admin/User/Create', [
        'branches' => $branches,
        'provinces' => $provinces,
        'cities' => $cities,
        'districts' => $districts,
        'villages' => $villages,
    ]);
}

public function store(Request $request)
{
    $data = $request->validate([
        'name'  => 'required|string|max:255',
        'username'  => 'required|string|max:255|unique:users',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',

        /* KONTAK */
        'phone' => 'nullable|string|max:20',

        /* STATUS */
        'is_active' => 'nullable|boolean',
        'is_admin'  => 'nullable|boolean',
        'level'     => 'nullable|string|in:Super Admin,Admin,Owner',
        'class' => 'nullable|string|max:255', // simpan sebagai string, frontend bisa tags

        /* RELASI */
        'branch_id' => 'nullable|exists:branches,id',

        /* ALAMAT */
        'street_address' => 'nullable|string',
        'zip_code'       => 'nullable|string|max:10',
        'rute'           => 'nullable|string|max:100',

        /* WILAYAH (CODE) */
        'province_code' => 'nullable|string',
        'city_code'     => 'nullable|string',
        'district_code' => 'nullable|string',
        'village_code'  => 'nullable|string',

        /* FILE */
        'avatar' => 'nullable|image|max:2048',
        'cover'  => 'nullable|image|max:4096',
    ]);

    // =========================
    // PASSWORD
    // =========================
    $data['password'] = Hash::make($data['password']);

    // =========================
    // BOOLEAN NORMALIZATION
    // =========================
    $data['is_active'] = $request->boolean('is_active');
    $data['is_admin']  = $request->boolean('is_admin');

    // =========================
    // LEVEL SAFETY
    // =========================
    if (!$data['is_admin']) {
        $data['level'] = null;
    }

    // =========================
    // WILAYAH MAPPING
    // =========================
    $data['state']    = $data['province_code'] ?? null;
    $data['city']     = $data['city_code'] ?? null;
    $data['district'] = $data['district_code'] ?? null;
    $data['village']  = $data['village_code'] ?? null;

    unset(
        $data['province_code'],
        $data['city_code'],
        $data['district_code'],
        $data['village_code']
    );

    // =========================
    // AVATAR
    // =========================
    if ($request->hasFile('avatar')) {
        $data['avatar'] = $request
            ->file('avatar')
            ->store('users/avatar', 'public');
    }

    // =========================
    // COVER
    // =========================
    if ($request->hasFile('cover')) {
        $data['cover'] = $request
            ->file('cover')
            ->store('users/cover', 'public');
    }

    // =========================
    // AUDIT
    // =========================
    $data['created_oleh'] = auth()->id();
    $data['updated_oleh'] = auth()->id();

    User::create($data);

    return redirect()->route('admin.pengguna.index')
        ->with('success', 'Pengguna berhasil ditambahkan');
}




public function edit(Request $request, User $user)
{   
    if (Auth::user()->id != 1 && $user->id == 1) {
        return redirect()->route('admin.pengguna.index');
    }
    // ===============================
    // BRANCHES (SELALU ADA)
    // ===============================
    $branches = Branch::select('id as value', 'name as label')
        ->orderBy('name')
        ->get();

    // ===============================
    // PROVINCES (SELALU ADA)
    // ===============================
    $provinces = Province::selectRaw('code as value, name as label')
        ->orderBy('name')
        ->get();

    // ===============================
    // DEPENDENT CITIES
    // ===============================
    $cities = [];
    if ($request->province_code || $user->state) {
        $provinceCode = $request->province_code ?? $user->state;

        $cities = City::where('province_code', $provinceCode)
            ->selectRaw('code as value, name as label')
            ->orderBy('name')
            ->get();
    }

    // ===============================
    // DEPENDENT DISTRICTS
    // ===============================
    $districts = [];
    if ($request->city_code || $user->city) {
        $cityCode = $request->city_code ?? $user->city;

        $districts = District::where('city_code', $cityCode)
            ->selectRaw('code as value, name as label')
            ->orderBy('name')
            ->get();
    }

    // ===============================
    // DEPENDENT VILLAGES
    // ===============================
    $villages = [];
    if ($request->district_code || $user->district) {
        $districtCode = $request->district_code ?? $user->district;

        $villages = Village::where('district_code', $districtCode)
            ->selectRaw('code as value, name as label')
            ->orderBy('name')
            ->get();
    }

    // ===============================
    // RENDER INERTIA
    // ===============================
    return Inertia::render('Admin/User/Edit', [
        'user' => $user,
        'branches' => $branches,
        'provinces' => $provinces,
        'cities' => $cities,
        'districts' => $districts,
        'villages' => $villages,
    ]);
}



public function update(Request $request, User $user)
{
    $data = $request->validate([
        'name'  => 'required|string|max:255',
        'username' => "required|unique:users,username,{$user->id}",
        'email' => "required|email|unique:users,email,{$user->id}",
        'password' => 'nullable|min:6',

        /* KONTAK */
        'phone' => 'nullable|string|max:20',

        /* STATUS */
        'is_active' => 'nullable|boolean',
        'is_admin'  => 'nullable|boolean',
        'level'     => 'nullable|string|in:Super Admin,Admin,Owner',
        'class' => 'nullable|string|max:100',

        /* RELASI */
        'branch_id' => 'nullable|exists:branches,id',

        /* ALAMAT */
        'street_address' => 'nullable|string',
        'zip_code'       => 'nullable|string|max:10',
        'rute'           => 'nullable|string|max:100',

        /* WILAYAH (CODE) */
        'province_code' => 'nullable|string',
        'city_code'     => 'nullable|string',
        'district_code' => 'nullable|string',
        'village_code'  => 'nullable|string',

        /* FILE */
        'avatar' => 'nullable|image|max:2048',
        'cover'  => 'nullable|image|max:4096',
    ]);

    /* =========================
       PASSWORD
    ========================= */
    if ($request->filled('password')) {
        $data['password'] = Hash::make($request->password);
    } else {
        unset($data['password']);
    }

    /* =========================
       BOOLEAN NORMALIZATION
       (AMAN UNTUK FORM DATA)
    ========================= */
    $data['is_active'] = $request->boolean('is_active');
    $data['is_admin']  = $request->boolean('is_admin');

    /* =========================
       LEVEL SAFETY
    ========================= */
    if (!$data['is_admin']) {
        $data['level'] = null;
    }

    /* =========================
       WILAYAH MAPPING
    ========================= */
    $data['state']    = $data['province_code'] ?? null;
    $data['city']     = $data['city_code'] ?? null;
    $data['district'] = $data['district_code'] ?? null;
    $data['village']  = $data['village_code'] ?? null;

    unset(
        $data['province_code'],
        $data['city_code'],
        $data['district_code'],
        $data['village_code']
    );

    /* =========================
       AVATAR
    ========================= */
    if ($request->hasFile('avatar')) {
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $data['avatar'] = $request
            ->file('avatar')
            ->store('users/avatar', 'public');
    }

    /* =========================
       COVER
    ========================= */
    if ($request->hasFile('cover')) {
        if ($user->cover) {
            Storage::disk('public')->delete($user->cover);
        }

        $data['cover'] = $request
            ->file('cover')
            ->store('users/cover', 'public');
    }

    /* =========================
       AUDIT
    ========================= */
    $data['updated_oleh'] = auth()->id();

    $user->update($data);

    return back()->with('success', 'Pengguna berhasil diperbarui');
}


}
