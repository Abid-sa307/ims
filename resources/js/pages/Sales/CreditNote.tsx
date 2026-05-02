import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Receipt, Search, PlusCircle, FileText, Printer, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Credit Note', href: '/sales/credit-note' },
];

interface Props {
    creditNotes: {
        data: any[];
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
    };
}

export default function CreditNote({ creditNotes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/sales/credit-note', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Credit Notes" />
            <div className="flex h-full flex-col p-6 bg-gray-50/30 min-h-screen gap-6">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-t-2 border-t-[#162a5b] bg-white p-6 shadow-sm rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-100">
                            <Receipt className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Credit Notes</h1>
                            <p className="text-sm text-gray-500 font-medium">Manage post-sales adjustments and customer returns.</p>
                        </div>
                    </div>
                    <Link href="/sales/credit-note/create">
                        <Button className="h-10 bg-red-600 hover:bg-red-700 gap-2 font-bold uppercase tracking-wider shadow-lg shadow-red-100">
                            <PlusCircle className="size-4" /> Issue Credit Note
                        </Button>
                    </Link>
                </div>

                {/* Filter Section */}
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input 
                                    className="pl-9 h-11 border-gray-200 text-sm focus-visible:ring-red-500" 
                                    placeholder="Search by Credit Note Number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch} variant="outline" className="h-11 px-8 font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-50 transition-all">
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="border shadow-sm bg-white overflow-hidden rounded-xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-gray-600 font-bold text-[11px] uppercase tracking-widest border-b">
                                    <tr>
                                        <th className="px-8 py-5">Note #</th>
                                        <th className="px-8 py-5">Customer</th>
                                        <th className="px-8 py-5">Location</th>
                                        <th className="px-8 py-5 text-right">Grand Total</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {creditNotes.data.length > 0 ? (
                                        creditNotes.data.map((note) => (
                                            <tr key={note.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="font-extrabold text-red-600 group-hover:underline cursor-pointer transition-all uppercase tracking-tighter">{note.credit_note_number}</div>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-gray-700">{note.customer?.customer_name}</td>
                                                <td className="px-8 py-5 text-gray-500 font-medium">{note.location?.location_legal_name}</td>
                                                <td className="px-8 py-5 text-right font-black text-slate-900">
                                                    ₹ {Number(note.grand_total).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-5 text-gray-500 text-xs font-semibold uppercase">
                                                    {new Date(note.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 shadow-sm"
                                                            title="Print Note"
                                                        >
                                                            <Printer className="size-3.5 text-gray-600" />
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 shadow-sm"
                                                            title="View Details"
                                                        >
                                                            <FileText className="size-3.5 text-gray-600" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-300">
                                                    <Receipt className="size-16 mb-4 opacity-10" />
                                                    <p className="text-base font-bold text-gray-400">No credit notes found matching your filters.</p>
                                                    <Link href="/sales/credit-note/create">
                                                        <Button variant="link" className="text-red-600 font-bold mt-2">Create your first credit note</Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Section */}
                <div className="flex items-center justify-between px-2 text-sm text-gray-500 font-medium">
                    <div>
                        Showing <span className="text-gray-900">{creditNotes.from || 0}</span> to <span className="text-gray-900">{creditNotes.to || 0}</span> of <span className="text-gray-900">{creditNotes.total}</span> notes
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
