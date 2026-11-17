<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdvertController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Главная страница
Route::get('/', function () {
    return view('welcome');
});

// Регистрация
Route::get('/register', function () {
    return view('auth.register');
});

Route::post('/register', [AuthController::class, 'register']);

// Авторизация
Route::get('/login', function () {
    return view('auth.login');
});

Route::post('/login', [AuthController::class, 'login']);

// Выход
Route::post('/logout', [AuthController::class, 'logout']);

// Админ-панель

// Админ-панель
Route::get('/admin', function () {

    if (!auth()->check()) {
        return redirect('/login');
    }

    if (auth()->user()->role !== 'moderator') {
        abort(403, 'Доступ запрещён');
    }

    $usersCount = \App\Models\User::count();

    $advertsCount = \App\Models\Advert::count();

    $publishedCount = \App\Models\Advert::where('status', 'published')->count();

    $moderationCount = \App\Models\Advert::where('status', 'moderation')->count();

    $declinedCount = \App\Models\Advert::where('status', 'declined')->count();

    $draftsCount = \App\Models\Advert::where('status', 'draft')->count();

    $topAdverts = \App\Models\Advert::with(['user', 'category'])
        ->where('status', 'published')
        ->orderByDesc('views_count')
        ->take(10)
        ->get();

    return view('admin.dashboard', compact(
        'usersCount',
        'advertsCount',
        'publishedCount',
        'moderationCount',
        'declinedCount',
        'draftsCount',
        'topAdverts'
    ));
});


Route::middleware(['auth', 'moderator'])
    ->prefix('admin')
    ->group(function () {

        // Категории
        Route::get('/categories', [CategoryController::class, 'index'])
            ->name('categories.index');

        Route::post('/categories', [CategoryController::class, 'store'])
            ->name('categories.store');

        Route::put('/categories/{category}', [CategoryController::class, 'update'])
            ->name('categories.update');

        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
            ->name('categories.destroy');

        // Объявления
        Route::get('/adverts', [AdvertController::class, 'index']);

        // Экспорт объявлений в CSV
        Route::get('/adverts/export/csv', [AdvertController::class, 'exportCsv'])
            ->name('admin.adverts.export');
            
        Route::get('/adverts/{id}', [AdvertController::class, 'show']);

        Route::put('/adverts/{id}/status', [AdvertController::class, 'changeStatus'])
            ->name('admin.adverts.status');

        Route::delete('/adverts/{id}', [AdvertController::class, 'destroy']);

        // Управление пользователями
        Route::get('/users', [UserController::class, 'index']);

        Route::get('/users/{id}', [UserController::class, 'show']);

        Route::post('/users/{id}/block', [UserController::class, 'block']);

        Route::post('/users/{id}/unblock', [UserController::class, 'unblock']);

        // Подключение платной услуги
        Route::post(
            '/adverts/{id}/paid-services',
            [AdvertController::class, 'activatePaidService']
        );

        // Отключение платной услуги
        Route::put(
            '/adverts/{advertId}/paid-services/{serviceId}/deactivate',
            [AdvertController::class, 'deactivatePaidService']
        );
    });
