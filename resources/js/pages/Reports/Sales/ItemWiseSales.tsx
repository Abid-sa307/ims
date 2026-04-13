import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SalesInvoiceItem {
    id: number;
    item: { item_name: string };
    invoice: {
        invoice_number: string;
        invoice_date: string;
        customer: { customer_name: string };
    };
    quantity: number;
    unit_price: number;
    total_amount: number;
}

interface Props {
    reportData: { data: SalesInvoiceItem[]; links: any[] };
    items: any[];
    filters: any;
}

export default function ItemWiseSales({ reportData, items, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Item Wise Sales Report', href: '/reports/sales/item-wise' },
    ];

    const [processing, setProcessing] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(filters.item_id || '');

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());
        data.item_id = selectedItem;
        router.get('/reports/sales/item-wise', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Item Wise Sales Report"
            subtitle="Detailed sales history filtered by item and date range."
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
                        <div className="flex items-end">
                            <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                                {processing ? 'Searching...' : 'APPLY FILTERS'}
                            </Button>
                        </div>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Invoice Ref</TableHead>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Customer</TableHead>
                        <TableHead className="font-bold text-slate-800">Item Name</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Qty Sold</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Unit Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-blue-600 font-medium">{row.invoice?.invoice_number}</TableCell>
                                <TableCell>{row.invoice?.invoice_date ? new Date(row.invoice.invoice_date).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{row.invoice?.customer?.customer_name || 'N/A'}</TableCell>
                                <TableCell className="font-bold text-slate-700">{row.item?.item_name}</TableCell>
                                <TableCell className="text-right">{row.quantity}</TableCell>
                                <TableCell className="text-right">₹{Number(row.unit_price).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-black">₹{Number(row.total_amount).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400 font-medium italic">
                                No records found. Select a date range and apply filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
