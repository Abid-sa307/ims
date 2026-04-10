import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Production', href: '#' },
    { title: 'Item Manufacturing', href: '/operations/production-entry' },
];

export default function ProductionEntry() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Manufacturing" />
            <div className="p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <Card className="border-none shadow-sm bg-white rounded-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h1 className="text-xl font-bold text-[#162a5b]">Item Manufacturing</h1>
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-100 p-2 rounded-md border text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                                    <div className="w-5 h-5 flex flex-col gap-0.5 items-center justify-center">
                                        <div className="w-4 h-0.5 bg-current"></div>
                                        <div className="w-4 h-0.5 bg-current"></div>
                                        <div className="w-4 h-0.5 bg-current"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Row 1 */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Location</Label>
                                <Select>
                                    <SelectTrigger className="bg-white border-gray-200 h-10 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0">
                                        <SelectValue placeholder="-- Please Select --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Main Location</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Production Entry</Label>
                                <div className="flex rounded-md overflow-hidden border border-gray-200 w-fit h-10">
                                    <button className="px-10 bg-white text-gray-500 text-sm font-medium border-r hover:bg-gray-50 transition-colors">Off</button>
                                    <button className="px-10 bg-[#2196f3] text-white text-sm font-bold hover:bg-[#1e88e5] transition-colors">After Production</button>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Warehouse</Label>
                                <Select>
                                    <SelectTrigger className="bg-white border-gray-200 h-10 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0">
                                        <SelectValue placeholder="-- Please Select --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Main Warehouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Item</Label>
                                <Select>
                                    <SelectTrigger className="bg-white border-gray-200 h-10 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0">
                                        <SelectValue placeholder="-- Please Select --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Item 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                             {/* Row 3 */}
                             <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Unit Of Measurment</Label>
                                <div className="h-10 border-b border-dashed border-gray-300"></div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Number Of Batch</Label>
                                <div className="h-10 border-b border-dashed border-gray-300"></div>
                            </div>

                            {/* Row 4 */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Manufacturing Date</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        defaultValue="2026-04-10"
                                        className="h-10 pl-10 bg-white border-dashed border-gray-300 focus:border-solid border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0"
                                    />
                                    <Calendar className="absolute left-0 top-2.5 size-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        defaultValue="2026-04-10"
                                        className="h-10 pl-10 bg-white border-dashed border-gray-300 focus:border-solid border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0"
                                    />
                                    <Calendar className="absolute left-0 top-2.5 size-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Manufacture Quantity</Label>
                                <div className="h-10 border-b border-dashed border-gray-300"></div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Actual Manufacture Qty</Label>
                                <div className="h-10 border-b border-dashed border-gray-300"></div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <Button className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold uppercase py-6 px-10 rounded-md shadow-sm">
                                GENERATE RECIPE
                            </Button>

                            <div className="flex flex-wrap gap-12 text-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-900 font-bold text-lg">Total Used Qty : -</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-900 font-bold text-lg">Total Cost : -</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-900 font-bold text-lg">Per Unit Cost : -</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
