<script setup lang="ts">
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toUrl, urlIsActive } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editPassword } from '@/routes/password';
import { edit as editProfile } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/vue3';
import {
  User,
  Palette,
  Lock,
  ShieldCheck,
  Cog,
  ChevronRight,
} from 'lucide-vue-next';
import { ref, type Component } from 'vue';

export interface NavItem {
  title: string
  href: string
  icon?: Component
}


const isSettingsOpen = ref(false)

function openSettings() {
  isSettingsOpen.value = true
}

function closeSettings() {
  isSettingsOpen.value = false
}

const sidebarNavItems: NavItem[] = [
  {title: 'Profile',href: editProfile(),icon: User, count: 0},
  {title: 'Appearance',href: editAppearance(),icon: Palette, count: 0},
  {title: 'Password',href: editPassword(),icon: Lock, count: 0},
  {title: 'Two-Factor Auth',href: show(),icon: ShieldCheck, count: 0},
]


const currentPath =
    typeof window !== undefined ? window.location.pathname : '';
</script>

<template>
    <div class="py-4 gap-y-4 block md:flex md:flex-wrap pb-24">

        <!-- MOBILE SETTINGS BUTTON -->
        <div class="fixed bottom-4 right-4 z-50 md:hidden">
        <Button
            variant="outline"
            class="
            size-11 
            rounded-full 
            p-0 
            shadow-lg 
            shadow-black/20 
            backdrop-blur-sm 
            bg-white/90 
            dark:bg-neutral-900/90
            "
            @click="openSettings"
        >
            <Cog class="size-5" />
            <span class="sr-only">Pengaturan</span>
        </Button>
        </div>


        <!-- 🔥 TAB NAVIGATION (Baris Atas) -->
        <nav class="hidden md:block px-4 w-full md:w-1/3">
        <Heading :class="'mb-3'"
            title="Settings"
            description="Manage your profile and account settings"
        />
        <div
            class="
            bg-white dark:bg-neutral-900
            rounded-2xl
            shadow-sm
            divide-y divide-neutral-200 dark:divide-neutral-800
            overflow-hidden
            "
        >
            <Link
            v-for="item in sidebarNavItems"
            :key="toUrl(item.href)"
            :href="item.href"
            class="
                flex items-center justify-between
                px-4 py-3
                transition
                hover:bg-neutral-50 dark:hover:bg-neutral-800
            "
            :class="{
                'bg-neutral-100 dark:bg-neutral-800':
                urlIsActive(item.href, currentPath),
            }"
            >
            <!-- LEFT -->
            <div class="flex items-center gap-3">
                <!-- ICON -->
                <div
                class="
                    size-9
                    rounded-lg
                    flex items-center justify-center
                    bg-neutral-200 dark:bg-neutral-700
                "
                >
                <component :is="item.icon" class="size-4 text-neutral-700 dark:text-neutral-200" />
                </div>

                <!-- TITLE -->
                <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {{ item.title }}
                </span>
            </div>

            <!-- CHEVRON -->
            <svg
                class="size-4 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            </Link>
        </div>
        </nav>

        <!-- MOBILE SETTINGS MODAL -->
        <div
        v-if="isSettingsOpen"
        class="fixed inset-0 z-50 md:hidden"
        >
        <!-- BACKDROP -->
        <div
            class="absolute inset-0 bg-black/40"
            @click="closeSettings"
        />

        <!-- PANEL -->
        <div
            class="
            absolute bottom-0 left-0 right-0
            max-h-[90vh]
            bg-neutral-100 dark:bg-black
            rounded-t-3xl
            shadow-xl
            animate-slide-up
            overflow-y-auto
            "
        >
            <!-- HEADER -->
            <div class="flex items-center justify-between px-6 pt-3">
            <h3 class="text-base font-semibold">Pengaturan</h3>
            <button
                class="text-sm text-blue-600"
                @click="closeSettings"
            >
                Tutup
            </button>
            </div>

            <!-- NAV LIST -->
            <nav class="px-4 py-3">
            <div
                class="
                bg-white dark:bg-neutral-900
                rounded-2xl
                shadow-sm
                divide-y divide-neutral-200 dark:divide-neutral-800
                overflow-hidden
                "
            >
                <Link
                v-for="item in sidebarNavItems"
                :key="toUrl(item.href)"
                :href="item.href"
                class="flex items-center justify-between px-4 py-3"
                @click="closeSettings"
                >
                <div class="flex items-center gap-3">
                    <div
                    class="size-9 rounded-lg flex items-center justify-center bg-neutral-200 dark:bg-neutral-700"
                    >
                    <component :is="item.icon" class="size-4" />
                    </div>
                    <span class="text-sm font-medium">
                    {{ item.title }}
                    </span>
                </div>

                <svg class="size-4 text-neutral-400" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                </Link>
            </div>
            </nav>
        </div>
        </div>


        <!-- <Separator class="my-6 bg-foreground/30" /> -->

        <div class="flex-1 w-[calc(100%-2rem)] md:w-2/3 mx-4">
            <section class="space-y-12">
                <slot />
            </section>
        </div>

    </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.25s ease-out;
}
</style>
