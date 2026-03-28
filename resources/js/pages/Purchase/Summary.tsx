import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Purchase Order Summary', href: '/purchase/summary' },
];

export default function PurchaseSummary() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Order Summary" />
            <div className="flex h-full flex-col p-6 bg-gray-50/30">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Purchase Order Summary</h1>
                        <p className="text-sm text-gray-500">Track and manage all your procurement requests.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-9 gap-2 shadow-sm">
                            <Download className="size-4" /> EXPORT
                        </Button>
                        <Button className="bg-[#162a5b] h-9 gap-2 shadow-md">
                            <Search className="size-4" /> REFRESH
                        </Button>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <Input className="pl-9 h-9 border-gray-200 text-sm focus-visible:ring-1" placeholder="Search by PO Number or Supplier..." />
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-500 gap-2">
                            <Filter className="size-4" /> ADVANCED FILTER
                        </Button>
                    </div>
                    <CardContent className="p-0">
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-400">
                            <Search className="size-12 mb-4 opacity-20" />
                            <p className="text-sm font-medium">No purchase orders found matching your criteria.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
