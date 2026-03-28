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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('supplier_name');
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->text('address')->nullable();
            $table->string('location')->nullable();
            $table->string('gst_number')->nullable();
            $table->string('pan')->nullable();
            $table->string('vat_number')->nullable();
            $table->string('lut_number')->nullable();
            $table->string('fda_registration_number')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('pincode')->nullable();
            $table->string('supplier_code_tally')->nullable();
            $table->string('contact_person_name')->nullable();
            $table->string('logo')->nullable();
            $table->time('cut_off_from_time')->nullable();
            $table->time('cut_off_to_time')->nullable();
            $table->boolean('allow_modify_moq')->default(false);
            $table->boolean('enable_order_level_tax')->default(false);
            $table->boolean('disable_rounding_off')->default(false);
            $table->boolean('reduce_qty_with_packaging_material')->default(false);
            $table->boolean('enable_credit_limit')->default(false);
            $table->boolean('dispatch_only_prepaid_orders')->default(false);
            $table->boolean('enable_royalty_service')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
