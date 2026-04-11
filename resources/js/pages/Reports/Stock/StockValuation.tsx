import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';

interface StockItem {
    id: number;
    item: {
        item_name: string;
        standard_purchase_price: number;
    };
    location: {
        location_name: string;
    };
    warehouse: {
        warehouse_name: string;
    };
    current_quantity: number;
    stock_value: number;
}

interface Props {
    reportData: StockItem[];
    locations: any[];
    filters: any;
}

export default function StockValuation({ reportData, locations, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Stock Reports', href: '#' },
        { title: 'Stock Valuation Report', href: '/reports/stock/valuation' },
    ];

    const [processing, setProcessing] = React.useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        router.get('/reports/stock/valuation', data, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    const totalValuation = reportData.reduce((acc, current) => acc + Number(current.stock_value), 0);

    return (
        <BaseReport
            title="Stock Valuation Report"
            subtitle="Current inventory value based on standard purchase prices across all locations."
            breadcrumbs={breadcrumbs}
            summaryCards={
                <>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Stock Value</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">₹{totalValuation.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Items</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{reportData.length}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Locations</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{locations.length}</p>
                    </div>
                    <div className="rounded-xl border bg-slate-900 p-4 shadow-sm text-white">
                        <p className="text-xs font-bold opacity-70 uppercase tracking-wider text-slate-300">Valuation Date</p>
                        <p className="text-2xl font-black mt-1">{new Date().toLocaleDateString()}</p>
                    </div>
                </>
            }
            filters={
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1 col-span-1 md:col-span-3">
                        <Label htmlFor="location_id" className="text-xs uppercase tracking-wider text-slate-500 font-bold">Location</Label>
                        <select name="location_id" defaultValue={filters.location_id} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            <option value="">All Locations</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.location_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                            CALCULATE VALUATION
                        </Button>
                    </div>
                </form>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">Item Name</TableHead>
                        <TableHead className="font-bold text-slate-800">Location / Warehouse</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Current Qty</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Unit Cost</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Total Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportData.length > 0 ? (
                        reportData.map((row) => (
                            <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-bold text-slate-700">{row.item.item_name}</TableCell>
                                <TableCell className="text-xs text-slate-500">
                                    {row.location.location_name} / <span className="font-medium text-slate-700">{row.warehouse.warehouse_name}</span>
                                </TableCell>
                                <TableCell className="text-right font-medium">{row.current_quantity}</TableCell>
                                <TableCell className="text-right">₹{Number(row.item.standard_purchase_price).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-slate-900">₹{Number(row.stock_value).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-slate-400 font-medium italic">
                                No stock data available for valuation.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
