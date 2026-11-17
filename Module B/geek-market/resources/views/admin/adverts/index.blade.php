<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Объявления — Geek Baraholka</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #0f1117;
            color: #fff;
        }

        .container {
            max-width: 1400px;
            margin: auto;
            padding: 35px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        h1 {
            font-size: 28px;
        }

        .subtitle {
            color: #858da0;
            margin-top: 10px;
        }

        .back {
            color: #ff922b;
            text-decoration: none;
            background: #202431;
            padding: 12px 18px;
            border-radius: 8px;
        }

        .filters {
            display: flex;
            gap: 12px;
            margin-bottom: 25px;
        }

        input,
        select {
            background: #191d28;
            color: white;
            border: 1px solid #303647;
            padding: 13px;
            border-radius: 8px;
        }

        input {
            flex: 1;
        }

        button {
            cursor: pointer;
            border: none;
            padding: 12px 17px;
            border-radius: 7px;
            color: white;
        }

        .search-btn {
            background: #ff922b;
            color: #111;
        }

        .export-btn {
            display: inline-block;
            background: #167747;
            color: white;
            text-decoration: none;
            padding: 13px 17px;
            border-radius: 8px;
            white-space: nowrap;
        }

        .table-wrapper {
            overflow-x: auto;
            background: #191d28;
            border: 1px solid #292e3b;
            border-radius: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 850px;
        }

        th,
        td {
            padding: 18px;
            text-align: left;
            border-bottom: 1px solid #292e3b;
        }

        th {
            color: #858da0;
            font-size: 13px;
        }

        td {
            font-size: 14px;
        }

        .status {
            padding: 7px 11px;
            border-radius: 20px;
            font-size: 12px;
        }

        .published {
            background: #164b35;
            color: #5beba1;
        }

        .draft {
            background: #4b3b18;
            color: #ffd36b;
        }

        .rejected {
            background: #542525;
            color: #ff8888;
        }

        .actions {
            display: flex;
            gap: 7px;
            flex-wrap: wrap;
        }

        .approve {
            background: #167747;
        }

        .reject {
            background: #9a3535;
        }

        .delete {
            background: #702c2c;
        }

        .message {
            background: #164b35;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #5beba1;
        }

        .empty {
            text-align: center;
            padding: 35px;
            color: #858da0;
        }

        .pagination {
            margin-top: 25px;
        }

        @media(max-width: 650px) {
            .container {
                padding: 18px;
            }

            .header {
                flex-direction: column;
                align-items: flex-start;
                gap: 20px;
            }

            .filters {
                flex-direction: column;
            }
        }
    </style>
</head>

<body>

    <div class="container">

        <header class="header">
            <div>
                <h1>📦 Управление объявлениями</h1>
                <p class="subtitle">Модерация объявлений Geek Baraholka</p>
            </div>

            <a href="/admin" class="back">← Назад</a>
        </header>

        @if (session('success'))
            <div class="message">
                {{ session('success') }}
            </div>
        @endif

        <form action="/admin/adverts" method="GET" class="filters">

            <input type="text" name="search" placeholder="Поиск по названию..." value="{{ request('search') }}">

            <select name="status">
                <option value="">Все статусы</option>
                <option value="draft" {{ request('status') == 'draft' ? 'selected' : '' }}>
                    На проверке
                </option>
                <option value="published" {{ request('status') == 'published' ? 'selected' : '' }}>
                    Опубликованные
                </option>
                <option value="rejected" {{ request('status') == 'rejected' ? 'selected' : '' }}>
                    Отклонённые
                </option>
            </select>

            <button class="search-btn" type="submit">Найти</button>

        </form>

        <div class="table-wrapper">

            <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Объявление</th>
                        <th>Автор</th>
                        <th>Цена</th>
                        <th>Просмотры</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($adverts as $advert)
                        <tr>
                            <td>#{{ $advert->id }}</td>

                            <td>
                                <a href="/admin/adverts/{{ $advert->id }}"
                                    style="color: #ff922b; text-decoration: none;">
                                    {{ $advert->title }}
                                </a>
                            </td>

                            <td>
                                {{ $advert->user->name ?? 'Неизвестно' }}
                            </td>

                            <td>
                                {{ number_format($advert->price, 0, ',', ' ') }}
                            </td>

                            <td>
                                {{ $advert->views_count }}
                            </td>

                            <td>
                                <span class="status {{ $advert->status }}">
                                    @if ($advert->status == 'published')
                                        Опубликовано
                                    @elseif($advert->status == 'draft')
                                        На проверке
                                    @elseif($advert->status == 'declined')
                                        Отклонено
                                    @else
                                        {{ $advert->status }}
                                    @endif
                                </span>
                            </td>

                            <td>
                                <div class="actions">

                                    @if ($advert->status != 'published')
                                        <form action="/admin/adverts/{{ $advert->id }}/approve" method="POST">
                                            @csrf
                                            <button class="approve" type="submit">
                                                ✓
                                            </button>
                                        </form>
                                    @endif

                                    @if ($advert->status != 'rejected')
                                        <form action="/admin/adverts/{{ $advert->id }}/reject" method="POST">
                                            @csrf
                                            <button class="reject" type="submit">
                                                ✕
                                            </button>
                                            
                                        </form>
                                    @endif

                                    <form action="/admin/adverts/{{ $advert->id }}" method="POST"
                                        onsubmit="return confirm('Точно удалить объявление?')">
                                        @csrf
                                        @method('DELETE')

                                        <button class="delete" type="submit">
                                            🗑
                                        </button>
                                        <div style="margin-bottom: 25px;">
                                                <a href="{{ route('admin.adverts.export', request()->only('search', 'status')) }}"
                                                    class="export-btn">
                                                    ↓ Экспорт CSV
                                                </a>
                                            </div>
                                    </form>

                                </div>
                            </td>
                        </tr>

                    @empty

                        <tr>
                            <td colspan="7" class="empty">
                                Объявлений пока нет.
                            </td>
                        </tr>
                    @endforelse

                </tbody>

            </table>

        </div>

        <div class="pagination">
            {{ $adverts->links() }}
        </div>

    </div>

</body>

</html>
