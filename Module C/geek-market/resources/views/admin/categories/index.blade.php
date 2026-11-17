
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Категории — Geek Baraholka</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 30px;
            background: #111318;
            color: #f5f5f5;
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 1100px;
            margin: auto;
        }

        h1 {
            color: #ff8a00;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #999;
            margin-bottom: 30px;
        }

        .panel {
            background: #1b1e25;
            border: 1px solid #30343d;
            border-radius: 12px;
            padding: 22px;
            margin-bottom: 25px;
        }

        input {
            background: #111318;
            color: white;
            border: 1px solid #444;
            border-radius: 7px;
            padding: 11px;
            width: 100%;
        }

        button, .back {
            background: #ff8a00;
            color: #111;
            border: none;
            border-radius: 7px;
            padding: 11px 16px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
        }

        button:hover, .back:hover {
            background: #ffaa33;
        }

        .add-form {
            display: flex;
            gap: 12px;
        }

        .add-form input {
            flex: 1;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 15px 10px;
            border-bottom: 1px solid #30343d;
            text-align: left;
        }

        th {
            color: #ff9b26;
        }

        .edit-form {
            display: flex;
            gap: 8px;
        }

        .delete-button {
            background: #d94343;
            color: white;
        }

        .delete-button:hover {
            background: #f05252;
        }

        .message {
            padding: 13px;
            border-radius: 7px;
            margin-bottom: 18px;
        }

        .success {
            background: #173d2a;
            color: #7ee2a8;
        }

        .error {
            background: #451f24;
            color: #ff9a9a;
        }

        .pagination {
            margin-top: 20px;
        }

        @media (max-width: 700px) {
            body {
                padding: 15px;
            }

            .add-form, .edit-form {
                flex-direction: column;
            }

            .panel {
                overflow-x: auto;
            }

            table {
                min-width: 650px;
            }
        }
    </style>
</head>

<body>
<div class="container">

    <a href="/admin" class="back">← Назад в панель</a>

    <h1>Категории</h1>
    <p class="subtitle">Управление категориями объявлений</p>

    @if(session('success'))
        <div class="message success">
            {{ session('success') }}
        </div>
    @endif

    @if(session('error'))
        <div class="message error">
            {{ session('error') }}
        </div>
    @endif

    @if($errors->any())
        <div class="message error">
            @foreach($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif

    <div class="panel">
        <h2>Добавить категорию</h2>

        <form action="{{ route('categories.store') }}"
              method="POST"
              class="add-form">
            @csrf

            <input
                type="text"
                name="name"
                placeholder="Название новой категории"
                maxlength="255"
                required
            >

            <button type="submit">Добавить</button>
        </form>
    </div>

    <div class="panel">
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
                            <form
                                action="{{ route('categories.update', $category->id) }}"
                                method="POST"
                                class="edit-form"
                            >
                                @csrf
                                @method('PUT')

                                <input
                                    type="text"
                                    name="name"
                                    value="{{ $category->name }}"
                                    maxlength="255"
                                    required
                                >

                                <button type="submit">Сохранить</button>
                            </form>
                        </td>

                        <td>
                            {{ $category->published_adverts_count }}
                        </td>

                        <td>
                            <form
                                action="{{ route('categories.destroy', $category->id) }}"
                                method="POST"
                                onsubmit="return confirm('Точно удалить эту категорию?')"
                            >
                                @csrf
                                @method('DELETE')

                                <button type="submit" class="delete-button">
                                    Удалить
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4">
                            Категорий пока нет.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="pagination">
            {{ $categories->links() }}
        </div>
    </div>

</div>
</body>
</html>
