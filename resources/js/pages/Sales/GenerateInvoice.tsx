import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, PlusCircle, Trash2, List, Search } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface Customer {
    id: number;
    customer_name: string;
}

interface Location {
    id: number;
    location_legal_name: string;
}

interface Item {
    id: number;
    item_name: string;
    price: number;
    tax_percent: number;
    category?: {
        item_category_name: string;
    }
    base_unit?: {
        id: number;
        uom_short_name: string;
    }
}

interface Uom {
    id: number;
    uom_short_name: string;
}

interface Tax {
    id: number;
    tax_name: string;
    percentage: number;
}

interface SalesInvoiceItem {
    id: number;
    item_id: number;
    uom_id: number;
    quantity: number;
    unit_price: number;
    tax_percentage: number;
    discount_amount: number;
    item: Item;
    uom: Uom;
}

interface PendingOrder {
    id: number;
    invoice_number: string;
    customer_id: number;
    location_id: number;
    remarks: string;
    items: SalesInvoiceItem[];
}

interface Props {
    customers: Customer[];
    locations: Location[];
    items: Item[];
    uoms: Uom[];
    taxes: Tax[];
    pendingOrders: PendingOrder[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales', href: '#' },
    { title: 'Generate Invoice', href: '/sales/generate-invoice' },
];

export default function GenerateInvoice({ 
    customers = [], 
    locations = [], 
    items = [], 
    uoms = [], 
    taxes = [], 
    pendingOrders = [] 
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        invoice_date: new Date().toISOString().split('T')[0],
        customer_id: '',
        location_id: '',
        reference_bill_number: '',
        reference_challan_number: '',
        remarks: '',
        discount_amount: 0,
        items: [
            { item_id: '', uom_id: '', quantity: 0, unit_price: 0, tax_percentage: 0, discount_amount: 0, total_amount: 0 }
        ]
    });

    const [selectedOrderId, setSelectedOrderId] = useState<string>('');

    // Handle Sales Order selection
    const handleOrderSelect = (orderId: string) => {
        setSelectedOrderId(orderId);
        if (!orderId) return;

        const order = pendingOrders.find(o => o.id === parseInt(orderId));
        if (order) {
            setData({
                ...data,
                customer_id: order.customer_id.toString(),
                location_id: order.location_id.toString(),
                remarks: order.remarks || '',
                items: order.items.map(item => ({
                    item_id: item.item_id.toString(),
                    uom_id: item.uom_id.toString(),
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    tax_percentage: item.tax_percentage,
                    discount_amount: item.discount_amount,
                    total_amount: (item.quantity * item.unit_price) + ((item.quantity * item.unit_price) * item.tax_percentage / 100) - item.discount_amount
                }))
            });
        }
    };

    const addItemRow = () => {
        setData('items', [
            ...data.items,
            { item_id: '', uom_id: '', quantity: 0, unit_price: 0, tax_percentage: 0, discount_amount: 0, total_amount: 0 }
        ]);
    };

    const removeItemRow = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItemRow = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        const row = { ...newItems[index], [field]: value };

        // Auto-fill price and tax when item is selected
        if (field === 'item_id') {
            const item = items.find(i => i.id === parseInt(value));
            if (item) {
                row.unit_price = item.price || 0;
                row.tax_percentage = item.tax_percent || 0;
                row.uom_id = item.base_unit?.id?.toString() || '';
            }
        }

        // Calculate total for the row
        const baseAmount = row.quantity * row.unit_price;
        const taxAmount = baseAmount * (row.tax_percentage / 100);
        row.total_amount = baseAmount + taxAmount - (row.discount_amount || 0);

        newItems[index] = row;
        setData('items', newItems);
    };

    // Overall calculations
    const totals = useMemo(() => {
        let subtotal = 0;
        let totalTax = 0;
        data.items.forEach(item => {
            const rowBase = item.quantity * item.unit_price;
            subtotal += rowBase;
            totalTax += rowBase * (item.tax_percentage / 100);
        });
        const grandTotal = subtotal + totalTax - (data.discount_amount || 0);
        return { subtotal, totalTax, grandTotal };
    }, [data.items, data.discount_amount]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales/generate-invoice', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Invoice" />
            <form onSubmit={submit} className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Generate Invoice</h1>
                        <div className="flex items-center gap-2 bg-white border rounded-md px-2 py-1 shadow-sm">
                            <Label className="text-[10px] font-bold uppercase text-gray-500 whitespace-nowrap">Load Order:</Label>
                            <select 
                                className="text-xs border-none focus:ring-0 px-1 py-0 h-6 bg-transparent min-w-[150px]"
                                value={selectedOrderId}
                                onChange={(e) => handleOrderSelect(e.target.value)}
                            >
                                <option value="">--- Select Sales Order ---</option>
                                {pendingOrders.map(order => (
                                    <option key={order.id} value={order.id}>{order.invoice_number}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Link href="/reports/sales/summary">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                            <List className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">

                        <div className="space-y-4 col-span-1 md:col-span-3 lg:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Location <span className="text-red-500">*</span></Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={data.location_id}
                                        onChange={(e) => setData('location_id', e.target.value)}
                                        required
                                    >
                                        <option value="">--- Select Location ---</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.location_legal_name}</option>
                                        ))}
                                    </select>
                                    {errors.location_id && <p className="text-red-500 text-[10px]">{errors.location_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Customer <span className="text-red-500">*</span></Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        required
                                    >
                                        <option value="">--- Select Customer ---</option>
                                        {customers.map(cust => (
                                            <option key={cust.id} value={cust.id}>{cust.customer_name}</option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <p className="text-red-500 text-[10px]">{errors.customer_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Ref. Bill No.</Label>
                                    <Input 
                                        className="bg-white text-gray-700 border-gray-200" 
                                        placeholder="Enter Reference Bill Number" 
                                        value={data.reference_bill_number}
                                        onChange={(e) => setData('reference_bill_number', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Ref. Challan No.</Label>
                                    <Input 
                                        className="bg-white text-gray-700 border-gray-200" 
                                        placeholder="Enter Reference Challan Number" 
                                        value={data.reference_challan_number}
                                        onChange={(e) => setData('reference_challan_number', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-end">
                                    <div className="flex w-full overflow-hidden rounded-md border">
                                        <Button type="button" variant="ghost" className="flex-1 rounded-none border-r hover:bg-white text-muted-foreground h-10">Off</Button>
                                        <Button type="button" className="flex-1 rounded-none bg-[#f15e3b] hover:bg-[#d94f2f] text-white h-10">Dispatch-Now</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Invoice Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input 
                                            type="date" 
                                            className="pl-9 bg-white text-gray-700 border-gray-200" 
                                            value={data.invoice_date}
                                            onChange={(e) => setData('invoice_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 border rounded-xl shadow-md bg-white p-4 flex flex-col justify-center items-center h-[120px] self-start mt-6 ring-1 ring-blue-50">
                            <h3 className="text-sm text-gray-600 mb-1">Grand Total</h3>
                            <p className="text-xl font-bold text-[#162a5b]">₹ {totals.grandTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle border-collapse">
                            <thead className="bg-[#21355e] text-white text-[11px] font-medium uppercase tracking-wider">
                                <tr>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] min-w-[200px]">Item Name</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] min-w-[100px]">UOM</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-20">Qty</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] min-w-[100px]">Unit Price</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-24">Tax (%)</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-24">Disc. (Amt)</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] min-w-[120px]">Total</th>
                                    <th className="px-2 py-3 text-center bg-[#152340]">
                                        <PlusCircle className="h-4 w-4 mx-auto text-white cursor-pointer" onClick={addItemRow} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.items.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-2 border-r">
                                            <select 
                                                className="flex h-8 w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                                className="flex h-8 w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                value={row.uom_id}
                                                onChange={(e) => updateItemRow(index, 'uom_id', e.target.value)}
                                            >
                                                <option value="">UOM</option>
                                                {uoms.map(uom => (
                                                    <option key={uom.id} value={uom.id}>{uom.uom_short_name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2 border-r">
                                            <Input 
                                                type="number" 
                                                className="h-8 px-2 text-xs border-gray-200 text-center" 
                                                value={row.quantity}
                                                onChange={(e) => updateItemRow(index, 'quantity', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-2 border-r">
                                            <Input 
                                                type="number" 
                                                className="h-8 px-2 text-xs border-gray-200 text-right" 
                                                value={row.unit_price}
                                                onChange={(e) => updateItemRow(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-2 border-r">
                                            <Input 
                                                type="number" 
                                                className="h-8 px-2 text-xs border-gray-200 text-center text-red-600 bg-red-50/20" 
                                                value={row.tax_percentage}
                                                onChange={(e) => updateItemRow(index, 'tax_percentage', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-2 border-r">
                                            <Input 
                                                type="number" 
                                                className="h-8 px-2 text-xs border-gray-200 text-right" 
                                                value={row.discount_amount}
                                                onChange={(e) => updateItemRow(index, 'discount_amount', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-2 border-r text-right text-xs font-bold text-gray-900 bg-gray-50/30">
                                            ₹ {row.total_amount.toFixed(2)}
                                        </td>
                                        <td className="p-2 text-center bg-red-50/30">
                                            {data.items.length > 1 && (
                                                <Trash2 
                                                    className="h-4 w-4 mx-auto text-red-500 cursor-pointer hover:text-red-700 transition-colors" 
                                                    onClick={() => removeItemRow(index)} 
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <div className="w-full lg:w-2/5 border rounded-lg shadow-sm overflow-hidden bg-white">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Subtotal:</span>
                                <span>₹ {totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Total Tax:</span>
                                <span className="text-red-500">+ ₹ {totals.totalTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                                <span>Extra Discount:</span>
                                <div className="flex items-center gap-1 w-32 border rounded-md px-2 py-1">
                                    <span className="text-gray-400">₹</span>
                                    <input 
                                        type="number" 
                                        className="w-full bg-transparent border-none focus:ring-0 text-right text-xs font-medium"
                                        value={data.discount_amount}
                                        onChange={(e) => setData('discount_amount', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between text-sm font-black text-[#162a5b] border-t pt-3 uppercase tracking-wider">
                                <span>Grand Total:</span>
                                <span>₹ {totals.grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mt-6 pt-6 border-t border-gray-100">
                    <div className="w-full sm:flex-1 max-w-2xl">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Invoice Remarks</Label>
                        <Input 
                            className="bg-white border-gray-200 h-10 w-full" 
                            placeholder="Add any specific instructions or notes..." 
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                    </div>

                    <Button 
                        type="submit"
                        disabled={processing}
                        className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black italic uppercase tracking-wider px-12 h-11 text-xs rounded-xl shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-0"
                    >
                        {processing ? 'GENERATING...' : 'GENERATE INVOICE'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
