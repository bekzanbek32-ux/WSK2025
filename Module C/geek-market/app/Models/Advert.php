<?php

namespace App\Models;

use App\Models\View;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Advert extends Model
{
    protected $fillable = [
        'title',
        'text',
        'status',
        'price',
        'photos',
        'category_id',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'photos' => 'array',
            'price' => 'decimal:2',
        ];
    }

    // Автор объявления
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Категория объявления
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    // Платные услуги
    public function paidServices(): HasMany
    {
        return $this->hasMany(AdvertPaidService::class);
    }

    // Просмотры объявления
    public function views(): HasMany
    {
        return $this->hasMany(View::class);
    }

}

