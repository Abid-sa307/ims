import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShoppingCart, Package, Truck, CheckCircle, IndianRupee, Users, ShieldCheck, TrendingUp, Calendar, MapPin, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6'];

interface Props {
    purchaseStats: any[];
    salesStats: any[];
    supplierData: any[];
    locations: any[];
    filters: {
        location_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function Dashboard({
    purchaseStats = [],
    salesStats = [],
    supplierData = [],
    locations = [],
    filters = {}
}: Props) {
    const [view, setView] = useState<'purchase' | 'sales'>('purchase');
    const [localFilters, setLocalFilters] = useState(filters);
    const [isFilterVisible, setIsFilterVisible] = useState(true);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Auto-apply filters when location changes
        if (key === 'location_id') {
            applyFilters(newFilters);
        }
    };

    const applyFilters = (params = localFilters) => {
        router.get('/dashboard', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const resetFilters = () => {
        const emptyFilters = { location_id: '', date_from: '', date_to: '' };
        setLocalFilters(emptyFilters);
        applyFilters(emptyFilters);
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'ShoppingCart': return ShoppingCart;
            case 'CheckCircle': return CheckCircle;
            case 'Package': return Package;
            case 'Truck': return Truck;
            case 'IndianRupee': return IndianRupee;
            default: return ActivityIcon;
        }
    };

    const ActivityIcon = TrendingUp;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6 bg-gray-50/30 min-h-full">

                {/* Filter & View Switcher Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Manufacturing Summary</h1>
                            <p className="text-sm text-gray-500">Real-time performance overview and analytics.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Switcher */}
                            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex items-center overflow-hidden">
                                <button
                                    onClick={() => setView('purchase')}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2 text-[11px] font-bold transition-all duration-300 rounded-lg",
                                        view === 'purchase'
                                            ? 'bg-[#162a5b] text-white shadow-lg'
                                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                    )}
                                >
                                    <ShoppingCart className="size-3.5" />
                                    PURCHASE
                                </button>
                                <button
                                    onClick={() => setView('sales')}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2 text-[11px] font-bold transition-all duration-300 rounded-lg",
                                        view === 'sales'
                                            ? 'bg-[#162a5b] text-white shadow-lg'
                                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                    )}
                                >
                                    <TrendingUp className="size-3.5" />
                                    SALES
                                </button>
                            </div>
                            
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className={cn("rounded-xl border-gray-100 shadow-sm", isFilterVisible && "bg-gray-100")}
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                            >
                                <Filter className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Enhanced Filter Bar */}
                    {isFilterVisible && (
                        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                                            <MapPin className="size-3" /> Location / Franchise
                                        </Label>
                                        <Select 
                                            value={localFilters.location_id || 'all'} 
                                            onValueChange={(v) => handleFilterChange('location_id', v === 'all' ? '' : v)}
                                        >
                                            <SelectTrigger className="bg-white border-gray-100 rounded-lg h-9 text-xs">
                                                <SelectValue placeholder="All Locations" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Locations</SelectItem>
                                                {locations.map(loc => (
                                                    <SelectItem key={loc.id} value={loc.id.toString()}>{loc.location_legal_name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                                            <Calendar className="size-3" /> From Date
                                        </Label>
                                        <Input 
                                            type="date" 
                                            className="bg-white border-gray-100 rounded-lg h-9 text-xs" 
                                            value={localFilters.date_from || ''}
                                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                                            <Calendar className="size-3" /> To Date
                                        </Label>
                                        <Input 
                                            type="date" 
                                            className="bg-white border-gray-100 rounded-lg h-9 text-xs" 
                                            value={localFilters.date_to || ''}
                                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button 
                                            className="flex-1 bg-[#162a5b] hover:bg-[#1e3a7a] text-white rounded-lg h-9 text-xs font-bold"
                                            onClick={() => applyFilters()}
                                        >
                                            Apply Filters
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="rounded-lg h-9 w-9 text-gray-400 hover:text-red-500"
                                            onClick={resetFilters}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Dynamic Stats Grid */}
                <div className={cn(
                    "grid gap-6 md:grid-cols-2",
                    view === 'purchase' ? "lg:grid-cols-4" : "lg:grid-cols-2"
                )}>
                    {(view === 'purchase' ? purchaseStats : salesStats).map((stat, i) => {
                        const Icon = getIcon(stat.icon);
                        return (
                            <Card key={i} className={cn(
                                "overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br text-white animate-in fade-in slide-in-from-bottom-2 duration-500",
                                stat.color
                            )}>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center relative">
                                    <Icon className="absolute -bottom-2 -right-2 opacity-10 size-20" />
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{stat.title}</p>
                                    <h3 className="text-3xl font-black mt-2 tracking-tighter">{stat.value}</h3>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Dynamic Charts Section */}
                <div className="grid gap-6">
                    <Card className="bg-white border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 px-6 flex flex-row items-center justify-between">
                            <CardTitle className="text-[11px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <TrendingUp className="size-4 text-indigo-500" />
                                {view === 'purchase' ? 'Supplier Wise Distribution' : 'Sales Analytics'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid lg:grid-cols-3 gap-8 items-center">
                                {/* Chart */}
                                <div className="lg:col-span-1 h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={view === 'purchase' ? supplierData : []}
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {(view === 'purchase' ? supplierData : []).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend / List */}
                                <div className="lg:col-span-2">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {(view === 'purchase' ? supplierData : []).map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-indigo-100 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                    <span className="text-sm font-bold text-gray-700">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-black text-[#162a5b]">₹{numberWithCommas(item.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    { (view === 'purchase' ? supplierData : []).length === 0 && (
                                        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                                            <Package className="size-12 mb-2 opacity-20" />
                                            <p className="text-sm italic">No distribution data available for selected filters.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={cn("block text-sm font-medium text-gray-700", className)}>{children}</label>;
}

function numberWithCommas(x: number) {
    if (!x) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
