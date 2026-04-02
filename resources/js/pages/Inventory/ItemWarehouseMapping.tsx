import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Pencil, Trash2, Save, X, Warehouse as WarehouseIcon, Link2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Item Warehouse Mapping', href: '/inventory/item-warehouse-mapping' },
];

interface Mapping {
    id: number;
    location_id: number;
    warehouse_id: number;
    item_category_id: number;
    item_id: number;
    location?: { location_legal_name: string };
    warehouse?: { name: string };
    category?: { name: string };
    item?: { item_name: string };
}

export default function ItemWarehouseMapping({ mappings = [], locations = [], warehouses = [], categories = [], items = [] }: any) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        location_id: '' as string | number,
        warehouse_id: '' as string | number,
        item_category_id: '' as string | number,
        item_id: '' as string | number,
    });

    const handleCreateNew = () => {
        reset();
        clearErrors();
        setIsEditing(false);
        setViewMode('form');
    };

    const handleEdit = (mapping: Mapping) => {
        setData({
            id: mapping.id,
            location_id: mapping.location_id,
            warehouse_id: mapping.warehouse_id,
            item_category_id: mapping.item_category_id,
            item_id: mapping.item_id,
        });
        setIsEditing(true);
        setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this warehouse mapping?')) {
            destroy(`/inventory/item-warehouse-mapping/${id}`, { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && data.id) {
            put(`/inventory/item-warehouse-mapping/${data.id}`, { onSuccess: () => { reset(); setViewMode('list'); } });
        } else {
            post('/inventory/item-warehouse-mapping', { onSuccess: () => { reset(); setViewMode('list'); } });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Warehouse Mapping" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Item Warehouse Mapping</h1>
                        <p className="text-sm text-gray-500">Map items to specific warehouses for stock management.</p>
                    </div>
                    {viewMode === 'list' && (
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2">
                            <PlusCircle className="size-4" />
                            Add Mapping
                        </Button>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <Card className="border-gray-100 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Warehouse</TableHead>
                                        <TableHead>Item Category</TableHead>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mappings.length > 0 ? mappings.map((m: Mapping) => (
                                        <TableRow key={m.id} className="hover:bg-gray-50/50">
                                            <TableCell className="text-gray-900">{m.location?.location_legal_name}</TableCell>
                                            <TableCell className="text-[#162a5b] font-bold">{m.warehouse?.name}</TableCell>
                                            <TableCell className="text-gray-600">{m.category?.name}</TableCell>
                                            <TableCell className="font-medium">{m.item?.item_name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(m)}>
                                                    <Pencil className="size-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(m.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={5} className="h-32 text-center text-gray-500">No warehouse mappings found.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="max-w-2xl">
                        <Card className="border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
                                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <Link2 className="size-4" />
                                    {isEditing ? 'Edit Warehouse Mapping' : 'New Warehouse Mapping'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label>Select Location</Label>
                                        <Select value={data.location_id.toString()} onValueChange={v => setData('location_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                                            <SelectContent>{locations.map((l: any) => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.location_id && <p className="text-xs text-red-500">{errors.location_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Select Warehouse</Label>
                                        <Select value={data.warehouse_id.toString()} onValueChange={v => setData('warehouse_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                                            <SelectContent>{warehouses.map((w: any) => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.warehouse_id && <p className="text-xs text-red-500">{errors.warehouse_id}</p>}
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t border-gray-50 mt-4">
                                        <Label>Select Item Category</Label>
                                        <Select value={data.item_category_id.toString()} onValueChange={v => setData('item_category_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                            <SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.item_category_id && <p className="text-xs text-red-500">{errors.item_category_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Select Item</Label>
                                        <Select value={data.item_id.toString()} onValueChange={v => setData('item_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select Item" /></SelectTrigger>
                                            <SelectContent>{items.map((i: any) => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.item_id && <p className="text-xs text-red-500">{errors.item_id}</p>}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="text-gray-500 border-gray-200">Cancel</Button>
                                        <Button type="submit" disabled={processing} className="bg-[#162a5b] hover:bg-[#162a5b]/90 text-white min-w-[120px]">
                                            {processing ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Save Mapping</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
