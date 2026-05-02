<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_payments', function (Blueprint $table) {
            $table->foreignId('sales_invoice_id')->nullable()->constrained('sales_invoices')->nullOnDelete()->after('customer_id');
            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete()->after('sales_invoice_id');
            $table->string('status')->default('completed')->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('customer_payments', function (Blueprint $table) {
            $table->dropForeign(['sales_invoice_id']);
            $table->dropForeign(['location_id']);
            $table->dropColumn(['sales_invoice_id', 'location_id', 'status']);
        });
    }
};
