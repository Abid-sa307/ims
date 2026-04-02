<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uom_conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('base_unit_id')->constrained('uoms');
            $table->foreignId('target_uom_id')->constrained('uoms');
            $table->decimal('uom_multiplier', 15, 6)->default(1);
            $table->decimal('quantity_multiplier', 15, 6)->default(1);
            $table->decimal('min_order_quantity', 15, 4)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uom_conversions');
    }
};
