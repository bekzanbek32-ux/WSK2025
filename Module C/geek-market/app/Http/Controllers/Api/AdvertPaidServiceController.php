<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advert;

class AdvertPaidServiceController extends Controller
{

public function store(Request $request, $advertId)
{
    // Проверяем данные по OpenAPI Module D
    $validated = $request->validate([
        'name' => 'required|in:vip,top',
    ]);

    // Находим объявление
    $advert = Advert::findOrFail($advertId);

    // Проверяем владельца объявления
    if ($advert->user_id != $request->user()->id) {
        return response()->json([
            'message' => 'You can only promote your own adverts',
        ], 403);
    }

    // Преобразуем название услуги для базы данных
    $type = strtoupper($validated['name']);

    // Определяем срок действия
    $days = $type === 'VIP' ? 7 : 3;

    // Проверяем активную услугу
    $activeService = $advert->paidServices()
        ->where('type', $type)
        ->whereNull('deactivated_at')
        ->where('expires_at', '>', now())
        ->first();

    if ($activeService) {
        return response()->json([
            'message' => 'This service is already active. Use the extend endpoint.',
        ], 422);
    }

    // Создаём услугу
    $service = $advert->paidServices()->create([
        'type' => $type,
        'activated_at' => now(),
        'expires_at' => now()->addDays($days),
    ]);

    return response()->json([
        'message' => 'Service activated successfully',
        'service' => [
            'id' => $service->id,
            'advert_id' => $service->advert_id,
            'name' => strtolower($service->type),
            'started_at' => $service->activated_at,
            'expired_at' => $service->expires_at,
        ],
    ], 201);
}



public function extend(Request $request, $advertId, $serviceId)
{
    // 1. Находим объявление
    $advert = Advert::findOrFail($advertId);

    // 2. Проверяем владельца
    if ($advert->user_id != $request->user()->id) {
        return response()->json([
            'message' => 'You can only extend services for your own adverts'
        ], 403);
    }

    // 3. Находим услугу
    $service = $advert->paidServices()
        ->where('id', $serviceId)
        ->whereNull('deactivated_at')
        ->firstOrFail();

    // 4. Определяем тип услуги
    $type = strtoupper($service->type);

    // 5. Выбираем срок продления
    $days = $type === 'VIP' ? 7 : 3;

    // 6. Определяем дату, от которой продлеваем
    $baseDate = $service->expires_at && $service->expires_at->isFuture()
        ? $service->expires_at
        : now();

    // 7. Обновляем дату окончания
    $service->update([
        'expires_at' => $baseDate->copy()->addDays($days),
    ]);

    // 8. Возвращаем результат
    return response()->json([
        'message' => 'Service extended successfully',
        'service' => [
            'name' => strtolower($type),
            'started_at' => $service->activated_at,
            'expired_at' => $service->expires_at,
        ]
    ]);
}



public function index(Request $request, $advertId)
{
    // Находим объявление
    $advert = Advert::findOrFail($advertId);

    // Проверяем владельца объявления
    if ($advert->user_id != $request->user()->id) {
        return response()->json([
            'message' => 'You can only view services for your own adverts',
        ], 403);
    }

    // Получаем только реально активированные услуги
    $services = $advert->paidServices()
        ->whereNotNull('activated_at')
        ->orderByDesc('activated_at')
        ->get();

    // Преобразуем данные в формат OpenAPI Module D
    $result = $services->map(function ($service) {
        return [
            'name' => strtolower($service->type),
            'started_at' => $service->activated_at,
            'expired_at' => $service->expires_at,
        ];
    });

    return response()->json($result->values());
}

}
