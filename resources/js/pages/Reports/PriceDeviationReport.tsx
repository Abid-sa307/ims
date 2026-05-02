import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Copy, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'New Reports', href: '#' },
    { title: 'Price Deviation', href: '/reports/new/price-deviation' },
];

interface PoRow { no: number; supplier: string; po_date: string; order_number: string; qty: number; price: number; }
interface Row {
    id: number; supplier: string; product: string;
    min_price: number; max_price: number;
    po_history: PoRow[];
}

type SortKey = 'id' | 'supplier' | 'product' | 'min_price' | 'max_price';
type SortDir = 'asc' | 'desc' | null;



const fmt = (d: Date) => d.toISOString().split('T')[0];
const today = new Date(); const ago = new Date(today); ago.setDate(today.getDate() - 30);

export default function PriceDeviationReport({ reportData = [], suppliers = [], filters = {} }: any) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || fmt(ago));
    const [dateTo, setDateTo] = useState(filters.date_to || fmt(today));
    const [supplierFilter, setSupplierFilter] = useState(filters.supplier_name || '1 Selected');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [itemFilter, setItemFilter] = useState('');
    const [applied, setApplied] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pageSize, setPageSize] = useState(50);
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const toggleExpand = (id: number) => setExpanded(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const data = useMemo(() => applied ? reportData : [], [applied, reportData]);
    const filtered = useMemo(() => {
        if (!globalFilter) return data;
        const q = globalFilter.toLowerCase();
        return data.filter(r => r.supplier.toLowerCase().includes(q) || r.product.toLowerCase().includes(q));
    }, [data, globalFilter]);

    const sorted = useMemo(() => {
        if (!sortDir) return filtered;
        return [...filtered].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
    const grandTotal = sorted.reduce((s, r) => s + r.min_price, 0);

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
        setSortDir(p => p === 'asc' ? 'desc' : p === 'desc' ? null : 'asc');
    };
    const SI = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ChevronsUpDown className="size-3 opacity-40" />;
        if (sortDir === 'asc') return <ChevronUp className="size-3" />;
        if (sortDir === 'desc') return <ChevronDown className="size-3" />;
        return <ChevronsUpDown className="size-3 opacity-40" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Price Deviation" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-xl font-bold text-[#162a5b] border-b-2 border-[#162a5b] pb-1">Price Deviation</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-500">Date:</span>
                            <div className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1">
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="outline-none text-xs w-24 bg-transparent" />
                                <span className="text-slate-400">–</span>
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="outline-none text-xs w-24 bg-transparent" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-500">Supplier:</span>
                            <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-xs min-w-[110px] bg-white">
                                <option value="1 Selected">1 Selected</option>
                                {suppliers.map((s: string) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-500">Item Category:</span>
                            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-xs min-w-[110px] bg-white">
                                <option value="">None Selected</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-500">Item:</span>
                            <select value={itemFilter} onChange={e => setItemFilter(e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-xs min-w-[110px] bg-white">
                                <option value="">None Selected</option>
                            </select>
                        </div>
                        <button onClick={() => {
                            window.location.href = `/reports/new/price-deviation?date_from=${dateFrom}&date_to=${dateTo}&supplier_name=${supplierFilter}`;
                        }}
                            className="flex items-center gap-1.5 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors">
                            <Search className="size-4" /> Search
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Show</span>
                            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="border border-slate-200 rounded px-1 py-0.5 text-xs bg-white">
                                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span className="text-xs text-slate-500">Entries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Search:</span>
                            <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1">
                                <input value={globalFilter} onChange={e => { setGlobalFilter(e.target.value); setPage(1); }} className="text-xs outline-none w-32" />
                            </div>
                            <button className="text-xs border border-slate-200 rounded px-2 py-1 hover:bg-slate-50 flex items-center gap-1"><Copy className="size-3" />Copy</button>
                            <button className="text-xs border border-green-300 text-green-700 rounded px-2 py-1 hover:bg-green-50">Excel</button>
                            <button className="text-xs border border-blue-300 text-blue-700 rounded px-2 py-1 hover:bg-blue-50">CSV</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    {[
                                        { label: 'S.No', key: 'id' as SortKey },
                                        { label: 'Supplier', key: 'supplier' as SortKey },
                                        { label: 'Product', key: 'product' as SortKey },
                                        { label: 'Minimum Price', key: 'min_price' as SortKey },
                                        { label: 'Maximum Price', key: 'max_price' as SortKey },
                                    ].map(({ label, key }) => (
                                        <th key={key} onClick={() => toggleSort(key)}
                                            className="text-left px-4 py-3 text-xs font-semibold tracking-wider cursor-pointer whitespace-nowrap">
                                            <div className="flex items-center gap-1">{label}<SI k={key} /></div>
                                        </th>
                                    ))}
                                    <th className="text-left px-4 py-3 text-xs font-semibold tracking-wider">Check History</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-10 text-slate-400">No Matching Records Found</td></tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <>
                                            <tr key={row.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                                <td className="px-4 py-2.5 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                                <td className="px-4 py-2.5 text-slate-700 font-medium">{row.supplier}</td>
                                                <td className="px-4 py-2.5 text-slate-700">{row.product}</td>
                                                <td className="px-4 py-2.5 text-slate-700">{row.min_price}</td>
                                                <td className="px-4 py-2.5 text-slate-700">{row.max_price}</td>
                                                <td className="px-4 py-2.5">
                                                    <button onClick={() => toggleExpand(row.id)}
                                                        className="size-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                                                        {expanded.has(row.id) ? <Minus className="size-3" /> : <Plus className="size-3" />}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expanded.has(row.id) && (
                                                <tr key={`${row.id}-exp`} className="bg-slate-50">
                                                    <td colSpan={6} className="px-8 py-3">
                                                        <table className="w-full text-xs border border-slate-200 rounded">
                                                            <thead>
                                                                <tr className="bg-slate-200 text-slate-700">
                                                                    {['No', 'Supplier', 'PO Date', 'Order Number', 'Qty', 'Price'].map(h => (
                                                                        <th key={h} className="text-left px-3 py-2 font-semibold">{h}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {row.po_history.map(po => (
                                                                    <tr key={po.no} className="border-t border-slate-100 bg-white">
                                                                        <td className="px-3 py-1.5">{po.no}</td>
                                                                        <td className="px-3 py-1.5">{po.supplier}</td>
                                                                        <td className="px-3 py-1.5">{po.po_date}</td>
                                                                        <td className="px-3 py-1.5 text-blue-600 font-mono">{po.order_number}</td>
                                                                        <td className="px-3 py-1.5">{po.qty}</td>
                                                                        <td className="px-3 py-1.5 font-semibold">{po.price}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))
                                )}
                                {paginated.length > 0 && (
                                    <tr className="bg-slate-100 font-bold">
                                        <td colSpan={3} className="px-4 py-2.5"></td>
                                        <td className="px-4 py-2.5 text-slate-900">{grandTotal.toFixed(2)}</td>
                                        <td colSpan={2}></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
                        <span>Showing {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1} To {Math.min(page * pageSize, sorted.length)} Of {sorted.length} Entries</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40">Previous</button>
                            <span className="size-7 flex items-center justify-center bg-[#162a5b] text-white rounded text-xs font-bold">{page}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
