import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageSquare, PlusCircle, Trash2, List } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales',
        href: '#',
    },
    {
        title: 'Generate Invoice',
        href: '/sales/generate-invoice',
    },
];

export default function GenerateInvoice() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Invoice" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Generate Invoice</h1>
                    <Link href="/reports/sales/summary">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                            <List className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">

                        {/* Top Left Inputs */}
                        <div className="space-y-4 col-span-1 md:col-span-3 lg:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Location</Label>
                                    <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option>--- Select Location ---</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Customer</Label>
                                    <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option>--- Select Customer ---</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Reference Bill Number.</Label>
                                    <Input className="bg-white text-gray-700 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500" placeholder="Enter Reference Bill Number" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Reference Challan Number</Label>
                                    <Input className="bg-white text-gray-700 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500" placeholder="Enter Reference Challan Number" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-end gap-0">
                                    <div className="flex w-full overflow-hidden rounded-md border">
                                        <Button variant="ghost" className="flex-1 rounded-none border-r hover:bg-white text-muted-foreground h-10">Off</Button>
                                        <Button className="flex-1 rounded-none bg-[#f15e3b] hover:bg-[#d94f2f] text-white h-10">Dispatch-Now</Button>
                                    </div>
                                </div>
                                <div className="space-y-2 relative">
                                    <Label className="text-xs text-muted-foreground font-semibold">Invoice Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input type="date" className="pl-9 bg-white text-gray-700 border-gray-200 focus-visible:ring-1" defaultValue="2026-03-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Exp. Order Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input type="date" className="pl-9 bg-white text-gray-700 border-gray-200 focus-visible:ring-1" defaultValue="2026-03-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground font-semibold">Inv Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input type="date" className="pl-9 bg-white text-gray-700 border-gray-200 focus-visible:ring-1" defaultValue="2026-03-12" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Right Credit Card */}
                        <div className="col-span-1 border rounded-xl shadow-md bg-white p-4 flex flex-col justify-center items-center h-[120px] self-start mt-6 ring-1 ring-blue-50">
                            <h3 className="text-sm text-gray-600 mb-1">Current Credit Amount</h3>
                            <p className="text-xl font-bold text-gray-800">0.00</p>
                        </div>
                    </div>
                </div>

                {/* Main Purchase Items Table Section */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle border-collapse">
                            <thead className="bg-[#21355e] text-white text-[11px] font-medium leading-tight">
                                <tr>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] min-w-[150px]">Item Name</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">UOM</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-16">Qty</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Fat Value</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Last Price</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Current Price</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] min-w-[120px]">Expire Date</th>
                                    <th className="px-0 py-0 border-r border-[#3a4d75]">
                                        <div className="px-3 py-1 text-center border-b border-[#3a4d75]">Item Discount</div>
                                        <div className="flex w-full divide-x divide-[#3a4d75] text-[10px]">
                                            <div className="flex-1 text-center py-1">%</div>
                                            <div className="flex-1 text-center py-1">Amt</div>
                                        </div>
                                    </th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Taxable<br />Amount</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">CESS(%)</th>
                                    <th className="px-0 py-0 border-r border-[#3a4d75]">
                                        <div className="px-3 py-1 text-center border-b border-[#3a4d75]">IGST</div>
                                        <div className="flex w-full divide-x divide-[#3a4d75] text-[10px]">
                                            <div className="flex-1 text-center py-1">%</div>
                                            <div className="flex-1 text-center py-1">Amt</div>
                                        </div>
                                    </th>
                                    <th className="px-0 py-0 border-r border-[#3a4d75]">
                                        <div className="px-3 py-1 text-center border-b border-[#3a4d75]">Tax</div>
                                        <div className="flex w-full divide-x divide-[#3a4d75] text-[10px]">
                                            <div className="flex-1 text-center py-1">%</div>
                                            <div className="flex-1 text-center py-1">Amt</div>
                                        </div>
                                    </th>
                                    <th className="px-0 py-0 border-r border-[#3a4d75]">
                                        <div className="px-3 py-1 text-center border-b border-[#3a4d75]">CESS</div>
                                        <div className="flex w-full divide-x divide-[#3a4d75] text-[10px]">
                                            <div className="px-1 text-center py-1 leading-[1]">%{'\n'}Amt</div>
                                        </div>
                                    </th>
                                    <th className="px-0 py-0 border-r border-[#3a4d75]">
                                        <div className="px-3 py-1 text-center border-b border-[#3a4d75]">GST<br />40</div>
                                        <div className="flex w-full divide-x divide-[#3a4d75] text-[10px]">
                                            <div className="px-1 text-center py-1 leading-[1]">%{'\n'}Amt</div>
                                        </div>
                                    </th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">Total<br />Amount</th>
                                    <th className="px-2 py-3 text-center bg-[#152340]">
                                        <PlusCircle className="h-4 w-4 mx-auto text-white cursor-pointer" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="p-2 border-r bg-gray-50/50">
                                        <div className="flex flex-col gap-1 items-center">
                                            <select className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-[11px] text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                <option>Select An Option</option>
                                            </select>
                                            <span className="text-[10px] text-green-600 font-semibold tracking-tighter">Multiplier = 0,MOQ =0</span>
                                        </div>
                                    </td>
                                    <td className="p-2 border-r align-top">
                                        <select className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-[11px] text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                            <option>Select An Option</option>
                                        </select>
                                    </td>
                                    <td className="p-2 border-r align-top"><Input className="h-8 max-w-[50px] px-2 text-xs border-gray-300 rounded" defaultValue="0" /></td>
                                    <td className="p-2 border-r align-top"><Input className="h-8 px-2 text-xs border-gray-300 rounded" /></td>
                                    <td className="p-2 border-r align-top text-center text-xs text-gray-700 pt-3">0</td>
                                    <td className="p-2 border-r align-top text-center text-xs text-gray-700 pt-3">0</td>
                                    <td className="p-2 border-r align-top">
                                        <div className="relative">
                                            <Input type="date" className="h-8 pr-1 pl-2 text-[11px] border-gray-300 rounded" defaultValue="2026-03-12" />
                                        </div>
                                    </td>
                                    <td className="p-0 border-r align-top">
                                        <div className="flex h-full w-full p-2 gap-1 items-start">
                                            <Input className="h-8 w-full min-w-[40px] px-1 text-center text-xs border-gray-300 rounded" defaultValue="0" />
                                            <Input className="h-8 w-full min-w-[40px] px-1 text-center text-xs border-gray-300 rounded" defaultValue="0" />
                                        </div>
                                    </td>
                                    <td className="p-2 border-r align-top text-center text-xs text-gray-700 pt-3">0</td>
                                    <td className="p-2 border-r align-top text-center text-xs text-gray-700 pt-3">0</td>
                                    <td className="p-0 border-r align-top">
                                        <div className="flex h-full w-full p-2 gap-1 items-start">
                                            <Input className="h-8 w-full min-w-[35px] px-1 text-center text-xs border-gray-300 rounded" defaultValue="0" />
                                            <Input className="h-8 w-full min-w-[35px] px-1 text-center text-xs border-gray-300 rounded" defaultValue="0" />
                                        </div>
                                    </td>
                                    <td className="p-0 border-r align-top">
                                        <div className="flex h-full w-full p-2 gap-1 items-start">
                                            <Input className="h-8 w-full min-w-[35px] px-1 text-center text-xs border-gray-300 rounded" defaultValue="0" />
                                            <Input className="h-8 w-full min-w-[35px] px-1 text-center text-xs border-gray-300 rounded" defaultValue="0" />
                                        </div>
                                    </td>
                                    <td className="p-2 border-r align-top text-center text-xs text-gray-700 pt-3">0  0</td>
                                    <td className="p-2 border-r align-top text-center text-xs text-gray-700 pt-3">0  0</td>
                                    <td className="p-2 border-r align-top text-center text-xs text-gray-700 pt-3">0</td>
                                    <td className="p-2 bg-red-50/50 align-top text-center space-y-2">
                                        <Trash2 className="h-4 w-4 mx-auto text-red-500 cursor-pointer" />
                                        <MessageSquare className="h-4 w-4 mx-auto text-red-500 cursor-pointer" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 flex justify-end p-2 border-t">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-white">
                            <PlusCircle className="h-4 w-4 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* Totals Table */}
                <div className="flex justify-end mb-6">
                    <div className="w-full lg:w-3/5 border rounded-md shadow-sm overflow-hidden bg-white">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-[#21355e] text-white font-medium text-[11px] text-center">
                                <tr>
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Total Amount(Cur<br />Price*Qty)</th>
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Discount</th>
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Total Taxable Amt</th>
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Total Tax Amt</th>
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Additional Charges</th>
                                    <th className="px-3 py-2">Grand Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border-r"></td>
                                    <td className="p-2 border-r flex">
                                        <Input className="h-8 rounded-r-none border-r-0 flex-1 px-2 text-right focus-visible:ring-0" placeholder="" />
                                        <select className="h-8 border border-l-0 border-gray-300 rounded-r-md px-1 bg-white text-[11px] text-red-500 focus:outline-none font-medium">
                                            <option>Discount Amt</option>
                                        </select>
                                    </td>
                                    <td className="p-2 border-r"></td>
                                    <td className="p-2 border-r"></td>
                                    <td className="p-2 border-r">
                                        <span className="ml-2 font-medium">0</span>
                                    </td>
                                    <td className="p-2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mt-10 pt-6 border-t border-gray-100">
                    <div className="w-full sm:flex-1 max-w-2xl">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Invoice Remarks / Internal Notes</Label>
                        <Input className="bg-white text-gray-700 border-gray-200 placeholder:text-gray-400 h-11 w-full rounded-xl shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500" placeholder="Type any specific instructions or notes here..." />
                    </div>

                    <Button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black italic uppercase tracking-wider px-12 h-11 text-xs rounded-xl shadow-lg shadow-green-900/10 transition-all hover:translate-y-[-2px] active:translate-y-0">
                        GENERATE INVOICE
                    </Button>
                </div>

            </div>
        </AppLayout>
    );
}
