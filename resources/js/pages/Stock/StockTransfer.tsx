import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, Search, Save, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '#' },
    { title: 'Stock Transfer', href: '/stock/stock-transfer' },
];

interface Location { id: number; location_legal_name: string; }
interface Warehouse { id: number; name: string; }
interface Category { id: number; category_name: string; }
interface Item { 
    id: number; 
    item_name: string; 
    item_category_id: number;
    base_unit?: { id: number; uom_name: string }; 
    item_warehouse_mappings?: Array<{
        location_id: number;
        warehouse_id: number;
        current_quantity: string;
    }>;
}
interface User { id: number; name: string; }

export default function StockTransfer({
    locations = [],
    warehouses = [],
    categories = [],
    items = [],
    users = [],
}: {
    locations: Location[],
    warehouses: Warehouse[],
    categories: Category[],
    items: Item[],
    users: User[],
}) {
    const { data, setData, post, processing, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        from_location_id: '',
        to_location_id: '',
        from_warehouse_id: '',
        to_warehouse_id: '',
        transfer_type: 'Internal Warehouse Transfer',
        requested_by_id: '',
        remarks: '',
        document: null as File | null,
        items: [] as any[],
    });

    const [currentItemSearch, setCurrentItemSearch] = useState({
        item_category_id: '',
        item_id: '',
    });

    const handleAddItem = () => {
        if (!currentItemSearch.item_id) {
            toast.error('Please select an item first');
            return;
        }

        if (!data.from_location_id || !data.from_warehouse_id) {
            toast.error('Please select source location and warehouse');
            return;
        }

        const selectedItem = items.find(i => i.id.toString() === currentItemSearch.item_id);
        if (!selectedItem) return;

        // Check if already in list
        if (data.items.some(i => i.item_id === selectedItem.id)) {
            toast.error('Item already added to transfer list');
            return;
        }

        // Get current quantity at source
        const sourceMap = selectedItem.item_warehouse_mappings?.find(
            m => m.location_id.toString() === data.from_location_id && m.warehouse_id.toString() === data.from_warehouse_id
        );
        const currentQty = sourceMap ? parseFloat(sourceMap.current_quantity) : 0;

        const newItem = {
            item_id: selectedItem.id,
            item_name: selectedItem.item_name,
            item_category_id: selectedItem.item_category_id,
            category_name: categories.find(c => c.id === selectedItem.item_category_id)?.category_name || '',
            uom_name: selectedItem.base_unit?.uom_name || '',
            current_qty: currentQty,
            quantity: '', // Transfer quantity
            batch: '-', // Placeholder
        };

        setData('items', [...data.items, newItem]);
    };

    const handleItemQtyChange = (index: number, value: string) => {
        const newItems = [...data.items];
        newItems[index].quantity = value;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.items.length === 0) {
            toast.error('Please add at least one item to transfer');
            return;
        }
        if (data.from_location_id === data.to_location_id && data.from_warehouse_id === data.to_warehouse_id) {
            toast.error('Source and destination cannot be the same');
            return;
        }
        if (!data.requested_by_id) {
            toast.error('Please select who requested this transfer');
            return;
        }

        post('/stock/stock-transfer', {
            onSuccess: () => {
                reset();
                toast.success('Stock transfer processed successfully');
            }
        });
    };

    const filteredItems = currentItemSearch.item_category_id 
        ? items.filter(i => i.item_category_id.toString() === currentItemSearch.item_category_id)
        : items;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Transfer" />
            <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <h1 className="text-xl font-bold text-[#162a5b]">Stock Transfer</h1>
                    <div className="flex items-center gap-2">
                        <div className="bg-white border text-sm px-3 py-1.5 rounded flex items-center gap-2">
                            <span className="text-gray-500">Date:-</span>
                            <span className="font-medium text-[#162a5b]">{data.date}</span>
                        </div>
                        <Link href="/stock/transfer-report">
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-white">
                                <List className="size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-white p-6">
                    {/* Top Row Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-end">
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">From Location</Label>
                            <Select value={data.from_location_id} onValueChange={(v) => setData('from_location_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">From Warehouse</Label>
                            <Select value={data.from_warehouse_id} onValueChange={(v) => setData('from_warehouse_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Item Category</Label>
                            <Select value={currentItemSearch.item_category_id} onValueChange={(v) => setCurrentItemSearch(p => ({...p, item_category_id: v}))}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.category_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Item</Label>
                            <Select value={currentItemSearch.item_id} onValueChange={(v) => setCurrentItemSearch(p => ({...p, item_id: v}))}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredItems.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">To Location</Label>
                            <Select value={data.to_location_id} onValueChange={(v) => setData('to_location_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">To Warehouse</Label>
                            <Select value={data.to_warehouse_id} onValueChange={(v) => setData('to_warehouse_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-start">
                        <Button onClick={handleAddItem} className="bg-[#4caf50] hover:bg-[#43a047] text-white uppercase font-bold text-xs h-10 px-8">Search</Button>
                    </div>

                    {/* Transfer Items Table */}
                    <div className="mt-8 border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white border-b">
                                <TableRow>
                                    <TableHead className="font-bold text-gray-700 min-w-[60px]">Sr.No</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item Category</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item</TableHead>
                                    <TableHead className="font-bold text-gray-700">Batch</TableHead>
                                    <TableHead className="font-bold text-gray-700">Current Qty</TableHead>
                                    <TableHead className="font-bold text-gray-700">UOM</TableHead>
                                    <TableHead className="font-bold text-gray-700">Transfer Qty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.length > 0 ? data.items.map((item, index) => (
                                    <TableRow key={item.item_id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.category_name}</TableCell>
                                        <TableCell className="font-medium text-[#162a5b]">{item.item_name}</TableCell>
                                        <TableCell>{item.batch}</TableCell>
                                        <TableCell className="font-bold">{item.current_qty.toFixed(2)}</TableCell>
                                        <TableCell>{item.uom_name || '-'}</TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                className="h-8 w-24 border-gray-200" 
                                                value={item.quantity}
                                                onChange={e => handleItemQtyChange(index, e.target.value)}
                                                max={item.current_qty}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                                            No Data Available In Table
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Bottom Details Section */}
                    <div className="mt-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-200/60 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="space-y-2">
                                <Label className="text-gray-600 text-sm font-medium">Stock Transfer Type</Label>
                                <Select value={data.transfer_type} onValueChange={v => setData('transfer_type', v)}>
                                    <SelectTrigger className="bg-white h-10 border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Internal Warehouse Transfer">Internal Warehouse Transfer</SelectItem>
                                        <SelectItem value="Location Transfer">Location Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-600 text-sm font-medium">Requested By</Label>
                                <Select value={data.requested_by_id} onValueChange={v => setData('requested_by_id', v)}>
                                    <SelectTrigger className="bg-white h-10 border-gray-200">
                                        <SelectValue placeholder="-- Select User --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-600 text-sm font-medium">Document Upload</Label>
                                <div className="flex items-center gap-2 bg-white px-3 py-2 border rounded-md h-10 border-gray-200">
                                    <Input 
                                        type="file" 
                                        className="hidden" 
                                        id="doc-upload" 
                                        onChange={e => setData('document', e.target.files?.[0] || null)}
                                    />
                                    <Label htmlFor="doc-upload" className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded cursor-pointer text-xs font-medium border border-gray-300">
                                        Choose file
                                    </Label>
                                    <span className="text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                                        {data.document ? data.document.name : 'No file chosen'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-600 text-sm font-medium">Remarks</Label>
                                <Input 
                                    className="bg-white h-10 border-gray-200" 
                                    placeholder="Remarks" 
                                    value={data.remarks}
                                    onChange={e => setData('remarks', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button 
                                onClick={handleSubmit} 
                                disabled={processing || data.items.length === 0}
                                className="bg-[#4caf50] hover:bg-[#43a047] text-white uppercase font-bold text-xs h-10 px-10 shadow-md transition-all active:scale-95"
                            >
                                {processing ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
