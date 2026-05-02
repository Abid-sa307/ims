import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, PlusCircle, Trash2, List, Search, Zap, Printer } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Customer {
    id: number;
    location_legal_name: string;
    customer_id: number | null;
    state: string | null;
}

interface Item {
    id: number;
    item_name: string;
    price: number;
    tax_percent?: number;
    cess_percentage?: number;
    tax_profile?: {
        total_percentage: number;
    };
    category?: {
        item_category_name: string;
    }
    base_unit?: {
        id: number;
        uom_code: string;
    }
}

interface Uom {
    id: number;
    uom_code: string;
}

interface Tax {
    id: number;
    tax_name: string;
    percentage: number;
}

interface PendingOrder {
    id: number;
    invoice_number: string;
    customer_id: number;
    location_id: number;
    remarks: string;
    items: any[]; // Extended logic handles this
}

interface Props {
    customers: Customer[];
    items: Item[];
    uoms: Uom[];
    taxes: Tax[];
    pendingOrders: PendingOrder[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales', href: '#' },
    { title: 'Generate Invoice', href: '/sales/generate-invoice' },
];

const UT_LIST = ['chandigarh', 'ladakh', 'lakshadweep', 'andaman and nicobar islands', 'dadra and nagar haveli and daman and diu'];

export default function GenerateInvoice({ 
    customers = [], 
    items = [], 
    uoms = [], 
    taxes = [], 
    pendingOrders = [] 
}: Props) {
    const { flash } = usePage<any>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        invoice_date: new Date().toISOString().split('T')[0],
        customer_id: '',
        location_id: '',
        remarks: '',
        discount_amount: 0,
        total_tax_amount: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        utgst_amount: 0,
        additional_charges: 0,
        grand_total: 0,
        is_auto_approved: false,
        items: [
            { 
                item_id: '', 
                uom_id: '', 
                quantity: 1, 
                unit_price: 0, 
                discount_percent: 0,
                discount_amount: 0,
                taxable_amount: 0,
                cess_percent: 0,
                cess_amount: 0,
                tax_percent: 0,
                tax_amount: 0,
                cgst_percent: 0,
                cgst_amount: 0,
                sgst_percent: 0,
                sgst_amount: 0,
                igst_percent: 0,
                igst_amount: 0,
                utgst_percent: 0,
                utgst_amount: 0,
                total_amount: 0 
            }
        ]
    });

    const [selectedOrderId, setSelectedOrderId] = useState<string>('');

    const regime = useMemo(() => {
        const selectedLoc = customers.find(c => c.id.toString() === data.location_id.toString());
        const state = (selectedLoc?.state || '').toLowerCase();
        if (state === 'gujarat') return 'INTRA';
        if (UT_LIST.includes(state)) return 'UT';
        return 'INTER';
    }, [data.location_id, customers]);

    // Complex calculation useEffect (Matching PO Logic)
    useEffect(() => {
        let totalTaxable = 0;
        let totalTax = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;
        let totalUTGST = 0;

        const updatedItems = data.items.map(item => {
            const baseAmount = Number(item.quantity) * Number(item.unit_price);
            
            // Discount
            let dAmt = Number(item.discount_amount);
            if (Number(item.discount_percent) > 0) {
                dAmt = baseAmount * (Number(item.discount_percent) / 100);
            }
            
            const taxable = baseAmount - dAmt;
            const fullTaxRate = Number(item.tax_percent);

            let cgstP = 0, sgstP = 0, igstP = 0, utgstP = 0;
            let cgstA = 0, sgstA = 0, igstA = 0, utgstA = 0;

            if (regime === 'INTRA') {
                cgstP = fullTaxRate / 2;
                sgstP = fullTaxRate / 2;
                cgstA = taxable * (cgstP / 100);
                sgstA = taxable * (sgstP / 100);
            } else if (regime === 'UT') {
                cgstP = fullTaxRate / 2;
                utgstP = fullTaxRate / 2;
                cgstA = taxable * (cgstP / 100);
                utgstA = taxable * (utgstP / 100);
            } else {
                igstP = fullTaxRate;
                igstA = taxable * (igstP / 100);
            }
            
            // Cess
            const cessA = taxable * (Number(item.cess_percent) / 100);
            const rowTaxA = cgstA + sgstA + igstA + utgstA + cessA;
            const rowTotal = taxable + rowTaxA;

            totalTaxable += taxable;
            totalTax += rowTaxA;
            totalCGST += cgstA;
            totalSGST += sgstA;
            totalIGST += igstA;
            totalUTGST += utgstA;

            return {
                ...item,
                discount_amount: dAmt,
                taxable_amount: taxable,
                cess_amount: cessA,
                tax_amount: rowTaxA,
                cgst_percent: cgstP,
                cgst_amount: cgstA,
                sgst_percent: sgstP,
                sgst_amount: sgstA,
                igst_percent: igstP,
                igst_amount: igstA,
                utgst_percent: utgstP,
                utgst_amount: utgstA,
                total_amount: rowTotal
            };
        });

        const grand = totalTaxable + totalTax + Number(data.additional_charges) - Number(data.discount_amount);

        setData(prev => ({
            ...prev,
            items: updatedItems,
            total_tax_amount: totalTax,
            cgst_amount: totalCGST,
            sgst_amount: totalSGST,
            igst_amount: totalIGST,
            utgst_amount: totalUTGST,
            grand_total: grand
        }));
    }, [
        data.location_id, 
        JSON.stringify(data.items.map(i => ({
            id: i.item_id, q: i.quantity, p: i.unit_price, t: i.tax_percent, 
            d: i.discount_percent, da: i.discount_amount, cp: i.cess_percent
        }))), 
        data.additional_charges, 
        data.discount_amount
    ]);

    // Handle Sales Order selection
    const handleOrderSelect = (orderId: string) => {
        setSelectedOrderId(orderId);
        if (!orderId) return;

        const order = pendingOrders.find(o => o.id === parseInt(orderId));
        if (order) {
            setData({
                ...data,
                location_id: order.location_id.toString(),
                customer_id: order.customer_id?.toString() || '',
                remarks: order.remarks || '',
                items: order.items.map(item => {
                    const itemRef = items.find(i => i.id === item.item_id);
                    return {
                        item_id: item.item_id.toString(),
                        uom_id: item.uom_id.toString(),
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        discount_percent: item.discount_percent || 0,
                        discount_amount: item.discount_amount || 0,
                        tax_percent: Number(itemRef?.tax_percent) || Number(itemRef?.tax_profile?.total_percentage) || 0,
                        cess_percent: Number(itemRef?.cess_percentage) || 0,
                        // rest will be calculated by useEffect
                    } as any;
                })
            });
        }
    };

    const addItemRow = () => {
        setData('items', [
            ...data.items,
            { 
                item_id: '', uom_id: '', quantity: 1, unit_price: 0, 
                discount_percent: 0, discount_amount: 0, taxable_amount: 0,
                cess_percent: 0, cess_amount: 0, tax_percent: 0, tax_amount: 0, 
                cgst_percent: 0, cgst_amount: 0, sgst_percent: 0, sgst_amount: 0, 
                igst_percent: 0, igst_amount: 0, utgst_percent: 0, utgst_amount: 0, 
                total_amount: 0 
            }
        ]);
    };

    const removeItemRow = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItemRow = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'item_id') {
            const item = items.find(i => i.id === parseInt(value));
            if (item) {
                newItems[index].unit_price = item.price || 0;
                newItems[index].tax_percent = Number(item.tax_percent) || Number(item.tax_profile?.total_percentage) || 0;
                newItems[index].cess_percent = Number(item.cess_percentage) || 0;
                newItems[index].uom_id = item.base_unit?.id?.toString() || '';
            }
        }

        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales/generate-invoice', {
            onSuccess: () => {
                reset();
                setSelectedOrderId('');
            }
        });
    };

    const baseTotalAmount = data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Invoice" />
            <form onSubmit={submit} className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Generate Invoice</h1>
                        <div className="flex items-center gap-2 bg-white border rounded-md px-2 py-1 shadow-sm transition-all hover:bg-gray-50">
                            <Label className="text-[10px] font-bold uppercase text-gray-500 whitespace-nowrap">Load Order:</Label>
                            <select 
                                className="text-xs border-none focus:ring-0 px-1 py-0 h-6 bg-transparent min-w-[150px] cursor-pointer"
                                value={selectedOrderId}
                                onChange={(e) => handleOrderSelect(e.target.value)}
                            >
                                <option value="">Select Order...</option>
                                {pendingOrders.map(order => (
                                    <option key={order.id} value={order.id}>{order.invoice_number}</option>
                                ))}
                            </select>
                        </div>

                        {/* Auto Approved Toggle (PO Consistency) */}
                        <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-1 shadow-sm transition-all hover:bg-gray-50">
                            <Checkbox 
                                id="is_auto_approved" 
                                checked={data.is_auto_approved}
                                onCheckedChange={(checked) => setData('is_auto_approved', !!checked)}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <Label htmlFor="is_auto_approved" className="text-[10px] font-black uppercase text-gray-500 cursor-pointer select-none">
                                Auto Approved
                            </Label>
                        </div>
                    </div>
                    <Link href="/sales/order-management">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-muted-foreground bg-white shadow-sm transition-all hover:text-blue-600">
                            <List className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Customer and Regime Details */}
                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6 transition-all hover:shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 border-b pb-6 mb-6">
                        <div className="space-y-4 col-span-1 md:col-span-3 lg:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Customer <span className="text-red-500">*</span></Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all hover:border-gray-300"
                                        value={data.location_id}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            const loc = customers.find(c => c.id === parseInt(id));
                                            setData({
                                                ...data,
                                                location_id: id,
                                                customer_id: loc?.customer_id?.toString() || ''
                                            });
                                        }}
                                        required
                                    >
                                        <option value="">--- Select Customer ---</option>
                                        {customers.map(cust => (
                                            <option key={cust.id} value={cust.id}>{cust.location_legal_name} - {cust.state || 'N/A'}</option>
                                        ))}
                                    </select>
                                    {errors.location_id && <p className="text-red-500 text-[10px] font-medium">{errors.location_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Invoice Date <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input 
                                            type="date" 
                                            className="pl-9 bg-white text-gray-700 border-gray-200 h-10 transition-all hover:border-gray-300" 
                                            value={data.invoice_date}
                                            onChange={(e) => setData('invoice_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Regime Status Badge */}
                        <div className="col-span-1 bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex flex-col justify-center items-center h-[120px] self-start ring-1 ring-blue-50 shadow-inner">
                            <span className="text-[10px] font-bold uppercase text-blue-600 mb-2 tracking-widest text-center">Tax Regime</span>
                            <span className="text-xs font-black text-blue-900 text-center leading-tight">
                                {regime === 'INTRA' ? 'LOCAL (CGST + SGST)' : regime === 'UT' ? 'UT (CGST + UTGST)' : 'INTERSTATE (IGST)'}
                            </span>
                            <div className="mt-2 h-1 w-8 bg-blue-400 rounded-full opacity-50"></div>
                        </div>
                    </div>

                    {/* Grand Total Preview */}
                    <div className="flex justify-end p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Invoice Grand Total</span>
                            <span className="text-3xl font-black text-[#162a5b]">₹ {data.grand_total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table with dynamic GST headers */}
                <div className="bg-white rounded-lg border shadow-lg overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle border-collapse">
                            <thead className="bg-[#21355e] text-white text-[11px] font-medium uppercase tracking-wider">
                                <tr>
                                    <th className="px-3 py-4 text-center border-r border-[#3a4d75] min-w-[200px]">Item Name</th>
                                    <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-24">UOM</th>
                                    <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-20">Qty</th>
                                    <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-24">Price</th>
                                    <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-28">Taxable Amt</th>
                                    
                                    {/* Dynamic GST Headers */}
                                    {regime === 'INTRA' && (
                                        <>
                                            <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-24">CGST</th>
                                            <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-24">SGST</th>
                                        </>
                                    )}
                                    {regime === 'UT' && (
                                        <>
                                            <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-24">CGST</th>
                                            <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-24">UTGST</th>
                                        </>
                                    )}
                                    {regime === 'INTER' && (
                                        <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-28">IGST</th>
                                    )}
                                    
                                    <th className="px-3 py-4 text-center border-r border-[#3a4d75] w-24">Total Tax</th>
                                    <th className="px-3 py-4 text-center border-r border-[#3a4d75] min-w-[120px]">Net Total</th>
                                    <th className="px-2 py-4 text-center bg-[#152340] w-12 hover:bg-black transition-colors">
                                        <PlusCircle className="h-4 w-4 mx-auto text-white cursor-pointer" onClick={addItemRow} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.items.map((row, index) => (
                                    <tr key={index} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="p-2 border-r bg-gray-50/20">
                                            <select 
                                                className="flex h-8 w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all hover:border-gray-300"
                                                value={row.item_id}
                                                onChange={(e) => updateItemRow(index, 'item_id', e.target.value)}
                                            >
                                                <option value="">Select Item</option>
                                                {items.map(item => (
                                                    <option key={item.id} value={item.id}>{item.item_name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2 border-r">
                                            <select 
                                                className="flex h-8 w-full rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 appearance-none pointer-events-none"
                                                value={row.uom_id}
                                            >
                                                <option value="">UOM</option>
                                                {uoms.map(uom => (
                                                    <option key={uom.id} value={uom.id}>{uom.uom_code}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2 border-r">
                                            <Input 
                                                type="number" 
                                                min="1"
                                                className="h-8 px-2 text-xs border-gray-200 text-center focus:ring-1 focus:ring-blue-500" 
                                                value={row.quantity}
                                                onChange={(e) => updateItemRow(index, 'quantity', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-2 border-r">
                                            <Input 
                                                type="number" 
                                                className="h-8 px-2 text-xs border-gray-200 text-right focus:ring-1 focus:ring-blue-500" 
                                                value={row.unit_price}
                                                onChange={(e) => updateItemRow(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-2 border-r text-center text-xs font-semibold text-gray-600 bg-gray-50/30">
                                            {row.taxable_amount.toFixed(2)}
                                        </td>

                                        {/* Dynamic GST Cells */}
                                        {regime === 'INTRA' && (
                                            <>
                                                <td className="p-2 border-r text-center bg-blue-50/10">
                                                    <div className="text-xs font-bold text-blue-700">{row.cgst_amount.toFixed(2)}</div>
                                                    <div className="text-[9px] text-gray-400">({row.cgst_percent}%)</div>
                                                </td>
                                                <td className="p-2 border-r text-center bg-blue-50/10">
                                                    <div className="text-xs font-bold text-blue-700">{row.sgst_amount.toFixed(2)}</div>
                                                    <div className="text-[9px] text-gray-400">({row.sgst_percent}%)</div>
                                                </td>
                                            </>
                                        )}
                                        {regime === 'UT' && (
                                            <>
                                                <td className="p-2 border-r text-center bg-indigo-50/10">
                                                    <div className="text-xs font-bold text-indigo-700">{row.cgst_amount.toFixed(2)}</div>
                                                    <div className="text-[9px] text-gray-400">({row.cgst_percent}%)</div>
                                                </td>
                                                <td className="p-2 border-r text-center bg-indigo-50/10">
                                                    <div className="text-xs font-bold text-indigo-700">{row.utgst_amount.toFixed(2)}</div>
                                                    <div className="text-[9px] text-gray-400">({row.utgst_percent}%)</div>
                                                </td>
                                            </>
                                        )}
                                        {regime === 'INTER' && (
                                            <td className="p-2 border-r text-center bg-amber-50/10">
                                                <div className="text-xs font-bold text-amber-700">{row.igst_amount.toFixed(2)}</div>
                                                <div className="text-[9px] text-gray-400">({row.igst_percent}%)</div>
                                            </td>
                                        )}

                                        <td className="p-2 border-r text-center text-xs font-bold text-gray-400">
                                            {row.tax_amount.toFixed(2)}
                                        </td>
                                        <td className="p-2 border-r text-right text-xs font-black text-gray-900 bg-gray-50/30 ring-inset ring-1 ring-gray-100 italic">
                                            ₹ {row.total_amount.toFixed(2)}
                                        </td>
                                        <td className="p-2 text-center bg-red-50/10">
                                            <button 
                                                type="button"
                                                onClick={() => removeItemRow(index)}
                                                className="transition-transform active:scale-95 group"
                                            >
                                                <Trash2 className="h-4 w-4 mx-auto text-red-300 group-hover:text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Final Totals Grid (Matching PO) */}
                <div className="flex justify-end mb-8">
                    <div className="w-full lg:w-4/5 border rounded-xl shadow-md overflow-hidden bg-white ring-1 ring-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#21355e] text-white text-[9px] font-black uppercase tracking-tighter text-center">
                                    <tr>
                                        <th className="px-4 py-3 border-r border-[#3a4d75]">Base Value</th>
                                        {regime === 'INTRA' && (
                                            <>
                                                <th className="px-4 py-3 border-r border-[#3a4d75]">CGST Sum</th>
                                                <th className="px-4 py-3 border-r border-[#3a4d75]">SGST Sum</th>
                                            </>
                                        )}
                                        {regime === 'UT' && (
                                            <>
                                                <th className="px-4 py-3 border-r border-[#3a4d75]">CGST Sum</th>
                                                <th className="px-4 py-3 border-r border-[#3a4d75]">UTGST Sum</th>
                                            </>
                                        )}
                                        {regime === 'INTER' && (
                                            <th className="px-4 py-3 border-r border-[#3a4d75]">IGST Sum</th>
                                        )}
                                        <th className="px-4 py-3 border-r border-[#3a4d75]">Additional</th>
                                        <th className="px-4 py-3 border-r border-[#3a4d75]">Discount</th>
                                        <th className="px-4 py-3 bg-[#162a5b] text-[11px]">Final Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white">
                                        <td className="px-4 py-4 border-r text-center text-xs font-semibold text-gray-600">
                                            {baseTotalAmount.toFixed(2)}
                                        </td>
                                        
                                        {regime === 'INTRA' && (
                                            <>
                                                <td className="px-4 py-4 border-r text-center text-xs font-black text-blue-600">
                                                    {data.cgst_amount.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 border-r text-center text-xs font-black text-blue-600">
                                                    {data.sgst_amount.toFixed(2)}
                                                </td>
                                            </>
                                        )}
                                        {regime === 'UT' && (
                                            <>
                                                <td className="px-4 py-4 border-r text-center text-xs font-black text-indigo-600">
                                                    {data.cgst_amount.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 border-r text-center text-xs font-black text-indigo-600">
                                                    {data.utgst_amount.toFixed(2)}
                                                </td>
                                            </>
                                        )}
                                        {regime === 'INTER' && (
                                            <td className="px-4 py-4 border-r text-center text-xs font-black text-amber-600">
                                                {data.igst_amount.toFixed(2)}
                                            </td>
                                        )}

                                        <td className="px-4 py-4 border-r text-center">
                                            <div className="flex items-center gap-1 border rounded px-2 py-1 bg-gray-50/50">
                                                <span className="text-[10px] text-gray-400">₹</span>
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-transparent border-none focus:ring-0 text-center text-xs font-medium h-4 p-0"
                                                    value={data.additional_charges}
                                                    onChange={(e) => setData('additional_charges', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-r text-center">
                                            <div className="flex items-center gap-1 border rounded px-2 py-1 bg-red-50/30">
                                                <span className="text-[10px] text-red-300">₹</span>
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-transparent border-none focus:ring-0 text-center text-xs font-medium text-red-600 h-4 p-0"
                                                    value={data.discount_amount}
                                                    onChange={(e) => setData('discount_amount', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center bg-gray-50/80">
                                            <div className="text-2xl font-black text-[#162a5b] tracking-tighter">
                                                ₹ {data.grand_total.toFixed(2)}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-4 pt-8 border-t border-gray-100">
                    <div className="w-full sm:flex-1 max-w-2xl bg-white p-4 rounded-xl shadow-inner border">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Invoice Internal Remarks</Label>
                        <textarea 
                            rows={2}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-600 resize-none min-h-[60px]" 
                            placeholder="Add internal notes about this invoice or special shipping instructions..." 
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px] w-full sm:w-auto">
                        {flash?.latest_invoice_id && (
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => window.open(`/sales/invoices/${flash.latest_invoice_id}/print`, '_blank')}
                                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-black uppercase tracking-wider h-12 rounded-xl flex items-center gap-2 shadow-sm"
                            >
                                <Printer className="h-4 w-4" />
                                <span>PRINT LATEST INVOICE</span>
                            </Button>
                        )}
                        <Button 
                            type="submit"
                            disabled={processing}
                            className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black italic uppercase tracking-wider px-12 h-14 text-sm rounded-xl shadow-xl transition-all hover:translate-y-[-4px] active:translate-y-0"
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 fill-white" />
                                    <span>GENERATE INVOICE</span>
                                </div>
                            )}
                        </Button>
                        <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">Ensuring GST Compliance v2.1</p>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
