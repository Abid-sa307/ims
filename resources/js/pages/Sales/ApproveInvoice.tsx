import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, List, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';

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
    invoice: any;
    customers: Customer[];
    items: Item[];
    uoms: Uom[];
    taxes: Tax[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales', href: '#' },
    { title: 'Approve Invoice', href: '#' },
];

const UT_LIST = ['chandigarh', 'ladakh', 'lakshadweep', 'andaman and nicobar islands', 'dadra and nagar haveli and daman and diu'];

export default function ApproveInvoice({ 
    invoice,
    customers = [], 
    items = [], 
    uoms = [], 
    taxes = []
}: Props) {
    const { data, setData } = useForm({
        invoice_date: invoice.invoice_date,
        customer_id: invoice.customer_id?.toString() || '',
        location_id: invoice.location_id.toString(),
        remarks: invoice.remarks || '',
        discount_amount: Number(invoice.discount_amount),
        total_tax_amount: Number(invoice.total_tax_amount),
        cgst_amount: Number(invoice.cgst_amount),
        sgst_amount: Number(invoice.sgst_amount),
        igst_amount: Number(invoice.igst_amount),
        utgst_amount: Number(invoice.utgst_amount),
        additional_charges: Number(invoice.additional_charges),
        grand_total: Number(invoice.grand_total),
        items: invoice.items.map((item: any) => ({
            item_id: item.item_id.toString(),
            uom_id: item.uom_id.toString(),
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            discount_percent: Number(item.discount_percent),
            discount_amount: Number(item.discount_amount),
            taxable_amount: Number(item.taxable_amount),
            cess_percent: Number(item.cess_percent),
            cess_amount: Number(item.cess_amount),
            tax_percent: Number(item.tax_percent),
            tax_amount: Number(item.tax_amount),
            cgst_percent: Number(item.cgst_percent),
            cgst_amount: Number(item.cgst_amount),
            sgst_percent: Number(item.sgst_percent),
            sgst_amount: Number(item.sgst_amount),
            igst_percent: Number(item.igst_percent),
            igst_amount: Number(item.igst_amount),
            utgst_percent: Number(item.utgst_percent),
            utgst_amount: Number(item.utgst_amount),
            total_amount: Number(item.total_amount)
        }))
    });

    const regime = useMemo(() => {
        const selectedLoc = customers.find(c => c.id.toString() === data.location_id.toString());
        const state = (selectedLoc?.state || '').toLowerCase();
        if (state === 'gujarat') return 'INTRA';
        if (UT_LIST.includes(state)) return 'UT';
        return 'INTER';
    }, [data.location_id, customers]);

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this invoice?')) {
            router.post(`/sales/approve-invoice/${invoice.id}`);
        }
    };

    const handleReject = () => {
        if (confirm('Are you sure you want to reject this invoice?')) {
            router.post(`/sales/reject-invoice/${invoice.id}`);
        }
    };

    const baseTotalAmount = data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Approve Invoice" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Review Invoice: {invoice.invoice_number}</h1>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-wider border border-amber-200">
                            PENDING APPROVAL
                        </span>
                    </div>
                    <Link href="/sales/approved-invoice">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-muted-foreground bg-white shadow-sm transition-all hover:text-blue-600">
                            <List className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Customer and Regime Details */}
                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6 transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 border-b pb-6 mb-6">
                        <div className="space-y-4 col-span-1 md:col-span-3 lg:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Customer</Label>
                                    <div className="h-10 w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center">
                                        {invoice.location?.location_legal_name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Invoice Date</Label>
                                    <div className="h-10 w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center">
                                        {invoice.invoice_date}
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

                {/* Items Table */}
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
                                    <th className="px-3 py-4 text-center min-w-[120px]">Net Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.items.map((row: any, index: number) => (
                                    <tr key={index} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="p-3 border-r bg-gray-50/20 font-medium text-gray-700">
                                            {items.find(i => i.id.toString() === row.item_id)?.item_name}
                                        </td>
                                        <td className="p-3 border-r text-center text-gray-500">
                                            {uoms.find(u => u.id.toString() === row.uom_id)?.uom_code}
                                        </td>
                                        <td className="p-3 border-r text-center font-semibold text-gray-700">
                                            {row.quantity}
                                        </td>
                                        <td className="p-3 border-r text-right font-semibold text-gray-700">
                                            ₹ {row.unit_price.toFixed(2)}
                                        </td>
                                        <td className="p-3 border-r text-center text-xs font-semibold text-gray-600 bg-gray-50/30">
                                            {row.taxable_amount.toFixed(2)}
                                        </td>

                                        {regime === 'INTRA' && (
                                            <>
                                                <td className="p-3 border-r text-center bg-blue-50/10 text-xs font-bold text-blue-700">
                                                    {row.cgst_amount.toFixed(2)}
                                                </td>
                                                <td className="p-3 border-r text-center bg-blue-50/10 text-xs font-bold text-blue-700">
                                                    {row.sgst_amount.toFixed(2)}
                                                </td>
                                            </>
                                        )}
                                        {regime === 'UT' && (
                                            <>
                                                <td className="p-3 border-r text-center bg-indigo-50/10 text-xs font-bold text-indigo-700">
                                                    {row.cgst_amount.toFixed(2)}
                                                </td>
                                                <td className="p-3 border-r text-center bg-indigo-50/10 text-xs font-bold text-indigo-700">
                                                    {row.utgst_amount.toFixed(2)}
                                                </td>
                                            </>
                                        )}
                                        {regime === 'INTER' && (
                                            <td className="p-3 border-r text-center bg-amber-50/10 text-xs font-bold text-amber-700">
                                                {row.igst_amount.toFixed(2)}
                                            </td>
                                        )}

                                        <td className="p-3 border-r text-center text-xs font-bold text-gray-400">
                                            {row.tax_amount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-right text-xs font-black text-gray-900 bg-gray-50/30 italic">
                                            ₹ {row.total_amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Final Totals Grid */}
                <div className="flex justify-end mb-8">
                    <div className="w-full lg:w-4/5 border rounded-xl shadow-md overflow-hidden bg-white">
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

                                        <td className="px-4 py-4 border-r text-center text-xs font-semibold text-gray-600">
                                            {data.additional_charges.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-4 border-r text-center text-xs font-semibold text-red-600">
                                            {data.discount_amount.toFixed(2)}
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

                {/* Internal Remarks */}
                <div className="bg-white p-4 rounded-xl shadow-inner border mb-8">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Internal Remarks</Label>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap italic">
                        {data.remarks || 'No remarks provided.'}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-4 pt-8 border-t border-gray-100">
                    <Button 
                        onClick={handleReject}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black uppercase tracking-wider h-14 px-10 rounded-xl flex items-center gap-2 shadow-sm transition-all hover:translate-y-[-4px]"
                    >
                        <XCircle className="h-5 w-5" />
                        <span>REJECT INVOICE</span>
                    </Button>
                    
                    <Button 
                        onClick={handleApprove}
                        className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black uppercase tracking-wider px-14 h-14 text-sm rounded-xl shadow-xl transition-all hover:translate-y-[-4px] flex items-center gap-2"
                    >
                        <CheckCircle2 className="h-5 w-5" />
                        <span>APPROVE INVOICE</span>
                    </Button>
                </div>
                <p className="mt-6 text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest italic">Reviewing for Compliance v2.1</p>
            </div>
        </AppLayout>
    );
}
