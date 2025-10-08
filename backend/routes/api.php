<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Books (public)
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/categories', [BookController::class, 'getCategories']);
    Route::get('/books/featured', [BookController::class, 'getFeaturedBooks']);
    Route::get('/books/popular', [BookController::class, 'getPopularBooks']);
    Route::get('/books/{id}', [BookController::class, 'show']);

    // User routes
    Route::middleware('user')->group(function () {
        Route::post('/borrows', [BorrowController::class, 'store']);
        Route::get('/user/borrows', [BorrowController::class, 'userBorrows']);
        Route::post('/borrows/{id}/return', [BorrowController::class, 'returnBook']);

        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::get('/user/reviews', [ReviewController::class, 'userReviews']);

        Route::post('/saved-books', [BorrowController::class, 'saveBook']);
        Route::get('/user/saved-books', [BorrowController::class, 'getSavedBooks']);
        Route::delete('/saved-books/{id}', [BorrowController::class, 'removeSavedBook']);

        // Profile management
        Route::put('/user/profile', [UserController::class, 'updateProfile']);
        Route::put('/user/password', [UserController::class, 'changePassword']);
    });

    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{id}', [BookController::class, 'update']);
        Route::delete('/books/{id}', [BookController::class, 'destroy']);

        Route::get('/admin/borrows', [BorrowController::class, 'index']);
        Route::put('/admin/borrows/{id}', [BorrowController::class, 'update']);

        Route::get('/admin/users', [UserController::class, 'index']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    });
});
