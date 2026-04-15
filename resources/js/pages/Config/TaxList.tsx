import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import taxMaster from '@/routes/tax-master';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tax', href: '#' },
    { title: 'Tax List', href: '/config/tax-master' },
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

export default function TaxList({ taxes = [] }: { taxes?: Tax[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tax?')) {
            router.delete(taxMaster.destroy(id).url);
        }
    };

    const handleCreate = () => {
        router.visit(taxMaster.create().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax List" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Tax List</h1>
                    <Button 
                        onClick={handleCreate}
                        className="bg-[#162a5b] hover:bg-[#1c3a7a] text-white h-8 rounded-lg shadow-lg font-bold tracking-wide uppercase italic gap-2"
                    >
                        <Plus className="h-4 w-4" /> CREATE NEW TAX
                    </Button>
                </div>

                <div className="bg-white border border-t-0 shadow-sm rounded-b-sm overflow-hidden">
                    {taxes.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CGST</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SGST</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IGST</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UTGST</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {taxes.map((tax) => (
                                    <tr key={tax.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{tax.tax_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{tax.tax_type.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tax.cgst_rate}%</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tax.sgst_rate}%</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tax.igst_rate}%</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tax.utgst_rate}%</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{tax.total_rate}%</td>
                                        <td className="px-6 py-4 text-sm">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleDelete(tax.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-sm">No taxes found. Create your first tax.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
