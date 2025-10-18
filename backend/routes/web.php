<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return [
        'message' => 'LibToUs API Server',
        'version' => '1.0.0',
        'status' => 'running'
    ];
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});
