import { Head, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, List, Calendar, FileText, IndianRupee } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase', href: '#' },
    { title: 'Generate Debit Note', href: '/purchase/generate-debit-note' }
];

export default function GenerateDebitNote() {
    const { locations, suppliers, purchaseOrders, items: allItems } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        location_id: '',
        supplier_id: '',
        purchase_order_id: '',
        debit_note_date: new Date().toISOString().split('T')[0],
        reference: '',
        description: '',
        total_amount_base: 0,
        discount: 0,
        total_taxable_amt: 0,
        total_cess_amt: 0,
        total_tax_amt: 0,
        additional_charges: 0,
        grand_total: 0,
        items: [
            {
                item_id: '',
                uom: '',
                unit_price: 0,
                ordered_qty: 0,
                already_returned_qty: 0,
                return_qty: 0,
                discount_percent: 0,
                discount_amount: 0,
                taxable_amount: 0,
                cess_percent: 0,
                cess_amount: 0,
                sgst_percent: 0,
                sgst_amount: 0,
                cgst_percent: 0,
                cgst_amount: 0,
                service_charge_percent: 0,
                service_charge_amount: 0,
                tcs_percent: 0,
                tcs_amount: 0,
                vat_percent: 0,
                vat_amount: 0,
                surcharge_percent: 0,
                surcharge_amount: 0,
                catering_levy_percent: 0,
                catering_levy_amount: 0,
                total_amount: 0
            }
        ]
    });

    // Helper to calculate totals
    useEffect(() => {
        let tBase = 0;
        let tTaxable = 0;
        let tCess = 0;
        let tTax = 0;
        let tDiscount = 0;

        const updatedItems = data.items.map(item => {
            const qty = Number(item.return_qty) || 0;
            const price = Number(item.unit_price) || 0;
            const baseAmount = qty * price;
            
            // Row Discount
            let rowDiscount = Number(item.discount_amount);
            if (Number(item.discount_percent) > 0) {
                rowDiscount = baseAmount * (Number(item.discount_percent) / 100);
            }
            
            const taxable = baseAmount - rowDiscount;
            
            // Taxes & Charges
            const calc = (percent: number) => taxable * (Number(percent) / 100);
            
            const cessAmt = calc(item.cess_percent);
            const sgstAmt = calc(item.sgst_percent);
            const cgstAmt = calc(item.cgst_percent);
            const scAmt = calc(item.service_charge_percent);
            const tcsAmt = calc(item.tcs_percent);
            const vatAmt = calc(item.vat_percent);
            const surAmt = calc(item.surcharge_percent);
            const catAmt = calc(item.catering_levy_percent);

            const rowTax = sgstAmt + cgstAmt + scAmt + tcsAmt + vatAmt + surAmt + catAmt;
            const rowTotal = taxable + cessAmt + rowTax;

            tBase += baseAmount;
            tTaxable += taxable;
            tCess += cessAmt;
            tTax += rowTax;
            tDiscount += rowDiscount;

            return {
                ...item,
                discount_amount: rowDiscount,
                taxable_amount: taxable,
                cess_amount: cessAmt,
                sgst_amount: sgstAmt,
                cgst_amount: cgstAmt,
                service_charge_amount: scAmt,
                tcs_amount: tcsAmt,
                vat_amount: vatAmt,
                surcharge_amount: surAmt,
                catering_levy_amount: catAmt,
                total_amount: rowTotal
            };
        });

        const grand = tTaxable + tCess + tTax + Number(data.additional_charges) - Number(data.discount);

        if (Math.abs(grand - data.grand_total) > 0.01) {
            setData(prev => ({
                ...prev,
                items: updatedItems,
                total_amount_base: tBase,
                total_taxable_amt: tTaxable,
                total_cess_amt: tCess,
                total_tax_amt: tTax,
                grand_total: grand
            }));
        }
    }, [JSON.stringify(data.items), data.additional_charges, data.discount]);

    const handlePOChange = (poId: string) => {
        const po = purchaseOrders.find((p: any) => p.id.toString() === poId);
        if (po) {
            const poItems = po.items.map((pi: any) => ({
                item_id: pi.item_id.toString(),
                uom: pi.uom,
                unit_price: pi.current_price,
                ordered_qty: pi.qty,
                already_returned_qty: 0, // In real app, fetch from DB
                return_qty: 0,
                discount_percent: pi.discount_percent,
                discount_amount: 0,
                taxable_amount: 0,
                cess_percent: pi.cess_percent,
                cess_amount: 0,
                sgst_percent: pi.tax_percent / 2, // Assuming SGST/CGST split
                sgst_amount: 0,
                cgst_percent: pi.tax_percent / 2,
                cgst_amount: 0,
                service_charge_percent: 0,
                service_charge_amount: 0,
                tcs_percent: 0,
                tcs_amount: 0,
                vat_percent: 0,
                vat_amount: 0,
                surcharge_percent: 0,
                surcharge_amount: 0,
                catering_levy_percent: 0,
                catering_levy_amount: 0,
                total_amount: 0
            }));
            setData(prev => ({
                ...prev,
                purchase_order_id: poId,
                supplier_id: po.supplier_id.toString(),
                location_id: po.location_id.toString(),
                items: poItems
            }));
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const addItemRow = () => {
        setData('items', [...data.items, {
            item_id: '', uom: '', unit_price: 0, ordered_qty: 0, already_returned_qty: 0, return_qty: 0,
            discount_percent: 0, discount_amount: 0, taxable_amount: 0, cess_percent: 0, cess_amount: 0,
            sgst_percent: 0, sgst_amount: 0, cgst_percent: 0, cgst_amount: 0, service_charge_percent: 0, service_charge_amount: 0,
            tcs_percent: 0, tcs_amount: 0, vat_percent: 0, vat_amount: 0, surcharge_percent: 0, surcharge_amount: 0,
            catering_levy_percent: 0, catering_levy_amount: 0, total_amount: 0
        }]);
    };

    const removeItemRow = (index: number) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/purchase/generate-debit-note');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Debit Note" />
            <form onSubmit={submit} className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#f8fafc]">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-b pb-4 mb-6 bg-white p-4 rounded-lg shadow-sm border-t-4 border-t-blue-800">
                    <h1 className="text-xl font-bold tracking-tight text-blue-900 flex items-center gap-2">
                         <FileText className="size-5" /> Generate Debit Note
                    </h1>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground border">
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                {/* Primary Inputs */}
                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Location</Label>
                            <select 
                                value={data.location_id} 
                                onChange={e => setData('location_id', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">- Select Location -</option>
                                {locations?.map((l: any) => <option key={l.id} value={l.id}>{l.location_legal_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Supplier</Label>
                            <select 
                                value={data.supplier_id} 
                                onChange={e => setData('supplier_id', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">- Select Supplier -</option>
                                {suppliers?.map((s: any) => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Order Number</Label>
                            <select 
                                value={data.purchase_order_id} 
                                onChange={e => handlePOChange(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">-- Select Order Number --</option>
                                {purchaseOrders?.map((po: any) => <option key={po.id} value={po.id}>{po.order_number}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Debit Note Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input type="date" value={data.debit_note_date} onChange={e => setData('debit_note_date', e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Reference</Label>
                            <Input value={data.reference} onChange={e => setData('reference', e.target.value)} placeholder="Define Reference" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Description</Label>
                            <Input value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Define Description" />
                        </div>
                    </div>
                </div>

                {/* The Massive Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[10px] text-left align-middle border-collapse">
                            <thead className="bg-[#1e3a8a] text-white font-medium uppercase tracking-tighter">
                                <tr>
                                    <th className="px-2 py-3 text-center border-r border-blue-900 min-w-[180px]" rowSpan={2}>Item Name</th>
                                    <th className="px-2 py-3 text-center border-r border-blue-900 min-w-[120px]" rowSpan={2}>UOM</th>
                                    <th className="px-1 py-3 text-center border-r border-blue-900 w-16" rowSpan={2}>Unit Price</th>
                                    <th className="px-1 py-3 text-center border-r border-blue-900 w-16" rowSpan={2}>Ordered Qty</th>
                                    <th className="px-1 py-3 text-center border-r border-blue-900 w-16" rowSpan={2}>Already Returned Qty</th>
                                    <th className="px-1 py-3 text-center border-r border-blue-900 w-16" rowSpan={2}>Return Qty</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>Item Discount</th>
                                    <th className="px-1 py-3 text-center border-r border-blue-900 w-20" rowSpan={2}>Taxable Amount</th>
                                    <th className="px-1 py-3 text-center border-r border-blue-900 w-12" rowSpan={2}>CESS(%)</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>SGST</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>CGST</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>Service Charge</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>TCS</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>VAT</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>SURCHARGE</th>
                                    <th className="px-1 py-1 text-center border-b border-r border-blue-900" colSpan={2}>CATERING LEVY IND</th>
                                    <th className="px-2 py-3 text-center border-r border-blue-900 w-24" rowSpan={2}>Total Amount</th>
                                    <th className="px-1 py-3 text-center bg-blue-950" rowSpan={2}><Trash2 className="size-3 mx-auto" /></th>
                                </tr>
                                <tr>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-10">%</th>
                                    <th className="px-1 py-1 text-center border-r border-blue-900 border-t w-16">Amt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-1 border-r">
                                            <select 
                                                value={item.item_id} 
                                                onChange={e => handleItemChange(idx, 'item_id', e.target.value)}
                                                className="w-full bg-transparent border-none text-[10px] focus:ring-0"
                                            >
                                                <option value="">Select An Option</option>
                                                {allItems?.map((i: any) => <option key={i.id} value={i.id}>{i.item_name}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-1 border-r">
                                            <select 
                                                value={item.uom} 
                                                onChange={e => handleItemChange(idx, 'uom', e.target.value)}
                                                className="w-full bg-transparent border-none text-[10px] focus:ring-0"
                                            >
                                                <option value="">Select An Option</option>
                                                <option value="PCS">PCS</option>
                                                <option value="KG">KG</option>
                                                <option value="BOX">BOX</option>
                                            </select>
                                        </td>
                                        <td className="p-0 border-r"><Input type="number" step="0.01" className="h-8 border-none bg-transparent text-right text-[10px] focus-visible:ring-0" value={item.unit_price} onChange={e => handleItemChange(idx, 'unit_price', e.target.value)} /></td>
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.ordered_qty} onChange={e => handleItemChange(idx, 'ordered_qty', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.already_returned_qty} /></td>
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0 font-bold text-blue-700" value={item.return_qty} onChange={e => handleItemChange(idx, 'return_qty', e.target.value)} /></td>
                                        
                                        {/* Discount */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.discount_percent} onChange={e => handleItemChange(idx, 'discount_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.discount_amount} onChange={e => handleItemChange(idx, 'discount_amount', e.target.value)} /></td>
                                        
                                        <td className="p-1 border-r text-right font-semibold bg-blue-50/20">{item.taxable_amount.toFixed(2)}</td>
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.cess_percent} onChange={e => handleItemChange(idx, 'cess_percent', e.target.value)} /></td>
                                        
                                        {/* SGST */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.sgst_percent} onChange={e => handleItemChange(idx, 'sgst_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50/50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.sgst_amount.toFixed(2)} /></td>
                                        
                                        {/* CGST */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.cgst_percent} onChange={e => handleItemChange(idx, 'cgst_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50/50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.cgst_amount.toFixed(2)} /></td>

                                        {/* Service Charge */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.service_charge_percent} onChange={e => handleItemChange(idx, 'service_charge_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50/50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.service_charge_amount.toFixed(2)} /></td>

                                        {/* TCS */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.tcs_percent} onChange={e => handleItemChange(idx, 'tcs_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50/50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.tcs_amount.toFixed(2)} /></td>

                                        {/* VAT */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.vat_percent} onChange={e => handleItemChange(idx, 'vat_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50/50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.vat_amount.toFixed(2)} /></td>

                                        {/* SURCHARGE */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.surcharge_percent} onChange={e => handleItemChange(idx, 'surcharge_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50/50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.surcharge_amount.toFixed(2)} /></td>

                                        {/* CATERING LEVY */}
                                        <td className="p-0 border-r"><Input type="number" className="h-8 border-none bg-transparent text-center text-[10px] focus-visible:ring-0" value={item.catering_levy_percent} onChange={e => handleItemChange(idx, 'catering_levy_percent', e.target.value)} /></td>
                                        <td className="p-0 border-r bg-gray-50/50"><Input readOnly className="h-8 border-none bg-transparent text-center text-[10px]" value={item.catering_levy_amount.toFixed(2)} /></td>

                                        <td className="p-1 text-right font-bold bg-blue-100/50 text-blue-900 border-r">{item.total_amount.toFixed(2)}</td>
                                        <td className="p-1 text-center">
                                            <button type="button" onClick={() => removeItemRow(idx)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="size-3 mx-auto" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 flex justify-end p-2 border-t">
                        <Button type="button" onClick={addItemRow} variant="outline" size="sm" className="h-7 w-7 p-0 bg-white">
                            <PlusCircle className="h-4 w-4 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* Summary Totals Table */}
                <div className="flex justify-end mb-10">
                    <div className="w-full lg:w-4/5 border rounded-lg shadow-sm overflow-hidden bg-white">
                        <table className="w-full text-[10px] text-left border-collapse">
                            <thead className="bg-[#1e3a8a] text-white font-medium uppercase text-center">
                                <tr>
                                    <th className="px-3 py-2 border-r border-blue-900">Total Amount(Cur Price*Qty)</th>
                                    <th className="px-3 py-2 border-r border-blue-900">Discount</th>
                                    <th className="px-3 py-2 border-r border-blue-900">Total Taxable Amt</th>
                                    <th className="px-3 py-2 border-r border-blue-900">Total Cess Amt</th>
                                    <th className="px-3 py-2 border-r border-blue-900">Total Tax Amt</th>
                                    <th className="px-3 py-2 border-r border-blue-900 min-w-[150px]">Additional Charges</th>
                                    <th className="px-3 py-2 bg-blue-900 font-bold">Grand Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border-r text-center font-bold text-gray-700">{data.total_amount_base.toFixed(2)}</td>
                                    <td className="p-3 border-r text-center text-red-600 font-bold">
                                        <Input type="number" step="0.01" value={data.discount} onChange={e => setData('discount', Number(e.target.value))} className="h-8 text-xs text-center border-none focus-visible:ring-0" />
                                    </td>
                                    <td className="p-3 border-r text-center font-bold text-gray-700">{data.total_taxable_amt.toFixed(2)}</td>
                                    <td className="p-3 border-r text-center font-bold text-gray-700">{data.total_cess_amt.toFixed(2)}</td>
                                    <td className="p-3 border-r text-center font-bold text-gray-700">{data.total_tax_amt.toFixed(2)}</td>
                                    <td className="p-3 border-r text-center">
                                        <Input type="number" step="0.01" value={data.additional_charges} onChange={e => setData('additional_charges', Number(e.target.value))} className="h-8 text-xs text-center border focus:ring-1" />
                                    </td>
                                    <td className="p-3 text-center text-xl font-black text-blue-900 bg-blue-50/50">
                                        <span className="text-xs mr-1 opacity-50">₹</span>{data.grand_total.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-start pt-6 border-t border-gray-200">
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black uppercase px-12 h-12 text-sm rounded-md shadow-lg transition-transform active:scale-95"
                    >
                        GENERATE DEBIT NOTE
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
