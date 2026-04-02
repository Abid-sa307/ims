<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->foreignId('item_category_id')->nullable()->constrained('item_categories')->onDelete('set null');
            $table->foreignId('item_sub_category_id')->nullable()->constrained('item_sub_categories')->onDelete('set null');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('item_type_id')->nullable()->constrained('item_types')->onDelete('set null');
            $table->string('item_name_gujarati')->nullable();
            $table->string('equivalent_selling_item')->nullable();
            $table->decimal('safety_quantity', 15, 4)->default(0);
            $table->foreignId('base_unit_id')->nullable()->constrained('uoms')->onDelete('set null');
            $table->integer('default_tax_id')->nullable(); // Reference if tax master available
            $table->enum('selling_item_as', ['Goods', 'Service'])->default('Goods');
            $table->string('hsn_code')->nullable();
            $table->string('sac_code')->nullable();
            $table->string('htsn_code')->nullable();
            $table->string('fda_product_code')->nullable();
            $table->boolean('is_cess')->default(false);
            $table->decimal('cess_percentage', 5, 2)->default(0);
            $table->text('cess_description')->nullable();
            $table->string('price_type')->nullable();
            $table->decimal('standard_sale_price', 15, 2)->default(0);
            $table->decimal('standard_purchase_price', 15, 2)->default(0);
            $table->decimal('net_cost', 15, 2)->default(0);
            $table->integer('shelf_life_days')->default(0);
            $table->decimal('single_batch_quantity', 15, 4)->default(1);
            $table->string('item_barcode')->nullable();
            $table->string('item_sku')->nullable();
            $table->decimal('standard_weight_single_unit', 15, 4)->default(0);
            $table->decimal('weight_adjustment_gross_weight', 15, 4)->default(0);
            $table->string('pallet_size_export')->nullable();
            $table->boolean('is_manufacture')->default(false);
            $table->boolean('is_fat_item')->default(false);
            $table->boolean('is_packing_item')->default(false);
            $table->boolean('allow_multiple_entry_po')->default(false);
            $table->boolean('has_parent_item')->default(false);
            $table->text('remarks')->nullable();
            $table->text('ingredients')->nullable();
            $table->text('nutrition_information')->nullable();
            $table->string('item_tally_code')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['item_category_id']);
            $table->dropForeign(['item_sub_category_id']);
            $table->dropForeign(['brand_id']);
            $table->dropForeign(['item_type_id']);
            $table->dropForeign(['base_unit_id']);
            $table->dropColumn([
                'item_category_id', 'item_sub_category_id', 'brand_id', 'item_type_id',
                'item_name_gujarati', 'equivalent_selling_item', 'safety_quantity',
                'base_unit_id', 'default_tax_id', 'selling_item_as', 'hsn_code', 'sac_code',
                'htsn_code', 'fda_product_code', 'is_cess', 'cess_percentage', 'cess_description', 
                'price_type', 'standard_sale_price', 'standard_purchase_price', 'net_cost',
                'shelf_life_days', 'single_batch_quantity', 'item_barcode', 'item_sku',
                'standard_weight_single_unit', 'weight_adjustment_gross_weight',
                'pallet_size_export', 'is_manufacture', 'is_fat_item', 'is_packing_item',
                'allow_multiple_entry_po', 'has_parent_item', 'remarks', 'ingredients',
                'nutrition_information', 'item_tally_code'
            ]);
        });
    }
};
