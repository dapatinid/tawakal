<script setup lang="ts">
import UserInfoShow from '@/components/UserInfoShow.vue';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';
import { Link, router } from '@inertiajs/vue3';
import { LogOut, MapPin, NotepadText, Settings } from 'lucide-vue-next';

interface Props {
    user: User;
}

const handleLogout = () => {
    router.flushAll();
};

defineProps<Props>();
</script>

<template>
    <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserInfoShow :user="user" :show-branch="true" :show-cover="true" />
        </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup v-if="user?.is_admin">
        <DropdownMenuItem :as-child="true">
            <Link class="block w-full" :href="'/transaksi'" prefetch as="button">
                <NotepadText class="mr-2 h-4 w-4 text-muted-foreground" />
                Transaksi
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup v-if="user?.level !== null && user?.level !== ''">
        <DropdownMenuItem :as-child="true">
            <Link class="block w-full" :href="'/cabang-saya'" prefetch as="button">
                <MapPin class="mr-2 h-4 w-4" />
                Cabang
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <Link class="block w-full" :href="edit()" prefetch as="button">
                <Settings class="mr-2 h-4 w-4" />
                Pengaturan
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem :as-child="true">
        <Link
            class="block w-full"
            :href="logout()"
            @click="handleLogout"
            as="button"
            data-test="logout-button"
        >
            <LogOut class="mr-2 h-4 w-4" />
            Keluar
        </Link>
    </DropdownMenuItem>
</template>
