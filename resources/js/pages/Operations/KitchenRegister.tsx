import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ClipboardList, Flame } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operations', href: '#' },
    { title: 'Central Kitchen Register', href: '/operations/kitchen-register' },
];

export default function KitchenRegister() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kitchen Register" />
            <div className="flex h-full flex-col p-8 bg-slate-50/20">
                <div className="flex items-center gap-4 mb-12 border-b-4 border-[#162a5b] pb-6">
                    <Flame className="size-10 text-orange-600 animate-pulse" />
                    <h1 className="text-4xl font-black text-[#162a5b] tracking-tighter uppercase italic">Kitchen Registry</h1>
                </div>

                <div className="bg-white rounded-[3rem] p-32 flex flex-col items-center justify-center shadow-2xl shadow-slate-200">
                    <ClipboardList className="size-20 text-slate-100 mb-8" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] italic text-center leading-relaxed">System initializing... <br /> Awaiting daily logs from the central kitchen.</p>
                </div>
            </div>
        </AppLayout>
    );
}
