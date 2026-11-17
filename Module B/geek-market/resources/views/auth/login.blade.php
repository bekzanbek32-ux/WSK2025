<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход — Geek Baraholka</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #f4f5f9;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-box {
            background: white;
            width: 400px;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.08);
        }

        h1 {
            text-align: center;
            margin-bottom: 10px;
            color: #222;
        }

        .subtitle {
            text-align: center;
            color: #777;
            margin-bottom: 30px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }

        input {
            width: 100%;
            padding: 13px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 15px;
        }

        button {
            width: 100%;
            padding: 14px;
            background: #ff750f;
            border: none;
            color: white;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }

        button:hover {
            background: #e66500;
        }

        .error {
            background: #ffe5e5;
            color: #c62828;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>

<div class="login-box">

    <h1>Geek Baraholka</h1>
    <p class="subtitle">Вход в панель модератора</p>

    @if ($errors->any())
        <div class="error">
            @foreach ($errors->all() as $error)
                <p>{{ $error }}</p>
            @endforeach
        </div>
    @endif

    <form action="{{ url('/login') }}" method="POST">
        @csrf

        <label>Телефон или Email</label>
        <input
            type="text"
            name="login"
            value="{{ old('login') }}"
            placeholder="Введите телефон или email"
            required
        >

        <label>Пароль</label>
        <input
            type="password"
            name="password"
            placeholder="Введите пароль"
            required
        >

        <button type="submit">Войти</button>
    </form>

</div>

</body>
</html>
