import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Pencil, Trash2, Save, X, UserCheck, List } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Item Supplier Mapping', href: '/inventory/item-supplier-mapping' },
];

interface Profile {
    id: number;
    profile_name: string;
    location_id: number;
    warehouse_id: number;
    supplier_id: number;
    item_category_id: number;
    item_id: number;
    location?: { location_legal_name: string };
    warehouse?: { name: string };
    supplier?: { supplier_name: string };
    category?: { name: string };
    item?: { item_name: string };
}

export default function ItemSupplierMapping({ profiles = [], locations = [], warehouses = [], suppliers = [], categories = [], items = [] }: any) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        profile_name: '',
        location_id: '' as string | number,
        warehouse_id: '' as string | number,
        supplier_id: '' as string | number,
        item_category_id: '' as string | number,
        item_id: '' as string | number,
    });

    const handleCreateNew = () => {
        reset();
        clearErrors();
        setIsEditing(false);
        setViewMode('form');
    };

    const handleEdit = (profile: Profile) => {
        setData({
            id: profile.id,
            profile_name: profile.profile_name,
            location_id: profile.location_id,
            warehouse_id: profile.warehouse_id,
            supplier_id: profile.supplier_id,
            item_category_id: profile.item_category_id,
            item_id: profile.item_id,
        });
        setIsEditing(true);
        setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this mapping profile?')) {
            destroy(`/inventory/item-supplier-mapping/${id}`, { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && data.id) {
            put(`/inventory/item-supplier-mapping/${data.id}`, { onSuccess: () => { reset(); setViewMode('list'); } });
        } else {
            post('/inventory/item-supplier-mapping', { onSuccess: () => { reset(); setViewMode('list'); } });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Supplier Mapping" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Item Supplier Mapping</h1>
                        <p className="text-sm text-gray-500">Map items to specific suppliers based on profiles and locations.</p>
                    </div>
                    {viewMode === 'list' && (
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2">
                            <PlusCircle className="size-4" />
                            Create Profile Mapping
                        </Button>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <Tabs defaultValue="profiles" className="w-full">
                        <TabsList className="grid w-[400px] grid-cols-2 mb-4 bg-gray-100">
                            <TabsTrigger value="profiles" className="data-[state=active]:bg-white data-[state=active]:text-[#162a5b]">
                                <UserCheck className="size-4 mr-2"/> Profiles
                            </TabsTrigger>
                            <TabsTrigger value="itemList" className="data-[state=active]:bg-white data-[state=active]:text-[#162a5b]">
                                <List className="size-4 mr-2"/> Item List
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="profiles">
                            <Card className="border-gray-100 shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 text-[11px] uppercase tracking-wider">
                                            <TableRow>
                                                <TableHead>Profile Name</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Location / Warehouse</TableHead>
                                                <TableHead>Category / Item</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {profiles.length > 0 ? profiles.map((p: Profile) => (
                                                <TableRow key={p.id} className="hover:bg-gray-50/50">
                                                    <TableCell className="font-bold text-[#162a5b]">{p.profile_name}</TableCell>
                                                    <TableCell className="text-gray-900 font-semibold">{p.supplier?.supplier_name}</TableCell>
                                                    <TableCell>
                                                        <div className="text-[11px] text-gray-500 font-medium">{p.location?.location_legal_name}</div>
                                                        <div className="text-[10px] text-blue-600 font-bold">{p.warehouse?.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-[11px] text-gray-500 font-medium">{p.category?.name}</div>
                                                        <div className="text-[11px] text-gray-900 font-bold">{p.item?.item_name}</div>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(p)}>
                                                            <Pencil className="size-4 text-blue-500" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(p.id)}>
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={5} className="h-32 text-center text-gray-500 italic">No mapping profiles defined yet.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="itemList">
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader><CardTitle className="text-lg">Detailed Item Mapping List</CardTitle><CardDescription>Flat view of all assigned items and their suppliers.</CardDescription></CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50"><TableRow><TableHead>Item Name</TableHead><TableHead>Category</TableHead><TableHead>Supplier</TableHead><TableHead>Warehouse</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {profiles.map((p: Profile) => (
                                                <TableRow key={p.id} className="text-xs">
                                                    <TableCell className="font-bold">{p.item?.item_name}</TableCell>
                                                    <TableCell>{p.category?.name}</TableCell>
                                                    <TableCell className="text-blue-700 font-medium">{p.supplier?.supplier_name}</TableCell>
                                                    <TableCell>{p.warehouse?.name}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="max-w-4xl mx-auto w-full">
                        <Card className="border-gray-100 shadow-md">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                                <CardTitle className="text-sm font-semibold text-[#162a5b] flex items-center gap-2">
                                    <UserCheck className="size-4" />
                                    {isEditing ? `Edit Profile: ${data.profile_name}` : 'Create New Mapping Profile'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Profile Name</Label>
                                        <Input value={data.profile_name} onChange={e => setData('profile_name', e.target.value)} placeholder="e.g. North Zone - Electronics - Local" className={errors.profile_name ? 'border-red-500' : ''} />
                                        {errors.profile_name && <p className="text-xs text-red-500">{errors.profile_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-900 font-bold">Location</Label>
                                        <Select value={data.location_id.toString()} onValueChange={v => setData('location_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                                            <SelectContent>{locations.map((l: any) => <SelectItem key={l.id} value={l.id.toString()}>{l.location_legal_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.location_id && <p className="text-xs text-red-500">{errors.location_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-900 font-bold">Warehouse</Label>
                                        <Select value={data.warehouse_id.toString()} onValueChange={v => setData('warehouse_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                                            <SelectContent>{warehouses.map((w: any) => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.warehouse_id && <p className="text-xs text-red-500">{errors.warehouse_id}</p>}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-xs text-gray-900 font-bold">Select Supplier</Label>
                                        <Select value={data.supplier_id.toString()} onValueChange={v => setData('supplier_id', v)}>
                                            <SelectTrigger className="bg-blue-50/10 border-blue-100"><SelectValue placeholder="Choose Supplier" /></SelectTrigger>
                                            <SelectContent>{suppliers.map((s: any) => <SelectItem key={s.id} value={s.id.toString()}>{s.supplier_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.supplier_id && <p className="text-xs text-red-500">{errors.supplier_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-900 font-bold">Item Category</Label>
                                        <Select value={data.item_category_id.toString()} onValueChange={v => setData('item_category_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                            <SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.item_category_id && <p className="text-xs text-red-500">{errors.item_category_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-900 font-bold">Item</Label>
                                        <Select value={data.item_id.toString()} onValueChange={v => setData('item_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Item" /></SelectTrigger>
                                            <SelectContent>{items.map((i: any) => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {errors.item_id && <p className="text-xs text-red-500">{errors.item_id}</p>}
                                    </div>
                                    <div className="md:col-span-2 flex justify-end gap-4 pt-8 border-t border-gray-50 mt-4">
                                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="text-gray-500 border-gray-200 min-w-[100px]">Cancel</Button>
                                        <Button type="submit" disabled={processing} className="bg-[#162a5b] hover:bg-[#162a5b]/90 text-white min-w-[150px]">
                                            {processing ? "Saving..." : <><Save className="size-4 mr-2"/> Save Mapping Profile</>}
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
