<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $path = storage_path('app/import/users.csv');

        if (!file_exists($path)) {
            throw new \Exception('Файл users.csv не найден!');
        }

        $file = fopen($path, 'r');

        $headers = fgetcsv($file);

        $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', $headers[0]);

        while (($row = fgetcsv($file)) !== false) {

            $data = array_combine($headers, $row);

            $password = trim($data['password']);

            // Если пароль записан как <hash(password)>
            if (preg_match('/^\\\\?<hash\((.*)\)>$/', $password, $matches)) {
                $password = $matches[1];
            }

            User::updateOrCreate(
                ['email' => trim($data['email'])],
                [
                    'name' => trim($data['name']),
                    'phone' => trim($data['phone']),
                    'password' => Hash::make($password),
                    'role' => trim($data['role']),
                ]
            );
        }

        fclose($file);
    }
}