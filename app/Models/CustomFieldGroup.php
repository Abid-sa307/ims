<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomFieldGroup extends Model
{
    protected $fillable = ['group_name', 'associated_module'];
}
