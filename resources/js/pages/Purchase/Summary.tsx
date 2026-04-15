import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Purchase Order Summary', href: '/purchase/summary' },
];

interface Props {
    purchaseOrders: {
        data: any[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function PurchaseSummary({ purchaseOrders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/purchase/summary', { search }, { preserveState: true });
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'received':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return <CheckCircle2 className="size-3" />;
            case 'pending':
                return <Clock className="size-3" />;
            default:
                return <AlertCircle className="size-3" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Order Summary" />
            <div className="flex h-full flex-col p-6 bg-gray-50/30 min-h-screen">
                <div className="flex items-center justify-between mb-8 border-t-2 border-t-[#162a5b] bg-white p-6 shadow-sm rounded-xl">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Purchase Order Summary</h1>
                        <p className="text-sm text-gray-500">Track and manage all your procurement requests.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-9 gap-2 shadow-sm">
                            <Download className="size-4" /> EXPORT
                        </Button>
                    </div>
                </div>

                <Card className="border shadow-sm bg-white overflow-hidden rounded-xl">
                    <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                        <div className="relative w-80 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input 
                                    className="pl-9 h-9 border-gray-200 text-sm focus-visible:ring-[#162a5b] bg-white" 
                                    placeholder="Search PO Number or Supplier..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch} className="h-9 bg-[#162a5b] hover:bg-[#1c3a7a]">Search</Button>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-[11px] uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Order Details</th>
                                        <th className="px-6 py-4">Supplier</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {purchaseOrders.data.length > 0 ? (
                                        purchaseOrders.data.map((po) => (
                                            <tr key={po.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-[#162a5b] group-hover:underline cursor-pointer">{po.order_number}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase">{po.reference_bill_no || 'No Ref Bill'}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-700">{po.supplier?.supplier_name}</td>
                                                <td className="px-6 py-4 text-gray-500">{po.location?.location_legal_name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">₹ {Number(po.grand_total).toLocaleString()}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Incl. Taxes & Charges</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                                                        getStatusStyles(po.status)
                                                    )}>
                                                        {getStatusIcon(po.status)}
                                                        {po.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs">
                                                    {new Date(po.po_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {po.status === 'pending' && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 text-[10px] font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                            onClick={() => router.post(`/purchase/approve-po/${po.id}`)}
                                                        >
                                                            APPROVE
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <Search className="size-12 mb-4 opacity-10" />
                                                    <p className="text-sm font-medium">No purchase orders found matching your criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
