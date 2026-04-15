import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import {
    Search, CalendarDays, ChevronUp, ChevronDown, ChevronsUpDown,
    Download, FileDown, Printer, LayoutList, Columns,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment Management', href: '#' },
    { title: 'Payment Transaction Report', href: '/operations/payment-transaction-report' },
];

interface Transaction {
    id: number;
    payment_by: string;
    payment_to: string;
    po_number: string;
    ref_invoice_no: string;
    invoice_no: string;
    payment_date: string;
    payment_mode: string;
    paid_amount: number;
    remarks: string;
    location: string;
    supplier: string;
    payment_type: string;
}

type SortKey = keyof Transaction;
type SortDir = 'asc' | 'desc' | null;

// ── demo data (replace with Inertia props) ─────────────────────────────────
const DEMO: Transaction[] = [
    {
        id: 1, payment_by: 'Admin BilBerry', payment_to: 'Asha Vegetables',
        po_number: 'ORD0000132', ref_invoice_no: 'REF-001', invoice_no: 'INV-1001',
        payment_date: '2026-03-26', payment_mode: 'Bank Transfer', paid_amount: 315.00,
        remarks: '', location: 'Infocity', supplier: 'Asha Vegetables', payment_type: 'Supplier',
    },
    {
        id: 2, payment_by: 'Admin BilBerry', payment_to: 'FOOD SOLUTION GROCERY',
        po_number: 'ORD0000015', ref_invoice_no: 'REF-002', invoice_no: 'INV-1002',
        payment_date: '2026-03-27', payment_mode: 'Cheque', paid_amount: 95.00,
        remarks: '', location: 'Main Branch', supplier: 'FOOD SOLUTION GROCERY', payment_type: 'Supplier',
    },
    {
        id: 3, payment_by: 'Admin BilBerry', payment_to: 'FOOD SOLUTION GROCERY',
        po_number: 'ORD0000017', ref_invoice_no: 'REF-003', invoice_no: 'INV-1003',
        payment_date: '2026-03-27', payment_mode: 'Cash', paid_amount: 95.00,
        remarks: 'Urgent', location: 'Main Branch', supplier: 'FOOD SOLUTION GROCERY', payment_type: 'Customer',
    },
];

const fmt = (d: Date) => d.toISOString().split('T')[0];
const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

export default function PaymentTransactionReport() {
    // filters
    const [dateFrom, setDateFrom] = useState(fmt(thirtyDaysAgo));
    const [dateTo, setDateTo] = useState(fmt(today));
    const [locationFilter, setLocationFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [paymentTypeFilter, setPaymentTypeFilter] = useState('');
    const [applied, setApplied] = useState(true);

    // table
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('payment_date');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(1);

    const locations = Array.from(new Set(DEMO.map((r) => r.location)));
    const suppliers = Array.from(new Set(DEMO.map((r) => r.supplier)));
    const paymentTypes = Array.from(new Set(DEMO.map((r) => r.payment_type)));

    const data = useMemo(() => {
        if (!applied) return [];
        return DEMO.filter((r) => {
            if (locationFilter && r.location !== locationFilter) return false;
            if (supplierFilter && r.supplier !== supplierFilter) return false;
            if (paymentTypeFilter && r.payment_type !== paymentTypeFilter) return false;
            return true;
        });
    }, [applied, locationFilter, supplierFilter, paymentTypeFilter]);

    const filtered = useMemo(() => {
        if (!globalFilter) return data;
        const q = globalFilter.toLowerCase();
        return data.filter(
            (r) =>
                r.payment_by.toLowerCase().includes(q) ||
                r.payment_to.toLowerCase().includes(q) ||
                r.po_number.toLowerCase().includes(q) ||
                r.invoice_no.toLowerCase().includes(q) ||
                r.payment_mode.toLowerCase().includes(q),
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

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
        setSortDir((p) => (p === 'asc' ? 'desc' : p === 'desc' ? null : 'asc'));
    };

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ChevronsUpDown className="size-3 opacity-40" />;
        if (sortDir === 'asc') return <ChevronUp className="size-3" />;
        if (sortDir === 'desc') return <ChevronDown className="size-3" />;
        return <ChevronsUpDown className="size-3 opacity-40" />;
    };

    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const columns: { label: string; key: SortKey }[] = [
        { label: 'No', key: 'id' },
        { label: 'Payment By', key: 'payment_by' },
        { label: 'Payment To', key: 'payment_to' },
        { label: '#PO', key: 'po_number' },
        { label: 'Invoice Number', key: 'invoice_no' },
        { label: 'Payment Date', key: 'payment_date' },
        { label: 'Payment Mode', key: 'payment_mode' },
        { label: 'Paid Amount', key: 'paid_amount' },
        { label: 'Remarks', key: 'remarks' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Transaction Report" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">

                {/* heading */}
                <h1 className="text-xl font-bold text-slate-900">Payment Transaction Report</h1>

                {/* ── filter bar ─────────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                    {/* row 1: date + dropdowns + search */}
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
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="min-w-[160px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">None selected</option>
                                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        {/* supplier */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Supplier</label>
                            <select
                                value={supplierFilter}
                                onChange={(e) => setSupplierFilter(e.target.value)}
                                className="min-w-[160px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">None selected</option>
                                {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* payment type */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Payment Type</label>
                            <select
                                value={paymentTypeFilter}
                                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                                className="min-w-[160px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">None selected</option>
                                {paymentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
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

                    {/* row 2: inline search */}
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 w-fit">
                        <span className="text-xs text-slate-500">Search:</span>
                        <input
                            value={globalFilter}
                            onChange={(e) => { setGlobalFilter(e.target.value); setPage(1); }}
                            className="text-sm outline-none w-44 text-slate-700 placeholder:text-slate-300"
                            placeholder=""
                        />
                        <Search className="size-3.5 text-slate-300" />
                    </div>
                </div>

                {/* ── table card ─────────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* toolbar */}
                    <div className="flex items-center justify-end px-4 py-3 border-b border-slate-100 gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Copy"><LayoutList className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-green-600" title="Export Excel"><Download className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-red-500" title="Export PDF"><FileDown className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Print"><Printer className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500" title="Columns"><Columns className="size-4" /></button>
                        <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5">
                            <span className="text-xs text-slate-400">Show</span>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="text-sm outline-none text-slate-700 bg-transparent"
                            >
                                {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span className="text-xs text-slate-400">Entries</span>
                        </div>
                    </div>

                    {/* table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    {columns.map(({ label, key }) => (
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
                                        <td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">
                                            No Matching Records Found
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <tr
                                            key={row.id}
                                            className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                        >
                                            <td className="px-4 py-3 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                            <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">{row.payment_by}</td>
                                            <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.payment_to}</td>
                                            <td className="px-4 py-3 text-blue-600 font-mono text-xs hover:underline cursor-pointer">{row.po_number}</td>
                                            <td className="px-4 py-3">
                                                <div className="text-[11px] text-slate-400">Reference Invoice No: {row.ref_invoice_no || '—'}</div>
                                                <div className="text-[11px] text-slate-600">{row.invoice_no || '—'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{fmtDate(row.payment_date)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                    row.payment_mode === 'Cash'
                                                        ? 'bg-green-100 text-green-700'
                                                        : row.payment_mode === 'Cheque'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {row.payment_mode}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-800">
                                                ₹ {row.paid_amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">{row.remarks || '—'}</td>
                                        </tr>
                                    ))
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
