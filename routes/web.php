<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MembersController;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/members', [MembersController::class, 'index'])->name('members');
    Route::post('/members', [MembersController::class, 'store']);
    Route::put('/members/{member}', [MembersController::class, 'update']);
    Route::delete('/members/{member}', [MembersController::class, 'destroy']);

    // Route::post('/api/members', [MembersController::class, 'store']);

    // Route::put('/api/members/{member}', [MembersController::class, 'update']);
    // Route::delete('/api/members/{member}', [MembersController::class, 'destroy']);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
