<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tax Invoice - {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header-top {
            width: 100%;
            margin-bottom: 5px;
        }
        .factory-address {
            text-align: right;
            font-size: 10px;
        }
        .company-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #162a5b;
        }
        .summary-title {
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
            border-bottom: 2px solid #162a5b;
            padding-bottom: 5px;
        }
        .details-box {
            width: 100%;
            border: 1px solid #000;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .details-box td {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
        }
        .main-table {
            width: 100%;
            border: 1px solid #000;
            border-collapse: collapse;
            margin-bottom: 0;
        }
        .main-table th, .main-table td {
            border: 1px solid #000;
            padding: 6px 4px;
            text-align: center;
            font-size: 10px;
        }
        .main-table th {
            font-weight: bold;
            background-color: #f0f4f8;
            color: #162a5b;
        }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        
        .totals-section {
            width: 100%;
            margin-top: 0;
            border-collapse: collapse;
        }
        .totals-section td {
            border: 1px solid #000;
            padding: 4px 8px;
        }

        .summary-wrapper {
            width: 100%;
            margin-top: 15px;
        }
        .words-section {
            width: 55%;
            float: left;
            border: 1px solid #000;
            padding: 8px;
            min-height: 100px;
            box-sizing: border-box;
        }
        .tax-summary-section {
            width: 45%;
            float: right;
            border: 1px solid #000;
            border-left: none;
            padding: 0;
            box-sizing: border-box;
            min-height: 100px;
        }
        .tax-summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .tax-summary-table th, .tax-summary-table td {
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            padding: 6px;
            text-align: center;
            font-size: 9px;
        }
        .tax-summary-table th:last-child, .tax-summary-table td:last-child {
            border-right: none;
        }
        .tax-summary-table tr:last-child td {
            border-bottom: none;
        }
        
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        
        .bold { font-weight: bold; }
        .mt-10 { margin-top: 10px; }
        .footer-note {
            margin-top: 30px;
            font-size: 9px;
            text-align: center;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header-top">
        <div class="factory-address">{{ $factory_address }}</div>
        <div class="company-header">{{ $company_name }}</div>
    </div>

    <div class="summary-title">Tax Invoice</div>

    <table class="details-box">
        <tr>
            <td width="50%">
                <span class="bold">Billed To:</span><br>
                <span class="bold" style="font-size: 12px;">{{ $invoice->customer->customer_name }}</span><br>
                {{ $invoice->customer->customer_legal_name }}<br>
                {{ $invoice->location->location_address ?? 'N/A' }}<br>
                <span class="bold">GST No:</span> {{ $invoice->customer->gst_number ?? 'N/A' }}
            </td>
            <td width="50%">
                <span class="bold">Invoice No:</span> {{ $invoice->invoice_number }}<br>
                <span class="bold">Invoice Date:</span> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d M Y') }}<br>
                <span class="bold">Status:</span> {{ strtoupper($invoice->status) }}<br>
                <span class="bold">Dispatch Location:</span> {{ $invoice->location->location_name }}
            </td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th width="30">#</th>
                <th class="text-left">Item Description</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>UOM</th>
                <th>Rate</th>
                <th>Dis.</th>
                <th>Taxable</th>
                <th>GST %</th>
                <th>GST Amt</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td class="text-left">{{ $item->item->item_name }}</td>
                <td>{{ $item->item->hsn_code ?? '-' }}</td>
                <td>{{ number_format($item->quantity, 2) }}</td>
                <td>{{ $item->uom->uom_code ?? '-' }}</td>
                <td>{{ number_format($item->unit_price, 2) }}</td>
                <td>{{ number_format($item->discount_amount, 2) }}</td>
                <td>{{ number_format($item->taxable_amount, 2) }}</td>
                <td>{{ number_format($item->tax_percent, 1) }}%</td>
                <td>{{ number_format($item->tax_amount, 2) }}</td>
                <td>{{ number_format($item->total_amount, 2) }}</td>
            </tr>
            @endforeach
            
            {{-- Summary Totals --}}
            <tr>
                <td colspan="10" class="text-right bold">Taxable Amount:</td>
                <td class="text-right">{{ number_format($invoice->total_amount, 2) }}</td>
            </tr>
            <tr>
                <td colspan="10" class="text-right bold">Total Tax:</td>
                <td class="text-right">{{ number_format($invoice->total_tax_amount, 2) }}</td>
            </tr>
            @if($invoice->discount_amount > 0)
            <tr>
                <td colspan="10" class="text-right bold">Discount:</td>
                <td class="text-right">-{{ number_format($invoice->discount_amount, 2) }}</td>
            </tr>
            @endif
            @if($invoice->additional_charges > 0)
            <tr>
                <td colspan="10" class="text-right bold">Additional Charges:</td>
                <td class="text-right">{{ number_format($invoice->additional_charges, 2) }}</td>
            </tr>
            @endif
            <tr style="background-color: #f0f4f8;">
                <td colspan="10" class="text-right bold" style="font-size: 12px; color: #162a5b;">Grand Total:</td>
                <td class="text-right bold" style="font-size: 12px; color: #162a5b;">₹ {{ number_format($invoice->grand_total, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="summary-wrapper clearfix">
        <div class="words-section">
            <span style="font-size: 10px; color: #666;">Amount in Words:</span><br>
            <span class="bold" style="font-size: 12px;">{{ $amount_in_words }}</span>
            
            <div class="mt-10">
                <span class="bold">Remarks:</span><br>
                <span style="font-style: italic;">{{ $invoice->remarks ?? 'No remarks provided.' }}</span>
            </div>
        </div>

        <div class="tax-summary-section">
            <table class="tax-summary-table">
                <thead>
                    <tr style="background-color: #f9f9f9;">
                        <th>GST Rate</th>
                        <th>Taxable</th>
                        @if($invoice->igst_amount > 0)
                            <th>IGST</th>
                        @else
                            <th>CGST</th>
                            <th>SGST</th>
                        @endif
                        <th>Total Tax</th>
                    </tr>
                </thead>
                <tbody>
                    @php $groupedTaxes = $invoice->items->groupBy('tax_percent'); @endphp
                    @foreach($groupedTaxes as $percent => $items)
                    <tr>
                        <td>{{ number_format($percent, 1) }}%</td>
                        <td>{{ number_format($items->sum('taxable_amount'), 2) }}</td>
                        @if($invoice->igst_amount > 0)
                            <td>{{ number_format($items->sum('igst_amount'), 2) }}</td>
                        @else
                            <td>{{ number_format($items->sum('cgst_amount'), 2) }}</td>
                            <td>{{ number_format($items->sum('sgst_amount'), 2) }}</td>
                        @endif
                        <td class="bold">{{ number_format($items->sum('tax_amount'), 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <div class="footer-note">
        This is a computer generated invoice and does not require a physical signature.<br>
        Thank you for your business!
    </div>
</body>
</html>
