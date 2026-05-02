import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import {
    Landmark, Plus, Trash2, X, Search, CalendarDays,
    IndianRupee, TrendingUp, ReceiptText, ChevronLeft, ChevronRight,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Payment Entry', href: '/sales/payment-entry' },
];

interface Customer { id: number; customer_name: string; }
interface Location  { id: number; location_legal_name: string; }
interface Invoice   { id: number; invoice_number: string; customer_id: number; grand_total: number; invoice_date: string; }
interface Payment {
    id: number; payment_number: string; payment_date: string;
    customer_id: number; sales_invoice_id: number | null; location_id: number | null;
    amount: string; payment_method: string; reference_number: string | null; notes: string | null; status: string;
    customer?: Customer; sales_invoice?: Invoice; location?: Location;
}
interface PaginatedPayments {
    data: Payment[]; current_page: number; last_page: number;
    from: number; to: number; total: number;
}

interface Props {
    payments: PaginatedPayments;
    customers: Customer[];
    locations: Location[];
    invoices: Invoice[];
    filters: Record<string, string>;
    summary: { total_collected: number; this_month: number; total_records: number; };
}

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Cheque', 'UPI', 'NEFT', 'RTGS', 'Card'];

const fmt = (d: Date) => d.toISOString().split('T')[0];
const fmtCurrency = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);
const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function SalesPaymentEntry({ payments, customers, locations, invoices, filters, summary }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [customerFilter, setCustomerFilter] = useState(filters.customer_id ?? '');

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_date:     fmt(new Date()),
        customer_id:      '',
        sales_invoice_id: '',
        location_id:      '',
        amount:           '',
        payment_method:   'Cash',
        reference_number: '',
        notes:            '',
    });

    const applyFilters = () => {
        router.get('/sales/payment-entry', {
            date_from:   dateFrom || undefined,
            date_to:     dateTo   || undefined,
            customer_id: customerFilter || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales/payment-entry', {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    const handleDelete = (id: number, num: string) => {
        if (!confirm(`Delete payment ${num}? This cannot be undone.`)) return;
        router.delete(`/sales/payment-entry/${id}`, { preserveScroll: true });
    };

    // filter invoices by selected customer
    const filteredInvoices = data.customer_id
        ? invoices.filter(i => i.customer_id === Number(data.customer_id))
        : invoices;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Payment Entry" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">

                {/* ── header ── */}
                <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Landmark className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-[#162a5b] tracking-tighter uppercase italic">Customer Payments</h1>
                            <p className="text-sm text-slate-500">Capture incoming funds and settle invoices.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus className="size-4" /> RECORD RECEIPT
                    </button>
                </div>

                {/* ── summary cards ── */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total Collected', value: fmtCurrency(summary.total_collected), icon: IndianRupee, color: 'text-green-600 bg-green-50' },
                        { label: 'This Month',      value: fmtCurrency(summary.this_month),      icon: TrendingUp,  color: 'text-blue-600 bg-blue-50'  },
                        { label: 'Total Records',   value: summary.total_records.toString(),       icon: ReceiptText, color: 'text-purple-600 bg-purple-50' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                            <div className={`size-10 rounded-xl flex items-center justify-center ${color}`}>
                                <Icon className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                                <p className="text-lg font-black text-slate-900">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── filters ── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date Range</label>
                            <div className="flex items-center gap-1 bg-[#162a5b] text-white text-sm font-semibold rounded-lg px-3 py-2">
                                <CalendarDays className="size-4 mr-1 opacity-70" />
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white text-sm w-28" />
                                <span className="mx-1">–</span>
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white text-sm w-28" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Customer</label>
                            <select value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}
                                className="min-w-[180px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Customers</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
                            </select>
                        </div>
                        <button onClick={applyFilters}
                            className="flex items-center gap-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                            <Search className="size-4" /> SEARCH
                        </button>
                        {(dateFrom || dateTo || customerFilter) && (
                            <button onClick={() => { setDateFrom(''); setDateTo(''); setCustomerFilter(''); router.get('/sales/payment-entry'); }}
                                className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <X className="size-4" /> CLEAR
                            </button>
                        )}
                    </div>
                </div>

                {/* ── table ── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    {['#', 'Receipt No', 'Date', 'Customer', 'Invoice', 'Amount', 'Method', 'Reference', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 font-semibold text-xs tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data.length === 0 ? (
                                    <tr><td colSpan={10} className="text-center py-16 text-slate-400">
                                        <IndianRupee className="size-12 mx-auto mb-3 opacity-20" />
                                        <p className="font-semibold text-sm">No payment records found.</p>
                                        <p className="text-xs mt-1">Click "Record Receipt" to add one.</p>
                                    </td></tr>
                                ) : payments.data.map((p, i) => (
                                    <tr key={p.id} className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                                        <td className="px-4 py-3 text-slate-400 text-xs">{(payments.from || 0) + i}</td>
                                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{p.payment_number}</td>
                                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmtDate(p.payment_date)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{p.customer?.customer_name ?? '—'}</td>
                                        <td className="px-4 py-3 text-slate-600 text-xs font-mono">{p.sales_invoice?.invoice_number ?? '—'}</td>
                                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{fmtCurrency(Number(p.amount))}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.payment_method === 'Cash' ? 'bg-green-100 text-green-700' : p.payment_method === 'Cheque' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {p.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{p.reference_number ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{p.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleDelete(p.id, p.payment_number)}
                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* pagination */}
                    {payments.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
                            <span>Showing {payments.from}–{payments.to} of {payments.total} entries</span>
                            <div className="flex items-center gap-1">
                                <button disabled={payments.current_page === 1}
                                    onClick={() => router.get('/sales/payment-entry', { ...filters, page: payments.current_page - 1 })}
                                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                                {Array.from({ length: payments.last_page }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => router.get('/sales/payment-entry', { ...filters, page: p })}
                                        className={`size-7 rounded text-xs font-semibold ${p === payments.current_page ? 'bg-[#162a5b] text-white' : 'border border-slate-200 hover:bg-slate-50'}`}>{p}</button>
                                ))}
                                <button disabled={payments.current_page === payments.last_page}
                                    onClick={() => router.get('/sales/payment-entry', { ...filters, page: payments.current_page + 1 })}
                                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="size-4" /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── NEW PAYMENT MODAL ── */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-black text-[#162a5b] uppercase italic tracking-tight">Record Customer Receipt</h2>
                                <p className="text-sm text-slate-500">Log a new incoming payment from customer.</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X className="size-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Date *</label>
                                    <input type="date" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.payment_date && <p className="text-red-500 text-xs mt-1">{errors.payment_date}</p>}
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
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Customer *</label>
                                <select value={data.customer_id} onChange={e => { setData('customer_id', e.target.value); setData('sales_invoice_id', ''); }}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select customer...</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
                                </select>
                                {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice (optional)</label>
                                    <select value={data.sales_invoice_id} onChange={e => setData('sales_invoice_id', e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">No invoice linked</option>
                                        {filteredInvoices.map(inv => (
                                            <option key={inv.id} value={inv.id}>{inv.invoice_number} — ₹{Number(inv.grand_total).toLocaleString('en-IN')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location (optional)</label>
                                    <select value={data.location_id} onChange={e => setData('location_id', e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select location...</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.location_legal_name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount (₹) *</label>
                                    <input type="number" step="0.01" min="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reference / Cheque No</label>
                                    <input type="text" value={data.reference_number} onChange={e => setData('reference_number', e.target.value)}
                                        placeholder="Optional"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes</label>
                                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)}
                                    rows={2} placeholder="Optional remarks..."
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing}
                                    className="px-6 py-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
                                    {processing ? 'Saving…' : 'Save Receipt'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
