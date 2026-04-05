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
        Schema::table('item_warehouse_mappings', function (Blueprint $table) {
            $table->decimal('current_quantity', 15, 4)->default(0)->after('item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_warehouse_mappings', function (Blueprint $table) {
            $table->dropColumn('current_quantity');
        });
    }
};
