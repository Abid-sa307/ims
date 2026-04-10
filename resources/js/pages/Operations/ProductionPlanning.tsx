import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Production', href: '#' },
    { title: 'Production Planning', href: '/operations/production-planning' },
];

export default function ProductionPlanning() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Production Planning" />
            <div className="p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <Card className="border-none shadow-sm bg-white rounded-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h1 className="text-xl font-bold text-[#162a5b]">Production Planning</h1>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Location</Label>
                                <Select>
                                    <SelectTrigger className="bg-white border-gray-200 h-10">
                                        <SelectValue placeholder="-- Please Select --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Main Location</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Plan Type</Label>
                                <div className="flex rounded-md overflow-hidden border border-gray-200 w-fit h-10">
                                    <button className="px-8 bg-white text-gray-500 text-sm font-medium border-r hover:bg-gray-50 transition-colors">Off</button>
                                    <button className="px-8 bg-[#4caf50] text-white text-sm font-bold hover:bg-[#43a047] transition-colors">Approve Order</button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Manufacturing Warehouse</Label>
                                <Select>
                                    <SelectTrigger className="bg-white border-gray-200 h-10">
                                        <SelectValue placeholder="-- Please Select --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Finished Goods Warehouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">RM Warehouse</Label>
                                <Select>
                                    <SelectTrigger className="bg-white border-gray-200 h-10">
                                        <SelectValue placeholder="-- Please Select --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Raw Material Warehouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Planning Date</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        defaultValue="2026-04-10"
                                        className="h-10 pl-10 bg-white border-dashed border-gray-300 focus:border-solid"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Please Define Remarks"
                                        className="h-10 bg-white border-dashed border-gray-300 focus:border-solid border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
