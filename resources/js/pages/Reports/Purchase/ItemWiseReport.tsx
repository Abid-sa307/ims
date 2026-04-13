import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ItemPurchase {
    id: number;
    item: { item_name: string };
    purchaseOrder: {
        order_number: string;
        order_date: string;
        supplier: { supplier_name: string };
    };
    quantity: number;
    unit_price: number;
    total_amount: number;
}

interface Props {
    reportData: { data: ItemPurchase[]; links: any[] };
    items: any[];
    suppliers: any[];
    filters: any;
}

export default function ItemWiseReport({ reportData, items, suppliers, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Purchase Reports', href: '#' },
        { title: 'Item Wise Purchase Report', href: '/reports/purchase/item-wise' },
    ];

    const [processing, setProcessing] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(filters.item_id || '');
    const [selectedSupplier, setSelectedSupplier] = React.useState(filters.supplier_id || '');

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());
        data.item_id = selectedItem;
        data.supplier_id = selectedSupplier;
        router.get('/reports/purchase/item-wise', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Item Wise Purchase Report"
            subtitle="Detailed purchase history filtered by item, supplier, and date range."
            breadcrumbs={breadcrumbs}
            filters={
                <form onSubmit={handleFilter} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date From <span className="text-red-500">*</span></Label>
                            <Input type="date" name="date_from" defaultValue={filters.date_from} className="h-9" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date To <span className="text-red-500">*</span></Label>
                            <Input type="date" name="date_to" defaultValue={filters.date_to} className="h-9" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Item</Label>
                            <Select onValueChange={setSelectedItem} defaultValue={selectedItem}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="All Items" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Items</SelectItem>
                                    {items.map((item) => <SelectItem key={item.id} value={item.id.toString()}>{item.item_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Supplier</Label>
                            <Select onValueChange={setSelectedSupplier} defaultValue={selectedSupplier}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="All Suppliers" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Suppliers</SelectItem>
                                    {suppliers.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.supplier_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="h-9 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            {processing ? 'Searching...' : 'APPLY FILTERS'}
                        </Button>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">PO Ref</TableHead>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Supplier</TableHead>
                        <TableHead className="font-bold text-slate-800">Item Name</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Qty</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Unit Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-blue-600 font-medium">{row.purchaseOrder?.order_number}</TableCell>
                                <TableCell>{row.purchaseOrder?.order_date ? new Date(row.purchaseOrder.order_date).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{row.purchaseOrder?.supplier?.supplier_name || 'N/A'}</TableCell>
                                <TableCell className="font-bold">{row.item?.item_name}</TableCell>
                                <TableCell className="text-right">{row.quantity}</TableCell>
                                <TableCell className="text-right">₹{Number(row.unit_price).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold">₹{Number(row.total_amount).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400 font-medium italic">
                                No records found. Select date range and apply filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
