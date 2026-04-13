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
    supplier: { supplier_name: string };
    location: { location_legal_name: string };
    total_amount: number;
    tax_amount: number;
    grand_total: number;
    status: string;
}

interface Props {
    reportData: { data: PurchaseOrder[]; links: any[] };
    locations: any[];
    suppliers: any[];
    filters: any;
}

export default function OrderSummary({ reportData, locations, suppliers, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Purchase Reports', href: '#' },
        { title: 'Purchase Order Summary', href: '/reports/purchase/order-summary' },
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
            subtitle="View a filtered summary of all purchase orders issued across your organization."
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
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Location</Label>
                            <select name="location_id" defaultValue={filters.location_id} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                <option value="">All Locations</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>{loc.location_legal_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Supplier</Label>
                            <select name="supplier_id" defaultValue={filters.supplier_id} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                <option value="">All Suppliers</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.supplier_name}</option>
                                ))}
                            </select>
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
                        <TableHead className="font-bold text-slate-800">PO Number</TableHead>
                        <TableHead className="font-bold text-slate-800">Order Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Supplier</TableHead>
                        <TableHead className="font-bold text-slate-800">Location</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Tax Amt</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Grand Total</TableHead>
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
                                <TableCell>{po.location?.location_legal_name || 'N/A'}</TableCell>
                                <TableCell className="text-right">₹{Number(po.tax_amount).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold">₹{Number(po.grand_total).toLocaleString()}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] uppercase font-black">
                                        {po.status || 'Completed'}
                                    </Badge>
                                </TableCell>
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
