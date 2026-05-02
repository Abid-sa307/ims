import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LayoutGrid, Save, X, PlusCircle, Pencil, Trash2, Search, Building2, FileText, Settings2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master', href: '#' },
    { title: 'Project Master', href: '/master/project-master' },
];

interface Project {
    id: number;
    location_id: number;
    project_name: string;
    project_code: string | null;
    description: string | null;
    status: boolean;
    location?: {
        id: number;
        location_legal_name: string;
    };
}

interface Location {
    id: number;
    location_legal_name: string;
}

interface Props {
    projects: Project[];
    locations: Location[];
}

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

export default function ProjectMaster({ projects = [], locations = [] }: Props) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        location_id: '' as string | number,
        project_name: '',
        project_code: '',
        description: '',
        status: true,
    });

    const handleCreateNew = () => {
        reset(); clearErrors();
        setIsEditing(false); setViewMode('form');
    };

    const handleEdit = (project: Project) => {
        setData({
            id: project.id,
            location_id: project.location_id.toString(),
            project_name: project.project_name,
            project_code: project.project_code || '',
            description: project.description || '',
            status: !!project.status,
        });
        setIsEditing(true); setViewMode('form');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            destroy(`/master/project-master/${id}`, { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { 
            onSuccess: () => { 
                reset(); 
                setViewMode('list'); 
            } 
        };
        if (isEditing && data.id) put(`/master/project-master/${data.id}`, options);
        else post('/master/project-master', options);
    };

    const filteredProjects = projects.filter(proj => {
        if (!searchQuery) return true;
        const lowercaseQuery = searchQuery.toLowerCase();
        return (proj.project_name?.toLowerCase().includes(lowercaseQuery) || 
               proj.project_code?.toLowerCase().includes(lowercaseQuery) ||
               proj.location?.location_legal_name?.toLowerCase().includes(lowercaseQuery));
    });

    if (viewMode === 'list') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Project Master" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-xl bg-[#162a5b] shadow-lg">
                                    <LayoutGrid className="size-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#162a5b]">Project Master</h1>
                            </div>
                            <p className="text-sm text-gray-500 ml-12">Manage projects linked to your locations.</p>
                        </div>
                        <Button onClick={handleCreateNew} className="bg-[#162a5b] hover:bg-[#1e3a7b] text-white shadow-lg gap-2 h-10 px-5 font-bold">
                            <PlusCircle className="size-4" /> Add Project
                        </Button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">All Projects</p>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search projects..."
                                    className="pl-9 h-8 w-[250px] border-gray-200 text-sm focus-visible:ring-[#162a5b] rounded-sm bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">Project Name</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">Code</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">Location</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500">Status</TableHead>
                                    <TableHead className="font-black text-[11px] uppercase tracking-wider text-gray-500 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.length > 0 ? filteredProjects.map((proj) => (
                                    <TableRow key={proj.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-[#162a5b]/10 flex items-center justify-center flex-shrink-0">
                                                    <LayoutGrid className="size-3.5 text-[#162a5b]" />
                                                </div>
                                                <span className="font-bold text-[#162a5b]">{proj.project_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 font-medium">{proj.project_code || '—'}</TableCell>
                                        <TableCell className="text-gray-600 font-medium">{proj.location?.location_legal_name || '—'}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                                proj.status
                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                    : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                                {proj.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(proj)} className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(proj.id)} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500">
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <LayoutGrid className="size-10 opacity-20" />
                                                <p className="font-medium">No projects yet</p>
                                                <Button onClick={handleCreateNew} variant="outline" size="sm" className="gap-1">
                                                    <PlusCircle className="size-3.5" /> Add Project
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Project' : 'Add Project'} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-[#162a5b]">
                            <LayoutGrid className="size-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-black text-[#162a5b]">{isEditing ? 'Edit Project' : 'New Project'}</h1>
                            {data.project_name && (
                                <p className="text-[11px] text-gray-400">{data.project_name}</p>
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
                                <><Save className="w-4 h-4 mr-1.5" /> Save Project</>
                            )}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-8 space-y-6 pb-24">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-2">
                            <SectionHeading icon={Building2} title="Project Identity" subtitle="Basic identification for this project" />
                        </div>
                        <div className="px-6 pb-6 grid md:grid-cols-2 gap-5">
                            <Field label="Location" required error={errors.location_id}>
                                <Select value={data.location_id.toString()} onValueChange={v => setData('location_id', v)}>
                                    <SelectTrigger className={`${errors.location_id ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200'} bg-gray-50 focus:bg-white`}>
                                        <SelectValue placeholder="-- Select Location --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map(loc => (
                                            <SelectItem key={loc.id} value={loc.id.toString()}>{loc.location_legal_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Project Name" required error={errors.project_name}>
                                <Input
                                    value={data.project_name}
                                    onChange={e => setData('project_name', e.target.value)}
                                    placeholder="Enter project name"
                                    className={`${errors.project_name ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200'} bg-gray-50 focus:bg-white`}
                                />
                            </Field>
                            <Field label="Project Code" error={errors.project_code}>
                                <Input
                                    value={data.project_code}
                                    onChange={e => setData('project_code', e.target.value)}
                                    placeholder="e.g. PRJ-001"
                                    className="border-gray-200 bg-gray-50 focus:bg-white"
                                />
                            </Field>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 self-end h-[42px]">
                                <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Status</span>
                                <Switch checked={data.status} onCheckedChange={c => setData('status', c)} />
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Description" error={errors.description}>
                                    <Input
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Brief description of the project"
                                        className="border-gray-200 bg-gray-50 focus:bg-white"
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
