import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import {
    Search, CalendarDays, ChevronUp, ChevronDown, ChevronsUpDown,
    Download, FileDown, Printer, LayoutList, Columns, Check, X,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment Management', href: '#' },
    { title: 'Bulk Payment', href: '/operations/bulk-payment' },
];

interface Supplier { id: number; supplier_name: string; }
interface Location  { id: number; location_legal_name: string; }
interface OrderRow {
    id: number; franchise: string; supplier: string;
    po_number: string; ref_invoice_no: string; invoice_no: string;
    date: string; amount: number; paid_amount: number; balance: number;
    location: string; location_id: number; supplier_id: number; status: string;
}

interface Props {
    orders: OrderRow[];
    suppliers: Supplier[];
    locations: Location[];
    filters: Record<string, string>;
}

type SortKey = keyof OrderRow;
type SortDir = 'asc' | 'desc' | null;

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtCurrency = (v: number) =>
    '₹ ' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(v);
const fmt = (d: Date) => d.toISOString().split('T')[0];
const today = new Date();
const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(today.getDate() - 30);

export default function BulkPayment({ orders, suppliers, locations, filters }: Props) {
    const [dateFrom, setDateFrom]         = useState(filters.date_from ?? fmt(thirtyDaysAgo));
    const [dateTo, setDateTo]             = useState(filters.date_to   ?? fmt(today));
    const [locationFilter, setLocationFilter] = useState(filters.location_id ?? '');
    const [supplierFilter, setSupplierFilter] = useState(filters.supplier_id ?? '');
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey]           = useState<SortKey>('date');
    const [sortDir, setSortDir]           = useState<SortDir>('asc');
    const [pageSize, setPageSize]         = useState(25);
    const [page, setPage]                 = useState(1);
    const [selected, setSelected]         = useState<Set<number>>(new Set());
    const [showPayModal, setShowPayModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        payment_date:    fmt(today),
        payment_method:  'Bank Transfer',
        reference_number:'',
        notes:           '',
        order_ids:       [] as number[],
    });

    const applyFilters = () => {
        router.get('/operations/bulk-payment', {
            date_from:   dateFrom || undefined,
            date_to:     dateTo   || undefined,
            location_id: locationFilter || undefined,
            supplier_id: supplierFilter || undefined,
        }, { preserveState: true, replace: true });
        setSelected(new Set());
    };

    const filtered = useMemo(() => {
        if (!globalFilter) return orders;
        const q = globalFilter.toLowerCase();
        return orders.filter(r =>
            r.franchise.toLowerCase().includes(q) ||
            r.supplier.toLowerCase().includes(q)  ||
            r.po_number.toLowerCase().includes(q),
        );
    }, [orders, globalFilter]);

    const sorted = useMemo(() => {
        if (!sortDir) return filtered;
        return [...filtered].sort((a, b) => {
            const av = a[sortKey]; const bv = b[sortKey];
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated  = sorted.slice((page - 1) * pageSize, page * pageSize);

    const totalOrders  = sorted.length;
    const totalPayable = sorted.reduce((s, r) => s + r.balance, 0);
    const selectedPayable = Array.from(selected).reduce((s, id) => {
        const row = sorted.find(r => r.id === id);
        return s + (row?.balance ?? 0);
    }, 0);

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
        setSortDir(p => p === 'asc' ? 'desc' : p === 'desc' ? null : 'asc');
    };

    const allSelected = paginated.length > 0 && paginated.every(r => selected.has(r.id));
    const toggleAll   = () => {
        if (allSelected) setSelected(prev => { const n = new Set(prev); paginated.forEach(r => n.delete(r.id)); return n; });
        else             setSelected(prev => { const n = new Set(prev); paginated.forEach(r => n.add(r.id)); return n; });
    };
    const toggleRow = (id: number) => setSelected(prev => {
        const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
    });

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ChevronsUpDown className="size-3 opacity-40" />;
        if (sortDir === 'asc') return <ChevronUp className="size-3" />;
        if (sortDir === 'desc') return <ChevronDown className="size-3" />;
        return <ChevronsUpDown className="size-3 opacity-40" />;
    };

    const openPayModal = () => {
        setData('order_ids', Array.from(selected));
        setShowPayModal(true);
    };

    const handleBulkPay = (e: React.FormEvent) => {
        e.preventDefault();
        post('/operations/bulk-payment', {
            onSuccess: () => { reset(); setShowPayModal(false); setSelected(new Set()); },
        });
    };

    const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Cheque', 'UPI', 'NEFT', 'RTGS'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bulk Payment" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">
                <h1 className="text-xl font-bold text-slate-900">Bulk Payment</h1>

                {/* ── filter bar ── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date Range:</label>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-slate-400" />
                                <div className="flex items-center gap-1 bg-[#162a5b] text-white text-sm font-semibold rounded-lg px-3 py-2">
                                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white text-sm w-28" />
                                    <span className="mx-1">–</span>
                                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white text-sm w-28" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                                className="min-w-[180px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Locations</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.location_legal_name}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">Supplier</label>
                            <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}
                                className="min-w-[180px] border border-orange-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                                <option value="">All Suppliers</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
                            </select>
                        </div>

                        <button onClick={applyFilters}
                            className="flex items-center gap-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                            <Search className="size-4" /> SEARCH
                        </button>

                        <button disabled={selected.size === 0} onClick={openPayModal}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors">
                            SELECTED ORDER PAYMENT
                            {selected.size > 0 && (
                                <span className="ml-1 bg-white text-green-700 text-xs font-black rounded-full px-1.5 py-0.5">
                                    {fmtCurrency(selectedPayable)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── summary ── */}
                <div className="flex items-center gap-8 px-1 text-sm font-semibold text-slate-700">
                    <span>Total Orders: <span className="font-black text-slate-900">{totalOrders}</span></span>
                    <span>Total Outstanding: <span className="font-black text-slate-900">{fmtCurrency(totalPayable)}</span></span>
                    {selected.size > 0 && (
                        <span className="text-green-700">Selected ({selected.size}): <span className="font-black">{fmtCurrency(selectedPayable)}</span></span>
                    )}
                </div>

                {/* ── table ── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-slate-400">Filter:</span>
                            <input value={globalFilter} onChange={e => { setGlobalFilter(e.target.value); setPage(1); }}
                                placeholder="Type to filter..." className="text-sm outline-none w-40 text-slate-700 placeholder:text-slate-300" />
                            <Search className="size-3.5 text-slate-300" />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"><LayoutList className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-green-600"><Download className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-red-500"><FileDown className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"><Printer className="size-4" /></button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"><Columns className="size-4" /></button>
                            <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5">
                                <span className="text-xs text-slate-400">Show:</span>
                                <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                                    className="text-sm outline-none text-slate-700 bg-transparent">
                                    {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    <th className="px-4 py-3 w-12">
                                        <button onClick={toggleAll}
                                            className={`size-5 rounded flex items-center justify-center border-2 transition-colors ${allSelected ? 'bg-green-500 border-green-500' : 'border-white/50 hover:border-white'}`}>
                                            {allSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                                            {!allSelected && <span className="text-[9px] font-bold text-white/80">All</span>}
                                        </button>
                                    </th>
                                    {[
                                        { label: 'No',         key: 'id'         as SortKey },
                                        { label: 'Franchise',  key: 'franchise'  as SortKey },
                                        { label: 'Supplier',   key: 'supplier'   as SortKey },
                                        { label: 'PO Number',  key: 'po_number'  as SortKey },
                                        { label: 'Invoice',    key: 'invoice_no' as SortKey },
                                        { label: 'Date',       key: 'date'       as SortKey },
                                        { label: 'PO Amount',  key: 'amount'     as SortKey },
                                        { label: 'Paid',       key: 'paid_amount'as SortKey },
                                        { label: 'Balance',    key: 'balance'    as SortKey },
                                    ].map(({ label, key }) => (
                                        <th key={key} onClick={() => toggleSort(key)}
                                            className="text-left px-4 py-3 font-semibold text-xs tracking-wider cursor-pointer select-none whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">{label}<SortIcon k={key} /></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={10} className="text-center py-12 text-slate-400 text-sm">No Matching Records Found</td></tr>
                                ) : paginated.map((row, i) => {
                                    const isSelected = selected.has(row.id);
                                    return (
                                        <tr key={row.id} onClick={() => toggleRow(row.id)}
                                            className={`border-b border-slate-100 cursor-pointer transition-colors ${isSelected ? 'bg-green-50' : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100'}`}>
                                            <td className="px-4 py-3">
                                                <div className={`size-5 rounded flex items-center justify-center border-2 transition-colors mx-auto ${isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                                    {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                            <td className="px-4 py-3 text-blue-600 font-medium">{row.franchise}</td>
                                            <td className="px-4 py-3 text-slate-700 font-medium">{row.supplier}</td>
                                            <td className="px-4 py-3 text-blue-600 font-mono text-xs">{row.po_number}</td>
                                            <td className="px-4 py-3">
                                                <div className="text-[11px] text-slate-400">Ref: {row.ref_invoice_no || '—'}</div>
                                                <div className="text-[11px] text-slate-400">{row.invoice_no || '—'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{fmtDate(row.date)}</td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-700">{row.amount.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-bold text-green-600">{row.paid_amount.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-bold text-red-500">{row.balance.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
                        <span>Showing {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, sorted.length)} of {sorted.length} Entries</span>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`size-7 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-[#162a5b] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{p}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BULK PAY MODAL ── */}
            {showPayModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-black text-[#162a5b] uppercase italic">Bulk Payment</h2>
                                <p className="text-sm text-slate-500">{selected.size} order(s) — {fmtCurrency(selectedPayable)} total</p>
                            </div>
                            <button onClick={() => setShowPayModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X className="size-5" /></button>
                        </div>
                        <form onSubmit={handleBulkPay} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Date *</label>
                                    <input type="date" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Method *</label>
                                    <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reference No</label>
                                <input type="text" value={data.reference_number} onChange={e => setData('reference_number', e.target.value)}
                                    placeholder="Optional"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes</label>
                                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)}
                                    rows={2} placeholder="Optional..."
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowPayModal(false)}
                                    className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={processing}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
                                    {processing ? 'Processing…' : `Pay ${selected.size} Orders`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
