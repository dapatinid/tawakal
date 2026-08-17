<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\NotificationRead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = Notification::query()
            ->forUser($user) // Menggunakan scope yang kita buat di atas
            ->with(['reads' => fn ($q) => $q->where('user_id', $user->id)])
            ->latest()
            ->paginate(20)
            ->through(fn ($notif) => [
                'id'         => $notif->id,
                'type'       => $notif->type,
                'data'       => $notif->data,
                'actor'      => optional($notif->actor)->name,
                'created_at' => $notif->created_at->diffForHumans(),
                'is_read'    => $notif->reads->isNotEmpty(),
            ]);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }   
    

    public function markAsRead(Notification $notification, Request $request)
    {
        $user = $request->user();

        // 1. Cek jika notifikasi ini ditujukan untuk user spesifik (Private ID)
        if (is_numeric($notification->audience)) {
            if ((int) $notification->audience !== $user->id) {
                abort(403, 'Ini adalah notifikasi privat user lain.');
            }
        } else {
            // 2. Jika bukan privat, cek akses Admin
            if ($notification->audience === 'admin' && !$user->is_admin) {
                abort(403, 'Hanya admin yang dapat mengakses notifikasi ini.');
            }

            // 3. Cek akses Branch
            if (!is_null($notification->branch_id) && $notification->branch_id !== $user->branch_id) {
                abort(403, 'Notifikasi ini milik branch lain.');
            }
        }

        // Jika lolos semua pengecekan di atas, tandai sebagai terbaca
        $notification->reads()->firstOrCreate(
            ['user_id' => $user->id],
            ['read_at' => now()]
        );

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        // Menggunakan scope forUser yang sudah kita buat sebelumnya
        // Ini otomatis mencakup: Private ID, Admin Check, dan Branch Check
        $notificationIds = Notification::forUser($user)
            ->whereDoesntHave('reads', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->pluck('id');

        if ($notificationIds->isEmpty()) {
            return back();
        }

        $rows = $notificationIds->map(fn ($id) => [
            'notification_id' => $id,
            'user_id'         => $user->id,
            'read_at'         => now(),
        ])->toArray();

        // Menggunakan insertOrIgnore agar tidak error jika user klik dua kali dengan cepat
        DB::table('notification_reads')->insertOrIgnore($rows);

        return back();
    }
    


}