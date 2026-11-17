```php
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Geek Baraholka — Admin Panel</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #0f1117;
            color: white;
        }

        .sidebar {
            width: 250px;
            min-height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            background: #171a23;
            padding: 25px 18px;
            border-right: 1px solid #292d39;
        }

        .logo {
            font-size: 22px;
            font-weight: bold;
            color: #ff8a00;
            margin-bottom: 45px;
        }

        .menu-title {
            color: #737b8e;
            font-size: 12px;
            margin: 25px 0 12px;
            text-transform: uppercase;
        }

        .menu a {
            display: block;
            padding: 13px;
            margin-bottom: 7px;
            color: #aeb5c5;
            text-decoration: none;
            border-radius: 8px;
        }

        .menu a:hover,
        .menu a.active {
            background: #292d39;
            color: #ff8a00;
        }

        .main {
            margin-left: 250px;
            padding: 35px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 35px;
            gap: 15px;
        }

        .header h1 {
            font-size: 27px;
        }

        .header p {
            color: #858da0;
            margin-top: 8px;
        }

        .admin {
            background: #202431;
            padding: 12px 18px;
            border-radius: 10px;
            color: #ff9b26;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .card, .section {
            background: #191d28;
            border: 1px solid #292e3b;
            padding: 23px;
            border-radius: 13px;
        }

        .card p {
            color: #858da0;
            font-size: 14px;
            margin-bottom: 15px;
        }

        .card h2 {
            font-size: 30px;
            color: #ff922b;
        }

        .section {
            margin-bottom: 25px;
        }

        .section h2 {
            margin-bottom: 20px;
            font-size: 20px;
        }

        .table-wrap {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 650px;
        }

        th, td {
            padding: 15px 12px;
            text-align: left;
            border-bottom: 1px solid #303647;
        }

        th {
            color: #929bad;
        }

        td {
            color: #e1e5ed;
        }

        .views {
            color: #ff922b;
            font-weight: bold;
        }

        .advert-link {
            color: #ff922b;
            text-decoration: none;
        }

        .advert-link:hover {
            text-decoration: underline;
        }

        .empty {
            color: #929bad;
            padding: 15px 0;
        }

        .logout {
            margin-top: 35px;
        }

        .logout button {
            width: 100%;
            padding: 12px;
            background: #702c2c;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        @media(max-width: 1000px) {
            .stats {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media(max-width: 650px) {
            .sidebar {
                position: relative;
                width: 100%;
                min-height: auto;
            }

            .main {
                margin-left: 0;
                padding: 20px;
            }

            .header {
                align-items: flex-start;
                flex-direction: column;
            }

            .stats {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>

<aside class="sidebar">

    <div class="logo">⚡ Geek Baraholka</div>

    <div class="menu">

        <div class="menu-title">Главное меню</div>

        <a href="/admin" class="active">🏠 Главная</a>
        <a href="/admin/users">👥 Пользователи</a>
        <a href="/admin/categories">📂 Категории</a>
        <a href="/admin/adverts">🛒 Объявления</a>

    </div>

    <div class="logout">
        <form action="/logout" method="POST">
            @csrf
            <button type="submit">Выйти из аккаунта</button>
        </form>
    </div>

</aside>

<main class="main">

    <header class="header">

        <div>
            <h1>Панель управления</h1>
            <p>Добро пожаловать в Geek Baraholka!</p>
        </div>

        <div class="admin">
            🛡️ {{ auth()->user()->name }}
        </div>

    </header>

    <div class="stats">

        <div class="card">
            <p>Всего пользователей</p>
            <h2>{{ $usersCount }}</h2>
        </div>

        <div class="card">
            <p>Всего объявлений</p>
            <h2>{{ $advertsCount }}</h2>
        </div>

        <div class="card">
            <p>Опубликованные</p>
            <h2>{{ $publishedCount }}</h2>
        </div>

        <div class="card">
            <p>На модерации</p>
            <h2>{{ $moderationCount }}</h2>
        </div>

        <div class="card">
            <p>Отклонённые</p>
            <h2>{{ $declinedCount }}</h2>
        </div>

        <div class="card">
            <p>Черновики</p>
            <h2>{{ $draftsCount }}</h2>
        </div>

    </div>

    <section class="section">

        <h2>🏆 Топ-10 объявлений по просмотрам</h2>

        <div class="table-wrap">

            <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Объявление</th>
                        <th>Категория</th>
                        <th>Автор</th>
                        <th>Просмотры</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($topAdverts as $advert)

                        <tr>
                            <td>#{{ $advert->id }}</td>

                            <td>
                                <a class="advert-link"
                                   href="/admin/adverts/{{ $advert->id }}">
                                    {{ $advert->title }}
                                </a>
                            </td>

                            <td>
                                {{ $advert->category->name ?? '—' }}
                            </td>

                            <td>
                                {{ $advert->user->name ?? '—' }}
                            </td>

                            <td class="views">
                                {{ $advert->views_count }}
                            </td>
                        </tr>

                    @empty

                        <tr>
                            <td colspan="5" class="empty">
                                Опубликованных объявлений пока нет.
                            </td>
                        </tr>

                    @endforelse

                </tbody>

            </table>

        </div>

    </section>

</main>

</body>
</html>
```