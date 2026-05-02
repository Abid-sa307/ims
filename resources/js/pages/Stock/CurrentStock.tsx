import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '#' },
    { title: 'Current Stock', href: '/stock/current-stock' },
];

interface Location { id: number; location_legal_name: string; }
interface Warehouse { id: number; name: string; }
interface Category { id: number; category_name: string; }
interface SubCategory { id: number; sub_category_name: string; }
interface Item { id: number; item_name: string; safety_quantity: number; base_unit_id: number; }
interface UOM { id: number; uom_name: string; }

interface StockItem {
    id: number;
    location_id: number;
    warehouse_id: number;
    item_category_id: number;
    item_id: number;
    current_quantity: string;
    location?: Location;
    warehouse?: Warehouse;
    category?: Category;
    item?: Item & { sub_category?: SubCategory; base_unit?: UOM };
}

export default function CurrentStock({ 
    stockData = [], 
    locations = [], 
    warehouses = [], 
    categories = [], 
    subCategories = [], 
    items = [], 
    uoms = [], 
    filters = {} 
}: { 
    stockData: StockItem[], 
    locations: Location[], 
    warehouses: Warehouse[], 
    categories: Category[], 
    subCategories: SubCategory[], 
    items: Item[], 
    uoms: UOM[], 
    filters: any 
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showEntries, setShowEntries] = useState('25');
    const [localFilters, setLocalFilters] = useState({
        location_id: filters.location_id?.toString() || '',
        warehouse_id: filters.warehouse_id?.toString() || '',
        item_category_id: filters.item_category_id?.toString() || '',
        item_sub_category_id: filters.item_sub_category_id?.toString() || '',
        item_id: filters.item_id?.toString() || '',
        uom_id: filters.uom_id?.toString() || 'Base UOM',
    });

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/stock/current-stock', localFilters, { preserveState: true });
    };

    const filteredData = stockData.filter(stock => 
        (stock.item?.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stock.category?.category_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stock.warehouse?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stock.location?.location_legal_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Current Stock" />
            <div className="flex flex-col h-full bg-white">
                {/* Header Title */}
                <div className="px-4 py-3 border-b">
                    <h1 className="text-lg font-bold text-[#1e293b]">Current Stock</h1>
                </div>

                <div className="p-4 space-y-6">
                    {/* Filter Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
                        <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-gray-500">Location</Label>
                            <Select value={localFilters.location_id} onValueChange={(v) => handleFilterChange('location_id', v)}>
                                <SelectTrigger className="h-9 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus:ring-0 focus:border-gray-400">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-gray-500">Warehouse</Label>
                            <Select value={localFilters.warehouse_id} onValueChange={(v) => handleFilterChange('warehouse_id', v)}>
                                <SelectTrigger className="h-9 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus:ring-0 focus:border-gray-400">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-gray-500">Item Category</Label>
                            <Select value={localFilters.item_category_id} onValueChange={(v) => handleFilterChange('item_category_id', v)}>
                                <SelectTrigger className="h-9 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus:ring-0 focus:border-gray-400">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.category_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-gray-500">Item Sub Category</Label>
                            <Select value={localFilters.item_sub_category_id} onValueChange={(v) => handleFilterChange('item_sub_category_id', v)}>
                                <SelectTrigger className="h-9 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus:ring-0 focus:border-gray-400">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {subCategories.map(sc => <SelectItem key={sc.id} value={sc.id.toString()}>{sc.sub_category_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-gray-500">Item</Label>
                            <Select value={localFilters.item_id} onValueChange={(v) => handleFilterChange('item_id', v)}>
                                <SelectTrigger className="h-9 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus:ring-0 focus:border-gray-400">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {items.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-medium text-gray-500">UOM</Label>
                            <Select value={localFilters.uom_id} onValueChange={(v) => handleFilterChange('uom_id', v)}>
                                <SelectTrigger className="h-9 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus:ring-0 focus:border-gray-400">
                                    <SelectValue placeholder="Base UOM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Base UOM">Base UOM</SelectItem>
                                    {uoms.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.uom_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pb-1">
                            <Button 
                                onClick={applyFilters} 
                                className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-6 uppercase font-bold text-[10px] h-8 rounded"
                            >
                                SEARCH
                            </Button>
                        </div>
                    </div>

                    {/* Legends Section */}
                    <div className="flex gap-4 items-center py-2 border-t">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-[#ffcc80]"></div>
                            <span className="text-[11px] font-medium text-gray-600">Low Stock</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-[#f44336]"></div>
                            <span className="text-[11px] font-medium text-gray-600">Out Of Stock</span>
                        </div>
                    </div>

                    {/* Table Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-gray-500">Filter:</span>
                            <div className="relative">
                                <Input 
                                    placeholder="Type to filter..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-8 w-64 pr-8 text-[11px] border-gray-200"
                                />
                                <Search className="absolute right-2 top-2 size-3.5 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
                                {['COPY', 'CSV', 'PRINT', 'PDF'].map((btn) => (
                                    <Button key={btn} variant="ghost" className="h-8 px-4 text-[10px] font-bold border-r last:border-r-0 hover:bg-white text-gray-600 uppercase">
                                        {btn}
                                    </Button>
                                ))}
                                <Button variant="ghost" className="h-8 px-2 hover:bg-white border-l"><ChevronDown className="size-3.5" /></Button>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-600 ml-4">
                                Show:
                                <Select value={showEntries} onValueChange={setShowEntries}>
                                    <SelectTrigger className="w-20 h-8 border-gray-200 text-[11px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="border rounded-sm overflow-hidden">
                        <Table className="text-[11px]">
                            <TableHeader className="bg-white border-b">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="h-10 font-bold text-gray-900 border-r w-16">
                                        <div className="flex items-center gap-2">Sr. No <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900 border-r">
                                        <div className="flex items-center gap-2">Item Category. <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900 border-r">
                                        <div className="flex items-center gap-2">Item Sub Category. <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900 border-r">
                                        <div className="flex items-center gap-2">Item. <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900 border-r text-center">
                                        <div className="flex items-center justify-center gap-2">Item Quantity <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900 border-r text-center">
                                        <div className="flex items-center justify-center gap-2">Safety Quantity <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900 border-r text-center">
                                        <div className="flex items-center justify-center gap-2">UOM <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900 border-r">
                                        <div className="flex items-center gap-2">Warehouse <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                    <TableHead className="h-10 font-bold text-gray-900">
                                        <div className="flex items-center gap-2">Location <ChevronsUpDown className="size-3 text-gray-400" /></div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length > 0 ? filteredData.map((stock, index) => {
                                    const qty = parseFloat(stock.current_quantity || '0');
                                    const safetyQty = stock.item?.safety_quantity || 0;
                                    const isOutOfStock = qty <= 0;
                                    const isLowStock = qty < safetyQty && !isOutOfStock;

                                    return (
                                        <TableRow 
                                            key={stock.id} 
                                            className={cn(
                                                "border-b last:border-0",
                                                isOutOfStock ? "bg-[#f44336] text-white hover:bg-[#d32f2f]" : 
                                                isLowStock ? "bg-[#ffcc80] text-gray-900 hover:bg-[#ffb74d]" : "bg-white hover:bg-gray-50"
                                            )}
                                        >
                                            <TableCell className="border-r py-2">{index + 1}</TableCell>
                                            <TableCell className="border-r py-2">{stock.category?.category_name || '-'}</TableCell>
                                            <TableCell className="border-r py-2">{stock.item?.sub_category?.sub_category_name || '-'}</TableCell>
                                            <TableCell className="border-r py-2 font-medium">{stock.item?.item_name || 'N/A'}</TableCell>
                                            <TableCell className="border-r py-2 text-center font-bold">{qty.toFixed(2)}</TableCell>
                                            <TableCell className="border-r py-2 text-center">{safetyQty}</TableCell>
                                            <TableCell className="border-r py-2 text-center">
                                                <div className="flex items-center justify-center px-2 py-0.5 border border-gray-300 rounded-sm bg-white text-gray-800 w-16 mx-auto gap-2">
                                                    {stock.item?.base_unit?.uom_name || 'KG'}
                                                    <ChevronDown className="size-2.5 text-gray-400" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r py-2 uppercase font-bold tracking-tight text-[10px]">{stock.warehouse?.name || '-'}</TableCell>
                                            <TableCell className="py-2 uppercase font-bold tracking-tight text-[10px]">{stock.location?.location_legal_name || '-'}</TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center text-gray-500 bg-white">
                                            No records found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
