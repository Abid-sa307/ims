import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SalesInvoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    customer: { customer_name: string };
    location: { location_legal_name: string };
    grand_total: number;
}

interface Props {
    reportData: { data: SalesInvoice[]; links: any[] };
    customers: any[];
    filters: any;
}

export default function CustomerWiseSales({ reportData, customers, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Customer Wise Sales Report', href: '/reports/sales/customer-wise' },
    ];

    const [processing, setProcessing] = React.useState(false);
    const [selectedCustomer, setSelectedCustomer] = React.useState(filters.customer_id || '');

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());
        data.customer_id = selectedCustomer;
        router.get('/reports/sales/customer-wise', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Customer Wise Sales Report"
            subtitle="Analyze sales performance filtered by customer and date range."
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
                        <div className="space-y-1 col-span-2 md:col-span-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Customer</Label>
                            <Select onValueChange={setSelectedCustomer} defaultValue={selectedCustomer}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="All Customers" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Customers</SelectItem>
                                    {customers.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.customer_name}</SelectItem>)}
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
                        <TableHead className="font-bold text-slate-800">Invoice #</TableHead>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Customer Name</TableHead>
                        <TableHead className="font-bold text-slate-800">Location</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Invoice Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((invoice) => (
                            <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-blue-600 font-medium">{invoice.invoice_number}</TableCell>
                                <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                                <TableCell className="font-bold text-slate-700">{invoice.customer?.customer_name}</TableCell>
                                <TableCell>{invoice.location?.location_legal_name || 'N/A'}</TableCell>
                                <TableCell className="text-right font-black">₹{Number(invoice.grand_total).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-slate-400 font-medium italic">
                                No records found. Select a date range and apply filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
