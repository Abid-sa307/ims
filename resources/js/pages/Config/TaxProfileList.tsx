import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X, Plus, Search, FileDown } from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tax', href: '#' },
    { title: 'Tax Profiles', href: '/config/tax-profiles' },
];

interface TaxMaster {
    id: number;
    tax_name: string;
}

interface TaxProfileItem {
    id?: number;
    tax_name: string;
    percentage: number | string;
    applicable_on: 'interstate' | 'intrastate' | 'union_territory' | '';
}

interface TaxProfile {
    id: number;
    name: string;
    total_percentage: number;
    items: TaxProfileItem[];
}

export default function TaxProfileList({ profiles = [], taxes = [] }: { profiles?: TaxProfile[], taxes?: TaxMaster[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<TaxProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const generateDefaultItems = (taxMasters: TaxMaster[]): TaxProfileItem[] => {
        const mapped = taxMasters.map(tax => {
            let applicable_on: TaxProfileItem['applicable_on'] = '';
            const name = tax.tax_name.toUpperCase();
            
            if (name === 'SGST' || name === 'CGST') applicable_on = 'intrastate';
            else if (name === 'IGST') applicable_on = 'interstate';
            else if (name === 'UTGST') applicable_on = 'union_territory';

            return {
                tax_name: tax.tax_name,
                percentage: '',
                applicable_on: applicable_on,
            };
        });

        return [...mapped].sort((a, b) => {
            const CORE_TAXES = ['CGST', 'SGST', 'IGST', 'UTGST'];
            const aIsCore = CORE_TAXES.includes(a.tax_name.toUpperCase());
            const bIsCore = CORE_TAXES.includes(b.tax_name.toUpperCase());
            
            if (aIsCore && !bIsCore) return -1;
            if (!aIsCore && bIsCore) return 1;
            return 0;
        });
    };

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        total_percentage: '',
        items: [] as TaxProfileItem[],
    });

    const filteredProfiles = useMemo(() => {
        return profiles.filter(profile => 
            profile.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [profiles, searchQuery]);

    const handleOpenModal = (profile: TaxProfile | null = null) => {
        if (profile) {
            setEditingProfile(profile);
            // Use existing items and augment with any new taxes from Master list
            const currentTaxes = generateDefaultItems(taxes);
            const mergedItems = currentTaxes.map(item => {
                const found = profile.items.find(i => i.tax_name.toUpperCase() === item.tax_name.toUpperCase());
                return found ? { ...found } : { ...item };
            });
            
            setData({
                name: profile.name,
                total_percentage: profile.total_percentage.toString(),
                items: mergedItems,
            });
        } else {
            setEditingProfile(null);
            setData({
                name: '',
                total_percentage: '',
                items: generateDefaultItems(taxes),
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProfile(null);
        reset();
    };

    const handleItemChange = (index: number, field: keyof TaxProfileItem, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProfile) {
            put(`/config/tax-profiles/${editingProfile.id}`, {
                onSuccess: () => handleCloseModal(),
            });
        } else {
            post('/config/tax-profiles', {
                onSuccess: () => handleCloseModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tax profile?')) {
            router.delete(`/config/tax-profiles/${id}`);
        }
    };

    const handleExportCSV = () => {
        const headers = ["SR NO", "TAX PROFILE", "TAX PERCENTAGE"];
        const rows = filteredProfiles.map((p, i) => [i + 1, p.name, p.total_percentage + "%"]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tax_profiles.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isLocked = (name: string) => ['SGST', 'CGST', 'IGST', 'UTGST'].includes(name.toUpperCase());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax Profiles" />
            <div className="p-6 bg-[#f8fafc] min-h-full space-y-6">
                
                {/* Header Banner */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden group">
                    <div className="space-y-1 relative z-10">
                        <h1 className="text-[32px] font-bold text-[#162a5b] flex items-center gap-2">
                            Tax Profiles
                        </h1>
                    </div>
                    
                    <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#00c5a0]/5 to-transparent skew-x-12 translate-x-20 transition-transform group-hover:translate-x-16" />
                </div>

                {/* Filters & Actions Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-xl font-bold text-[#162a5b]">Filters & Actions</h2>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative w-full sm:w-72">
                                <Input
                                    placeholder="Search by profile name or"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-11 pl-11 bg-[#f8fafc] border-gray-200 focus:ring-1 focus:ring-[#162a5b] rounded-xl"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            <Button 
                                onClick={handleExportCSV}
                                className="bg-[#1a56db] hover:bg-[#1e429f] text-white h-11 px-6 rounded-xl font-semibold flex items-center gap-2 transition-all w-full sm:w-auto"
                            >
                                Export CSV
                            </Button>
                            <Button 
                                onClick={() => handleOpenModal()}
                                className="bg-[#00a65a] hover:bg-[#008d4c] text-white h-11 px-8 rounded-xl font-semibold flex items-center gap-2 transition-all w-full sm:w-auto"
                            >
                                <Plus className="h-5 w-5" /> Add New
                            </Button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#f8fafc] border-y border-gray-100">
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest w-24">SR NO</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">TAX PROFILE</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">TAX PERCENTAGE</th>
                                    <th className="px-8 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-widest w-48">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProfiles.length > 0 ? (
                                    filteredProfiles.map((profile, index) => (
                                        <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5 text-sm font-medium text-gray-600">{index + 1}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-[#162a5b]">{profile.name}</td>
                                            <td className="px-8 py-5 text-sm font-semibold text-gray-700">{profile.total_percentage} %</td>
                                            <td className="px-8 py-5 text-sm flex items-center justify-center gap-2">
                                                <Button 
                                                    onClick={() => handleOpenModal(profile)}
                                                    className="bg-[#fef9c3] hover:bg-[#fef08a] text-yellow-700 h-8 px-4 rounded-md text-xs font-bold border-none shadow-none"
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(profile.id)}
                                                    className="bg-[#fee2e2] hover:bg-[#fecaca] text-red-700 h-8 px-4 rounded-md text-xs font-bold border-none shadow-none"
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-16 text-center text-gray-400 text-sm font-medium italic italic">
                                            No tax profiles found. Click "Add New" to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Dummy */}
                    <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <select className="bg-transparent font-medium focus:outline-none">
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                        </div>
                        <div className="font-medium">1-{filteredProfiles.length} of {filteredProfiles.length}</div>
                        <div className="flex items-center gap-4">
                            <button disabled className="opacity-30 hover:text-gray-900"><Plus className="h-4 w-4 rotate-180" /></button>
                            <button disabled className="opacity-30 hover:text-gray-900"><Plus className="h-4 w-4 rotate-180" /></button>
                            <button disabled className="opacity-30 hover:text-gray-900"><Plus className="h-4 w-4" /></button>
                            <button disabled className="opacity-30 hover:text-gray-900"><Plus className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="p-6 bg-white border-b flex flex-row items-center justify-between sticky top-0 z-10">
                        <DialogTitle className="text-xl font-bold text-[#162a5b]">
                            {editingProfile ? 'Edit Tax Profile' : 'Add Tax Profile'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-8 space-y-10">
                            {/* Top Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[15px] font-bold text-[#162a5b]">Tax Profile</Label>
                                    <Input
                                        placeholder="Enter Tax"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`h-12 bg-[#f8fafc] border-gray-200 focus:ring-1 focus:ring-[#162a5b] rounded-xl text-lg ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[15px] font-bold text-[#162a5b]">Total Tax Percentage</Label>
                                    <Input
                                        placeholder="Enter total tax percentage"
                                        value={data.total_percentage}
                                        onChange={(e) => setData('total_percentage', e.target.value)}
                                        className={`h-12 bg-[#f8fafc] border-gray-200 focus:ring-1 focus:ring-[#162a5b] rounded-xl text-lg ${errors.total_percentage ? 'border-red-500' : ''}`}
                                    />
                                    {errors.total_percentage && <p className="text-xs text-red-500 font-bold">{errors.total_percentage}</p>}
                                </div>
                            </div>

                            {/* Tax Components Grid */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-6 px-4">
                                    <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Tax</Label>
                                    <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Percentage</Label>
                                    <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Applicable On</Label>
                                </div>
                                
                                <div className="space-y-4">
                                    {data.items.length > 0 ? (
                                        data.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-3 gap-6 items-center bg-white p-2 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                                                <div className="bg-[#f0f4f8] h-12 flex items-center px-6 rounded-xl text-[#162a5b] font-bold text-lg">
                                                    {item.tax_name}
                                                </div>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Percentage"
                                                    value={item.percentage}
                                                    onChange={(e) => handleItemChange(index, 'percentage', e.target.value)}
                                                    className="h-12 bg-white border-gray-200 focus:ring-1 focus:ring-[#162a5b] rounded-xl text-lg"
                                                />
                                                <Select 
                                                    value={item.applicable_on} 
                                                    onValueChange={(val) => handleItemChange(index, 'applicable_on', val)}
                                                    disabled={isLocked(item.tax_name)}
                                                >
                                                    <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl text-lg focus:ring-1 focus:ring-[#162a5b] disabled:opacity-70 disabled:bg-gray-50">
                                                        <SelectValue placeholder="---select---" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                                        <SelectItem value="interstate" className="py-3 text-lg">Interstate</SelectItem>
                                                        <SelectItem value="intrastate" className="py-3 text-lg">Intrastate</SelectItem>
                                                        <SelectItem value="union_territory" className="py-3 text-lg">Union Territory</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center py-8 text-gray-400 italic">No taxes available in the Master List. Please add some first.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter className="p-6 bg-[#f8fafc] border-t gap-4 sticky bottom-0 z-10">
                            <Button 
                                type="button" 
                                onClick={handleCloseModal}
                                className="bg-white hover:bg-gray-100 text-gray-600 px-10 h-12 rounded-xl font-bold border border-gray-200 shadow-sm transition-all"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing || data.items.length === 0}
                                className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-10 h-12 rounded-xl font-bold border-none shadow-lg transition-all disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
