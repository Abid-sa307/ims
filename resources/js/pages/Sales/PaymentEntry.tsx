import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { IndianRupee, Landmark, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Payment Entry', href: '/sales/payment-entry' },
];

export default function SalesPaymentEntry() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Entry from Customer" />
            <div className="flex h-full flex-col p-6 bg-slate-50/50">
                <div className="flex items-center justify-between mb-12 border-b-2 border-[#162a5b] pb-6 bg-white p-6 shadow-sm rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Landmark className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-[#162a5b] tracking-tighter uppercase italic">Customer Payments</h1>
                            <p className="text-slate-500 font-medium">Capture incoming funds and settle invoices.</p>
                        </div>
                    </div>
                    <Button className="bg-[#162a5b] rounded-full px-8 h-12 shadow-xl shadow-blue-900/10 gap-2 font-bold uppercase italic tracking-tighter">
                        <Plus className="size-5" /> RECORD RECEIPT
                    </Button>
                </div>

                <div className="bg-white rounded-[2rem] p-24 text-center border-2 border-dashed border-slate-200">
                    <IndianRupee className="size-16 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">No payment records currently tracked.</p>
                </div>
            </div>
        </AppLayout>
    );
}
