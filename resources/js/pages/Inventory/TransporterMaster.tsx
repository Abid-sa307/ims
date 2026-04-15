import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface Transporter {
    id: number;
    transporter_name: string;
    transporter_id: string | null;
    gst_no: string | null;
    contact_person_name: string | null;
    contact_number: string | null;
    address: string | null;
}

interface Props {
    transporters: Transporter[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory Management', href: '#' },
    { title: 'Transporter Master', href: '/inventory/transporter-master' },
];

export default function TransporterMaster({ transporters = [] }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        transporter_name: '',
        transporter_id: '',
        gst_no: '',
        contact_person_name: '',
        contact_number: '',
        address: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventory/transporter-master', {
            onSuccess: () => reset(),
        });
    };

    const filteredTransporters = transporters.filter(t => {
        if (!searchQuery) return true;
        const lowercaseQuery = searchQuery.toLowerCase();
        return (t.transporter_name?.toLowerCase().includes(lowercaseQuery) || 
               t.transporter_id?.toLowerCase().includes(lowercaseQuery) || 
               t.gst_no?.toLowerCase().includes(lowercaseQuery) ||
               t.contact_person_name?.toLowerCase().includes(lowercaseQuery));
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transporter Master" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                <div className="bg-white border-t-2 border-t-[#162a5b] shadow-sm mb-6 rounded-t-sm">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h1 className="text-[15px] font-bold text-[#162a5b]">Transporter Master</h1>
                    </div>
                    
                    <form onSubmit={submit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">Transporter Name <span className="text-red-500">*</span></Label>
                                <Input 
                                    className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300"
                                    placeholder="Please Define Transporter Name"
                                    value={data.transporter_name}
                                    onChange={(e) => setData('transporter_name', e.target.value)}
                                    required
                                />
                                {errors.transporter_name && <p className="text-red-500 text-xs mt-1">{errors.transporter_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">Transporter Id</Label>
                                <Input 
                                    className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300"
                                    placeholder="Please Define Transporter Id"
                                    value={data.transporter_id}
                                    onChange={(e) => setData('transporter_id', e.target.value)}
                                />
                                {errors.transporter_id && <p className="text-red-500 text-xs mt-1">{errors.transporter_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">GST No:</Label>
                                <Input 
                                    className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300"
                                    placeholder="Please Define GST No"
                                    value={data.gst_no}
                                    onChange={(e) => setData('gst_no', e.target.value)}
                                />
                                {errors.gst_no && <p className="text-red-500 text-xs mt-1">{errors.gst_no}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">Contact Person Name</Label>
                                <Input 
                                    className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300"
                                    placeholder="Please Define Contact Person Name"
                                    value={data.contact_person_name}
                                    onChange={(e) => setData('contact_person_name', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-normal">Contact Number</Label>
                                <Input 
                                    className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300"
                                    placeholder="Please Define Contact Number"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2"></div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs text-gray-500 font-normal">Address:</Label>
                                <Input 
                                    className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-300"
                                    placeholder="Please Define Address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="mt-8">
                            <p className="text-red-500 text-sm font-semibold mb-4">Note: You Can Add Either Transporter Id OR GST No .</p>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-medium uppercase tracking-wider px-8 h-10 text-xs shadow-sm"
                            >
                                {processing ? 'ADDING...' : 'ADD'}
                            </Button>
                        </div>
                    </form>
                </div>

                {transporters.length > 0 && (
                    <div className="bg-white border shadow-sm rounded-sm overflow-x-auto mt-8">
                        <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50/50">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transporters List</p>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search transporters..."
                                    className="pl-9 h-8 w-[250px] border-gray-200 text-sm focus-visible:ring-[#162a5b] rounded-sm bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#162a5b] text-white font-medium">
                                <tr>
                                    <th className="px-6 py-3">Transporter Name</th>
                                    <th className="px-6 py-3">Transporter ID</th>
                                    <th className="px-6 py-3">GST No</th>
                                    <th className="px-6 py-3">Contact Person</th>
                                    <th className="px-6 py-3">Contact Number</th>
                                    <th className="px-6 py-3">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransporters.map((t) => (
                                    <tr key={t.id} className="border-b hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium">{t.transporter_name}</td>
                                        <td className="px-6 py-4">{t.transporter_id || '-'}</td>
                                        <td className="px-6 py-4">{t.gst_no || '-'}</td>
                                        <td className="px-6 py-4">{t.contact_person_name || '-'}</td>
                                        <td className="px-6 py-4">{t.contact_number || '-'}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-xs">{t.address || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
