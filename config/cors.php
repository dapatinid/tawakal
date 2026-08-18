<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'], // Tambahkan path login Anda

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:59235',
        'https://kasir.dapatin.id',
        'https://gudang.dapatin.id', // Persiapan untuk nanti
        'https://driver.dapatin.id',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // WAJIB true agar session/cookie login terkirim

];
