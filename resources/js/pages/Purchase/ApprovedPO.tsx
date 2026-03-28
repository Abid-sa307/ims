import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Approved PO', href: '/purchase/approved-po' },
];

export default function ApprovedPO() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Approved Purchase Orders" />
            <div className="flex h-full flex-col p-6 bg-gray-50">
                <div className="flex items-center justify-between border-b pb-6 mb-8 border-t-2 border-t-[#162a5b] bg-white p-6 shadow-sm rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Approved Purchase Orders</h1>
                            <p className="text-sm text-gray-500">Orders ready for dispatch to suppliers.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">PO #882{i}</span>
                                <div className="flex items-center text-gray-400 gap-1 text-[10px]">
                                    <Clock className="size-3" /> 2 HRS AGO
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Global Supplies Ltd</h3>
                            <p className="text-xs text-gray-500 mb-6">Total Amount: ₹ 45,600.00</p>
                            <Button className="w-full bg-[#162a5b] hover:bg-[#1c3a7a] h-9 text-xs font-bold">
                                SEND TO SUPPLIER
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
