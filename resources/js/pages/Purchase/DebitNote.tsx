import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { FileMinus, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Debit Note', href: '/purchase/debit-note' },
];

export default function DebitNote() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Debit Note TO Supplier" />
            <div className="flex h-full flex-col p-8 bg-gray-50/50">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <FileMinus className="size-7 text-red-500" />
                        Debit Notes
                    </h1>
                    <Button className="bg-[#162a5b] rounded-full px-6 gap-2">
                        <Plus className="size-4" /> CREATE DEBIT NOTE
                    </Button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-12 text-center border-t-4 border-t-red-500">
                    <p className="text-gray-400 font-medium">No debit notes found in the system.</p>
                </div>
            </div>
        </AppLayout>
    );
}
