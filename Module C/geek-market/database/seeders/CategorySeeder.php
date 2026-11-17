<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['id' => 'C1', 'name' => 'Real Estate'],
            ['id' => 'C2', 'name' => 'Vehicles'],
            ['id' => 'C3', 'name' => 'Jobs'],
            ['id' => 'C4', 'name' => 'Services'],
            ['id' => 'C5', 'name' => 'Electronics'],
            ['id' => 'C6', 'name' => 'Personal Items'],
            ['id' => 'C7', 'name' => 'Hobbies & Leisure'],
            ['id' => 'C8', 'name' => 'Animals & Pets'],
            ['id' => 'C9', 'name' => 'Home & Garden'],
            ['id' => 'C10', 'name' => 'Business & Equipment'],
        ];

        DB::table('categories')->insert(
            array_map(function ($category) {
                return array_merge($category, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }, $categories)
        );
    }
}
