import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import {
    Search, CalendarDays, ChevronUp, ChevronDown, ChevronsUpDown,
    Download, FileDown, Printer, LayoutList, Columns, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment Management', href: '#' },
    { title: 'Payment Transaction Report', href: '/operations/payment-transaction-report' },
];

interface Supplier { id: number; supplier_name: string; }
interface Location  { id: number; location_legal_name: string; }

interface Transaction {
    id: string; payment_by: string; payment_to: string;
    po_number: string; ref_invoice_no: string; invoice_no: string;
    payment_date: string; payment_mode: string; paid_amount: number;
    remarks: string; location: string; payment_type: 'Supplier' | 'Customer';
    payment_number: string; supplier: string;
}

interface Props {
    transactions: Transaction[];
    suppliers: Supplier[];
    locations: Location[];
    filters: Record<string, string>;
    summary: { total_supplier_paid: number; total_customer_received: number; };
}

type SortKey = keyof Transaction;
type SortDir = 'asc' | 'desc' | null;

const fmt = (d: Date) => d.toISOString().split('T')[0];
const today = new Date();
const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(today.getDate() - 30);

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtCurrency = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

export default function PaymentTransactionReport({ transactions, suppliers, locations, filters, summary }: Props) {
    const [dateFrom, setDateFrom]           = useState(filters.date_from ?? fmt(thirtyDaysAgo));
    const [dateTo, setDateTo]               = useState(filters.date_to   ?? fmt(today));
    const [locationFilter, setLocationFilter] = useState(filters.location_id ?? '');
    const [supplierFilter, setSupplierFilter] = useState(filters.supplier_id ?? '');
    const [paymentTypeFilter, setPaymentTypeFilter] = useState(filters.payment_type ?? '');
    const [globalFilter, setGlobalFilter]   = useState('');
    const [sortKey, setSortKey]             = useState<SortKey>('payment_date');
    const [sortDir, setSortDir]             = useState<SortDir>('asc');
    const [pageSize, setPageSize]           = useState(25);
    const [page, setPage]                   = useState(1);

    const applyFilters = () => {
        router.get('/operations/payment-transaction-report', {
            date_from:    dateFrom         || undefined,
            date_to:      dateTo           || undefined,
            location_id:  locationFilter   || undefined,
            supplier_id:  supplierFilter   || undefined,
            payment_type: paymentTypeFilter || undefined,
        }, { preserveState: true, replace: true });
    };

    const filtered = useMemo(() => {
        if (!globalFilter) return transactions;
        const q = globalFilter.toLowerCase();
        return transactions.filter(r =>
            r.payment_by.toLowerCase().includes(q)   ||
            r.payment_to.toLowerCase().includes(q)   ||
            r.po_number.toLowerCase().includes(q)    ||
            r.invoice_no.toLowerCase().includes(q)   ||
            r.payment_mode.toLowerCase().includes(q) ||
            r.payment_number.toLowerCase().includes(q),
        );
    }, [transactions, globalFilter]);

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

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
        setSortDir(p => p === 'asc' ? 'desc' : p === 'desc' ? null : 'asc');
    };

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ChevronsUpDown className="size-3 opacity-40" />;
        if (sortDir === 'asc') return <ChevronUp className="size-3" />;
        if (sortDir === 'desc') return <ChevronDown className="size-3" />;
        return <ChevronsUpDown className="size-3 opacity-40" />;
    };

    const columns: { label: string; key: SortKey }[] = [
        { label: 'No',           key: 'id'             },
        { label: 'Payment #',    key: 'payment_number' },
        { label: 'Payment By',   key: 'payment_by'     },
        { label: 'Payment To',   key: 'payment_to'     },
        { label: '#PO / Invoice',key: 'po_number'      },
        { label: 'Date',         key: 'payment_date'   },
        { label: 'Mode',         key: 'payment_mode'   },
        { label: 'Type',         key: 'payment_type'   },
        { label: 'Amount',       key: 'paid_amount'    },
        { label: 'Remarks',      key: 'remarks'        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Transaction Report" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">
                <h1 className="text-xl font-bold text-slate-900">Payment Transaction Report</h1>

                {/* ── summary ── */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total Paid to Suppliers',  value: fmtCurrency(summary.total_supplier_paid),    icon: ArrowUpRight,   color: 'text-red-600 bg-red-50'    },
                        { label: 'Total Received from Customers', value: fmtCurrency(summary.total_customer_received), icon: ArrowDownRight, color: 'text-green-600 bg-green-50' },
                        { label: 'Net Balance', value: fmtCurrency(summary.total_customer_received - summary.total_supplier_paid), icon: ArrowDownRight, color: summary.total_customer_received >= summary.total_supplier_paid ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                            <div className={`size-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="size-5" /></div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                                <p className="text-base font-black text-slate-900">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── filter bar ── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
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
                                className="min-w-[160px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Locations</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.location_legal_name}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Payment Type</label>
                            <select value={paymentTypeFilter} onChange={e => setPaymentTypeFilter(e.target.value)}
                                className="min-w-[160px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Types</option>
                                <option value="Supplier">Supplier</option>
                                <option value="Customer">Customer</option>
                            </select>
                        </div>

                        <button onClick={applyFilters}
                            className="flex items-center gap-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                            <Search className="size-4" /> SEARCH
                        </button>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 w-fit">
                        <span className="text-xs text-slate-500">Search:</span>
                        <input value={globalFilter} onChange={e => { setGlobalFilter(e.target.value); setPage(1); }}
                            className="text-sm outline-none w-44 text-slate-700 placeholder:text-slate-300" placeholder="Filter table…" />
                        <Search className="size-3.5 text-slate-300" />
                    </div>
                </div>

                {/* ── table ── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-end px-4 py-3 border-b border-slate-100 gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"><LayoutList className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-green-600"><Download className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-red-500"><FileDown className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"><Printer className="size-4" /></button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"><Columns className="size-4" /></button>
                        <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5">
                            <span className="text-xs text-slate-400">Show</span>
                            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="text-sm outline-none text-slate-700 bg-transparent">
                                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span className="text-xs text-slate-400">Entries</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    {columns.map(({ label, key }) => (
                                        <th key={key} onClick={() => toggleSort(key)}
                                            className="text-left px-4 py-3 font-semibold text-xs tracking-wider cursor-pointer select-none whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">{label}<SortIcon k={key} /></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">No Matching Records Found</td></tr>
                                ) : paginated.map((row, i) => (
                                    <tr key={row.id} className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{row.payment_number}</td>
                                        <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">{row.payment_by}</td>
                                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.payment_to}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-blue-600 font-mono text-xs">{row.po_number}</div>
                                            {row.ref_invoice_no && <div className="text-[11px] text-slate-400">Ref: {row.ref_invoice_no}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{fmtDate(row.payment_date)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.payment_mode === 'Cash' ? 'bg-green-100 text-green-700' : row.payment_mode === 'Cheque' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {row.payment_mode}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.payment_type === 'Supplier' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {row.payment_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-800">₹ {row.paid_amount.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{row.remarks || '—'}</td>
                                    </tr>
                                ))}
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
        </AppLayout>
    );
}
