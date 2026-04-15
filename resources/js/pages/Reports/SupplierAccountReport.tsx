import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import { Search, Copy, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'New Reports', href: '#' },
    { title: 'Supplier Account', href: '/reports/new/supplier-account' },
];

interface Row {
    id: number; date: string; supplier_name: string; description: string;
    created_by: string; credit: number; debit: number; balance: number;
}
type SortKey = keyof Row;
type SortDir = 'asc' | 'desc' | null;

const DEMO: Row[] = [
    { id: 1, date: '14-04-2026 02:54:25 PM', supplier_name: 'LOCAL SUPPLIER', description: '', created_by: 'Admin', credit: 0, debit: 11269, balance: 11269 },
    { id: 2, date: '14-04-2026 02:54:51 PM', supplier_name: 'LOCAL SUPPLIER', description: 'DN-000002', created_by: 'Admin', credit: 5635, debit: 0, balance: 5634 },
    { id: 3, date: '14-04-2026 02:56:39 PM', supplier_name: 'LOCAL SUPPLIER', description: '', created_by: 'Admin', credit: 5636, debit: 0, balance: -2 },
    { id: 4, date: '14-04-2026 03:03:13 PM', supplier_name: 'LOCAL SUPPLIER', description: '', created_by: 'Admin', credit: 2, debit: 0, balance: -4 },
    { id: 5, date: '14-04-2026 03:14:32 PM', supplier_name: 'LOCAL SUPPLIER', description: '', created_by: 'Admin', credit: 0, debit: 614, balance: 610 },
    { id: 6, date: '14-04-2026 03:14:54 PM', supplier_name: 'LOCAL SUPPLIER', description: 'DN-000003', created_by: 'Admin', credit: 307, debit: 0, balance: 303 },
];

const ACCOUNTS = Array.from(new Set(DEMO.map(r => r.supplier_name)));
const fmt = (d: Date) => d.toISOString().split('T')[0];
const today = new Date(); const ago = new Date(today); ago.setDate(today.getDate() - 30);

export default function SupplierAccountReport() {
    const [dateFrom, setDateFrom] = useState(fmt(ago));
    const [dateTo, setDateTo] = useState(fmt(today));
    const [accountFilter, setAccountFilter] = useState('LOCAL SUPPLIER');
    const [applied, setApplied] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pageSize, setPageSize] = useState(50);
    const [page, setPage] = useState(1);

    const data = useMemo(() => {
        if (!applied) return [];
        return DEMO.filter(r => !accountFilter || r.supplier_name === accountFilter);
    }, [applied, accountFilter]);

    const filtered = useMemo(() => {
        if (!globalFilter) return data;
        const q = globalFilter.toLowerCase();
        return data.filter(r => r.supplier_name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.created_by.toLowerCase().includes(q));
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

    const cols: { label: string; key: SortKey }[] = [
        { label: 'No', key: 'id' }, { label: 'Date', key: 'date' }, { label: 'Supplier Name', key: 'supplier_name' },
        { label: 'Description', key: 'description' }, { label: 'Created By', key: 'created_by' },
        { label: 'Credit', key: 'credit' }, { label: 'Debit', key: 'debit' }, { label: 'Balance', key: 'balance' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supplier Account" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-xl font-bold text-[#162a5b] border-b-2 border-[#162a5b] pb-1">Supplier Account</h1>
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
                            <span className="text-xs font-semibold text-slate-500">Account List:</span>
                            <div className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1 bg-white">
                                <select value={accountFilter} onChange={e => setAccountFilter(e.target.value)}
                                    className="text-xs outline-none min-w-[140px] bg-transparent">
                                    <option value="">None Selected</option>
                                    {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                {accountFilter && (
                                    <button onClick={() => setAccountFilter('')} className="text-slate-400 hover:text-slate-600 ml-1 text-xs">×</button>
                                )}
                            </div>
                        </div>
                        <button onClick={() => { setApplied(true); setPage(1); }}
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
                            <div className="flex items-center border border-slate-200 rounded px-2 py-1">
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
                                    {cols.map(({ label, key }) => (
                                        <th key={key} onClick={() => toggleSort(key)}
                                            className="text-left px-4 py-3 text-xs font-semibold tracking-wider cursor-pointer whitespace-nowrap">
                                            <div className="flex items-center gap-1">{label}<SI k={key} /></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-10 text-slate-400">No Matching Records Found</td></tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <tr key={row.id} className={`border-b border-slate-100 hover:bg-blue-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="px-4 py-2.5 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                            <td className="px-4 py-2.5 text-slate-600 text-xs whitespace-nowrap">{row.date}</td>
                                            <td className="px-4 py-2.5 text-slate-700 font-medium">{row.supplier_name}</td>
                                            <td className="px-4 py-2.5 text-slate-500 text-xs">{row.description || ''}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{row.created_by}</td>
                                            <td className="px-4 py-2.5 text-slate-700">{row.credit}</td>
                                            <td className="px-4 py-2.5 text-slate-700">{row.debit}</td>
                                            <td className={`px-4 py-2.5 font-semibold ${row.balance < 0 ? 'text-red-600' : 'text-slate-800'}`}>{row.balance}</td>
                                        </tr>
                                    ))
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
