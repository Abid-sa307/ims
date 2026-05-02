<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'location_id',
        'project_name',
        'project_code',
        'description',
        'status'
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
