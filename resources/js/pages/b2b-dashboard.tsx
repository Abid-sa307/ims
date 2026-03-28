import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShoppingCart, Package, Truck, CheckCircle, IndianRupee, Users, ShieldCheck, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'B2B Dashboard',
        href: '/b2b-dashboard',
    },
];

const purchaseStats = [
    { title: 'Purchase Orders', value: '124', icon: ShoppingCart, color: 'from-blue-500 to-indigo-600' },
    { title: 'Approved Orders', value: '89', icon: CheckCircle, color: 'from-pink-500 to-rose-600' },
    { title: 'Received Orders', value: '32', icon: Package, color: 'from-amber-400 to-orange-500' },
    { title: 'Purchase Amount', value: '₹ 28.7L', icon: ShoppingCart, color: 'from-blue-600 to-blue-800' },
];

const salesStats = [
    { title: 'Dispatch Orders', value: '45', icon: Truck, color: 'from-orange-400 to-orange-600' },
    { title: 'Total Sales Amount', value: '₹ 45.2L', icon: IndianRupee, color: 'from-rose-400 to-red-500' },
];

const pieData = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 200 },
];

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981'];

const topCustomers = [
    { name: 'Acme Corp', location: 'New York', amount: '₹ 12,400' },
    { name: 'Global Tech', location: 'London', amount: '₹ 8,200' },
    { name: 'Mega Store', location: 'Mumbai', amount: '₹ 7,500' },
    { name: 'Cyberdyne', location: 'Neo Tokyo', amount: '₹ 6,100' },
    { name: 'Wayne Ent', location: 'Gotham', amount: '₹ 5,800' },
];

const topSoldiers = [
    { name: 'John Doe', location: 'Site Alpha', count: '45' },
    { name: 'Jane Smith', location: 'Site Bravo', count: '38' },
    { name: 'Mike Ross', location: 'Site Charlie', count: '32' },
    { name: 'Harvey Specter', location: 'Site Delta', count: '29' },
    { name: 'Louis Litt', location: 'Site Echo', count: '25' },
];

export default function B2BDashboard() {
    const [view, setView] = useState<'purchase' | 'sales'>('purchase');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="B2B Dashboard" />
            <div className="flex flex-col gap-6 p-6 bg-gray-50/30 min-h-full">

                {/* Header section with View Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Manufacturing Summary</h1>
                        <p className="text-sm text-gray-500">Detailed overview of your {view} performance.</p>
                    </div>

                    {/* Premium View Switcher */}
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex items-center w-full sm:w-fit overflow-hidden">
                        <button
                            onClick={() => setView('purchase')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-[11px] font-bold transition-all duration-300 rounded-lg ${view === 'purchase'
                                ? 'bg-[#162a5b] text-white shadow-[0_8px_16px_-4px_rgba(22,42,91,0.2)]'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <ShoppingCart className={`size-3.5 ${view === 'purchase' ? 'text-white' : 'text-gray-400'}`} />
                            PURCHASE
                        </button>
                        <button
                            onClick={() => setView('sales')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-[11px] font-bold transition-all duration-300 rounded-lg ${view === 'sales'
                                ? 'bg-[#162a5b] text-white shadow-[0_8px_16px_-4px_rgba(22,42,91,0.2)]'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <TrendingUp className={`size-3.5 ${view === 'sales' ? 'text-white' : 'text-gray-400'}`} />
                            SALES
                        </button>
                    </div>
                </div>

                {/* Dynamic Stats Grid */}
                <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${view === 'purchase' ? '4' : '2'}`}>
                    {(view === 'purchase' ? purchaseStats : salesStats).map((stat, i) => (
                        <Card key={i} className={`overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${stat.color} text-white animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                            <CardContent className="p-5 flex flex-col items-center justify-center text-center relative">
                                <stat.icon className="absolute top-2 right-2 opacity-15 size-12" />
                                <p className="text-[10px] font-bold opacity-90 uppercase tracking-[0.1em]">{stat.title}</p>
                                <h3 className="text-2xl font-extrabold mt-1 tracking-tight">{stat.value}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Dynamic Charts Grid */}
                <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-${view === 'purchase' ? '1' : '3'}`}>
                    {[
                        ...(view === 'purchase'
                            ? [{ title: 'Supplier Wise Purchase', data: pieData }]
                            : [
                                { title: 'Location Wise Sales', data: pieData },
                                { title: 'Category Wise Sale', data: pieData },
                                { title: 'Route Wise Sale', data: pieData },
                            ]
                        )
                    ].map((chart, i) => (
                        <Card key={i} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 animate-in fade-in zoom-in-95">
                            <CardHeader className="p-5 pb-0">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{chart.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[280px] p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chart.data}
                                            innerRadius={view === 'purchase' ? 80 : 65}
                                            outerRadius={view === 'purchase' ? 100 : 85}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chart.data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Dynamic Bottom Lists */}
                <div className="grid gap-8">
                    {view === 'purchase' ? (
                        <Card className="bg-white border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                    <ShieldCheck className="size-5 text-orange-500" />
                                    Procurement Handlers (Top 10 Soldiers)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {topSoldiers.map((sold, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{sold.name}</p>
                                                    <p className="text-xs text-gray-500">{sold.location}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-extrabold text-[#162a5b] bg-gray-100 px-3 py-1 rounded-lg">{sold.count} Items</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-white border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                    <Users className="size-5 text-blue-500" />
                                    Top 10 Revenue Customers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {topCustomers.map((cust, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-blue-50/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{cust.name}</p>
                                                    <p className="text-xs text-gray-500">{cust.location}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{cust.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

