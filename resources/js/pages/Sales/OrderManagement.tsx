import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Clock, CheckCircle2, AlertCircle, RotateCcw, ShoppingCart, PlusCircle, Printer } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Sales Summary', href: '/sales/order-management' },
];

interface Props {
    invoices: {
        data: any[];
        links: any[];
        total: number;
        from: number;
        to: number;
    };
    locations: any[];
    customers: any[];
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        location_id?: string;
        customer_id?: string;
        status?: string;
    };
}

export default function OrderManagement({ invoices, locations = [], customers = [], filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [locationId, setLocationId] = useState(filters.location_id || 'all');
    const [customerId, setCustomerId] = useState(filters.customer_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get('/sales/order-management', {
            search,
            date_from: dateFrom,
            date_to: dateTo,
            location_id: locationId === 'all' ? '' : locationId,
            customer_id: customerId === 'all' ? '' : customerId,
            status: status === 'all' ? '' : status,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setLocationId('all');
        setCustomerId('all');
        setStatus('all');
        router.get('/sales/order-management', {}, { preserveState: false });
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'bg-green-50 text-green-700 border-green-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
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
            <Head title="Sales Summary" />
            <div className="flex h-full flex-col p-6 bg-gray-50/30 min-h-screen gap-6">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-t-2 border-t-[#162a5b] bg-white p-6 shadow-sm rounded-xl">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Sales Summary</h1>
                        <p className="text-sm text-gray-500">Track and manage all your sales invoices.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/sales/generate-invoice">
                            <Button className="h-9 gap-2 bg-[#162a5b] hover:bg-[#1c3a7a] font-bold text-xs uppercase tracking-wider">
                                <PlusCircle className="size-4" /> GENERATE SO
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-9 gap-2 shadow-sm font-semibold text-xs transition-all hover:bg-slate-50">
                            <Download className="size-4" /> EXPORT
                        </Button>
                    </div>
                </div>

                {/* Advanced Filter Section */}
                <Card className="border shadow-sm bg-white rounded-xl overflow-visible text-gray-700">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-end">
                            {/* Search */}
                            <div className="space-y-2 lg:col-span-2 xl:col-span-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Invoice #</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input 
                                        className="pl-9 h-11 border-gray-200 text-sm focus-visible:ring-[#162a5b] bg-[#f8fafc]" 
                                        placeholder="Invoice # or Customer"
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

                            {/* Customer */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</Label>
                                <Select value={customerId} onValueChange={setCustomerId}>
                                    <SelectTrigger className="h-11 border-gray-200 bg-[#f8fafc]">
                                        <SelectValue placeholder="All Customers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Customers</SelectItem>
                                        {customers.map(cust => (
                                            <SelectItem key={cust.id} value={cust.id.toString()}>{cust.customer_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 border-gray-200 bg-[#f8fafc]">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">PENDING</SelectItem>
                                        <SelectItem value="approved">APPROVED</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 lg:col-span-2 xl:col-span-1">
                                <Button onClick={handleFilter} className="h-11 flex-1 bg-[#162a5b] hover:bg-[#1c3a7a] font-bold gap-2 text-white">
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
                                        <th className="px-8 py-5">Invoice Details</th>
                                        <th className="px-8 py-5">Customer</th>
                                        <th className="px-8 py-5">Location</th>
                                        <th className="px-8 py-5">Grand Total</th>
                                        <th className="px-8 py-5 text-center">Auto Appr.</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoices.data.length > 0 ? (
                                        invoices.data.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="font-extrabold text-[#162a5b] group-hover:underline cursor-pointer transition-all">{invoice.invoice_number}</div>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-gray-700">{invoice.customer?.customer_name}</td>
                                                <td className="px-8 py-5 text-gray-500 font-medium">{invoice.location?.location_legal_name}</td>
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-gray-900 tracking-tight">₹ {Number(invoice.grand_total).toLocaleString()}</div>
                                                    <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Total Receivable</div>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    {invoice.is_auto_approved ? (
                                                        <span className="text-green-600 font-black text-[10px] uppercase">YES</span>
                                                    ) : (
                                                        <span className="text-gray-300 font-black text-[10px] uppercase">NO</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border tracking-wider",
                                                        getStatusStyles(invoice.status)
                                                    )}>
                                                        {getStatusIcon(invoice.status)}
                                                        {invoice.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-gray-500 text-xs font-semibold">
                                                    {new Date(invoice.invoice_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5 text-right flex justify-end gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 shadow-sm"
                                                        onClick={() => window.open(`/sales/invoices/${invoice.id}/print`, '_blank')}
                                                        title="Print Invoice"
                                                    >
                                                        <Printer className="size-3.5 text-gray-600" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-300">
                                                    <Search className="size-16 mb-4 opacity-5" />
                                                    <p className="text-base font-bold text-gray-400">No invoices found matching your filters.</p>
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
                        Showing <span className="text-gray-900">{invoices.from || 0}</span> to <span className="text-gray-900">{invoices.to || 0}</span> of <span className="text-gray-900">{invoices.total}</span> invoices
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
