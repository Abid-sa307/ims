import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Package, Info, CheckCircle2, List, Trash2, Edit, Save, AlignJustify, X, ArrowLeft, Printer, Building2, MapPin, Tag, FileText, Send, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    purchaseOrder: any;
    isFinalize?: boolean;
}

const breadcrumbs = [
    { title: 'Purchase', href: '#' },
    { title: 'Received PO', href: '/purchase/received-po' },
    { title: 'Receive Order', href: '#' },
];

export default function ReceiveOrder({ purchaseOrder, isFinalize = false }: Props) {
    const po = purchaseOrder;
    const { data, setData, post, processing, errors } = useForm({
        received_date: po.received_date || new Date().toISOString().split('T')[0],
        receive_remarks: po.receive_remarks || '',
        dispatched_remarks: po.dispatched_remarks || '',
        ref_invoice_date: po.ref_invoice_date || new Date().toISOString().split('T')[0],
        ref_invoice_no: po.ref_invoice_no || '',
        items: po.items.map((item: any) => ({
            id: item.id,
            item_name: item.item?.item_name,
            uom: item.uom || item.item?.baseUnit?.unit_short_code,
            current_price: item.current_price,
            qty: item.qty, // Ordered Qty
            received_qty: item.received_qty || item.qty,
            damaged_qty: item.damaged_qty || 0,
            missed_qty: item.missed_qty || 0,
            discount_percent: item.discount_percent,
            discount_amount: item.discount_amount,
            taxable_amount: item.taxable_amount,
            tax_percent: item.tax_percent,
            tax_amount: item.tax_amount,
            cgst_percent: item.cgst_percent,
            cgst_amount: item.cgst_amount,
            sgst_percent: item.sgst_percent,
            sgst_amount: item.sgst_amount,
            igst_percent: item.igst_percent,
            igst_amount: item.igst_amount,
            utgst_percent: item.utgst_percent,
            utgst_amount: item.utgst_amount,
            total_amount: item.total_amount,
        })),
        grand_total: po.grand_total,
    });

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        const val = parseFloat(value) || 0;
        newItems[index] = { ...newItems[index], [field]: val };
        
        // Recalculate totals for this item
        if (field === 'received_qty' || field === 'damaged_qty' || field === 'missed_qty') {
            const qty = parseFloat(newItems[index].received_qty) || 0;
            const price = parseFloat(newItems[index].current_price) || 0;
            const taxable = qty * price;
            
            // Re-calc tax amounts based on percentages
            const taxPercent = newItems[index].tax_percent || 0;
            const taxAmt = taxable * (taxPercent / 100);
            
            newItems[index].taxable_amount = taxable;
            newItems[index].tax_amount = taxAmt;
            newItems[index].total_amount = taxable + taxAmt;

            // Split tax based on regime (approximate for UI feedback)
            if (newItems[index].cgst_percent > 0) {
                newItems[index].cgst_amount = taxable * (newItems[index].cgst_percent / 100);
            }
            if (newItems[index].sgst_percent > 0) {
                newItems[index].sgst_amount = taxable * (newItems[index].sgst_percent / 100);
            }
            if (newItems[index].igst_percent > 0) {
                newItems[index].igst_amount = taxable * (newItems[index].igst_percent / 100);
            }
            if (newItems[index].utgst_percent > 0) {
                newItems[index].utgst_amount = taxable * (newItems[index].utgst_percent / 100);
            }
        }
        
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFinalize) {
            post(`/purchase/finalize-receive/${po.id}`);
        } else {
            post(`/purchase/receive-order/${po.id}`);
        }
    };

    // Detect regime from supplier state
    const supplierState = (po.supplier?.state || '').toLowerCase();
    const UT_LIST = ['chandigarh', 'ladakh', 'lakshadweep', 'andaman and nicobar islands', 'dadra and nagar haveli and daman and diu'];
    let regime = 'INTER';
    if (supplierState === 'gujarat') regime = 'INTRA';
    else if (UT_LIST.includes(supplierState)) regime = 'UT';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Receive PO: ${po.order_number}`} />
            <div className="flex h-full flex-col p-4 sm:p-6 overflow-y-auto bg-gray-50/50">

                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-6 gap-4">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Receive Purchase Order</h1>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">
                                Receiving: <span className="text-[#162a5b] font-black">{po.order_number}</span>
                                <span className={`ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${isFinalize ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                    {isFinalize ? 'Finalizing Stock' : 'Drafting Receive Details'}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => router.get('/purchase/received-po')}
                                className="h-8 text-xs gap-1.5"
                            >
                                <ArrowLeft className="h-3 w-3" /> Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className={`h-8 text-[10px] font-bold uppercase tracking-wider gap-2 px-4 ${isFinalize ? 'bg-[#162a5b] hover:bg-[#1a3370]' : 'bg-emerald-600 hover:bg-emerald-700'} text-white shadow-sm`}
                            >
                                {processing ? 'Processing...' : isFinalize ? <><CheckCircle2 className="h-3.5 w-3.5" /> Finalize Stock</> : <><Save className="h-3.5 w-3.5" /> Save Receive Details</>}
                            </Button>
                        </div>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Submission Errors</span>
                            </div>
                            <ul className="list-disc list-inside text-[11px] font-medium ml-1">
                                {Object.values(errors).map((err, i) => <li key={i}>{err as string}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Order Info Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm p-6">
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                <Info className="h-3.5 w-3.5" /> PO Details
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</div>
                                    <div className="text-xs font-semibold text-gray-800">{po.location?.location_legal_name}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Supplier</div>
                                    <div className="text-xs font-semibold text-gray-800">{po.supplier?.supplier_name}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">PO Date</div>
                                    <div className="text-xs font-semibold text-gray-800">{po.po_date}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Expected</div>
                                    <div className="text-xs font-semibold text-gray-800">{po.exp_order_date || '—'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border shadow-sm p-6">
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" /> Receive Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Received Date</Label>
                                    <Input 
                                        type="date" 
                                        className="h-8 text-xs border-gray-200 focus:ring-1 focus:ring-[#162a5b]" 
                                        value={data.received_date}
                                        onChange={e => setData('received_date', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Invoice No.</Label>
                                    <Input 
                                        className="h-8 text-xs border-gray-200 focus:ring-1 focus:ring-[#162a5b]" 
                                        placeholder="INV-..."
                                        value={data.ref_invoice_no}
                                        onChange={e => setData('ref_invoice_no', e.target.value)}
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Receive Remarks</Label>
                                    <Input 
                                        className="h-8 text-xs border-gray-200 focus:ring-1 focus:ring-[#162a5b]" 
                                        placeholder="Any notes..."
                                        value={data.receive_remarks}
                                        onChange={e => setData('receive_remarks', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left align-middle border-collapse">
                                <thead className="bg-[#21355e] text-white text-[11px] font-medium">
                                    <tr>
                                        <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-10">#</th>
                                        <th className="px-3 py-3 border-r border-[#3a4d75] min-w-[200px]">Item Name</th>
                                        <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-16">UOM</th>
                                        <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-20">Ordered</th>
                                        <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-24">Received</th>
                                        <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-24 bg-red-900/20">Damaged</th>
                                        <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-24 bg-amber-900/20">Missing</th>
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75] w-24">Price</th>
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75] w-28">Taxable Amt</th>
                                        {regime === 'INTRA' && (<>
                                            <th className="px-3 py-3 text-right border-r border-[#3a4d75]">CGST</th>
                                            <th className="px-3 py-3 text-right border-r border-[#3a4d75]">SGST</th>
                                        </>)}
                                        {regime === 'UT' && (<>
                                            <th className="px-3 py-3 text-right border-r border-[#3a4d75]">CGST</th>
                                            <th className="px-3 py-3 text-right border-r border-[#3a4d75]">UTGST</th>
                                        </>)}
                                        {regime === 'INTER' && (
                                            <th className="px-3 py-3 text-right border-r border-[#3a4d75]">IGST</th>
                                        )}
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75] w-24">Tax Amt</th>
                                        <th className="px-3 py-3 text-right">Total Amt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.items.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-blue-50/10">
                                            <td className="px-3 py-2.5 text-center text-gray-400 border-r border-gray-100">{index + 1}</td>
                                            <td className="px-3 py-2.5 border-r border-gray-100">
                                                <div className="font-semibold text-gray-800">{item.item_name}</div>
                                            </td>
                                            <td className="px-3 py-2.5 text-center border-r border-gray-100 text-gray-600 font-medium uppercase">{item.uom}</td>
                                            <td className="px-3 py-2.5 text-center border-r border-gray-100 font-bold text-gray-400">{Number(item.qty).toFixed(3)}</td>
                                            <td className="px-1.5 py-1.5 border-r border-gray-100">
                                                <Input 
                                                    type="number" 
                                                    className="h-8 text-center text-xs font-bold border-[#162a5b]/20 focus:ring-[#162a5b]" 
                                                    value={item.received_qty}
                                                    onChange={e => handleItemChange(index, 'received_qty', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-1.5 py-1.5 border-r border-gray-100 bg-red-50/30">
                                                <Input 
                                                    type="number" 
                                                    className="h-8 text-center text-xs font-bold border-red-200 focus:ring-red-500 text-red-600" 
                                                    value={item.damaged_qty}
                                                    onChange={e => handleItemChange(index, 'damaged_qty', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-1.5 py-1.5 border-r border-gray-100 bg-amber-50/30">
                                                <Input 
                                                    type="number" 
                                                    className="h-8 text-center text-xs font-bold border-amber-200 focus:ring-amber-500 text-amber-600" 
                                                    value={item.missed_qty}
                                                    onChange={e => handleItemChange(index, 'missed_qty', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 font-mono text-gray-600">{Number(item.current_price).toFixed(2)}</td>
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 font-semibold">{Number(item.taxable_amount).toFixed(2)}</td>
                                            {regime === 'INTRA' && (<>
                                                <td className="px-3 py-2.5 text-right border-r border-gray-100 text-blue-600">{Number(item.cgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.cgst_percent}%)</span></td>
                                                <td className="px-3 py-2.5 text-right border-r border-gray-100 text-blue-600">{Number(item.sgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.sgst_percent}%)</span></td>
                                            </>)}
                                            {regime === 'UT' && (<>
                                                <td className="px-3 py-2.5 text-right border-r border-gray-100 text-indigo-600">{Number(item.cgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.cgst_percent}%)</span></td>
                                                <td className="px-3 py-2.5 text-right border-r border-gray-100 text-indigo-600">{Number(item.utgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.utgst_percent}%)</span></td>
                                            </>)}
                                            {regime === 'INTER' && (
                                                <td className="px-3 py-2.5 text-right border-r border-gray-100 text-amber-600">{Number(item.igst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.igst_percent}%)</span></td>
                                            )}
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 font-semibold">{Number(item.tax_amount).toFixed(2)}</td>
                                            <td className="px-3 py-2.5 text-right font-bold text-[#162a5b] bg-gray-50/50">{Number(item.total_amount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-6">
                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden w-full lg:w-2/3">
                            <table className="w-full text-[11px]">
                                <thead className="bg-[#21355e] text-white text-center font-semibold">
                                    <tr>
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Base Amount</th>
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Total Tax</th>
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Addl. Charges</th>
                                        <th className="px-3 py-2">Grand Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center bg-white">
                                        <td className="px-3 py-3 border-r border-gray-100 font-semibold">
                                            {data.items.reduce((acc, item) => acc + (parseFloat(item.taxable_amount) || 0), 0).toFixed(2)}
                                        </td>
                                        <td className="px-3 py-3 border-r border-gray-100 text-blue-600 font-bold">
                                            {data.items.reduce((acc, item) => acc + (parseFloat(item.tax_amount) || 0), 0).toFixed(2)}
                                        </td>
                                        <td className="px-3 py-3 border-r border-gray-100 text-blue-500">
                                            {Number(po.additional_charges || 0).toFixed(2)}
                                        </td>
                                        <td className="px-3 py-3 text-xl font-black text-[#162a5b]">
                                            ₹ {(data.items.reduce((acc, item) => acc + (parseFloat(item.total_amount) || 0), 0) + Number(po.additional_charges || 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
