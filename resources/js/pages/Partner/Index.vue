<script setup lang="ts">
import { Head, Link, usePage } from "@inertiajs/vue3";
import { ArrowLeft, Building2, ImageIcon } from "lucide-vue-next";

const page: any = usePage();
const partners = page.props.partners || [];
</script>

<template>
  <Head title="Our Partner" />

  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-6">
    <div class="max-w-6xl mx-auto relative">

      <!-- Back Button -->
      <a href="javascript:history.back()" class="absolute -top-2 left-0 flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"><ArrowLeft class="size-4" /></a>

      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Our Partner
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Partner resmi kami
        </p>
      </div>

      <!-- LIST -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        <Link
          v-for="partner in partners"
          :key="partner.id"
          :href="`/${partner.slug}`"
          class="group bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- IMAGE -->
          <div class="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <img
              v-if="partner.image"
              :src="'/storage/' + partner.image"
              class="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <ImageIcon
              v-else
              size="40"
              class="text-gray-400"
            />
          </div>

          <!-- BODY -->
          <div class="p-5 text-center">
            <div class="flex justify-center mb-3">
              <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                <img
                  v-if="partner.logo"
                  :src="'/storage/' + partner.logo"
                  class="w-full h-full object-cover"
                />
                <Building2
                  v-else
                  class="text-gray-400"
                  size="28"
                />
              </div>
            </div>

            <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">
              <span
                v-if="partner.is_open == false"
                class="mr-2 text-xs px-2 py-0.5 rounded bg-red-600 text-white"
              >
                Tutup
              </span>                
              {{ partner.name }}
            </h3>

            <p class="mt-2 text-sm text-blue-600 dark:text-blue-400">
              Lihat detail →
            </p>
          </div>
        </Link>
      </div>

      <p
        v-if="partners.length === 0"
        class="text-center text-gray-500 mt-10"
      >
        Belum ada partner terdaftar.
      </p>
    </div>
  </div>
</template>
