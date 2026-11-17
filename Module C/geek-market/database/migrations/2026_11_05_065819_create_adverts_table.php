<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adverts', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('text');

            $table->string('status')->default('draft');

            $table->decimal('price', 10, 2)->default(0);
            $table->unsignedInteger('views_count')->default(0);

            $table->string('category_id');

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adverts');
    }
};