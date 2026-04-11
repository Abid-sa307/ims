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
    sales_count: number;
}

interface Props {
    reportData: DeviationData[];
}

export default function PriceDeviation({ reportData }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Sales Reports', href: '#' },
        { title: 'Price Deviation For Sales', href: '/reports/sales/price-deviation' },
    ];

    return (
        <BaseReport
            title="Price Deviation For Sales"
            subtitle="Analyze selling price consistency and identify pricing outliers across all transactions."
            breadcrumbs={breadcrumbs}
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Item Name</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Min Sale Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Max Sale Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Avg Sale Price</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Price Range</TableHead>
                        <TableHead className="text-center font-bold text-slate-800">Invoices</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.length > 0 ? (
                        reportData.map((row, index) => {
                            const range = Number(row.max_price) - Number(row.min_price);
                            const rangePercent = (range / Number(row.min_price)) * 100;
                            
                            return (
                                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-bold text-slate-700">{row.item_name}</TableCell>
                                    <TableCell className="text-right text-slate-600 font-medium">₹{Number(row.min_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-slate-900 font-black">₹{Number(row.max_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-medium">₹{Number(row.avg_price).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {range > 0 ? (
                                                <>
                                                    <span className="text-blue-600 font-bold">₹{range.toLocaleString()}</span>
                                                    <span className="text-[10px] text-slate-400">({rangePercent.toFixed(1)}%)</span>
                                                    <ArrowUpIcon className="size-3 text-blue-500" />
                                                </>
                                            ) : (
                                                <span className="text-slate-400 italic text-[11px]">Fixed Price</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-slate-500 font-bold">{row.sales_count}</TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-400 font-medium italic">
                                No sales data available for pricing analysis.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
