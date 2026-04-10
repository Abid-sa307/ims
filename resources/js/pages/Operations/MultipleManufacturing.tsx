import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Production', href: '#' },
    { title: 'Multiple Manufacturing', href: '/operations/multiple-manufacturing' },
];

export default function MultipleManufacturing() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Multiple Manufacturing" />
            <div className="p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <Card className="border-none shadow-sm bg-white rounded-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h1 className="text-xl font-bold text-[#162a5b]">Multiple Manufacturing</h1>
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

                        <div className="space-y-8">
                            <div className="flex items-center justify-between max-w-md">
                                <Label className="text-sm font-medium text-gray-700">Is Plan Based Manufacturing ?</Label>
                                <Switch className="data-[state=checked]:bg-blue-600" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
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
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
