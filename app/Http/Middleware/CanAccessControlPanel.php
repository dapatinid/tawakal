<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanAccessControlPanel
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (
            !$user ||
            !$user->is_admin ||
            is_null($user->level) ||
            $user->level === ''
        ) {
            return redirect()->back()->with('error', 'Tidak memiliki akses ke halaman dituju.');
        }

        return $next($request);
    }
}
