import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackageCheck, Clock, Filter, Calendar, Search, AlignJustify, CheckCircle2, X, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase', href: '#' },
    { title: 'Receive PO', href: '/purchase/received-po' },
];

interface Props {
    purchaseOrders: any[];
    locations: any[];
    suppliers: any[];
    filters: any;
}

export default function ReceivedPO({ purchaseOrders, locations, suppliers, filters }: Props) {
    const { flash } = usePage().props as any;
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const [filterState, setFilterState] = useState({
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
        location_id: filters?.location_id || '',
        supplier_id: filters?.supplier_id || '',
        search: ''
    });

    const handleFilter = () => {
        router.get('/purchase/received-po', filterState, { preserveState: true, replace: true });
    };

    const filteredOrders = purchaseOrders.filter(po => {
        if (!filterState.search) return true;
        const s = filterState.search.toLowerCase();
        return (
            (po.order_number || '').toLowerCase().includes(s) ||
            (po.supplier?.supplier_name || '').toLowerCase().includes(s)
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Receive PO" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 bg-gray-50/50 overflow-y-auto relative">

                {showFlash && flash?.success && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <p className="text-sm font-bold tracking-tight">{flash.success}</p>
                        </div>
                        <button onClick={() => setShowFlash(false)} className="text-emerald-500 hover:text-emerald-700 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Receive PO</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Orders sent to supplier — pending final receive</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-md border shadow-sm flex flex-col mb-6 border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-4 space-y-2">
                                <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Date Range:</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex rounded-md shadow-sm">
                                        <div className="flex items-center justify-center px-2 border border-r-0 border-gray-200 bg-gray-50 rounded-l-md">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                        </div>
                                        <Input type="date" className="h-9 rounded-l-none border-gray-200 text-[10px] px-1" value={filterState.date_from} onChange={e => setFilterState({...filterState, date_from: e.target.value})} />
                                    </div>
                                    <div className="flex rounded-md shadow-sm">
                                        <div className="flex items-center justify-center px-2 border border-r-0 border-gray-200 bg-gray-50 rounded-l-md">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                        </div>
                                        <Input type="date" className="h-9 rounded-l-none border-gray-200 text-[10px] px-1" value={filterState.date_to} onChange={e => setFilterState({...filterState, date_to: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Location</Label>
                                <select value={filterState.location_id} onChange={e => setFilterState({...filterState, location_id: e.target.value})} className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value="">All Locations</option>
                                    {locations?.map((loc: any) => <option key={loc.id} value={loc.id}>{loc.location_legal_name}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Supplier</Label>
                                <select value={filterState.supplier_id} onChange={e => setFilterState({...filterState, supplier_id: e.target.value})} className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value="">All Suppliers</option>
                                    {suppliers?.map((sup: any) => <option key={sup.id} value={sup.id}>{sup.supplier_name}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2 flex items-end">
                                <Button onClick={handleFilter} className="w-full bg-[#3490dc] hover:bg-[#2779bd] text-white h-9 shadow-sm font-bold tracking-widest text-[11px] flex items-center justify-center gap-2">
                                    <Filter className="h-3.5 w-3.5" /> FILTER
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/20">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
                            <div className="relative group">
                                <Search className="absolute left-0 top-1.5 h-3.5 w-3.5 text-gray-300" />
                                <Input type="text" placeholder="Type to filter..." value={filterState.search} onChange={e => setFilterState({...filterState, search: e.target.value})} className="h-7 w-[180px] border-0 border-b border-gray-200 rounded-none shadow-none pl-5 pr-0 focus-visible:ring-0 text-xs bg-transparent" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex bg-white border border-gray-200 rounded shadow-sm text-[9px] font-black text-gray-500 tracking-tighter">
                                <button className="px-3 py-1.5 hover:bg-gray-50 border-r border-gray-100 uppercase">COPY</button>
                                <button className="px-3 py-1.5 hover:bg-gray-50 border-r border-gray-100 uppercase">CSV</button>
                                <button className="px-3 py-1.5 hover:bg-gray-50 border-r border-gray-100 uppercase">PRINT</button>
                                <button className="px-2 py-1.5 hover:bg-gray-50 flex items-center">
                                    <AlignJustify className="h-3 w-3" /> <span className="ml-1 text-[7px]">▼</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-xs text-left align-middle border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest border-r border-gray-50">Receive</th>
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest border-r border-gray-50 text-center">Sr. No</th>
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest border-r border-gray-50">Supplier</th>
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest border-r border-gray-50">Location</th>
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest border-r border-gray-50">Order No.</th>
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest border-r border-gray-50 text-center">PO Date</th>
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest border-r border-gray-50 text-right">Total Amount</th>
                                    <th className="px-4 py-3.5 font-bold text-[#162a5b] uppercase text-[10px] tracking-widest text-right">Payable Amt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.length > 0 ? filteredOrders.map((po: any, index: number) => (
                                    <tr key={po.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-4 py-3 border-r border-gray-50/50">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-[10px] font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 gap-1.5 px-2"
                                                onClick={() => router.get(`/purchase/receive-order/${po.id}`)}
                                                title="Open Receive Form"
                                            >
                                                <Package className="h-3.5 w-3.5" /> RECEIVE
                                            </Button>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 border-r border-gray-50/50 text-center font-medium">{index + 1}</td>
                                        <td className="px-4 py-3 text-gray-700 border-r border-gray-50/50 font-semibold uppercase text-[10px] tracking-tight">{po.supplier?.supplier_name}</td>
                                        <td className="px-4 py-3 text-gray-600 border-r border-gray-50/50 italic text-[10px] font-medium">{po.location?.location_legal_name}</td>
                                        <td className="px-4 py-3 font-black text-gray-900 border-r border-gray-50/50 uppercase tracking-tighter text-[10px]">{po.order_number}</td>
                                        <td className="px-4 py-3 text-gray-500 border-r border-gray-50/50 text-center text-[10px] font-medium tracking-wider">{po.po_date}</td>
                                        <td className="px-4 py-3 text-right text-gray-700 border-r border-gray-50/50 font-bold tabular-nums">{Number(po.total_amount).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-black text-blue-900 bg-blue-50/20 tabular-nums">{Number(po.grand_total).toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center text-gray-300 font-bold uppercase tracking-[0.2em] italic bg-white">
                                            <PackageCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                            No Orders Pending Reception
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 bg-gray-50/50">
                        <div>Showing {filteredOrders.length > 0 ? 1 : 0} To {filteredOrders.length} Of {filteredOrders.length} Entries</div>
                        <div className="flex gap-6 items-center">
                            <button className="hover:text-blue-600 transition-colors flex items-center gap-1 group">
                                <span className="group-hover:-translate-x-1 transition-transform">←</span> PREVIOUS
                            </button>
                            <button className="hover:text-blue-600 transition-colors flex items-center gap-1 group">
                                NEXT <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
