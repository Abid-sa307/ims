import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { X, Plus, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tax', href: '#' },
    { title: 'Tax Master List', href: '/config/tax-master' },
];

interface Tax {
    id: number;
    tax_name: string;
    is_active: boolean;
}

export default function TaxList({ taxes = [] }: { taxes?: Tax[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState<Tax | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        tax_name: '',
        is_active: true,
    });

    const DEFAULT_TAXES = ['CGST', 'SGST', 'IGST', 'UTGST'];

    const filteredTaxes = useMemo(() => {
        const filtered = taxes.filter(tax => 
            tax.tax_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return [...filtered].sort((a, b) => {
            const aIsDefault = DEFAULT_TAXES.includes(a.tax_name.toUpperCase());
            const bIsDefault = DEFAULT_TAXES.includes(b.tax_name.toUpperCase());
            
            if (aIsDefault && !bIsDefault) return -1;
            if (!aIsDefault && bIsDefault) return 1;
            return 0;
        });
    }, [taxes, searchQuery]);

    const handleOpenModal = (tax: Tax | null = null) => {
        if (tax) {
            setEditingTax(tax);
            setData({
                tax_name: tax.tax_name,
                is_active: tax.is_active,
            });
        } else {
            setEditingTax(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTax(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTax) {
            put(`/config/tax-master/${editingTax.id}`, {
                onSuccess: () => handleCloseModal(),
            });
        } else {
            post('/config/tax-master', {
                onSuccess: () => handleCloseModal(),
            });
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (DEFAULT_TAXES.includes(name.toUpperCase())) {
            alert(`${name} is a default tax and cannot be deleted.`);
            return;
        }
        if (confirm(`Are you sure you want to delete the ${name} tax?`)) {
            router.delete(`/config/tax-master/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax Master List" />
            <div className="p-6 bg-[#f8fafc] min-h-full">
                <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Tax Master List</h1>
                        
                        <Button 
                            onClick={() => handleOpenModal()}
                            className="bg-[#00a65a] hover:bg-[#008d4c] text-white h-10 px-6 rounded-md shadow-sm font-semibold flex items-center gap-2 transition-all"
                        >
                            <Plus className="h-4 w-4" /> Add New
                        </Button>
                    </div>

                    {/* Search Section */}
                    <div className="px-6 py-4 flex justify-end items-center gap-2">
                        <Label htmlFor="search" className="text-sm font-medium text-gray-600">Search:</Label>
                        <div className="relative w-64">
                            <Input
                                id="search"
                                placeholder="Search by name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pr-8 focus-visible:ring-1 focus-visible:ring-gray-300 border-gray-300 rounded"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#f2f4f7]">
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200 w-24">Sr No.</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Tax Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Is Active</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200 w-32 text-center text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTaxes.length > 0 ? (
                                    filteredTaxes.map((tax, index) => {
                                        const isDefault = DEFAULT_TAXES.includes(tax.tax_name.toUpperCase());
                                        return (
                                            <tr key={tax.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-700 border border-gray-200">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border border-gray-200 font-medium">{tax.tax_name}</td>
                                                <td className="px-6 py-4 text-sm border border-gray-200">
                                                    <Badge className={`${tax.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'} border-none px-3 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide`}>
                                                        {tax.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm border border-gray-200 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {!isDefault ? (
                                                            <>
                                                                <Button 
                                                                    onClick={() => handleOpenModal(tax)}
                                                                    className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white h-7 px-4 rounded text-xs font-medium shadow-sm transition-all"
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button 
                                                                    onClick={() => handleDelete(tax.id, tax.tax_name)}
                                                                    className="bg-[#d9534f] hover:bg-[#c9302c] text-white h-7 px-4 rounded text-xs font-medium shadow-sm transition-all"
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase italic bg-gray-50 px-3 py-1 rounded-full border border-gray-100">System Default</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm italic italic border border-gray-200">
                                            No tax records found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-xl shadow-2xl">
                    <DialogHeader className="p-6 bg-white border-b relative">
                        <DialogTitle className="text-xl font-bold text-gray-800">
                            {editingTax ? 'Edit Tax' : 'Add Tax'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Enter Tax Name"
                                    value={data.tax_name}
                                    onChange={(e) => setData('tax_name', e.target.value)}
                                    className={`h-11 border-gray-300 focus:ring-1 focus:ring-gray-400 rounded-md ${errors.tax_name ? 'border-red-500' : ''}`}
                                />
                                {errors.tax_name && <p className="text-xs text-red-500 font-medium ml-1">{errors.tax_name}</p>}
                            </div>

                            <div className="flex items-center space-x-2 py-1">
                                <Checkbox 
                                    id="active" 
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                                <Label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">Is Active</Label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-8 h-10 rounded shadow-md font-bold transition-all disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                            <Button 
                                type="button" 
                                onClick={handleCloseModal}
                                className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-8 h-10 rounded shadow-md font-bold transition-all"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
