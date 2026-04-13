import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';

interface SalesInvoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    customer: { customer_name: string };
    location: { location_legal_name: string };
    total_amount: number;
    tax_amount: number;
    grand_total: number;
    status: string;
}

interface Props {
    reportData: { data: SalesInvoice[]; links: any[] };
    customers: any[];
    locations: any[];
    filters: any;
}

export default function SalesSummary({ reportData, customers, locations, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Sales Summary', href: '/reports/sales/summary' },
    ];

    const [processing, setProcessing] = React.useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        router.get('/reports/sales/summary', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Sales Summary Report"
            subtitle="Overview of all sales invoices, filterable by date, customer, and location."
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
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Customer</Label>
                            <select name="customer_id" defaultValue={filters.customer_id} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                <option value="">All Customers</option>
                                {customers.map((c) => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Location</Label>
                            <select name="location_id" defaultValue={filters.location_id} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                <option value="">All Locations</option>
                                {locations.map((loc) => <option key={loc.id} value={loc.id}>{loc.location_legal_name}</option>)}
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
                        <TableHead className="font-bold text-slate-800">Invoice #</TableHead>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Customer</TableHead>
                        <TableHead className="font-bold text-slate-800">Location</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Tax</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Grand Total</TableHead>
                        <TableHead className="text-center font-bold text-slate-800">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((invoice) => (
                            <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-medium text-blue-600">{invoice.invoice_number}</TableCell>
                                <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                                <TableCell>{invoice.customer?.customer_name || 'N/A'}</TableCell>
                                <TableCell>{invoice.location?.location_legal_name || 'N/A'}</TableCell>
                                <TableCell className="text-right">₹{Number(invoice.tax_amount).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-slate-900">₹{Number(invoice.grand_total).toLocaleString()}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] uppercase font-black">
                                        {invoice.status || 'Active'}
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
