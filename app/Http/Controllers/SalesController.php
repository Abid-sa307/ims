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
            'customers' => Customer::all(),
            'locations' => Location::all(),
            'categories' => ItemCategory::all(),
            'items' => Item::with(['baseUnit', 'category'])->get(),
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
            'customer_id' => 'required|exists:customers,id',
            'location_id' => 'required|exists:locations,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.uom_id' => 'required|exists:uoms,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_percentage' => 'nullable|numeric|min:0',
            'items.*.discount_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            $totalTax = 0;

            foreach ($validated['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];
                $itemTax = $itemTotal * ($item['tax_percentage'] ?? 0) / 100;
                $totalAmount += $itemTotal;
                $totalTax += $itemTax;
            }

            $discountAmount = $validated['discount_amount'] ?? 0;
            $grandTotal = $totalAmount + $totalTax - $discountAmount;

            $invoice = SalesInvoice::create([
                'invoice_number' => 'SI-' . date('Ymd') . '-' . str_pad(SalesInvoice::count() + 1, 4, '0', STR_PAD_LEFT),
                'invoice_date' => $validated['invoice_date'],
                'customer_id' => $validated['customer_id'],
                'location_id' => $validated['location_id'],
                'total_amount' => $totalAmount,
                'tax_amount' => $totalTax,
                'discount_amount' => $discountAmount,
                'grand_total' => $grandTotal,
                'status' => 'pending',
                'remarks' => $validated['remarks'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];
                $itemTax = $itemTotal * ($item['tax_percentage'] ?? 0) / 100;
                $itemDiscount = $item['discount_amount'] ?? 0;

                SalesInvoiceItem::create([
                    'sales_invoice_id' => $invoice->id,
                    'item_id' => $item['item_id'],
                    'uom_id' => $item['uom_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_percentage' => $item['tax_percentage'] ?? 0,
                    'tax_amount' => $itemTax,
                    'discount_amount' => $itemDiscount,
                    'total_amount' => $itemTotal + $itemTax - $itemDiscount,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Sales invoice created successfully.');
    }

    public function approvedInvoice()
    {
        $invoices = SalesInvoice::with(['customer', 'location', 'items.item'])
            ->where('status', 'pending')
            ->get();

        return Inertia::render('Sales/ApprovedInvoice', [
            'invoices' => $invoices,
        ]);
    }

    public function approveInvoice(SalesInvoice $invoice)
    {
        $invoice->update(['status' => 'approved']);
        return redirect()->back()->with('success', 'Invoice approved successfully.');
    }

    public function orderManagement()
    {
        $invoices = SalesInvoice::with(['customer', 'location', 'items.item'])->get();

        return Inertia::render('Sales/OrderManagement', [
            'invoices' => $invoices,
        ]);
    }
}
