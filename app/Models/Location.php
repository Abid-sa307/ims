<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'location_type', 'location_legal_name', 'short_name',
        'contact_person_name', 'contact_number', 'email', 'time_zone', 'country', 'state', 'city', 'pincode', 'address',
        'gst_no', 'pan_no', 'cst_no', 'service_tax_no', 'tin_no', 'vat_no', 'pf_no',
        'default_warehouse_name', 'supplier_id', 'allotted_supplier_ids', 'customer_id', 'route', 'latitude', 'longitude',
        'strict_permission_email_purchase_order', 'allow_email_notification_on_stock_transfer',
        'email_po_approval', 'email_so_approval', 'email_sales_order',
        'invoice_cc_emails',
        'fssai_number', 'gst_no', 'pan_no',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    protected $casts = [
        'strict_permission_email_purchase_order' => 'boolean',
        'allow_email_notification_on_stock_transfer' => 'boolean',
        'email_sales_order' => 'boolean',
        'invoice_cc_emails' => 'array',
        'allotted_supplier_ids' => 'array',
    ];
}
