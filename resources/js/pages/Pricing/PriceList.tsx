import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { List, Plus, X, Search } from 'lucide-react';
import { useState } from 'react';

// Interfaces
interface Supplier {
    id: number;
    supplier_name: string;
    location: string | null;
}

interface Location {
    id: number;
    location_legal_name: string;
    location_type: string | null;
}

interface ItemCategory {
    id: number;
    name: string;
}

interface Item {
    id: number;
    item_name: string;
    standard_sale_price: string | number;
    tax_percent: string | number | null;
    base_unit_id: number | null;
    item_category_id: number | null;
    base_unit?: { id: number; name: string };
}

interface PriceListItemData {
    item_id: number;
    item_name: string;
    selling_price: string | number;
    discount: string | number;
    tax_percent: string | number | null;
    uom: string | null;
}

interface Props {
    suppliers?: Supplier[];
    locations: Location[];
    categories: ItemCategory[];
    items: Item[];
    priceLists?: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory Management', href: '#' },
    { title: 'Price List', href: '/inventory/price-lists' },
];

export default function PriceList({ suppliers = [], locations = [], categories = [], items = [], priceLists = [] }: Props) {
    const [showList, setShowList] = useState(true); // Default to list view if we are on the view page
    const [searchQuery, setSearchQuery] = useState('');
    
    // Internal state for selected item
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [gridItems, setGridItems] = useState<PriceListItemData[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        price_list_name: '',
        price_list_type: 'Flat Price Base',
        seller_id: '',
        applied_on: 'HQ',
        buyer_id: '',
        item_category_id: '',
        discount_percent: '',
        default_markup_percent: '',
        period_start: '',
        period_end: '',
        price_list_items: [] as PriceListItemData[],
        _method: 'POST',
    });

    const handleAddItem = () => {
        if (!selectedItemId) return;
        
        // Prevent duplicate addition
        if (gridItems.some(i => i.item_id === Number(selectedItemId))) return;

        const item = items.find(i => i.id === Number(selectedItemId));
        if (!item) return;

        const newGridItems: PriceListItemData[] = [...gridItems, {
            item_id: item.id,
            item_name: item.item_name,
            selling_price: item.standard_sale_price || '',
            discount: '',
            tax_percent: item.tax_percent || '',
            uom: item.base_unit?.name || '',
        }];
        setGridItems(newGridItems);
        
        // Clear selection to allow adding another easily
        setSelectedItemId('');
        
        // Update form state directly
        setData(prev => ({
            ...prev,
            price_list_items: newGridItems
        }));
    };

    const handleGridItemChange = (index: number, field: keyof PriceListItemData, value: string) => {
        const updatedItems = [...gridItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setGridItems(updatedItems);
        setData('price_list_items', updatedItems);
    };

    const removeGridItem = (index: number) => {
        const updatedItems = [...gridItems];
        updatedItems.splice(index, 1);
        setGridItems(updatedItems);
        setData('price_list_items', updatedItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('price_list_items', gridItems);

        post('/inventory/price-lists', {
            onSuccess: () => {
                reset();
                setGridItems([]);
                setSelectedItemId('');
                setShowList(true);
            },
        });
    };

    const filteredPriceLists = priceLists.filter(pl => {
        if (!searchQuery) return true;
        const lowercaseQuery = searchQuery.toLowerCase();
        return (pl.price_list_name?.toLowerCase().includes(lowercaseQuery) || 
               pl.seller?.supplier_name?.toLowerCase().includes(lowercaseQuery) ||
               pl.buyer?.location_legal_name?.toLowerCase().includes(lowercaseQuery) ||
               pl.price_list_type?.toLowerCase().includes(lowercaseQuery));
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Price List" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Price List</h1>
                    <div className="flex gap-3 items-center">
                        {showList && (
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search price lists..."
                                    className="pl-9 h-8 w-[250px] border-gray-200 text-sm focus-visible:ring-[#162a5b] rounded-sm bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-2"
                            onClick={() => setShowList(!showList)}
                        >
                            {showList ? (
                                <><Plus className="h-4 w-4" /> ADD NEW</>
                            ) : (
                                <><List className="h-4 w-4" /> VIEW LIST</>
                            )}
                        </Button>
                    </div>
                </div>

                {!showList ? (
                <form onSubmit={submit} className="bg-white border border-t-0 shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">

                        <div className="space-y-2 md:col-span-3">
                            <Label className="text-xs text-gray-600 font-normal">Price List Name <span className="text-red-500">*</span></Label>
                            <Input 
                                className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300" 
                                placeholder="Please Enter Price List Name" 
                                value={data.price_list_name}
                                onChange={(e) => setData('price_list_name', e.target.value)}
                                required
                            />
                            {errors.price_list_name && <p className="text-red-500 text-xs mt-1">{errors.price_list_name}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-3">
                            <Label className="text-xs text-gray-600 font-normal">Price List Type</Label>
                            <select 
                                className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                value={data.price_list_type}
                                onChange={(e) => setData('price_list_type', e.target.value)}
                            >
                                <option value="Flat Price Base">Flat Price Base</option>
                                <option value="Markup Base">Markup Base</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Seller</Label>
                            <select 
                                className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                value={data.seller_id}
                                onChange={(e) => setData('seller_id', e.target.value)}
                            >
                                <option value="">-- Please Select --</option>
                                {suppliers.map(sup => (
                                    <option key={sup.id} value={sup.id}>{sup.supplier_name} {sup.location ? `(${sup.location})` : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Applied On</Label>
                            <select 
                                className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                value={data.applied_on}
                                onChange={(e) => setData('applied_on', e.target.value)}
                            >
                                <option value="HQ">HQ</option>
                                <option value="Customer">Customer</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Buyer</Label>
                            <select 
                                className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                value={data.buyer_id}
                                onChange={(e) => setData('buyer_id', e.target.value)}
                            >
                                <option value="">-- Please Select --</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.location_legal_name} ({loc.location_type})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Items List</Label>
                            <select 
                                className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                value={selectedItemId}
                                onChange={(e) => setSelectedItemId(e.target.value)}
                            >
                                <option value="">None selected</option>
                                {items.map(it => (
                                    <option key={it.id} value={it.id}>{it.item_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Discount(%)</Label>
                            <Input 
                                type="number" step="0.01"
                                className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300" 
                                placeholder="Please Enter Discounts" 
                                value={data.discount_percent}
                                onChange={(e) => setData('discount_percent', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Default Markup(%)</Label>
                            <Input 
                                type="number" step="0.01"
                                className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300" 
                                placeholder="Please Enter Default Markup" 
                                value={data.default_markup_percent}
                                onChange={(e) => setData('default_markup_percent', e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <Label className="text-xs text-gray-500 font-medium mb-3 block">Pricing-Periods <span className="text-red-500">*</span></Label>
                        <div className="flex items-center gap-4 max-w-md">
                            <Input 
                                type="date"
                                className="h-10 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#162a5b]" 
                                value={data.period_start}
                                onChange={(e) => setData('period_start', e.target.value)}
                                required
                            />
                            <span className="text-gray-400">-</span>
                            <Input 
                                type="date"
                                className="h-10 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#162a5b]" 
                                value={data.period_end}
                                onChange={(e) => setData('period_end', e.target.value)}
                                required
                            />
                            <Button 
                                type="button" 
                                onClick={handleAddItem}
                                disabled={!selectedItemId}
                                className="bg-[#4cae4c] hover:bg-[#449d44] text-white font-medium uppercase tracking-wider h-10 px-6 text-xs whitespace-nowrap ml-4 disabled:opacity-50"
                            >
                                ADD ITEM
                            </Button>
                        </div>
                        {errors.period_start && <p className="text-red-500 text-xs mt-1">{errors.period_start}</p>}
                        {errors.period_end && <p className="text-red-500 text-xs mt-1">{errors.period_end}</p>}
                    </div>

                    <div className="mt-8 overflow-x-auto border border-gray-200 rounded-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#162a5b] text-white font-medium">
                                <tr>
                                    <th className="px-4 py-3 min-w-[200px]">Items</th>
                                    <th className="px-4 py-3 min-w-[150px]">Selling Price</th>
                                    <th className="px-4 py-3 min-w-[150px]">Discount</th>
                                    <th className="px-4 py-3 min-w-[100px]">Tax</th>
                                    <th className="px-4 py-3 min-w-[100px]">UOM</th>
                                    <th className="px-4 py-3 w-8"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {gridItems.length > 0 ? gridItems.map((item, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50 group">
                                        <td className="px-4 py-2 border-r border-gray-100 bg-[#162a5b] text-white">
                                            {item.item_name}
                                        </td>
                                        <td className="px-4 py-2 bg-[#1b3474] border-r border-gray-100">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="h-8 border-transparent bg-transparent text-white focus-visible:ring-0 focus:bg-white focus:text-gray-900 rounded-sm px-2 placeholder:text-blue-300"
                                                placeholder="0.00"
                                                value={item.selling_price}
                                                onChange={(e) => handleGridItemChange(idx, 'selling_price', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 bg-[#1b3474] border-r border-gray-100">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="h-8 border-transparent bg-transparent text-white focus-visible:ring-0 focus:bg-white focus:text-gray-900 rounded-sm px-2 placeholder:text-blue-300"
                                                placeholder="0.00"
                                                value={item.discount}
                                                onChange={(e) => handleGridItemChange(idx, 'discount', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-white bg-[#1b3474] font-mono border-r border-gray-100">
                                            {item.tax_percent ? `${item.tax_percent}%` : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-white bg-[#1b3474] uppercase text-xs border-r border-gray-100">
                                            {item.uom || '-'}
                                        </td>
                                        <td className="px-2 py-2 text-center bg-[#1b3474]">
                                            <Button 
                                                variant="ghost" 
                                                className="h-6 w-6 p-0 text-red-200 hover:text-red-50 hover:bg-red-900/50"
                                                onClick={() => removeGridItem(idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                                            Select an Item from the list above and click "ADD ITEM" to build your list.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {errors.price_list_items && <p className="text-red-500 text-xs mt-2">{errors.price_list_items}</p>}

                    <div className="mt-8 flex justify-start">
                        <Button 
                            type="submit" 
                            disabled={processing || gridItems.length === 0}
                            className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-medium uppercase tracking-wider px-8 h-10 text-xs shadow-sm transition-all hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'SAVING...' : 'ADD PRICELIST'}
                        </Button>
                    </div>
                </form>
                ) : (
                    <div className="bg-white border shadow-sm rounded-sm overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Price List Name</th>
                                    <th className="px-6 py-4">Seller -&gt; Buyer</th>
                                    <th className="px-6 py-4">Period</th>
                                    <th className="px-6 py-4">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPriceLists.length > 0 ? (
                                    filteredPriceLists.map((pl) => (
                                        <tr key={pl.id} className="border-b hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium">{pl.price_list_name}</td>
                                            <td className="px-6 py-4">
                                                {pl.seller?.supplier_name || 'All'} <span className="text-gray-400 mx-2">{'>'}</span> {pl.buyer?.location_legal_name || 'All'}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                                {pl.period_start} to {pl.period_end}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{pl.price_list_type}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No price lists found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
