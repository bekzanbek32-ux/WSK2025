<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AdvertSeeder extends Seeder
{
    public function run(): void
    {
        $file = dirname(base_path())
            . '/media-files/media-files/data/adverts.csv';

        if (!file_exists($file)) {
            throw new RuntimeException(
                "CSV file not found: " . $file
            );
        }

        $handle = fopen($file, 'r');

        if (!$handle) {
            throw new RuntimeException(
                'Cannot open adverts.csv'
            );
        }

        $headers = fgetcsv($handle, 0, ',', '"', '\\');

        if (!$headers) {
            fclose($handle);
            throw new RuntimeException(
                'CSV file is empty'
            );
        }

        // Remove UTF-8 BOM
        $headers[0] = preg_replace(
            '/^\xEF\xBB\xBF/',
            '',
            $headers[0]
        );

        try {
            DB::transaction(function () use ($handle, $headers) {

                // Delete old records in the correct order
                DB::table('advert_images')->delete();
                DB::table('advert_paid_services')->delete();
                DB::table('adverts')->delete();

                while (($row = fgetcsv(
                    $handle, 0, ',', '"', '\\'
                )) !== false) {

                    if (count($row) !== count($headers)) {
                        throw new RuntimeException(
                            'Invalid CSV row'
                        );
                    }

                    $data = array_combine($headers, $row);

                    $category = DB::table('categories')
                        ->where('id', $data['category'])
                        ->first();

                    $user = DB::table('users')
                        ->where('email', $data['author'])
                        ->first();

                    if (!$category) {
                        throw new RuntimeException(
                            'Category not found: ' . $data['category']
                        );
                    }

                    if (!$user) {
                        throw new RuntimeException(
                            'User not found: ' . $data['author']
                        );
                    }

                    $photos = json_decode(
                        stripslashes($data['photos']),
                        true
                    );

                    $services = json_decode(
                        stripslashes($data['paid_services']),
                        true
                    );

                    if (!is_array($photos) || !is_array($services)) {
                        throw new RuntimeException(
                            'Invalid JSON in CSV: ' . $data['title']
                        );
                    }

                    $now = now();

                    // Insert advert
                    $advertId = DB::table('adverts')->insertGetId([
                        'title' => $data['title'],
                        'text' => $data['text'],
                        'status' => $data['status'],
                        'price' => $data['price'],
                        'views_count' => $data['views_count'],
                        'category_id' => $category->id,
                        'user_id' => $user->id,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);

                    // Insert photos
                    foreach ($photos as $photo) {
                        DB::table('advert_images')->insert([
                            'advert_id' => $advertId,
                            'image_path' => $photo,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }

                    // Insert paid services
                    foreach ($services as $service) {
                        DB::table('advert_paid_services')->insert([
                            'advert_id' => $advertId,
                            'type' => $service,
                            'activated_at' => null,
                            'expires_at' => null,
                            'deactivated_at' => null,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }
                }
            });
        } finally {
            fclose($handle);
        }

        $this->command->info(
            'Adverts imported successfully!'
        );
    }
}
