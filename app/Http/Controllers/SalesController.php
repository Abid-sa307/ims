<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemWarehouseMapping;
use App\Models\Location;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use App\Models\Tax;
use App\Models\Uom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesController extends Controller
{
    public function generateInvoice()
    {
        return Inertia::render('Sales/GenerateInvoice', [
            'customers' => Location::where('location_type', 'Customer')->select('id', 'location_legal_name', 'customer_id', 'state')->get(),
            'categories' => ItemCategory::all(),
            'items' => Item::with(['baseUnit', 'category', 'taxProfile'])->get(),
            'uoms' => Uom::all(),
            'taxes' => Tax::all(),
            'pendingOrders' => SalesInvoice::with(['customer', 'location', 'items.item', 'items.uom'])
                ->where('status', 'pending')
                ->get(),
        ]);
    }

    public function storeInvoice(Request $request)
    {
        $validated = $request->validate([
            'invoice_date' => 'required|date',
            'customer_id' => 'nullable|exists:customers,id',
            'location_id' => 'required|exists:locations,id',
            'discount_amount' => 'nullable|numeric|min:0',
            'total_tax_amount' => 'nullable|numeric|min:0',
            'cgst_amount' => 'nullable|numeric|min:0',
            'sgst_amount' => 'nullable|numeric|min:0',
            'igst_amount' => 'nullable|numeric|min:0',
            'utgst_amount' => 'nullable|numeric|min:0',
            'additional_charges' => 'nullable|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.uom_id' => 'required|exists:uoms,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount_percent' => 'nullable|numeric|min:0',
            'items.*.discount_amount' => 'nullable|numeric|min:0',
            'items.*.taxable_amount' => 'nullable|numeric|min:0',
            'items.*.cess_percent' => 'nullable|numeric|min:0',
            'items.*.cess_amount' => 'nullable|numeric|min:0',
            'items.*.tax_percent' => 'nullable|numeric|min:0',
            'items.*.cgst_percent' => 'nullable|numeric|min:0',
            'items.*.cgst_amount' => 'nullable|numeric|min:0',
            'items.*.sgst_percent' => 'nullable|numeric|min:0',
            'items.*.sgst_amount' => 'nullable|numeric|min:0',
            'items.*.igst_percent' => 'nullable|numeric|min:0',
            'items.*.igst_amount' => 'nullable|numeric|min:0',
            'items.*.utgst_percent' => 'nullable|numeric|min:0',
            'items.*.utgst_amount' => 'nullable|numeric|min:0',
            'items.*.tax_amount' => 'nullable|numeric|min:0',
            'items.*.total_amount' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $totalBaseAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalBaseAmount += ($item['quantity'] * $item['unit_price']);
            }

            $invoice = SalesInvoice::create([
                'invoice_number' => 'SI-' . date('Ymd') . '-' . str_pad(SalesInvoice::count() + 1, 4, '0', STR_PAD_LEFT),
                'invoice_date' => $validated['invoice_date'],
                'customer_id' => $validated['customer_id'],
                'location_id' => $validated['location_id'],
                'total_amount' => $totalBaseAmount,
                'tax_amount' => $validated['total_tax_amount'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'total_tax_amount' => $validated['total_tax_amount'] ?? 0,
                'cgst_amount' => $validated['cgst_amount'] ?? 0,
                'sgst_amount' => $validated['sgst_amount'] ?? 0,
                'igst_amount' => $validated['igst_amount'] ?? 0,
                'utgst_amount' => $validated['utgst_amount'] ?? 0,
                'additional_charges' => $validated['additional_charges'] ?? 0,
                'grand_total' => $validated['grand_total'],
                'status' => ($request->is_auto_approved ? 'approved' : 'pending'),
                'is_auto_approved' => $request->boolean('is_auto_approved'),
                'remarks' => $validated['remarks'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                SalesInvoiceItem::create([
                    'sales_invoice_id' => $invoice->id,
                    'item_id' => $item['item_id'],
                    'uom_id' => $item['uom_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount_percent' => $item['discount_percent'] ?? 0,
                    'discount_amount' => $item['discount_amount'] ?? 0,
                    'taxable_amount' => $item['taxable_amount'] ?? 0,
                    'cess_percent' => $item['cess_percent'] ?? 0,
                    'cess_amount' => $item['cess_amount'] ?? 0,
                    'tax_percent' => $item['tax_percent'] ?? 0,
                    'cgst_percent' => $item['cgst_percent'] ?? 0,
                    'cgst_amount' => $item['cgst_amount'] ?? 0,
                    'sgst_percent' => $item['sgst_percent'] ?? 0,
                    'sgst_amount' => $item['sgst_amount'] ?? 0,
                    'igst_percent' => $item['igst_percent'] ?? 0,
                    'igst_amount' => $item['igst_amount'] ?? 0,
                    'utgst_percent' => $item['utgst_percent'] ?? 0,
                    'utgst_amount' => $item['utgst_amount'] ?? 0,
                    'tax_amount' => $item['tax_amount'] ?? 0,
                    'total_amount' => $item['total_amount'] ?? 0,
                ]);
            }
        });

        return redirect()->route('sales.order-management')->with([
            'success' => 'Sales invoice created successfully.',
            'latest_invoice_id' => $invoice->id
        ]);
    }

    public function approvedInvoice(Request $request)
    {
        $query = SalesInvoice::with(['customer', 'location'])
            ->where('status', 'pending');

        if ($request->filled('date_from')) {
            $query->whereDate('invoice_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('invoice_date', '<=', $request->date_to);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        return Inertia::render('Sales/ApprovedInvoice', [
            'invoices' => $query->latest()->get(),
            'locations' => Location::where('location_type', '!=', 'Customer')->get(),
            'customers' => Customer::all(),
            'filters' => $request->only(['date_from', 'date_to', 'location_id', 'customer_id'])
        ]);
    }

    public function approveInvoice(SalesInvoice $invoice)
    {
        $invoice->update(['status' => 'approved']);
        return redirect()->route('sales.approved-invoice')->with('success', 'Sales Invoice approved successfully.');
    }

    public function showApproveInvoice(SalesInvoice $invoice)
    {
        return Inertia::render('Sales/ApproveInvoice', [
            'invoice' => $invoice->load(['customer', 'location', 'items.item', 'items.uom']),
            'customers' => Location::where('location_type', 'Customer')->select('id', 'location_legal_name', 'customer_id', 'state')->get(),
            'items' => Item::with(['baseUnit', 'category', 'taxProfile'])->get(),
            'uoms' => Uom::all(),
            'taxes' => Tax::all(),
        ]);
    }

    public function rejectInvoice(SalesInvoice $invoice)
    {
        $invoice->update(['status' => 'rejected']);
        return redirect()->route('sales.approved-invoice')->with('success', 'Sales Invoice rejected successfully.');
    }

    public function sendInvoice(Request $request)
    {
        $query = SalesInvoice::with(['customer', 'location'])
            ->where('status', 'approved');

        if ($request->filled('search')) {
            $query->where('invoice_number', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Sales/SendInvoice', [
            'invoices' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function processSendInvoice(SalesInvoice $invoice)
    {
        // Here you would implement actual email/WhatsApp sending logic
        // For now, we'll mark it as sent (if we had a sent column) or just return success
        return back()->with('success', 'Invoice ' . $invoice->invoice_number . ' has been sent to the customer.');
    }

    public function orderManagement(Request $request)
    {
        $query = SalesInvoice::with(['customer', 'location'])->latest();

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('invoice_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('customer', function($sq) use ($request) {
                      $sq->where('customer_name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('invoice_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('invoice_date', '<=', $request->date_to);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Sales/OrderManagement', [
            'invoices' => $query->paginate(15)->withQueryString(),
            'locations' => Location::where('location_type', '!=', 'Customer')->get(),
            'customers' => Customer::all(),
            'filters' => $request->only(['search', 'date_from', 'date_to', 'location_id', 'customer_id', 'status'])
        ]);
    }
}
