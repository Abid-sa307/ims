import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, PackageCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Received PO', href: '/purchase/received-po' },
];

export default function ReceivedPO() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Received PO from Supplier" />
            <div className="flex h-full flex-col p-6 bg-gray-100/30">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">PO Receipt Log</h1>
                        <p className="text-slate-500 font-medium">History of all items received from suppliers.</p>
                    </div>
                    <PackageCheck className="size-10 text-[#162a5b] opacity-20" />
                </div>

                <div className="grid gap-6">
                    <Card className="border-none shadow-md overflow-hidden bg-white">
                        <CardHeader className="bg-[#162a5b] p-4">
                            <CardTitle className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Box className="size-4" /> Incoming Shipments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 text-center">
                            <div className="max-w-xs mx-auto">
                                <p className="text-slate-400 text-sm italic">All shipments are currently processed. No pending receipts to display.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
