import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';

interface PurchaseOrder {
    id: number;
    order_number: string;
    order_date: string;
    supplier: {
        supplier_name: string;
    };
    location: {
        location_name: string;
    };
    total_amount: number;
    tax_amount: number;
    grand_total: number;
}

interface Props {
    reportData: {
        data: PurchaseOrder[];
        links: any[];
    };
    locations: any[];
    filters: any;
}

export default function OrderSummary({ reportData, locations, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Purchase Reports', href: '#' },
        { title: 'Order Summary', href: '/reports/purchase/order-summary' },
    ];

    const [processing, setProcessing] = React.useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        router.get('/reports/purchase/order-summary', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Purchase Order Summary"
            subtitle="View a summary of all purchase orders issued across your organization."
            breadcrumbs={breadcrumbs}
            filters={
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="date_from" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date From</Label>
                        <Input type="date" name="date_from" defaultValue={filters.date_from} className="h-9" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="date_to" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date To</Label>
                        <Input type="date" name="date_to" defaultValue={filters.date_to} className="h-9" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="location_id" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Location</Label>
                        <select name="location_id" defaultValue={filters.location_id} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            <option value="">All Locations</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.location_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            APPLY FILTERS
                        </Button>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">PO Number</TableHead>
                        <TableHead className="font-bold text-slate-800">Order Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Supplier</TableHead>
                        <TableHead className="font-bold text-slate-800">Location</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Tax Amt</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total Amt</TableHead>
                        <TableHead className="text-center font-bold text-slate-800">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((po) => (
                            <TableRow key={po.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-medium text-blue-600">{po.order_number}</TableCell>
                                <TableCell>{new Date(po.order_date).toLocaleDateString()}</TableCell>
                                <TableCell>{po.supplier?.supplier_name || 'N/A'}</TableCell>
                                <TableCell>{po.location?.location_name || 'N/A'}</TableCell>
                                <TableCell className="text-right">₹{Number(po.tax_amount).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold">₹{Number(po.grand_total).toLocaleString()}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] uppercase font-black uppercase">Completed</Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400 font-medium italic">
                                No purchase records found for the selected filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
