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
        Schema::create('price_lists', function (Blueprint $table) {
            $table->id();
            $table->string('price_list_name');
            $table->string('price_list_type');
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->string('applied_on')->nullable();
            $table->unsignedBigInteger('buyer_id')->nullable();
            $table->unsignedBigInteger('item_category_id')->nullable();
            $table->decimal('discount_percent', 5, 2)->nullable();
            $table->decimal('default_markup_percent', 5, 2)->nullable();
            $table->date('period_start');
            $table->date('period_end');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_lists');
    }
};
