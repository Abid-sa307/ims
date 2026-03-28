import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { List, FileUp, Plus, Trash2, Edit } from 'lucide-react';
import { useState, useRef } from 'react';

interface Item {
    id: number;
    item_name: string;
    uom: string;
    price: number;
    tax_percent: number;
    cess_percent: number;
    description: string | null;
}

interface Props {
    items: Item[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master', href: '#' },
    { title: 'Item Master', href: '/master/item-master' },
];

export default function ItemMaster({ items = [] }: Props) {
    const [showList, setShowList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const importFileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        item_name: '',
        uom: '',
        price: 0,
        tax_percent: 0,
        cess_percent: 0,
        description: '',
    });

    const { data: importData, setData: setImportData, post: postImport, processing: importing } = useForm({
        file: null as File | null,
    });

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
            item_name: item.item_name,
            uom: item.uom,
            price: item.price,
            tax_percent: item.tax_percent,
            cess_percent: item.cess_percent,
            description: item.description || '',
        });
        setShowList(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(`/master/item-master/${id}`);
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImportData('file', file);
            // We use router.post directly to handle the file upload immediately or let user click a button.
            // For better UX, we'll auto-submit once selected.
            const formData = new FormData();
            formData.append('file', file);
            
            router.post('/master/item-master/import', formData, {
                onSuccess: () => {
                    if (importFileInputRef.current) importFileInputRef.current.value = '';
                    alert('Items imported successfully!');
                },
                onError: (err) => {
                    alert('Import failed: ' + (err.file || 'Unknown error'));
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Master" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Item Master</h1>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={importFileInputRef}
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleImport}
                        />
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-2 border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => importFileInputRef.current?.click()}
                            disabled={importing}
                        >
                            <FileUp className="h-4 w-4" /> {importing ? 'IMPORTING...' : 'IMPORT EXCEL'}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-2"
                            onClick={() => {
                                setShowList(!showList);
                                if (showList) { reset(); setEditingId(null); }
                            }}
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
                <form onSubmit={submit} className="bg-white border border-t-0 shadow-sm p-6 mb-6 rounded-b-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">

                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Item Name <span className="text-red-500">*</span></Label>
                            <Input 
                                className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" 
                                placeholder="Please Enter Item Name" 
                                value={data.item_name}
                                onChange={(e) => setData('item_name', e.target.value)}
                                required
                            />
                            {errors.item_name && <p className="text-red-500 text-xs mt-1">{errors.item_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">UOM <span className="text-red-500">*</span></Label>
                            <select 
                                className="flex h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0"
                                value={data.uom}
                                onChange={(e) => setData('uom', e.target.value)}
                                required
                            >
                                <option value="">-- Please Select --</option>
                                <option value="PCS">PCS</option>
                                <option value="KGS">KGS</option>
                                <option value="LTR">LTR</option>
                                <option value="MTR">MTR</option>
                                <option value="BOX">BOX</option>
                                <option value="PKT">PKT</option>
                                <option value="NOS">NOS</option>
                            </select>
                            {errors.uom && <p className="text-red-500 text-xs mt-1">{errors.uom}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Price <span className="text-red-500">*</span></Label>
                            <Input 
                                type="number"
                                step="any"
                                className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" 
                                placeholder="0.00" 
                                value={data.price}
                                onChange={(e) => setData('price', parseFloat(e.target.value))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Tax Percent (%)</Label>
                            <Input 
                                type="number"
                                step="any"
                                className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" 
                                placeholder="0.00" 
                                value={data.tax_percent}
                                onChange={(e) => setData('tax_percent', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Cess Percent (%)</Label>
                            <Input 
                                type="number"
                                step="any"
                                className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" 
                                placeholder="0.00" 
                                value={data.cess_percent}
                                onChange={(e) => setData('cess_percent', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Description</Label>
                            <textarea 
                                className="flex min-h-[80px] w-full border-0 border-b border-gray-200 bg-white px-0 py-2 text-sm shadow-none focus-visible:outline-none placeholder:text-gray-400 resize-none text-gray-700" 
                                placeholder="Enter item description..." 
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
                        {editingId && (
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                    reset();
                                    setEditingId(null);
                                    setShowList(true);
                                }}
                                className="px-8 h-11 text-xs text-gray-500 rounded-sm"
                            >
                                CANCEL
                            </Button>
                        )}
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black italic uppercase tracking-wider px-10 h-11 text-xs rounded-sm shadow-md transition-all hover:translate-y-[-1px] active:translate-y-0"
                        >
                            {processing ? 'SAVING...' : (editingId ? 'UPDATE ITEM' : 'ADD ITEM')}
                        </Button>
                    </div>
                </form>
                ) : (
                    <div className="bg-white border shadow-sm rounded-sm overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Item Name</th>
                                    <th className="px-6 py-4">UOM</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Tax %</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium">{item.item_name}</td>
                                            <td className="px-6 py-4">{item.uom}</td>
                                            <td className="px-6 py-4">{item.price}</td>
                                            <td className="px-6 py-4">{item.tax_percent}%</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No items found. Click "ADD NEW" or use "IMPORT EXCEL".
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
