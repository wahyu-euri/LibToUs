<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return [
        'message' => 'LibToUs API Server',
        'version' => '1.0.0',
        'status' => 'running'
    ];
});
