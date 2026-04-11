import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SalesItem {
    id: number;
    item: {
        item_name: string;
    };
    invoice: {
        invoice_number: string;
        invoice_date: string;
        customer: {
            customer_name: string;
        };
    };
    quantity: number;
    unit_price: number;
    total_amount: number;
}

interface Props {
    reportData: {
        data: SalesItem[];
        links: any[];
    };
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

    const handleFilter = () => {
        router.get('/reports/sales/item-wise', { item_id: selectedItem }, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Item Wise Sales Report"
            subtitle="Analyze which items are driving your sales performance."
            breadcrumbs={breadcrumbs}
            filters={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1 col-span-1 md:col-span-3">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Select Item</Label>
                        <Select onValueChange={setSelectedItem} defaultValue={selectedItem}>
                            <SelectTrigger className="h-9 bg-white text-slate-900 border-slate-200">
                                <SelectValue placeholder="All Items" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Items</SelectItem>
                                {items.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>{item.item_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleFilter} disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            SEARCH SALES HISTORY
                        </Button>
                    </div>
                </div>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Invoice #</TableHead>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Customer</TableHead>
                        <TableHead className="font-bold text-slate-800">Item Name</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Qty Sold</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Selling Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total Revenue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-blue-600 font-medium">{row.invoice.invoice_number}</TableCell>
                                <TableCell>{new Date(row.invoice.invoice_date).toLocaleDateString()}</TableCell>
                                <TableCell>{row.invoice.customer.customer_name}</TableCell>
                                <TableCell className="font-bold">{row.item.item_name}</TableCell>
                                <TableCell className="text-right">{row.quantity}</TableCell>
                                <TableCell className="text-right">₹{Number(row.unit_price).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold">₹{Number(row.total_amount).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400 font-medium italic">
                                Select an item to view its sales history.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
