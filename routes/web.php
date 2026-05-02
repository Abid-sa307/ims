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
    Route::resource('config/tax-profiles', \App\Http\Controllers\TaxProfileController::class);

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
    Route::get('purchase/orders/{purchaseOrder}/edit', [\App\Http\Controllers\PurchaseOrderController::class, 'edit'])->name('purchase.orders.edit');
    Route::put('purchase/orders/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'update'])->name('purchase.orders.update');
    Route::delete('purchase/orders/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'destroy'])->name('purchase.orders.destroy');
    Route::get('purchase/orders/{purchaseOrder}/review', [\App\Http\Controllers\PurchaseOrderController::class, 'reviewOrder'])->name('purchase.orders.review');
    Route::post('purchase/reject-po/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'reject'])->name('purchase.reject-po');
    Route::get('purchase/orders/{purchaseOrder}/print', [\App\Http\Controllers\PurchaseOrderPrintController::class, 'print'])->name('purchase.orders.print');
    Route::get('purchase/summary', [\App\Http\Controllers\PurchaseOrderController::class, 'summary'])->name('purchase.summary');
    Route::get('purchase/approved-po', [\App\Http\Controllers\PurchaseOrderController::class, 'approvedPOs'])->name('purchase.approved-po');
    Route::post('purchase/approve-po/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'approve'])->name('purchase.approve-po');
    Route::get('purchase/send-po', [\App\Http\Controllers\PurchaseOrderController::class, 'sendPOs'])->name('purchase.send-po');
    Route::get('purchase/orders/{purchaseOrder}/transmit', [\App\Http\Controllers\PurchaseOrderController::class, 'transmitOrder'])->name('purchase.orders.transmit');
    Route::post('purchase/send-po/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'send'])->name('purchase.send-po.submit');
    Route::get('purchase/auto-approved-po', [\App\Http\Controllers\PurchaseOrderController::class, 'autoApprovedPOs'])->name('purchase.auto-approved-po');
    Route::get('purchase/received-po', [\App\Http\Controllers\PurchaseOrderController::class, 'receivedPOs'])->name('purchase.received-po');
    Route::get('purchase/receive-order/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'receiveOrder'])->name('purchase.receive-order.view');
    Route::post('purchase/receive-order/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'processReceive'])->name('purchase.receive-order.store');
    Route::post('purchase/finalize-receive/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'finalizeReceive'])->name('purchase.finalize-receive');
    Route::post('purchase/receive-po/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'receive'])->name('purchase.receive-po');
    Route::get('purchase/debit-note', [\App\Http\Controllers\DebitNoteController::class, 'index'])->name('purchase.debit-note.index');
    Route::get('purchase/generate-debit-note', [\App\Http\Controllers\DebitNoteController::class, 'create'])->name('purchase.debit-note.create');
    Route::post('purchase/generate-debit-note', [\App\Http\Controllers\DebitNoteController::class, 'store'])->name('purchase.debit-note.store');
    Route::get('purchase/payment-entry', [\App\Http\Controllers\PaymentController::class, 'supplierPayments'])->name('purchase.payment-entry');
    Route::post('purchase/payment-entry', [\App\Http\Controllers\PaymentController::class, 'storeSupplierPayment'])->name('purchase.payment-entry.store');
    Route::delete('purchase/payment-entry/{payment}', [\App\Http\Controllers\PaymentController::class, 'deleteSupplierPayment'])->name('purchase.payment-entry.destroy');

    // Sales Management
    Route::get('sales/generate-invoice', [\App\Http\Controllers\SalesController::class, 'generateInvoice'])->name('sales.generate-invoice');
    Route::post('sales/generate-invoice', [\App\Http\Controllers\SalesController::class, 'storeInvoice'])->name('sales.generate-invoice.store');
    Route::get('sales/order-management', [\App\Http\Controllers\SalesController::class, 'orderManagement'])->name('sales.order-management');
    Route::get('sales/approved-invoice', [\App\Http\Controllers\SalesController::class, 'approvedInvoice'])->name('sales.approved-invoice');
    Route::get('sales/invoices/{invoice}/print', [\App\Http\Controllers\SalesInvoicePrintController::class, 'print'])->name('sales.invoices.print');
    Route::get('sales/approve-invoice/{invoice}', [\App\Http\Controllers\SalesController::class, 'showApproveInvoice'])->name('sales.approve-invoice.show');
    Route::post('sales/approve-invoice/{invoice}', [\App\Http\Controllers\SalesController::class, 'approveInvoice'])->name('sales.approve-invoice');
    Route::post('sales/reject-invoice/{invoice}', [\App\Http\Controllers\SalesController::class, 'rejectInvoice'])->name('sales.reject-invoice');
    Route::get('sales/send-invoice', [\App\Http\Controllers\SalesController::class, 'sendInvoice'])->name('sales.send-invoice');
    Route::post('sales/send-invoice/{invoice}', [\App\Http\Controllers\SalesController::class, 'processSendInvoice'])->name('sales.send-invoice.process');
    Route::get('sales/credit-note', [\App\Http\Controllers\CreditNoteController::class, 'index'])->name('sales.credit-note');
    Route::get('sales/credit-note/create', [\App\Http\Controllers\CreditNoteController::class, 'create'])->name('sales.credit-note.create');
    Route::post('sales/credit-note', [\App\Http\Controllers\CreditNoteController::class, 'store'])->name('sales.credit-note.store');
    Route::get('sales/payment-entry', [\App\Http\Controllers\PaymentController::class, 'customerPayments'])->name('sales.payment-entry');
    Route::post('sales/payment-entry', [\App\Http\Controllers\PaymentController::class, 'storeCustomerPayment'])->name('sales.payment-entry.store');
    Route::delete('sales/payment-entry/{payment}', [\App\Http\Controllers\PaymentController::class, 'deleteCustomerPayment'])->name('sales.payment-entry.destroy');

    // Operations
    Route::inertia('operations/production', 'Operations/Production')->name('operations.production');
    Route::inertia('operations/production-planning', 'Operations/ProductionPlanning')->name('operations.production-planning');
    Route::inertia('operations/production-entry', 'Operations/ProductionEntry')->name('operations.production-entry');
    Route::inertia('operations/multiple-manufacturing', 'Operations/MultipleManufacturing')->name('operations.multiple-manufacturing');
    Route::inertia('operations/recipe', 'Operations/Recipe')->name('operations.recipe');
    Route::get('stock/current-stock', [\App\Http\Controllers\StockController::class, 'currentStock'])->name('stock.current-stock');
    Route::get('stock/wastage-entry', [\App\Http\Controllers\StockController::class, 'wastageEntry'])->name('stock.wastage-entry');
    Route::post('stock/wastage-entry', [\App\Http\Controllers\StockController::class, 'storeWastageEntry'])->name('stock.wastage-entry.store');
    Route::get('stock/missing-entry', [\App\Http\Controllers\StockController::class, 'missingEntry'])->name('stock.missing-entry');
    Route::post('stock/missing-entry', [\App\Http\Controllers\StockController::class, 'storeMissingEntry'])->name('stock.missing-entry.store');
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
    Route::get('operations/payment-details', [\App\Http\Controllers\PaymentController::class, 'paymentDetails'])->name('operations.payment-details');
    Route::get('operations/bulk-payment', [\App\Http\Controllers\PaymentController::class, 'bulkPayment'])->name('operations.bulk-payment');
    Route::post('operations/bulk-payment', [\App\Http\Controllers\PaymentController::class, 'storeBulkPayment'])->name('operations.bulk-payment.store');
    Route::get('operations/payment-transaction-report', [\App\Http\Controllers\PaymentController::class, 'paymentTransactionReport'])->name('operations.payment-transaction-report');

    Route::resource('operations/additional-expenses', \App\Http\Controllers\AdditionalExpenseController::class)->names('operations.additional-expenses');

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
        Route::get('new/supplier-payment', [\App\Http\Controllers\ReportController::class, 'newSupplierPaymentReport'])->name('reports.new.supplier-payment');
        Route::get('new/supplier-payment-entry', [\App\Http\Controllers\ReportController::class, 'newSupplierPaymentEntry'])->name('reports.new.supplier-payment-entry');
        Route::post('new/supplier-payment-entry', [\App\Http\Controllers\ReportController::class, 'storeNewSupplierPayment'])->name('reports.new.supplier-payment-entry.store');
        Route::get('new/price-deviation', [\App\Http\Controllers\ReportController::class, 'newPriceDeviation'])->name('reports.new.price-deviation');
        Route::get('new/creditors-report', [\App\Http\Controllers\ReportController::class, 'newCreditorsReport'])->name('reports.new.creditors-report');
        Route::get('new/supplier-account', [\App\Http\Controllers\ReportController::class, 'newSupplierAccount'])->name('reports.new.supplier-account');

        // Redirect legacy routes
        Route::get('purchase', function() { return redirect()->route('reports.purchase.order-summary'); });
        Route::get('stock', function() { return redirect()->route('reports.stock.valuation'); });
    });

    // Legacy/Master Routes
    Route::resource('master/supplier-master', \App\Http\Controllers\SupplierController::class);
    Route::resource('master/location-master', \App\Http\Controllers\LocationController::class);
    Route::resource('master/project-master', \App\Http\Controllers\ProjectController::class);
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
