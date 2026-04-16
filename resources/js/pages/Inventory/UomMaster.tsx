import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Save, X, Ruler, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'UOM Master', href: '/inventory/uom-master' },
];

interface Uom {
    id: number;
    uom_code: string;
    name: string;
}

export default function UomMaster({ uoms = [] }: { uoms: Uom[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        uom_code: '',
        name: '',
    });

    const handleCreateNew = () => {
        reset();
        clearErrors();
        setIsEditing(false);
        setViewMode('form');
    };

    const handleEdit = (uom: Uom) => {
        setData({ id: uom.id, uom_code: uom.uom_code || '', name: uom.name });
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

    const filteredUoms = uoms.filter(uom => {
        if (!searchQuery) return true;
        const lowercaseQuery = searchQuery.toLowerCase();
        return uom.name?.toLowerCase().includes(lowercaseQuery) || 
               uom.uom_code?.toLowerCase().includes(lowercaseQuery);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="UOM Master" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">UOM Master</h1>
                        <p className="text-sm text-gray-500">Manage Unit of Measures (UOM) for inventory items.</p>
                    </div>
                    {viewMode === 'list' && (
                        <div className="flex gap-3 items-center">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search UOMs..."
                                    className="pl-9 h-9 w-[250px] border-gray-200 text-sm focus-visible:ring-[#162a5b] rounded-md"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2 font-bold h-9">
                                <PlusCircle className="size-4" />
                                ADD UOM
                            </Button>
                        </div>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-gray-900 w-[100px] px-6">ID</TableHead>
                                        <TableHead className="font-bold text-gray-900 px-6">UOM Code</TableHead>
                                        <TableHead className="font-bold text-gray-900 px-6">Full Name</TableHead>
                                        <TableHead className="font-bold text-gray-900 text-right px-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUoms.length > 0 ? filteredUoms.map((uom) => (
                                        <TableRow key={uom.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="text-gray-500 px-6">{uom.id}</TableCell>
                                            <TableCell className="font-black text-[#162a5b] px-6">{uom.uom_code}</TableCell>
                                            <TableCell className="font-medium text-gray-700 px-6">{uom.name}</TableCell>
                                            <TableCell className="text-right space-x-2 px-6">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(uom)} className="h-8 w-8">
                                                    <Pencil className="size-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 h-8 w-8" onClick={() => handleDelete(uom.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-48 text-center text-gray-500 italic font-medium">
                                                No UOMs found matching your search.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="max-w-2xl">
                        <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                                <CardTitle className="text-lg font-bold text-[#162a5b] flex items-center gap-2">
                                    <Ruler className="size-5" />
                                    {isEditing ? 'Edit UOM' : 'Create New UOM'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="uom_code" className="font-bold text-gray-700">UOM Code</Label>
                                            <Input
                                                id="uom_code"
                                                value={data.uom_code}
                                                onChange={e => setData('uom_code', e.target.value.toUpperCase())}
                                                placeholder="e.g. KGS"
                                                className={`h-11 ${errors.uom_code ? 'border-red-500' : 'border-gray-200'} focus:ring-[#162a5b] rounded-lg uppercase font-bold`}
                                            />
                                            {errors.uom_code && <p className="text-xs text-red-500 font-bold">{errors.uom_code}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="font-bold text-gray-700">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="e.g. KILOGRAMS"
                                                className={`h-11 ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-[#162a5b] rounded-lg`}
                                            />
                                            {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name}</p>}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="px-6 h-11 text-gray-500 border-gray-200 font-semibold rounded-lg">
                                            <X className="w-4 h-4 mr-2"/> CANCEL
                                        </Button>
                                        <Button type="submit" disabled={processing} className="bg-[#162a5b] hover:bg-[#1c3a7a] text-white px-8 h-11 font-bold rounded-lg shadow-lg">
                                            {processing ? "SAVING..." : <><Save className="w-4 h-4 mr-2"/> SAVE UOM</>}
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
