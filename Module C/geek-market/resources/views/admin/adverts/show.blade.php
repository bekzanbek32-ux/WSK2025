<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Просмотр объявления — Geek Baraholka</title>

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

        .container {
            max-width: 1200px;
            margin: auto;
            padding: 35px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            gap: 15px;
        }

        h1 {
            font-size: 27px;
            color: #ff922b;
        }

        .back {
            color: #ff922b;
            text-decoration: none;
            background: #202431;
            padding: 12px 18px;
            border-radius: 8px;
        }

        .section {
            background: #191d28;
            border: 1px solid #292e3b;
            padding: 25px;
            border-radius: 13px;
            margin-bottom: 22px;
        }

        .section h2 {
            margin-bottom: 20px;
        }

        .info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .info-item {
            background: #222735;
            padding: 16px;
            border-radius: 9px;
        }

        .info-item p {
            color: #858da0;
            font-size: 13px;
            margin-bottom: 8px;
        }

        .description {
            color: #c5cad5;
            line-height: 1.8;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        .price {
            color: #ff922b;
            font-size: 26px;
            font-weight: bold;
        }

        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
        }

        .gallery img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: 10px;
            border: 1px solid #303647;
        }

        .empty {
            color: #858da0;
        }

        .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        button {
            border: none;
            padding: 13px 20px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
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

        .status {
            display: inline-block;
            padding: 7px 12px;
            border-radius: 20px;
            background: #303647;
        }

        .message {
            color: #5beba1;
            background: #164b35;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .paid-service {
            background: #222735;
            border: 1px solid #303647;
            padding: 18px;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .service-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            margin: 10px 0;
        }

        .service-active {
            background: #164b35;
            color: #5beba1;
        }

        .service-expired {
            background: #57451c;
            color: #ffd36a;
        }

        .service-disabled {
            background: #702c2c;
            color: #ffaaaa;
        }

        .service-form {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .service-form select {
            background: #111722;
            color: white;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 12px;
            min-width: 220px;
        }

        .service-add {
            background: #167747;
        }

        .service-deactivate {
            background: #9a3535;
            margin-top: 10px;
        }

        @media(max-width: 650px) {
            .container {
                padding: 18px;
            }

            .info {
                grid-template-columns: 1fr;
            }

            .header {
                align-items: flex-start;
                flex-direction: column;
            }
        }
    </style>
</head>

<body>

    <div class="container">

        <header class="header">
            <h1>📦 Просмотр объявления</h1>
            <a href="/admin/adverts" class="back">← Назад</a>
        </header>

        @if (session('success'))
            <div class="message">{{ session('success') }}</div>
        @endif
        @if (session('error'))
            <div class="message" style="background:#702c2c;color:white;">
                {{ session('error') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="message" style="background:#702c2c;color:white;">
                @foreach ($errors->all() as $error)
                    <p>{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <section class="section">
            <h2>{{ $advert->title }}</h2>

            <div class="info">

                <div class="info-item">
                    <p>ID объявления</p>
                    #{{ $advert->id }}
                </div>

                <div class="info-item">
                    <p>Цена</p>
                    <div class="price">
                        {{ number_format($advert->price, 0, ',', ' ') }}
                    </div>
                </div>

                <div class="info-item">
                    <p>Категория</p>
                    {{ $advert->category->name ?? 'Не указана' }}
                </div>

                <div class="info-item">
                    <p>Статус</p>
                    <span class="status">{{ $advert->status }}</span>
                </div>

                <div class="info-item">
                    <p>Количество просмотров</p>
                    {{ $advert->views_count }}
                </div>

                <div class="info-item">
                    <p>Дата создания</p>
                    {{ $advert->created_at?->format('d.m.Y H:i') }}
                </div>

            </div>
        </section>

        <section class="section">
            <h2>Описание объявления</h2>

            <div class="description">{{ $advert->text }}</div>
        </section>

        <section class="section">
            <h2>📸 Фотографии</h2>

            <div class="gallery">

                @forelse($advert->images as $image)
                    <img src="{{ asset('storage/' . basename($image->image_path)) }}" alt="Фото объявления"
                        loading="lazy" onclick="window.open(this.src, '_blank')">

                @empty

                    <p class="empty">Фотографии отсутствуют.</p>
                @endforelse

            </div>
        </section>

        <section class="section">
            <h2>👤 Информация об авторе</h2>

            <div class="info">

                <div class="info-item">
                    <p>Имя</p>
                    {{ $advert->user->name ?? 'Неизвестно' }}
                </div>

                <div class="info-item">
                    <p>Email</p>
                    {{ $advert->user->email ?? 'Не указан' }}
                </div>

                <div class="info-item">
                    <p>Телефон</p>
                    {{ $advert->user->phone ?? 'Не указан' }}
                </div>

            </div>
        </section>


        <section class="section">
            <h2>⭐ Управление платными услугами</h2>

            <h3 style="margin-bottom: 15px;">Подключить новую услугу</h3>

            <form action="/admin/adverts/{{ $advert->id }}/paid-services" method="POST" class="service-form">
                @csrf

                <select name="type" required>
                    <option value="">Выберите услугу</option>
                    <option value="highlight">Выделение объявления</option>
                    <option value="urgent">Срочное объявление</option>
                    <option value="promotion">Продвижение объявления</option>
                </select>

                <button type="submit" class="service-add">
                    + Подключить на 20 дней
                </button>
            </form>

            <p style="color: #858da0; margin-top: 12px; font-size: 13px;">
                Срок действия каждой новой услуги — 20 дней.
            </p>

            <hr style="border-color: #303647; margin: 25px 0;">

            <h3 style="margin-bottom: 15px;">
                История платных услуг
            </h3>

            @forelse($advert->paidServices->sortByDesc('created_at') as $service)
                @php
                    if ($service->deactivated_at !== null) {
                        $serviceStatus = 'Отключена';
                        $serviceClass = 'service-disabled';
                    } elseif ($service->expires_at !== null && $service->expires_at->isPast()) {
                        $serviceStatus = 'Истекла';
                        $serviceClass = 'service-expired';
                    } elseif ($service->expires_at !== null && $service->expires_at->isFuture()) {
                        $serviceStatus = 'Активна';
                        $serviceClass = 'service-active';
                    } else {
                        $serviceStatus = 'Нет данных о сроке';
                        $serviceClass = 'service-expired';
                    }
                @endphp

                <div class="paid-service">

                    <h3>{{ $service->type }}</h3>

                    <span class="service-badge {{ $serviceClass }}">
                        {{ $serviceStatus }}
                    </span>

                    <p style="color: #aeb5c5; margin-top: 10px;">
                        Подключена:
                        {{ $service->activated_at?->format('d.m.Y H:i') ?? 'Нет данных' }}
                    </p>

                    <p style="color: #aeb5c5; margin-top: 8px;">
                        Действует до:
                        {{ $service->expires_at?->format('d.m.Y H:i') ?? 'Не указано' }}
                    </p>

                    @if ($service->deactivated_at)
                        <p style="color: #ff9999; margin-top: 8px;">
                            Отключена:
                            {{ $service->deactivated_at->format('d.m.Y H:i') }}
                        </p>
                    @endif

                    @if ($serviceStatus === 'Активна')
                        <form action="/admin/adverts/{{ $advert->id }}/paid-services/{{ $service->id }}/deactivate"
                            method="POST" onsubmit="return confirm('Отключить эту услугу?')">
                            @csrf
                            @method('PUT')

                            <button type="submit" class="service-deactivate">
                                Отключить услугу
                            </button>
                        </form>
                    @endif

                </div>

            @empty

                <p class="empty">
                    Платных услуг пока нет.
                </p>
            @endforelse

        </section>



        <section class="section">
            <h2>Управление объявлением</h2>

            <p style="margin-bottom: 15px;">
                Текущий статус:
                <span class="status">{{ $advert->status }}</span>
            </p>

            <form action="{{ route('admin.adverts.status', $advert->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="actions">

                    @if ($advert->status === 'draft')
                        <button class="approve" type="submit" name="status" value="moderation">
                            Отправить на модерацию
                        </button>
                    @endif

                    @if ($advert->status === 'moderation')
                        <button class="approve" type="submit" name="status" value="published">
                            ✓ Опубликовать
                        </button>

                        <button class="reject" type="submit" name="status" value="declined">
                            ✕ Отклонить
                        </button>
                    @endif

                    @if (in_array($advert->status, ['published', 'declined']))
                        <button class="approve" type="submit" name="status" value="moderation">
                            Вернуть на модерацию
                        </button>
                    @endif

                </div>
            </form>

            <form action="/admin/adverts/{{ $advert->id }}" method="POST" style="margin-top: 15px;"
                onsubmit="return confirm('Точно удалить объявление?')">
                @csrf
                @method('DELETE')

                <button class="delete" type="submit">
                    🗑 Удалить
                </button>
            </form>
        </section>


    </div>

</body>

</html>
