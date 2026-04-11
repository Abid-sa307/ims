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
    customer: {
        customer_name: string;
    };
    location: {
        location_name: string;
    };
    total_amount: number;
    tax_amount: number;
    grand_total: number;
    status: string;
}

interface Props {
    reportData: {
        data: SalesInvoice[];
        links: any[];
    };
    filters: any;
}

export default function SalesSummary({ reportData, filters }: Props) {
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
            subtitle="Overview of all sales invoices issued to customers."
            breadcrumbs={breadcrumbs}
            filters={
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="date_from" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Invoiced From</Label>
                        <Input type="date" name="date_from" defaultValue={filters.date_from} className="h-9" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="date_to" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Invoiced To</Label>
                        <Input type="date" name="date_to" defaultValue={filters.date_to} className="h-9" />
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            GENERATE REPORT
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
                                <TableCell>{invoice.location?.location_name || 'N/A'}</TableCell>
                                <TableCell className="text-right">₹{Number(invoice.tax_amount).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-slate-900">₹{Number(invoice.grand_total).toLocaleString()}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] uppercase font-black">
                                        {invoice.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400 font-medium italic">
                                No sales invoices found for the selected period.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
