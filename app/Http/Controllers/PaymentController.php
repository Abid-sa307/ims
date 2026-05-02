<?php

namespace App\Http\Controllers;

use App\Models\CustomerPayment;
use App\Models\SupplierPayment;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Location;
use App\Models\PurchaseOrder;
use App\Models\SalesInvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────────
    // CUSTOMER PAYMENTS (Sales)
    // ──────────────────────────────────────────────────────────────────────────

    public function customerPayments(Request $request)
    {
        $query = CustomerPayment::with(['customer', 'salesInvoice', 'location'])->latest();

        if ($request->filled('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        return Inertia::render('Sales/PaymentEntry', [
            'payments'  => $query->paginate(20)->withQueryString(),
            'customers' => Customer::orderBy('customer_name')->get(['id', 'customer_name']),
            'locations' => Location::where('location_type', '!=', 'Customer')->orderBy('location_legal_name')->get(['id', 'location_legal_name']),
            'invoices'  => SalesInvoice::where('status', 'approved')
                ->with('customer')
                ->orderBy('invoice_number')
                ->get(['id', 'invoice_number', 'customer_id', 'grand_total', 'invoice_date']),
            'filters'   => $request->only(['date_from', 'date_to', 'customer_id', 'location_id']),
            'summary'   => [
                'total_collected' => CustomerPayment::sum('amount'),
                'this_month'      => CustomerPayment::whereMonth('payment_date', now()->month)
                    ->whereYear('payment_date', now()->year)->sum('amount'),
                'total_records'   => CustomerPayment::count(),
            ],
        ]);
    }

    public function storeCustomerPayment(Request $request)
    {
        $validated = $request->validate([
            'payment_date'     => 'required|date',
            'customer_id'      => 'required|exists:customers,id',
            'sales_invoice_id' => 'nullable|exists:sales_invoices,id',
            'location_id'      => 'nullable|exists:locations,id',
            'amount'           => 'required|numeric|min:0.01',
            'payment_method'   => 'required|string',
            'reference_number' => 'nullable|string|max:100',
            'notes'            => 'nullable|string|max:500',
        ]);

        $payment = CustomerPayment::create([
            'payment_number'   => 'RCPT-' . date('Ymd') . '-' . str_pad(CustomerPayment::count() + 1, 4, '0', STR_PAD_LEFT),
            'payment_date'     => $validated['payment_date'],
            'customer_id'      => $validated['customer_id'],
            'sales_invoice_id' => $validated['sales_invoice_id'] ?? null,
            'location_id'      => $validated['location_id'] ?? null,
            'amount'           => $validated['amount'],
            'payment_method'   => $validated['payment_method'],
            'reference_number' => $validated['reference_number'] ?? null,
            'notes'            => $validated['notes'] ?? null,
            'status'           => 'completed',
        ]);

        return redirect()->back()->with('success', 'Customer payment recorded successfully. Receipt #' . $payment->payment_number);
    }

    public function deleteCustomerPayment(CustomerPayment $payment)
    {
        $payment->delete();
        return redirect()->back()->with('success', 'Customer payment deleted successfully.');
    }

    // ──────────────────────────────────────────────────────────────────────────
    // SUPPLIER PAYMENTS (Purchase)
    // ──────────────────────────────────────────────────────────────────────────

    public function supplierPayments(Request $request)
    {
        $query = SupplierPayment::with(['supplier', 'purchaseOrder', 'location'])->latest();

        if ($request->filled('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        return Inertia::render('Purchase/PaymentEntry', [
            'payments'       => $query->paginate(20)->withQueryString(),
            'suppliers'      => Supplier::orderBy('supplier_name')->get(['id', 'supplier_name']),
            'locations'      => Location::where('location_type', '!=', 'Customer')->orderBy('location_legal_name')->get(['id', 'location_legal_name']),
            'purchaseOrders' => PurchaseOrder::whereIn('status', ['received', 'sent', 'approved'])
                ->with('supplier')
                ->orderBy('order_number')
                ->get(['id', 'order_number', 'supplier_id', 'grand_total', 'po_date', 'ref_invoice_no']),
            'filters'        => $request->only(['date_from', 'date_to', 'supplier_id', 'location_id']),
            'summary'        => [
                'total_paid'    => SupplierPayment::sum('amount'),
                'this_month'    => SupplierPayment::whereMonth('payment_date', now()->month)
                    ->whereYear('payment_date', now()->year)->sum('amount'),
                'total_records' => SupplierPayment::count(),
            ],
        ]);
    }

    public function storeSupplierPayment(Request $request)
    {
        $validated = $request->validate([
            'payment_date'      => 'required|date',
            'supplier_id'       => 'required|exists:suppliers,id',
            'purchase_order_id' => 'nullable|exists:purchase_orders,id',
            'location_id'       => 'nullable|exists:locations,id',
            'amount'            => 'required|numeric|min:0.01',
            'payment_method'    => 'required|string',
            'reference_number'  => 'nullable|string|max:100',
            'ref_invoice_no'    => 'nullable|string|max:100',
            'invoice_no'        => 'nullable|string|max:100',
            'notes'             => 'nullable|string|max:500',
        ]);

        $payment = SupplierPayment::create([
            'payment_number'    => 'PAY-' . date('Ymd') . '-' . str_pad(SupplierPayment::count() + 1, 4, '0', STR_PAD_LEFT),
            'payment_date'      => $validated['payment_date'],
            'supplier_id'       => $validated['supplier_id'],
            'purchase_order_id' => $validated['purchase_order_id'] ?? null,
            'location_id'       => $validated['location_id'] ?? null,
            'amount'            => $validated['amount'],
            'payment_method'    => $validated['payment_method'],
            'reference_number'  => $validated['reference_number'] ?? null,
            'ref_invoice_no'    => $validated['ref_invoice_no'] ?? null,
            'invoice_no'        => $validated['invoice_no'] ?? null,
            'notes'             => $validated['notes'] ?? null,
            'status'            => 'completed',
        ]);

        return redirect()->back()->with('success', 'Supplier payment recorded successfully. #' . $payment->payment_number);
    }

    public function deleteSupplierPayment(SupplierPayment $payment)
    {
        $payment->delete();
        return redirect()->back()->with('success', 'Supplier payment deleted successfully.');
    }

    // ──────────────────────────────────────────────────────────────────────────
    // BULK PAYMENT (Operations)
    // ──────────────────────────────────────────────────────────────────────────

    public function bulkPayment(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'location'])
            ->whereIn('status', ['received', 'sent', 'approved'])
            ->latest('po_date');

        if ($request->filled('date_from')) {
            $query->whereDate('po_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('po_date', '<=', $request->date_to);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        $orders = $query->get()->map(function ($po) {
            $paid = SupplierPayment::where('purchase_order_id', $po->id)->sum('amount');
            return [
                'id'            => $po->id,
                'franchise'     => $po->location?->location_legal_name ?? '—',
                'supplier'      => $po->supplier?->supplier_name ?? '—',
                'po_number'     => $po->order_number,
                'ref_invoice_no'=> $po->ref_invoice_no ?? '',
                'invoice_no'    => $po->ref_invoice_no ?? '',
                'date'          => $po->po_date,
                'amount'        => (float) $po->grand_total,
                'paid_amount'   => (float) $paid,
                'balance'       => (float) ($po->grand_total - $paid),
                'location'      => $po->location?->location_legal_name ?? '—',
                'location_id'   => $po->location_id,
                'supplier_id'   => $po->supplier_id,
                'status'        => $po->status,
            ];
        });

        return Inertia::render('Operations/BulkPayment', [
            'orders'    => $orders,
            'suppliers' => Supplier::orderBy('supplier_name')->get(['id', 'supplier_name']),
            'locations' => Location::where('location_type', '!=', 'Customer')->orderBy('location_legal_name')->get(['id', 'location_legal_name']),
            'filters'   => $request->only(['date_from', 'date_to', 'location_id', 'supplier_id']),
        ]);
    }

    public function storeBulkPayment(Request $request)
    {
        $validated = $request->validate([
            'payment_date'       => 'required|date',
            'payment_method'     => 'required|string',
            'reference_number'   => 'nullable|string|max:100',
            'notes'              => 'nullable|string',
            'order_ids'          => 'required|array|min:1',
            'order_ids.*'        => 'exists:purchase_orders,id',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['order_ids'] as $orderId) {
                $po = PurchaseOrder::with('supplier')->findOrFail($orderId);
                $alreadyPaid = SupplierPayment::where('purchase_order_id', $po->id)->sum('amount');
                $balance = $po->grand_total - $alreadyPaid;

                if ($balance > 0) {
                    SupplierPayment::create([
                        'payment_number'    => 'PAY-' . date('Ymd') . '-' . str_pad(SupplierPayment::count() + 1, 4, '0', STR_PAD_LEFT),
                        'payment_date'      => $validated['payment_date'],
                        'supplier_id'       => $po->supplier_id,
                        'purchase_order_id' => $po->id,
                        'location_id'       => $po->location_id,
                        'amount'            => $balance,
                        'payment_method'    => $validated['payment_method'],
                        'reference_number'  => $validated['reference_number'] ?? null,
                        'notes'             => $validated['notes'] ?? null,
                        'status'            => 'completed',
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', count($validated['order_ids']) . ' payment(s) recorded successfully.');
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PAYMENT TRANSACTION REPORT (Operations)
    // ──────────────────────────────────────────────────────────────────────────

    public function paymentTransactionReport(Request $request)
    {
        // Supplier payments query
        $supplierQuery = SupplierPayment::with(['supplier', 'purchaseOrder', 'location'])->latest('payment_date');
        // Customer payments query
        $customerQuery = CustomerPayment::with(['customer', 'salesInvoice', 'location'])->latest('payment_date');

        if ($request->filled('date_from')) {
            $supplierQuery->whereDate('payment_date', '>=', $request->date_from);
            $customerQuery->whereDate('payment_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $supplierQuery->whereDate('payment_date', '<=', $request->date_to);
            $customerQuery->whereDate('payment_date', '<=', $request->date_to);
        }
        if ($request->filled('location_id')) {
            $supplierQuery->where('location_id', $request->location_id);
            $customerQuery->where('location_id', $request->location_id);
        }

        // Merge supplier + customer payments into unified list
        $supplierPayments = $supplierQuery->get()->map(fn($p) => [
            'id'            => 'SP-' . $p->id,
            'payment_by'    => auth()->user()?->name ?? 'Admin',
            'payment_to'    => $p->supplier?->supplier_name ?? '—',
            'po_number'     => $p->purchaseOrder?->order_number ?? '—',
            'ref_invoice_no'=> $p->ref_invoice_no ?? '',
            'invoice_no'    => $p->invoice_no ?? '',
            'payment_date'  => $p->payment_date,
            'payment_mode'  => $p->payment_method,
            'paid_amount'   => (float) $p->amount,
            'remarks'       => $p->notes ?? '',
            'location'      => $p->location?->location_legal_name ?? '—',
            'payment_type'  => 'Supplier',
            'payment_number'=> $p->payment_number,
            'supplier'      => $p->supplier?->supplier_name ?? '—',
        ]);

        $customerPayments = $customerQuery->get()->map(fn($p) => [
            'id'            => 'CP-' . $p->id,
            'payment_by'    => $p->customer?->customer_name ?? '—',
            'payment_to'    => 'Company',
            'po_number'     => $p->salesInvoice?->invoice_number ?? '—',
            'ref_invoice_no'=> $p->salesInvoice?->invoice_number ?? '',
            'invoice_no'    => $p->salesInvoice?->invoice_number ?? '',
            'payment_date'  => $p->payment_date,
            'payment_mode'  => $p->payment_method,
            'paid_amount'   => (float) $p->amount,
            'remarks'       => $p->notes ?? '',
            'location'      => $p->location?->location_legal_name ?? '—',
            'payment_type'  => 'Customer',
            'payment_number'=> $p->payment_number,
            'supplier'      => $p->customer?->customer_name ?? '—',
        ]);

        if ($request->filled('payment_type')) {
            if ($request->payment_type === 'Supplier') {
                $transactions = $supplierPayments->values();
            } elseif ($request->payment_type === 'Customer') {
                $transactions = $customerPayments->values();
            } else {
                $transactions = $supplierPayments->merge($customerPayments)->sortByDesc('payment_date')->values();
            }
        } else {
            $transactions = $supplierPayments->merge($customerPayments)->sortByDesc('payment_date')->values();
        }

        return Inertia::render('Operations/PaymentTransactionReport', [
            'transactions' => $transactions,
            'suppliers'    => Supplier::orderBy('supplier_name')->get(['id', 'supplier_name']),
            'locations'    => Location::where('location_type', '!=', 'Customer')->orderBy('location_legal_name')->get(['id', 'location_legal_name']),
            'filters'      => $request->only(['date_from', 'date_to', 'location_id', 'supplier_id', 'payment_type']),
            'summary'      => [
                'total_supplier_paid'    => SupplierPayment::sum('amount'),
                'total_customer_received'=> CustomerPayment::sum('amount'),
            ],
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PAYMENT DETAILS (Operations - per-location purchase vs sales summary)
    // ──────────────────────────────────────────────────────────────────────────

    public function paymentDetails(Request $request)
    {
        $query = Location::where('location_type', '!=', 'Customer')->orderBy('location_legal_name');

        if ($request->filled('location_id')) {
            $query->where('id', $request->location_id);
        }

        $locations = $query->get();

        $rows = $locations->map(function ($loc) use ($request) {
            $poQuery = PurchaseOrder::where('location_id', $loc->id);
            $siQuery = SalesInvoice::where('location_id', $loc->id);

            if ($request->filled('date_from')) {
                $poQuery->whereDate('po_date', '>=', $request->date_from);
                $siQuery->whereDate('invoice_date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $poQuery->whereDate('po_date', '<=', $request->date_to);
                $siQuery->whereDate('invoice_date', '<=', $request->date_to);
            }

            return [
                'id'                => $loc->id,
                'date'              => now()->toDateString(),
                'manufacturing_unit'=> $loc->location_legal_name,
                'total_purchase'    => (float) $poQuery->sum('grand_total'),
                'total_sales'       => (float) $siQuery->sum('grand_total'),
            ];
        })->filter(fn($r) => $r['total_purchase'] > 0 || $r['total_sales'] > 0)->values();

        return Inertia::render('Operations/PaymentDetails', [
            'details'   => $rows,
            'locations' => Location::where('location_type', '!=', 'Customer')->orderBy('location_legal_name')->get(['id', 'location_legal_name']),
            'filters'   => $request->only(['date_from', 'date_to', 'location_id']),
        ]);
    }
}
