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
import { PlusCircle, Pencil, Trash2, Save, X, Warehouse as WarehouseIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Warehouse Master', href: '/inventory/warehouse-master' },
];

interface Location {
    id: number;
    location_legal_name: string;
}

interface Warehouse {
    id: number;
    location_id: number;
    name: string;
    location?: Location;
}

export default function WarehouseMaster({ warehouses = [], locations = [] }: { warehouses: Warehouse[], locations: Location[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        location_id: '' as string | number,
        name: '',
    });

    const handleCreateNew = () => {
        reset();
        clearErrors();
        setIsEditing(false);
        setViewMode('form');
    };

    const handleEdit = (warehouse: Warehouse) => {
        setData({
            id: warehouse.id,
            location_id: warehouse.location_id,
            name: warehouse.name
        });
        setIsEditing(true);
        setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this warehouse?')) {
            destroy(`/inventory/warehouse-master/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && data.id) {
            put(`/inventory/warehouse-master/${data.id}`, {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        } else {
            post('/inventory/warehouse-master', {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouse Master" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Warehouse Master</h1>
                        <p className="text-sm text-gray-500">Manage warehouses and link them to operating locations.</p>
                    </div>
                    {viewMode === 'list' && (
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2">
                            <PlusCircle className="size-4" />
                            Add Warehouse
                        </Button>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="font-semibold text-gray-900 w-[100px]">ID</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Location</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Warehouse Name</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {warehouses.length > 0 ? warehouses.map((wh) => (
                                        <TableRow key={wh.id} className="hover:bg-gray-50/50">
                                            <TableCell className="text-gray-500">{wh.id}</TableCell>
                                            <TableCell className="text-gray-600 font-medium">{wh.location?.location_legal_name || 'N/A'}</TableCell>
                                            <TableCell className="font-medium text-[#162a5b]">{wh.name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(wh)}>
                                                    <Pencil className="size-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(wh.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                                No warehouses found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="max-w-2xl">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
                                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <WarehouseIcon className="size-4" />
                                    {isEditing ? 'Edit Warehouse' : 'New Warehouse'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="location_id">Select Location</Label>
                                        <Select 
                                            value={data.location_id.toString()} 
                                            onValueChange={(v) => setData('location_id', v)}
                                        >
                                            <SelectTrigger className={errors.location_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="--Select Location--" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((loc) => (
                                                    <SelectItem key={loc.id} value={loc.id.toString()}>
                                                        {loc.location_legal_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.location_id && <p className="text-xs text-red-500">{errors.location_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Warehouse Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Enter warehouse name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="text-gray-500 border-gray-200">
                                            <X className="w-4 h-4 mr-1"/> Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing} className="bg-[#162a5b] hover:bg-[#162a5b]/90 text-white">
                                            {processing ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Save Warehouse</>}
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
