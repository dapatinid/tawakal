<?php

namespace App\Http\Middleware;

use App\Models\AdjustmentStock;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use App\Models\PurchaseOrder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user(); // ⬅️ AMAN: bisa null

        return [
            ...parent::share($request),

            'name' => config('app.name'),
            'quote' => [
                'message' => trim($message),
                'author'  => trim($author),
            ],

            // ✅ AUTH USER — AMAN UNTUK GUEST & LOGOUT
            'auth' => [
                'user' => $user ? [
                    'id'        => $user->id,
                    'name'      => $user->name,
                    'email'     => $user->email,
                    'phone'     => $user->phone,
                    'avatar'    => $user->avatar,
                    'cover'    => $user->cover,
                    'is_admin'  => $user->is_admin,
                    'level'     => $user->level,
                    'branch_id' => $user->branch_id,
                    'branch'    => $user->branch
                        ? [
                            'id'   => $user->branch->id,
                            'name' => $user->branch->name,
                            'type' => $user->branch->type,
                        ]
                        : null,
                ] : null,
            ],

            'sidebarCounts' => fn () => $user ? [
                'categoryCount' => Category::count(),
                'brandCount'    => Brand::count(),
                'productCount'  => Product::whereBranchId($user->branch_id)
                    ->whereIsActive(true)
                    ->count(),
                'orderCount'    => Order::whereBranchId($user->branch_id)
                    ->where('change_amount', '<', 0)
                    ->count(),
                'purchaseOrderCount'    => PurchaseOrder::whereBranchId($user->branch_id)
                ->where('change_amount', '<', 0)
                ->count(),
                'adjustmentCount'    => AdjustmentStock::whereBranchId($user->branch_id)
                    ->where('status', '!=', 'done')
                    ->count(),
                'transactionCount'    => Order::whereUserId($user->id)
                    ->where('change_amount', '<', 0)
                    ->count(),
            ] : null,

            'notifications' => fn () => $user ? [
                // 🔔 5 notifikasi terakhir
                'latest' => Notification::query()
                    ->forUser($user) // Konsisten dengan scope
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(fn ($notif) => [
                        'id'         => $notif->id,
                        'type'       => $notif->type,
                        'data'       => $notif->data,
                        'actor'      => optional($notif->actor)->name,
                        'created_at' => $notif->created_at->diffForHumans(),
                        'is_read'    => DB::table('notification_reads')
                            ->where('notification_id', $notif->id)
                            ->where('user_id', $user->id)
                            ->exists(),
                    ]),

                // 🔴 unread count
                'unread_count' => Notification::query()
                    ->forUser($user) // Konsisten dengan scope
                    ->whereDoesntHave('reads', fn ($q) =>
                        $q->where('user_id', $user->id)
                    )
                    ->count(),
            ] : null,            

            'sidebarOpen' =>
                ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
            ],

            'appTimezone' => config('app.timezone'),
        ];
    }
}
