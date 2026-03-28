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
            $table->foreignId('location_id')->nullable()->constrained();
            $table->string('reference_bill_no')->nullable();
            $table->string('reference_challan_no')->nullable();
            $table->date('po_date')->nullable();
            $table->date('exp_order_date')->nullable();
            $table->date('inv_date')->nullable();
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_tax_amount', 10, 2)->default(0);
            $table->decimal('additional_charges', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2)->default(0);
            $table->text('remarks')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn([
                'location_id', 'reference_bill_no', 'reference_challan_no',
                'po_date', 'exp_order_date', 'inv_date', 'discount_amount',
                'total_tax_amount', 'additional_charges', 'grand_total', 'remarks'
            ]);
        });
    }
};
