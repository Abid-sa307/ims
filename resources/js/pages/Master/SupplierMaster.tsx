import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { List, Image as ImageIcon, Plus, Trash2, Edit } from 'lucide-react';
import { useState, useRef } from 'react';

// Define the Supplier type
interface Supplier {
    id: number;
    supplier_name: string;
    country: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    location: string | null;
    location_id: number | null;
    gst_number: string | null;
    pan: string | null;
    vat_number: string | null;
    lut_number: string | null;
    fda_registration_number: string | null;
    contact_number: string | null;
    email: string | null;
    pincode: string | null;
    supplier_code_tally: string | null;
    contact_person_name: string | null;
    logo: string | null;
    cut_off_from_time: string | null;
    cut_off_to_time: string | null;
    allow_modify_moq: boolean;
    enable_order_level_tax: boolean;
    disable_rounding_off: boolean;
    reduce_qty_with_packaging_material: boolean;
    enable_credit_limit: boolean;
    dispatch_only_prepaid_orders: boolean;
    enable_royalty_service: boolean;
}

interface Location {
    id: number;
    location_legal_name: string;
    location_type: string | null;
}

const statesOfIndia = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
];

interface Props {
    suppliers: Supplier[];
    locations: Location[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master', href: '#' },
    { title: 'Supplier Master', href: '/master/supplier-master' },
];

export default function SupplierMaster({ suppliers = [], locations = [] }: Props) {
    const [showList, setShowList] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_name: '',
        country: '',
        state: '',
        city: '',
        address: '',
        location: '',
        location_id: '' as string | number,
        gst_number: '',
        pan: '',
        vat_number: '',
        lut_number: '',
        fda_registration_number: '',
        contact_number: '',
        email: '',
        pincode: '',
        supplier_code_tally: '',
        contact_person_name: '',
        logo: null as File | null,
        cut_off_from_time: '',
        cut_off_to_time: '',
        allow_modify_moq: false,
        enable_order_level_tax: false,
        disable_rounding_off: false,
        reduce_qty_with_packaging_material: false,
        enable_credit_limit: false,
        dispatch_only_prepaid_orders: false,
        enable_royalty_service: false,
        _method: 'POST',
    });

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!data.supplier_name.trim()) errs.supplier_name = 'Supplier Name is required.';
        if (!data.country) errs.country = 'Country is required.';
        if (!data.state) errs.state = 'State is required.';
        if (!data.city) errs.city = 'City is required.';
        if (!data.contact_number?.trim()) errs.contact_number = 'Contact number is required.';
        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        if (editingId) {
            setData('_method', 'PUT');
            // Since setState is async, we pass options to submit the current data state manually
            router.post(`/master/supplier-master/${editingId}`, {
                ...data,
                _method: 'PUT',
            }, {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                    setValidationErrors({});
                    setShowList(true);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
            });
        } else {
            setData('_method', 'POST');
            post('/master/supplier-master', {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setValidationErrors({});
                    setShowList(true);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
            });
        }
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingId(supplier.id);
        setData({
            supplier_name: supplier.supplier_name || '',
            country: supplier.country || '',
            state: supplier.state || '',
            city: supplier.city || '',
            address: supplier.address || '',
            location: supplier.location || '',
            location_id: supplier.location_id || '',
            gst_number: supplier.gst_number || '',
            pan: supplier.pan || '',
            vat_number: supplier.vat_number || '',
            lut_number: supplier.lut_number || '',
            fda_registration_number: supplier.fda_registration_number || '',
            contact_number: supplier.contact_number || '',
            email: supplier.email || '',
            pincode: supplier.pincode || '',
            supplier_code_tally: supplier.supplier_code_tally || '',
            contact_person_name: supplier.contact_person_name || '',
            logo: null,
            cut_off_from_time: supplier.cut_off_from_time ? supplier.cut_off_from_time.slice(0, 5) : '',
            cut_off_to_time: supplier.cut_off_to_time ? supplier.cut_off_to_time.slice(0, 5) : '',
            allow_modify_moq: !!supplier.allow_modify_moq,
            enable_order_level_tax: !!supplier.enable_order_level_tax,
            disable_rounding_off: !!supplier.disable_rounding_off,
            reduce_qty_with_packaging_material: !!supplier.reduce_qty_with_packaging_material,
            enable_credit_limit: !!supplier.enable_credit_limit,
            dispatch_only_prepaid_orders: !!supplier.dispatch_only_prepaid_orders,
            enable_royalty_service: !!supplier.enable_royalty_service,
            _method: 'PUT',
        });
        setValidationErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
        setShowList(false);
    };

    const err = (field: string) => validationErrors[field] || (errors as any)[field];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            router.delete(`/master/supplier-master/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supplier Master" />
            <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">

                <div className="flex items-center justify-between border-b pb-4 mb-6 border-t-2 border-t-[#162a5b] bg-white p-4 shadow-sm rounded-t-sm">
                    <h1 className="text-[15px] font-bold text-[#162a5b]">Supplier Master</h1>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-2"
                        onClick={() => setShowList(!showList)}
                    >
                        {showList ? (
                            <><Plus className="h-4 w-4" /> ADD NEW</>
                        ) : (
                            <><List className="h-4 w-4" /> VIEW LIST</>
                        )}
                    </Button>
                </div>

                {!showList ? (
                <form onSubmit={submit} className="bg-white border border-t-0 shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">

                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Supplier Name <span className="text-red-500">*</span></Label>
                            <Input 
                                className={`h-8 border-0 border-b rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400 ${err('supplier_name') ? 'border-red-400' : 'border-gray-200'}`}
                                placeholder="Please Enter Supplier Name" 
                                value={data.supplier_name}
                                onChange={(e) => setData('supplier_name', e.target.value)}
                            />
                            {err('supplier_name') && <p className="text-red-500 text-xs mt-1">{err('supplier_name')}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Country <span className="text-red-500">*</span></Label>
                            <Input 
                                className={`h-8 border-0 border-b rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400 ${err('country') ? 'border-red-400' : 'border-gray-200'}`}
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                placeholder="Enter Country"
                            />
                            {err('country') && <p className="text-red-500 text-xs mt-1">{err('country')}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">State <span className="text-red-500">*</span></Label>
                            <select 
                                className={`flex h-8 w-full border-0 border-b bg-white px-0 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0 ${err('state') ? 'border-red-400' : 'border-gray-200'}`}
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                            >
                                <option value="">-- Please Select --</option>
                                {statesOfIndia.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {err('state') && <p className="text-red-500 text-xs mt-1">{err('state')}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">City <span className="text-red-500">*</span></Label>
                            <Input 
                                className={`h-8 border-0 border-b rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400 ${err('city') ? 'border-red-400' : 'border-gray-200'}`}
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="Enter City"
                            />
                            {err('city') && <p className="text-red-500 text-xs mt-1">{err('city')}</p>}
                        </div>
                        <div className="hidden md:block"></div> 

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mt-6">
                        <div className="space-y-2 relative">
                            <Label className="text-xs text-gray-600 font-normal">Address</Label>
                            <div className="relative">
                                <textarea 
                                    rows={1} 
                                    className="flex min-h-8 w-full border-0 border-b border-gray-200 bg-white px-0 py-1 text-sm shadow-none focus-visible:outline-none placeholder:text-gray-400 resize-none pr-6 text-gray-700" 
                                    placeholder="Please Enter Address" 
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Location Type</Label>
                            <div className="flex h-8 w-full border-b border-gray-200 bg-gray-50 px-3 py-1 items-center">
                                {data.location ? (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                                        data.location === 'HQ'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {data.location}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Auto-linked from Location Master</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">GST Number</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter GST" value={data.gst_number} onChange={(e) => setData('gst_number', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">PAN</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter PAN" value={data.pan} onChange={(e) => setData('pan', e.target.value)} />
                        </div>
                        <div className="space-y-2 md:col-start-2">
                            <Label className="text-xs text-gray-600 font-normal">VAT Number</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter VAT Number" value={data.vat_number} onChange={(e) => setData('vat_number', e.target.value)} />
                        </div>

                        <div className="space-y-2 md:col-start-1">
                            <Label className="text-xs text-gray-600 font-normal">LUT Number</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter LUT Number" value={data.lut_number} onChange={(e) => setData('lut_number', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">FDA Registration Number</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter FD Registration Number" value={data.fda_registration_number} onChange={(e) => setData('fda_registration_number', e.target.value)} />
                        </div>
                        <div className="space-y-2 md:col-start-1">
                            <Label className="text-xs text-gray-600 font-normal">Contact Number <span className="text-red-500">*</span></Label>
                            <Input className={`h-8 border-0 border-b rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400 ${err('contact_number') ? 'border-red-400' : 'border-gray-200'}`} placeholder="Please Enter Contact Number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} />
                            {err('contact_number') && <p className="text-red-500 text-xs mt-1">{err('contact_number')}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Email</Label>
                            <Input type="email" className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Pincode</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter Pincode" value={data.pincode} onChange={(e) => setData('pincode', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Supplier Code For Tally</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter Supplier Code For Tally" value={data.supplier_code_tally} onChange={(e) => setData('supplier_code_tally', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Contact Person Name</Label>
                            <Input className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-400" placeholder="Please Enter Contact Person Name" value={data.contact_person_name} onChange={(e) => setData('contact_person_name', e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-8 mt-8">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600 font-normal">Logo</Label>
                            <div className="border border-gray-200 rounded flex flex-col items-start justify-end h-40 p-3 relative bg-gray-50/20">
                                {data.logo && (
                                    <span className="text-xs text-gray-500 absolute top-2 left-2 truncate w-[90%]">{data.logo.name}</span>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                                />
                                <Button 
                                    type="button" 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="bg-[#3490dc] hover:bg-[#2779bd] text-white text-xs h-8 px-4 font-normal mt-auto rounded-sm shadow-sm flex items-center"
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" /> BROWSE
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-xs text-gray-600 font-normal mb-1 block">Cut Off Suppliement</Label>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500 font-normal">From Time</Label>
                                        <Input 
                                            type="time" 
                                            className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none" 
                                            value={data.cut_off_from_time}
                                            onChange={(e) => setData('cut_off_from_time', e.target.value)}
                                        />
                                        <button type="button" onClick={() => setData('cut_off_from_time', '')} className="text-xs text-blue-500 hover:text-blue-700 font-medium">Reset</button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500 font-normal">To Time</Label>
                                        <Input 
                                            type="time" 
                                            className="h-8 border-0 border-b border-gray-200 rounded-none px-0 text-sm shadow-none" 
                                            value={data.cut_off_to_time}
                                            onChange={(e) => setData('cut_off_to_time', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-600 font-normal cursor-pointer">Allow Modify Minimum Order Quantity ? <span className="text-gray-500">(No/Yes)</span></Label>
                                    <Switch checked={data.allow_modify_moq} onCheckedChange={(v) => setData('allow_modify_moq', v)} className="data-[state=checked]:bg-blue-500 border-gray-300" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-600 font-normal cursor-pointer">Enable Order Level Tax ? <span className="text-gray-500">(No/Yes)</span></Label>
                                    <Switch checked={data.enable_order_level_tax} onCheckedChange={(v) => setData('enable_order_level_tax', v)} className="data-[state=checked]:bg-blue-500 border-gray-300" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-600 font-normal cursor-pointer">Disable Rounding Off ? <span className="text-gray-500">(No/Yes)</span></Label>
                                    <Switch checked={data.disable_rounding_off} onCheckedChange={(v) => setData('disable_rounding_off', v)} className="data-[state=checked]:bg-blue-500 border-gray-300" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-600 font-normal cursor-pointer">Reduce Quantity With Packaging Material? <span className="text-gray-500">(No/Yes)</span></Label>
                                    <Switch checked={data.reduce_qty_with_packaging_material} onCheckedChange={(v) => setData('reduce_qty_with_packaging_material', v)} className="data-[state=checked]:bg-blue-500 border-gray-300" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-600 font-normal cursor-pointer">Enable Credit Limit? <span className="text-gray-500">(No/Yes)</span></Label>
                                    <Switch checked={data.enable_credit_limit} onCheckedChange={(v) => setData('enable_credit_limit', v)} className="data-[state=checked]:bg-blue-500 border-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto">
                            <div className="flex items-center justify-between gap-4 min-w-[280px]">
                                <Label className="text-xs text-gray-500 font-medium cursor-pointer">Dispatch Only Prepaid Orders</Label>
                                <Switch checked={data.dispatch_only_prepaid_orders} onCheckedChange={(v) => setData('dispatch_only_prepaid_orders', v)} className="data-[state=checked]:bg-blue-500 border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between gap-4 min-w-[280px]">
                                <Label className="text-xs text-gray-500 font-medium cursor-pointer">Enable Royalty Service</Label>
                                <Switch checked={data.enable_royalty_service} onCheckedChange={(v) => setData('enable_royalty_service', v)} className="data-[state=checked]:bg-blue-500 border-gray-300" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {editingId && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                        reset();
                                        setEditingId(null);
                                    }}
                                    className="px-8 h-11 text-xs text-gray-500 rounded-sm"
                                >
                                    CANCEL
                                </Button>
                            )}
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full md:w-auto bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black italic uppercase tracking-wider px-10 h-11 text-xs rounded-sm shadow-md transition-all hover:translate-y-[-1px] active:translate-y-0"
                            >
                                {processing ? 'SAVING...' : (editingId ? 'UPDATE SUPPLIER' : 'ADD SUPPLIER')}
                            </Button>
                        </div>
                    </div>
                </form>
                ) : (
                    <div className="bg-white border shadow-sm rounded-sm overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Supplier Name</th>
                                    <th className="px-6 py-4">City</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.length > 0 ? (
                                    suppliers.map((supplier) => (
                                        <tr key={supplier.id} className="border-b hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium">{supplier.supplier_name}</td>
                                            <td className="px-6 py-4">{supplier.city || '-'}</td>
                                            <td className="px-6 py-4">{supplier.contact_number || '-'}</td>
                                            <td className="px-6 py-4">{supplier.email || '-'}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(supplier)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(supplier.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No suppliers found. Click "ADD NEW" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
