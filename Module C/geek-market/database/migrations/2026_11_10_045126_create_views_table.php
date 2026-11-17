<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('views', function (Blueprint $table) {
            $table->id();

            $table->foreignId('advert_id')
                ->constrained('adverts')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['advert_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('views');
    }
};