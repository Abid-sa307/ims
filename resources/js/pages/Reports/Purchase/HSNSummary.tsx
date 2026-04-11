import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';

interface HsnData {
    hsn_code: string;
    total_taxable: number;
    total_tax: number;
    total_amount: number;
}

interface Props {
    reportData: HsnData[];
    filters: any;
}

export default function HSNSummary({ reportData, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Purchase Reports', href: '#' },
        { title: 'HSN Summary Report', href: '/reports/purchase/hsn-summary' },
    ];

    const [processing, setProcessing] = React.useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        router.get('/reports/purchase/hsn-summary', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Purchase HSN Summary"
            subtitle="Categorized purchase records grouped by Harmonized System of Nomenclature (HSN) codes."
            breadcrumbs={breadcrumbs}
            filters={
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="date_from" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date From</Label>
                        <Input type="date" name="date_from" defaultValue={filters.date_from} className="h-9" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="date_to" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date To</Label>
                        <Input type="date" name="date_to" defaultValue={filters.date_to} className="h-9" />
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            CALCULATE TAX SUMMARY
                        </Button>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">HSN Code</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total Taxable Value</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total Tax Amount</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Gross Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.length > 0 ? (
                        reportData.map((hsn, index) => (
                            <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-black text-slate-700">{hsn.hsn_code || 'UNSPECIFIED'}</TableCell>
                                <TableCell className="text-right">₹{Number(hsn.total_taxable).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-red-600 font-medium">₹{Number(hsn.total_tax).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-slate-900">₹{Number(hsn.total_amount).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-slate-400 font-medium italic">
                                No tax records found for the selected period.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
