<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['item_name', 'uom', 'price', 'tax_percent', 'cess_percent', 'description'];
}
