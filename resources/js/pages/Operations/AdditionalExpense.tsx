import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit2, Trash2, Calendar, IndianRupee, Tag, Info, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operations', href: '#' },
    { title: 'Additional Expenses', href: '/operations/additional-expenses' },
];

interface Props {
    expenses: {
        data: any[];
        total: number;
        from: number;
        to: number;
    };
    locations: any[];
    filters: {
        search?: string;
    };
}

export default function AdditionalExpense({ expenses, locations = [], filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        expense_name: '',
        expense_date: new Date().toISOString().split('T')[0],
        amount: '',
        location_id: '',
        category: '',
        remarks: '',
    });

    const handleSearch = () => {
        router.get('/operations/additional-expenses', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingExpense(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (expense: any) => {
        setEditingExpense(expense);
        setData({
            expense_name: expense.expense_name,
            expense_date: expense.expense_date,
            amount: expense.amount.toString(),
            location_id: expense.location_id.toString(),
            category: expense.category || '',
            remarks: expense.remarks || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingExpense) {
            put(`/operations/additional-expenses/${editingExpense.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/operations/additional-expenses', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this expense record?')) {
            router.delete(`/operations/additional-expenses/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Additional Expenses" />
            <div className="flex h-full flex-col p-6 bg-gray-50/30 min-h-screen gap-6">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-t-2 border-t-[#162a5b] bg-white p-6 shadow-sm rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                            <IndianRupee className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Additional Expenses</h1>
                            <p className="text-sm text-gray-500 font-medium">Record and manage miscellaneous operational expenditures.</p>
                        </div>
                    </div>
                    <Button onClick={openCreateModal} className="h-10 bg-[#162a5b] hover:bg-[#1c3a7a] gap-2 font-bold uppercase tracking-wider shadow-lg shadow-indigo-100">
                        <Plus className="size-4" /> Add New Expense
                    </Button>
                </div>

                {/* Filter Section */}
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input 
                                    className="pl-9 h-11 border-gray-200 text-sm focus-visible:ring-indigo-500" 
                                    placeholder="Search by Expense Name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch} variant="outline" className="h-11 px-8 font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-50 transition-all">
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="border shadow-sm bg-white overflow-hidden rounded-xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-gray-600 font-bold text-[11px] uppercase tracking-widest border-b">
                                    <tr>
                                        <th className="px-8 py-5">Expense Name</th>
                                        <th className="px-8 py-5">Category</th>
                                        <th className="px-8 py-5">Location</th>
                                        <th className="px-8 py-5 text-right">Amount</th>
                                        <th className="px-8 py-5 text-center">Date</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {expenses.data.length > 0 ? (
                                        expenses.data.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5 font-bold text-gray-900 uppercase tracking-tight">{expense.expense_name}</td>
                                                <td className="px-8 py-5">
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-tighter">
                                                        {expense.category || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-gray-500 font-medium italic text-xs">{expense.location?.location_legal_name}</td>
                                                <td className="px-8 py-5 text-right font-black text-[#162a5b]">
                                                    ₹ {Number(expense.amount).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-5 text-center text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                    {new Date(expense.expense_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 shadow-sm"
                                                            onClick={() => openEditModal(expense)}
                                                        >
                                                            <Edit2 className="size-3.5 text-blue-600" />
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 w-8 p-0 border-gray-200 hover:bg-red-50 shadow-sm"
                                                            onClick={() => handleDelete(expense.id)}
                                                        >
                                                            <Trash2 className="size-3.5 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-300">
                                                    <IndianRupee className="size-16 mb-4 opacity-10" />
                                                    <p className="text-base font-bold text-gray-400 uppercase tracking-widest">No expense records found.</p>
                                                    <Button onClick={openCreateModal} variant="link" className="text-indigo-600 font-bold mt-2">Add your first expense</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination Stats */}
                <div className="flex items-center justify-between px-2 text-sm text-gray-500 font-medium">
                    <div>
                        Showing <span className="text-gray-900">{expenses.from || 0}</span> to <span className="text-gray-900">{expenses.to || 0}</span> of <span className="text-gray-900">{expenses.total}</span> records
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-200">
                            <div className="bg-[#162a5b] p-6 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-xl">
                                        <IndianRupee className="size-5" />
                                    </div>
                                    <h2 className="text-lg font-black uppercase italic tracking-tighter">
                                        {editingExpense ? 'Edit Expense Record' : 'Record New Expense'}
                                    </h2>
                                </div>
                                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expense Name / Title <span className="text-red-500">*</span></Label>
                                        <Input 
                                            className="h-11 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                            placeholder="e.g., Office Stationery, Tea & Coffee"
                                            value={data.expense_name}
                                            onChange={e => setData('expense_name', e.target.value)}
                                            required
                                        />
                                        {errors.expense_name && <p className="text-red-500 text-[10px] font-bold italic">{errors.expense_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expense Date <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input 
                                                type="date"
                                                className="h-11 pl-10 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                                value={data.expense_date}
                                                onChange={e => setData('expense_date', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount (INR) <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input 
                                                type="number"
                                                className="h-11 pl-10 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
                                                placeholder="0.00"
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.amount && <p className="text-red-500 text-[10px] font-bold italic">{errors.amount}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Branch / Location <span className="text-red-500">*</span></Label>
                                        <select 
                                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            value={data.location_id}
                                            onChange={e => setData('location_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Branch</option>
                                            {locations.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.location_legal_name}</option>
                                            ))}
                                        </select>
                                        {errors.location_id && <p className="text-red-500 text-[10px] font-bold italic">{errors.location_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input 
                                                className="h-11 pl-10 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                                placeholder="e.g., Office, Pantry"
                                                value={data.category}
                                                onChange={e => setData('category', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Remarks</Label>
                                        <div className="relative">
                                            <Info className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <textarea 
                                                className="w-full min-h-[80px] pl-10 pt-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                                                placeholder="Any additional details..."
                                                value={data.remarks}
                                                onChange={e => setData('remarks', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={closeModal} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="flex-1 h-12 bg-[#162a5b] hover:bg-[#1c3a7a] text-white rounded-xl font-black uppercase tracking-widest italic shadow-xl shadow-indigo-900/20 transition-all hover:translate-y-[-2px] active:translate-y-0">
                                        {processing ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Save Expense')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
