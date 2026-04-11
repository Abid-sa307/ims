import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    grand_total: number;
}

interface Props {
    reportData: {
        data: SalesInvoice[];
        links: any[];
    };
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

    const handleFilter = () => {
        router.get('/reports/sales/customer-wise', { customer_id: selectedCustomer }, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Customer Wise Sales Report"
            subtitle="Understand your customer relationship through their historical purchase patterns."
            breadcrumbs={breadcrumbs}
            filters={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1 col-span-1 md:col-span-3">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Select Customer</Label>
                        <Select onValueChange={setSelectedCustomer} defaultValue={selectedCustomer}>
                            <SelectTrigger className="h-9 bg-white text-slate-900 border-slate-200">
                                <SelectValue placeholder="All Customers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Customers</SelectItem>
                                {customers.map((cust) => (
                                    <SelectItem key={cust.id} value={cust.id.toString()}>{cust.customer_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleFilter} disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            VIEW CUSTOMER LEDGER
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
                        <TableHead className="font-bold text-slate-800">Customer Name</TableHead>
                        <TableHead className="font-bold text-slate-800">Store / Location</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Invoice Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((invoice) => (
                            <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-blue-600 font-medium">{invoice.invoice_number}</TableCell>
                                <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                                <TableCell className="font-bold text-slate-700">{invoice.customer.customer_name}</TableCell>
                                <TableCell>{invoice.location.location_name}</TableCell>
                                <TableCell className="text-right font-black">₹{Number(invoice.grand_total).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-slate-400 font-medium italic">
                                Select a customer to view their sales history.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
