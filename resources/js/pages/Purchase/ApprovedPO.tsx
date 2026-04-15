import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Filter, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Approved PO', href: '/purchase/approved-po' },
];

interface Props {
    purchaseOrders: any[];
    filters: {
        date_from?: string;
        date_to?: string;
    };
}

export default function ApprovedPO({ purchaseOrders, filters }: Props) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get('/purchase/approved-po', { date_from: dateFrom, date_to: dateTo }, { preserveState: true });
    };

    const clearFilter = () => {
        setDateFrom('');
        setDateTo('');
        router.get('/purchase/approved-po', {}, { preserveState: true });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Approval - PO" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="flex flex-col md:flex-row items-center justify-between border-b pb-6 mb-8 border-t-2 border-t-amber-500 bg-white p-6 shadow-sm rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                            <Clock className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Purchase Order Approval</h1>
                            <p className="text-sm text-gray-500">History and authorization of purchase orders.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-end gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">From Date</label>
                            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-xs w-36" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">To Date</label>
                            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-xs w-36" />
                        </div>
                        <div className="flex gap-1">
                            <Button onClick={handleFilter} size="sm" className="h-8 bg-[#162a5b] hover:bg-[#1c3a7a] gap-1 px-3">
                                <Filter className="size-3" /> Filter
                            </Button>
                            {(filters.date_from || filters.date_to) && (
                                <Button onClick={clearFilter} variant="outline" size="sm" className="h-8 gap-1 px-3 text-red-600 border-red-100 hover:bg-red-50">
                                    <XCircle className="size-3" /> Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchaseOrders.length > 0 ? (
                        purchaseOrders.map((po) => (
                            <div key={po.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{po.order_number}</span>
                                    <div className="flex items-center text-gray-400 gap-1 text-[10px]">
                                        <Clock className="size-3" /> {new Date(po.po_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{po.supplier?.supplier_name || 'N/A'}</h3>
                                <p className="text-xs text-gray-500 mb-6 font-medium">Total Amount: ₹ {Number(po.grand_total).toLocaleString()}</p>
                                
                                {po.status === 'pending' ? (
                                    <Button 
                                        className="w-full bg-amber-500 hover:bg-amber-600 h-9 text-xs font-bold text-white shadow-lg shadow-amber-100 flex items-center justify-center gap-2"
                                        onClick={() => router.post(`/purchase/approve-po/${po.id}`)}
                                    >
                                        <CheckCircle2 className="size-4" /> APPROVE ORDER
                                    </Button>
                                ) : (
                                    <div className="w-full bg-green-50 text-green-600 h-9 text-[10px] font-black uppercase rounded-lg border border-green-100 flex items-center justify-center gap-2">
                                        <CheckCircle2 className="size-4" /> Order Approved
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <Clock className="size-12 mx-auto mb-4 opacity-10" />
                            <p>No purchase orders found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
