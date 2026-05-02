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
        Schema::table('sales_invoices', function (Blueprint $table) {
            $table->decimal('total_tax_amount', 15, 2)->default(0)->after('discount_amount');
            $table->decimal('cgst_amount', 15, 2)->default(0)->after('total_tax_amount');
            $table->decimal('sgst_amount', 15, 2)->default(0)->after('cgst_amount');
            $table->decimal('igst_amount', 15, 2)->default(0)->after('sgst_amount');
            $table->decimal('utgst_amount', 15, 2)->default(0)->after('igst_amount');
            $table->decimal('additional_charges', 15, 2)->default(0)->after('utgst_amount');
        });

        Schema::table('sales_invoice_items', function (Blueprint $table) {
            $table->decimal('discount_percent', 8, 2)->default(0)->after('unit_price');
            $table->decimal('taxable_amount', 15, 2)->default(0)->after('discount_amount');
            $table->decimal('cess_percent', 8, 2)->default(0)->after('taxable_amount');
            $table->decimal('cess_amount', 15, 2)->default(0)->after('cess_percent');
            $table->decimal('tax_percent', 8, 2)->default(0)->after('cess_amount');
            $table->decimal('cgst_percent', 8, 2)->default(0)->after('tax_percent');
            $table->decimal('cgst_amount', 15, 2)->default(0)->after('cgst_percent');
            $table->decimal('sgst_percent', 8, 2)->default(0)->after('cgst_amount');
            $table->decimal('sgst_amount', 15, 2)->default(0)->after('sgst_percent');
            $table->decimal('igst_percent', 8, 2)->default(0)->after('sgst_amount');
            $table->decimal('igst_amount', 15, 2)->default(0)->after('igst_percent');
            $table->decimal('utgst_percent', 8, 2)->default(0)->after('igst_amount');
            $table->decimal('utgst_amount', 15, 2)->default(0)->after('utgst_percent');
        });
    }

    public function down(): void
    {
        Schema::table('sales_invoices', function (Blueprint $table) {
            $table->dropColumn(['total_tax_amount', 'cgst_amount', 'sgst_amount', 'igst_amount', 'utgst_amount', 'additional_charges']);
        });

        Schema::table('sales_invoice_items', function (Blueprint $table) {
            $table->dropColumn([
                'discount_percent', 'taxable_amount', 'cess_percent', 'cess_amount', 'tax_percent',
                'cgst_percent', 'cgst_amount', 'sgst_percent', 'sgst_amount',
                'igst_percent', 'igst_amount', 'utgst_percent', 'utgst_amount'
            ]);
        });
    }
};
