<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseService
{
    protected string $url;
    protected ?string $serviceKey; // ✅ nullable

    public function __construct()
    {
        $this->url        = rtrim(config('services.supabase.url'), '/');
        $this->serviceKey = config('services.supabase.service_key'); // bisa null
    }

    /**
     * Insert satu row ke tabel notifications di Supabase.
     * Dipanggil SETELAH Notification::create() di Laravel berhasil.
     */
    public function pushNotification(array $payload): bool
    {
        // ✅ Jika belum dikonfigurasi, skip tanpa crash
        if (! $this->serviceKey || ! $this->url) {
            Log::warning('Supabase tidak dikonfigurasi, push dilewati.');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'apikey'        => $this->serviceKey,
                'Authorization' => 'Bearer ' . $this->serviceKey,
                'Content-Type'  => 'application/json',
                'Prefer'        => 'return=minimal',
            ])->post("{$this->url}/rest/v1/notifications", [
                'app_id'          => config('services.supabase.app_id'),           // ✅ wajib ada
                'branch_id'       => $payload['branch_id'] ?? null,
                'actor_id'        => $payload['actor_id'] ?? null,
                'audience'        => $payload['audience'] ?? null,
                'type'            => $payload['type'],
                'notifiable_type' => $payload['notifiable_type'] ?? null,
                'notifiable_id'   => $payload['notifiable_id'] ?? null,
                'data'            => is_array($payload['data'])                    // ✅ pastikan json
                                        ? $payload['data']
                                        : json_decode($payload['data'], true),
            ]);

            // ✅ Log response untuk debug
            Log::info('Supabase push response', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if ($response->failed()) {
                Log::warning('Supabase push failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return false;
            }

            return true;

        } catch (\Throwable $e) {
            Log::error('SupabaseService error: ' . $e->getMessage());
            return false;
        }
    }
}