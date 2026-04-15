import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import taxMaster from '@/routes/tax-master';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tax', href: '#' },
    { title: 'Create Tax', href: '/config/tax-master/create' },
];

interface Tax {
    id: number;
    tax_name: string;
    tax_type: string;
    cgst_rate: number;
    sgst_rate: number;
    igst_rate: number;
    utgst_rate: number;
    total_rate: number;
}

export default function TaxMaster() {
    const { data, setData, post, reset, errors } = useForm({
        tax_name: '',
        tax_type: 'intrastate',
        cgst_rate: 0,
        sgst_rate: 0,
        igst_rate: 0,
        utgst_rate: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(taxMaster.store().url, {
            onSuccess: () => {
                reset();
                window.location.href = taxMaster.index().url;
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Tax" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Create Tax</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-t-0 shadow-sm p-8 rounded-b-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 font-medium">Tax Name</Label>
                            <Input 
                                className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                placeholder="e.g., GST 18%" 
                                value={data.tax_name}
                                onChange={(e) => setData('tax_name', e.target.value)}
                            />
                            {errors.tax_name && <p className="text-xs text-red-500">{errors.tax_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 font-medium">Tax Type</Label>
                            <select 
                                className="flex h-10 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm focus:outline-none focus:ring-0"
                                value={data.tax_type}
                                onChange={(e) => setData('tax_type', e.target.value)}
                            >
                                <option value="intrastate">Intrastate (CGST + SGST)</option>
                                <option value="interstate">Interstate (IGST)</option>
                                <option value="union_territory">Union Territory (UTGST)</option>
                            </select>
                            {errors.tax_type && <p className="text-xs text-red-500">{errors.tax_type}</p>}
                        </div>

                        {data.tax_type === 'intrastate' && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500 font-medium">CGST Rate (%)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.01"
                                        className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                        placeholder="0.00"
                                        value={data.cgst_rate}
                                        onChange={(e) => setData('cgst_rate', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500 font-medium">SGST Rate (%)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.01"
                                        className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                        placeholder="0.00"
                                        value={data.sgst_rate}
                                        onChange={(e) => setData('sgst_rate', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </>
                        )}

                        {data.tax_type === 'interstate' && (
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-medium">IGST Rate (%)</Label>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                    placeholder="0.00"
                                    value={data.igst_rate}
                                    onChange={(e) => setData('igst_rate', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        )}

                        {data.tax_type === 'union_territory' && (
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-medium">UTGST Rate (%)</Label>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                    placeholder="0.00"
                                    value={data.utgst_rate}
                                    onChange={(e) => setData('utgst_rate', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-12 flex justify-end">
                        <Button type="submit" className="bg-[#162a5b] hover:bg-[#1c3a7a] text-white px-10 h-10 rounded-lg shadow-lg font-bold tracking-wide uppercase italic gap-2">
                            <Plus className="h-4 w-4" /> CREATE TAX
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
