import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Save, X, Tags, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Item Category', href: '/inventory/item-categories' },
];

interface Category {
    id: number;
    name: string;
}

export default function ItemCategory({ categories = [] }: { categories: Category[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleEdit = (category: Category) => {
        setData({ id: category.id, name: category.name });
        setIsEditing(true);
        setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(`/inventory/item-categories/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && data.id) {
            put(`/inventory/item-categories/${data.id}`, {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        } else {
            post('/inventory/item-categories', {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        }
    };

    const filteredCategories = categories.filter(cat => {
        if (!searchQuery) return true;
        const lowercaseQuery = searchQuery.toLowerCase();
        return cat.name?.toLowerCase().includes(lowercaseQuery);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Category" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Item Category</h1>
                        <p className="text-sm text-gray-500">Manage your inventory item categories.</p>
                    </div>
                    {viewMode === 'list' && (
                        <div className="flex gap-3 items-center">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="pl-9 h-9 w-[250px] border-gray-200 text-sm focus-visible:ring-[#162a5b] rounded-md"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2">
                                <PlusCircle className="size-4" />
                                Add Category
                            </Button>
                        </div>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="font-semibold text-gray-900 w-[100px]">ID</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Category Name</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                                        <TableRow key={cat.id} className="hover:bg-gray-50/50">
                                            <TableCell className="text-gray-500">{cat.id}</TableCell>
                                            <TableCell className="font-medium text-[#162a5b]">{cat.name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(cat)}>
                                                    <Pencil className="size-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(cat.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center text-gray-500">
                                                No categories found.
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
                                    <Tags className="size-4" />
                                    {isEditing ? 'Edit Category' : 'New Category'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Category Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Enter category name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="text-gray-500 border-gray-200">
                                            <X className="w-4 h-4 mr-1"/> Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing} className="bg-[#162a5b] hover:bg-[#162a5b]/90 text-white">
                                            {processing ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Save Category</>}
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
