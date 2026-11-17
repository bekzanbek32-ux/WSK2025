<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdvertPaidService;
use Illuminate\Pagination\LengthAwarePaginator;

class AdvertController extends Controller
{
    // Получение списка объявлений

    // Получение списка объявлений

    public function index(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|string|exists:categories,id',
            'price_from' => 'nullable|numeric|min:0',
            'price_to' => 'nullable|numeric|min:0',
            'query' => 'nullable|string|max:255',
            'sort_by' => 'nullable|in:date,price',
            'sort' => 'nullable|in:asc,desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|in:10,20,30',
        ]);

        // Общие фильтры для TOP и обычных объявлений
        $applyFilters = function ($query) use ($validated) {

            if (!empty($validated['category_id'])) {
                $query->where('category_id', $validated['category_id']);
            }

            if (isset($validated['price_from'])) {
                $query->where('price', '>=', $validated['price_from']);
            }

            if (isset($validated['price_to'])) {
                $query->where('price', '<=', $validated['price_to']);
            }

            if (!empty($validated['query'])) {
                $search = $validated['query'];

                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('text', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($category) use ($search) {
                            $category->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('user', function ($user) use ($search) {
                            $user->where('name', 'like', "%{$search}%");
                        });
                });
            }

            return $query;
        };

        // 1. Получаем TOP, которые подходят под все фильтры
        $topServices = AdvertPaidService::with([
            'advert.user',
            'advert.category',
            'advert.paidServices',
        ])
            ->where('type', 'TOP')
            ->whereNull('deactivated_at')
            ->where('expires_at', '>', now())
            ->whereHas('advert', function ($query) use ($applyFilters) {
                $query->where('status', 'published');
                $applyFilters($query);
            })
            ->orderByDesc('activated_at')
            ->get();

        // Одно объявление не должно повторяться из-за нескольких TOP-записей
        $topAdverts = $topServices
            ->pluck('advert')
            ->unique('id')
            ->values();

        $topIds = $topAdverts->pluck('id')->all();

        // 2. Получаем VIP, игнорируя текстовый поиск
        // Категория учитывается, цена допускает отклонение менее 100
        $vipServices = AdvertPaidService::with([
            'advert.user',
            'advert.category',
            'advert.paidServices',
        ])
            ->where('type', 'VIP')
            ->whereNull('deactivated_at')
            ->where('expires_at', '>', now())
            ->whereHas('advert', function ($query) use ($applyFilters, $topIds) {

                $query->where('status', 'published');
                $applyFilters($query);

                if (!empty($topIds)) {
                    $query->whereNotIn('id', $topIds);
                }
            })
            ->inRandomOrder()
            ->get();

        // Берём максимум три разных VIP-объявления
        $vipAdverts = $vipServices
            ->pluck('advert')
            ->unique('id')
            ->take(3)
            ->values();

        $vipIds = $vipAdverts->pluck('id')->all();

        // 3. Получаем обычные объявления
        $sortBy = $validated['sort_by'] ?? 'date';
        $sort = $validated['sort'] ?? 'desc';

        $column = $sortBy === 'price' ? 'price' : 'created_at';

        $regularQuery = Advert::with([
            'user',
            'category',
            'paidServices',
        ])->where('status', 'published');

        $applyFilters($regularQuery);

        // Исключаем уже показанные TOP и VIP
        $excludedIds = array_merge($topIds, $vipIds);

        if (!empty($excludedIds)) {
            $regularQuery->whereNotIn('id', $excludedIds);
        }

        $regularAdverts = $regularQuery
            ->orderBy($column, $sort)
            ->get();

        // 4. Собираем всё в правильном порядке
        $allAdverts = $topAdverts
            ->concat($vipAdverts)
            ->concat($regularAdverts)
            ->values();

        // 5. Применяем пагинацию после сортировки
        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;

        $paginatedAdverts = new LengthAwarePaginator(
            $allAdverts->forPage($page, $perPage)->values(),
            $allAdverts->count(),
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return response()->json($paginatedAdverts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'text' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|string|exists:categories,id',
            'photos' => 'required|array|min:1',
            'photos.*' => 'required|string|max:2048',
        ]);

        $advert = $request->user()->adverts()->create([
            'title' => $validated['title'],
            'text' => $validated['text'],
            'price' => $validated['price'],
            'category_id' => $validated['category_id'],
            'photos' => $validated['photos'],
            'status' => 'draft',
        ]);

        return response()->json([
            'message' => 'Advert created successfully',
            'advert' => $advert,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $advert = Advert::findOrFail($id);
        $user = $request->user();

        // Модератор может редактировать любое объявление
        if ($user->role !== 'moderator') {

            // Проверяем владельца
            if ($advert->user_id != $user->id) {
                return response()->json([
                    'message' => 'You can only edit your own adverts'
                ], 403);
            }

            // Пользователь может редактировать только draft
            if ($advert->status !== 'draft') {
                return response()->json([
                    'message' => 'You can only edit draft adverts'
                ], 403);
            }
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'text' => 'sometimes|required|string|max:1000',
            'price' => 'sometimes|required|numeric|min:0',
            'category_id' => 'sometimes|required|string|exists:categories,id',
            'photos' => 'sometimes|required|array|min:1',
            'photos.*' => 'required|string|max:2048',
        ]);

        if (empty($validated)) {
            return response()->json([
                'message' => 'At least one field must be provided'
            ], 422);
        }

        $advert->update($validated);

        return response()->json([
            'message' => 'Advert updated successfully',
            'advert' => $advert->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $advert = Advert::findOrFail($id);

        if ($advert->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own adverts'
            ], 403);
        }

        if (!in_array($advert->status, ['draft', 'archived'])) {
            return response()->json([
                'message' => 'You can only delete draft or archived adverts'
            ], 403);
        }

        $advert->delete();

        return response()->noContent();
    }

    public function updateStatus(Request $request, $id)
{
    $validated = $request->validate([
        'status' => 'required|in:draft,moderation,declined,published,archived',
    ]);

    $advert = Advert::findOrFail($id);
    $user = $request->user();

    if ($user->role === 'moderator') {

        $allowedTransitions = [
            'moderation' => ['published', 'declined'],
            'published' => ['declined'],
        ];

    } else {

        if ($advert->user_id != $user->id) {
            return response()->json([
                'message' => 'You can only update your own adverts'
            ], 403);
        }

        $allowedTransitions = [
            'draft' => ['moderation', 'archived'],
            'published' => ['draft', 'archived'],
            'declined' => ['draft', 'archived'],
        ];
    }

    if (!in_array(
        $validated['status'],
        $allowedTransitions[$advert->status] ?? [],
        true
    )) {
        return response()->json([
            'message' => 'This status transition is not allowed'
        ], 403);
    }

    $advert->update([
        'status' => $validated['status'],
    ]);

    return response()->json([
        'message' => 'Advert status updated successfully',
        'advert' => $advert->fresh(),
    ]);
}

    // Получение одного объявления
    public function show(Request $request, $id)
    {
        $advert = Advert::findOrFail($id);

        // Проверяем, авторизован ли пользователь
        $user = Auth::guard('sanctum')->user();
        if ($user) {

            // Проверяем, смотрел ли пользователь это объявление
            $view = $advert->views()
                ->where('user_id', $user->id)
                ->first();

            if ($view) {
                $view->touch();
            } else {
                $advert->views()->create([
                    'user_id' => $user->id,
                ]);

                $advert->increment('views_count');
            }
        }

        return response()->json([
            'message' => 'Advert found successfully',
            'advert' => $advert->fresh(),
        ]);
    }
}
