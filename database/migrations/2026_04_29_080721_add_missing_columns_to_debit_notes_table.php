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
        Schema::table('debit_notes', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->constrained();
            $table->foreignId('supplier_id')->nullable()->constrained();
            $table->date('debit_note_date')->nullable();
            $table->string('reference')->nullable();
            $table->text('description')->nullable();
            $table->decimal('total_amount_base', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total_taxable_amt', 15, 2)->default(0);
            $table->decimal('total_cess_amt', 15, 2)->default(0);
            $table->decimal('total_tax_amt', 15, 2)->default(0);
            $table->decimal('additional_charges', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('debit_notes', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropForeign(['supplier_id']);
            $table->dropColumn([
                'location_id',
                'supplier_id',
                'debit_note_date',
                'reference',
                'description',
                'total_amount_base',
                'discount',
                'total_taxable_amt',
                'total_cess_amt',
                'total_tax_amt',
                'additional_charges',
                'grand_total'
            ]);
        });
    }
};
