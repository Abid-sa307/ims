import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OutstandingData {
    customer_name: string;
    total_invoiced: number;
    total_paid: number;
    total_credits: number;
    outstanding_balance: number;
}

interface Props {
    reportData: OutstandingData[];
}

export default function OutstandingSales({ reportData }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Outstanding Sales', href: '/reports/sales/outstanding' },
    ];

    const totalOutstanding = reportData.reduce((acc, curr) => acc + Number(curr.outstanding_balance), 0);

    return (
        <BaseReport
            title="Outstanding Sales Report"
            subtitle="Identify customers with pending balances and track your accounts receivable."
            breadcrumbs={breadcrumbs}
            summaryCards={
                <>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts Receivable</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">₹{totalOutstanding.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Debtor Accounts</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{reportData.length}</p>
                    </div>
                    <div className="rounded-xl border bg-slate-900 p-4 shadow-sm text-white md:col-span-2">
                        <p className="text-xs font-bold opacity-70 uppercase tracking-wider text-slate-300">Aging Summary</p>
                        <p className="text-lg font-medium mt-1">Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                    </div>
                </>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Customer Name</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total Invoiced</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total Paid</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Sales Credits</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Outstanding Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.length > 0 ? (
                        reportData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-bold text-slate-700">{row.customer_name}</TableCell>
                                <TableCell className="text-right font-medium">₹{Number(row.total_invoiced).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-green-600 font-medium">₹{Number(row.total_paid).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-blue-600 font-medium">₹{Number(row.total_credits).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-black text-red-600 bg-red-50/30">
                                    ₹{Number(row.outstanding_balance).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-slate-400 font-medium italic">
                                No outstanding balances found. All accounts are settled.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
