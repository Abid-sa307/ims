import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Banknote, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Payment Entry', href: '/purchase/payment-entry' },
];

export default function PaymentEntry() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Entry to Supplier" />
            <div className="flex h-full flex-col p-6 bg-slate-50">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                        <Banknote className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Payment Entries</h1>
                        <p className="text-sm text-slate-500">Record and reconcile supplier payments.</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {[1].map((i) => (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="text-sm font-bold text-blue-600">PAY-2026-003</div>
                                    <div className="h-4 w-px bg-slate-200" />
                                    <div className="text-sm font-bold text-slate-900">Rajesh Engineering Works</div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Paid</div>
                                        <div className="text-sm font-black text-slate-900">₹ 1,24,000.00</div>
                                    </div>
                                    <ArrowRight className="size-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
