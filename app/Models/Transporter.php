<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transporter extends Model
{
    protected $fillable = [
        'transporter_name',
        'transporter_id',
        'gst_no',
        'contact_person_name',
        'contact_number',
        'address',
    ];
}
