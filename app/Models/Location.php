<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'location_type', 'franchise_type', 'location_legal_name', 'short_name',
        'contact_person_name', 'contact_number', 'email', 'time_zone', 'country', 'state', 'city', 'pincode', 'address',
        'gst_no', 'pan_no', 'cst_no', 'service_tax_no', 'tin_no', 'vat_no', 'pf_no', 'royalty_percent', 'royalty_frequency',
        'allow_order_types', 'default_order_type', 'allow_payment_types', 'default_payment_type', 'start_bill_no', 'default_delivery_charge', 'round_off_option', 'order_cancellation_duration', 'time_duration_to_edit_order', 'token_refreshment', 'po_number_format', 'common_preferences', 'fssai_number', 'end_day_process_time', 'opening_time', 'closing_time', 'business_id', 'product_sorting', 'custom_sales_invoice_series',
        'specify_reason_for_order_cancellation', 'specify_reason_for_item_cancellation', 'sms_for_daily_sales_summary', 'employee_productivity_monitoring', 'test_mode', 'print_without_settlement', 'show_delivery_charge_on_billing', 'is_print_on_dispatch', 'strict_permission_email_purchase_order', 'display_location_on_dashboard', 'allow_order_modification_after_bill_print', 'enable_bank_deposit', 'allow_negative_sale', 'allow_email_notification_on_stock_transfer', 'enable_kds', 'print_item_wise_kot', 'enable_zomato_swiggy_integration', 'enable_otp_verification_for_order_discount', 'print_shift_report', 'combine_kot_print_on_save_order',
        'supplier_id', 'default_warehouse_name', 'enable_petty_cash', 'route', 'latitude', 'longitude',
    ];

    protected $casts = [
        'allow_order_types' => 'array',
        'allow_payment_types' => 'array',
        'custom_sales_invoice_series' => 'boolean',
        'specify_reason_for_order_cancellation' => 'boolean',
        'specify_reason_for_item_cancellation' => 'boolean',
        'sms_for_daily_sales_summary' => 'boolean',
        'employee_productivity_monitoring' => 'boolean',
        'test_mode' => 'boolean',
        'print_without_settlement' => 'boolean',
        'show_delivery_charge_on_billing' => 'boolean',
        'is_print_on_dispatch' => 'boolean',
        'strict_permission_email_purchase_order' => 'boolean',
        'display_location_on_dashboard' => 'boolean',
        'allow_order_modification_after_bill_print' => 'boolean',
        'enable_bank_deposit' => 'boolean',
        'allow_negative_sale' => 'boolean',
        'allow_email_notification_on_stock_transfer' => 'boolean',
        'enable_kds' => 'boolean',
        'print_item_wise_kot' => 'boolean',
        'enable_zomato_swiggy_integration' => 'boolean',
        'enable_otp_verification_for_order_discount' => 'boolean',
        'print_shift_report' => 'boolean',
        'combine_kot_print_on_save_order' => 'boolean',
        'enable_petty_cash' => 'boolean',
    ];
}
