<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advert;
use Illuminate\Http\Request;
use App\Models\AdvertPaidService;
use Illuminate\Support\Carbon;

class AdvertController extends Controller
{
    // Список объявлений
    public function index(Request $request)
    {
        $query = Advert::with([
            'user',
            'category',
            'images',
            'paidServices'
        ]);

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $adverts = $query->latest()->paginate(10);

        return view('admin.adverts.index', compact('adverts'));
    }

// Экспорт объявлений в CSV
public function exportCsv(Request $request)
{
    $query = Advert::with([
        'user',
        'category',
    ]);

    // Фильтр по названию
    if ($request->filled('search')) {
        $query->where(
            'title',
            'like',
            '%' . $request->search . '%'
        );
    }

    // Фильтр по статусу
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Получаем все объявления без пагинации
    $adverts = $query->latest()->get();

    return response()->streamDownload(function () use ($adverts) {

        $file = fopen('php://output', 'w');

        // UTF-8 BOM для Excel
        fwrite($file, "\xEF\xBB\xBF");

        // Заголовки CSV — ровно 8 столбцов
        fputcsv($file, [
            'id',
            'title',
            'category',
            'price',
            'author_phone',
            'author_email',
            'text',
            'created_at',
        ], ',', '"', '', "\r\n");

        foreach ($adverts as $advert) {

            fputcsv($file, [
                $advert->id,
                $advert->title,
                $advert->category->name ?? '',
                $advert->price,
                $advert->user->phone ?? '',
                $advert->user->email ?? '',
                $advert->text,
                $advert->created_at,
            ], ',', '"', '', "\r\n");
        }

        fclose($file);

    }, 'export_adverts.csv', [
        'Content-Type' => 'text/csv; charset=UTF-8',
    ]);
}


    // Подробный просмотр объявления
    public function show($id)
    {
        $advert = Advert::with([
            'user',
            'category',
            'images',
            'paidServices'
        ])->findOrFail($id);

        return view('admin.adverts.show', compact('advert'));
    }

    // Разрешённые переходы статусов
    public function changeStatus(Request $request, $id)
    {
        $advert = Advert::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:moderation,published,declined',
        ]);

        $allowedTransitions = [
            'draft' => ['moderation'],
            'moderation' => ['published', 'declined'],
            'published' => ['moderation'],
            'declined' => ['moderation'],
        ];

        $currentStatus = $advert->status;
        $newStatus = $validated['status'];

        if (!in_array(
            $newStatus,
            $allowedTransitions[$currentStatus] ?? [],
            true
        )) {
            return back()->with(
                'error',
                'Этот переход между статусами запрещён!'
            );
        }

        $advert->update([
            'status' => $newStatus
        ]);

        return back()->with('success', 'Статус объявления успешно изменён!');
    }

    // Удаление объявления
    public function destroy($id)
    {
        $advert = Advert::findOrFail($id);

        $advert->delete();

        return redirect('/admin/adverts')
            ->with('success', 'Объявление удалено!');
    }
    // Подключение платной услуги на 20 дней
    public function activatePaidService(Request $request, $id)
    {
        $advert = Advert::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string|max:100',
        ]);

        $type = trim($validated['type']);

        // Проверяем, нет ли уже действующей услуги такого типа
        $activeServiceExists = $advert->paidServices()
            ->where('type', $type)
            ->whereNull('deactivated_at')
            ->where('expires_at', '>', now())
            ->exists();

        if ($activeServiceExists) {
            return back()->with(
                'error',
                'Такая услуга уже подключена и действует!'
            );
        }

        $advert->paidServices()->create([
            'type' => $type,
            'activated_at' => now(),
            'expires_at' => now()->addDays(20),
            'deactivated_at' => null,
        ]);

        return back()->with(
            'success',
            'Платная услуга подключена на 20 дней!'
        );
    }

    // Отключение платной услуги
    public function deactivatePaidService($advertId, $serviceId)
    {
        $advert = Advert::findOrFail($advertId);

        $service = $advert->paidServices()
            ->where('id', $serviceId)
            ->firstOrFail();

        if (
            $service->deactivated_at !== null ||
            $service->expires_at === null ||
            $service->expires_at->isPast()
        ) {
            return back()->with(
                'error',
                'Эта услуга уже не действует!'
            );
        }

        $service->update([
            'deactivated_at' => now(),
        ]);

        return back()->with(
            'success',
            'Платная услуга успешно отключена!'
        );
    }
}
