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
            $poQuery->where('location_id', $locationId);
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
            ->select('suppliers.supplier_name as name', DB::raw('SUM(grand_total) as value'))
            ->groupBy('suppliers.supplier_name')
            ->orderByDesc('value')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'purchaseStats' => $purchaseStats,
            'salesStats' => $salesStats,
            'supplierData' => $supplierPurchases,
            'locations' => Location::all(),
            'filters' => $request->only(['location_id', 'date_from', 'date_to'])
        ]);
    }
}
