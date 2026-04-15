import { Link } from '@inertiajs/react';
import { TrendingUp, ShoppingBag, Plus, Truck, Settings, Users, MonitorSmartphone, DollarSign, Database, Shield, Box, Activity, LogOut, Search, Settings2, BarChart2, Bell, Map, Frame, MapPin, Grid, Layers, Zap, Tags, LayoutGrid, ShoppingCart, Store, FileText, Factory, Utensils, ClipboardList, Package, ListChecks, FileInput, FileOutput, CreditCard, Banknote, FileBarChart, PieChart, Archive } from 'lucide-react';
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
        icon: Activity,
    },
    {
        title: 'Inventory Management',
        href: '#',
        icon: Archive,
        items: [
            {
                title: 'Item Master',
                href: '/master/item-master',
            },
            {
                title: 'Supplier Master',
                href: '/master/supplier-master',
            },
            {
                title: 'Item Categories',
                href: '/inventory/item-categories',
            },
            {
                title: 'Item Sub Categories',
                href: '/inventory/item-sub-categories',
            },
            {
                title: 'Item Types',
                href: '/inventory/item-types',
            },
            {
                title: 'Price Policy',
                href: '/inventory/price-lists',
            },
            {
                title: 'UOM Master',
                href: '/inventory/uom-master',
            },
            {
                title: 'Warehouse Master',
                href: '/inventory/warehouse-master',
            },
            {
                title: 'Transporter Master',
                href: '/inventory/transporter-master',
            },
            {
                title: 'Item Supplier Master',
                href: '/inventory/item-supplier-mapping',
            },
            {
                title: 'Stock Source Selection',
                href: '/inventory/stock-source-selection',
            },
            {
                title: 'Item Warehouse Mapping',
                href: '/inventory/item-warehouse-mapping',
            },
        ],
    },
    {
        title: 'General Configuration',
        href: '#',
        icon: Settings,
        items: [
            {
                title: 'Location Master',
                href: '/master/location-master',
            },
        ],
    },
    {
        title: 'Tax',
        href: '#',
        icon: FileText,
        items: [
            {
                title: 'Tax List',
                href: '/config/tax-master',
            },
            {
                title: 'Create Tax',
                href: '/config/tax-master/create',
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
            {
                title: 'Invoices Template',
                href: '/invoice/invoices-template',
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
                title: 'Auto Approved PO',
                href: '/purchase/auto-approved-po',
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
                href: '/purchase/generate-debit-note',
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
        href: '#',
        icon: Factory,
        items: [
            {
                title: 'Production Planning',
                href: '/operations/production-planning',
            },
            {
                title: 'Item Manufacturing',
                href: '/operations/production-entry',
            },
            {
                title: 'Multiple Manufacturing',
                href: '/operations/multiple-manufacturing',
            },
        ],
    },
    {
        title: 'Recipe',
        href: '/operations/recipe',
        icon: Utensils,
    },
    {
        title: 'Stock Management',
        href: '#',
        icon: Package,
        items: [
            {
                title: 'Current Stock',
                href: '/stock/current-stock',
            },
            {
                title: 'Wastage Entry',
                href: '/stock/wastage-entry',
            },
            {
                title: 'Stock Transfer',
                href: '/stock/stock-transfer',
            },
            {
                title: 'Stock Transfer Wastage',
                href: '/stock/transfer-report',
            },
            {
                title: 'Stock Adjustment',
                href: '/stock/adjustment',
            },
            {
                title: 'Physical Stock Entry',
                href: '/stock/physical-frequency',
            },
            {
                title: 'Physical Stock Entry Report',
                href: '/stock/physical-entry',
            },
        ],
    },
    {
        title: 'Payment Management',
        href: '#',
        icon: DollarSign,
        items: [
            {
                title: 'Payment Management',
                href: '/operations/payment-management',
            },
            {
                title: 'Payment Details',
                href: '/operations/payment-details',
            },
            {
                title: 'Bulk Payment',
                href: '/operations/bulk-payment',
            },
            {
                title: 'Payment Transaction Report',
                href: '/operations/payment-transaction-report',
            },
        ],
    },
    {
        title: 'Central kitchen register',
        href: '/operations/kitchen-register',
        icon: ClipboardList,
    },
    {
        title: 'New Reports Added',
        href: '#',
        icon: FileBarChart,
        items: [
            {
                title: 'Supplier Payment',
                href: '/reports/new/supplier-payment',
            },
            {
                title: 'Supplier Payment Entry',
                href: '/reports/new/supplier-payment-entry',
            },
            {
                title: 'Price Deviation',
                href: '/reports/new/price-deviation',
            },
            {
                title: 'Creditors Report',
                href: '/reports/new/creditors-report',
            },
            {
                title: 'Supplier Account',
                href: '/reports/new/supplier-account',
            },
        ],
    },
    {
        title: 'Sales Reports',
        href: '#',
        icon: Tags,
        items: [
            {
                title: 'Sales Summary',
                href: '/reports/sales/summary',
            },
            {
                title: 'Item Wise Sales Report',
                href: '/reports/sales/item-wise',
            },
            {
                title: 'Date Wise Item Sales Report',
                href: '/reports/sales/date-wise',
            },
            {
                title: 'Customer Wise Sales Report',
                href: '/reports/sales/customer-wise',
            },
            {
                title: 'Credit Note Register',
                href: '/reports/sales/credit-note-register',
            },
            {
                title: 'Price Deviation For Sales',
                href: '/reports/sales/price-deviation',
            },
            {
                title: 'Sales Ledger',
                href: '/reports/sales/ledger',
            },
            {
                title: 'Outstanding Sales',
                href: '/reports/sales/outstanding',
            },
        ],
    },
    {
        title: 'Purchase Reports',
        href: '#',
        icon: FileBarChart,
        items: [
            {
                title: 'Purchase Order Summary',
                href: '/reports/purchase/order-summary',
            },
            {
                title: 'Purchase HSN Summary Report',
                href: '/reports/purchase/hsn-summary',
            },
            {
                title: 'Item Wise Purchase Report',
                href: '/reports/purchase/item-wise',
            },
            {
                title: 'Debitnote Register',
                href: '/reports/purchase/debit-note-register',
            },
            {
                title: 'Price Deviation For All Location',
                href: '/reports/purchase/price-deviation',
            },
        ],
    },
    {
        title: 'Stock Reports',
        href: '#',
        icon: PieChart,
        items: [
            {
                title: 'Stock Listing Report',
                href: '/reports/stock/listing',
            },
            {
                title: 'Stock Valuation Report',
                href: '/reports/stock/valuation',
            },
            {
                title: 'Current Stock',
                href: '/stock/current-stock',
            },
        ],
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

            <SidebarContent className="overflow-y-auto min-h-0">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
