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
import { PlusCircle, Pencil, Trash2, Save, X, Layers } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Item Sub Category', href: '/inventory/item-sub-category' },
];

interface Category {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    category_id: number;
    name: string;
    category?: Category;
}

export default function ItemSubCategory({ subCategories = [], categories = [] }: { subCategories: SubCategory[], categories: Category[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        category_id: '' as string | number,
        name: '',
    });

    const handleCreateNew = () => {
        reset();
        clearErrors();
        setIsEditing(false);
        setViewMode('form');
    };

    const handleEdit = (subCategory: SubCategory) => {
        setData({
            id: subCategory.id,
            category_id: subCategory.category_id,
            name: subCategory.name
        });
        setIsEditing(true);
        setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this sub category?')) {
            destroy(`/inventory/item-sub-category/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && data.id) {
            put(`/inventory/item-sub-category/${data.id}`, {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        } else {
            post('/inventory/item-sub-category', {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Sub Category" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Item Sub Category</h1>
                        <p className="text-sm text-gray-500">Manage your inventory item sub categories based on active categories.</p>
                    </div>
                    {viewMode === 'list' && (
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2">
                            <PlusCircle className="size-4" />
                            Add Sub Category
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
                                        <TableHead className="font-semibold text-gray-900">Category</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Sub Category Name</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subCategories.length > 0 ? subCategories.map((sub) => (
                                        <TableRow key={sub.id} className="hover:bg-gray-50/50">
                                            <TableCell className="text-gray-500">{sub.id}</TableCell>
                                            <TableCell className="text-gray-600">{sub.category?.name || 'N/A'}</TableCell>
                                            <TableCell className="font-medium text-[#162a5b]">{sub.name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(sub)}>
                                                    <Pencil className="size-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(sub.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                                No sub categories found.
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
                                    <Layers className="size-4" />
                                    {isEditing ? 'Edit Sub Category' : 'New Sub Category'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="category_id">Select Category</Label>
                                        <Select 
                                            value={data.category_id.toString()} 
                                            onValueChange={(v) => setData('category_id', v)}
                                        >
                                            <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="--Please Select Category--" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <p className="text-xs text-red-500">{errors.category_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Sub Category Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Enter sub category name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="text-gray-500 border-gray-200">
                                            <X className="w-4 h-4 mr-1"/> Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing} className="bg-[#162a5b] hover:bg-[#162a5b]/90 text-white">
                                            {processing ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Save Sub Category</>}
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
