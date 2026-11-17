
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Пользователи — Geek Baraholka</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: #0f1117;
            color: white;
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 1250px;
            margin: auto;
            padding: 35px;
        }

        h1 {
            color: #ff922b;
            margin-bottom: 25px;
        }

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }

        .back, .details {
            color: #ff922b;
            text-decoration: none;
        }

        .search {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
        }

        input {
            background: #202431;
            border: 1px solid #343b4d;
            color: white;
            padding: 13px;
            border-radius: 8px;
            flex: 1;
        }

        button {
            background: #ff922b;
            border: none;
            padding: 13px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }

        .table-wrap {
            overflow-x: auto;
            background: #191d28;
            border-radius: 12px;
            padding: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 750px;
        }

        th, td {
            padding: 16px 12px;
            text-align: left;
            border-bottom: 1px solid #303647;
        }

        th {
            color: #929bad;
        }

        .active {
            color: #5beba1;
        }

        .blocked {
            color: #ff6b6b;
        }

        .moderator {
            color: #ff922b;
        }

        .message {
            padding: 15px;
            background: #164b35;
            color: #5beba1;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .pagination {
            margin-top: 25px;
        }

        @media(max-width: 650px) {
            .container {
                padding: 18px;
            }
        }
    </style>
</head>

<body>
<div class="container">

    <div class="top">
        <h1>👥 Управление пользователями</h1>
        <a class="back" href="/admin">← Админ-панель</a>
    </div>

    @if(session('success'))
        <div class="message">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="message">{{ $errors->first() }}</div>
    @endif

    <form class="search" method="GET" action="/admin/users">
        <input
            type="text"
            name="search"
           placeholder="Введите ID, телефон или email..."
            value="{{ request('search') }}"
        >
        <button type="submit">Найти</button>
    </form>

    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Роль</th>
                    <th>Объявления</th>
                    <th>Статус</th>
                    <th>Действие</th>
                </tr>
            </thead>

            <tbody>
                @forelse($users as $user)
                    <tr>
                        <td>#{{ $user->id }}</td>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>{{ $user->phone ?? '—' }}</td>

                        <td>
                            @if($user->role === 'moderator')
                                <span class="moderator">Модератор</span>
                            @else
                                Пользователь
                            @endif
                        </td>

                        <td>{{ $user->published_adverts_count }}</td>

                        <td>
                            @if($user->is_blocked)
                                <span class="blocked">Заблокирован</span>
                            @else
                                <span class="active">Активен</span>
                            @endif
                        </td>

                        <td>
                            <a class="details"
                               href="/admin/users/{{ $user->id }}">
                                Подробнее
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8">Пользователи не найдены.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="pagination">
        {{ $users->appends(request()->query())->links() }}
    </div>

</div>
</body>
</html>
