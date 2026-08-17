<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\SyncApiController;

// 1. Route Login (Public)
Route::post('/login', [AuthApiController::class, 'login']);

// 2. Route Terproteksi (Harus bawa Token)
Route::middleware('auth:sanctum')->group(function () {

    // cek apakah partner kadaluwarsa atau tidak
    Route::middleware('auth:sanctum')->get('/check-subscription', function (Request $request) {
        $user = $request->user();
        $partner = $user->branch?->partner;

        if ($partner) {
            $now = now();
            $registered = $partner->registered ? \Carbon\Carbon::parse($partner->registered) : null;
            $expiresOn  = $partner->expires_on  ? \Carbon\Carbon::parse($partner->expires_on)  : null;

            $isActive = $registered && $expiresOn
                && $now->greaterThanOrEqualTo($registered)
                && $now->lessThanOrEqualTo($expiresOn);

            if (!$isActive) {
                return response()->json(['message' => 'Langganan tidak aktif'], 403);
            }
        }

        return response()->json(['ok' => true]);
    });
    
    // Upload Transaksi dari Flutter ke Laravel
    Route::get('/sync/orders/codes', [SyncApiController::class, 'getOrderCodes']);
    Route::get('/sync/orders', [SyncApiController::class, 'getOrders']);
    Route::post('/sync/orders', [SyncApiController::class, 'uploadOrders']);
    
    // Sinkronisasi Produk dari Laravel ke Flutter
    Route::get('/sync/products', [SyncApiController::class, 'getProducts']);

    // Sinkronisasi Customers dari Laravel ke Flutter
    Route::get('/sync/customers', [SyncApiController::class, 'getCustomers']);
    
    // Cek User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthApiController::class, 'logout']);
});