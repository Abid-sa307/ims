import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { List, Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    customer_name: string;
    customer_category: string | null;
    contact_number: string | null;
    email_address: string | null;
}

interface Props {
    customers: Customer[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuration', href: '#' },
    { title: 'Customer Master', href: '/config/customer-master' },
];

export default function CustomerMaster({ customers = [] }: Props) {
    const [showList, setShowList] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        customer_name: '',
        customer_category: '',
        contact_number: '',
        email_address: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/config/customer-master/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                    setShowList(true);
                },
            });
        } else {
            post('/config/customer-master', {
                onSuccess: () => {
                    reset();
                    setShowList(true);
                },
            });
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingId(customer.id);
        setData({
            customer_name: customer.customer_name || '',
            customer_category: customer.customer_category || '',
            contact_number: customer.contact_number || '',
            email_address: customer.email_address || '',
        });
        setShowList(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(`/config/customer-master/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Master" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Customer Master</h1>
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

                {!showList ? (
                    <form onSubmit={submit} className="bg-white border border-t-0 shadow-sm p-8 rounded-b-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-medium">Customer Name <span className="text-red-500">*</span></Label>
                                <Input 
                                    className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                    placeholder="Enter full name" 
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    required
                                />
                                {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-medium">Customer Category</Label>
                                <select 
                                    className="flex h-10 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm focus:outline-none focus:ring-0"
                                    value={data.customer_category}
                                    onChange={(e) => setData('customer_category', e.target.value)}
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Wholesale">Wholesale</option>
                                    <option value="B2B">B2B</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-medium">Contact Number</Label>
                                <Input 
                                    className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                    placeholder="+91 00000 00000" 
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500 font-medium">Email Address</Label>
                                <Input 
                                    type="email"
                                    className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" 
                                    placeholder="customer@example.com" 
                                    value={data.email_address}
                                    onChange={(e) => setData('email_address', e.target.value)}
                                />
                                {errors.email_address && <p className="text-red-500 text-xs mt-1">{errors.email_address}</p>}
                            </div>
                        </div>

                        <div className="mt-12 flex justify-end gap-4">
                            {editingId && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                        reset();
                                        setEditingId(null);
                                    }}
                                    className="px-8 h-10 rounded-lg text-sm"
                                >
                                    CANCEL
                                </Button>
                            )}
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-[#162a5b] hover:bg-[#1c3a7a] text-white px-10 h-10 rounded-lg shadow-lg shadow-blue-900/10 font-bold tracking-wide uppercase italic"
                            >
                                {processing ? 'SAVING...' : (editingId ? 'UPDATE CUSTOMER' : 'SAVE CUSTOMER')}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-white border shadow-sm rounded-sm overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Customer Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <tr key={customer.id} className="border-b hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium">{customer.customer_name}</td>
                                            <td className="px-6 py-4">{customer.customer_category || '-'}</td>
                                            <td className="px-6 py-4">{customer.contact_number || '-'}</td>
                                            <td className="px-6 py-4">{customer.email_address || '-'}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(customer)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(customer.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No customers found. Click "ADD NEW" to create one.
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
