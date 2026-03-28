import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { FilePlus2, Receipt } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Credit Note', href: '/sales/credit-note' },
];

export default function CreditNote() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Credit Note TO Customer" />
            <div className="flex h-full flex-col p-8 bg-gray-50/30">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-100">
                        <Receipt className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Credit Notes</h1>
                        <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Post-Sales Adjustments</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white group cursor-pointer hover:scale-[1.02] transition-transform">
                        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                            <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors mb-6">
                                <FilePlus2 className="size-8" />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase italic tracking-tighter text-lg mb-2">Create New Note</h3>
                            <p className="text-slate-400 text-sm font-medium">Issue a new credit adjustment for returned items or price fixes.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
