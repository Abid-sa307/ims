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
        // Columns already added manually in failed migration runs or partial successes
        // Just creating the items table now
        if (!Schema::hasTable('debit_note_items')) {
            Schema::create('debit_note_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('debit_note_id')->constrained()->onDelete('cascade');
                $table->foreignId('item_id')->constrained();
                $table->string('uom')->nullable();
                $table->decimal('unit_price', 15, 2)->default(0);
                $table->decimal('ordered_qty', 15, 2)->default(0);
                $table->decimal('already_returned_qty', 15, 2)->default(0);
                $table->decimal('return_qty', 15, 2)->default(0);
                
                $table->decimal('discount_percent', 5, 2)->default(0);
                $table->decimal('discount_amount', 15, 2)->default(0);
                
                $table->decimal('taxable_amount', 15, 2)->default(0);
                $table->decimal('cess_percent', 5, 2)->default(0);
                $table->decimal('cess_amount', 15, 2)->default(0);
                
                $table->decimal('sgst_percent', 5, 2)->default(0);
                $table->decimal('sgst_amount', 15, 2)->default(0);
                $table->decimal('cgst_percent', 5, 2)->default(0);
                $table->decimal('cgst_amount', 15, 2)->default(0);
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
                
                $table->decimal('total_amount', 15, 2)->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('debit_note_items');
    }
};
