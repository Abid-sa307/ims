<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'dashboard'])->name('dashboard');
    // Remove individual b2b-dashboard as it's now the main dashboard


    // General Configuration
    // Removed customer-master resource as it's consolidated into location-master

    // Tax Configuration
    Route::resource('config/tax-master', \App\Http\Controllers\TaxController::class);

    // User Configuration
    Route::resource('config/user-master', \App\Http\Controllers\UserController::class);

    // Invoice Configuration
    Route::resource('invoice/custom-field-group', \App\Http\Controllers\CustomFieldGroupController::class);
    Route::get('invoice/template-master', [\App\Http\Controllers\SettingController::class, 'templateMaster'])->name('invoice.template-master');
    Route::post('invoice/template-master', [\App\Http\Controllers\SettingController::class, 'saveTemplate'])->name('invoice.template-master.save');
    Route::inertia('invoice/invoices-template', 'Invoice/InvoicesTemplate')->name('invoice.invoices-template');

    // Purchase Management
    Route::get('purchase/generate-po', [\App\Http\Controllers\PurchaseOrderController::class, 'create'])->name('purchase.generate-po');
    Route::post('purchase/generate-po', [\App\Http\Controllers\PurchaseOrderController::class, 'store'])->name('purchase.generate-po.store');
    Route::get('purchase/summary', [\App\Http\Controllers\PurchaseOrderController::class, 'summary'])->name('purchase.summary');
    Route::get('purchase/approved-po', [\App\Http\Controllers\PurchaseOrderController::class, 'approvedPOs'])->name('purchase.approved-po');
    Route::post('purchase/approve-po/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'approve'])->name('purchase.approve-po');
    Route::get('purchase/send-po', [\App\Http\Controllers\PurchaseOrderController::class, 'sendPOs'])->name('purchase.send-po');
    Route::post('purchase/send-po/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'send'])->name('purchase.send-po.submit');
    Route::get('purchase/auto-approved-po', [\App\Http\Controllers\PurchaseOrderController::class, 'autoApprovedPOs'])->name('purchase.auto-approved-po');
    Route::get('purchase/received-po', [\App\Http\Controllers\PurchaseOrderController::class, 'receivedPOs'])->name('purchase.received-po');
    Route::post('purchase/receive-po/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'receive'])->name('purchase.receive-po');
    Route::get('purchase/debit-note', [\App\Http\Controllers\DebitNoteController::class, 'index'])->name('purchase.debit-note.index');
    Route::get('purchase/generate-debit-note', [\App\Http\Controllers\DebitNoteController::class, 'create'])->name('purchase.debit-note.create');
    Route::post('purchase/generate-debit-note', [\App\Http\Controllers\DebitNoteController::class, 'store'])->name('purchase.debit-note.store');
    Route::inertia('purchase/payment-entry', 'Purchase/PaymentEntry')->name('purchase.payment-entry');

    // Sales Management
    Route::get('sales/generate-invoice', [\App\Http\Controllers\SalesController::class, 'generateInvoice'])->name('sales.generate-invoice');
    Route::post('sales/generate-invoice', [\App\Http\Controllers\SalesController::class, 'storeInvoice'])->name('sales.generate-invoice.store');
    Route::get('sales/order-management', [\App\Http\Controllers\SalesController::class, 'orderManagement'])->name('sales.order-management');
    Route::get('sales/approved-invoice', [\App\Http\Controllers\SalesController::class, 'approvedInvoice'])->name('sales.approved-invoice');
    Route::post('sales/approve-invoice/{invoice}', [\App\Http\Controllers\SalesController::class, 'approveInvoice'])->name('sales.approve-invoice');
    Route::inertia('sales/send-invoice', 'Sales/SendInvoice')->name('sales.send-invoice');
    Route::inertia('sales/credit-note', 'Sales/CreditNote')->name('sales.credit-note');
    Route::inertia('sales/payment-entry', 'Sales/PaymentEntry')->name('sales.payment-entry');

    // Operations
    Route::inertia('operations/production', 'Operations/Production')->name('operations.production');
    Route::inertia('operations/production-planning', 'Operations/ProductionPlanning')->name('operations.production-planning');
    Route::inertia('operations/production-entry', 'Operations/ProductionEntry')->name('operations.production-entry');
    Route::inertia('operations/multiple-manufacturing', 'Operations/MultipleManufacturing')->name('operations.multiple-manufacturing');
    Route::inertia('operations/recipe', 'Operations/Recipe')->name('operations.recipe');
    Route::get('stock/current-stock', [\App\Http\Controllers\StockController::class, 'currentStock'])->name('stock.current-stock');
    Route::get('stock/wastage-entry', [\App\Http\Controllers\StockController::class, 'wastageEntry'])->name('stock.wastage-entry');
    Route::post('stock/wastage-entry', [\App\Http\Controllers\StockController::class, 'storeWastageEntry'])->name('stock.wastage-entry.store');
    Route::get('stock/stock-transfer', [\App\Http\Controllers\StockController::class, 'stockTransfer'])->name('stock.stock-transfer');
    Route::post('stock/stock-transfer', [\App\Http\Controllers\StockController::class, 'storeStockTransfer'])->name('stock.stock-transfer.store');
    Route::get('stock/transfer-report', [\App\Http\Controllers\StockController::class, 'stockTransferReport'])->name('stock.transfer-report');
    Route::get('stock/adjustment', [\App\Http\Controllers\StockController::class, 'stockAdjustment'])->name('stock.adjustment');
    Route::post('stock/adjustment', [\App\Http\Controllers\StockController::class, 'storeStockAdjustment'])->name('stock.adjustment.store');
    Route::get('stock/physical-frequency', [\App\Http\Controllers\StockController::class, 'physicalStockFrequency'])->name('stock.physical-frequency');
    Route::post('stock/physical-frequency', [\App\Http\Controllers\StockController::class, 'storePhysicalStockFrequency'])->name('stock.physical-frequency.store');
    Route::get('stock/physical-entry', [\App\Http\Controllers\StockController::class, 'physicalStockEntryReport'])->name('stock.physical-entry');
    Route::post('stock/physical-entry', [\App\Http\Controllers\StockController::class, 'storePhysicalStockEntryReport'])->name('stock.physical-entry.store');
    Route::inertia('operations/stock-management', 'Operations/StockManagement')->name('operations.stock-management');
    Route::inertia('operations/payment-management', 'Operations/PaymentManagement')->name('operations.payment-management');
    Route::inertia('operations/payment-details', 'Operations/PaymentDetails')->name('operations.payment-details');
    Route::inertia('operations/bulk-payment', 'Operations/BulkPayment')->name('operations.bulk-payment');
    Route::inertia('operations/payment-transaction-report', 'Operations/PaymentTransactionReport')->name('operations.payment-transaction-report');

    Route::inertia('operations/kitchen-register', 'Operations/KitchenRegister')->name('operations.kitchen-register');

    // Reports
    Route::prefix('reports')->group(function () {
        // Purchase Reports
        Route::get('purchase/order-summary', [\App\Http\Controllers\ReportController::class, 'purchaseOrderSummary'])->name('reports.purchase.order-summary');
        Route::get('purchase/hsn-summary', [\App\Http\Controllers\ReportController::class, 'purchaseHsnSummary'])->name('reports.purchase.hsn-summary');
        Route::get('purchase/item-wise', [\App\Http\Controllers\ReportController::class, 'itemWisePurchase'])->name('reports.purchase.item-wise');
        Route::get('purchase/debit-note-register', [\App\Http\Controllers\ReportController::class, 'debitNoteRegister'])->name('reports.purchase.debit-note-register');
        Route::get('purchase/price-deviation', [\App\Http\Controllers\ReportController::class, 'priceDeviation'])->name('reports.purchase.price-deviation');
        
        // Sales Reports
        Route::get('sales/summary', [\App\Http\Controllers\ReportController::class, 'salesSummary'])->name('reports.sales.summary');
        Route::get('sales/item-wise', [\App\Http\Controllers\ReportController::class, 'itemWiseSales'])->name('reports.sales.item-wise');
        Route::get('sales/customer-wise', [\App\Http\Controllers\ReportController::class, 'customerWiseSales'])->name('reports.sales.customer-wise');
        Route::get('sales/date-wise', [\App\Http\Controllers\ReportController::class, 'dateWiseSales'])->name('reports.sales.date-wise');
        Route::get('sales/credit-note-register', [\App\Http\Controllers\ReportController::class, 'creditNoteRegister'])->name('reports.sales.credit-note-register');
        Route::get('sales/price-deviation', [\App\Http\Controllers\ReportController::class, 'priceDeviationSales'])->name('reports.sales.price-deviation');
        Route::get('sales/ledger', [\App\Http\Controllers\ReportController::class, 'salesLedger'])->name('reports.sales.ledger');
        Route::get('sales/outstanding', [\App\Http\Controllers\ReportController::class, 'outstandingSales'])->name('reports.sales.outstanding');
        
        // Stock Reports
        Route::get('stock/listing', [\App\Http\Controllers\ReportController::class, 'stockListing'])->name('reports.stock.listing');
        Route::get('stock/valuation', [\App\Http\Controllers\ReportController::class, 'stockValuation'])->name('reports.stock.valuation');
        
        // New Reports Added
        Route::inertia('new/supplier-payment', 'Reports/SupplierPaymentReport')->name('reports.new.supplier-payment');
        Route::inertia('new/supplier-payment-entry', 'Reports/SupplierPaymentEntry')->name('reports.new.supplier-payment-entry');
        Route::inertia('new/price-deviation', 'Reports/PriceDeviationReport')->name('reports.new.price-deviation');
        Route::inertia('new/creditors-report', 'Reports/CreditorsReport')->name('reports.new.creditors-report');
        Route::inertia('new/supplier-account', 'Reports/SupplierAccountReport')->name('reports.new.supplier-account');

        // Redirect legacy routes
        Route::get('purchase', function() { return redirect()->route('reports.purchase.order-summary'); });
        Route::get('stock', function() { return redirect()->route('reports.stock.valuation'); });
    });

    // Legacy/Master Routes
    Route::resource('master/supplier-master', \App\Http\Controllers\SupplierController::class);
    Route::resource('master/location-master', \App\Http\Controllers\LocationController::class);
    Route::post('master/item-master/import', [\App\Http\Controllers\ItemController::class, 'import'])->name('master.item-master.import');
    Route::resource('master/item-master', \App\Http\Controllers\ItemController::class);

    // Inventory Management
    Route::prefix('inventory')->group(function () {
        Route::resource('item-categories', App\Http\Controllers\ItemCategoryController::class);
        Route::resource('item-sub-categories', App\Http\Controllers\ItemSubCategoryController::class);
        Route::resource('item-types', App\Http\Controllers\ItemTypeController::class);
        Route::resource('uom-master', App\Http\Controllers\UomController::class);
        Route::resource('warehouse-master', App\Http\Controllers\WarehouseController::class);
        // Stock Source Selection
        Route::get('stock-source-selection', [App\Http\Controllers\StockSourceController::class, 'index'])->name('inventory.stock-source-selection');
        Route::post('stock-source-selection', [App\Http\Controllers\StockSourceController::class, 'store'])->name('inventory.stock-source-selection.store');
        Route::post('stock-source-selection/load', [App\Http\Controllers\StockSourceController::class, 'loadMatrix'])->name('inventory.stock-source-selection.load');

        // Transporter Master
        Route::resource('transporter-master', App\Http\Controllers\TransporterController::class);

        // Price List
        Route::resource('price-lists', App\Http\Controllers\PriceListController::class);

        // Dynamic Options routes
        Route::get('/api/item-categories', [App\Http\Controllers\ItemCategoryController::class, 'apiIndex']);
        Route::resource('item-supplier-mapping', \App\Http\Controllers\ItemSupplierMappingController::class);
        Route::resource('item-warehouse-mapping', \App\Http\Controllers\ItemWarehouseMappingController::class);
    });
});

require __DIR__ . '/settings.php';
