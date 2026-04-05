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
import { Search, Copy, Printer, FileDown, FileText, ChevronDown } from 'lucide-react';
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
            <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <h1 className="text-xl font-bold text-[#162a5b]">Current Stock</h1>
                </div>

                {/* Filter Section */}
                <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="p-0 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                            <div className="space-y-1.5">
                                <Label className="text-gray-600 text-xs font-medium">Location</Label>
                                <Select value={localFilters.location_id} onValueChange={(v) => handleFilterChange('location_id', v)}>
                                    <SelectTrigger className="bg-white border-gray-200">
                                        <SelectValue placeholder="None selected" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-gray-600 text-xs font-medium">Warehouse</Label>
                                <Select value={localFilters.warehouse_id} onValueChange={(v) => handleFilterChange('warehouse_id', v)}>
                                    <SelectTrigger className="bg-white border-gray-200">
                                        <SelectValue placeholder="None selected" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {warehouses.map(w => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-gray-600 text-xs font-medium">Item Category</Label>
                                <Select value={localFilters.item_category_id} onValueChange={(v) => handleFilterChange('item_category_id', v)}>
                                    <SelectTrigger className="bg-white border-gray-200">
                                        <SelectValue placeholder="None selected" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.category_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-gray-600 text-xs font-medium">Item Sub Category</Label>
                                <Select value={localFilters.item_sub_category_id} onValueChange={(v) => handleFilterChange('item_sub_category_id', v)}>
                                    <SelectTrigger className="bg-white border-gray-200">
                                        <SelectValue placeholder="None selected" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {subCategories.map(sc => <SelectItem key={sc.id} value={sc.id.toString()}>{sc.sub_category_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-gray-600 text-xs font-medium">Item</Label>
                                <Select value={localFilters.item_id} onValueChange={(v) => handleFilterChange('item_id', v)}>
                                    <SelectTrigger className="bg-white border-gray-200">
                                        <SelectValue placeholder="None selected" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {items.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5 flex gap-2 items-end">
                                <div className="flex-1">
                                    <Label className="text-gray-600 text-xs font-medium">UOM</Label>
                                    <Select value={localFilters.uom_id} onValueChange={(v) => handleFilterChange('uom_id', v)}>
                                        <SelectTrigger className="bg-white border-gray-200">
                                            <SelectValue placeholder="Base UOM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Base UOM">Base UOM</SelectItem>
                                            {uoms.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.uom_name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={applyFilters} className="bg-[#4caf50] hover:bg-[#43a047] text-white px-6 uppercase font-bold text-xs h-10">Search</Button>
                            </div>
                        </div>

                        {/* Legends */}
                        <div className="flex gap-4 items-center bg-gray-100/50 p-2 rounded text-xs">
                           <div className="flex items-center gap-2">
                               <div className="w-6 h-4 bg-[#ffcc80]"></div>
                               <span className="text-gray-600">Low Stock</span>
                           </div>
                           <div className="flex items-center gap-2">
                               <div className="w-6 h-4 bg-[#f44336]"></div>
                               <span className="text-gray-600">Out Of Stock</span>
                           </div>
                        </div>

                        {/* Table Controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Filter:</span>
                                <div className="relative">
                                    <Input 
                                        placeholder="Type to filter..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-9 w-64 pr-8 text-sm"
                                    />
                                    <Search className="absolute right-2 top-2.5 size-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex rounded-md overflow-hidden border">
                                    <Button variant="ghost" className="h-9 px-3 text-xs border-r hover:bg-gray-100">COPY</Button>
                                    <Button variant="ghost" className="h-9 px-3 text-xs border-r hover:bg-gray-100">CSV</Button>
                                    <Button variant="ghost" className="h-9 px-3 text-xs border-r hover:bg-gray-100">PRINT</Button>
                                    <Button variant="ghost" className="h-9 px-3 text-xs border-r hover:bg-gray-100">PDF</Button>
                                    <Button variant="ghost" className="h-9 px-3 text-xs hover:bg-gray-100"><ChevronDown className="size-4" /></Button>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
                                    Show:
                                    <Select value={showEntries} onValueChange={setShowEntries}>
                                        <SelectTrigger className="w-20 h-9">
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
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white border-t border-b">
                            <TableRow>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap">Sr. No</TableHead>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap">Item Category.</TableHead>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap">Item Sub Category.</TableHead>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap">Item.</TableHead>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap">Item Quantity</TableHead>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap">Safety Quantity</TableHead>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap text-center">UOM</TableHead>
                                <TableHead className="font-bold text-gray-900 border-r whitespace-nowrap">Warehouse</TableHead>
                                <TableHead className="font-bold text-gray-900 whitespace-nowrap">Location</TableHead>
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
                                            "hover:opacity-90 transition-opacity",
                                            isOutOfStock ? "bg-[#f44336] text-white hover:bg-[#f44336]" : 
                                            isLowStock ? "bg-[#ffcc80] text-gray-900 hover:bg-[#ffcc80]" : "bg-white"
                                        )}
                                    >
                                        <TableCell className="border-r py-3">{index + 1}</TableCell>
                                        <TableCell className="border-r py-3">{stock.category?.category_name || '-'}</TableCell>
                                        <TableCell className="border-r py-3">{stock.item?.sub_category?.sub_category_name || '-'}</TableCell>
                                        <TableCell className="border-r py-3 font-medium">{stock.item?.item_name || 'N/A'}</TableCell>
                                        <TableCell className="border-r py-3 font-bold">{qty.toFixed(2)}</TableCell>
                                        <TableCell className="border-r py-3">{safetyQty}</TableCell>
                                        <TableCell className="border-r py-3 text-center">
                                            <div className={cn(
                                                "border rounded px-2 py-0.5 mx-auto w-fit text-xs bg-white text-black",
                                                (isOutOfStock || isLowStock) ? "border-none" : "border-gray-300"
                                            )}>
                                                {stock.item?.base_unit?.uom_name || 'KG'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-r py-3 uppercase text-[10px] font-bold tracking-tight">{stock.warehouse?.name || '-'}</TableCell>
                                        <TableCell className="py-3 uppercase text-[10px] font-bold tracking-tight">{stock.location?.location_legal_name || '-'}</TableCell>
                                    </TableRow>
                                );
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-32 text-center text-gray-500 bg-white">
                                        No stock records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
