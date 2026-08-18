<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavMainHistory from '@/components/NavMainHistory.vue';
import NavMainAccounting from '@/components/NavMainAccounting.vue';
import NavMainStockpile from '@/components/NavMainStockpile.vue';
import NavMainControl from '@/components/NavMainControl.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { usePage } from '@inertiajs/vue3';
import { LayoutGrid, Bookmark, Box, Monitor, House, Blocks, ClipboardList, Wallet, Notebook, ChartNoAxesCombined, Scale, Handshake, Waypoints, UsersRound, ShoppingBasket, NotepadText, Computer, Receipt, ScrollText, Grid2x2X, Building2, Store } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';
import { computed } from 'vue';

const page = usePage();

// Ambil user dari props Inertia
const user = page.props.auth?.user;

// Ambil label dari props Inertia
const sidebarCounts = page.props.sidebarCounts ?? {
    categoryCount: 0,
    brandCount: 0,
    productCount: 0,
    orderCount: 0,
    purchaseOrderCount: 0,
    adjustmentCount: 0,
    transactionCount: 0,
};

const categoryCount = sidebarCounts.categoryCount ?? 0;
const brandCount    = sidebarCounts.brandCount ?? 0;
const productCount  = sidebarCounts.productCount ?? 0;
const orderCount  = sidebarCounts.orderCount ?? 0;
const purchaseOrderCount  = sidebarCounts.purchaseOrderCount ?? 0;
const adjustmentCount  = sidebarCounts.adjustmentCount ?? 0;
const transactionCount  = sidebarCounts.transactionCount ?? 0;

const mainNavItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        // { title: 'Beranda', href: '/', icon: House, count: 0 },
        ];
        
        if (user?.is_admin) {
            items.push(
                { title: 'Dashboard', href: dashboard(), icon: Monitor, count: 0 },
                { title: 'Kasir', href: '/pos', icon: Computer, count: 0 },
                { title: 'Penjualan', href: '/penjualan', icon: ScrollText, count: orderCount },
                { title: 'Pembelian', href: '/pembelian', icon: Receipt, count: purchaseOrderCount },
                { title: 'Penyesuaian', href: '/penyesuaian-stok', icon: ClipboardList, count: adjustmentCount },
            );
        } else {
             items.push(
                { title: 'Belanja Yuk', href: '/', icon: ShoppingBasket, count: 0 },
                { title: 'Semua Store', href: '/partners', icon: Store, count: 0 },
                { title: 'Transaksi', href: '/transaksi', icon: NotepadText, count: transactionCount },
            );           
        }

    return items;
});
const mainNavItemsHistory = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        // bisa tambahkan untuk umum
    ];

    if (user?.is_admin) {
        items.push(
            { title: 'Stok', href: '/stok', icon: Blocks, count: 0 },
            { title: 'Retur', href: '/retur', icon: Grid2x2X, count: 0 },
            { title: 'Pembayaran', href: '/pembayaran', icon: Wallet, count: 0 },
        );
    }

    return items;
});
const mainNavItemsAccounting = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        // bisa tambahkan untuk umum
    ];

    if (user?.is_admin) {
        items.push(
            { title: 'Aset Tetap', href: '/aset-tetap', icon: Building2, count: 0 },
            { title: 'Jurnal & Buku Besar', href: '/jurnal', icon: Notebook, count: 0 },
            { title: 'Laba / Rugi', href: '/laba-rugi', icon: ChartNoAxesCombined, count: 0 },
            { title: 'Neraca', href: '/neraca', icon: Scale, count: 0 },
        );
    }

    return items;
});
const mainNavItemsStockpile = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        // bisa tambahkan untuk umum
    ];

    if (user?.is_admin) {
        items.push(
            { title: 'Kategori', href: '/kategori', icon: LayoutGrid, count: categoryCount },
            { title: 'Merk', href: '/merk', icon: Bookmark, count: brandCount },
            { title: 'Produk', href: '/produk', icon: Box, count: productCount },
        );
    }

    return items;
});
const mainNavItemsControl = computed<NavItem[]>(() => {
 
    const items: NavItem[] = [
        // bisa tambahkan untuk umum
    ];

    if (user?.is_admin && user?.level != null) {
        items.push(
            { title: 'Pengguna', href: '/admin/pengguna', icon: UsersRound, count: 0 },
            { title: 'Cabang', href: '/admin/cabang', icon: Waypoints, count: 0 },
        );
    
        if (user?.level === 'Super Admin') {
            items.push(
                { title: 'Mitra', href: '/admin/mitra', icon: Handshake, count: 0 },
            );
        }
    }

    return items;
});

const footerNavItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        ];
        
        if (user?.is_admin) {
            items.push(
                // { title: 'Beranda', href: '/', icon: House, count: 0 },
                // { title: 'Kasir', href: '/pos', icon: Computer, count: 0 },
                // { title: 'Notifikasi', href: '/notifikasi', icon: Bell, count: 0 },
            );
        } 

    return items;
});
</script>

<template>
    <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader :class="'rounded-t-xl'">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child :class="'bg-foreground/10'">
                        <div>
                        <!-- <Link> --> 
                        <!-- :href="dashboard()" ini ada di dalam <Link> -->
                            <AppLogo />
                        <!-- </Link> -->
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent :class="'pb-3'">
            <NavMain :items="mainNavItems" :class="'relative z-4'"/>
            <NavMainHistory v-if="user?.is_admin" :items="mainNavItemsHistory" :class="'relative z-3'"/>
            <NavMainAccounting v-if="user?.is_admin" :items="mainNavItemsAccounting" :class="'relative z-2'"/>
            <NavMainStockpile v-if="user?.is_admin" :items="mainNavItemsStockpile" :class="'relative z-1'"/>
            <NavMainControl v-if="user?.is_admin && user?.level != null" :items="mainNavItemsControl" />
        </SidebarContent>

        <div class="border-t border-zinc-300 dark:border-zinc-700"></div>

        <SidebarFooter :class="'rounded-b-xl'">
            <NavFooter v-if="footerNavItems.length > 0" :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
