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
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn('enable_royalty_service');
            $table->boolean('allow_modify_sales_order')->default(false)->after('dispatch_only_prepaid_orders');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn('allow_modify_sales_order');
            $table->boolean('enable_royalty_service')->default(false)->after('dispatch_only_prepaid_orders');
        });
    }
};
