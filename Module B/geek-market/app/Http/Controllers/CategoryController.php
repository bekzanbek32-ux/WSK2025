<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use App\Models\Category;

class CategoryController extends Controller
{
    // Проверка доступа модератора
    private function checkModerator(): void
    {
        abort_unless(
            auth()->check() && auth()->user()->role === 'moderator',
            403,
            'Доступ запрещён'
        );
    }

    // Список категорий
    public function index()
    {
        $this->checkModerator();

        $categories = Category::withCount([
            'adverts as published_adverts_count' => function ($query) {
                $query->where('status', 'published');
            }
        ])->orderBy('name')->paginate(15);

        return view('admin.categories.index', compact('categories'));
    }

    // Добавление категории
    public function store(Request $request)
    {
        $this->checkModerator();

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create([
            'id' => (string) Str::uuid(),
            'name' => $validated['name'],
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Категория успешно добавлена!');
    }

    // Обновление категории
    public function update(Request $request, Category $category)
    {
        $this->checkModerator();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id, 'id'),
            ],
        ]);

        $category->update([
            'name' => $validated['name'],
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Категория успешно обновлена!');
    }

    // Удаление категории
    public function destroy(Category $category)
    {
        $this->checkModerator();

        if ($category->adverts()->exists()) {
            return back()->with(
                'error',
                'Нельзя удалить категорию, к которой привязаны объявления!'
            );
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Категория успешно удалена!');
    }
}
