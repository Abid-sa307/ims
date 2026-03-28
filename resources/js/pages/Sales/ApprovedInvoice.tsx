import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Approved Invoice', href: '/sales/approved-invoice' },
];

export default function ApprovedInvoice() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Approved Sale Invoices" />
            <div className="flex h-full flex-col p-8 bg-white overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-12 border-b pb-8">
                        <div>
                            <h1 className="text-3xl font-black text-[#162a5b] tracking-tighter uppercase italic">Approved Invoices</h1>
                            <p className="text-slate-500 font-medium">Verified and ready for dispatch.</p>
                        </div>
                        <FileText className="size-12 text-[#162a5b] opacity-10" />
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="group flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-[#162a5b] transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/20">
                                <div className="flex items-center gap-6">
                                    <div className="size-12 rounded-xl bg-white flex items-center justify-center text-[#162a5b] shadow-sm transform group-hover:rotate-12 transition-transform">
                                        <CheckCircle className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-[#162a5b] group-hover:text-blue-200 uppercase tracking-widest">INV-2026-880{i}</p>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors">Surya Enterprises</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 group-hover:text-blue-300 uppercase italic">Amount</p>
                                    <p className="text-xl font-black text-[#162a5b] group-hover:text-white transition-colors tracking-tighter">₹ 12,850.00</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
