<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvertPaidService extends Model
{
    protected $fillable = [
        'advert_id',
        'type',
        'activated_at',
        'expires_at',
        'deactivated_at',
    ];

    protected function casts(): array
    {
        return [
            'activated_at' => 'datetime',
            'expires_at' => 'datetime',
            'deactivated_at' => 'datetime',
        ];
    }

    public function advert(): BelongsTo
    {
        return $this->belongsTo(Advert::class);
    }
}