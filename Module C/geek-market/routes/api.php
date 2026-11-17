<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AdvertController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdvertPaidServiceController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::get('/user/adverts', function (Request $request) {

        $validated = $request->validate([
            'status' => 'nullable|in:draft,moderation,declined,published,archived',
        ]);

        $query = $request->user()
            ->adverts()
            ->with(['category', 'paidServices']);

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        return response()->json(
            $query->orderByDesc('created_at')->get()
        );
    });


    // Платные услуги VIP и TOP — Module D
    Route::post(
        '/adverts/{advertId}/paid-services',
        [AdvertPaidServiceController::class, 'store']
    );

    Route::get(
        '/adverts/{advertId}/paid-services',
        [AdvertPaidServiceController::class, 'index']
    );

    // Дополнительный маршрут продления
    Route::post(
        '/adverts/{advertId}/paid-services/{serviceId}/extend',
        [AdvertPaidServiceController::class, 'extend']
    );

    Route::post('/adverts', [AdvertController::class, 'store']);

    Route::patch('/adverts/{id}', [AdvertController::class, 'update']);

    Route::delete('/adverts/{id}', [AdvertController::class, 'destroy']);

    Route::post(
        '/adverts/{id}/update-status',
        [AdvertController::class, 'updateStatus']
    );
    Route::patch('/user', [AuthController::class, 'updateProfile']);
});
// Объявления
Route::get('/adverts', [AdvertController::class, 'index']);
Route::get('/adverts/{id}', [AdvertController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
