import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import {
    Search, CalendarDays, ChevronUp, ChevronDown, ChevronsUpDown,
    Download, FileDown, Printer, LayoutList, Columns, Check,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment Management', href: '#' },
    { title: 'Bulk Payment', href: '/operations/bulk-payment' },
];

interface BulkPaymentRow {
    id: number;
    franchise: string;
    supplier: string;
    po_number: string;
    ref_invoice_no: string;
    invoice_no: string;
    date: string;
    amount: number;
    location: string;
}

type SortKey = keyof BulkPaymentRow;
type SortDir = 'asc' | 'desc' | null;

// ── sample data (replace with Inertia props) ─────────────────────────────────
const DEMO: BulkPaymentRow[] = [
    { id: 1, franchise: 'BilBerry Product Unit - Infocity', supplier: 'Asha Vegetables', po_number: 'ORD0000132', ref_invoice_no: '', invoice_no: '', date: '2026-03-26', amount: 315.00, location: 'Infocity' },
    { id: 2, franchise: 'Dharmesh Enterprise', supplier: 'FOOD SOLUTION GROCERY', po_number: 'ORD0000015', ref_invoice_no: '', invoice_no: '', date: '2026-03-27', amount: 95.00, location: 'Main Branch' },
    { id: 3, franchise: 'Dharmesh Enterprise', supplier: 'FOOD SOLUTION GROCERY', po_number: 'ORD0000017', ref_invoice_no: '', invoice_no: '', date: '2026-03-27', amount: 95.00, location: 'Main Branch' },
];

const fmt = (d: Date) => d.toISOString().split('T')[0];
const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

export default function BulkPayment() {
    // ── filters ───────────────────────────────────────────────────────────────
    const [dateFrom, setDateFrom] = useState(fmt(thirtyDaysAgo));
    const [dateTo, setDateTo] = useState(fmt(today));
    const [locationFilter, setLocationFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [applied, setApplied] = useState(true); // show demo data by default

    // ── table ─────────────────────────────────────────────────────────────────
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const locations = Array.from(new Set(DEMO.map((r) => r.location)));
    const suppliers = Array.from(new Set(DEMO.map((r) => r.supplier)));

    const data = useMemo(() => {
        if (!applied) return [];
        return DEMO.filter((r) => {
            if (locationFilter && r.location !== locationFilter) return false;
            if (supplierFilter && r.supplier !== supplierFilter) return false;
            return true;
        });
    }, [applied, locationFilter, supplierFilter]);

    const filtered = useMemo(() => {
        if (!globalFilter) return data;
        const q = globalFilter.toLowerCase();
        return data.filter(
            (r) =>
                r.franchise.toLowerCase().includes(q) ||
                r.supplier.toLowerCase().includes(q) ||
                r.po_number.toLowerCase().includes(q),
        );
    }, [data, globalFilter]);

    const sorted = useMemo(() => {
        if (!sortDir) return filtered;
        return [...filtered].sort((a, b) => {
            const av = a[sortKey]; const bv = b[sortKey];
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

    const totalOrders = sorted.length;
    const totalPayable = sorted.reduce((s, r) => s + r.amount, 0);
    const selectedPayable = Array.from(selected).reduce((s, id) => {
        const row = sorted.find((r) => r.id === id);
        return s + (row?.amount ?? 0);
    }, 0);

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
        setSortDir((p) => (p === 'asc' ? 'desc' : p === 'desc' ? null : 'asc'));
    };

    const allSelected = paginated.length > 0 && paginated.every((r) => selected.has(r.id));
    const toggleAll = () => {
        if (allSelected) {
            setSelected((prev) => { const next = new Set(prev); paginated.forEach((r) => next.delete(r.id)); return next; });
        } else {
            setSelected((prev) => { const next = new Set(prev); paginated.forEach((r) => next.add(r.id)); return next; });
        }
    };
    const toggleRow = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ChevronsUpDown className="size-3 opacity-40" />;
        if (sortDir === 'asc') return <ChevronUp className="size-3" />;
        if (sortDir === 'desc') return <ChevronDown className="size-3" />;
        return <ChevronsUpDown className="size-3 opacity-40" />;
    };

    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const fmtCurrency = (v: number) =>
        '₹ ' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(v);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bulk Payment" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">

                {/* heading */}
                <h1 className="text-xl font-bold text-slate-900">Bulk Payment</h1>

                {/* ── filter bar ─────────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="flex flex-wrap items-end gap-4">

                        {/* date range */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Select Date Range:
                            </label>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-slate-400" />
                                <div className="flex items-center gap-1 bg-[#162a5b] text-white text-sm font-semibold rounded-lg px-3 py-2">
                                    <input
                                        type="date" value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white text-sm w-28"
                                    />
                                    <span className="mx-1">–</span>
                                    <input
                                        type="date" value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white text-sm w-28"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* location */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Location
                            </label>
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="min-w-[180px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">None selected</option>
                                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        {/* supplier */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">
                                Supplier
                            </label>
                            <select
                                value={supplierFilter}
                                onChange={(e) => setSupplierFilter(e.target.value)}
                                className="min-w-[180px] border border-orange-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option value="">None selected</option>
                                {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* search */}
                        <button
                            onClick={() => { setApplied(true); setPage(1); setSelected(new Set()); }}
                            className="flex items-center gap-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                        >
                            <Search className="size-4" />
                            SEARCH
                        </button>

                        {/* selected order payment */}
                        <button
                            disabled={selected.size === 0}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
                        >
                            SELECTED ORDER PAYMENT
                            {selected.size > 0 && (
                                <span className="ml-1 bg-white text-green-700 text-xs font-black rounded-full px-1.5 py-0.5">
                                    {fmtCurrency(selectedPayable)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── summary row ────────────────────────────────────────────── */}
                <div className="flex items-center gap-8 px-1 text-sm font-semibold text-slate-700">
                    <span>
                        Total No. Of Orders :{' '}
                        <span className="font-black text-slate-900">{totalOrders}</span>
                    </span>
                    <span>
                        Total Payable Amount :{' '}
                        <span className="font-black text-slate-900">{fmtCurrency(totalPayable)}</span>
                    </span>
                </div>

                {/* ── table card ─────────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
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
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Copy"><LayoutList className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-green-600" title="Export Excel"><Download className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-red-500" title="Export PDF"><FileDown className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Print"><Printer className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Columns"><Columns className="size-4" /></button>
                            <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5">
                                <span className="text-xs text-slate-400">Show:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                    className="text-sm outline-none text-slate-700 bg-transparent"
                                >
                                    {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    {/* select all */}
                                    <th className="px-4 py-3 w-12">
                                        <button
                                            onClick={toggleAll}
                                            className={`size-5 rounded flex items-center justify-center border-2 transition-colors ${
                                                allSelected
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-white/50 hover:border-white'
                                            }`}
                                        >
                                            {allSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                                            {!allSelected && <span className="text-[9px] font-bold text-white/80">All</span>}
                                        </button>
                                    </th>
                                    {[
                                        { label: 'No', key: 'id' as SortKey },
                                        { label: 'Franchise', key: 'franchise' as SortKey },
                                        { label: 'Supplier', key: 'supplier' as SortKey },
                                        { label: 'PO Number', key: 'po_number' as SortKey },
                                        { label: 'Invoice Number', key: 'invoice_no' as SortKey },
                                        { label: 'Date', key: 'date' as SortKey },
                                        { label: 'Amount', key: 'amount' as SortKey },
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
                                        <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                                            No Matching Records Found
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((row, i) => {
                                        const isSelected = selected.has(row.id);
                                        return (
                                            <tr
                                                key={row.id}
                                                onClick={() => toggleRow(row.id)}
                                                className={`border-b border-slate-100 cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'bg-green-50'
                                                        : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100'
                                                }`}
                                            >
                                                {/* checkbox */}
                                                <td className="px-4 py-3">
                                                    <div className={`size-5 rounded flex items-center justify-center border-2 transition-colors mx-auto ${
                                                        isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'
                                                    }`}>
                                                        {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                                <td className="px-4 py-3 text-blue-600 font-medium hover:underline">{row.franchise}</td>
                                                <td className="px-4 py-3 text-slate-700 font-medium">{row.supplier}</td>
                                                <td className="px-4 py-3 text-blue-600 hover:underline font-mono text-xs">{row.po_number}</td>
                                                <td className="px-4 py-3">
                                                    <div className="text-[11px] text-slate-400">Reference Invoice No: {row.ref_invoice_no || '—'}</div>
                                                    <div className="text-[11px] text-slate-400">Invoice No: {row.invoice_no || '—'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{fmtDate(row.date)}</td>
                                                <td className="px-4 py-3 text-right font-bold text-red-500">{row.amount.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* pagination */}
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
