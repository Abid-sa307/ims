import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Printer, RefreshCw } from 'lucide-react';

interface BaseReportProps {
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
    filters?: React.ReactNode;
    summaryCards?: React.ReactNode;
    children: React.ReactNode;
    onRefresh?: () => void;
    onExport?: () => void;
    onPrint?: () => void;
}

export default function BaseReport({
    title,
    subtitle,
    breadcrumbs,
    filters,
    summaryCards,
    children,
    onRefresh,
    onExport,
    onPrint
}: BaseReportProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex flex-col gap-6 p-6 bg-slate-50/50 min-h-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onRefresh} className="h-9 bg-white">
                            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={onExport} className="h-9 bg-white">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button variant="outline" size="sm" onClick={onPrint} className="h-9 bg-white px-3">
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Summary Section */}
                {summaryCards && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {summaryCards}
                    </div>
                )}

                {/* Filter Section */}
                {filters && (
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader className="pb-3 pt-4 px-4 border-b">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Filter className="h-4 w-4" /> Filter Options
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {filters}
                        </CardContent>
                    </Card>
                )}

                {/* Main Content (Table) */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <CardContent className="p-0">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
