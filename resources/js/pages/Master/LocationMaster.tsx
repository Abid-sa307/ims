import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, User, FileText, Settings, Navigation, Save, X, List, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master', href: '#' },
    { title: 'Location Master', href: '/master/location-master' },
];

interface Location {
    id: number;
    location_legal_name: string;
    city: string | null;
    contact_number: string | null;
    email: string | null;
    created_at: string;
    // ... other fields are hidden in list view
}

export default function LocationMaster({ locations = [] }: { locations: Location[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        location_type: '',
        franchise_type: '',
        location_legal_name: '',
        short_name: '',
        contact_person_name: '',
        contact_number: '',
        email: '',
        time_zone: '',
        country: '',
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
        royalty_percent: '',
        royalty_frequency: '',
        allow_order_types: [] as string[],
        default_order_type: '',
        allow_payment_types: [] as string[],
        default_payment_type: '',
        start_bill_no: '',
        default_delivery_charge: '',
        round_off_option: '',
        order_cancellation_duration: '',
        time_duration_to_edit_order: '',
        token_refreshment: '',
        po_number_format: '',
        common_preferences: '',
        fssai_number: '',
        end_day_process_time: '',
        opening_time: '',
        closing_time: '',
        business_id: '',
        product_sorting: '',
        custom_sales_invoice_series: false,
        specify_reason_for_order_cancellation: false,
        specify_reason_for_item_cancellation: false,
        sms_for_daily_sales_summary: false,
        employee_productivity_monitoring: false,
        test_mode: false,
        print_without_settlement: false,
        show_delivery_charge_on_billing: false,
        is_print_on_dispatch: false,
        strict_permission_email_purchase_order: false,
        display_location_on_dashboard: false,
        allow_order_modification_after_bill_print: false,
        enable_bank_deposit: false,
        allow_negative_sale: false,
        allow_email_notification_on_stock_transfer: false,
        enable_kds: false,
        print_item_wise_kot: false,
        enable_zomato_swiggy_integration: false,
        enable_otp_verification_for_order_discount: false,
        print_shift_report: false,
        combine_kot_print_on_save_order: false,
        supplier_id: '',
        default_warehouse_name: '',
        enable_petty_cash: false,
        route: '',
        latitude: '',
        longitude: ''
    });

    const handleCreateNew = () => {
        reset();
        clearErrors();
        setIsEditing(false);
        setViewMode('form');
    };

    const handleEdit = (location: any) => {
        setData({
            ...data,
            ...location, // Populate form with existing data
            allow_order_types: location.allow_order_types ? (typeof location.allow_order_types === 'string' ? JSON.parse(location.allow_order_types) : location.allow_order_types) : [],
            allow_payment_types: location.allow_payment_types ? (typeof location.allow_payment_types === 'string' ? JSON.parse(location.allow_payment_types) : location.allow_payment_types) : []
        });
        setIsEditing(true);
        setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this location?')) {
            destroy(`/master/location-master/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (viewMode === 'form') {
                        setViewMode('list');
                        reset();
                    }
                }
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && data.id) {
            put(`/master/location-master/${data.id}`, {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        } else {
            post('/master/location-master', {
                onSuccess: () => {
                    reset();
                    setViewMode('list');
                }
            });
        }
    };

    const toggleArrayItem = (field: 'allow_order_types' | 'allow_payment_types', value: string) => {
        const currentArr = data[field] || [];
        if (currentArr.includes(value)) {
            setData(field, currentArr.filter((i) => i !== value));
        } else {
            setData(field, [...currentArr, value]);
        }
    };

    // View: List
    if (viewMode === 'list') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Location Master" />
                <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">Location Master</h1>
                            <p className="text-sm text-gray-500">Manage all your B2B and Customer locations here.</p>
                        </div>
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#162a5b]/90 gap-2">
                            <PlusCircle className="size-4" />
                            Add Location
                        </Button>
                    </div>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="font-semibold text-gray-900">Location Name</TableHead>
                                        <TableHead className="font-semibold text-gray-900">City</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Contact</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.length > 0 ? locations.map((loc) => (
                                        <TableRow key={loc.id} className="hover:bg-gray-50/50">
                                            <TableCell className="font-medium text-[#162a5b]">{loc.location_legal_name}</TableCell>
                                            <TableCell className="text-gray-600">{loc.city || 'N/A'}</TableCell>
                                            <TableCell className="text-gray-600">
                                                <div>{loc.contact_number || 'N/A'}</div>
                                                <div className="text-xs text-gray-400">{loc.email}</div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(loc)}>
                                                    <Pencil className="size-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(loc.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                                No locations found. Click "Add Location" to create one.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    // View: Form
    const switches = [
        { key: 'specify_reason_for_order_cancellation', label: 'Specify Reason For Order Cancellation?' },
        { key: 'specify_reason_for_item_cancellation', label: 'Specify Reason For Item Cancellation?' },
        { key: 'sms_for_daily_sales_summary', label: 'SMS For Daily Sales Summary?' },
        { key: 'employee_productivity_monitoring', label: 'Employee Productivity Monitoring?' },
        { key: 'test_mode', label: 'Test Mode' },
        { key: 'print_without_settlement', label: 'Print Without Settlement ?' },
        { key: 'show_delivery_charge_on_billing', label: 'Show delivery charge on billing screen ?' },
        { key: 'is_print_on_dispatch', label: 'Is Print On Dispatch ?' },
        { key: 'strict_permission_email_purchase_order', label: 'Strict Permission To E-Mail Purchase Order ?' },
        { key: 'display_location_on_dashboard', label: 'Do You Want To Display This Location On Dashboard ?' },
        { key: 'allow_order_modification_after_bill_print', label: 'Allow Order Modification After Bill Print ?' },
        { key: 'enable_bank_deposit', label: 'Enable Bank Deposit ?' },
        { key: 'allow_negative_sale', label: 'Allow negative sale ?' },
        { key: 'allow_email_notification_on_stock_transfer', label: 'Allow Email Notification On Stock Transfer ?' },
        { key: 'enable_kds', label: 'Enable KDS ?' },
        { key: 'print_item_wise_kot', label: 'Print Item Wise KOT ?' },
        { key: 'enable_zomato_swiggy_integration', label: 'Enable Zomato/Swiggy Integration' },
        { key: 'enable_otp_verification_for_order_discount', label: 'Enable OTP Verification For Order Discount?' },
        { key: 'print_shift_report', label: 'Print Shift Report?' },
        { key: 'combine_kot_print_on_save_order', label: 'Combine KOT Print On Save Order?' },
    ];

    const allowedOrderOptions = ['Dine In', 'Take Away', 'Home Delivery', 'Zomato', 'Swiggy'];
    const allowedPaymentOptions = ['Cash', 'Wallet', 'Card Payment', 'Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay', 'Bank Transfer', 'Account', 'Free Of Cost', 'Zomato', 'Swiggy', 'Uber Eats', 'Cashfree', 'BHIM UPI', 'Online Paid', 'Razorpay', 'Tyne', 'Stripe', 'ANZ Worldline', 'Credit Card'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Location' : 'Add Location'} />
            <div className="flex flex-col p-6 max-w-7xl mx-auto space-y-6">
                
                {/* Header Navbar */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h1 className="text-xl font-bold tracking-tight text-[#162a5b] flex items-center gap-2">
                        <MapPin className="size-5" />
                        {isEditing ? 'Edit Location' : 'New Location'}
                    </h1>
                    <div className="flex gap-3">
                        <Button variant="outline" type="button" onClick={() => setViewMode('list')} className="text-gray-500 border-gray-200">
                            <X className="w-4 h-4 mr-1"/> Cancel
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={processing} className="bg-[#162a5b] hover:bg-[#162a5b]/90 text-white min-w-[120px]">
                            {processing ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Save Location</>}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                    {/* SECTION 1: Location Definition */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
                            <CardTitle className="text-sm font-semibold text-gray-800">1. Location Definition</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid md:grid-cols-4 gap-6">
                            <div className="space-y-1.5">
                                <Label>Location Type</Label>
                                <Select value={data.location_type} onValueChange={v => setData('location_type', v)}>
                                    <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="B2B">B2B</SelectItem>
                                        <SelectItem value="Customer">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Franchise Type</Label>
                                <Select value={data.franchise_type} onValueChange={v => setData('franchise_type', v)}>
                                    <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FOFO">FOFO</SelectItem>
                                        <SelectItem value="FOCO">FOCO</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[#162a5b]">Location (Legal Name) *</Label>
                                <Input value={data.location_legal_name} onChange={e => setData('location_legal_name', e.target.value)} placeholder="Enter Location Legal Name" className="border-blue-100 focus-visible:ring-blue-500" />
                                {errors.location_legal_name && <p className="text-xs text-red-500">{errors.location_legal_name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Short Name</Label>
                                <Input value={data.short_name} onChange={e => setData('short_name', e.target.value)} placeholder="Enter Short Name" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: Contact Information */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
                            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2"><User className="size-4"/> Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1.5"><Label>Contact Person Name</Label><Input value={data.contact_person_name} onChange={e=>setData('contact_person_name', e.target.value)} placeholder="Enter Contact Person Name" /></div>
                            <div className="space-y-1.5"><Label>Contact Number</Label><Input value={data.contact_number} onChange={e=>setData('contact_number', e.target.value)} placeholder="Enter Contact Number" /></div>
                            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={data.email} onChange={e=>setData('email', e.target.value)} placeholder="Enter Email" /></div>
                            <div className="space-y-1.5">
                                <Label>Time Zone</Label>
                                <Select value={data.time_zone} onValueChange={v => setData('time_zone', v)}>
                                    <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                    <SelectContent><SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Country</Label>
                                <Select value={data.country} onValueChange={v => setData('country', v)}>
                                    <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                    <SelectContent><SelectItem value="India">India</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>State</Label>
                                <Select value={data.state} onValueChange={v => setData('state', v)}>
                                    <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                    <SelectContent><SelectItem value="Gujarat">Gujarat</SelectItem><SelectItem value="Maharashtra">Maharashtra</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>City</Label>
                                <Select value={data.city} onValueChange={v => setData('city', v)}>
                                    <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                    <SelectContent><SelectItem value="Ahmedabad">Ahmedabad</SelectItem><SelectItem value="Surat">Surat</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5"><Label>Pincode</Label><Input value={data.pincode} onChange={e=>setData('pincode', e.target.value)} placeholder="Enter Pincode" /></div>
                            <div className="space-y-1.5 lg:col-span-1"><Label>Address</Label><Input value={data.address} onChange={e=>setData('address', e.target.value)} placeholder="Enter Location Address" /></div>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: Taxation Information */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
                            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2"><FileText className="size-4"/> Taxation Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-6 gap-6">
                            <div className="space-y-1.5 lg:col-span-3"><Label>GST No</Label><Input value={data.gst_no} onChange={e=>setData('gst_no', e.target.value)} placeholder="ENTER GST NUMBER" /></div>
                            <div className="space-y-1.5 lg:col-span-3"><Label>PAN No</Label><Input value={data.pan_no} onChange={e=>setData('pan_no', e.target.value)} placeholder="Enter PAN" /></div>
                            <div className="space-y-1.5 lg:col-span-3"><Label>CST No</Label><Input value={data.cst_no} onChange={e=>setData('cst_no', e.target.value)} placeholder="Enter CST Number" /></div>
                            <div className="space-y-1.5 lg:col-span-3"><Label>Service Tax No</Label><Input value={data.service_tax_no} onChange={e=>setData('service_tax_no', e.target.value)} placeholder="Enter Service Tax Number" /></div>
                            <div className="space-y-1.5 lg:col-span-3"><Label>TIN No</Label><Input value={data.tin_no} onChange={e=>setData('tin_no', e.target.value)} placeholder="Enter TIN No" /></div>
                            <div className="space-y-1.5 lg:col-span-3"><Label>VAT No</Label><Input value={data.vat_no} onChange={e=>setData('vat_no', e.target.value)} placeholder="Enter Vat Number" /></div>
                            <div className="space-y-1.5 lg:col-span-2"><Label>PF No</Label><Input value={data.pf_no} onChange={e=>setData('pf_no', e.target.value)} placeholder="Enter PF Number" /></div>
                            <div className="space-y-1.5 lg:col-span-2"><Label>Royalty (%)</Label><Input type="number" step="0.01" value={data.royalty_percent} onChange={e=>setData('royalty_percent', e.target.value)} placeholder="Enter Royalty Percentage" /></div>
                            <div className="space-y-1.5 lg:col-span-2">
                                <Label>Royalty Frequency</Label>
                                <Select value={data.royalty_frequency} onValueChange={v => setData('royalty_frequency', v)}>
                                    <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                    <SelectContent><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Yearly">Yearly</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 4: Configuration */}
                    <Card className="border-[#162a5b]/20 shadow-sm border-t-2 border-t-[#162a5b]">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
                            <CardTitle className="text-sm font-semibold text-[#162a5b] flex items-center gap-2"><Settings className="size-4"/> Core Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                            
                            {/* Left Config Column */}
                            <div className="space-y-6">
                                {/* Order Settings */}
                                <div className="space-y-3">
                                    <Label className="text-[#162a5b] font-semibold">Allow Order Types</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {allowedOrderOptions.map(opt => (
                                            <div 
                                                key={opt} 
                                                onClick={() => toggleArrayItem('allow_order_types', opt)}
                                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors border ${data.allow_order_types.includes(opt) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                {opt} {data.allow_order_types.includes(opt) && '✓'}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2">
                                        <Label className="text-xs">Default Order Type</Label>
                                        <Select value={data.default_order_type} onValueChange={v => setData('default_order_type', v)}>
                                            <SelectTrigger className="h-8 mt-1"><SelectValue placeholder="Take Away"/></SelectTrigger>
                                            <SelectContent>{allowedOrderOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Separator />
                                {/* System Params */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5"><Label>Start Bill No</Label><Input value={data.start_bill_no} onChange={e=>setData('start_bill_no', e.target.value)} placeholder="0" /></div>
                                    <div className="space-y-1.5">
                                        <Label>Round Off Option</Label>
                                        <Select value={data.round_off_option} onValueChange={v => setData('round_off_option', v)}>
                                            <SelectTrigger><SelectValue placeholder="Round Normal"/></SelectTrigger>
                                            <SelectContent><SelectItem value="Round Normal">Round Normal</SelectItem><SelectItem value="Ceil">Ceil</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5"><Label>Time Duration To Edit Order (Min)</Label><Input type="number" value={data.time_duration_to_edit_order} onChange={e=>setData('time_duration_to_edit_order', e.target.value)} placeholder="e.g. 15" /></div>
                                    <div className="space-y-1.5">
                                        <Label>PO Number Format</Label>
                                        <Select value={data.po_number_format} onValueChange={v => setData('po_number_format', v)}>
                                            <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                            <SelectContent><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Custom">Custom</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-1.5"><Label>FSSAI Number</Label><Input value={data.fssai_number} onChange={e=>setData('fssai_number', e.target.value)} placeholder="Enter FSSAI Number" /></div>
                                
                                <div className="space-y-3 pt-3">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Timings</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Opening Time</Label><Input type="time" value={data.opening_time} onChange={e=>setData('opening_time', e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label>Closing Time</Label><Input type="time" value={data.closing_time} onChange={e=>setData('closing_time', e.target.value)} /></div>
                                        <div className="space-y-1.5 col-span-2"><Label>End Day Should Process Only After</Label><Input type="time" value={data.end_day_process_time} onChange={e=>setData('end_day_process_time', e.target.value)} /></div>
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5"><Label>Business Id</Label><Input value={data.business_id} onChange={e=>setData('business_id', e.target.value)} placeholder="Please Define Business Id" /></div>
                                
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Label>Custom Sales Invoice Series</Label>
                                    <Switch checked={data.custom_sales_invoice_series} onCheckedChange={(c) => setData('custom_sales_invoice_series', c)} />
                                </div>
                            </div>
                            
                            {/* Right Config Column */}
                            <div className="space-y-6">
                                {/* Payment Settings */}
                                <div className="space-y-3">
                                    <Label className="text-[#162a5b] font-semibold">Allow Payment Types</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {allowedPaymentOptions.map(opt => (
                                            <div 
                                                key={opt} 
                                                onClick={() => toggleArrayItem('allow_payment_types', opt)}
                                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors border ${data.allow_payment_types.includes(opt) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                {opt} {data.allow_payment_types.includes(opt) && '✓'}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2">
                                        <Label className="text-xs">Default Payment Type</Label>
                                        <Select value={data.default_payment_type} onValueChange={v => setData('default_payment_type', v)}>
                                            <SelectTrigger className="h-8 mt-1"><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                            <SelectContent>{allowedPaymentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5"><Label>Default Delivery Charge</Label><Input type="number" step="0.01" value={data.default_delivery_charge} onChange={e=>setData('default_delivery_charge', e.target.value)} placeholder="0.00" /></div>
                                    <div className="space-y-1.5"><Label>Order Cancellation Duration (Min)</Label><Input type="number" value={data.order_cancellation_duration} onChange={e=>setData('order_cancellation_duration', e.target.value)} placeholder="e.g. 5" /></div>
                                    <div className="space-y-1.5">
                                        <Label>Token Refreshment</Label>
                                        <Select value={data.token_refreshment} onValueChange={v => setData('token_refreshment', v)}>
                                            <SelectTrigger><SelectValue placeholder="Daily"/></SelectTrigger>
                                            <SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Never">Never</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Common Preferences</Label>
                                        <Select value={data.common_preferences} onValueChange={v => setData('common_preferences', v)}>
                                            <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                            <SelectContent><SelectItem value="Default">Default</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Mega Switch List */}
                                <div className="pt-4 space-y-3">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Advanced Rules & Flags</Label>
                                    <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 bg-[#fafafa]">
                                        {switches.map((sw) => (
                                            <div key={sw.key} className="flex items-center justify-between py-2 px-3 hover:bg-white tranasition-colors">
                                                <Label className="text-[11px] font-medium text-gray-700 cursor-pointer">{sw.label}</Label>
                                                {/* @ts-ignore dynamic key access */}
                                                <Switch checked={data[sw.key] as boolean} onCheckedChange={(c) => setData(sw.key as any, c)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* SECTION 5: Extenders (Supplier, Warehouse, Petty Cash, Routing) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3"><CardTitle className="text-sm font-semibold text-gray-800">Supplier Mapping</CardTitle></CardHeader>
                            <CardContent className="p-4 space-y-1.5">
                                <Label>Supplier</Label>
                                <Select value={data.supplier_id} onValueChange={v => setData('supplier_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="None selected"/></SelectTrigger>
                                    <SelectContent><SelectItem value="1">Supplier Alpha</SelectItem></SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3"><CardTitle className="text-sm font-semibold text-gray-800">Ware House</CardTitle></CardHeader>
                            <CardContent className="p-4 space-y-1.5">
                                <Label>Default Ware House Name</Label>
                                <Input value={data.default_warehouse_name} onChange={e=>setData('default_warehouse_name', e.target.value)} placeholder="Main Warehouse" />
                            </CardContent>
                        </Card>

                        <Card className="border-red-100 bg-red-50/30 shadow-sm">
                            <CardHeader className="bg-red-50/80 border-b border-red-100 py-3"><CardTitle className="text-sm font-semibold text-red-900">Petty Cash</CardTitle></CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Switch checked={data.enable_petty_cash} onCheckedChange={(c) => setData('enable_petty_cash', c)} />
                                    <Label className="font-bold">Enable Petty Cash</Label>
                                </div>
                                <p className="text-[10px] font-semibold text-red-600">Note: If You Enable Petty Cash Then Your Expenses Will Always Be Deducted From Petty Cash.</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-gray-100 shadow-sm md:col-span-3 xl:col-span-1">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3"><CardTitle className="text-sm font-semibold text-gray-800 flex gap-2"><Navigation className="size-4"/> Routing</CardTitle></CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Route</Label>
                                    <Select value={data.route} onValueChange={v => setData('route', v)}>
                                        <SelectTrigger><SelectValue placeholder="--Please Select--"/></SelectTrigger>
                                        <SelectContent><SelectItem value="Route_A">Route A</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5"><Label>Latitude</Label><Input type="number" step="0.0000001" value={data.latitude} onChange={e=>setData('latitude', e.target.value)} placeholder="0.000" /></div>
                                    <div className="space-y-1.5"><Label>Longitude</Label><Input type="number" step="0.0000001" value={data.longitude} onChange={e=>setData('longitude', e.target.value)} placeholder="0.000" /></div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
