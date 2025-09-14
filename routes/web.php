<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Admin\PropertyController as AdminPropertyController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Static Pages
Route::get('/about', [HomeController::class, 'about'])->name('about');

// Guest Routes (Login & Register)
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);

    // Register
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);

    // Password Reset
    Route::get('/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/password/reset', [ResetPasswordController::class, 'reset'])->name('password.update');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('properties', AdminPropertyController::class);
        Route::get('properties/{property}/availability', [AdminPropertyController::class, 'getAvailability'])
            ->name('properties.availability');

        Route::post('properties/{property}/manage-availability', [AdminPropertyController::class, 'manageAvailability'])
            ->name('properties.manage-availability');
    });

    Route::resource('bookings', BookingController::class);
    Route::prefix('bookings')->name('bookings.')->group(function () {
        Route::post('{booking}/confirm', [BookingController::class, 'confirm'])->name('confirm');
        Route::post('{booking}/reject', [BookingController::class, 'reject'])->name('reject');
        Route::post('{booking}/cancel', [BookingController::class, 'cancel'])->name('cancel');
    });

});

// Public Property Routes
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

// Root Redirect
Route::get('/', fn () => redirect()->route('properties.index'));
