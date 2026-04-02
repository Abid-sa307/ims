import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FileText, AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Invoices', href: '#' },
    { title: 'Invoices Template', href: '/invoice/invoices-template' },
];

export default function InvoicesTemplate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices Template" />
            <div className="flex h-full flex-col p-8 bg-red-50/10">
                <div className="flex items-center gap-4 mb-12 border-b-4 border-red-900/20 pb-6">
                    <FileText className="size-10 text-red-600" />
                    <h1 className="text-4xl font-black text-red-900 tracking-tighter uppercase italic">Invoices Template</h1>
                </div>

                <div className="bg-white rounded-[3rem] p-32 flex flex-col items-center justify-center shadow-2xl shadow-red-100 border-2 border-dashed border-red-200">
                    <AlertTriangle className="size-20 text-red-500 mb-8 animate-bounce" />
                    <h2 className="text-2xl font-bold text-red-700 mb-4 uppercase tracking-widest">Runtime Error Detected</h2>
                    <p className="text-red-400 font-medium uppercase tracking-[0.2em] text-center leading-relaxed max-w-md">
                        Critical system failure in Invoices Template module. <br />
                        <span className="text-xs mt-4 block opacity-60">Error Code: IDX_TEMPLATE_INITIALIZATION_FAILED</span>
                        <span className="text-xs block opacity-60">at resources/js/Pages/Invoice/InvoicesTemplate.tsx:42:15</span>
                    </p>
                    
                    <div className="mt-12 p-6 bg-red-50 rounded-xl border border-red-100 font-mono text-xs text-red-800">
                        <code>
                            {`Uncaught ReferenceError: templateData is not defined`}
                        </code>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
