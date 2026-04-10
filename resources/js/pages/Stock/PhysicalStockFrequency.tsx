import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '#' },
    { title: 'Physical Stock Entry', href: '/stock/physical-frequency' },
];

interface Location { id: number; location_legal_name: string; }
interface Warehouse { id: number; name: string; location_id: number; }
interface Category { id: number; category_name: string; }
interface Item { 
    id: number; 
    item_name: string; 
    item_category_id: number; 
    base_unit?: { id: number; name: string };
}

export default function PhysicalStockFrequency({
    locations = [],
    warehouses = [],
    categories = [],
    items = [],
    frequencies = [],
}: {
    locations: Location[],
    warehouses: Warehouse[],
    categories: Category[],
    items: Item[],
    frequencies: any[],
}) {
    const { data, setData, post, processing } = useForm({
        location_id: '',
        warehouse_id: '',
        items: [] as any[],
    });

    const [filterCategory, setFilterCategory] = useState('all');
    const [filterItem, setFilterItem] = useState('all');
    const [tableItems, setTableItems] = useState<any[]>([]);

    const handleSearch = () => {
        if (!data.location_id || !data.warehouse_id) {
            toast.error("Please select Location and Warehouse first.");
            return;
        }

        const filtered = items.filter(item => {
            const matchesCategory = filterCategory === 'all' || item.item_category_id.toString() === filterCategory;
            const matchesItem = filterItem === 'all' || item.id.toString() === filterItem;
            return matchesCategory && matchesItem;
        });

        const newTableItems = filtered.map(item => {
            const existing = frequencies.find(f => 
                f.location_id.toString() === data.location_id && 
                f.warehouse_id.toString() === data.warehouse_id &&
                f.item_id === item.id
            );

            return {
                item_id: item.id,
                item_name: item.item_name,
                category_name: categories.find(c => c.id === item.item_category_id)?.category_name || '-',
                uom_name: item.base_unit?.name || '-',
                daily: existing ? !!existing.daily : false,
                weekly: existing ? !!existing.weekly : false,
                monthly: existing ? !!existing.monthly : false,
            };
        });

        setTableItems(newTableItems);
        setData('items', newTableItems);
    };

    const handleCheckChange = (index: number, field: string, checked: boolean) => {
        const updated = [...tableItems];
        updated[index][field] = checked;
        setTableItems(updated);
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock/physical-frequency', {
            onSuccess: () => {
                toast.success('Frequency configurations updated successfully.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Physical Stock Frequency" />
            <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <h1 className="text-xl font-bold text-[#162a5b]">Physical Stock Entry (Frequency)</h1>
                </div>

                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Location</Label>
                            <Select value={data.location_id} onValueChange={v => setData('location_id', v)}>
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
                            <Select value={data.warehouse_id} onValueChange={v => setData('warehouse_id', v)}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.filter(w => !data.location_id || w.location_id?.toString() === data.location_id).map(w => (
                                        <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Item Category</Label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.category_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Item</Label>
                            <Select value={filterItem} onValueChange={setFilterItem}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="None selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Items</SelectItem>
                                    {items.filter(i => filterCategory === 'all' || i.item_category_id.toString() === filterCategory).map(i => (
                                        <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Button onClick={handleSearch} className="bg-[#4caf50] hover:bg-[#43a047] text-white uppercase font-bold text-xs h-10 w-full flex gap-2">
                                <Search className="size-4" />
                                SEARCH
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50 border-b">
                                <TableRow>
                                    <TableHead className="font-bold text-gray-700 w-16">Sr.No</TableHead>
                                    <TableHead className="w-12"><Checkbox disabled /></TableHead>
                                    <TableHead className="font-bold text-gray-700">Item</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item Category</TableHead>
                                    <TableHead className="font-bold text-gray-700">UOM</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-center">Daily <Checkbox className="ml-2" disabled /></TableHead>
                                    <TableHead className="font-bold text-gray-700 text-center">Weekly <Checkbox className="ml-2" disabled /></TableHead>
                                    <TableHead className="font-bold text-gray-700 text-center">Monthly <Checkbox className="ml-2" disabled /></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableItems.length > 0 ? tableItems.map((item, index) => (
                                    <TableRow key={item.item_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell className="font-semibold text-[#162a5b]">{item.item_name}</TableCell>
                                        <TableCell>{item.category_name}</TableCell>
                                        <TableCell>{item.uom_name}</TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox 
                                                checked={item.daily} 
                                                onCheckedChange={c => handleCheckChange(index, 'daily', !!c)} 
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox 
                                                checked={item.weekly} 
                                                onCheckedChange={c => handleCheckChange(index, 'weekly', !!c)} 
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox 
                                                checked={item.monthly} 
                                                onCheckedChange={c => handleCheckChange(index, 'monthly', !!c)} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-gray-400">
                                            No Data Available In Table
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-8">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={processing || tableItems.length === 0}
                            className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold px-8"
                        >
                            SUBMIT
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
