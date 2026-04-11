<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use App\Models\Item;
use App\Models\Location;
use App\Models\Warehouse;
use App\Models\ItemCategory;
use App\Models\ItemWarehouseMapping;
use App\Models\DebitNote;
use App\Models\CreditNote;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // --- Purchase Reports ---

    public function purchaseOrderSummary(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'location']);

        if ($request->filled('date_from')) {
            $query->where('order_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('order_date', '<=', $request->date_to);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        $reportData = $query->paginate(15);

        return Inertia::render('Reports/Purchase/OrderSummary', [
            'reportData' => $reportData,
            'locations' => Location::all(),
            'filters' => $request->all(),
        ]);
    }

    public function purchaseHsnSummary(Request $request)
    {
        $query = PurchaseOrderItem::query()
            ->join('items', 'purchase_order_items.item_id', '=', 'items.id')
            ->join('purchase_orders', 'purchase_order_items.purchase_order_id', '=', 'purchase_orders.id')
            ->select(
                'items.hsn_code',
                DB::raw('SUM(purchase_order_items.taxable_amount) as total_taxable'),
                DB::raw('SUM(purchase_order_items.tax_amount) as total_tax'),
                DB::raw('SUM(purchase_order_items.total_amount) as total_amount')
            )
            ->groupBy('items.hsn_code');

        if ($request->filled('date_from')) {
            $query->where('purchase_orders.order_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('purchase_orders.order_date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Purchase/HSNSummary', [
            'reportData' => $query->get(),
            'filters' => $request->all(),
        ]);
    }

    public function itemWisePurchase(Request $request)
    {
        $query = PurchaseOrderItem::with(['item', 'purchaseOrder.supplier'])
            ->join('purchase_orders', 'purchase_order_items.purchase_order_id', '=', 'purchase_orders.id');

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->item_id);
        }

        return Inertia::render('Reports/Purchase/ItemWiseReport', [
            'reportData' => $query->paginate(15),
            'items' => Item::all(),
            'filters' => $request->all(),
        ]);
    }

    public function debitNoteRegister(Request $request)
    {
        $query = DebitNote::with(['supplier', 'location']);

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Purchase/DebitNoteRegister', [
            'reportData' => $query->paginate(15),
            'filters' => $request->all(),
        ]);
    }

    public function priceDeviation(Request $request)
    {
        // This report typically compares purchase prices of items over time
        $reportData = DB::table('purchase_order_items')
            ->join('items', 'purchase_order_items.item_id', '=', 'items.id')
            ->select(
                'items.item_name',
                DB::raw('MIN(unit_price) as min_price'),
                DB::raw('MAX(unit_price) as max_price'),
                DB::raw('AVG(unit_price) as avg_price'),
                DB::raw('COUNT(*) as purchase_count')
            )
            ->groupBy('items.id', 'items.item_name')
            ->get();

        return Inertia::render('Reports/Purchase/PriceDeviation', [
            'reportData' => $reportData,
        ]);
    }

    // --- Sales Reports ---

    public function salesSummary(Request $request)
    {
        $query = SalesInvoice::with(['customer', 'location']);

        if ($request->filled('date_from')) {
            $query->where('invoice_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('invoice_date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Sales/SalesSummary', [
            'reportData' => $query->paginate(15),
            'filters' => $request->all(),
        ]);
    }

    public function itemWiseSales(Request $request)
    {
        $query = SalesInvoiceItem::with(['item', 'invoice.customer'])
            ->join('sales_invoices', 'sales_invoice_items.sales_invoice_id', '=', 'sales_invoices.id');

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->item_id);
        }

        return Inertia::render('Reports/Sales/ItemWiseSales', [
            'reportData' => $query->paginate(15),
            'items' => Item::all(),
            'filters' => $request->all(),
        ]);
    }

    public function customerWiseSales(Request $request)
    {
        $query = SalesInvoice::with(['customer', 'location']);

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        return Inertia::render('Reports/Sales/CustomerWiseSales', [
            'reportData' => $query->paginate(15),
            'customers' => Customer::all(),
            'filters' => $request->all(),
        ]);
    }

    public function dateWiseSales(Request $request)
    {
        $query = SalesInvoice::query()
            ->select(
                DB::raw('DATE(invoice_date) as date'),
                DB::raw('COUNT(*) as invoice_count'),
                DB::raw('SUM(grand_total) as total_revenue')
            )
            ->groupBy('date')
            ->orderBy('date', 'desc');

        if ($request->filled('date_from')) {
            $query->where('invoice_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('invoice_date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Sales/DateWiseSales', [
            'reportData' => $query->get(),
            'filters' => $request->all(),
        ]);
    }

    public function creditNoteRegister(Request $request)
    {
        $query = CreditNote::with(['customer', 'location']);

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Sales/CreditNoteRegister', [
            'reportData' => $query->paginate(15),
            'filters' => $request->all(),
        ]);
    }

    public function priceDeviationSales(Request $request)
    {
        $reportData = DB::table('sales_invoice_items')
            ->join('items', 'sales_invoice_items.item_id', '=', 'items.id')
            ->select(
                'items.item_name',
                DB::raw('MIN(unit_price) as min_price'),
                DB::raw('MAX(unit_price) as max_price'),
                DB::raw('AVG(unit_price) as avg_price'),
                DB::raw('COUNT(*) as sales_count')
            )
            ->groupBy('items.id', 'items.item_name')
            ->get();

        return Inertia::render('Reports/Sales/PriceDeviation', [
            'reportData' => $reportData,
        ]);
    }

    // --- Stock Reports ---

    public function stockValuation(Request $request)
    {
        $query = ItemWarehouseMapping::with(['item', 'location', 'warehouse'])
            ->join('items', 'item_warehouse_mappings.item_id', '=', 'items.id')
            ->select(
                'item_warehouse_mappings.*',
                DB::raw('current_quantity * items.standard_purchase_price as stock_value')
            );

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        return Inertia::render('Reports/Stock/StockValuation', [
            'reportData' => $query->get(),
            'locations' => Location::all(),
            'filters' => $request->all(),
        ]);
    }
}
