import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Box, Layers, History } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operations', href: '#' },
    { title: 'Stock Management', href: '/operations/stock-management' },
];

export default function StockManagement() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Management" />
            <div className="flex h-full flex-col p-8 bg-slate-50/30">
                <div className="flex items-center gap-6 mb-12">
                    <div className="p-4 bg-[#162a5b] rounded-[2rem] text-white shadow-2xl shadow-blue-900/10">
                        <Box className="size-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#162a5b] tracking-tighter uppercase italic leading-none mb-1">Stock Controls</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Inventory Audit & Balancing</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden group cursor-pointer">
                        <CardContent className="p-10 flex items-center gap-8">
                            <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <Layers className="size-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic mb-1">Physical Audit</h3>
                                <p className="text-sm font-medium text-slate-500 italic">Reconcile physical stock with digital records.</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden group cursor-pointer">
                        <CardContent className="p-10 flex items-center gap-8">
                            <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                <History className="size-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic mb-1">Stock History</h3>
                                <p className="text-sm font-medium text-slate-500 italic">View detailed ledger of all stock movements.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
