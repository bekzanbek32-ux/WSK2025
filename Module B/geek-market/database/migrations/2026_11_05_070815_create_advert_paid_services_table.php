<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advert_paid_services', function (Blueprint $table) {
            $table->id();

            $table->foreignId('advert_id')
                ->constrained('adverts')
                ->cascadeOnDelete();

            $table->string('type');

            $table->timestamp('activated_at')->nullable();

            $table->timestamp('expires_at')->nullable();

            $table->timestamp('deactivated_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advert_paid_services');
    }
};