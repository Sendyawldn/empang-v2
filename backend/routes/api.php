<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\LombaController;
use App\Http\Controllers\RekapController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/check/{nama}', [BookingController::class, 'checkStatus']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// --- AREA PUBLIK (Bebas Akses Tanpa Login) ---
Route::get('/public/home', [PublicController::class, 'getHomeData']);
Route::post('/public/booking', [PublicController::class, 'storeBooking']);
Route::get('/public/jadwal-peserta', [PublicController::class, 'getJadwalPeserta']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/admin/dashboard', [BookingController::class, 'index']);
    Route::get('/admin/bookings', [BookingController::class, 'index']);
    Route::put('/admin/bookings/{id}/verify', [BookingController::class, 'verifyBooking']);
    Route::delete('/admin/bookings/{id}', [\App\Http\Controllers\BookingController::class, 'destroy']);
    Route::get('/admin/reports', [\App\Http\Controllers\ReportController::class, 'index']);

    Route::get('/admin/settings', [SettingController::class, 'index']);
    Route::put('/admin/settings', [SettingController::class, 'update']);
    Route::post('/admin/settings/gallery', [SettingController::class, 'uploadGallery']);
    Route::delete('/admin/settings/gallery', [SettingController::class, 'deleteGalleryItem']);

    // AREA JADWAL LOMBA
    Route::get('/admin/lombas', [LombaController::class, 'index']);
    Route::post('/admin/lombas', [LombaController::class, 'store']);
    Route::get('/admin/lombas/{id}', [LombaController::class, 'show']);
    Route::delete('/admin/lombas/{id}', [LombaController::class, 'destroy']);

    Route::get('/admin/rekaps/{lomba_id}', [RekapController::class, 'getByLomba']);
    Route::post('/admin/rekaps', [RekapController::class, 'store']);
    Route::put('/admin/rekaps/{id}', [RekapController::class, 'update']);
    Route::delete('/admin/rekaps/{id}', [RekapController::class, 'destroy']);
});
