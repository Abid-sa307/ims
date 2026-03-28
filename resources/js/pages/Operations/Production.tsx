import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Factory, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operations', href: '#' },
    { title: 'Production', href: '/operations/production' },
];

export default function Production() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Production Management" />
            <div className="flex h-full flex-col p-8 bg-slate-50/20">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
                            <Factory className="size-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Production Floor</h1>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Real-time Manufacturing Oversight</p>
                        </div>
                    </div>
                    <Button className="bg-[#162a5b] hover:bg-[#1c3a7a] h-12 px-10 rounded-xl font-black uppercase italic tracking-tighter shadow-lg shadow-blue-900/10 gap-3 transition-all transform hover:translate-y-[-2px]">
                        <PlayCircle className="size-5" /> START BATCH
                    </Button>
                </div>

                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-32 text-center">
                    <p className="text-slate-300 font-black uppercase tracking-widest text-lg">No active production runs detected.</p>
                </div>
            </div>
        </AppLayout>
    );
}
