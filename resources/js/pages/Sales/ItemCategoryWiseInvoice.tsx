import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, List } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales',
        href: '#',
    },
    {
        title: 'Item Category Wise Sales Invoice',
        href: '/sales/item-category-wise-invoice',
    },
];

export default function ItemCategoryWiseInvoice() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Category Wise Sales Invoice" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Item Catgeory Wise Sales Invoice</h1>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground bg-gray-100">
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">

                        {/* Row 1 */}
                        <div className="space-y-2">
                            <select className="flex h-10 w-full rounded-none border-0 border-b border-gray-200 bg-white px-0 py-2 text-sm text-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500">
                                <option>--- Select Location ---</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <select className="flex h-10 w-full rounded-none border-0 border-b border-gray-200 bg-white px-0 py-2 text-sm text-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500">
                                <option>--- Select Customer ---</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Input className="bg-white text-gray-700 bg-transparent rounded-none border-0 border-b border-gray-200 px-0 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-blue-500 shadow-none h-10" placeholder="Enter Reference Bill Number" />
                        </div>
                        <div className="space-y-2">
                            <Input className="bg-white text-gray-700 rounded-none border-0 border-b border-gray-200 px-0 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-blue-500 shadow-none h-10" placeholder="Enter Reference Challan Number" />
                        </div>

                        {/* Row 2 */}
                        <div className="flex items-end gap-0">
                            <div className="flex w-full overflow-hidden rounded-md border h-10">
                                <Button variant="ghost" className="flex-1 rounded-none border-r hover:bg-gray-50 text-gray-600 h-full">Off</Button>
                                <Button className="flex-1 rounded-none bg-[#f15e3b] hover:bg-[#d94f2f] text-white h-full font-medium">Dispatch-Now</Button>
                            </div>
                        </div>
                        <div className="space-y-2 relative flex items-center h-10 border-b border-gray-200 group focus-within:border-blue-500">
                            <Label className="text-sm text-gray-600 w-24 shrink-0 font-normal">Invoice Date</Label>
                            <div className="relative flex-1">
                                <Calendar className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                                <Input type="date" className="pl-8 bg-transparent text-gray-700 border-0 h-8 focus-visible:ring-0 shadow-none" defaultValue="2026-03-12" />
                            </div>
                        </div>
                        <div className="space-y-2 relative flex items-center h-10 border-b border-gray-200 group focus-within:border-blue-500">
                            <Label className="text-sm text-gray-600 w-24 shrink-0 font-normal">Exp. Order Date</Label>
                            <div className="relative flex-1">
                                <Calendar className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                                <Input type="date" className="pl-8 bg-transparent text-gray-700 border-0 h-8 focus-visible:ring-0 shadow-none" defaultValue="2026-03-12" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Input className="bg-white text-gray-700 rounded-none border-0 border-b border-gray-200 px-0 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-blue-500 shadow-none h-10" placeholder="Enter Remarks" />
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="flex mt-auto">
                    <Button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-semibold shadow-sm px-6 h-10 uppercase text-xs tracking-wider">
                        GENERATE ORDER
                    </Button>
                </div>

            </div>
        </AppLayout>
    );
}
