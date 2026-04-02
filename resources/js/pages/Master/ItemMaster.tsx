import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, NavItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { List, FileUp, Plus, Trash2, Edit, Save, X, LayoutGrid } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Item {
    id: number;
    item_name: string;
    item_category_id: number | null;
    item_sub_category_id: number | null;
    brand_id: number | null;
    item_type_id: number | null;
    item_name_gujarati: string | null;
    equivalent_selling_item: string | null;
    safety_quantity: number;
    base_unit_id: number | null;
    default_tax_id: number | null;
    selling_item_as: 'Goods' | 'Service';
    hsn_code: string | null;
    sac_code: string | null;
    htsn_code: string | null;
    fda_product_code: string | null;
    is_cess: boolean;
    cess_percentage: number;
    cess_description: string | null;
    price_type: string | null;
    standard_sale_price: number;
    standard_purchase_price: number;
    net_cost: number;
    shelf_life_days: number;
    single_batch_quantity: number;
    item_barcode: string | null;
    item_sku: string | null;
    standard_weight_single_unit: number;
    weight_adjustment_gross_weight: number;
    pallet_size_export: string | null;
    is_manufacture: boolean;
    is_fat_item: boolean;
    is_packing_item: boolean;
    allow_multiple_entry_po: boolean;
    has_parent_item: boolean;
    remarks: string | null;
    ingredients: string | null;
    nutrition_information: string | null;
    description: string | null;
    item_tally_code: string | null;
    uom_conversions?: any[];
}

interface Props {
    items: Item[];
    categories: any[];
    subCategories: any[];
    itemTypes: any[];
    brands: any[];
    uoms: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master', href: '#' },
    { title: 'Item Master', href: '/master/item-master' },
];

export default function ItemMaster({ 
    items = [], 
    categories = [], 
    subCategories = [], 
    itemTypes = [], 
    brands = [], 
    uoms = [] 
}: Props) {
    const [showList, setShowList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const importFileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        item_name: '',
        item_category_id: '' as any,
        item_sub_category_id: '' as any,
        brand_id: '' as any,
        item_type_id: '' as any,
        item_name_gujarati: '',
        equivalent_selling_item: '',
        safety_quantity: 0,
        base_unit_id: '' as any,
        default_tax_id: '' as any,
        selling_item_as: 'Goods' as 'Goods' | 'Service',
        hsn_code: '',
        sac_code: '',
        htsn_code: '',
        fda_product_code: '',
        is_cess: false,
        cess_percentage: 0,
        cess_description: '',
        price_type: '',
        standard_sale_price: 0,
        standard_purchase_price: 0,
        net_cost: 0,
        shelf_life_days: 0,
        single_batch_quantity: 1,
        item_barcode: '',
        item_sku: '',
        standard_weight_single_unit: 0,
        weight_adjustment_gross_weight: 0,
        pallet_size_export: '',
        is_manufacture: false,
        is_fat_item: false,
        is_packing_item: false,
        allow_multiple_entry_po: false,
        has_parent_item: false,
        remarks: '',
        ingredients: '',
        nutrition_information: '',
        description: '',
        item_tally_code: '',
        uom_conversions: [] as any[],
    });

    const addUomConversion = () => {
        setData('uom_conversions', [
            ...data.uom_conversions,
            { target_uom_id: '', uom_multiplier: 1, quantity_multiplier: 1, min_order_quantity: 0 }
        ]);
    };

    const removeUomConversion = (index: number) => {
        const newConversions = [...data.uom_conversions];
        newConversions.splice(index, 1);
        setData('uom_conversions', newConversions);
    };

    const updateUomConversion = (index: number, field: string, value: any) => {
        const newConversions = [...data.uom_conversions];
        newConversions[index][field] = value;
        setData('uom_conversions', newConversions);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/master/item-master/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                    setShowList(true);
                },
            });
        } else {
            post('/master/item-master', {
                onSuccess: () => {
                    reset();
                    setShowList(true);
                },
            });
        }
    };

    const handleEdit = (item: Item) => {
        setEditingId(item.id);
        setData({
            ...item,
            item_category_id: item.item_category_id?.toString() || '',
            item_sub_category_id: item.item_sub_category_id?.toString() || '',
            brand_id: item.brand_id?.toString() || '',
            item_type_id: item.item_type_id?.toString() || '',
            base_unit_id: item.base_unit_id?.toString() || '',
            default_tax_id: item.default_tax_id?.toString() || '',
            uom_conversions: item.uom_conversions || [],
        } as any);
        setShowList(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(`/master/item-master/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Master" />
            <div className="flex flex-col gap-6 p-6 bg-slate-50/50 min-h-screen">
                
                {/* Header with actions */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Item Master</h1>
                        <p className="text-sm text-slate-500">Manage your product inventory and specifications</p>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                            onClick={() => setShowList(!showList)}
                        >
                            {showList ? (
                                <><Plus className="mr-2 h-4 w-4" /> Add Item</>
                            ) : (
                                <><List className="mr-2 h-4 w-4" /> View Range</>
                            )}
                        </Button>
                    </div>
                </div>

                {showList ? (
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="font-semibold text-slate-700">Item Name</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Category</TableHead>
                                        <TableHead className="font-semibold text-slate-700">SKU</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Price</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="font-medium text-slate-900">{item.item_name}</TableCell>
                                                <TableCell className="text-slate-600">{(item as any).category?.name || 'N/A'}</TableCell>
                                                <TableCell className="text-slate-600">{item.item_sku || 'N/A'}</TableCell>
                                                <TableCell className="text-slate-600 font-mono">₹{item.standard_sale_price}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleEdit(item)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                                No items found. Capture your first product!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                ) : (
                    <form onSubmit={submit} className="flex flex-col gap-8 pb-20">
                        {/* Section 1: Item Master Header */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <LayoutGrid className="size-5 text-indigo-500" /> Item Master
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Item Category</Label>
                                        <Select value={data.item_category_id} onValueChange={(v) => setData('item_category_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="-- Please Select --" /></SelectTrigger>
                                            <SelectContent>
                                                {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Sub Category</Label>
                                        <Select value={data.item_sub_category_id} onValueChange={(v) => setData('item_sub_category_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="-- Please Select --" /></SelectTrigger>
                                            <SelectContent>
                                                {subCategories.filter(sc => sc.item_category_id.toString() === data.item_category_id).map(sc => (
                                                    <SelectItem key={sc.id} value={sc.id.toString()}>{sc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Brand</Label>
                                        <Select value={data.brand_id} onValueChange={(v) => setData('brand_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="-- Please Select --" /></SelectTrigger>
                                            <SelectContent>
                                                {brands.map(b => <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Item Type</Label>
                                        <Select value={data.item_type_id} onValueChange={(v) => setData('item_type_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="-- Please Select --" /></SelectTrigger>
                                            <SelectContent>
                                                {itemTypes.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-slate-600">Item Name</Label>
                                        <Input value={data.item_name} onChange={e => setData('item_name', e.target.value)} placeholder="Please Enter Item Name" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-slate-600">Item Name (Gujarati)</Label>
                                        <Input value={data.item_name_gujarati || ''} onChange={e => setData('item_name_gujarati', e.target.value)} placeholder="Please Enter Item Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Equivalent Selling Item</Label>
                                        <Select value={data.equivalent_selling_item || ''} onValueChange={v => setData('equivalent_selling_item', v)}>
                                            <SelectTrigger><SelectValue placeholder="-- Please Select --" /></SelectTrigger>
                                            <SelectContent>
                                                {items.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.item_name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Safety Quantity</Label>
                                        <Input type="number" value={data.safety_quantity} onChange={e => setData('safety_quantity', parseFloat(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Base Unit</Label>
                                        <Select value={data.base_unit_id} onValueChange={v => setData('base_unit_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="-- Please Select --" /></SelectTrigger>
                                            <SelectContent>
                                                {uoms.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 2: UOM Conversation */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-slate-800">UOM Conversation</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addUomConversion} className="h-8 bg-white">
                                    <Plus className="mr-2 h-3 w-3" /> Add Conversion
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/30">
                                        <TableRow>
                                            <TableHead className="text-slate-600">UOM</TableHead>
                                            <TableHead className="text-slate-600">UOM Multiplier</TableHead>
                                            <TableHead className="text-slate-600">Quantity Multiplier</TableHead>
                                            <TableHead className="text-slate-600">Min. Order Qty</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.uom_conversions.length > 0 ? (
                                            data.uom_conversions.map((conv, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="p-2">
                                                        <Select value={conv.target_uom_id} onValueChange={v => updateUomConversion(index, 'target_uom_id', v)}>
                                                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                {uoms.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <Input type="number" className="h-9" value={conv.uom_multiplier} onChange={e => updateUomConversion(index, 'uom_multiplier', parseFloat(e.target.value))} />
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <Input type="number" className="h-9" value={conv.quantity_multiplier} onChange={e => updateUomConversion(index, 'quantity_multiplier', parseFloat(e.target.value))} />
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <Input type="number" className="h-9" value={conv.min_order_quantity} onChange={e => updateUomConversion(index, 'min_order_quantity', parseFloat(e.target.value))} />
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => removeUomConversion(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-20 text-center text-slate-400 italic">
                                                    Please Select Base Unit To Add UOM Conversation
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Section 3: Pricing and GST */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                                <CardTitle className="text-lg font-semibold text-slate-800">Pricing and GST</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Default Tax</Label>
                                        <Select value={data.default_tax_id || ''} onValueChange={v => setData('default_tax_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="-- Please Select --" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">GST 5%</SelectItem>
                                                <SelectItem value="2">GST 12%</SelectItem>
                                                <SelectItem value="3">GST 18%</SelectItem>
                                                <SelectItem value="4">GST 28%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600 block mb-3">Selling Item As</Label>
                                        <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                                            <button 
                                                type="button" 
                                                onClick={() => setData('selling_item_as', 'Goods')}
                                                className={cn("px-4 py-1.5 text-xs font-medium rounded-md transition-all", data.selling_item_as === 'Goods' ? "bg-green-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
                                            >Goods</button>
                                            <button 
                                                type="button" 
                                                onClick={() => setData('selling_item_as', 'Service')}
                                                className={cn("px-4 py-1.5 text-xs font-medium rounded-md transition-all", data.selling_item_as === 'Service' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
                                            >Service</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">HSN Code</Label>
                                        <Input value={data.hsn_code || ''} onChange={e => setData('hsn_code', e.target.value)} placeholder="Please Enter Item HSN" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">SAC Code</Label>
                                        <Input value={data.sac_code || ''} onChange={e => setData('sac_code', e.target.value)} placeholder="Please Enter Item SAC" />
                                    </div>

                                    {/* Toggles Row */}
                                    <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-6 py-4 border-y border-slate-100 bg-slate-50/30 px-4 -mx-6">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-medium text-slate-700">Manufacture This Item?</Label>
                                            <Switch checked={data.is_manufacture} onCheckedChange={v => setData('is_manufacture', v)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-medium text-slate-700">Is Fat Item?</Label>
                                            <Switch checked={data.is_fat_item} onCheckedChange={v => setData('is_fat_item', v)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-medium text-slate-700">Is Packing Item?</Label>
                                            <Switch checked={data.is_packing_item} onCheckedChange={v => setData('is_packing_item', v)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-medium text-slate-700">Has Parent Item?</Label>
                                            <Switch checked={data.has_parent_item} onCheckedChange={v => setData('has_parent_item', v)} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Standard Sale Price</Label>
                                        <Input type="number" value={data.standard_sale_price} onChange={e => setData('standard_sale_price', parseFloat(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Standard Purchase Price</Label>
                                        <Input type="number" value={data.standard_purchase_price} onChange={e => setData('standard_purchase_price', parseFloat(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Net Cost</Label>
                                        <Input type="number" value={data.net_cost} onChange={e => setData('net_cost', parseFloat(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Shelf Life (In Days)</Label>
                                        <Input type="number" value={data.shelf_life_days} onChange={e => setData('shelf_life_days', parseInt(e.target.value))} />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-slate-600">Ingredients</Label>
                                        <textarea 
                                            className="w-full min-h-[100px] rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            value={data.ingredients || ''}
                                            onChange={e => setData('ingredients', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-slate-600">Description</Label>
                                        <textarea 
                                            className="w-full min-h-[100px] rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            value={data.description || ''}
                                            onChange={e => setData('description', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-4 flex justify-end gap-3 pt-6 mt-8 border-t border-slate-100">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => { reset(); setEditingId(null); setShowList(true); }}
                                            className="px-8"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 px-10"
                                        >
                                            <Save className="mr-2 h-4 w-4" /> {processing ? 'Saving...' : (editingId ? 'Update Item' : 'Add Item')}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
