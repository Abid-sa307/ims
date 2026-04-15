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
        Schema::create('stock_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();
            $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
            $table->foreignId('inward_warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->foreignId('outward_warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->timestamps();
            
            $table->unique(['location_id', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_sources');
    }
};
