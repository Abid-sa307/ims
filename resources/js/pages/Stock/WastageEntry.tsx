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
import { List, Search, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '#' },
    { title: 'Wastage Entry', href: '/stock/wastage-entry' },
];

interface Location { id: number; location_legal_name: string; }
interface Warehouse { id: number; name: string; }
interface Category { id: number; category_name: string; }
interface Item { 
    id: number; 
    item_name: string; 
    item_category_id: number;
    base_unit?: { id: number; uom_name: string }; 
}
interface UOM { id: number; uom_name: string; }

export default function WastageEntry({
    locations = [],
    warehouses = [],
    categories = [],
    items = [],
    uoms = [],
    recentEntries = [],
}: {
    locations: Location[],
    warehouses: Warehouse[],
    categories: Category[],
    items: Item[],
    uoms: UOM[],
    recentEntries: any[],
}) {
    const { data, setData, post, processing, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        location_id: '',
        warehouse_id: '',
        remarks: '',
        items: [] as any[],
    });

    const [currentItem, setCurrentItem] = useState({
        item_category_id: '',
        item_id: '',
    });

    const handleAddItem = () => {
        if (!currentItem.item_id) {
            toast.error('Please select an item first');
            return;
        }

        const selectedItem = items.find(i => i.id.toString() === currentItem.item_id);
        if (!selectedItem) return;

        // Check if already in list
        if (data.items.some(i => i.item_id === selectedItem.id)) {
            toast.error('Item already added to wastage list');
            return;
        }

        const newItem = {
            item_id: selectedItem.id,
            item_name: selectedItem.item_name,
            item_category_id: selectedItem.item_category_id,
            category_name: categories.find(c => c.id === selectedItem.item_category_id)?.category_name || '',
            uom_id: selectedItem.base_unit?.id || '',
            uom_name: selectedItem.base_unit?.uom_name || '',
            wastage_quantity: '',
            reason: '',
            remarks: '',
        };

        setData('items', [...data.items, newItem]);
    };

    const handleItemDataChange = (index: number, field: string, value: string) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.items.length === 0) {
            toast.error('Please add at least one item to wastage list');
            return;
        }
        post('/stock/wastage-entry', {
            onSuccess: () => {
                reset();
                toast.success('Wastage entry submitted successfully');
            }
        });
    };

    const filteredItems = currentItem.item_category_id 
        ? items.filter(i => i.item_category_id.toString() === currentItem.item_category_id)
        : items;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wastage Entry" />
            <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <h1 className="text-xl font-bold text-[#162a5b]">Wastage Entry</h1>
                    <div className="flex items-center gap-2">
                        <div className="bg-white border text-sm px-3 py-1.5 rounded flex items-center gap-2">
                            <span className="text-gray-500">Date:-</span>
                            <span className="font-medium text-[#162a5b]">{data.date}</span>
                        </div>
                        <Link href="/stock/current-stock">
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-white">
                                <List className="size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end">
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Franchise</Label>
                            <Select value={data.location_id} onValueChange={(v) => setData('location_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Warehouse</Label>
                            <Select value={data.warehouse_id} onValueChange={(v) => setData('warehouse_id', v)}>
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
                            <Select value={currentItem.item_category_id} onValueChange={(v) => setCurrentItem(p => ({...p, item_category_id: v}))}>
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
                            <Select value={currentItem.item_id} onValueChange={(v) => setCurrentItem(p => ({...p, item_id: v}))}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredItems.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-1 flex gap-2 items-end">
                            <div className="flex-1 space-y-1.5">
                                <Label className="text-gray-600 text-sm">Remarks</Label>
                                <Input 
                                    className="h-10 border-gray-200" 
                                    value={data.remarks} 
                                    onChange={e => setData('remarks', e.target.value)} 
                                />
                            </div>
                            <Button onClick={handleAddItem} className="bg-[#4caf50] hover:bg-[#43a047] text-white uppercase font-bold text-xs h-10 px-6">Search</Button>
                        </div>
                    </div>

                    <div className="mt-8 border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50 border-b">
                                <TableRow>
                                    <TableHead className="font-bold text-gray-700 min-w-[60px]">Sr.No</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item Category</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item</TableHead>
                                    <TableHead className="font-bold text-gray-700">UOM</TableHead>
                                    <TableHead className="font-bold text-gray-700">Wastage Quantity</TableHead>
                                    <TableHead className="font-bold text-gray-700">Reason</TableHead>
                                    <TableHead className="font-bold text-gray-700">Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.length > 0 ? data.items.map((item, index) => (
                                    <TableRow key={item.item_id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.category_name}</TableCell>
                                        <TableCell className="font-medium text-[#162a5b]">{item.item_name}</TableCell>
                                        <TableCell>{item.uom_name || '-'}</TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                className="h-8 w-24 border-gray-200" 
                                                value={item.wastage_quantity}
                                                onChange={e => handleItemDataChange(index, 'wastage_quantity', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                className="h-8 border-gray-200" 
                                                value={item.reason}
                                                onChange={e => handleItemDataChange(index, 'reason', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                className="h-8 border-gray-200" 
                                                value={item.item_remarks}
                                                onChange={e => handleItemDataChange(index, 'item_remarks', e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                                            Select an item and click 'Search' to add to the wastage list.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={processing || data.items.length === 0}
                            className="bg-[#4caf50] hover:bg-[#43a047] text-white uppercase font-bold text-xs h-10 px-8"
                        >
                            {processing ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </Card>

                {/* Recent Entries Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <List className="size-5 text-[#162a5b]" />
                            <h2 className="text-lg font-bold text-[#162a5b]">Recent Wastage Entries</h2>
                        </div>
                        <span className="text-xs text-gray-500 uppercase font-semibold">Showing last 10 entries</span>
                    </div>

                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#162a5b] hover:bg-[#162a5b]">
                                <TableRow>
                                    <TableHead className="text-white font-bold h-10 py-0">Date</TableHead>
                                    <TableHead className="text-white font-bold h-10 py-0">Location</TableHead>
                                    <TableHead className="text-white font-bold h-10 py-0">Warehouse</TableHead>
                                    <TableHead className="text-white font-bold h-10 py-0">Item Name</TableHead>
                                    <TableHead className="text-white font-bold h-10 py-0">Qty</TableHead>
                                    <TableHead className="text-white font-bold h-10 py-0">UOM</TableHead>
                                    <TableHead className="text-white font-bold h-10 py-0">Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentEntries && recentEntries.length > 0 ? (
                                    recentEntries.map((entry) => (
                                        <TableRow key={entry.id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 border-gray-100 h-10 py-0">
                                            <TableCell className="py-2 text-[11px] font-medium">{entry.date}</TableCell>
                                            <TableCell className="py-2 text-[11px]">{entry.location?.location_legal_name || 'N/A'}</TableCell>
                                            <TableCell className="py-2 text-[11px]">{entry.warehouse?.name || 'N/A'}</TableCell>
                                            <TableCell className="py-2 text-[11px] font-semibold text-[#162a5b]">{entry.item?.item_name || 'N/A'}</TableCell>
                                            <TableCell className="py-2 text-[11px] font-bold text-red-600">-{entry.wastage_quantity}</TableCell>
                                            <TableCell className="py-2 text-[11px]">{entry.item?.base_unit?.uom_name || '-'}</TableCell>
                                            <TableCell className="py-2 text-[11px] text-gray-600 max-w-xs truncate" title={entry.reason}>
                                                {entry.reason || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-20 text-center text-gray-400 text-sm">
                                            No recent wastage entries found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
