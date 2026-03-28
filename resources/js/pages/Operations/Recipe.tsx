import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { UtensilsCrossed, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operations', href: '#' },
    { title: 'Recipe', href: '/operations/recipe' },
];

export default function Recipe() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipe Master" />
            <div className="flex h-full flex-col p-8 bg-white">
                <div className="flex items-center justify-between mb-12 border-b-2 border-slate-100 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-100">
                            <UtensilsCrossed className="size-6" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Recipe Master</h1>
                    </div>
                    <Button className="bg-[#162a5b] rounded-xl h-10 px-6 font-bold uppercase tracking-tight gap-2">
                        <Plus className="size-4" /> NEW RECIPE
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="group border-2 border-slate-50 rounded-3xl p-8 hover:border-orange-200 transition-colors cursor-pointer bg-slate-50/30">
                        <div className="size-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors mb-4">
                            <Plus className="size-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 italic">Create First Recipe</h3>
                        <p className="text-xs text-slate-400 font-medium">Define ingredients, ratios, and processes.</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
