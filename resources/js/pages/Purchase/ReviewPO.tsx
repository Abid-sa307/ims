import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Printer, ArrowLeft, MapPin, Building2, Tag, Calendar, FileText, Send } from 'lucide-react';

const breadcrumbs = (context: string): BreadcrumbItem[] => [
    { title: 'Purchase', href: '#' },
    { 
        title: context === 'transmit' ? 'Send PO to Supplier' : 'Order Approval', 
        href: context === 'transmit' ? '/purchase/send-po' : '/purchase/approved-po' 
    },
    { title: 'Review Order', href: '#' },
];

interface Props {
    purchaseOrder: any;
    context?: 'approve' | 'transmit';
}

export default function ReviewPO({ purchaseOrder, context = 'approve' }: Props) {
    const po = purchaseOrder;

    const handleApprove = () => {
        if (confirm('Approve this Purchase Order? It will be moved to the Send PO queue.')) {
            router.post(`/purchase/approve-po/${po.id}`);
        }
    };

    const handleReject = () => {
        if (confirm('Reject this Purchase Order? This action cannot be undone.')) {
            router.post(`/purchase/reject-po/${po.id}`);
        }
    };

    const handleSend = () => {
        if (confirm('Transmit this Purchase Order to the supplier?')) {
            router.post(`/purchase/send-po/${po.id}`);
        }
    };

    const isTransmit = context === 'transmit';
    const backUrl = isTransmit ? '/purchase/send-po' : '/purchase/approved-po';

    const items = po.items || [];

    // Detect regime from supplier state
    const supplierState = (po.supplier?.state || '').toLowerCase();
    const UT_LIST = ['chandigarh', 'ladakh', 'lakshadweep', 'andaman and nicobar islands', 'dadra and nagar haveli and daman and diu'];
    let regime = 'INTER';
    if (supplierState === 'gujarat') regime = 'INTRA';
    else if (UT_LIST.includes(supplierState)) regime = 'UT';

    return (
        <AppLayout breadcrumbs={breadcrumbs(context)}>
            <Head title={`Review PO: ${po.order_number}`} />
            <div className="flex h-full flex-col p-4 sm:p-6 overflow-y-auto bg-gray-50/50">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-6 gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#162a5b]">Review Purchase Order</h1>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">
                            Reviewing: <span className="text-[#162a5b] font-black">{po.order_number}</span>
                            <span className={`ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${isTransmit ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                {isTransmit ? 'Approved (Ready to Send)' : 'Pending Approval'}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get(backUrl)}
                            className="h-8 text-xs gap-1.5"
                        >
                            <ArrowLeft className="h-3 w-3" /> Back
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/purchase/orders/${po.id}/print`, '_blank')}
                            className="h-8 text-xs gap-1.5 text-gray-600"
                        >
                            <Printer className="h-3 w-3" /> Print
                        </Button>
                    </div>
                </div>

                {/* Order Info */}
                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                <Building2 className="h-3 w-3" /> Location
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{po.location?.location_legal_name || '—'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                <MapPin className="h-3 w-3" /> Supplier
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{po.supplier?.supplier_name || '—'}</div>
                            <div className="text-[10px] text-gray-400">{po.supplier?.state || ''}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                <Calendar className="h-3 w-3" /> PO Date
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{po.po_date || '—'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                <Calendar className="h-3 w-3" /> Expected Date
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{po.exp_order_date || '—'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                <Tag className="h-3 w-3" /> Ref Bill No.
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{po.reference_bill_no || '—'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                <Tag className="h-3 w-3" /> Ref Challan No.
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{po.reference_challan_no || '—'}</div>
                        </div>
                    </div>
                    {po.remarks && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2">
                            <FileText className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Remarks</div>
                                <div className="text-xs text-gray-700">{po.remarks}</div>
                            </div>
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${regime === 'INTRA' ? 'bg-blue-50 text-blue-700 border-blue-200' : regime === 'UT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            Tax Regime: {regime === 'INTRA' ? 'Gujarat (CGST+SGST)' : regime === 'UT' ? 'Union Territory (CGST+UTGST)' : 'Other State (IGST)'}
                        </span>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left align-middle border-collapse">
                            <thead className="bg-[#21355e] text-white text-[11px] font-medium">
                                <tr>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">#</th>
                                    <th className="px-3 py-3 border-r border-[#3a4d75] min-w-[200px]">Item Name</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75]">UOM</th>
                                    <th className="px-3 py-3 text-center border-r border-[#3a4d75] w-20">Qty</th>
                                    <th className="px-3 py-3 text-right border-r border-[#3a4d75] w-28">Price</th>
                                    <th className="px-3 py-3 text-right border-r border-[#3a4d75]">Taxable Amt</th>
                                    {regime === 'INTRA' && (<>
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75]">CGST</th>
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75]">SGST</th>
                                    </>)}
                                    {regime === 'UT' && (<>
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75]">CGST</th>
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75]">UTGST</th>
                                    </>)}
                                    {regime === 'INTER' && (
                                        <th className="px-3 py-3 text-right border-r border-[#3a4d75]">IGST</th>
                                    )}
                                    <th className="px-3 py-3 text-right border-r border-[#3a4d75]">Tax Amt</th>
                                    <th className="px-3 py-3 text-right">Total Amt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item: any, index: number) => (
                                    <tr key={item.id} className="hover:bg-blue-50/10">
                                        <td className="px-3 py-2.5 text-center text-gray-400 border-r border-gray-100">{index + 1}</td>
                                        <td className="px-3 py-2.5 border-r border-gray-100">
                                            <div className="font-semibold text-gray-800">{item.item?.item_name || '—'}</div>
                                            {item.item_remark && <div className="text-[10px] text-gray-400 italic">{item.item_remark}</div>}
                                        </td>
                                        <td className="px-3 py-2.5 text-center border-r border-gray-100 text-gray-600 font-medium">{item.uom}</td>
                                        <td className="px-3 py-2.5 text-center border-r border-gray-100 font-bold">{Number(item.qty).toFixed(3)}</td>
                                        <td className="px-3 py-2.5 text-right border-r border-gray-100 font-mono">{Number(item.current_price).toFixed(2)}</td>
                                        <td className="px-3 py-2.5 text-right border-r border-gray-100">{Number(item.taxable_amount).toFixed(2)}</td>
                                        {regime === 'INTRA' && (<>
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 text-blue-600">{Number(item.cgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.cgst_percent}%)</span></td>
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 text-blue-600">{Number(item.sgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.sgst_percent}%)</span></td>
                                        </>)}
                                        {regime === 'UT' && (<>
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 text-indigo-600">{Number(item.cgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.cgst_percent}%)</span></td>
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 text-indigo-600">{Number(item.utgst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.utgst_percent}%)</span></td>
                                        </>)}
                                        {regime === 'INTER' && (
                                            <td className="px-3 py-2.5 text-right border-r border-gray-100 text-amber-600">{Number(item.igst_amount).toFixed(2)} <span className="text-[9px] text-gray-400">({item.igst_percent}%)</span></td>
                                        )}
                                        <td className="px-3 py-2.5 text-right border-r border-gray-100 font-semibold">{Number(item.tax_amount).toFixed(2)}</td>
                                        <td className="px-3 py-2.5 text-right font-bold text-[#162a5b]">{Number(item.total_amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-6">
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden w-full lg:w-2/3">
                        <table className="w-full text-[11px]">
                            <thead className="bg-[#21355e] text-white text-center font-semibold">
                                <tr>
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Base Amount</th>
                                    {regime === 'INTRA' && (<>
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Total CGST</th>
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Total SGST</th>
                                    </>)}
                                    {regime === 'UT' && (<>
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Total CGST</th>
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Total UTGST</th>
                                    </>)}
                                    {regime === 'INTER' && (
                                        <th className="px-3 py-2 border-r border-[#3a4d75]">Total IGST</th>
                                    )}
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Addl. Charges</th>
                                    <th className="px-3 py-2 border-r border-[#3a4d75]">Discount</th>
                                    <th className="px-3 py-2">Grand Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center bg-white">
                                    <td className="px-3 py-3 border-r border-gray-100 font-semibold">{Number(po.total_amount || 0).toFixed(2)}</td>
                                    {regime === 'INTRA' && (<>
                                        <td className="px-3 py-3 border-r border-gray-100 text-blue-600 font-bold">{Number(po.cgst_amount || 0).toFixed(2)}</td>
                                        <td className="px-3 py-3 border-r border-gray-100 text-blue-600 font-bold">{Number(po.sgst_amount || 0).toFixed(2)}</td>
                                    </>)}
                                    {regime === 'UT' && (<>
                                        <td className="px-3 py-3 border-r border-gray-100 text-indigo-600 font-bold">{Number(po.cgst_amount || 0).toFixed(2)}</td>
                                        <td className="px-3 py-3 border-r border-gray-100 text-indigo-600 font-bold">{Number(po.utgst_amount || 0).toFixed(2)}</td>
                                    </>)}
                                    {regime === 'INTER' && (
                                        <td className="px-3 py-3 border-r border-gray-100 text-amber-600 font-bold">{Number(po.igst_amount || 0).toFixed(2)}</td>
                                    )}
                                    <td className="px-3 py-3 border-r border-gray-100 text-blue-500">{Number(po.additional_charges || 0).toFixed(2)}</td>
                                    <td className="px-3 py-3 border-r border-gray-100 text-red-500">{Number(po.discount_amount || 0).toFixed(2)}</td>
                                    <td className="px-3 py-3 text-xl font-black text-[#162a5b]">₹ {Number(po.grand_total || 0).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-200 mt-2">
                    <p className="text-xs text-gray-500 font-medium sm:mr-4">
                        Review complete? Choose an action to proceed:
                    </p>
                    {!isTransmit ? (
                        <>
                            <Button
                                onClick={handleReject}
                                variant="outline"
                                className="w-full sm:w-auto min-w-[180px] h-11 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold text-xs uppercase tracking-widest gap-2 rounded-lg shadow-sm active:scale-95 transition-transform"
                            >
                                <XCircle className="h-4 w-4" /> Reject Order
                            </Button>
                            <Button
                                onClick={handleApprove}
                                className="w-full sm:w-auto min-w-[200px] h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest gap-2 rounded-lg shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
                            >
                                <CheckCircle2 className="h-4 w-4" /> Approve Order
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={handleSend}
                            className="w-full sm:w-auto min-w-[200px] h-11 bg-[#162a5b] hover:bg-[#1a3370] text-white font-bold text-xs uppercase tracking-widest gap-2 rounded-lg shadow-lg active:scale-95 transition-transform"
                        >
                            <Send className="h-4 w-4 text-white" /> Send Order to Supplier
                        </Button>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
