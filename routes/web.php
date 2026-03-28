<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('b2b-dashboard', 'b2b-dashboard')->name('b2b-dashboard');

    // General Configuration
    Route::resource('config/customer-master', \App\Http\Controllers\CustomerController::class);

    // User Configuration
    Route::resource('config/user-master', \App\Http\Controllers\UserController::class);

    // Invoice Configuration
    Route::resource('invoice/custom-field-group', \App\Http\Controllers\CustomFieldGroupController::class);
    Route::get('invoice/template-master', [\App\Http\Controllers\SettingController::class, 'templateMaster'])->name('invoice.template-master');
    Route::post('invoice/template-master', [\App\Http\Controllers\SettingController::class, 'saveTemplate'])->name('invoice.template-master.save');

    // Purchase Management
    Route::get('purchase/generate-po', [\App\Http\Controllers\PurchaseOrderController::class, 'create'])->name('purchase.generate-po');
    Route::post('purchase/generate-po', [\App\Http\Controllers\PurchaseOrderController::class, 'store'])->name('purchase.generate-po.store');
    Route::inertia('purchase/summary', 'Purchase/Summary')->name('purchase.summary');
    Route::get('purchase/approved-po', [\App\Http\Controllers\PurchaseOrderController::class, 'approvedPOs'])->name('purchase.approved-po');
    Route::inertia('purchase/send-po', 'Purchase/SendPO')->name('purchase.send-po');
    Route::inertia('purchase/received-po', 'Purchase/ReceivedPO')->name('purchase.received-po');
    Route::get('purchase/debit-note', [\App\Http\Controllers\DebitNoteController::class, 'index'])->name('purchase.debit-note.index');
    Route::post('purchase/debit-note', [\App\Http\Controllers\DebitNoteController::class, 'store'])->name('purchase.debit-note.store');
    Route::inertia('purchase/payment-entry', 'Purchase/PaymentEntry')->name('purchase.payment-entry');

    // Sales Management
    Route::inertia('sales/generate-invoice', 'Sales/GenerateInvoice')->name('sales.generate-invoice');
    Route::inertia('sales/order-management', 'Sales/OrderManagement')->name('sales.order-management');
    Route::inertia('sales/approved-invoice', 'Sales/ApprovedInvoice')->name('sales.approved-invoice');
    Route::inertia('sales/send-invoice', 'Sales/SendInvoice')->name('sales.send-invoice');
    Route::inertia('sales/credit-note', 'Sales/CreditNote')->name('sales.credit-note');
    Route::inertia('sales/payment-entry', 'Sales/PaymentEntry')->name('sales.payment-entry');

    // Operations
    Route::inertia('operations/production', 'Operations/Production')->name('operations.production');
    Route::inertia('operations/recipe', 'Operations/Recipe')->name('operations.recipe');
    Route::inertia('operations/stock-management', 'Operations/StockManagement')->name('operations.stock-management');
    Route::inertia('operations/payment-management', 'Operations/PaymentManagement')->name('operations.payment-management');
    Route::inertia('operations/kitchen-register', 'Operations/KitchenRegister')->name('operations.kitchen-register');

    // Reports
    Route::inertia('reports/purchase', 'Reports/PurchaseReport')->name('reports.purchase');
    Route::inertia('reports/stock', 'Reports/StockReport')->name('reports.stock');

    // Legacy/Master Routes
    Route::resource('master/supplier-master', \App\Http\Controllers\SupplierController::class);
    Route::resource('master/location-master', \App\Http\Controllers\LocationController::class);
    Route::post('master/item-master/import', [\App\Http\Controllers\ItemController::class, 'import'])->name('master.item-master.import');
    Route::resource('master/item-master', \App\Http\Controllers\ItemController::class);
});

require __DIR__ . '/settings.php';
