import { Head, usePage, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, PlusCircle, Trash2, List, Zap } from 'lucide-react';
import { useEffect, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase', href: '#' },
    { title: 'Generate PO', href: '/purchase/generate-po' }
];

export default function GeneratePO() {
    const { locations, suppliers, items } = usePage().props as any;

    const { data, setData, post, processing, errors } = useForm({
        location_id: '',
        supplier_id: '',
        reference_bill_no: '',
        reference_challan_no: '',
        po_date: new Date().toISOString().split('T')[0],
        exp_order_date: new Date().toISOString().split('T')[0],
        inv_date: new Date().toISOString().split('T')[0],
        discount_amount: 0,
        total_tax_amount: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        utgst_amount: 0,
        additional_charges: 0,
        grand_total: 0,
        remarks: '',
        is_auto_approved: false,
        items: [
            {
                item_id: '',
                uom: '',
                qty: 1,
                fat_value: '',
                last_price: 0,
                current_price: 0,
                expire_date: '',
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

    const UT_LIST = ['chandigarh', 'ladakh', 'lakshadweep', 'andaman and nicobar islands', 'dadra and nagar haveli and daman and diu'];

    // Helper to calculate totals based on item rows
    useEffect(() => {
        let totalTaxable = 0;
        let totalTax = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;
        let totalUTGST = 0;

        const selectedSupplier = suppliers.find((s: any) => s.id.toString() === data.supplier_id.toString());
        const supplierState = (selectedSupplier?.state || '').toLowerCase();
        
        let regime = 'INTER';
        if (supplierState === 'gujarat') regime = 'INTRA';
        else if (UT_LIST.includes(supplierState)) regime = 'UT';

        const updatedItems = data.items.map(item => {
            const baseAmount = Number(item.qty) * Number(item.current_price);
            
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

        // Update state
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
    }, [data.supplier_id, JSON.stringify(data.items.map(i => ({id: i.item_id, q: i.qty, p: i.current_price, t: i.tax_percent, d: i.discount_percent, da: i.discount_amount, cp: i.cess_percent}))), data.additional_charges, data.discount_amount]);

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'item_id') {
            const selectedItem = items.find((i: any) => i.id.toString() === value.toString());
            if (selectedItem) {
                newItems[index].current_price = selectedItem.price;
                newItems[index].uom = selectedItem.base_unit?.uom_code || selectedItem.uom;
                newItems[index].tax_percent = selectedItem.tax_percent;
                newItems[index].cess_percent = selectedItem.cess_percent;
            }
        }

        setData('items', newItems);
    };

    const addItemRow = () => {
        setData('items', [...data.items, {
            item_id: '', uom: '', qty: 1, fat_value: '', last_price: 0, current_price: 0, expire_date: '',
            discount_percent: 0, discount_amount: 0, taxable_amount: 0, cess_percent: 0, cess_amount: 0,
            tax_percent: 0, tax_amount: 0, cgst_percent: 0, cgst_amount: 0, 
            sgst_percent: 0, sgst_amount: 0, igst_percent: 0, igst_amount: 0, 
            utgst_percent: 0, utgst_amount: 0, total_amount: 0
        }]);
    };

    const removeItemRow = (index: number) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/purchase/generate-po');
    };

    const baseTotalAmount = data.items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.current_price)), 0);

    const regime = useMemo(() => {
        const selectedSupplier = suppliers.find((s: any) => s.id.toString() === data.supplier_id.toString());
        const state = (selectedSupplier?.state || '').toLowerCase();
        if (state === 'gujarat') return 'INTRA';
        if (UT_LIST.includes(state)) return 'UT';
        return 'INTER';
    }, [data.supplier_id, suppliers]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Purchase Order" />
            <form onSubmit={submit} className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Generate Purchase Order</h1>
                    <div className="flex items-center gap-2">
                        {errors.error && (
                            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-medium border border-red-100 animate-pulse">
                                {errors.error}
                            </div>
                        )}
                        <Link href="/purchase/summary">
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                                <List className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <div className="space-y-4 col-span-1 md:col-span-3 lg:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Location</Label>
                                    <select 
                                        value={data.location_id} 
                                        onChange={e => setData('location_id', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                                    >
                                        <option value="">--- Select Location ---</option>
                                        {locations?.map((loc: any) => (
                                            <option key={loc.id} value={loc.id}>{loc.location_legal_name}</option>
                                        ))}
                                    </select>
                                    {errors.location_id && <span className="text-red-500 text-xs">{errors.location_id}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Supplier</Label>
                                    <select 
                                        value={data.supplier_id} 
                                        onChange={e => setData('supplier_id', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                                    >
                                        <option value="">--- Select Supplier ---</option>
                                        {suppliers?.map((sup: any) => (
                                            <option key={sup.id} value={sup.id}>{sup.supplier_name} - {sup.state || 'N/A'}</option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <span className="text-red-500 text-xs">{errors.supplier_id}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Ref Bill No.</Label>
                                    <Input value={data.reference_bill_no} onChange={e => setData('reference_bill_no', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Ref Challan No.</Label>
                                    <Input value={data.reference_challan_no} onChange={e => setData('reference_challan_no', e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2 relative">
                                    <Label className="text-xs text-muted-foreground font-semibold">PO Date</Label>
                                    <Input type="date" value={data.po_date} onChange={e => setData('po_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Exp. Order Date</Label>
                                    <Input type="date" value={data.exp_order_date} onChange={e => setData('exp_order_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Inv Date</Label>
                                    <Input type="date" value={data.inv_date} onChange={e => setData('inv_date', e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex flex-col justify-center items-center h-[120px] self-start mt-6">
                            <span className="text-[10px] font-bold uppercase text-blue-600 mb-1 tracking-widest text-center">Tax Regime</span>
                            <span className="text-sm font-black text-blue-900 text-center">
                                {regime === 'INTRA' ? 'GUJARAT (CGST+SGST)' : regime === 'UT' ? 'UNION TERRITORY (CGST+UTGST)' : 'OTHER STATE (IGST)'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle border-collapse">
                            <thead className="bg-[#21355e] text-white text-[11px] font-medium leading-tight">
                                <tr>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] min-w-[200px]">Item Name</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">UOM</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-20">Qty</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-24">Price</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Taxable Amt</th>
                                    {regime === 'INTRA' && (
                                        <>
                                            <th className="px-3 py-3 text-center border-r border-[#3a4d75]">CGST</th>
                                            <th className="px-3 py-3 text-center border-r border-[#3a4d75]">SGST</th>
                                        </>
                                    )}
                                    {regime === 'UT' && (
                                        <>
                                            <th className="px-3 py-3 text-center border-r border-[#3a4d75]">CGST</th>
                                            <th className="px-3 py-3 text-center border-r border-[#3a4d75]">UTGST</th>
                                        </>
                                    )}
                                    {regime === 'INTER' && (
                                        <th className="px-3 py-3 text-center border-r border-[#3a4d75]">IGST</th>
                                    )}
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Total Tax</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Total Amt</th>
                                    <th className="px-2 py-3 text-center bg-[#152340]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border-r bg-gray-50/50">
                                            <select 
                                                value={item.item_id} 
                                                onChange={e => handleItemChange(index, 'item_id', e.target.value)}
                                                className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-[11px]"
                                            >
                                                <option value="">Select Item</option>
                                                {items?.map((i: any) => (
                                                    <option key={i.id} value={i.id}>{i.item_name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2 border-r align-top">
                                            <Input value={item.uom} readOnly className="h-8 px-2 text-xs bg-gray-100" />
                                        </td>
                                        <td className="p-2 border-r align-top">
                                            <Input type="number" min="1" value={item.qty} onChange={e => handleItemChange(index, 'qty', e.target.value)} className="h-8 px-2 text-xs" />
                                        </td>
                                        <td className="p-2 border-r align-top">
                                            <Input type="number" step="0.01" value={item.current_price} onChange={e => handleItemChange(index, 'current_price', e.target.value)} className="h-8 px-2 text-xs" />
                                        </td>
                                        <td className="p-2 border-r align-top text-center text-xs font-semibold pt-3">{item.taxable_amount.toFixed(2)}</td>
                                        {regime === 'INTRA' && (
                                            <>
                                                <td className="p-2 border-r align-top text-center text-[10px] pt-3 bg-green-50/30">
                                                    <div className="font-bold">{item.cgst_amount.toFixed(2)}</div>
                                                    <div className="text-gray-400 font-normal">({item.cgst_percent}%)</div>
                                                </td>
                                                <td className="p-2 border-r align-top text-center text-[10px] pt-3 bg-green-50/30">
                                                    <div className="font-bold">{item.sgst_amount.toFixed(2)}</div>
                                                    <div className="text-gray-400 font-normal">({item.sgst_percent}%)</div>
                                                </td>
                                            </>
                                        )}
                                        {regime === 'UT' && (
                                            <>
                                                <td className="p-2 border-r align-top text-center text-[10px] pt-3 bg-indigo-50/30">
                                                    <div className="font-bold">{item.cgst_amount.toFixed(2)}</div>
                                                    <div className="text-gray-400 font-normal">({item.cgst_percent}%)</div>
                                                </td>
                                                <td className="p-2 border-r align-top text-center text-[10px] pt-3 bg-indigo-50/30">
                                                    <div className="font-bold">{item.utgst_amount.toFixed(2)}</div>
                                                    <div className="text-gray-400 font-normal">({item.utgst_percent}%)</div>
                                                </td>
                                            </>
                                        )}
                                        {regime === 'INTER' && (
                                            <td className="p-2 border-r align-top text-center text-[10px] pt-3 bg-amber-50/30">
                                                <div className="font-bold">{item.igst_amount.toFixed(2)}</div>
                                                <div className="text-gray-400 font-normal">({item.igst_percent}%)</div>
                                            </td>
                                        )}
                                        <td className="p-2 border-r align-top text-center text-xs pt-3 font-semibold">{item.tax_amount.toFixed(2)}</td>
                                        <td className="p-2 border-r align-top text-center text-xs font-bold pt-3">{item.total_amount.toFixed(2)}</td>
                                        <td className="p-2 bg-red-50/50 align-middle text-center">
                                            <button type="button" onClick={() => removeItemRow(index)}>
                                                <Trash2 className="h-4 w-4 mx-auto text-red-500" />
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

                {/* Totals Table */}
                <div className="flex justify-end mb-6">
                    <div className="w-full lg:w-4/5 border rounded-md shadow-sm overflow-hidden bg-white">
                        <table className="w-full text-[10px] text-left">
                            <thead className="bg-[#21355e] text-white font-medium text-center uppercase tracking-tighter">
                                <tr>
                                    <th className="px-2 py-2 border-r border-[#3a4d75]">Base Amt</th>
                                    {regime === 'INTRA' && (
                                        <>
                                            <th className="px-2 py-2 border-r border-[#3a4d75]">Total CGST</th>
                                            <th className="px-2 py-2 border-r border-[#3a4d75]">Total SGST</th>
                                        </>
                                    )}
                                    {regime === 'UT' && (
                                        <>
                                            <th className="px-2 py-2 border-r border-[#3a4d75]">Total CGST</th>
                                            <th className="px-2 py-2 border-r border-[#3a4d75]">Total UTGST</th>
                                        </>
                                    )}
                                    {regime === 'INTER' && (
                                        <th className="px-2 py-2 border-r border-[#3a4d75]">Total IGST</th>
                                    )}
                                    <th className="px-2 py-2 border-r border-[#3a4d75]">Addl. Charges</th>
                                    <th className="px-2 py-2 border-r border-[#3a4d75]">Discount</th>
                                    <th className="px-2 py-2">Grand Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border-r text-center font-semibold">{baseTotalAmount.toFixed(2)}</td>
                                    {regime === 'INTRA' && (
                                        <>
                                            <td className="p-2 border-r text-center text-blue-600 font-bold">{data.cgst_amount.toFixed(2)}</td>
                                            <td className="p-2 border-r text-center text-blue-600 font-bold">{data.sgst_amount.toFixed(2)}</td>
                                        </>
                                    )}
                                    {regime === 'UT' && (
                                        <>
                                            <td className="p-2 border-r text-center text-indigo-600 font-bold">{data.cgst_amount.toFixed(2)}</td>
                                            <td className="p-2 border-r text-center text-indigo-600 font-bold">{data.utgst_amount.toFixed(2)}</td>
                                        </>
                                    )}
                                    {regime === 'INTER' && (
                                        <td className="p-2 border-r text-center text-amber-600 font-bold">{data.igst_amount.toFixed(2)}</td>
                                    )}
                                    <td className="p-2 border-r text-center">
                                        <Input type="number" step="0.01" value={data.additional_charges} onChange={e => setData('additional_charges', Number(e.target.value))} className="h-7 text-[10px] text-center" />
                                    </td>
                                    <td className="p-2 border-r text-center">
                                        <Input type="number" step="0.01" value={data.discount_amount} onChange={e => setData('discount_amount', Number(e.target.value))} className="h-7 text-[10px] text-center" />
                                    </td>
                                    <td className="p-2 text-center text-xl font-bold text-[#162a5b] bg-gray-50/50">
                                        ₹ {data.grand_total.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mt-6 pt-6 border-t border-gray-100">
                    <div className="w-full sm:flex-1 max-w-2xl flex flex-col gap-4">
                        <div>
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Order Remarks / Internal Notes</Label>
                            <Input value={data.remarks} onChange={e => setData('remarks', e.target.value)} className="bg-white text-gray-700 h-11 w-full rounded-xl" placeholder="Type any specific instructions..." />
                        </div>
                        <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 w-fit">
                            <input 
                                type="checkbox" 
                                id="auto_approve"
                                checked={data.is_auto_approved} 
                                onChange={e => setData('auto_approve', e.target.checked)}
                                className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <Label htmlFor="auto_approve" className="text-xs font-bold text-indigo-900 cursor-pointer flex items-center gap-2">
                                < Zap className="size-3" /> AUTO APPROVE THIS PURCHASE ORDER
                            </Label>
                        </div>
                    </div>

                    <Button type="submit" disabled={processing} className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black italic uppercase px-12 h-11 text-xs rounded-xl shadow-lg">
                        {processing ? 'GENERATING...' : 'GENERATE PURCHASE ORDER'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
