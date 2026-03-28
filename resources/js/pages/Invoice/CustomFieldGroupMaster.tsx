import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Invoice Configuration', href: '#' },
    { title: 'Custom Field Master', href: '/invoice/custom-field-group' },
];

export default function CustomFieldGroupMaster() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Custom Field Master" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Custom Field Master</h1>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                        <Plus className="h-4 w-4" /> ADD FIELD
                    </Button>
                </div>

                <div className="bg-white border border-t-0 shadow-sm p-8 rounded-b-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 font-medium">Group Name</Label>
                            <Input className="h-10 border-0 border-b border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0" placeholder="e.g. Shipping Details" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 font-medium">Associated Module</Label>
                            <select className="flex h-10 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm focus:outline-none focus:ring-0">
                                <option>Sales Invoice</option>
                                <option>Purchase Order</option>
                                <option>Customer Master</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <Button className="bg-[#162a5b] hover:bg-[#1c3a7a] text-white px-10 h-10 rounded-lg shadow-lg font-bold tracking-wide uppercase italic">
                            SAVE GROUP
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
