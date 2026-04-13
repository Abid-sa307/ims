<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->string('email_po_approval')->nullable()->after('allow_email_notification_on_stock_transfer');
            $table->string('email_so_approval')->nullable()->after('email_po_approval');
            $table->boolean('email_sales_order')->default(false)->after('email_so_approval');
        });
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['email_po_approval', 'email_so_approval', 'email_sales_order']);
        });
    }
};
