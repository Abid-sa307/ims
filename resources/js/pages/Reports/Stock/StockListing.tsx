import React from 'react';
import BaseReport from '@/components/BaseReport';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StockItem {
    id: number;
    item: {
        item_name: string;
        item_code: string;
    };
    location: { location_legal_name: string };
    warehouse: { name: string };
    current_quantity: number;
    minimum_stock: number;
}

interface Props {
    stockData: StockItem[];
    locations: any[];
    warehouses: any[];
    categories: any[];
    filters: any;
}

export default function StockListing({ stockData, locations, warehouses, categories, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: '#' },
        { title: 'Stock Reports', href: '#' },
        { title: 'Stock Listing', href: '/reports/stock/listing' },
    ];

    const [processing, setProcessing] = React.useState(false);
    const [selectedLocation, setSelectedLocation] = React.useState(filters.location_id || '');
    const [selectedWarehouse, setSelectedWarehouse] = React.useState(filters.warehouse_id || '');
    const [selectedCategory, setSelectedCategory] = React.useState(filters.item_category_id || '');

    const handleFilter = () => {
        router.get('/reports/stock/listing', {
            location_id: selectedLocation,
            warehouse_id: selectedWarehouse,
            item_category_id: selectedCategory,
        }, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    const totalItems = stockData.length;
    const lowStockCount = stockData.filter((s) => Number(s.current_quantity) <= Number(s.minimum_stock || 0)).length;
    const totalQty = stockData.reduce((acc, s) => acc + Number(s.current_quantity), 0);

    return (
        <BaseReport
            title="Stock Listing Report"
            subtitle="Complete inventory listing across all locations and warehouses with stock level indicators."
            breadcrumbs={breadcrumbs}
            filters={
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Location</Label>
                            <Select onValueChange={setSelectedLocation} defaultValue={selectedLocation}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="All Locations" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {locations.map((loc) => <SelectItem key={loc.id} value={loc.id.toString()}>{loc.location_legal_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Warehouse</Label>
                            <Select onValueChange={setSelectedWarehouse} defaultValue={selectedWarehouse}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Warehouses</SelectItem>
                                    {warehouses.map((wh) => <SelectItem key={wh.id} value={wh.id.toString()}>{wh.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Category</Label>
                            <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="All Categories" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((cat) => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.category_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleFilter} disabled={processing} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                                {processing ? 'Loading...' : 'APPLY FILTERS'}
                            </Button>
                        </div>
                    </div>
                </div>
            }
            summaryCards={
                <>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total SKUs</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{totalItems.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Quantity In Stock</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{totalQty.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border bg-red-50 p-4 shadow-sm ring-1 ring-red-200">
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">⚠ Low / Out of Stock</p>
                        <p className="text-2xl font-black text-red-600 mt-1">{lowStockCount}</p>
                    </div>
                </>
            }
        >
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-800">#</TableHead>
                        <TableHead className="font-bold text-slate-800">Item Name</TableHead>
                        <TableHead className="font-bold text-slate-800">Item Code</TableHead>
                        <TableHead className="font-bold text-slate-800">Location</TableHead>
                        <TableHead className="font-bold text-slate-800">Warehouse</TableHead>
                        <TableHead className="text-right font-bold text-slate-800">Current Qty</TableHead>
                        <TableHead className="text-center font-bold text-slate-800">Stock Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockData.length > 0 ? (
                        stockData.map((row, index) => {
                            const isLow = Number(row.current_quantity) <= Number(row.minimum_stock || 0);
                            const isOut = Number(row.current_quantity) === 0;
                            return (
                                <TableRow key={row.id} className={`hover:bg-slate-50/50 transition-colors ${isOut ? 'bg-red-50/30' : isLow ? 'bg-orange-50/20' : ''}`}>
                                    <TableCell className="text-slate-400">{index + 1}</TableCell>
                                    <TableCell className="font-bold text-slate-800">{row.item?.item_name}</TableCell>
                                    <TableCell className="text-slate-500 font-mono text-xs">{row.item?.item_code || '—'}</TableCell>
                                    <TableCell className="text-slate-600">{row.location?.location_legal_name || 'N/A'}</TableCell>
                                    <TableCell className="text-slate-600">{row.warehouse?.name || 'N/A'}</TableCell>
                                    <TableCell className={`text-right font-black text-lg ${isOut ? 'text-red-600' : isLow ? 'text-orange-500' : 'text-slate-900'}`}>
                                        {row.current_quantity}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {isOut ? (
                                            <Badge className="bg-red-600 text-white text-[10px] uppercase font-black">Out of Stock</Badge>
                                        ) : isLow ? (
                                            <Badge className="bg-orange-500 text-white text-[10px] uppercase font-black">Low Stock</Badge>
                                        ) : (
                                            <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] uppercase font-black" variant="outline">OK</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400 font-medium italic">
                                No stock data found for the selected filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </BaseReport>
    );
}
