import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { ArrowUpIcon } from 'lucide-react';

interface DeviationData {
    item_name: string;
    min_price: number;
    max_price: number;
    avg_price: number;
    purchase_count: number;
}

interface Props {
    reportData: DeviationData[];
    filters: any;
}

export default function PriceDeviation({ reportData, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Purchase Reports', href: '#' },
        { title: 'Price Deviation For All Location', href: '/reports/purchase/price-deviation' },
    ];

    const [processing, setProcessing] = React.useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        router.get('/reports/purchase/price-deviation', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <BaseReport
            title="Price Deviation For All Locations"
            subtitle="Analyze fluctuation of purchase prices across all transactions within the selected period."
            breadcrumbs={breadcrumbs}
            filters={
                <form onSubmit={handleFilter} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date From <span className="text-red-500">*</span></Label>
                            <Input type="date" name="date_from" defaultValue={filters?.date_from} className="h-9" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Date To <span className="text-red-500">*</span></Label>
                            <Input type="date" name="date_to" defaultValue={filters?.date_to} className="h-9" />
                        </div>
                        <div className="flex items-end">
                            <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                                {processing ? 'Calculating...' : 'CALCULATE DEVIATION'}
                            </Button>
                        </div>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Item Name</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Min Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Max Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Avg Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Variance</TableHead>
                        <TableHead className="text-center font-bold text-slate-800">Samples</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.length > 0 ? (
                        reportData.map((row, index) => {
                            const variance = Number(row.max_price) - Number(row.min_price);
                            const variancePercent = Number(row.min_price) > 0 ? (variance / Number(row.min_price)) * 100 : 0;
                            return (
                                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-bold text-slate-700">{row.item_name}</TableCell>
                                    <TableCell className="text-right text-green-600 font-medium">₹{Number(row.min_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-red-600 font-medium">₹{Number(row.max_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-medium">₹{Number(row.avg_price).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        {variance > 0 ? (
                                            <span className="flex items-center justify-end gap-1 text-orange-600 font-bold">
                                                ₹{variance.toLocaleString()}
                                                <span className="text-[10px] text-slate-400">({variancePercent.toFixed(1)}%)</span>
                                                <ArrowUpIcon className="size-3 text-orange-500" />
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic text-sm">Stable</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-500 font-bold">{row.purchase_count}</TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-400 font-medium italic">
                                Select a date range to analyze price deviations.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
