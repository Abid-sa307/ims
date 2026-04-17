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
            $table->decimal('cgst_amount', 15, 2)->default(0)->after('total_tax_amount');
            $table->decimal('sgst_amount', 15, 2)->default(0)->after('cgst_amount');
            $table->decimal('igst_amount', 15, 2)->default(0)->after('sgst_amount');
            $table->decimal('utgst_amount', 15, 2)->default(0)->after('igst_amount');
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->decimal('cgst_percent', 5, 2)->default(0)->after('tax_percent');
            $table->decimal('cgst_amount', 15, 2)->default(0)->after('cgst_percent');
            $table->decimal('sgst_percent', 5, 2)->default(0)->after('cgst_amount');
            $table->decimal('sgst_amount', 15, 2)->default(0)->after('sgst_percent');
            $table->decimal('igst_percent', 5, 2)->default(0)->after('sgst_amount');
            $table->decimal('igst_amount', 15, 2)->default(0)->after('igst_percent');
            $table->decimal('utgst_percent', 5, 2)->default(0)->after('igst_amount');
            $table->decimal('utgst_amount', 15, 2)->default(0)->after('utgst_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropColumn(['cgst_amount', 'sgst_amount', 'igst_amount', 'utgst_amount']);
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropColumn([
                'cgst_percent', 'cgst_amount', 
                'sgst_percent', 'sgst_amount', 
                'igst_percent', 'igst_amount', 
                'utgst_percent', 'utgst_amount'
            ]);
        });
    }
};
