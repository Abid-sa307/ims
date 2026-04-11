import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';

interface CreditNote {
    id: number;
    credit_note_number: string;
    date: string;
    customer: {
        customer_name: string;
    };
    location: {
        location_name: string;
    };
    grand_total: number;
    remarks: string;
}

interface Props {
    reportData: {
        data: CreditNote[];
        links: any[];
    };
    filters: any;
}

export default function CreditNoteRegister({ reportData, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Credit Note Register', href: '/reports/sales/credit-note-register' },
    ];

    const [processing, setProcessing] = React.useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        router.get('/reports/sales/credit-note-register', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Credit Note Register"
            subtitle="Track returns and credit adjustments issued to customers."
            breadcrumbs={breadcrumbs}
            filters={
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="date_from" className="text-xs uppercase tracking-wider text-slate-500 font-bold">From Date</Label>
                        <Input type="date" name="date_from" defaultValue={filters.date_from} className="h-9" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="date_to" className="text-xs uppercase tracking-wider text-slate-500 font-bold">To Date</Label>
                        <Input type="date" name="date_to" defaultValue={filters.date_to} className="h-9" />
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            VIEW REGISTER
                        </Button>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">CN Number</TableHead>
                        <TableHead className="font-bold text-slate-800">Date</TableHead>
                        <TableHead className="font-bold text-slate-800">Customer</TableHead>
                        <TableHead className="font-bold text-slate-800">Location</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Credit Amount</TableHead>
                        <TableHead className="font-bold text-slate-800">Remarks</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.data.length > 0 ? (
                        reportData.data.map((cn) => (
                            <TableRow key={cn.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-red-600 font-medium">{cn.credit_note_number}</TableCell>
                                <TableCell>{new Date(cn.date).toLocaleDateString()}</TableCell>
                                <TableCell>{cn.customer?.customer_name}</TableCell>
                                <TableCell>{cn.location?.location_name}</TableCell>
                                <TableCell className="text-right font-black text-slate-900">₹{Number(cn.grand_total).toLocaleString()}</TableCell>
                                <TableCell className="text-xs text-slate-500 max-w-[200px] truncate">{cn.remarks || '-'}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-400 font-medium italic">
                                No credit notes found for the selected period.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
