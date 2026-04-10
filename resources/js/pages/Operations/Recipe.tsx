import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operations', href: '#' },
    { title: 'Recipe Master', href: '/operations/recipe' },
];

export default function Recipe() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipe Master" />
            <div className="p-4 lg:p-6 bg-gray-50/50 min-h-screen">
                <Card className="border-none shadow-sm bg-white rounded-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h1 className="text-xl font-bold text-[#162a5b]">Recipe Master</h1>
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

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Recipe Type</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white border-gray-200 h-10 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0">
                                            <SelectValue placeholder="-- Please Select --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">Standard Recipe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Product Category</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white border-gray-200 h-10 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0">
                                            <SelectValue placeholder="-- Please Select --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="food">Food</SelectItem>
                                            <SelectItem value="beverage">Beverage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Product</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white border-gray-200 h-10 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0">
                                            <SelectValue placeholder="-- Please Select --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="item1">Item 1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Product-Portion</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white border-gray-200 h-10 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0">
                                            <SelectValue placeholder="-- Please Select --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pieces">Pieces</SelectItem>
                                            <SelectItem value="kg">KG</SelectItem>
                                            <SelectItem value="gram">Gram</SelectItem>
                                            <SelectItem value="portion">Portion</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Food Cost</Label>
                                    <Input
                                        readOnly
                                        defaultValue="0.00"
                                        className="h-10 bg-white border-dashed border-gray-300 focus:border-solid border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                                <Input
                                    placeholder="Please Enter Remarks"
                                    className="h-10 bg-white border-dashed border-gray-300 focus:border-solid border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold uppercase rounded-md shadow-sm h-10 px-6">
                                    ADD INVENTORY ITEMS
                                </Button>
                                <Button className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold uppercase rounded-md shadow-sm h-10 px-6">
                                    ADD PARCEL ITEMS
                                </Button>
                            </div>

                            {/* Modifiers Table */}
                            <div className="mt-8">
                                <Table className="border rounded-md overflow-hidden">
                                    <TableHeader className="bg-[#1e293b] hover:bg-[#1e293b]">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3">Modifiers</TableHead>
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3">Item Type</TableHead>
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3">Item Name</TableHead>
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3 text-center">UOM</TableHead>
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3 text-center">Qty</TableHead>
                                            <TableHead className="text-white font-bold py-3 text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-12 text-center text-gray-900 font-bold bg-white italic tracking-tight">
                                                No Recipe Available.
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Note Banner */}
                            <div className="mt-6 bg-[#f9a825] text-black font-bold p-3 rounded-t-md text-sm">
                                Note- For Parcel Items:- <span className="italic">Recipe Will Be Deducted Except Dine In.</span>
                            </div>

                            {/* Parcel Items Table */}
                            <div className="">
                                <Table className="border rounded-b-md overflow-hidden border-t-0">
                                    <TableHeader className="bg-[#1e293b] hover:bg-[#1e293b]">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3">Item Name</TableHead>
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3 text-center">UOM</TableHead>
                                            <TableHead className="text-white font-bold border-r border-slate-700 py-3 text-center">Qty</TableHead>
                                            <TableHead className="text-white font-bold py-3 text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-12 text-center text-gray-900 font-bold bg-white italic tracking-tight">
                                                No Recipe Available.
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="pt-8">
                                <Button className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold uppercase rounded-md shadow-sm h-10 px-8">
                                    ADD RECIPE
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
