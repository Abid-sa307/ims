import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, PlusCircle, Trash2, List, Save, Receipt } from 'lucide-react';
import { useEffect } from 'react';
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
    tax_profile?: {
        total_percentage: number;
    };
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

interface Props {
    customers: Customer[];
    items: Item[];
    uoms: Uom[];
    taxes: Tax[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '/sales/credit-note' },
    { title: 'Issue Credit Note', href: '#' },
];

export default function CreateCreditNote({ 
    customers = [], 
    items = [], 
    uoms = [], 
    taxes = [] 
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        location_id: '',
        remarks: '',
        total_amount: 0,
        tax_amount: 0,
        grand_total: 0,
        items: [
            { 
                item_id: '', 
                uom_id: '', 
                quantity: 1, 
                unit_price: 0, 
                tax_amount: 0, 
                total_amount: 0 
            }
        ]
    });

    useEffect(() => {
        let total = 0;
        let tax = 0;

        const updatedItems = data.items.map(item => {
            const itemRef = items.find(i => i.id.toString() === item.item_id);
            const taxRate = Number(itemRef?.tax_percent) || Number(itemRef?.tax_profile?.total_percentage) || 0;
            
            const subtotal = Number(item.quantity) * Number(item.unit_price);
            const rowTax = subtotal * (taxRate / 100);
            const rowTotal = subtotal + rowTax;

            total += subtotal;
            tax += rowTax;

            return {
                ...item,
                tax_amount: rowTax,
                total_amount: rowTotal
            };
        });

        setData(prev => ({
            ...prev,
            items: updatedItems,
            total_amount: total,
            tax_amount: tax,
            grand_total: total + tax
        }));
    }, [
        JSON.stringify(data.items.map(i => ({ id: i.item_id, q: i.quantity, p: i.unit_price })))
    ]);

    const addItemRow = () => {
        setData('items', [
            ...data.items,
            { item_id: '', uom_id: '', quantity: 1, unit_price: 0, tax_amount: 0, total_amount: 0 }
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
                newItems[index].uom_id = (item as any).base_unit?.id?.toString() || '';
            }
        }

        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales/credit-note');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Issue Credit Note" />
            <form onSubmit={submit} className="flex h-full flex-col p-8 overflow-y-auto bg-gray-50/50">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-100">
                            <Receipt className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Issue Credit Note</h1>
                            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase italic">Create a new post-sales adjustment</p>
                        </div>
                    </div>
                    <Link href="/sales/credit-note">
                        <Button type="button" variant="outline" size="icon" className="h-10 w-10 text-muted-foreground bg-white shadow-sm transition-all hover:text-red-600">
                            <List className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Basic Details */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8 transition-all hover:shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Location <span className="text-red-500">*</span></Label>
                            <select 
                                className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                value={data.location_id}
                                onChange={(e) => setData('location_id', e.target.value)}
                                required
                            >
                                <option value="">--- Select Customer ---</option>
                                {customers.map(cust => (
                                    <option key={cust.id} value={cust.id}>{cust.location_legal_name}</option>
                                ))}
                            </select>
                            {errors.location_id && <p className="text-red-500 text-[10px] font-bold uppercase italic">{errors.location_id}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Note Date <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <Input 
                                    type="date" 
                                    className="pl-12 bg-slate-50/50 text-slate-900 border-slate-200 h-12 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium" 
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle border-collapse">
                            <thead className="bg-[#162a5b] text-white text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-5 border-r border-slate-700/30">Item Description</th>
                                    <th className="px-6 py-5 border-r border-slate-700/30 w-32">UOM</th>
                                    <th className="px-6 py-5 border-r border-slate-700/30 w-28 text-center">Quantity</th>
                                    <th className="px-6 py-5 border-r border-slate-700/30 w-32 text-right">Unit Price</th>
                                    <th className="px-6 py-5 border-r border-slate-700/30 w-32 text-right">Tax Amount</th>
                                    <th className="px-6 py-5 w-40 text-right">Row Total</th>
                                    <th className="px-4 py-5 text-center bg-slate-900 w-16">
                                        <PlusCircle className="h-5 w-5 mx-auto text-red-500 cursor-pointer hover:scale-110 transition-transform" onClick={addItemRow} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((row, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 border-r">
                                            <select 
                                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                value={row.item_id}
                                                onChange={(e) => updateItemRow(index, 'item_id', e.target.value)}
                                            >
                                                <option value="">Select Item</option>
                                                {items.map(item => (
                                                    <option key={item.id} value={item.id}>{item.item_name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4 border-r">
                                            <select 
                                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 appearance-none pointer-events-none font-bold"
                                                value={row.uom_id}
                                            >
                                                <option value="">UOM</option>
                                                {uoms.map(uom => (
                                                    <option key={uom.id} value={uom.id}>{uom.uom_code}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4 border-r">
                                            <Input 
                                                type="number" 
                                                className="h-10 px-3 text-xs border-slate-200 text-center focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold" 
                                                value={row.quantity}
                                                onChange={(e) => updateItemRow(index, 'quantity', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-4 border-r">
                                            <Input 
                                                type="number" 
                                                className="h-10 px-3 text-xs border-slate-200 text-right focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold" 
                                                value={row.unit_price}
                                                onChange={(e) => updateItemRow(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-4 border-r text-right text-xs font-black text-slate-400">
                                            {row.tax_amount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-right text-xs font-black text-slate-900 italic">
                                            ₹ {row.total_amount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                type="button"
                                                onClick={() => removeItemRow(index)}
                                                className="transition-transform active:scale-95 group"
                                            >
                                                <Trash2 className="h-5 w-5 mx-auto text-slate-300 group-hover:text-red-500 transition-colors" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary and Submission */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 w-full bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Adjustment Reason / Remarks</Label>
                        <textarea 
                            rows={4}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium resize-none" 
                            placeholder="State the reason for this credit adjustment (e.g., Goods returned by customer, Price correction, Damaged stock)..." 
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                    </div>

                    <div className="w-full lg:w-96 bg-[#162a5b] rounded-2xl p-8 text-white shadow-2xl shadow-slate-200">
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Taxable</span>
                                <span className="font-bold text-lg italic">₹ {data.total_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Tax</span>
                                <span className="font-bold text-lg italic">₹ {data.tax_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-[11px] font-black uppercase tracking-widest text-red-500">Grand Total</span>
                                <span className="text-3xl font-black italic tracking-tighter">₹ {data.grand_total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-red-600 hover:bg-red-700 h-16 rounded-xl font-black uppercase tracking-widest italic text-lg shadow-xl shadow-red-900/20 transition-all hover:translate-y-[-4px] active:translate-y-0 flex items-center justify-center gap-3"
                        >
                            <Save className="size-6" />
                            {processing ? 'Processing...' : 'Issue Credit Note'}
                        </Button>
                        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-6 italic opacity-50">Authorized Adjustment Ledger v1.4</p>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
