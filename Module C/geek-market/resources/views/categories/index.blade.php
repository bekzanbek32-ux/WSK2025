
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Категории — Geek Baraholka</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 30px;
            background: #0f1117;
            color: white;
            font-family: Arial, sans-serif;
        }
        .container { max-width: 1100px; margin: auto; }
        h1 { color: #ff922b; }
        .section {
            background: #191d28;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        input {
            padding: 12px;
            background: #222735;
            color: white;
            border: 1px solid #343b4d;
            border-radius: 7px;
        }
        button {
            padding: 12px 18px;
            background: #ff922b;
            border: none;
            border-radius: 7px;
            cursor: pointer;
        }
        table { width: 100%; border-collapse: collapse; }
        th, td {
            padding: 15px;
            border-bottom: 1px solid #343b4d;
            text-align: left;
        }
        th { color: #ff922b; }
        a { color: #ff922b; text-decoration: none; }
        .message { padding: 12px; margin-bottom: 15px; }
        .error { color: #ff6b6b; }
        .success { color: #5beba1; }
        .back { display: inline-block; margin-bottom: 20px; }
    </style>
</head>
<body>

<div class="container">

    <a class="back" href="/admin">← Вернуться в админ-панель</a>

    <h1>📂 Управление категориями</h1>

    @if(session('success'))
        <div class="message success">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="message error">{{ $errors->first() }}</div>
    @endif

    <div class="section">
        <h2>Добавить категорию</h2>

        <form action="/admin/categories" method="POST">
            @csrf
            <input type="text" name="name"
                   placeholder="Название категории" required>
            <button type="submit">Добавить</button>
        </form>
    </div>

    <div class="section">
        <h2>Список категорий</h2>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Опубликованные объявления</th>
                    <th>Действия</th>
                </tr>
            </thead>

            <tbody>
                @forelse($categories as $category)
                    <tr>
                        <td>{{ $category->id }}</td>

                        <td>
                            <form action="/admin/categories/{{ $category->id }}"
                                  method="POST">
                                @csrf
                                @method('PUT')

                                <input type="text" name="name"
                                       value="{{ $category->name }}" required>

                                <button type="submit">Сохранить</button>
                            </form>
                        </td>

                        <td>{{ $category->published_adverts_count }}</td>

                        <td>
                            <form action="/admin/categories/{{ $category->id }}"
                                  method="POST"
                                  onsubmit="return confirm('Удалить категорию?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit">Удалить</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4">Категорий пока нет.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        {{ $categories->links() }}
    </div>

</div>
</body>
</html>
