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
        Schema::create('additional_expenses', function (Blueprint $table) {
            $table->id();
            $table->string('expense_name');
            $table->date('expense_date');
            $table->decimal('amount', 15, 2);
            $table->foreignId('location_id')->constrained('locations');
            $table->string('category')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('additional_expenses');
    }
};
