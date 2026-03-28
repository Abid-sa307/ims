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
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained()->onDelete('cascade');
            $table->foreignId('item_id')->constrained();
            $table->string('uom');
            $table->integer('qty');
            $table->string('fat_value')->nullable();
            $table->decimal('last_price', 10, 2)->default(0);
            $table->decimal('current_price', 10, 2)->default(0);
            $table->date('expire_date')->nullable();
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('taxable_amount', 10, 2)->default(0);
            $table->decimal('cess_percent', 5, 2)->default(0);
            $table->decimal('cess_amount', 10, 2)->default(0);
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
