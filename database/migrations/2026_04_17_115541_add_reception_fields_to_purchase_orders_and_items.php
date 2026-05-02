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
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->date('received_date')->nullable();
            $table->text('receive_remarks')->nullable();
            $table->text('dispatched_remarks')->nullable();
            $table->date('ref_invoice_date')->nullable();
            $table->string('ref_invoice_no')->nullable();
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->decimal('received_qty', 15, 5)->default(0);
            $table->decimal('damaged_qty', 15, 5)->default(0);
            $table->decimal('missed_qty', 15, 5)->default(0);
            $table->date('mfg_date')->nullable();
            
            // Additional charges per item
            $table->decimal('service_charge_percent', 5, 2)->default(0);
            $table->decimal('service_charge_amount', 15, 2)->default(0);
            $table->decimal('tcs_percent', 5, 2)->default(0);
            $table->decimal('tcs_amount', 15, 2)->default(0);
            $table->decimal('vat_percent', 5, 2)->default(0);
            $table->decimal('vat_amount', 15, 2)->default(0);
            $table->decimal('surcharge_percent', 5, 2)->default(0);
            $table->decimal('surcharge_amount', 15, 2)->default(0);
            $table->decimal('catering_levy_percent', 5, 2)->default(0);
            $table->decimal('catering_levy_amount', 15, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropColumn(['received_date', 'receive_remarks', 'dispatched_remarks', 'ref_invoice_date', 'ref_invoice_no']);
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropColumn([
                'received_qty', 'damaged_qty', 'missed_qty', 'mfg_date',
                'service_charge_percent', 'service_charge_amount',
                'tcs_percent', 'tcs_amount', 'vat_percent', 'vat_amount',
                'surcharge_percent', 'surcharge_amount',
                'catering_levy_percent', 'catering_levy_amount'
            ]);
        });
    }
};
