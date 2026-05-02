import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { FileMinus, Plus, Search, Calendar, Printer, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Management', href: '#' },
    { title: 'Debit Note', href: '/purchase/debit-note' },
];

interface Props {
    debitNotes: any[];
}

export default function DebitNote({ debitNotes = [] }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Debit Note TO Supplier" />
            <div className="flex h-full flex-col p-8 bg-gray-50/50 min-h-screen">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-[#162a5b] flex items-center gap-3">
                            <div className="bg-red-100 p-2 rounded-xl">
                                <FileMinus className="size-6 text-red-600" />
                            </div>
                            Debit Notes
                        </h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 ml-12">Manage purchase returns and price adjustments</p>
                    </div>
                    
                    <Link href="/purchase/generate-debit-note">
                        <Button className="bg-[#162a5b] hover:bg-[#1c3a7a] rounded-xl px-6 py-6 gap-2 shadow-lg shadow-blue-900/20 font-black italic uppercase tracking-tight transform active:scale-95 transition-all">
                            <Plus className="size-5" /> CREATE DEBIT NOTE
                        </Button>
                    </Link>
                </div>

                {debitNotes.length > 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                                    <tr>
                                        <th className="px-6 py-5">Note Details</th>
                                        <th className="px-6 py-5">Supplier</th>
                                        <th className="px-6 py-5">Location</th>
                                        <th className="px-6 py-5">Amount</th>
                                        <th className="px-6 py-5">Date</th>
                                        <th className="px-6 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {debitNotes.map((note) => (
                                        <tr key={note.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-black text-[#162a5b] tracking-tight">{note.note_number}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5 flex items-center gap-1.5">
                                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">PO: {note.purchase_order?.order_number || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-700">{note.supplier?.supplier_name}</div>
                                                <div className="text-[10px] text-gray-400">{note.supplier?.state || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 font-medium">
                                                {note.location?.location_legal_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-black text-red-600 tracking-tight">₹ {Number(note.amount).toLocaleString()}</div>
                                                <div className="text-[9px] text-gray-400 uppercase font-bold">Debit Amount</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                                                    <Calendar className="size-3 opacity-50" />
                                                    {new Date(note.debit_note_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                                                        <Eye className="size-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                        <Printer className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-20 text-center border-t-4 border-t-red-500 flex flex-col items-center justify-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-6">
                            <FileMinus className="size-12 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Debit Notes Found</h3>
                        <p className="text-gray-400 font-medium max-w-xs mx-auto mb-8">You haven't generated any debit notes yet. Click the button above to start.</p>
                        <Link href="/purchase/generate-debit-note">
                            <Button variant="outline" className="rounded-xl border-gray-200 font-bold px-8">
                                GET STARTED
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
