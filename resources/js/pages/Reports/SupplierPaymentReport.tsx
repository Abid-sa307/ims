import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Copy } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'New Reports', href: '#' },
    { title: 'Supplier Payment', href: '/reports/new/supplier-payment' },
];

interface Row {
    id: number;
    name: string;
    description: string;
    date: string;
    created_by: string;
    payment_mode: string;
    credit_amount: number;
}

type SortKey = keyof Row;
type SortDir = 'asc' | 'desc' | null;

const DEMO: Row[] = [
    { id: 1, name: 'LOCAL SUPPLIER', description: '', date: '14-04-2026 02:56:39 PM', created_by: 'Admin', payment_mode: 'Cash', credit_amount: 5636 },
    { id: 2, name: 'LOCAL SUPPLIER', description: '', date: '14-04-2026 03:03:13 PM', created_by: 'Admin', payment_mode: 'Card Payment', credit_amount: 2 },
    { id: 3, name: 'LOCAL SUPPLIER', description: '', date: '14-04-2026 03:20:40 PM', created_by: 'Admin', payment_mode: 'Phone Pay', credit_amount: 303 },
];

const fmt = (d: Date) => d.toISOString().split('T')[0];
const today = new Date();
const ago = new Date(today); ago.setDate(today.getDate() - 30);

export default function SupplierPaymentReport() {
    const [dateFrom, setDateFrom] = useState(fmt(ago));
    const [dateTo, setDateTo] = useState(fmt(today));
    const [supplierFilter, setSupplierFilter] = useState('');
    const [applied, setApplied] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pageSize, setPageSize] = useState(50);
    const [page, setPage] = useState(1);

    const suppliers = Array.from(new Set(DEMO.map(r => r.name)));

    const data = useMemo(() => {
        if (!applied) return [];
        return DEMO.filter(r => !supplierFilter || r.name === supplierFilter);
    }, [applied, supplierFilter]);

    const filtered = useMemo(() => {
        if (!globalFilter) return data;
        const q = globalFilter.toLowerCase();
        return data.filter(r =>
            r.name.toLowerCase().includes(q) ||
            r.payment_mode.toLowerCase().includes(q) ||
            r.created_by.toLowerCase().includes(q)
        );
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
    const total = sorted.reduce((s, r) => s + r.credit_amount, 0);

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
            <Head title="Supplier Payment" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#162a5b] border-b-2 border-[#162a5b] pb-1">Supplier Payment</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Date:</span>
                            <div className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1 text-sm">
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="outline-none text-xs w-24 bg-transparent" />
                                <span className="text-slate-400">–</span>
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="outline-none text-xs w-24 bg-transparent" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Supplier:</span>
                            <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-xs min-w-[130px] bg-white">
                                <option value="">None Selected</option>
                                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <button onClick={() => { setApplied(true); setPage(1); }}
                            className="flex items-center gap-1.5 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors">
                            <Search className="size-4" /> Search
                        </button>
                        <Link href="/reports/new/supplier-payment-entry"
                            className="flex items-center gap-1.5 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">
                            + Payment Entry
                        </Link>
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
                                <input value={globalFilter} onChange={e => { setGlobalFilter(e.target.value); setPage(1); }}
                                    className="text-xs outline-none w-32 text-slate-700" />
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
                                        { label: 'No', key: 'id' as SortKey },
                                        { label: 'Name', key: 'name' as SortKey },
                                        { label: 'Description', key: 'description' as SortKey },
                                        { label: 'Date', key: 'date' as SortKey },
                                        { label: 'Created By', key: 'created_by' as SortKey },
                                        { label: 'PaymentMode', key: 'payment_mode' as SortKey },
                                        { label: 'Credit Amount', key: 'credit_amount' as SortKey },
                                    ].map(({ label, key }) => (
                                        <th key={key} onClick={() => toggleSort(key)}
                                            className="text-left px-4 py-3 text-xs font-semibold tracking-wider cursor-pointer whitespace-nowrap">
                                            <div className="flex items-center gap-1">{label}<SI k={key} /></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">No Matching Records Found</td></tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <tr key={row.id} className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="px-4 py-2.5 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                            <td className="px-4 py-2.5 text-slate-700 font-medium">{row.name}</td>
                                            <td className="px-4 py-2.5 text-slate-500 text-xs">{row.description || ''}</td>
                                            <td className="px-4 py-2.5 text-slate-600 text-xs whitespace-nowrap">{row.date}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{row.created_by}</td>
                                            <td className="px-4 py-2.5 text-slate-700">{row.payment_mode}</td>
                                            <td className="px-4 py-2.5 text-slate-800 font-semibold">{row.credit_amount}</td>
                                        </tr>
                                    ))
                                )}
                                {paginated.length > 0 && (
                                    <tr className="bg-slate-100 font-bold">
                                        <td colSpan={6} className="px-4 py-2.5"></td>
                                        <td className="px-4 py-2.5 text-slate-900">{total.toFixed(2)}</td>
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
