import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Send, Globe } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Send Invoice', href: '/sales/send-invoice' },
];

export default function SendInvoice() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send Invoice to Customer" />
            <div className="flex h-full flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-slate-50/50">
                <div className="max-w-md w-full text-center">
                    <div className="size-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-200 animate-bounce-subtle">
                        <Send className="size-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">Invoice Transmission</h1>
                    <p className="text-slate-500 font-medium mb-10">Send your finalized invoices to customers globally via Email, WhatsApp, or Client Portals.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <Button className="h-12 bg-[#162a5b] hover:bg-slate-800 rounded-xl font-bold shadow-lg shadow-slate-200">SEND ALL</Button>
                        <Button variant="outline" className="h-12 rounded-xl font-bold border-slate-200 shadow-sm">SETTINGS</Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
