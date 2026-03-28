import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FileBarChart, Calendar, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '#' },
    { title: 'Purchase Report', href: '/reports/purchase' },
];

export default function PurchaseReport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Report" />
            <div className="flex h-full flex-col p-8 bg-white">
                <div className="flex items-center justify-between mb-12 border-b pb-8">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                            <FileBarChart className="size-6" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Procurement Analytics</h1>
                    </div>
                    <Button variant="outline" className="rounded-xl gap-2 font-bold h-11 border-slate-200 uppercase tracking-tight text-xs">
                        <Calendar className="size-4" /> THIS QUARTER
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center h-64 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <TrendingDown className="size-12 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Statistical data processing in background...</p>
                </div>
            </div>
        </AppLayout>
    );
}
