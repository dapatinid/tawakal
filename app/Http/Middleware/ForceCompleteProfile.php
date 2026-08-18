<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForceCompleteProfile
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();

        // Jangan redirect jika sedang di halaman profile
        if (
            !$user->isProfileComplete() &&
            !$request->routeIs(
                'profile.edit',
                'profile.update',
                'logout'
            )
        ) {
            return redirect()
                ->route('profile.edit')
                ->with('info', 'Lengkapi profil Anda.');
        }

        return $next($request);
    }
}
