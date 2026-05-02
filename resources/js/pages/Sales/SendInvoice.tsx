import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Search, CheckCircle2, Mail, MessageCircle, Printer } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Management', href: '#' },
    { title: 'Send Invoice', href: '/sales/send-invoice' },
];

interface Props {
    invoices: {
        data: any[];
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
    };
}

export default function SendInvoice({ invoices, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/sales/send-invoice', { search }, { preserveState: true });
    };

    const handleSend = (id: number) => {
        router.post(`/sales/send-invoice/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send Invoice to Customer" />
            <div className="flex h-full flex-col p-6 bg-gray-50/30 min-h-screen gap-6">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-t-2 border-t-[#162a5b] bg-white p-6 shadow-sm rounded-xl">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Send Invoice to Customer</h1>
                        <p className="text-sm text-gray-500">Transmit approved invoices to your clients via their preferred channels.</p>
                    </div>
                </div>

                {/* Search Section */}
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input 
                                    className="pl-9 h-11 border-gray-200 text-sm focus-visible:ring-[#162a5b]" 
                                    placeholder="Search by Invoice Number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch} className="h-11 bg-[#162a5b] hover:bg-[#1c3a7a] px-8 font-bold uppercase tracking-wider">
                                Search
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
                                        <th className="px-8 py-5">Invoice #</th>
                                        <th className="px-8 py-5">Customer</th>
                                        <th className="px-8 py-5">Location</th>
                                        <th className="px-8 py-5 text-right">Grand Total</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoices.data.length > 0 ? (
                                        invoices.data.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="font-extrabold text-[#162a5b] group-hover:underline cursor-pointer transition-all">{invoice.invoice_number}</div>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-gray-700">{invoice.customer?.customer_name}</td>
                                                <td className="px-8 py-5 text-gray-500 font-medium">{invoice.location?.location_legal_name}</td>
                                                <td className="px-8 py-5 text-right font-black text-slate-900">
                                                    ₹ {Number(invoice.grand_total).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-5 text-gray-500 text-xs font-semibold uppercase">
                                                    {new Date(invoice.invoice_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            className="bg-indigo-600 hover:bg-indigo-700 h-8 gap-2 px-4 shadow-md shadow-indigo-100"
                                                            onClick={() => handleSend(invoice.id)}
                                                        >
                                                            <Mail className="size-3.5" /> SEND EMAIL
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            className="border-green-200 text-green-600 hover:bg-green-50 h-8 gap-2"
                                                            onClick={() => handleSend(invoice.id)}
                                                        >
                                                            <MessageCircle className="size-3.5" /> WHATSAPP
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => window.open(`/sales/invoices/${invoice.id}/print`, '_blank')}
                                                        >
                                                            <Printer className="size-4 text-slate-400" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-300">
                                                    <Send className="size-16 mb-4 opacity-10" />
                                                    <p className="text-base font-bold text-gray-400">No approved invoices available to send.</p>
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
                        Showing <span className="text-gray-900">{invoices.from || 0}</span> to <span className="text-gray-900">{invoices.to || 0}</span> of <span className="text-gray-900">{invoices.total}</span> invoices
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
