<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            
            // Location
            $table->string('location_type')->nullable();
            $table->string('franchise_type')->nullable();
            $table->string('location_legal_name');
            $table->string('short_name')->nullable();
            
            // Contact
            $table->string('contact_person_name')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('time_zone')->nullable();
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('pincode')->nullable();
            $table->text('address')->nullable();
            
            // Taxation
            $table->string('gst_no')->nullable();
            $table->string('pan_no')->nullable();
            $table->string('cst_no')->nullable();
            $table->string('service_tax_no')->nullable();
            $table->string('tin_no')->nullable();
            $table->string('vat_no')->nullable();
            $table->string('pf_no')->nullable();
            $table->decimal('royalty_percent', 8, 2)->nullable();
            $table->string('royalty_frequency')->nullable();
            
            // Configuration Arrays/Strings
            $table->json('allow_order_types')->nullable();
            $table->string('default_order_type')->nullable();
            $table->json('allow_payment_types')->nullable();
            $table->string('default_payment_type')->nullable();
            $table->string('start_bill_no')->nullable();
            $table->decimal('default_delivery_charge', 10, 2)->nullable();
            $table->string('round_off_option')->nullable();
            $table->integer('order_cancellation_duration')->nullable();
            $table->integer('time_duration_to_edit_order')->nullable();
            $table->string('token_refreshment')->nullable();
            $table->string('po_number_format')->nullable();
            $table->string('common_preferences')->nullable();
            $table->string('fssai_number')->nullable();
            $table->time('end_day_process_time')->nullable();
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->string('business_id')->nullable();
            $table->string('product_sorting')->nullable();
            $table->boolean('custom_sales_invoice_series')->default(false);
            
            // Switch Flags
            $table->boolean('specify_reason_for_order_cancellation')->default(false);
            $table->boolean('specify_reason_for_item_cancellation')->default(false);
            $table->boolean('sms_for_daily_sales_summary')->default(false);
            $table->boolean('employee_productivity_monitoring')->default(false);
            $table->boolean('test_mode')->default(false);
            $table->boolean('print_without_settlement')->default(false);
            $table->boolean('show_delivery_charge_on_billing')->default(false);
            $table->boolean('is_print_on_dispatch')->default(false);
            $table->boolean('strict_permission_email_purchase_order')->default(false);
            $table->boolean('display_location_on_dashboard')->default(false);
            $table->boolean('allow_order_modification_after_bill_print')->default(false);
            $table->boolean('enable_bank_deposit')->default(false);
            $table->boolean('allow_negative_sale')->default(false);
            $table->boolean('allow_email_notification_on_stock_transfer')->default(false);
            $table->boolean('enable_kds')->default(false);
            $table->boolean('print_item_wise_kot')->default(false);
            $table->boolean('enable_zomato_swiggy_integration')->default(false);
            $table->boolean('enable_otp_verification_for_order_discount')->default(false);
            $table->boolean('print_shift_report')->default(false);
            $table->boolean('combine_kot_print_on_save_order')->default(false);
            
            // Bottom Items
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->string('default_warehouse_name')->nullable();
            $table->boolean('enable_petty_cash')->default(false);
            $table->string('route')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
