
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Профиль пользователя — Geek Baraholka</title>

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
            max-width: 1100px;
            margin: auto;
            padding: 35px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        h1 {
            color: #ff922b;
        }

        .back {
            color: #ff922b;
            text-decoration: none;
        }

        .section {
            background: #191d28;
            border: 1px solid #292e3b;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 22px;
        }

        .section h2 {
            margin-bottom: 20px;
        }

        .info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .item {
            background: #222735;
            padding: 17px;
            border-radius: 8px;
            overflow-wrap: anywhere;
        }

        .item p {
            color: #929bad;
            font-size: 13px;
            margin-bottom: 8px;
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

        .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        button {
            padding: 13px 20px;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
        }

        .block {
            background: #a83232;
        }

        .unblock {
            background: #167747;
        }

        .message {
            padding: 15px;
            background: #164b35;
            color: #5beba1;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .advert {
            background: #222735;
            padding: 17px;
            border-radius: 8px;
            margin-bottom: 12px;
        }

        .advert a {
            color: #ff922b;
            text-decoration: none;
        }

        .empty {
            color: #929bad;
        }

        @media(max-width: 650px) {
            .container {
                padding: 18px;
            }

            .info {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>

<div class="container">

    <header class="header">
        <h1>👤 Профиль пользователя</h1>
        <a href="/admin/users" class="back">← Назад</a>
    </header>

    @if(session('success'))
        <div class="message">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="message">{{ $errors->first() }}</div>
    @endif

    <section class="section">
        <h2>{{ $user->name }}</h2>

        <div class="info">

            <div class="item">
                <p>ID пользователя</p>
                #{{ $user->id }}
            </div>

            <div class="item">
                <p>Email</p>
                {{ $user->email }}
            </div>

            <div class="item">
                <p>Телефон</p>
                {{ $user->phone ?? 'Не указан' }}
            </div>

            <div class="item">
                <p>Роль</p>
                @if($user->role === 'moderator')
                    <span class="moderator">Модератор</span>
                @else
                    Пользователь
                @endif
            </div>

            <div class="item">
                <p>Дата регистрации</p>
                {{ $user->created_at?->format('d.m.Y H:i') }}
            </div>

            <div class="item">
                <p>Статус аккаунта</p>

                @if($user->is_blocked)
                    <span class="blocked">Заблокирован</span>
                @else
                    <span class="active">Активен</span>
                @endif
            </div>

            <div class="item">
                <p>Количество объявлений</p>
                {{ $user->adverts->count() }}
            </div>

        </div>
    </section>

    <section class="section">
        <h2>Управление аккаунтом</h2>

        <div class="actions">

            @if($user->role !== 'moderator')

                @if($user->is_blocked)

                    <form action="/admin/users/{{ $user->id }}/unblock"
                          method="POST">
                        @csrf

                        <button class="unblock" type="submit">
                            ✓ Разблокировать
                        </button>
                    </form>

                @else

                    <form action="/admin/users/{{ $user->id }}/block"
                          method="POST"
                          onsubmit="return confirm('Заблокировать пользователя?')">
                        @csrf

                        <button class="block" type="submit">
                            ✕ Заблокировать
                        </button>
                    </form>

                @endif

            @else

                <p class="moderator">
                    Управление аккаунтом модератора недоступно.
                </p>

            @endif

        </div>
    </section>

    <section class="section">
        <h2>📦 Объявления пользователя</h2>

        @forelse($user->adverts as $advert)

            <div class="advert">
                <h3>{{ $advert->title }}</h3>

                <p style="margin: 10px 0;">
                    Цена:
                    {{ number_format($advert->price, 0, ',', ' ') }}
                </p>

                <p style="margin-bottom: 10px;">
                    Статус: {{ $advert->status }}
                </p>

                <a href="/admin/adverts/{{ $advert->id }}">
                    Просмотреть объявление →
                </a>
            </div>

        @empty

            <p class="empty">
                У пользователя пока нет объявлений.
            </p>

        @endforelse

    </section>

</div>

</body>
</html>
