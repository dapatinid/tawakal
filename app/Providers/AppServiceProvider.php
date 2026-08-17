<?php

namespace App\Providers;

use App\Models\AdjustmentStock;
use App\Models\Journal;
use Illuminate\Support\ServiceProvider;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('produk', function ($value) {
            abort_if(!auth()->check(), 404);

            return Product::where('id', $value)
                ->where('branch_id', auth()->user()->branch_id)
                ->firstOrFail();
        });

        Route::bind('order', function ($value) {
            abort_if(!auth()->check(), 404);

            return Order::where('id', $value)
                ->where('branch_id', auth()->user()->branch_id)
                ->firstOrFail();
        });
        Route::bind('purchaseOrder', function ($value) {
            abort_if(!auth()->check(), 404);

            return PurchaseOrder::where('id', $value)
                ->where('branch_id', auth()->user()->branch_id)
                ->firstOrFail();
        });
        Route::bind('adjustmentStock', function ($value) {
            abort_if(!auth()->check(), 404);

            return AdjustmentStock::where('id', $value)
                ->where('branch_id', auth()->user()->branch_id)
                ->firstOrFail();
        });
        Route::bind('journal', function ($value) {
            abort_if(!auth()->check(), 404);

            return Journal::where('id', $value)
                ->where('branch_id', auth()->user()->branch_id)
                ->firstOrFail();
        });

        Route::bind('item', function ($value) {
            abort_if(!auth()->check(), 404);

            return OrderItem::where('id', $value)
                ->where('branch_id', auth()->user()->branch_id)
                ->firstOrFail();
        });
        Route::bind('payment', function ($value) {
            abort_if(!auth()->check(), 404);

            return Payment::where('id', $value)
                ->where('branch_id', auth()->user()->branch_id)
                ->firstOrFail();
        });
    }
}
