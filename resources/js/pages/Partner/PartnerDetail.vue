<script setup lang="ts">
import { Head, usePage, Link, router } from "@inertiajs/vue3";
import { 
  Phone, 
  MapPin, 
  Building2, 
  Image as ImageIcon, 
  Store, 
  ChevronRight,
  ArrowLeft
} from "lucide-vue-next";

const page: any = usePage();
const partner = page.props.partner;
const branches = page.props.branches || [];

// SESUDAH
function toStoreProduct(branch) {
  if (!branch || !branch.slug) return;

  // Simpan id dan slug ke localStorage
  localStorage.setItem("ordernow_selected_store", branch.id);
  localStorage.setItem("ordernow_selected_store_slug", branch.slug);

  // Navigasi ke /@slug
  router.visit(`/@${branch.slug}`, {
    preserveState: false,
    replace: true
  });
}

</script>

<template>
  <Head :title="partner.name" />

  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 md:py-10 md:px-6">
    <div class="max-w-2xl mx-auto relative">

      <!-- Back Button -->
      <a href="javascript:history.back()" class="absolute z-10 top-2 left-2 flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"><ArrowLeft class="size-4" /></a>

      <!-- CARD -->
      <div
        class="bg-white dark:bg-gray-800 md:shadow-lg md:rounded-2xl overflow-hidden md:border md:border-gray-200 md:dark:border-gray-700"
      >

        <!-- BACKGROUND IMAGE -->
        <div class="relative h-48 bg-gray-200 dark:bg-gray-700">
          <img
            v-if="partner.image"
            :src="'/storage/' + partner.image"
            alt="Partner Background"
            class="w-full h-full object-cover"
          />
          <ImageIcon
            v-else
            size="48"
            class="absolute inset-0 m-auto text-gray-400"
          />

          <!-- AVATAR LOGO -->
          <div
            class="absolute left-1/2 -bottom-14 -translate-x-1/2
                   w-28 h-28 rounded-full bg-white dark:bg-gray-800
                   border-4 border-white dark:border-gray-800
                   shadow-lg overflow-hidden flex items-center justify-center"
          >
            <img
              v-if="partner.logo"
              :src="'/storage/' + partner.logo"
              alt="Logo"
              class="w-full h-full object-cover"
            />
            <Building2
              v-else
              size="48"
              class="text-gray-400"
            />
          </div>
        </div>

        <!-- CONTENT -->
        <div class="pt-16 px-6 pb-6 text-center">

          <!-- PARTNER NAME -->
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ partner.name }}
          </h1>

          <!-- INFO -->
          <div class="mt-4 space-y-3 text-gray-700 dark:text-gray-300">

            <div class="flex justify-center items-center gap-2">
              <Phone size="18" class="shrink-0" />
              <span>{{ partner.phone || 'Tidak ada nomor' }}</span>
            </div>

            <div class="flex justify-center items-center gap-2">
              <MapPin size="18" class="shrink-0" />
              <span class="text-center">
                {{ partner.street_address || 'Tidak ada alamat' }}
              </span>
            </div>

          </div>
        </div>

        <!-- BRANCH LIST -->
        <div class="my-10 px-3">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Store size="20" class="shrink-0"/> Toko Kami
          </h2>
                    
          <div v-if="branches.length > 0" class="space-y-4">
            <div
              v-for="branch in branches"
              :key="branch.id"
              class="relative rounded-xl overflow-hidden cursor-pointer transition hover:scale-[1.01] bg-gray-100 dark:bg-gray-700"
              @click="toStoreProduct(branch)"
            >
              <!-- BACKGROUND CABANG -->
              <div v-if="branch.image" class="absolute inset-0">
                <img
                  :src="'/storage/' + branch.image"
                  class="w-full h-full object-cover brightness-75"
                />
                <!-- Overlay hanya muncul jika ada image -->
                <div class="absolute inset-0 bg-black/20"></div>
              </div>

              <!-- KONTEN CARD -->
              <div
                class="relative flex items-center gap-4 p-4"
                :class="branch.image ? 'text-white' : 'text-gray-800 dark:text-gray-300'"
              >
                <!-- LOGO CABANG -->
                <!-- <div
                  class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                  :class="branch.image ? 'bg-transparent' : 'border border-gray-300 dark:border-gray-300'"
                >
                  <img v-if="branch.logo" :src="'/storage/' + branch.logo" class="w-full h-full object-cover" />
                  <Building2 v-else size="32" :class="branch.image ? 'text-white mx-auto mt-3.5' : 'text-gray-400 mx-auto mt-3.5'" />
                </div> -->

                <!-- INFO CABANG -->
                <div class="flex-1">
                  <h3 class="text-lg font-medium">{{ branch.name }}
                      <span
                        v-if="branch.is_open == false"
                        class="ml-2 text-xs px-2 py-0.5 rounded bg-red-600 text-white"
                      >
                        Tutup
                      </span>                    
                  </h3>

                  <div class="flex gap-2 mt-1 text-sm items-center">
                    <Phone size="16" class="shrink-0"/>
                    <span>{{ branch.phone || '-' }}</span>
                  </div>
                  <div class="flex gap-2 mt-1 text-sm items-center">
                    <MapPin size="16" class="shrink-0"/>
                    <span>{{ branch.street_address || '-' }}</span>
                  </div>
                </div>

                <!-- TOMBOL -->
                <div
                  class="ml-3 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center"
                  :class="branch.image ? 'text-white' : 'text-white'"
                >
                  <ChevronRight size="18" />
                </div>
              </div>
            </div>
          </div>

          <p v-else class="text-gray-600 dark:text-gray-400">
            Tidak ada branch terdaftar.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

