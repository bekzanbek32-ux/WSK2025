<?php

namespace App\Models;

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
        'views_count',
        'category_id',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(AdvertImage::class);
    }

    public function paidServices(): HasMany
    {
        return $this->hasMany(AdvertPaidService::class);
    }
}