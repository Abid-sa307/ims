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
        Schema::table('taxes', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('tax_name');
            $table->enum('tax_type', ['intrastate', 'interstate', 'union_territory'])->nullable()->change();
            $table->decimal('cgst_rate', 5, 2)->nullable()->change();
            $table->decimal('sgst_rate', 5, 2)->nullable()->change();
            $table->decimal('igst_rate', 5, 2)->nullable()->change();
            $table->decimal('utgst_rate', 5, 2)->nullable()->change();
            $table->decimal('total_rate', 5, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('taxes', function (Blueprint $table) {
            $table->dropColumn('is_active');
            $table->enum('tax_type', ['intrastate', 'interstate', 'union_territory'])->nullable(false)->change();
            $table->decimal('cgst_rate', 5, 2)->nullable(false)->change();
            $table->decimal('sgst_rate', 5, 2)->nullable(false)->change();
            $table->decimal('igst_rate', 5, 2)->nullable(false)->change();
            $table->decimal('utgst_rate', 5, 2)->nullable(false)->change();
            $table->decimal('total_rate', 5, 2)->nullable(false)->change();
        });
    }
};
