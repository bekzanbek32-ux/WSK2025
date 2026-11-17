<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Список пользователей и точный поиск
    public function index(Request $request)
    {
        $query = User::withCount([
            'adverts as published_adverts_count' => function ($q) {
                $q->where('status', 'published');
            }
        ]);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {

                if (is_numeric($search)) {
                    $q->where('id', $search)
                        ->orWhere('phone', $search)
                        ->orWhere('email', $search);
                } else {
                    $q->where('phone', $search)
                        ->orWhere('email', $search);
                }
            });
        }

        $users = $query->latest()->paginate(15);

        return view('admin.users.index', compact('users'));
    }

    // Подробная информация о пользователе
    public function show($id)
    {
        $user = User::with('adverts')->findOrFail($id);

        return view('admin.users.show', compact('user'));
    }

    // Блокировка
    public function block($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'moderator') {
            return back()->withErrors([
                'error' => 'Нельзя заблокировать модератора.',
            ]);
        }

        $user->update(['is_blocked' => true]);

        return back()->with('success', 'Пользователь заблокирован.');
    }

    // Разблокировка
    public function unblock($id)
    {
        $user = User::findOrFail($id);

        $user->update(['is_blocked' => false]);

        return back()->with('success', 'Пользователь разблокирован.');
    }
}
