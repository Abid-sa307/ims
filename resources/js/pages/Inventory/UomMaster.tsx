import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Save, X, Ruler } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'UOM Master', href: '/inventory/uom-master' },
];

interface Uom {
    id: number;
    name: string;
}

export default function UomMaster({ uoms = [] }: { uoms: Uom[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        name: '',
    });

    const handleCreateNew = () => {
        reset();
        clearErrors();
        setIsEditing(false);
        setViewMode('form');
    };

    const handleEdit = (uom: Uom) => {
        setData({ id: uom.id, name: uom.name });
        setIsEditing(true);
        setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this UOM?')) {
            destroy(`/inventory/uom-master/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && data.id) {
            put(`/inventory/uom-master/${data.id}`, {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        } else {
            post('/inventory/uom-master', {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="UOM Master" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">UOM Master</h1>
                        <p className="text-sm text-gray-500">Manage Unit of Measures (UOM) for inventory items.</p>
                    </div>
                    {viewMode === 'list' && (
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2">
                            <PlusCircle className="size-4" />
                            Add UOM
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
                                        <TableHead className="font-semibold text-gray-900">UOM Name</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {uoms.length > 0 ? uoms.map((uom) => (
                                        <TableRow key={uom.id} className="hover:bg-gray-50/50">
                                            <TableCell className="text-gray-500">{uom.id}</TableCell>
                                            <TableCell className="font-medium text-[#162a5b]">{uom.name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(uom)}>
                                                    <Pencil className="size-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(uom.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center text-gray-500">
                                                No UOMs found.
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
                                    <Ruler className="size-4" />
                                    {isEditing ? 'Edit UOM' : 'New UOM'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">UOM Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="e.g. KG, LTR, PCS"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="text-gray-500 border-gray-200">
                                            <X className="w-4 h-4 mr-1"/> Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing} className="bg-[#162a5b] hover:bg-[#162a5b]/90 text-white">
                                            {processing ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Save UOM</>}
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
