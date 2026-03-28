import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DollarSign, ShieldCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operations', href: '#' },
    { title: 'Payment Management', href: '/operations/payment-management' },
];

export default function PaymentManagement() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Management" />
            <div className="flex h-full flex-col items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full text-center">
                    <div className="size-20 rounded-full bg-slate-900 flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-slate-300">
                        <DollarSign className="size-10" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">Escrow & Funds</h1>
                    <p className="text-slate-500 font-medium mb-12">Centralized financial management for operational expenses and vendor settlements.</p>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-[#162a5b] bg-blue-50 py-3 rounded-2xl uppercase italic">
                        <ShieldCheck className="size-4" /> SECURE LEDGER ACTIVE
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
