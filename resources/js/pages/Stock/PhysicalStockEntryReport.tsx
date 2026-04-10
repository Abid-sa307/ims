import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '#' },
    { title: 'Physical Stock Entry Report', href: '/stock/physical-entry' },
];

interface Location { id: number; location_legal_name: string; }
interface Warehouse { id: number; name: string; location_id: number; }
interface Item { 
    id: number; 
    item_name: string; 
    base_unit?: { id: number; name: string };
}

export default function PhysicalStockEntryReport({
    locations = [],
    warehouses = [],
    items = [],
}: {
    locations: Location[],
    warehouses: Warehouse[],
    items: Item[],
}) {
    const { data, setData, post, processing, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        location_id: '',
        warehouse_id: '',
        items: [] as any[],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [tableItems, setTableItems] = useState<any[]>([]);

    const handleSearch = () => {
        if (!data.location_id || !data.warehouse_id) {
            toast.error("Please select Location and Warehouse first.");
            return;
        }

        const newTableItems = items.map(item => ({
            item_id: item.id,
            item_name: item.item_name,
            uom_name: item.base_unit?.name || '-',
            physical_stock: 0,
            remark: '',
        }));

        setTableItems(newTableItems);
        setData('items', newTableItems);
    };

    const handlePhysicalChange = (index: number, value: string) => {
        const updated = [...tableItems];
        updated[index].physical_stock = parseFloat(value) || 0;
        setTableItems(updated);
        setData('items', updated);
    };

    const handleRemarkChange = (index: number, value: string) => {
        const updated = [...tableItems];
        updated[index].remark = value;
        setTableItems(updated);
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock/physical-entry', {
            onSuccess: () => {
                toast.success('Physical stock entries recorded successfully.');
                setTableItems([]);
                reset();
            },
        });
    };

    const filteredData = tableItems.filter(item => 
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Physical Stock Entry Report" />
            <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <h1 className="text-xl font-bold text-[#162a5b]">Physical Stock Entry Report</h1>
                    <div className="flex items-center gap-2">
                        <div className="bg-white border text-sm px-3 py-1.5 rounded flex items-center gap-2">
                            <span className="text-gray-500">Date:-</span>
                            <span className="font-medium text-[#162a5b]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end">
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
                                <SelectTrigger className="bg-white border-gray-200 h-10">
                                    <SelectValue placeholder="-- Please Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.filter(w => !data.location_id || w.location_id?.toString() === data.location_id).map(w => (
                                        <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="bg-[#1e224e] hover:bg-[#161a3d] text-white font-bold h-10 px-8 flex gap-2">
                                <Search className="size-4" />
                                SEARCH
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mt-4 border-t">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-semibold">Filter:</span>
                            <div className="relative">
                                <Input 
                                    placeholder="Type to filter..." 
                                    className="h-9 w-64 pr-8 text-sm"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-2 top-2.5 size-4 text-gray-300" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            Show:
                            <Select defaultValue="all">
                                <SelectTrigger className="w-20 h-9 border-none shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#1e224e] border-b text-white hover:bg-[#1e224e]">
                                <TableRow className="hover:bg-[#1e224e]">
                                    <TableHead className="font-bold text-white w-20">Sr.No</TableHead>
                                    <TableHead className="font-bold text-white border-l border-white/10">Item</TableHead>
                                    <TableHead className="font-bold text-white border-l border-white/10">UOM</TableHead>
                                    <TableHead className="font-bold text-white border-l border-white/10">Physical Stock</TableHead>
                                    <TableHead className="font-bold text-white border-l border-white/10">Remark</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length > 0 ? filteredData.map((item, index) => (
                                    <TableRow key={item.item_id}>
                                        <TableCell className="border-r">{index + 1}</TableCell>
                                        <TableCell className="border-r font-medium text-[#162a5b]">{item.item_name}</TableCell>
                                        <TableCell className="border-r">{item.uom_name}</TableCell>
                                        <TableCell className="border-r">
                                            <Input 
                                                type="number" 
                                                className="h-8 border-none shadow-none p-0 focus-visible:ring-0" 
                                                value={item.physical_stock}
                                                onChange={e => handlePhysicalChange(index, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                className="h-8 border-none shadow-none p-0 focus-visible:ring-0" 
                                                placeholder="Remark"
                                                value={item.remark}
                                                onChange={e => handleRemarkChange(index, e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-gray-400">
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
                            className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold px-10"
                        >
                            SUBMIT
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
