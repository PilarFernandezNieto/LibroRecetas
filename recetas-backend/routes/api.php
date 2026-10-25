<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecetaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\DificultadController;
use App\Http\Controllers\IngredienteController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;

// Autenticación (tokens Bearer). Estas rutas quedan bajo /api y no usan sesión ni CSRF.
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->name('password.store');

// Sin auth: el enlace del correo se abre en el navegador sin Bearer.
// El usuario se identifica por {id}/{hash} y la URL va firmada.
Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('logout');

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('admin')->middleware(['auth:sanctum', 'verified', 'is_admin'])->group(function () {

    Route::apiResource('/ingredientes', IngredienteController::class);
    Route::apiResource('/categorias', CategoriaController::class);

    Route::get('/ingredientes-todos', [IngredienteController::class, 'ingredientesTodos']);

    Route::apiResource('/recetas', RecetaController::class);

    Route::apiResource('/dificultades', DificultadController::class);
    Route::apiResource('/usuarios', UsuarioController::class);
});

Route::get('/recetas', [RecetaController::class, 'index']);
Route::get('/recetas/{receta}', [RecetaController::class, 'show']);
