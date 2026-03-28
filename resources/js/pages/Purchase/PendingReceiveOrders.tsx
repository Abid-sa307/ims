import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, Plus, Menu, Search, AlignJustify } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase',
        href: '#',
    },
    {
        title: 'Pending Receive Orders',
        href: '/purchase/pending-receive-orders',
    },
];

export default function PendingReceiveOrders() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Receive Orders" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 bg-gray-50/50">

                {/* Header Section Matches Design */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Pending Receive Orders</h1>
                    <div className="flex bg-gray-100 rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-none border-r border-gray-300">
                            <Menu className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-none">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-md border shadow-sm flex flex-col mb-6">

                    {/* Filter Top Row */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                            <div className="md:col-span-4 lg:col-span-3 space-y-2">
                                <Label className="text-xs text-muted-foreground font-normal">Select Ordered Date:</Label>
                                <div className="flex rounded-md shadow-sm">
                                    <div className="flex items-center justify-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <Input
                                        type="text"
                                        className="h-9 rounded-l-none bg-[#1a2035] text-white border-0 focus-visible:ring-1"
                                        defaultValue="12/03/2026 - 12/03/2026"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-4 lg:col-span-4 space-y-2">
                                <Label className="text-xs text-muted-foreground font-normal">Franchise</Label>
                                <select className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option>All selected (59)</option>
                                </select>
                            </div>

                            <div className="md:col-span-4 lg:col-span-3 space-y-2">
                                <Label className="text-xs text-muted-foreground font-normal">Supplier</Label>
                                <select className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option>None selected</option>
                                </select>
                            </div>

                            <div className="md:col-span-12 lg:col-span-2 flex items-end">
                                <Button className="w-full bg-[#3490dc] hover:bg-[#2779bd] text-white h-9 shadow-sm">
                                    <Filter className="mr-2 h-4 w-4" /> FILTER
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table Toolbar controls */}
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Filter:</span>
                            <div className="relative">
                                <Input type="text" placeholder="Type to filter..." className="h-8 max-w-[200px] border-gray-300 border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-blue-500 text-sm" />
                                <Search className="absolute right-0 top-2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-600">
                                <button className="px-3 py-1.5 hover:bg-gray-100 border-r border-gray-200">COPY</button>
                                <button className="px-3 py-1.5 hover:bg-gray-100 border-r border-gray-200">CSV</button>
                                <button className="px-3 py-1.5 hover:bg-gray-100 border-r border-gray-200">PRINT</button>
                                <button className="px-3 py-1.5 hover:bg-gray-100 border-r border-gray-200">PDF</button>
                                <button className="px-3 py-1.5 hover:bg-gray-100 flex items-center justify-center">
                                    <AlignJustify className="h-3.5 w-3.5" /> <span className="text-[10px] ml-1">▼</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Show:</span>
                                <select className="h-8 border-gray-300 text-sm rounded bg-white pr-8 py-1">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle border-t border-gray-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Receive <span className="text-[10px] text-gray-400">▲</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Sr. No <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Invoice No <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Supplier <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Location <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Order No. <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Dispatch Date <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Expected Date <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Total Amount <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Discount Amt <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Additional Charge <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center justify-between gap-2">Payabale Amt <span className="text-[10px] text-gray-400 text-center leading-[0.5]">▲<br />▼</span></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={12} className="py-6 text-center text-gray-600 border-b border-gray-200">
                                        No Data Available In Table
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 flex items-center justify-between text-sm text-gray-600">
                        <div>Showing 0 To 0 Of 0 Entries</div>
                        <div className="flex gap-2 text-gray-300">
                            <span>←</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
