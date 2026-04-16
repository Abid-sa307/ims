import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Clock, CheckCircle2, AlertCircle, RotateCcw, Printer } from 'lucide-react';
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
        total: number;
        from: number;
        to: number;
    };
    locations: any[];
    suppliers: any[];
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        location_id?: string;
        supplier_id?: string;
        status?: string;
    };
}

export default function PurchaseSummary({ purchaseOrders, locations = [], suppliers = [], filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [locationId, setLocationId] = useState(filters.location_id || 'all');
    const [supplierId, setSupplierId] = useState(filters.supplier_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get('/purchase/summary', {
            search,
            date_from: dateFrom,
            date_to: dateTo,
            location_id: locationId === 'all' ? '' : locationId,
            supplier_id: supplierId === 'all' ? '' : supplierId,
            status: status === 'all' ? '' : status,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setLocationId('all');
        setSupplierId('all');
        setStatus('all');
        router.get('/purchase/summary', {}, { preserveState: false });
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'bg-green-50 text-green-700 border-green-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'received': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'sent': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return <CheckCircle2 className="size-3" />;
            case 'pending': return <Clock className="size-3" />;
            default: return <AlertCircle className="size-3" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Order Summary" />
            <div className="flex h-full flex-col p-6 bg-gray-50/30 min-h-screen gap-6">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-t-2 border-t-[#162a5b] bg-white p-6 shadow-sm rounded-xl">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Purchase Order Summary</h1>
                        <p className="text-sm text-gray-500">Track and manage all your procurement requests.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-9 gap-2 shadow-sm font-semibold text-xs transition-all hover:bg-slate-50">
                            <Download className="size-4" /> EXPORT
                        </Button>
                    </div>
                </div>

                {/* Advanced Filter Section */}
                <Card className="border shadow-sm bg-white rounded-xl overflow-visible">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-end">
                            {/* Search */}
                            <div className="space-y-2 lg:col-span-2 xl:col-span-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search PO / Supplier</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input 
                                        className="pl-9 h-11 border-gray-200 text-sm focus-visible:ring-[#162a5b] bg-[#f8fafc]" 
                                        placeholder="Order # or Name"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                            </div>

                            {/* Date From */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date From</Label>
                                <Input 
                                    type="date"
                                    className="h-11 border-gray-200 text-sm focus-visible:ring-[#162a5b] bg-[#f8fafc]" 
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>

                            {/* Date To */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date To</Label>
                                <Input 
                                    type="date"
                                    className="h-11 border-gray-200 text-sm focus-visible:ring-[#162a5b] bg-[#f8fafc]" 
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</Label>
                                <Select value={locationId} onValueChange={setLocationId}>
                                    <SelectTrigger className="h-11 border-gray-200 bg-[#f8fafc]">
                                        <SelectValue placeholder="All Locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {locations.map(loc => (
                                            <SelectItem key={loc.id} value={loc.id.toString()}>{loc.location_legal_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Supplier */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Supplier</Label>
                                <Select value={supplierId} onValueChange={setSupplierId}>
                                    <SelectTrigger className="h-11 border-gray-200 bg-[#f8fafc]">
                                        <SelectValue placeholder="All Suppliers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Suppliers</SelectItem>
                                        {suppliers.map(sup => (
                                            <SelectItem key={sup.id} value={sup.id.toString()}>{sup.supplier_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 border-gray-200 bg-[#f8fafc]">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">PENDING</SelectItem>
                                        <SelectItem value="approved">APPROVED</SelectItem>
                                        <SelectItem value="sent">SENT</SelectItem>
                                        <SelectItem value="received">RECEIVED</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 lg:col-span-2 xl:col-span-1">
                                <Button onClick={handleFilter} className="h-11 flex-1 bg-[#162a5b] hover:bg-[#1c3a7a] font-bold gap-2">
                                    <Filter className="size-4" /> Filter
                                </Button>
                                <Button onClick={handleReset} variant="outline" className="h-11 w-11 p-0 border-gray-200 hover:bg-gray-50">
                                    <RotateCcw className="size-4 text-gray-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Table Section */}
                <Card className="border shadow-sm bg-white overflow-hidden rounded-xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-gray-600 font-bold text-[11px] uppercase tracking-widest border-b">
                                    <tr>
                                        <th className="px-8 py-5">Order Details</th>
                                        <th className="px-8 py-5">Supplier</th>
                                        <th className="px-8 py-5">Location</th>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {purchaseOrders.data.length > 0 ? (
                                        purchaseOrders.data.map((po) => (
                                            <tr key={po.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="font-extrabold text-[#162a5b] group-hover:underline cursor-pointer transition-all">{po.order_number}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-tighter">{po.reference_bill_no || 'No Ref Bill'}</div>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-gray-700">{po.supplier?.supplier_name}</td>
                                                <td className="px-8 py-5 text-gray-500 font-medium">{po.location?.location_legal_name}</td>
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-gray-900 tracking-tight">₹ {Number(po.grand_total).toLocaleString()}</div>
                                                    <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Incl. Taxes & Charges</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border tracking-wider",
                                                        getStatusStyles(po.status)
                                                    )}>
                                                        {getStatusIcon(po.status)}
                                                        {po.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-gray-500 text-xs font-semibold">
                                                    {new Date(po.po_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5 text-right flex justify-end gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="h-8 w-8 p-0 text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all"
                                                        onClick={() => window.open(`/purchase/orders/${po.id}/print`, '_blank')}
                                                        title="Print PO"
                                                    >
                                                        <Printer className="size-4" />
                                                    </Button>
                                                    {po.status === 'pending' && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 px-4 text-[10px] font-black text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm transition-all"
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
                                            <td colSpan={7} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-300">
                                                    <Search className="size-16 mb-4 opacity-5" />
                                                    <p className="text-base font-bold text-gray-400">No orders found matching your filters.</p>
                                                    <Button onClick={handleReset} variant="link" className="text-indigo-600 font-bold mt-2">Clear all filters</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination Stats */}
                <div className="flex items-center justify-between px-2 text-sm text-gray-500 font-medium">
                    <div>
                        Showing <span className="text-gray-900">{purchaseOrders.from || 0}</span> to <span className="text-gray-900">{purchaseOrders.to || 0}</span> of <span className="text-gray-900">{purchaseOrders.total}</span> orders
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
