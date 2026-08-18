<script setup lang="ts">
import { Head, usePage, router } from "@inertiajs/vue3";
import {
  Phone,
  MapPin,
  Building2,
  Image as ImageIcon,
  Store,
  ArrowLeftRight
} from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import { type BreadcrumbItem } from '@/types';

const page: any = usePage();

const partner = page.props.partner;
const branches = page.props.branches || [];
const currentBranchId = Number(page.props.auth.user.branch_id); // CAST KE NUMBER

// Fungsi cerdas andalan pencegah broken image di Production
function getImageUrl(path: string | null) {
  if (!path) return '';

  // 1. Jika path adalah URL lengkap (seperti https://dapatin.id/branches/logo/...)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Cek apakah URL tersebut belum punya '/storage/'
    if (!path.includes('/storage/')) {
      // Kita selipkan '/storage/' tepat setelah nama domain utama
      const url = new URL(path);
      return `${url.origin}/storage${url.pathname}`;
    }
    return path;
  }

  // 2. Jika path adalah path relatif (seperti branches/logo/...)
  if (path.startsWith('storage/')) {
    return '/' + path;
  }
  if (path.startsWith('/storage/')) {
    return path;
  }

  return '/storage/' + path;
}

function switchBranch(branch: any) {
  if (!branch?.id || branch.id === currentBranchId) return;

  router.put(
    '/cabang-saya/switch',
    { branch_id: branch.id },
    {
      preserveScroll: true,
      preserveState: false,
    }
  );
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Cabang", href: "/cabang-saya" },
];
</script>

<template>
  <Head :title="`Cabang - ${partner.name}`" />

  <AppLayout :breadcrumbs="breadcrumbs">

    <div class="min-h-screen md:py-10 md:px-6">
      <div class="max-w-2xl mx-auto">

        <div class="bg-white dark:bg-gray-800 md:shadow-lg md:rounded-2xl overflow-hidden md:border md:border-gray-200 md:dark:border-gray-700">

          <div class="relative h-48 bg-gray-200 dark:bg-gray-700">
            <img
              v-if="partner.image"
              :src="getImageUrl(partner.image)"
              class="w-full h-full object-cover"
            />
            <ImageIcon v-else size="48" class="absolute inset-0 m-auto text-gray-400" />

            <div class="absolute left-1/2 -bottom-14 -translate-x-1/2
                        w-28 h-28 rounded-full bg-white dark:bg-gray-800
                        border-4 border-white dark:border-gray-800
                        shadow-lg overflow-hidden flex items-center justify-center">
              <img v-if="partner.logo" :src="getImageUrl(partner.logo)" class="w-full h-full object-cover" />
              <Building2 v-else size="48" class="text-gray-400" />
            </div>
          </div>

          <div class="pt-16 px-6 pb-6 text-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ partner.name }}
            </h1>

            <div class="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <div class="flex justify-center gap-2">
                <Phone size="18" />
                <span>{{ partner.phone || 'Tidak ada nomor' }}</span>
              </div>
              <div class="flex justify-center gap-2">
                <MapPin size="18" />
                <span>{{ partner.street_address || 'Tidak ada alamat' }}</span>
              </div>
            </div>

            <div class="flex justify-center gap-2 mt-3">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                📅 Daftar : <br class="xs:hidden"> {{ partner.registered ? new Date(partner.registered).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' }}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                ⏳ Berakhir : <br class="xs:hidden"> {{ partner.expires_on ? new Date(partner.expires_on).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' }}
              </span>
            </div>
          </div>

          <div class="my-10 px-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Store class="size-8 shrink-0" /> <span>Cabang Bisnis Saya</span>
            </h2>

            <div v-if="branches.length" class="space-y-4">
              <div
                v-for="branch in branches"
                :key="branch.id"
                class="relative rounded-xl overflow-hidden cursor-pointer transition hover:scale-[1.01]"
                :class="branch.id === currentBranchId
                  ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'"
              >
                <div v-if="branch.image" class="absolute inset-0">
                  <img :src="getImageUrl(branch.image)" class="w-full h-full object-cover brightness-75" />
                  <div class="absolute inset-0 bg-black/20"></div>
                </div>

                <div
                  class="relative flex items-center gap-4 p-4"
                  :class="branch.image ? 'text-white' : 'text-gray-800 dark:text-gray-300'"
                >
                  <div class="flex-1">
                    <h3 class="text-lg font-medium flex items-center">
                      {{ branch.name }}
                      <span
                        v-if="branch.id === currentBranchId"
                        class="ml-2 text-xs px-2 py-0.5 rounded bg-blue-600 text-white"
                      >
                        Aktif
                      </span>
                    </h3>

                    <div class="flex gap-2 mt-1 text-sm items-center">
                      <Phone size="16" class="shrink-0" />
                      <span>{{ branch.phone || '-' }}</span>
                    </div>
                    <div class="flex gap-2 mt-1 text-sm items-center">
                      <MapPin size="16" class="shrink-0" />
                      <span>{{ branch.street_address || '-' }}</span>
                    </div>
                  </div>

                  <button
                    v-if="branch.id !== currentBranchId"
                    @click="switchBranch(branch)"
                    class="ml-3 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                  >
                    <ArrowLeftRight size="18" />
                  </button>
                </div>
              </div>
            </div>

            <p v-else class="text-gray-500">Tidak ada cabang.</p>
          </div>

        </div>
      </div>
    </div>

  </AppLayout>
</template>