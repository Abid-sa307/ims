import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';

interface SalesDateData {
    date: string;
    invoice_count: number;
    total_revenue: number;
}

interface Props {
    reportData: SalesDateData[];
    filters: any;
}

export default function DateWiseSales({ reportData, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Date Wise Item Sales Report', href: '/reports/sales/date-wise' },
    ];

    const [processing, setProcessing] = React.useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        router.get('/reports/sales/date-wise', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    const totalRevenue = reportData.reduce((acc, curr) => acc + Number(curr.total_revenue), 0);
    const totalInvoices = reportData.reduce((acc, curr) => acc + Number(curr.invoice_count), 0);

    return (
        <BaseReport
            title="Date Wise Sales Report"
            subtitle="Monitor your daily sales performance and revenue trends."
            breadcrumbs={breadcrumbs}
            summaryCards={
                <>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Range Revenue</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Range Invoices</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{totalInvoices}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Per Day</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">₹{reportData.length > 0 ? (totalRevenue / reportData.length).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</p>
                    </div>
                    <div className="rounded-xl border bg-slate-900 p-4 shadow-sm text-white">
                        <p className="text-xs font-bold opacity-70 uppercase tracking-wider text-slate-300">Analysis Days</p>
                        <p className="text-2xl font-black mt-1">{reportData.length} Days</p>
                    </div>
                </>
            }
            filters={
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="date_from" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Start Date</Label>
                        <Input type="date" name="date_from" defaultValue={filters.date_from} className="h-9" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="date_to" className="text-xs uppercase tracking-wider text-slate-500 font-bold">End Date</Label>
                        <Input type="date" name="date_to" defaultValue={filters.date_to} className="h-9" />
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            RECALCULATE TRENDS
                        </Button>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="text-center font-bold text-slate-800">Invoices Generated</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Daily Revenue</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Contribution %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.length > 0 ? (
                        reportData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-bold text-slate-700">{new Date(row.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                <TableCell className="text-center font-medium">{row.invoice_count}</TableCell>
                                <TableCell className="text-right font-black text-slate-900">₹{Number(row.total_revenue).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-xs text-slate-400 italic">
                                    {totalRevenue > 0 ? ((Number(row.total_revenue) / totalRevenue) * 100).toFixed(1) : 0}%
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-slate-400 font-medium italic">
                                No sales data found for the selected range.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
