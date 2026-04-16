<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Order - {{ $po->order_number }}</title>
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
        .supplier-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .summary-title {
            text-align: center;
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .details-box {
            width: 100%;
            border: 1px solid #000;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .details-box td {
            border: 1px solid #000;
            padding: 5px;
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
            padding: 4px;
            text-align: center;
            font-size: 10px;
        }
        .main-table th {
            font-weight: bold;
            background-color: #f0f0f0;
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
            padding: 3px 5px;
        }

        .summary-wrapper {
            width: 100%;
            margin-top: 15px;
        }
        .words-section {
            width: 50%;
            float: left;
            border: 1px solid #000;
            padding: 5px;
            min-height: 80px;
            box-sizing: border-box;
        }
        .tax-summary-section {
            width: 50%;
            float: right;
            border: 1px solid #000;
            border-left: none;
            padding: 0;
            box-sizing: border-box;
            min-height: 80px;
        }
        .tax-summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .tax-summary-table th, .tax-summary-table td {
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            padding: 4px;
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
    </style>
</head>
<body>
    <div class="header-top">
        <div class="factory-address">{{ $factory_address }}</div>
        <div class="supplier-name">{{ $po->supplier->supplier_name }}</div>
    </div>

    <div class="summary-title">Purchase Order Summary</div>

    <table class="details-box">
        <tr>
            <td width="55%">
                <span class="bold">M/s. {{ $company_name }}</span><br>
                {{ $company_address }}<br>
                <span class="bold">GST No:</span> {{ $company_gst }}
            </td>
            <td width="45%">
                <span class="bold">Order No:</span> {{ $po->order_number }}<br>
                <span class="bold">Purchase Order Date:</span> {{ \Carbon\Carbon::parse($po->po_date)->format('d M y') }}<br>
                <span class="bold">Expected Order Date:</span> {{ \Carbon\Carbon::parse($po->exp_order_date)->format('d M y') }}
            </td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th width="30">No.</th>
                <th>Item</th>
                <th>HSN No.</th>
                <th>Qty</th>
                <th>UOM</th>
                <th>Unit Price</th>
                <th>Dis.</th>
                <th>Taxable Amt</th>
                <th>CESS</th>
                <th>Tax(%)</th>
                <th>SGST</th>
                <th>CGST</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($po->items as $index => $item)
            @php
                $cgst = $item->tax_amount / 2;
                $sgst = $item->tax_amount / 2;
            @endphp
            <tr>
                <td>{{ $index + 1 }}</td>
                <td class="text-left" style="width: 151px;">{{ $item->item->item_name }}</td>
                <td>{{ $item->item->hsn_code ?? '-' }}</td>
                <td>{{ number_format($item->qty, 2) }}</td>
                <td>{{ $item->uom }}</td>
                <td>{{ number_format($item->current_price, 2) }}</td>
                <td>{{ number_format($item->discount_amount, 2) }}</td>
                <td>{{ number_format($item->taxable_amount, 2) }}</td>
                <td>{{ number_format($item->cess_amount, 2) }}</td>
                <td>{{ number_format($item->tax_percent, 2) }}</td>
                <td>{{ number_format($sgst, 2) }}</td>
                <td>{{ number_format($cgst, 2) }}</td>
                <td>{{ number_format($item->total_amount, 2) }}</td>
            </tr>
            @endforeach
            
            {{-- Totals Section --}}
            <tr>
                <td colspan="12" class="text-right bold">Sub Total:</td>
                <td class="text-right">{{ number_format($po->items->sum('taxable_amount'), 2) }}</td>
            </tr>
            <tr>
                <td colspan="12" class="text-right bold">Discount:</td>
                <td class="text-right">{{ number_format($po->discount_amount, 2) }}</td>
            </tr>
            <tr>
                <td colspan="12" class="text-right bold">Tax Amount:</td>
                <td class="text-right">{{ number_format($po->total_tax_amount, 2) }}</td>
            </tr>
            <tr>
                <td colspan="12" class="text-right bold">Additional Charges:</td>
                <td class="text-right">{{ number_format($po->additional_charges, 2) }}</td>
            </tr>
            <tr>
                <td colspan="12" class="text-right bold">Round Off:</td>
                <td class="text-right">0.00</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
                <td colspan="6" class="bold text-left" style="font-size: 11px;">Grand Total:</td>
                <td colspan="1" class="bold"></td>
                <td class="bold">{{ number_format($po->items->sum('taxable_amount'), 2) }}</td>
                <td class="bold">-</td>
                <td class="bold">-</td>
                <td class="bold">{{ number_format($po->total_tax_amount / 2, 2) }}</td>
                <td class="bold">{{ number_format($po->total_tax_amount / 2, 2) }}</td>
                <td class="bold" style="font-size: 12px;">{{ number_format($po->grand_total, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="summary-wrapper clearfix">
        <div class="words-section">
            <span style="font-size: 10px; color: #666;">Amount Chargeable in Words:</span><br>
            <span class="bold">Rupees {{ $amount_in_words }}</span>
        </div>

        <div class="tax-summary-section">
            <table class="tax-summary-table">
                <thead>
                    <tr style="background-color: #f9f9f9;">
                        <th>Rate</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        <th>Quantity</th>
                        <th>Gross</th>
                    </tr>
                </thead>
                <tbody>
                    @php $groupedTaxes = $po->items->groupBy('tax_percent'); @endphp
                    @foreach($groupedTaxes as $percent => $items)
                    <tr>
                        <td>{{ number_format($percent, 2) }}</td>
                        <td>{{ number_format($items->sum('tax_amount') / 2, 2) }}</td>
                        <td>{{ number_format($items->sum('tax_amount') / 2, 2) }}</td>
                        <td>{{ number_format($items->sum('qty'), 2) }}</td>
                        <td>{{ number_format($items->sum('taxable_amount'), 2) }}</td>
                    </tr>
                    @endforeach
                    <tr class="bold">
                        <td>Total</td>
                        <td>{{ number_format($po->total_tax_amount / 2, 2) }}</td>
                        <td>{{ number_format($po->total_tax_amount / 2, 2) }}</td>
                        <td>{{ number_format($po->items->sum('qty'), 2) }}</td>
                        <td>{{ number_format($po->items->sum('taxable_amount'), 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
