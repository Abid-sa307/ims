import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import { Search, Copy, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'New Reports', href: '#' },
    { title: 'Creditors Report', href: '/reports/new/creditors-report' },
];

interface Row { id: number; creditor: string; amount: number; }
type SortKey = keyof Row;
type SortDir = 'asc' | 'desc' | null;

const DEMO: Row[] = [
    { id: 1, creditor: 'LOCAL SUPPLIER', amount: 303 },
];

const CREDITORS = Array.from(new Set(DEMO.map(r => r.creditor)));

export default function CreditorsReport() {
    const [creditorFilter, setCreditorFilter] = useState('');
    const [applied, setApplied] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pageSize, setPageSize] = useState(50);
    const [page, setPage] = useState(1);

    const data = useMemo(() => {
        if (!applied) return [];
        return DEMO.filter(r => !creditorFilter || r.creditor === creditorFilter);
    }, [applied, creditorFilter]);

    const filtered = useMemo(() => {
        if (!globalFilter) return data;
        const q = globalFilter.toLowerCase();
        return data.filter(r => r.creditor.toLowerCase().includes(q));
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Creditors Report" />
            <div className="flex flex-col gap-4 p-6 bg-slate-50 min-h-full">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-xl font-bold text-[#162a5b] border-b-2 border-[#162a5b] pb-1">Creditors Report</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500">Creditors:</span>
                        <select value={creditorFilter} onChange={e => setCreditorFilter(e.target.value)}
                            className="border border-slate-300 rounded px-2 py-1.5 text-sm min-w-[140px] bg-white">
                            <option value="">None Selected</option>
                            {CREDITORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
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
                                    {[{ label: 'No.', key: 'id' as SortKey }, { label: 'Creditor', key: 'creditor' as SortKey }, { label: 'Amount', key: 'amount' as SortKey }].map(({ label, key }) => (
                                        <th key={key} onClick={() => toggleSort(key)}
                                            className="text-left px-4 py-3 text-xs font-semibold tracking-wider cursor-pointer whitespace-nowrap">
                                            <div className="flex items-center gap-1">{label}<SI k={key} /></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-10 text-slate-400">No Matching Records Found</td></tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <tr key={row.id} className={`border-b border-slate-100 hover:bg-blue-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="px-4 py-2.5 text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</td>
                                            <td className="px-4 py-2.5 text-slate-700 font-medium">{row.creditor}</td>
                                            <td className="px-4 py-2.5 text-slate-700 font-semibold">{row.amount}</td>
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
