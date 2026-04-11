import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface DeviationData {
    item_name: string;
    min_price: number;
    max_price: number;
    avg_price: number;
    purchase_count: number;
}

interface Props {
    reportData: DeviationData[];
}

export default function PriceDeviation({ reportData }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Purchase Reports', href: '#' },
        { title: 'Price Deviation Report', href: '/reports/purchase/price-deviation' },
    ];

    return (
        <BaseReport
            title="Price Deviation For All Location"
            subtitle="Analyze the fluctuation of purchase prices for your inventory across all transactions."
            breadcrumbs={breadcrumbs}
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
                            const variancePercent = (variance / Number(row.min_price)) * 100;
                            
                            return (
                                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-bold text-slate-700">{row.item_name}</TableCell>
                                    <TableCell className="text-right text-green-600 font-medium">₹{Number(row.min_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-red-600 font-medium">₹{Number(row.max_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-medium">₹{Number(row.avg_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {variance > 0 ? (
                                                <>
                                                    <span className="text-orange-600 font-bold">₹{variance.toLocaleString()}</span>
                                                    <span className="text-[10px] text-slate-400">({variancePercent.toFixed(1)}%)</span>
                                                    <ArrowUpIcon className="size-3 text-orange-500" />
                                                </>
                                            ) : (
                                                <span className="text-slate-400">Stable</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-slate-500 font-bold">{row.purchase_count}</TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-400 font-medium italic">
                                No purchase data available for price analysis.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
