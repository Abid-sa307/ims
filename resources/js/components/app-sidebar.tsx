import { Link } from '@inertiajs/react';
import { TrendingUp, ShoppingBag, Plus, Truck, Settings, Users, MonitorSmartphone, DollarSign, Database, Shield, Box, Activity, LogOut, Search, Settings2, BarChart2, Bell, Map, Frame, MapPin, Grid, Layers, Zap, Tags, LayoutGrid, ShoppingCart, Store, FileText, Factory, Utensils, ClipboardList, Package, ListChecks, FileInput, FileOutput, CreditCard, Banknote, FileBarChart, PieChart } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'B2B Dashboard',
        href: '/b2b-dashboard',
        icon: Activity,
    },
    {
        title: 'Item Master',
        href: '/master/item-master',
        icon: Box,
    },
    {
        title: 'General Configuration',
        href: '#',
        icon: Settings,
        items: [
            {
                title: 'Customer Master',
                href: '/config/customer-master',
            },
            {
                title: 'Supplier Master',
                href: '/master/supplier-master',
            },
            {
                title: 'Location Master',
                href: '/master/location-master',
            },
        ],
    },
    {
        title: 'User configuration',
        href: '#',
        icon: Users,
        items: [
            {
                title: 'User Master',
                href: '/config/user-master',
            },
        ],
    },
    {
        title: 'Invoice Configuration',
        href: '#',
        icon: FileText,
        items: [
            {
                title: 'Custom Field group Master',
                href: '/invoice/custom-field-group',
            },
            {
                title: 'Template Master',
                href: '/invoice/template-master',
            },
        ],
    },
    {
        title: 'Purchase Management',
        href: '#',
        icon: ShoppingBag,
        items: [
            {
                title: 'Generate PO',
                href: '/purchase/generate-po',
            },
            {
                title: 'Purchase Order Summary',
                href: '/purchase/summary',
            },
            {
                title: 'Approved PO',
                href: '/purchase/approved-po',
            },
            {
                title: 'Send PO to Supplier',
                href: '/purchase/send-po',
            },
            {
                title: 'Received PO from Supplier',
                href: '/purchase/received-po',
            },
            {
                title: 'Debit Note TO Supplier',
                href: '/purchase/debit-note',
            },
            {
                title: 'Payment Entry to Supplier',
                href: '/purchase/payment-entry',
            },
        ],
    },
    {
        title: 'Sales Management',
        href: '#',
        icon: Tags,
        items: [
            {
                title: 'Create A Sales Invoice',
                href: '/sales/generate-invoice',
            },
            {
                title: 'Customer Order Management',
                href: '/sales/order-management',
            },
            {
                title: 'Approved the Sale Invoice',
                href: '/sales/approved-invoice',
            },
            {
                title: 'Send invoice to customer',
                href: '/sales/send-invoice',
            },
            {
                title: 'Credit note',
                href: '/sales/credit-note',
            },
            {
                title: 'Payment Entry to the customer',
                href: '/sales/payment-entry',
            },
        ],
    },
    {
        title: 'Production',
        href: '/operations/production',
        icon: Factory,
    },
    {
        title: 'Recipe',
        href: '/operations/recipe',
        icon: Utensils,
    },
    {
        title: 'Stock Management',
        href: '/operations/stock-management',
        icon: Box,
    },
    {
        title: 'Payment Management',
        href: '/operations/payment-management',
        icon: DollarSign,
    },
    {
        title: 'Central kitchen register',
        href: '/operations/kitchen-register',
        icon: ClipboardList,
    },
    {
        title: 'Purchase report',
        href: '/reports/purchase',
        icon: FileBarChart,
    },
    {
        title: 'Stock Report',
        href: '/reports/stock',
        icon: PieChart,
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
