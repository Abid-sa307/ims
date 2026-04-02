import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Zap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Auto Approved PO', href: '/purchase/auto-approved-po' },
];

interface Props {
    purchaseOrders: any[];
}

export default function AutoApprovedPO({ purchaseOrders }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Auto Approved Purchase Orders" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="flex items-center justify-between border-b pb-6 mb-8 border-t-2 border-t-indigo-600 bg-white p-6 shadow-sm rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Zap className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Auto Approved Purchase Orders</h1>
                            <p className="text-sm text-gray-500">System validated and automatically approved orders.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchaseOrders.length > 0 ? (
                        purchaseOrders.map((po) => (
                            <div key={po.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{po.order_number}</span>
                                    <div className="flex items-center text-gray-400 gap-1 text-[10px]">
                                        <Clock className="size-3" /> {new Date(po.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{po.supplier?.supplier_name || 'N/A'}</h3>
                                <p className="text-xs text-gray-500 mb-6">Total Amount: ₹ {po.grand_total}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 h-9 text-xs font-bold border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                                        VIEW DETAILS
                                    </Button>
                                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-9 text-xs font-bold text-white shadow-lg shadow-indigo-100">
                                        SEND PO
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <Zap className="size-12 mx-auto mb-4 opacity-10" />
                            <p>No auto-approved purchase orders found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
