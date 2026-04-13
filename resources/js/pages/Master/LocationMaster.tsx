import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, Save, X, PlusCircle, Pencil, Trash2, Navigation, Plus, Minus, Building2, Mail, Phone, FileText, Settings2, Lock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master', href: '#' },
    { title: 'Location Master', href: '/master/location-master' },
];

interface Location {
    id: number;
    location_type: string | null;
    location_legal_name: string;
    city: string | null;
    contact_number: string | null;
    email: string | null;
}

interface Supplier {
    id: number;
    supplier_name: string;
}

const statesOfIndia = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
    'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
    'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
];

// Section heading component
function SectionHeading({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#162a5b]/10">
                <Icon className="size-4 text-[#162a5b]" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-[#162a5b]">{title}</h3>
                {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
            </div>
        </div>
    );
}

// Field component for consistent styling
function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            {children}
            {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        </div>
    );
}

export default function LocationMaster({ locations = [], suppliers = [] }: { locations: Location[]; suppliers: Supplier[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [ccEmailInput, setCcEmailInput] = useState('');
    const [ccEmails, setCcEmails] = useState<string[]>([]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        location_type: '',
        location_legal_name: '',
        short_name: '',
        contact_person_name: '',
        contact_number: '',
        email: '',
        time_zone: 'Asia/Kolkata',
        country: 'India',
        state: '',
        city: '',
        pincode: '',
        address: '',
        gst_no: '',
        pan_no: '',
        cst_no: '',
        service_tax_no: '',
        tin_no: '',
        vat_no: '',
        pf_no: '',
        fssai_number: '',
        email_sales_order: false,
        invoice_cc_emails: [] as string[],
        supplier_id: '',
        default_warehouse_name: '',
        route: '',
        latitude: '',
        longitude: '',
        strict_permission_email_purchase_order: false,
        allow_email_notification_on_stock_transfer: false,
        email_po_approval: '',
        email_so_approval: '',
    });

    // Auto-sync warehouse name with location legal name
    useEffect(() => {
        setData('default_warehouse_name', data.location_legal_name);
    }, [data.location_legal_name]);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!data.location_type) errs.location_type = 'Location type is required.';
        if (!data.location_legal_name.trim()) errs.location_legal_name = 'Location legal name is required.';
        if (!data.contact_number.trim()) errs.contact_number = 'Contact number is required.';
        if (!data.state) errs.state = 'State is required.';
        if (!data.city.trim()) errs.city = 'City is required.';
        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleCreateNew = () => {
        reset(); clearErrors(); setValidationErrors({});
        setCcEmails([]); setCcEmailInput('');
        setIsEditing(false); setViewMode('form');
    };

    const handleEdit = (location: any) => {
        const existing = Array.isArray(location.invoice_cc_emails) ? location.invoice_cc_emails : [];
        setData({ ...data, ...location, invoice_cc_emails: existing });
        setCcEmails(existing); setCcEmailInput(''); setValidationErrors({});
        setIsEditing(true); setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this location?')) {
            destroy(`/master/location-master/${id}`, { preserveScroll: true });
        }
    };

    const addCcEmail = () => {
        const trimmed = ccEmailInput.trim();
        if (!trimmed || ccEmails.includes(trimmed)) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
        const updated = [...ccEmails, trimmed];
        setCcEmails(updated); setData('invoice_cc_emails', updated); setCcEmailInput('');
    };

    const removeCcEmail = (email: string) => {
        const updated = ccEmails.filter(e => e !== email);
        setCcEmails(updated); setData('invoice_cc_emails', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const options = { onSuccess: () => { reset(); setCcEmails([]); setViewMode('list'); } };
        if (isEditing && data.id) put(`/master/location-master/${data.id}`, options);
        else post('/master/location-master', options);
    };

    const err = (field: string) => validationErrors[field] || (errors as any)[field];
    const isCustomer = data.location_type === 'Customer';
    const isHQ = data.location_type === 'HQ';

    // ─── LIST VIEW ────────────────────────────────────────────
    if (viewMode === 'list') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Location Master" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
                    {/* Hero Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-xl bg-[#162a5b] shadow-lg">
                                    <MapPin className="size-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#162a5b]">Location Master</h1>
                            </div>
                            <p className="text-sm text-gray-500 ml-12">Manage Customer and HQ locations. Each location auto-creates a warehouse &amp; supplier.</p>
                        </div>
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#1e3a7b] text-white shadow-lg gap-2 h-10 px-5 font-bold">
                            <PlusCircle className="size-4" /> Add Location
                        </Button>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { label: 'Total Locations', value: locations.length, color: 'from-blue-600 to-[#162a5b]' },
                            { label: 'Customer Locations', value: locations.filter(l => l.location_type === 'Customer').length, color: 'from-emerald-500 to-teal-700' },
                            { label: 'HQ Locations', value: locations.filter(l => l.location_type === 'HQ').length, color: 'from-violet-500 to-purple-700' },
                        ].map(stat => (
                            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-md`}>
                                <p className="text-3xl font-black">{stat.value}</p>
                                <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">All Locations</p>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">Location Name</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">Type</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">City</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">Contact</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {locations.length > 0 ? locations.map((loc) => (
                                    <TableRow key={loc.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-[#162a5b]/10 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="size-3.5 text-[#162a5b]" />
                                                </div>
                                                <span className="font-bold text-[#162a5b]">{loc.location_legal_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                                loc.location_type === 'HQ'
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                            }`}>
                                                {loc.location_type || '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-600 font-medium">{loc.city || '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm text-gray-700 flex items-center gap-1"><Phone className="size-3 text-gray-400" />{loc.contact_number || '—'}</span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1"><Mail className="size-3" />{loc.email || '—'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(loc)} className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(loc.id)} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500">
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <MapPin className="size-10 opacity-20" />
                                                <p className="font-medium">No locations yet</p>
                                                <Button onClick={handleCreateNew} variant="outline" size="sm" className="gap-1">
                                                    <PlusCircle className="size-3.5" /> Add Location
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // ─── FORM VIEW ────────────────────────────────────────────
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Location' : 'Add Location'} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

                {/* Sticky top bar */}
                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-[#162a5b]">
                            <MapPin className="size-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-black text-[#162a5b]">{isEditing ? 'Edit Location' : 'New Location'}</h1>
                            {data.location_legal_name && (
                                <p className="text-[11px] text-gray-400">{data.location_legal_name}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="h-9 text-gray-500 border-gray-200 hover:border-gray-300">
                            <X className="w-4 h-4 mr-1.5" /> Cancel
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={processing} className="h-9 bg-[#162a5b] hover:bg-[#1e3a7b] text-white px-6 font-bold shadow-md">
                            {processing ? (
                                <span className="flex items-center gap-2"><span className="animate-spin size-3.5 border-2 border-white/30 border-t-white rounded-full" />Saving...</span>
                            ) : (
                                <><Save className="w-4 h-4 mr-1.5" /> Save Location</>
                            )}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-8 space-y-6 pb-24">

                    {/* ── Section 1: Location Identity ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-2">
                            <SectionHeading icon={Building2} title="Location Identity" subtitle="Basic identification for this location record" />
                        </div>
                        <div className="px-6 pb-6 grid md:grid-cols-3 gap-5">
                            <Field label="Location Type" required error={err('location_type')}>
                                <Select value={data.location_type} onValueChange={v => setData('location_type', v)}>
                                    <SelectTrigger className={`${err('location_type') ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200'} bg-gray-50 focus:bg-white`}>
                                        <SelectValue placeholder="-- Select Type --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Customer">
                                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" />Customer</span>
                                        </SelectItem>
                                        <SelectItem value="HQ">
                                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500" />HQ</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Location Legal Name" required error={err('location_legal_name')}>
                                <Input
                                    value={data.location_legal_name}
                                    onChange={e => setData('location_legal_name', e.target.value)}
                                    placeholder="Enter official legal name"
                                    className={`${err('location_legal_name') ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200'} bg-gray-50 focus:bg-white`}
                                />
                            </Field>
                            <Field label="Short Name / Code">
                                <Input value={data.short_name} onChange={e => setData('short_name', e.target.value)} placeholder="e.g. LOC-001" className="border-gray-200 bg-gray-50 focus:bg-white" />
                            </Field>
                        </div>
                    </div>

                    {/* ── Section 2: Contact ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-2">
                            <SectionHeading icon={Phone} title="Contact Information" subtitle="Primary contact details for this location" />
                        </div>
                        <div className="px-6 pb-6 grid md:grid-cols-3 gap-5">
                            <Field label="Contact Person">
                                <Input value={data.contact_person_name} onChange={e => setData('contact_person_name', e.target.value)} placeholder="Full name" className="border-gray-200 bg-gray-50 focus:bg-white" />
                            </Field>
                            <Field label="Contact Number" required error={err('contact_number')}>
                                <Input value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} placeholder="+91 98765 43210" className={`${err('contact_number') ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white`} />
                            </Field>
                            <Field label="Email Address">
                                <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@company.com" className="border-gray-200 bg-gray-50 focus:bg-white" />
                            </Field>
                            <Field label="State" required error={err('state')}>
                                <Select value={data.state} onValueChange={v => setData('state', v)}>
                                    <SelectTrigger className={`${err('state') ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white`}>
                                        <SelectValue placeholder="-- Select State --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statesOfIndia.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="City" required error={err('city')}>
                                <Input value={data.city} onChange={e => setData('city', e.target.value)} placeholder="City name" className={`${err('city') ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white`} />
                            </Field>
                            <Field label="Pincode">
                                <Input value={data.pincode} onChange={e => setData('pincode', e.target.value)} placeholder="6-digit pincode" className="border-gray-200 bg-gray-50 focus:bg-white" />
                            </Field>
                            <div className="md:col-span-3">
                                <Field label="Full Address">
                                    <Input value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Door no, Street, Area, Landmark" className="border-gray-200 bg-gray-50 focus:bg-white" />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 3: Taxation ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-2">
                            <SectionHeading icon={FileText} title="Taxation Information" subtitle="Tax and registration numbers for compliance" />
                        </div>
                        <div className="px-6 pb-6 grid md:grid-cols-4 gap-5">
                            {[
                                { label: 'GST No', key: 'gst_no', placeholder: '22AAAAA0000A1Z5' },
                                { label: 'PAN No', key: 'pan_no', placeholder: 'ABCDE1234F' },
                                { label: 'CST No', key: 'cst_no', placeholder: 'CST Number' },
                                { label: 'Service Tax No', key: 'service_tax_no', placeholder: 'Service Tax' },
                                { label: 'TIN No', key: 'tin_no', placeholder: 'TIN Number' },
                                { label: 'VAT No', key: 'vat_no', placeholder: 'VAT Number' },
                                { label: 'PF No', key: 'pf_no', placeholder: 'PF Number' },
                                { label: 'FSSAI No', key: 'fssai_number', placeholder: 'FSSAI License' },
                            ].map(f => (
                                <Field key={f.key} label={f.label}>
                                    <Input
                                        value={(data as any)[f.key]}
                                        onChange={e => setData(f.key as any, e.target.value)}
                                        placeholder={f.placeholder}
                                        className="border-gray-200 bg-gray-50 focus:bg-white font-mono text-sm"
                                    />
                                </Field>
                            ))}
                        </div>
                    </div>

                    {/* ── Section 4: Auto-setup info banner ── */}
                    {data.location_legal_name && (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 flex items-start gap-3">
                            <div className="p-1.5 rounded-lg bg-blue-100 mt-0.5"><Lock className="size-3.5 text-blue-600" /></div>
                            <div>
                                <p className="text-sm font-bold text-blue-800">Auto-setup on Save</p>
                                <p className="text-[12px] text-blue-600 mt-0.5">
                                    A warehouse named <strong>"{data.location_legal_name}"</strong> and a supplier entry will be automatically created when you save this location.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Section 5: Configuration — conditional ── */}
                    {data.location_type && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 pt-6 pb-2">
                                <SectionHeading
                                    icon={Settings2}
                                    title={`${data.location_type} Configuration`}
                                    subtitle={isCustomer ? 'Invoice email settings for this customer' : 'Operational settings for this HQ location'}
                                />
                            </div>
                            <div className="px-6 pb-6">

                                {/* CUSTOMER */}
                                {isCustomer && (
                                    <div className="max-w-xl space-y-5">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">Email Sales Invoice to Customer</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">Auto-send invoice PDF by email when a sales order is created.</p>
                                            </div>
                                            <Switch checked={data.email_sales_order} onCheckedChange={c => setData('email_sales_order', c)} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[12px] font-black text-gray-600 uppercase tracking-wide">CC Email Addresses</Label>
                                            <p className="text-[11px] text-gray-400">Add multiple recipients to be CC'd on every sales invoice for this customer.</p>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="email"
                                                    value={ccEmailInput}
                                                    onChange={e => setCcEmailInput(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCcEmail(); } }}
                                                    placeholder="e.g. manager@company.com"
                                                    className="flex-1 border-gray-200 bg-gray-50 focus:bg-white"
                                                />
                                                <Button type="button" onClick={addCcEmail} className="bg-[#162a5b] hover:bg-[#1e3a7b] text-white gap-1 px-4">
                                                    <Plus className="size-3.5" /> Add
                                                </Button>
                                            </div>
                                            {ccEmails.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {ccEmails.map(email => (
                                                        <span key={email} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold">
                                                            <Mail className="size-3" />{email}
                                                            <button type="button" onClick={() => removeCcEmail(email)} className="hover:text-red-500 transition-colors ml-0.5">
                                                                <X className="size-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* HQ */}
                                {isHQ && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            <Field label="Supplier Mapping">
                                                <Select value={data.supplier_id} onValueChange={v => setData('supplier_id', v)}>
                                                    <SelectTrigger className="border-gray-200 bg-gray-50 focus:bg-white"><SelectValue placeholder="-- None --" /></SelectTrigger>
                                                    <SelectContent>
                                                        {suppliers.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.supplier_name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </Field>

                                            <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                <Label className="text-[12px] font-black text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                                                    <Navigation className="size-3.5 text-[#162a5b]" /> Route & GPS Coordinates
                                                </Label>
                                                <Input value={data.route} onChange={e => setData('route', e.target.value)} placeholder="Route name" className="border-gray-200 bg-white" />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1"><Label className="text-[11px] text-gray-500">Latitude</Label><Input type="number" step="0.0000001" value={data.latitude} onChange={e => setData('latitude', e.target.value)} placeholder="0.000000" className="border-gray-200 bg-white font-mono" /></div>
                                                    <div className="space-y-1"><Label className="text-[11px] text-gray-500">Longitude</Label><Input type="number" step="0.0000001" value={data.longitude} onChange={e => setData('longitude', e.target.value)} placeholder="0.000000" className="border-gray-200 bg-white font-mono" /></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <Field label="PO Approval Notification Email">
                                                <Input type="email" value={data.email_po_approval} onChange={e => setData('email_po_approval', e.target.value)} placeholder="accounts@company.com" className="border-gray-200 bg-gray-50 focus:bg-white" />
                                            </Field>
                                            <Field label="SO Approval Notification Email">
                                                <Input type="email" value={data.email_so_approval} onChange={e => setData('email_so_approval', e.target.value)} placeholder="sales@company.com" className="border-gray-200 bg-gray-50 focus:bg-white" />
                                            </Field>

                                            <div className="rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                                                {[
                                                    { key: 'strict_permission_email_purchase_order', label: 'Strict Permission — Email Purchase Order', desc: 'Require approval before emailing POs to suppliers.' },
                                                    { key: 'allow_email_notification_on_stock_transfer', label: 'Email Notification — Stock Transfers', desc: 'Send email on every stock transfer action.' },
                                                    { key: 'email_sales_order', label: 'Email Sales Order to Customer', desc: 'Auto-email invoice when a sales order is placed.' },
                                                ].map((sw) => (
                                                    <div key={sw.key} className="flex items-start justify-between py-3.5 px-4 gap-4 bg-gray-50/40 hover:bg-white transition-colors">
                                                        <div>
                                                            <p className="text-[13px] font-semibold text-gray-800">{sw.label}</p>
                                                            <p className="text-[11px] text-gray-400 mt-0.5">{sw.desc}</p>
                                                        </div>
                                                        {/* @ts-ignore */}
                                                        <Switch checked={data[sw.key] as boolean} onCheckedChange={c => setData(sw.key as any, c)} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
