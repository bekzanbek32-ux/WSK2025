<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
    ];

    public function adverts(): HasMany
    {
        return $this->hasMany(Advert::class, 'category_id', 'id');
    }
}