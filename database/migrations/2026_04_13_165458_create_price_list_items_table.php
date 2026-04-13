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
        Schema::create('price_list_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('price_list_id');
            $table->unsignedBigInteger('item_id');
            $table->decimal('selling_price', 15, 2)->nullable();
            $table->decimal('tax_percent', 5, 2)->nullable();
            $table->string('uom')->nullable();
            $table->timestamps();

            $table->foreign('price_list_id')->references('id')->on('price_lists')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_list_items');
    }
};
