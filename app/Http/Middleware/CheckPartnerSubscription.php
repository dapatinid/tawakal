<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckPartnerSubscription
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();

        // Ambil partner melalui branch user
        $partner = $user->branch?->partner;

        // Jika tidak punya partner, izinkan lewat
        if (!$partner) {
            return $next($request);
        }

        $now = Carbon::now();
        $registered = $partner->registered ? Carbon::parse($partner->registered) : null;
        $expiresOn = $partner->expires_on ? Carbon::parse($partner->expires_on) : null;

        $isActive = $registered && $expiresOn
            && $now->greaterThanOrEqualTo($registered)
            && $now->lessThanOrEqualTo($expiresOn);

        // Jika tidak aktif dan bukan sedang di cabang-saya
        if (!$isActive && !$request->routeIs('cabang-saya.index', 'cabang-saya.switch', 'logout')) {
            return redirect()
                ->route('cabang-saya.index')
                ->with('warning', 'Langganan Anda tidak aktif. Hubungi administrator.');
        }

        return $next($request);
    }
}