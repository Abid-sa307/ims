import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Invoice Configuration', href: '#' },
    { title: 'Template Master', href: '/invoice/template-master' },
];

export default function TemplateMaster() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Template Master" />
            <div className="flex h-full flex-col p-6 bg-gray-50/50">
                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Invoice Template Master</h1>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                        <Eye className="h-4 w-4" /> PREVIEW ALL
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Classic Corporate', 'Modern Minimal', 'Detailed GST'].map((tmpl) => (
                        <div key={tmpl} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                            <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                                <FileText className="size-8" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{tmpl}</h3>
                            <p className="text-xs text-gray-500 mb-6">Optimized for A4 printing</p>
                            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 border-none shadow-none text-xs font-bold">
                                SELECT TEMPLATE
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
