import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Send, Mail } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Send PO to Supplier', href: '/purchase/send-po' },
];

export default function SendPO() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send PO to Supplier" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12 text-center">
                    <div className="size-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6">
                        <Send className="size-10" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#162a5b] mb-2">Send Purchase Orders</h1>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Review and transmit your approved purchase orders to suppliers via email or EDI.</p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="flex items-center gap-3">
                                <Mail className="size-5 text-gray-400" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-700 underline">Draft POs Pending Transmission</p>
                                    <p className="text-xs text-gray-500">8 orders ready for mailing</p>
                                </div>
                            </div>
                            <Button variant="outline" className="h-8 text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50">MANAGE</Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
