<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvertImage extends Model
{
    protected $fillable = [
        'advert_id',
        'image_path',
    ];

    public function advert(): BelongsTo
    {
        return $this->belongsTo(Advert::class);
    }
}