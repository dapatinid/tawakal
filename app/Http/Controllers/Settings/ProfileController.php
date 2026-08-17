<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\Village;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
public function edit(Request $request)
{
    $user = Auth::user();

    // ===============================
    // PROVINCES (SELALU ADA)
    // ===============================
    $provinces = Province::selectRaw('code as value, name as label')
        ->orderBy('id')
        ->get();

    // ===============================
    // DEPENDENT CITIES
    // ===============================
    $cities = [];
    if ($request->province_code || $user->state) {
        $provinceCode = $request->province_code ?? $user->state;

        $cities = City::where('province_code', $provinceCode)
            ->selectRaw('code as value, name as label')
            ->orderByDesc('name')
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

    return Inertia::render('settings/Profile', [
        'user' => $user,
        'provinces' => $provinces,
        'cities' => $cities,
        'districts' => $districts,
        'villages' => $villages,
    ]);
}


    /**
     * Update the user's profile information.
     */
public function update(Request $request)
{
    $user = auth()->user();

    $data = $request->validate([
        'name'  => 'required|string|max:255',
        'username' => "required|unique:users,username,{$user->id}",
        'email' => "required|email|unique:users,email,{$user->id}",
        'password' => 'nullable|min:6',

        /* KONTAK */
        'phone' => 'required|string|max:20',

        /* ALAMAT */
        'street_address' => 'required|string',
        'zip_code'       => 'nullable|string|max:10',
        'rute'           => 'nullable|string|max:100',

        /* WILAYAH */
        'province_code' => 'required|string',
        'city_code'     => 'required|string',
        'district_code' => 'required|string',
        'village_code'  => 'required|string',

        /* FILE */
        'avatar' => 'nullable|image|max:2048',
        'cover'  => 'nullable|image|max:4096',
    ]);

    // ===============================
    // PASSWORD
    // ===============================
    if ($request->filled('password')) {
        $data['password'] = Hash::make($request->password);
    } else {
        unset($data['password']);
    }

    // ===============================
    // WILAYAH MAPPING
    // ===============================
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

    // ===============================
    // AVATAR
    // ===============================
    if ($request->hasFile('avatar')) {

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $data['avatar'] = $request
            ->file('avatar')
            ->store('users/avatar', 'public');
    }

    // ===============================
    // COVER
    // ===============================
    if ($request->hasFile('cover')) {

        if ($user->cover) {
            Storage::disk('public')->delete($user->cover);
        }

        $data['cover'] = $request
            ->file('cover')
            ->store('users/cover', 'public');
    }

    $data['updated_oleh'] = $user->id;

    $user->update($data);

    return back()->with('success', 'Profil berhasil diperbarui');
}


    /**
     * Delete the user's profile.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        auth()->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
