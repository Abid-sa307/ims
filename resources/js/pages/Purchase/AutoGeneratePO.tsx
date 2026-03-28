import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase',
        href: '#',
    },
    {
        title: 'Auto Generate Purchase Order',
        href: '/purchase/auto-generate-po',
    },
];

export default function AutoGeneratePO() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Auto Generate Purchase Order" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 bg-gray-50/50">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-orange-500/30 pb-4 mb-6 relative">
                    {/* Orange Top Accent Line (to match reference) */}
                    <div className="absolute top-[-1.5rem] left-[-2rem] right-[-2rem] h-0.5 bg-orange-500"></div>
                    <h1 className="text-lg font-bold tracking-tight text-[#162a5b]">Auto Generate Purchase Order</h1>
                </div>

                <div className="bg-white rounded-md border shadow-sm p-6 mb-6 flex-1 flex flex-col">

                    {/* Location Select */}
                    <div className="w-full max-w-xs mb-8">
                        <Label className="text-sm text-gray-700 font-normal mb-2 block">Location</Label>
                        <select className="flex h-10 w-full rounded-md border border-[#21355e] bg-[#21355e] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#21355e]/50">
                            <option>--- Select Location ---</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="w-full flex-1 mb-8 overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 font-medium text-gray-700 w-20">Sr. No</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 text-center min-w-[200px]">Item</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 text-center w-24">UOM</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 text-center w-32">Current Qty</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 text-center w-32">Safety Qty</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 text-center w-32">Order Qty</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 text-center w-32">Last Price</th>
                                    <th className="px-4 py-3 font-medium text-gray-700 text-center w-40">Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Empty row to match the design where there's just a line and then the button below it */}
                                <tr>
                                    <td colSpan={8} className="border-b border-gray-200 py-4"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Button */}
                    <div className="mt-auto">
                        <Button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-semibold shadow-sm px-6 h-10 uppercase text-xs tracking-wider">
                            CREATE PO
                        </Button>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
