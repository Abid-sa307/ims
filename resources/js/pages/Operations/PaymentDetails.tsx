import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import { Search, CalendarDays, ChevronUp, ChevronDown, ChevronsUpDown, Download, FileDown, Printer, LayoutList } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment Management', href: '#' },
    { title: 'Payment Details', href: '/operations/payment-details' },
];

interface PaymentDetail {
    id: number;
    date: string;
    manufacturing_unit: string;
    total_purchase: number;
    total_sales: number;
}

type SortKey = keyof PaymentDetail;
type SortDir = 'asc' | 'desc' | null;

// ── demo data – replace with real Inertia props ──────────────────────────────
const DEMO_DATA: PaymentDetail[] = [];

export default function PaymentDetails() {
    // ── filters ──────────────────────────────────────────────────────────────
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    const [dateFrom, setDateFrom] = useState(fmt(thirtyDaysAgo));
    const [dateTo, setDateTo] = useState(fmt(today));
    const [unitFilter, setUnitFilter] = useState('');
    const [applied, setApplied] = useState(false);

    // ── table state ───────────────────────────────────────────────────────────
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(1);

    const data: PaymentDetail[] = DEMO_DATA.filter((r) => {
        if (!applied) return false;
        if (unitFilter && r.manufacturing_unit !== unitFilter) return false;
        return true;
    });

    const filtered = useMemo(() => {
        if (!globalFilter) return data;
        const q = globalFilter.toLowerCase();
        return data.filter(
            (r) =>
                r.manufacturing_unit.toLowerCase().includes(q) ||
                r.date.includes(q),
        );
    }, [data, globalFilter]);

    const sorted = useMemo(() => {
        if (!sortDir) return filtered;
        return [...filtered].sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
        setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
    };

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ChevronsUpDown className="size-3 opacity-40" />;
        if (sortDir === 'asc') return <ChevronUp className="size-3" />;
        if (sortDir === 'desc') return <ChevronDown className="size-3" />;
        return <ChevronsUpDown className="size-3 opacity-40" />;
    };

    const fmtDisplay = (d: string) => {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase();
    };

    const fmtCurrency = (v: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

    // ── unique manufacturing units (for dropdown) ─────────────────────────────
    const units = Array.from(new Set(DEMO_DATA.map((r) => r.manufacturing_unit)));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Details" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">

                {/* ── page heading ─────────────────────────────────────────── */}
                <h1 className="text-xl font-bold text-slate-900">Payment Details</h1>

                {/* ── filter bar ───────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="flex flex-wrap items-end gap-4">

                        {/* date range */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Select Date Range:
                            </label>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-slate-400" />
                                <div className="flex items-center gap-1 bg-[#162a5b] text-white text-sm font-semibold rounded-lg px-3 py-2 select-none">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white text-sm w-28"
                                    />
                                    <span className="mx-1">–</span>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white text-sm w-28"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* manufacturing unit */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Manufacturing Unit
                            </label>
                            <select
                                value={unitFilter}
                                onChange={(e) => setUnitFilter(e.target.value)}
                                className="min-w-[180px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">None selected</option>
                                {units.map((u) => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>

                        {/* search button */}
                        <button
                            onClick={() => { setApplied(true); setPage(1); }}
                            className="flex items-center gap-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                        >
                            <Search className="size-4" />
                            SEARCH
                        </button>
                    </div>
                </div>

                {/* ── table card ───────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* table toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        {/* global filter */}
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-slate-400">Filter:</span>
                            <input
                                value={globalFilter}
                                onChange={(e) => { setGlobalFilter(e.target.value); setPage(1); }}
                                placeholder="Type to filter..."
                                className="text-sm outline-none w-40 text-slate-700 placeholder:text-slate-300"
                            />
                            <Search className="size-3.5 text-slate-300" />
                        </div>

                        {/* right actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Copy"><LayoutList className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-green-600" title="Export Excel"><Download className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-red-500" title="Export PDF"><FileDown className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Print"><Printer className="size-4" /></button>
                            <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5">
                                <span className="text-xs text-slate-400">Show:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                    className="text-sm outline-none text-slate-700 bg-transparent"
                                >
                                    {[10, 25, 50, 100].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    {[
                                        { label: 'No', key: 'id' as SortKey },
                                        { label: 'Date', key: 'date' as SortKey },
                                        { label: 'Manufacturing Unit', key: 'manufacturing_unit' as SortKey },
                                        { label: 'Total Purchase', key: 'total_purchase' as SortKey },
                                        { label: 'Total Sales', key: 'total_sales' as SortKey },
                                    ].map(({ label, key }) => (
                                        <th
                                            key={key}
                                            onClick={() => toggleSort(key)}
                                            className="text-left px-4 py-3 font-semibold text-xs tracking-wider cursor-pointer select-none whitespace-nowrap"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {label}
                                                <SortIcon k={key} />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                                            No Matching Records Found
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <tr
                                            key={row.id}
                                            className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-700">{(page - 1) * pageSize + i + 1}</td>
                                            <td className="px-4 py-3 text-slate-600">{fmtDisplay(row.date)}</td>
                                            <td className="px-4 py-3 text-slate-700 font-medium">{row.manufacturing_unit}</td>
                                            <td className="px-4 py-3 text-slate-700">{fmtCurrency(row.total_purchase)}</td>
                                            <td className="px-4 py-3 text-slate-700">{fmtCurrency(row.total_sales)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* pagination footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
                        <span>
                            Showing {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
                            {Math.min(page * pageSize, sorted.length)} of {sorted.length} Entries
                        </span>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`size-7 rounded-lg text-xs font-semibold transition-colors ${
                                        p === page
                                            ? 'bg-[#162a5b] text-white'
                                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
