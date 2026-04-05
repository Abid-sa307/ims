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
import { Calendar, Search, Copy, Printer, FileDown, FileText, ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '#' },
    { title: 'Stock Transfer Wastage', href: '/stock/transfer-report' },
];

interface Location { id: number; location_legal_name: string; }
interface Warehouse { id: number; name: string; }
interface Category { id: number; category_name: string; }
interface Item { id: number; item_name: string; item_category_id: number; }

interface ReportItem {
    id: number;
    item_id: number;
    quantity: string;
    item?: Item & { category?: Category };
    transfer?: {
        date: string;
        from_location?: Location;
        to_location?: Location;
        from_warehouse?: Warehouse;
        to_warehouse?: Warehouse;
    };
}

export default function StockTransferReport({
    reportData = [],
    locations = [],
    warehouses = [],
    categories = [],
    items = [],
    filters = {},
}: {
    reportData: ReportItem[],
    locations: Location[],
    warehouses: Warehouse[],
    categories: Category[],
    items: Item[],
    filters: any,
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showEntries, setShowEntries] = useState('25');
    const [localFilters, setLocalFilters] = useState({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        from_location_id: filters.from_location_id || '',
        to_location_id: filters.to_location_id || '',
        from_warehouse_id: filters.from_warehouse_id || '',
        to_warehouse_id: filters.to_warehouse_id || '',
        item_category_id: filters.item_category_id || '',
        item_id: filters.item_id || '',
    });

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/stock/transfer-report', localFilters, { preserveState: true });
    };

    const filteredData = reportData.filter(item => 
        (item.item?.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.transfer?.from_location?.location_legal_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.transfer?.to_location?.location_legal_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Transfer Wastage" />
            <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <h1 className="text-xl font-bold text-[#162a5b]">Stock Transfer Wastage</h1>
                    <div className="flex items-center gap-2">
                        <div className="bg-white border text-sm px-3 py-1.5 rounded flex items-center gap-2">
                            <span className="text-gray-500">Date:-</span>
                            <span className="font-medium text-[#162a5b]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-white p-6">
                    {/* Advanced Filter Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                        <div className="space-y-1.5 col-span-1 lg:col-span-1">
                            <Label className="text-gray-600 text-sm">Date Range:</Label>
                            <div className="flex items-center gap-2 bg-[#1e224e] text-white rounded px-3 py-2 h-10 group relative transition-all">
                                <Calendar className="size-4 opacity-70" />
                                <div className="flex gap-1 text-[11px] font-medium grow">
                                    <input 
                                        type="date" 
                                        className="bg-transparent border-none focus:outline-none w-full text-white" 
                                        value={localFilters.date_from}
                                        onChange={e => handleFilterChange('date_from', e.target.value)}
                                    />
                                    <span>-</span>
                                    <input 
                                        type="date" 
                                        className="bg-transparent border-none focus:outline-none w-full text-white" 
                                        value={localFilters.date_to}
                                        onChange={e => handleFilterChange('date_to', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">From Location</Label>
                            <Select value={localFilters.from_location_id} onValueChange={v => handleFilterChange('from_location_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">From Warehouse</Label>
                            <Select value={localFilters.from_warehouse_id} onValueChange={v => handleFilterChange('from_warehouse_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">To Location</Label>
                            <Select value={localFilters.to_location_id} onValueChange={v => handleFilterChange('to_location_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">To Warehouse</Label>
                            <Select value={localFilters.to_warehouse_id} onValueChange={v => handleFilterChange('to_warehouse_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Advanced Filter Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6 items-end">
                        <div className="space-y-1.5 col-span-1 lg:col-span-1">
                            <Label className="text-gray-600 text-sm">Item Category</Label>
                            <Select value={localFilters.item_category_id} onValueChange={v => handleFilterChange('item_category_id', v)}>
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
                            <Label className="text-gray-600 text-sm">Item</Label>
                            <Select value={localFilters.item_id} onValueChange={v => handleFilterChange('item_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {items.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-1">
                            <Button onClick={applyFilters} className="bg-[#2196f3] hover:bg-[#1e88e5] text-white uppercase font-bold text-xs h-10 w-full lg:w-48 flex gap-2">
                                <Filter className="size-4" />
                                FILTER
                            </Button>
                        </div>
                    </div>

                    {/* Table Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Filter:</span>
                            <div className="relative">
                                <Input 
                                    placeholder="Type to filter..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-9 w-64 pr-8 text-sm border-gray-100"
                                />
                                <Search className="absolute right-2 top-2.5 size-4 text-gray-300" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mr-4">
                                Show:
                                <Select value={showEntries} onValueChange={setShowEntries}>
                                    <SelectTrigger className="w-16 h-9 border-none shadow-none">
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
                            <div className="flex rounded overflow-hidden border border-gray-100">
                                <Button variant="ghost" className="h-9 px-3 text-[10px] border-r hover:bg-gray-50">COPY</Button>
                                <Button variant="ghost" className="h-9 px-3 text-[10px] border-r hover:bg-gray-50">CSV</Button>
                                <Button variant="ghost" className="h-9 px-3 text-[10px] border-r hover:bg-gray-50">PRINT</Button>
                                <Button variant="ghost" className="h-9 px-3 text-[10px] border-r hover:bg-gray-50">PDF</Button>
                                <Button variant="ghost" className="h-9 px-3 text-[10px] hover:bg-gray-50"><ChevronDown className="size-4 opacity-30" /></Button>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50 border-b">
                                <TableRow>
                                    <TableHead className="font-bold text-gray-700">Sr.No</TableHead>
                                    <TableHead className="font-bold text-gray-700">From Location</TableHead>
                                    <TableHead className="font-bold text-gray-700">From Warehouse</TableHead>
                                    <TableHead className="font-bold text-gray-700">To Location</TableHead>
                                    <TableHead className="font-bold text-gray-700">To Warehouse</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item Category</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item</TableHead>
                                    <TableHead className="font-bold text-gray-700">Qty</TableHead>
                                    <TableHead className="font-bold text-gray-700">Transfer Date</TableHead>
                                    <TableHead className="font-bold text-gray-700">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length > 0 ? filteredData.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/30">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="text-[#162a5b] font-medium">{item.transfer?.from_location?.location_legal_name || '-'}</TableCell>
                                        <TableCell className="text-gray-600 text-xs uppercase">{item.transfer?.from_warehouse?.name || '-'}</TableCell>
                                        <TableCell className="text-[#162a5b] font-medium">{item.transfer?.to_location?.location_legal_name || '-'}</TableCell>
                                        <TableCell className="text-gray-600 text-xs uppercase">{item.transfer?.to_warehouse?.name || '-'}</TableCell>
                                        <TableCell>{item.item?.category?.category_name || '-'}</TableCell>
                                        <TableCell className="text-[#162a5b] font-semibold">{item.item?.item_name || 'N/A'}</TableCell>
                                        <TableCell className="font-bold">{parseFloat(item.quantity).toFixed(2)}</TableCell>
                                        <TableCell className="text-gray-500">{item.transfer?.date || '-'}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
                                                <FileText className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="h-32 text-center text-gray-400">
                                            No Data Available In Table
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 text-xs text-gray-400 flex justify-between items-center px-2">
                        <span>Showing {filteredData.length > 0 ? 1 : 0} To {filteredData.length} Of {filteredData.length} Entries</span>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" disabled className="h-7 text-[10px]">Previous</Button>
                            <Button variant="outline" size="sm" disabled className="h-7 text-[10px]">Next</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
