import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { LayoutList } from 'lucide-react';
import { useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'New Reports', href: '#' },
    { title: 'Supplier Payment Entry', href: '/reports/new/supplier-payment-entry' },
];

interface Transaction {
    sr: number;
    supplier_name: string;
    payment_type: string;
    amount: number;
    created_by: string;
    created_date: string;
}

const PAYMENT_TYPES = ['Cash', 'Card Payment', 'Phone Pay', 'Bank Transfer', 'Cheque', 'Online'];

export default function SupplierPaymentEntry({ lastTen = [], suppliers = [] }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_id: '',
        payment_type: '',
        amount: '',
        description: ''
    });
    
    const balance = 0; // calculate if needed, for now 0

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reports/new/supplier-payment-entry', {
            onSuccess: () => {
                reset('amount', 'description');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supplier Payment Entry" />
            <div className="flex flex-col gap-6 p-6 bg-slate-50 min-h-full">

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    {/* header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold text-[#162a5b] border-b-2 border-[#162a5b] pb-1">Supplier Payment</h1>
                        <Link href="/reports/new/supplier-payment"
                            className="flex items-center gap-2 bg-[#162a5b] hover:bg-[#1e3a7b] text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
                            <LayoutList className="size-4" /> View List
                        </Link>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-5">
                        {/* row 1: supplier + payment type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1 block">
                                    Supplier <span className="text-red-500">*</span>
                                </label>
                                <select value={data.supplier_id} onChange={e => setData('supplier_id', e.target.value)} required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Please Select</option>
                                    {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
                                </select>
                                {errors.supplier_id && <div className="text-red-500 text-xs mt-1">{errors.supplier_id}</div>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1 block">
                                    Payment Type <span className="text-red-500">*</span>
                                </label>
                                <select value={data.payment_type} onChange={e => setData('payment_type', e.target.value)} required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Please Select</option>
                                    {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {errors.payment_type && <div className="text-red-500 text-xs mt-1">{errors.payment_type}</div>}
                            </div>
                        </div>

                        {/* amount */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1 block">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} required
                                placeholder="Enter Amount"
                                className="w-full md:w-1/2 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
                        </div>

                        {/* balance */}
                        <div className="text-sm text-slate-700">
                            Balance : <span className="font-bold text-slate-900">{balance}</span>
                        </div>

                        {/* description */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1 block">Description</label>
                            <input type="text" value={data.description} onChange={e => setData('description', e.target.value)}
                                placeholder="Enter Description"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                        </div>

                        {/* submit */}
                        <div className="flex justify-end">
                            <button type="submit" disabled={processing}
                                className="bg-[#162a5b] hover:bg-[#1e3a7b] disabled:opacity-50 text-white text-sm font-bold px-8 py-2.5 rounded-lg transition-colors">
                                {processing ? 'Processing...' : 'Payment'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Last Ten Transactions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-[#162a5b] border-b-2 border-[#162a5b] pb-1">Last Ten Transactions</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
                            Shift Balance:
                            <span className="size-7 flex items-center justify-center border border-slate-300 rounded text-slate-700 font-bold">₹</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#162a5b] text-white">
                                    {['Sr No.', 'Supplier Name', 'Payment Type', 'Amount', 'Created By', 'Created Date'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {lastTen.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No transactions found</td></tr>
                                ) : (
                                    lastTen.map((t: any, i: number) => (
                                        <tr key={t.sr} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="px-4 py-2.5 text-slate-500 text-xs">{t.sr}</td>
                                            <td className="px-4 py-2.5 text-slate-700">{t.supplier_name}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{t.payment_type}</td>
                                            <td className="px-4 py-2.5 font-semibold text-slate-800">{t.amount}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{t.created_by}</td>
                                            <td className="px-4 py-2.5 text-slate-600 text-xs">{t.created_date}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
