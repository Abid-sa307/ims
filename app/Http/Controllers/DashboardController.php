<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $locationId = $request->input('location_id');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        // Filterable query for Purchase Orders
        $poQuery = PurchaseOrder::query();
        if ($locationId) {
            $poQuery->where('purchase_orders.location_id', $locationId);
        }
        if ($dateFrom) {
            $poQuery->where('po_date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $poQuery->where('po_date', '<=', $dateTo);
        }

        $purchaseStats = [
            [
                'title' => 'Purchase Orders',
                'value' => (string)$poQuery->count(),
                'icon' => 'ShoppingCart',
                'color' => 'from-blue-500 to-indigo-600'
            ],
            [
                'title' => 'Approved Orders',
                'value' => (string)$poQuery->clone()->where('status', 'Approved')->count(),
                'icon' => 'CheckCircle',
                'color' => 'from-pink-500 to-rose-600'
            ],
            [
                'title' => 'Received Orders',
                'value' => (string)$poQuery->clone()->where('status', 'Received')->count(),
                'icon' => 'Package',
                'color' => 'from-amber-400 to-orange-500'
            ],
            [
                'title' => 'Purchase Amount',
                'value' => '₹ ' . number_format($poQuery->sum('grand_total') / 100000, 1) . 'L',
                'icon' => 'ShoppingCart',
                'color' => 'from-blue-600 to-blue-800'
            ],
        ];

        // Placeholder for Sales stats (as models/tables don't exist yet)
        $salesStats = [
            [
                'title' => 'Dispatch Orders',
                'value' => '45',
                'icon' => 'Truck',
                'color' => 'from-orange-400 to-orange-600'
            ],
            [
                'title' => 'Total Sales Amount',
                'value' => '₹ 45.2L',
                'icon' => 'IndianRupee',
                'color' => 'from-rose-400 to-red-500'
            ],
        ];

        // Supplier Wise Purchase Chart Data
        $supplierPurchases = $poQuery->clone()
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->select('suppliers.supplier_name as name', DB::raw('CAST(SUM(grand_total) AS UNSIGNED) as value'))
            ->groupBy('suppliers.supplier_name')
            ->orderByDesc('value')
            ->limit(5)
            ->get();

        // Category Wise Purchase Chart Data
        $categoryPurchases = DB::table('purchase_order_items')
            ->join('purchase_orders', 'purchase_order_items.purchase_order_id', '=', 'purchase_orders.id')
            ->join('items', 'purchase_order_items.item_id', '=', 'items.id')
            ->join('item_categories', 'items.item_category_id', '=', 'item_categories.id')
            ->select('item_categories.name as name', DB::raw('CAST(SUM(purchase_order_items.total_amount) AS UNSIGNED) as value'))
            ->when($locationId, fn($q) => $q->where('purchase_orders.location_id', $locationId))
            ->when($dateFrom, fn($q) => $q->where('purchase_orders.po_date', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->where('purchase_orders.po_date', '<=', $dateTo))
            ->groupBy('item_categories.name')
            ->orderByDesc('value')
            ->limit(5)
            ->get();

        // Creditors List (Suppliers with Balance)
        $creditors = \App\Models\Supplier::join('purchase_orders', 'suppliers.id', '=', 'purchase_orders.supplier_id')
            ->join('locations', 'purchase_orders.location_id', '=', 'locations.id')
            ->selectRaw('suppliers.id, suppliers.supplier_name, locations.location_legal_name, SUM(purchase_orders.grand_total) as total_purchase')
            ->groupBy('suppliers.id', 'suppliers.supplier_name', 'locations.id', 'locations.location_legal_name')
            ->get()
            ->map(function($creditor) {
                $payments = \App\Models\SupplierPayment::where('supplier_id', $creditor->id)->sum('amount');
                $debitNotes = \App\Models\DebitNote::where('supplier_id', $creditor->id)->sum('grand_total');
                $creditor->balance = $creditor->total_purchase - $payments - $debitNotes;
                return $creditor;
            })
            ->filter(fn($c) => $c->balance > 0)
            ->sortByDesc('balance')
            ->values()
            ->take(5);

        // Debtors List (Customers with Balance)
        $debtors = \App\Models\Customer::join('sales_invoices', 'customers.id', '=', 'sales_invoices.customer_id')
            ->join('locations', 'sales_invoices.location_id', '=', 'locations.id')
            ->selectRaw('customers.id, customers.customer_name, locations.location_legal_name, SUM(sales_invoices.grand_total) as total_sales')
            ->groupBy('customers.id', 'customers.customer_name', 'locations.id', 'locations.location_legal_name')
            ->get()
            ->map(function($debtor) {
                $payments = \App\Models\CustomerPayment::where('customer_id', $debtor->id)->sum('amount');
                $creditNotes = \App\Models\CreditNote::where('customer_id', $debtor->id)->sum('grand_total');
                $debtor->balance = $debtor->total_sales - $payments - $creditNotes;
                return $debtor;
            })
            ->filter(fn($d) => $d->balance > 0)
            ->sortByDesc('balance')
            ->values()
            ->take(5);

        return Inertia::render('Dashboard/Index', [
            'purchaseStats' => $purchaseStats,
            'salesStats' => $salesStats,
            'supplierData' => $supplierPurchases,
            'categoryData' => $categoryPurchases,
            'creditors' => $creditors,
            'debtors' => $debtors,
            'locations' => Location::where('location_type', 'HQ')->get(),
            'filters' => $request->only(['location_id', 'date_from', 'date_to'])
        ]);
    }
}
