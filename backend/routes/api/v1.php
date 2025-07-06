<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\MediaController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('media')->group(function () {
        Route::get('/', [MediaController::class, 'index']);
        Route::post('/', [MediaController::class, 'store']);
        Route::delete('/{media}', [MediaController::class, 'destroy']);

        // Categories for media (metadata/enums)
        Route::get('/categories', [CategoryController::class, 'index']);
    });
});
