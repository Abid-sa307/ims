import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Order Management', href: '/sales/order-management' },
];

export default function OrderManagement() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Order Management" />
            <div className="flex h-full flex-col p-6 bg-slate-50/50">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 italic uppercase italic tracking-tighter">Order Management</h1>
                        <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Live Tracking & Fulfillment</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black shadow-sm">
                            <Clock className="size-3" /> LIVE UPDATES ACTIVE
                        </div>
                        <Button className="bg-[#162a5b] hover:bg-[#1c3a7a] h-10 px-6 rounded-xl font-bold uppercase italic tracking-tighter shadow-lg shadow-blue-900/10 gap-2">
                            CREATE NEW ORDER
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    <Card className="border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-slate-900 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <ShoppingCart className="size-4 text-blue-600" /> Pending Customer Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-12 text-center">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Awaiting incoming orders...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
