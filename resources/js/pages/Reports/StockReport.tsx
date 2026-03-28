import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PieChart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '#' },
    { title: 'Stock Report', href: '/reports/stock' },
];

export default function StockReport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Report" />
            <div className="flex h-full flex-col p-8 bg-slate-50/20">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#162a5b] rounded-2xl text-white shadow-xl shadow-blue-100">
                            <PieChart className="size-7" />
                        </div>
                        <h1 className="text-3xl font-black text-[#162a5b] tracking-tighter uppercase italic">Inventory Valuation</h1>
                    </div>
                    <Button className="bg-[#162a5b] rounded-xl font-bold h-11 gap-2 shadow-xl shadow-blue-900/10 uppercase tracking-tighter italic">
                        <Download className="size-4" /> GENERATE PDF
                    </Button>
                </div>

                <div className="bg-white rounded-[3rem] p-32 text-center shadow-sm border border-slate-100">
                    <p className="text-slate-400 italic font-medium">Computing live valuation... Please wait.</p>
                </div>
            </div>
        </AppLayout>
    );
}
