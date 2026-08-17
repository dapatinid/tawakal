import { InertiaLinkProps } from '@inertiajs/vue3';
import type { LucideIcon } from 'lucide-vue-next';

export interface Auth {
    user: User;
}

export interface Branch {
    id: number;
    name: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
    isActive?: boolean;
    count: number;
}

export type AppPageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarCounts: SidebarCounts;
    sidebarOpen: boolean;
};

export interface User {
    avatar?: string;
    cover?: string;

    branch: any;
    is_admin: boolean;
    class: string;
    level: string;
    id: number;

    name: string;
    phone: string;
    email: string;
    email_verified_at: string | null;
    
    created_at: string;
    updated_at: string;

    branch_id?: number | null;
    branch?: Branch | null;
}

export interface SidebarCounts {
    categoryCount: number;
    brandCount: number;
    productCount: number;
    orderCount: number;
    purchaseOrderCount: number;
    adjustmentCount: number;
    transactionCount: number;
}

export type BreadcrumbItemType = BreadcrumbItem;
