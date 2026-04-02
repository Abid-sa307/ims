<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemSubCategory extends Model
{
    protected $fillable = ['category_id', 'name'];

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }
}
