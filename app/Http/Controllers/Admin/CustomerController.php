<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch; // Boleh dihapus jika tidak dipakai sama sekali di backend
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

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        // Hanya ambil data yang class-nya mengandung kata 'customer'
        $users = User::query()->whereNotIn('id',[1,2,3,4])
            ->where('class', 'like', '%customer%') 
            ->with([
                'province',
                'cityRelation',
                'districtRelation',
                'villageRelation',
            ])
            ->when($request->search, function ($q) use ($request) {
                $search = strtolower($request->search);
                $q->where(function ($qq) use ($search) {
                    $qq->whereRaw('LOWER(name) like ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(email) like ?', ["%{$search}%"])
                    ->orWhereHas('province', function ($r) use ($search) {
                        $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                    })
                    ->orWhereHas('cityRelation', function ($r) use ($search) {
                        $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                    })
                    ->orWhereHas('districtRelation', function ($r) use ($search) {
                        $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                    })
                    ->orWhereHas('villageRelation', function ($r) use ($search) {
                        $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                    });
                });
            })
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Customer/Index', [
            'users' => $users,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request)
    {
        $provinces = Province::selectRaw('code as value, name as label')->orderBy('name')->get();
        $cities = $request->province_code ? City::where('province_code', $request->province_code)->selectRaw('code as value, name as label')->orderBy('name')->get() : [];
        $districts = $request->city_code ? District::where('city_code', $request->city_code)->selectRaw('code as value, name as label')->orderBy('name')->get() : [];
        $villages = $request->district_code ? Village::where('district_code', $request->district_code)->selectRaw('code as value, name as label')->orderBy('name')->get() : [];

        return Inertia::render('Admin/Customer/Create', [
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
            'phone' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
            'class' => 'required|string|max:255', // supplier atau customer
            'street_address' => 'nullable|string',
            'zip_code'       => 'nullable|string|max:10',
            'rute'           => 'nullable|string|max:100',
            'province_code' => 'nullable|string',
            'city_code'     => 'nullable|string',
            'district_code' => 'nullable|string',
            'village_code'  => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
            'cover'  => 'nullable|image|max:4096',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['is_active'] = $request->boolean('is_active');
        $data['is_admin']  = false; // Paksa jadi false karena ini customer/supplier
        $data['level']     = null; // Kosongkan level
        $data['branch_id'] = null; // Kosongkan cabang

        $data['state']    = $data['province_code'] ?? null;
        $data['city']     = $data['city_code'] ?? null;
        $data['district'] = $data['district_code'] ?? null;
        $data['village']  = $data['village_code'] ?? null;

        unset($data['province_code'], $data['city_code'], $data['district_code'], $data['village_code']);

        if ($request->hasFile('avatar')) $data['avatar'] = $request->file('avatar')->store('users/avatar', 'public');
        if ($request->hasFile('cover')) $data['cover'] = $request->file('cover')->store('users/cover', 'public');

        $data['created_oleh'] = auth()->id();
        $data['updated_oleh'] = auth()->id();

        User::create($data);

        return redirect()->route('admin.customer.index')->with('success', 'Customer berhasil ditambahkan');
    }

    public function edit(Request $request, User $user)
    {   
        $provinces = Province::selectRaw('code as value, name as label')->orderBy('name')->get();

        $cities = [];
        if ($request->province_code || $user->state) {
            $cities = City::where('province_code', $request->province_code ?? $user->state)->selectRaw('code as value, name as label')->orderBy('name')->get();
        }

        $districts = [];
        if ($request->city_code || $user->city) {
            $districts = District::where('city_code', $request->city_code ?? $user->city)->selectRaw('code as value, name as label')->orderBy('name')->get();
        }

        $villages = [];
        if ($request->district_code || $user->district) {
            $villages = Village::where('district_code', $request->district_code ?? $user->district)->selectRaw('code as value, name as label')->orderBy('name')->get();
        }

        return Inertia::render('Admin/Customer/Edit', [
            'user' => $user,
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
            'phone' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
            'class' => 'required|string|max:100',
            'street_address' => 'nullable|string',
            'zip_code'       => 'nullable|string|max:10',
            'rute'           => 'nullable|string|max:100',
            'province_code' => 'nullable|string',
            'city_code'     => 'nullable|string',
            'district_code' => 'nullable|string',
            'village_code'  => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
            'cover'  => 'nullable|image|max:4096',
        ]);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        $data['is_active'] = $request->boolean('is_active');
        $data['state']    = $data['province_code'] ?? null;
        $data['city']     = $data['city_code'] ?? null;
        $data['district'] = $data['district_code'] ?? null;
        $data['village']  = $data['village_code'] ?? null;

        unset($data['province_code'], $data['city_code'], $data['district_code'], $data['village_code']);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) Storage::disk('public')->delete($user->avatar);
            $data['avatar'] = $request->file('avatar')->store('users/avatar', 'public');
        }

        if ($request->hasFile('cover')) {
            if ($user->cover) Storage::disk('public')->delete($user->cover);
            $data['cover'] = $request->file('cover')->store('users/cover', 'public');
        }

        $data['updated_oleh'] = auth()->id();
        $user->update($data);

        return back()->with('success', 'Customer berhasil diperbarui');
    }
}