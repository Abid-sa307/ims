import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface LedgerEntry {
    date: string;
    reference: string;
    type: 'Invoice' | 'Payment' | 'Credit Note';
    amount: number;
}

interface Props {
    reportData: LedgerEntry[];
    customers: any[];
    filters: any;
}

export default function SalesLedger({ reportData, customers, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Sales Ledger', href: '/reports/sales/ledger' },
    ];

    const [processing, setProcessing] = React.useState(false);
    const [selectedCustomer, setSelectedCustomer] = React.useState(filters.customer_id || '');

    const handleFilter = () => {
        router.get('/reports/sales/ledger', { customer_id: selectedCustomer }, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    let runningBalance = 0;

    return (
        <BaseReport
            title="Sales Ledger"
            subtitle="Complete chronological transaction history for specific customers."
            breadcrumbs={breadcrumbs}
            filters={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1 col-span-1 md:col-span-3">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Customer</Label>
                        <Select onValueChange={setSelectedCustomer} defaultValue={selectedCustomer}>
                            <SelectTrigger className="h-9 bg-white text-slate-900 border-slate-200">
                                <SelectValue placeholder="Select Customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((cust) => (
                                    <SelectItem key={cust.id} value={cust.id.toString()}>{cust.customer_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleFilter} disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            FETCH LEDGER
                        </Button>
                    </div>
                </div>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Type</TableHead>
                        <TableHead className="font-bold text-slate-800">Reference #</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Debit (Invoice)</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Credit (Payment/CN)</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Running Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.length > 0 ? (
                        reportData.map((row, index) => {
                            const isDebit = row.type === 'Invoice';
                            const amount = Number(row.amount);
                            runningBalance += isDebit ? amount : -amount;
                            
                            return (
                                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="text-slate-600 font-medium">{new Date(row.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] uppercase font-black px-2 py-0",
                                            row.type === 'Invoice' ? "bg-red-50 text-red-700 border-red-200" :
                                            row.type === 'Payment' ? "bg-green-50 text-green-700 border-green-200" :
                                            "bg-blue-50 text-blue-700 border-blue-200"
                                        )}>
                                            {row.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-900">{row.reference}</TableCell>
                                    <TableCell className="text-right text-red-600">
                                        {isDebit ? `₹${amount.toLocaleString()}` : '-'}
                                    </TableCell>
                                    <TableCell className="text-right text-green-600">
                                        {!isDebit ? `₹${amount.toLocaleString()}` : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-black text-slate-900">
                                        ₹{runningBalance.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-400 font-medium italic">
                                Select a customer to view their statement of account.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
