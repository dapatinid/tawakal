<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CabangController extends Controller
{
    /**
     * Halaman pilih cabang
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user || !$user->branch_id) {
            abort(403, 'User tidak memiliki cabang.');
        }

        $currentBranch = Branch::with('partner')->find($user->branch_id);

        if (!$currentBranch || !$currentBranch->partner) {
            abort(404, 'Cabang atau partner tidak ditemukan.');
        }

        return Inertia::render('CabangSaya/Index', [
            'partner'  => $currentBranch->partner,
            'branches' => Branch::where('partner_id', $currentBranch->partner_id)
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Switch cabang (POST)
     */
    public function switch(Request $request)
    {
        $request->validate([
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
        ]);

        $user = auth()->user();

        if (!$user || !$user->branch_id) {
            throw ValidationException::withMessages([
                'branch_id' => 'User tidak memiliki cabang aktif.',
            ]);
        }

        $currentBranch = Branch::find($user->branch_id);

        if (!$currentBranch) {
            throw ValidationException::withMessages([
                'branch_id' => 'Cabang aktif tidak ditemukan.',
            ]);
        }

        $targetBranch = Branch::where('id', $request->branch_id)
            ->where('partner_id', $currentBranch->partner_id)
            ->where('is_active', true)
            ->first();

        if (!$targetBranch) {
            throw ValidationException::withMessages([
                'branch_id' => 'Tidak diizinkan pindah ke cabang ini.',
            ]);
        }

        $user->update([
            'branch_id' => $targetBranch->id,
        ]);

        session([
            'active_branch_id' => $targetBranch->id,
        ]);

        return redirect()->route('cabang-saya.index');
    }

}
