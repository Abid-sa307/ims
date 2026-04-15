import { Head, useForm, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { List } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Location {
    id: number;
    location_legal_name: string;
}

interface ItemCategory {
    id: number;
    name: string;
}

interface Item {
    id: number;
    item_name: string;
    item_category_id: number;
}

interface Warehouse {
    id: number;
    location_id: number;
    name: string;
}

interface MatrixItem {
    [key: string]: any;
    item_id: number;
    item_name: string;
    inward_warehouse_id: string | number;
    outward_warehouse_id: string | number;
}

interface Props {
    locations: Location[];
    categories: ItemCategory[];
    items: Item[];
    warehouses: Warehouse[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory Management', href: '#' },
    { title: 'Stock Source Selection', href: '/inventory/stock-source-selection' },
];

export default function StockSourceSelection({ locations = [], categories = [], items = [], warehouses = [] }: Props) {
    const [locationId, setLocationId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [itemId, setItemId] = useState('');
    
    const [matrix, setMatrix] = useState<MatrixItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Filter items based on category selection
    const filteredItems = categoryId 
        ? items.filter(i => i.item_category_id === Number(categoryId))
        : items;

    // Filter warehouses based on selected location
    const filteredWarehouses = locationId
        ? warehouses.filter(w => w.location_id === Number(locationId))
        : warehouses;

    const handleLoad = async () => {
        if (!locationId) {
            toast.error('Please select a Location first');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/inventory/stock-source-selection/load', {
                location_id: locationId,
                item_category_id: categoryId || null,
                item_id: itemId || null,
            });
            setMatrix(response.data.matrix);
            if(response.data.matrix.length === 0) {
                toast.info('No items found for the selected criteria');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load matrix');
        } finally {
            setLoading(false);
        }
    };

    const handleMatrixChange = (index: number, field: keyof MatrixItem, value: string) => {
        const newMatrix = [...matrix];
        newMatrix[index] = { ...newMatrix[index], [field]: value };
        setMatrix(newMatrix);
    };

    const handleSave = () => {
        if (!locationId || matrix.length === 0) return;

        setSaving(true);
        router.post('/inventory/stock-source-selection', {
            location_id: locationId,
            mappings: matrix
        }, {
            onSuccess: () => {
                toast.success('Sources saved successfully');
            },
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Source Selection-(Inward/Outward)" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                <div className="bg-white border flex flex-col shadow-sm rounded-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white border-t-2 border-t-[#162a5b] rounded-t-sm">
                        <h1 className="text-[15px] font-bold text-[#162a5b]">Stock Source Selection-(Inward/Outward)</h1>
                        <Link href="/inventory/item-categories">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <List className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">Location</Label>
                                <select 
                                    className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                    value={locationId}
                                    onChange={(e) => setLocationId(e.target.value)}
                                >
                                    <option value="">-- Please Select --</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.location_legal_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">Item Category</Label>
                                <select 
                                    className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                    value={categoryId}
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        setItemId(''); // Reset item when category changes
                                    }}
                                >
                                    <option value="">-- Please Select --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">Item</Label>
                                <select 
                                    className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                    value={itemId}
                                    onChange={(e) => setItemId(e.target.value)}
                                >
                                    <option value="">-- Please Select --</option>
                                    {filteredItems.map(it => (
                                        <option key={it.id} value={it.id}>{it.item_name}</option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="mt-6">
                            <Button 
                                type="button" 
                                onClick={handleLoad}
                                disabled={loading || !locationId}
                                className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-medium uppercase tracking-wider px-6 h-9 text-xs shadow-sm disabled:opacity-50"
                            >
                                {loading ? 'LOADING...' : 'LOAD'}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-[#162a5b] text-white text-xs font-semibold uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 border-r border-[#1e346d]">Item Name</th>
                                    <th className="px-4 py-3 border-r border-[#1e346d]">Inward Warehouse</th>
                                    <th className="px-4 py-3">Outward Warehouse</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matrix.length > 0 ? matrix.map((row, idx) => (
                                    <tr key={idx} className="border-b group">
                                        <td className="px-4 py-3 border-r border-gray-100 bg-[#162a5b] text-white text-left font-medium">
                                            {row.item_name}
                                        </td>
                                        <td className="px-4 py-2 border-r border-gray-100 bg-[#f9fafb]">
                                            <select 
                                                className="h-8 w-full border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#162a5b] rounded-sm"
                                                value={row.inward_warehouse_id}
                                                onChange={(e) => handleMatrixChange(idx, 'inward_warehouse_id', e.target.value)}
                                            >
                                                <option value="">-- Select Inward Warehouse --</option>
                                                {filteredWarehouses.map(w => (
                                                    <option key={w.id} value={w.id}>{w.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2 border-r border-gray-100 bg-[#f9fafb]">
                                            <select 
                                                className="h-8 w-full border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#162a5b] rounded-sm"
                                                value={row.outward_warehouse_id}
                                                onChange={(e) => handleMatrixChange(idx, 'outward_warehouse_id', e.target.value)}
                                            >
                                                <option value="">-- Select Outward Warehouse --</option>
                                                {filteredWarehouses.map(w => (
                                                    <option key={w.id} value={w.id}>{w.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-16 text-center text-gray-500 bg-[#f9fafb]">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <List className="h-8 w-8 text-gray-300" />
                                                <p>Select criteria above and click Load to configure item routing.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {matrix.length > 0 && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <Button 
                                type="button" 
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#162a5b] hover:bg-[#11224f] text-white font-medium uppercase tracking-wider px-8 h-10 text-xs shadow-sm w-full md:w-auto"
                            >
                                {saving ? 'SAVING...' : 'SAVE STOCK SOURCES'}
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
