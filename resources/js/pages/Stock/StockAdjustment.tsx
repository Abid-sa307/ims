import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, List } from 'lucide-react';
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '#' },
    { title: 'Stock Adjustment', href: '/stock/adjustment' },
];

interface Location { id: number; location_legal_name: string; }
interface Warehouse { id: number; name: string; location_id: number; }
interface Category { id: number; category_name: string; }
interface Item { 
    id: number; 
    item_name: string; 
    item_category_id: number; 
    base_unit?: { id: number; name: string };
    item_warehouse_mappings?: any[];
}

export default function StockAdjustment({
    locations = [],
    warehouses = [],
    categories = [],
    items = [],
}: {
    locations: Location[],
    warehouses: Warehouse[],
    categories: Category[],
    items: Item[],
}) {
    const { data, setData, post, processing, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        location_id: '',
        warehouse_id: '',
        remarks: '',
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
            const mapping = item.item_warehouse_mappings?.find(m => 
                m.location_id.toString() === data.location_id && 
                m.warehouse_id.toString() === data.warehouse_id
            );
            const currentStock = mapping ? parseFloat(mapping.current_quantity) : 0;

            return {
                item_id: item.id,
                item_name: item.item_name,
                category_name: categories.find(c => c.id === item.item_category_id)?.category_name || '-',
                uom_name: item.base_unit?.name || '-',
                current_stock: currentStock,
                adjust_quantity: 0,
                remarks: '',
            };
        });

        setTableItems(newTableItems);
        setData('items', newTableItems);
    };

    const handleAdjustmentChange = (index: number, value: string) => {
        const updated = [...tableItems];
        updated[index].adjust_quantity = parseFloat(value) || 0;
        setTableItems(updated);
        setData('items', updated);
    };

    const handleItemRemarksChange = (index: number, value: string) => {
        const updated = [...tableItems];
        updated[index].remarks = value;
        setTableItems(updated);
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock/adjustment', {
            onSuccess: () => {
                toast.success('Stock adjustments saved successfully.');
                setTableItems([]);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Adjustment" />
            <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <h1 className="text-xl font-bold text-[#162a5b]">Stock Adjustment</h1>
                    <div className="flex items-center gap-2">
                        <div className="bg-white border text-sm px-3 py-1.5 rounded flex items-center gap-2">
                            <span className="text-gray-500">Date:-</span>
                            <span className="font-medium text-[#162a5b]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <List className="size-4" />
                        </Button>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-end">
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">Franchise</Label>
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
                        <div className="space-y-1.5">
                            <Label className="text-gray-600 text-sm">UOM</Label>
                            <Select disabled>
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Base UOM" />
                                </SelectTrigger>
                                <SelectContent />
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
                                    <TableHead className="font-bold text-gray-700">Sr.No</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item Category</TableHead>
                                    <TableHead className="font-bold text-gray-700">Item</TableHead>
                                    <TableHead className="font-bold text-gray-700">UOM</TableHead>
                                    <TableHead className="font-bold text-gray-700">Current Stock</TableHead>
                                    <TableHead className="font-bold text-gray-700">Adjust Quantity</TableHead>
                                    <TableHead className="font-bold text-gray-700">Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableItems.length > 0 ? tableItems.map((item, index) => (
                                    <TableRow key={item.item_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.category_name}</TableCell>
                                        <TableCell className="font-semibold text-[#162a5b]">{item.item_name}</TableCell>
                                        <TableCell>{item.uom_name}</TableCell>
                                        <TableCell className="font-bold">{item.current_stock.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                className="w-24 h-8 bg-gray-50/50 border-gray-100" 
                                                value={item.adjust_quantity}
                                                onChange={e => handleAdjustmentChange(index, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                className="h-8 bg-gray-50/50 border-gray-100 min-w-[200px]" 
                                                placeholder="Remarks"
                                                value={item.remarks}
                                                onChange={e => handleItemRemarksChange(index, e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                                            No Data Available In Table
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="space-y-1.5 p-4 border rounded-xl bg-gray-50/30">
                            <Label className="text-gray-600 text-sm font-semibold">General Remarks</Label>
                            <div className="flex gap-4">
                                <Input 
                                    className="bg-white" 
                                    placeholder="Enter Remarks" 
                                    value={data.remarks}
                                    onChange={e => setData('remarks', e.target.value)}
                                />
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={processing || tableItems.length === 0}
                                    className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold px-8"
                                >
                                    SUBMIT
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
