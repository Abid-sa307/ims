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
use App\Models\CustomerPayment;
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
            $query->where('po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('po_date', '<=', $request->date_to);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        $reportData = $query->paginate(15);

        return Inertia::render('Reports/Purchase/OrderSummary', [
            'reportData' => $reportData,
            'locations' => Location::where('location_type', 'HQ')->select('id', 'location_legal_name')->get(),
            'suppliers' => \App\Models\Supplier::select('id', 'supplier_name')->get(),
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
            $query->where('purchase_orders.po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('purchase_orders.po_date', '<=', $request->date_to);
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
            $query->where('purchase_order_items.item_id', $request->item_id);
        }
        if ($request->filled('date_from')) {
            $query->where('purchase_orders.po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('purchase_orders.po_date', '<=', $request->date_to);
        }
        if ($request->filled('supplier_id')) {
            $query->where('purchase_orders.supplier_id', $request->supplier_id);
        }

        return Inertia::render('Reports/Purchase/ItemWiseReport', [
            'reportData' => $query->paginate(15),
            'items' => Item::select('id', 'item_name')->get(),
            'suppliers' => \App\Models\Supplier::select('id', 'supplier_name')->get(),
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
        $query = DB::table('purchase_order_items')
            ->join('items', 'purchase_order_items.item_id', '=', 'items.id')
            ->join('purchase_orders', 'purchase_order_items.purchase_order_id', '=', 'purchase_orders.id')
            ->select(
                'items.item_name',
                DB::raw('MIN(purchase_order_items.current_price) as min_price'),
                DB::raw('MAX(purchase_order_items.current_price) as max_price'),
                DB::raw('AVG(purchase_order_items.current_price) as avg_price'),
                DB::raw('COUNT(*) as purchase_count')
            )
            ->groupBy('items.id', 'items.item_name');

        if ($request->filled('date_from')) {
            $query->where('purchase_orders.po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('purchase_orders.po_date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Purchase/PriceDeviation', [
            'reportData' => $query->get(),
            'filters' => $request->all(),
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
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        return Inertia::render('Reports/Sales/SalesSummary', [
            'reportData' => $query->paginate(15),
            'customers' => Customer::select('id', 'customer_name')->get(),
            'locations' => Location::where('location_type', '!=', 'Customer')->select('id', 'location_legal_name')->get(),
            'filters' => $request->all(),
        ]);
    }

    public function itemWiseSales(Request $request)
    {
        $query = SalesInvoiceItem::with(['item', 'invoice.customer'])
            ->join('sales_invoices', 'sales_invoice_items.sales_invoice_id', '=', 'sales_invoices.id');

        if ($request->filled('item_id')) {
            $query->where('sales_invoice_items.item_id', $request->item_id);
        }
        if ($request->filled('date_from')) {
            $query->where('sales_invoices.invoice_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('sales_invoices.invoice_date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Sales/ItemWiseSales', [
            'reportData' => $query->paginate(15),
            'items' => Item::select('id', 'item_name')->get(),
            'filters' => $request->all(),
        ]);
    }

    public function customerWiseSales(Request $request)
    {
        $query = SalesInvoice::with(['customer', 'location']);

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('date_from')) {
            $query->where('invoice_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('invoice_date', '<=', $request->date_to);
        }

        return Inertia::render('Reports/Sales/CustomerWiseSales', [
            'reportData' => $query->paginate(15),
            'customers' => Customer::select('id', 'customer_name')->get(),
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

    public function salesLedger(Request $request)
    {
        $customerId = $request->customer_id;
        
        $invoices = SalesInvoice::where('customer_id', $customerId)
            ->select('id', 'invoice_number as reference', 'invoice_date as date', 'grand_total as amount', DB::raw("'Invoice' as type"))
            ->get();
            
        $payments = CustomerPayment::where('customer_id', $customerId)
            ->select('id', 'payment_number as reference', 'payment_date as date', 'amount', DB::raw("'Payment' as type"))
            ->get();
            
        $creditNotes = CreditNote::where('customer_id', $customerId)
            ->select('id', 'credit_note_number as reference', 'date', 'grand_total as amount', DB::raw("'Credit Note' as type"))
            ->get();

        $ledger = $invoices->concat($payments)->concat($creditNotes)->sortBy('date')->values();

        return Inertia::render('Reports/Sales/SalesLedger', [
            'reportData' => $ledger,
            'customers' => Customer::all(),
            'filters' => $request->all(),
        ]);
    }

    public function outstandingSales(Request $request)
    {
        // This report typically calculates (Total Invoiced - Total Paid - Total Credits) per customer
        $reportData = Customer::select('customers.id', 'customers.customer_name')
            ->leftJoin('sales_invoices', 'customers.id', '=', 'sales_invoices.customer_id')
            ->leftJoin('customer_payments', 'customers.id', '=', 'customer_payments.customer_id')
            ->leftJoin('credit_notes', 'customers.id', '=', 'credit_notes.customer_id')
            ->select(
                'customers.customer_name',
                DB::raw('SUM(DISTINCT sales_invoices.grand_total) as total_invoiced'),
                DB::raw('SUM(DISTINCT customer_payments.amount) as total_paid'),
                DB::raw('SUM(DISTINCT credit_notes.grand_total) as total_credits'),
                DB::raw('IFNULL(SUM(DISTINCT sales_invoices.grand_total), 0) - IFNULL(SUM(DISTINCT customer_payments.amount), 0) - IFNULL(SUM(DISTINCT credit_notes.grand_total), 0) as outstanding_balance')
            )
            ->groupBy('customers.id', 'customers.customer_name')
            ->having('outstanding_balance', '>', 0)
            ->get();

        return Inertia::render('Reports/Sales/OutstandingSales', [
            'reportData' => $reportData,
        ]);
    }

    // --- Stock Reports ---

    public function stockListing(Request $request)
    {
        $query = ItemWarehouseMapping::with(['item', 'location', 'warehouse'])
            ->join('items', 'item_warehouse_mappings.item_id', '=', 'items.id');

        if ($request->filled('location_id')) {
            $query->where('item_warehouse_mappings.location_id', $request->location_id);
        }
        if ($request->filled('warehouse_id')) {
            $query->where('item_warehouse_mappings.warehouse_id', $request->warehouse_id);
        }
        if ($request->filled('item_category_id')) {
            $query->where('item_warehouse_mappings.item_category_id', $request->item_category_id);
        }

        $stockData = $query->select('item_warehouse_mappings.*')->get();

        return Inertia::render('Reports/Stock/StockListing', [
            'stockData' => $stockData,
            'locations' => Location::where('location_type', '!=', 'Customer')->select('id', 'location_legal_name')->get(),
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'categories' => ItemCategory::all(),
            'filters' => $request->all(),
        ]);
    }

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
            'locations' => Location::where('location_type', '!=', 'Customer')->get(),
            'filters' => $request->all(),
        ]);
    }

    // --- New Reports Added ---

    public function newSupplierPaymentReport(Request $request)
    {
        $query = \App\Models\SupplierPayment::with('supplier')->latest('payment_date');
        
        if ($request->filled('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }
        
        $payments = $query->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->supplier?->supplier_name ?? '—',
                'description' => $p->notes ?? '',
                'date' => \Carbon\Carbon::parse($p->payment_date)->format('d-m-Y h:i:s A'),
                'created_by' => 'Admin',
                'payment_mode' => $p->payment_method,
                'credit_amount' => (float)$p->amount,
            ];
        });

        return Inertia::render('Reports/SupplierPaymentReport', [
            'reportData' => $payments,
            'suppliers' => \App\Models\Supplier::select('supplier_name')->distinct()->pluck('supplier_name'),
            'filters' => $request->all(),
        ]);
    }

    public function newSupplierPaymentEntry(Request $request)
    {
        $lastTen = \App\Models\SupplierPayment::with('supplier')->latest()->take(10)->get()->map(function ($p, $i) {
            return [
                'sr' => $i + 1,
                'supplier_name' => $p->supplier?->supplier_name ?? '—',
                'payment_type' => $p->payment_method,
                'amount' => (float)$p->amount,
                'created_by' => 'Admin',
                'created_date' => \Carbon\Carbon::parse($p->created_at)->format('d-m-Y h:i A'),
            ];
        });

        return Inertia::render('Reports/SupplierPaymentEntry', [
            'lastTen' => $lastTen,
            'suppliers' => \App\Models\Supplier::select('id', 'supplier_name')->get(),
        ]);
    }

    public function storeNewSupplierPayment(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'payment_type' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
        ]);

        \App\Models\SupplierPayment::create([
            'payment_number'    => 'PAY-' . date('Ymd') . '-' . str_pad(\App\Models\SupplierPayment::count() + 1, 4, '0', STR_PAD_LEFT),
            'payment_date'      => now(),
            'supplier_id'       => $validated['supplier_id'],
            'amount'            => $validated['amount'],
            'payment_method'    => $validated['payment_type'],
            'notes'             => $validated['description'] ?? null,
            'status'            => 'completed',
        ]);

        return redirect()->route('reports.new.supplier-payment-entry')->with('success', 'Payment recorded successfully.');
    }

    public function newPriceDeviation(Request $request)
    {
        // Get all items that have purchase orders, with min/max price
        $items = DB::table('purchase_order_items')
            ->join('items', 'purchase_order_items.item_id', '=', 'items.id')
            ->join('purchase_orders', 'purchase_order_items.purchase_order_id', '=', 'purchase_orders.id')
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->select(
                'items.id as item_id',
                'items.item_name',
                'suppliers.supplier_name',
                DB::raw('MIN(purchase_order_items.current_price) as min_price'),
                DB::raw('MAX(purchase_order_items.current_price) as max_price')
            );
            
        if ($request->filled('supplier_name') && $request->supplier_name != '1 Selected') {
            $items->where('suppliers.supplier_name', $request->supplier_name);
        }
            
        $items = $items->groupBy('items.id', 'items.item_name', 'suppliers.supplier_name')->get();

        $poHistory = DB::table('purchase_order_items')
            ->join('purchase_orders', 'purchase_order_items.purchase_order_id', '=', 'purchase_orders.id')
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->select(
                'purchase_order_items.item_id',
                'suppliers.supplier_name',
                'purchase_orders.po_date',
                'purchase_orders.order_number',
                'purchase_order_items.qty',
                'purchase_order_items.current_price'
            )
            ->orderBy('purchase_orders.po_date', 'desc')
            ->get()
            ->groupBy('item_id');

        $reportData = $items->map(function ($item, $index) use ($poHistory) {
            $history = isset($poHistory[$item->item_id]) ? $poHistory[$item->item_id] : collect([]);
            return [
                'id' => $index + 1,
                'supplier' => $item->supplier_name,
                'product' => $item->item_name,
                'min_price' => (float)$item->min_price,
                'max_price' => (float)$item->max_price,
                'po_history' => $history->map(function ($po, $i) {
                    return [
                        'no' => $i + 1,
                        'supplier' => $po->supplier_name,
                        'po_date' => \Carbon\Carbon::parse($po->po_date)->format('d-M-Y'),
                        'order_number' => $po->order_number,
                        'qty' => (float)$po->qty,
                        'price' => (float)$po->current_price,
                    ];
                })->values()
            ];
        });

        return Inertia::render('Reports/PriceDeviationReport', [
            'reportData' => $reportData,
            'filters' => $request->all(),
            'suppliers' => \App\Models\Supplier::select('supplier_name')->distinct()->pluck('supplier_name'),
        ]);
    }

    public function newCreditorsReport(Request $request)
    {
        $query = \App\Models\Supplier::select('id', 'supplier_name');
        
        if ($request->filled('creditorFilter')) {
            $query->where('supplier_name', $request->creditorFilter);
        }
        
        $reportData = $query->get()
            ->map(function ($s) {
                // simple calc: total POs - total Payments
                $totalPo = \App\Models\PurchaseOrder::where('supplier_id', $s->id)->sum('grand_total');
                $totalPaid = \App\Models\SupplierPayment::where('supplier_id', $s->id)->sum('amount');
                return [
                    'id' => $s->id,
                    'creditor' => $s->supplier_name,
                    'amount' => (float)($totalPo - $totalPaid)
                ];
            })->filter(function ($r) {
                return $r['amount'] > 0;
            })->values();

        return Inertia::render('Reports/CreditorsReport', [
            'reportData' => $reportData,
            'creditors' => \App\Models\Supplier::select('supplier_name')->distinct()->pluck('supplier_name'),
            'filters' => $request->all(),
        ]);
    }

    public function newSupplierAccount(Request $request)
    {
        $supplierQuery = \App\Models\Supplier::query();
        if ($request->filled('accountFilter')) {
            $supplierQuery->where('supplier_name', $request->accountFilter);
        }
        
        $suppliers = $supplierQuery->get();
        $allTransactions = collect([]);

        foreach ($suppliers as $s) {
            $pos = \App\Models\PurchaseOrder::where('supplier_id', $s->id)
                ->select('id', 'po_date as date', 'order_number as ref', 'grand_total as amount', DB::raw("'PO' as type"))
                ->get();
                
            $payments = \App\Models\SupplierPayment::where('supplier_id', $s->id)
                ->select('id', 'payment_date as date', 'payment_number as ref', 'amount', DB::raw("'Payment' as type"))
                ->get();

            $transactions = $pos->concat($payments)->sortBy('date')->values();
            
            $balance = 0;
            foreach ($transactions as $t) {
                if ($t->type === 'PO') {
                    $credit = 0;
                    $debit = (float)$t->amount;
                    $balance += $debit;
                } else {
                    $credit = (float)$t->amount;
                    $debit = 0;
                    $balance -= $credit; // paying reduces balance
                }
                
                $allTransactions->push([
                    'id' => $t->id . '-' . $t->type,
                    'date' => \Carbon\Carbon::parse($t->date)->format('d-m-Y h:i:s A'),
                    'supplier_name' => $s->supplier_name,
                    'description' => $t->ref,
                    'created_by' => 'Admin',
                    'credit' => $credit,
                    'debit' => $debit,
                    'balance' => $balance,
                    'real_date' => $t->date // for final sorting if needed
                ]);
            }
        }
        
        $allTransactions = $allTransactions->sortBy('real_date')->values()->map(function($t, $i) {
            $t['id'] = $i + 1;
            unset($t['real_date']);
            return $t;
        });

        return Inertia::render('Reports/SupplierAccountReport', [
            'reportData' => $allTransactions,
            'suppliers' => \App\Models\Supplier::select('supplier_name')->distinct()->pluck('supplier_name'),
            'filters' => $request->all(),
        ]);
    }
}
