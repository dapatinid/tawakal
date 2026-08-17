<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { Plus, Trash } from 'lucide-vue-next'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'


const page = usePage<any>()

  const userLevel = page.props?.auth?.user?.level ?? null



/* =======================
   DATA
======================= */
const kategori = computed(() => page.props.kategori ?? [])

/* =======================
   DELETE STATE
======================= */
const showDeleteDialog = ref(false)
const selectedKategori = ref<any>(null)

function confirmDelete(item: any) {
  selectedKategori.value = item
  showDeleteDialog.value = true
}

function deleteKategori() {
  if (!selectedKategori.value) return

  router.delete(`/kategori/${selectedKategori.value.id}`, {
    preserveScroll: true,
    onFinish: () => {
      showDeleteDialog.value = false
      selectedKategori.value = null
    },
  })
}

/* =======================
   NAVIGATION
======================= */
function goEdit(id: number) {
  if (userLevel) {
    router.get(`/kategori/${id}/edit`)
  } else {
    router.get(`/produk?category=${id}`)
  }
}

const breadcrumbs = [
  { title: 'Kategori', href: '/kategori' },
]
</script>

<template>
  <Head title="Kategori" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="px-4 pt-5 pb-20 space-y-4">

      <!-- LIST -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in kategori"
          :key="item.id"
          @click="goEdit(item.id)"
          class="group relative cursor-pointer rounded-xl border
                border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900
                p-4 transition hover:shadow-md overflow-hidden"
        >
          <!-- BACKGROUND IMAGE -->
          <div
            v-if="item.image"
            class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${item.image})` }"
          ></div>

          <!-- DELETE -->
          <button
            @click.stop="confirmDelete(item)"
            class="absolute z-11 top-3 right-3 bg-background rounded-full p-1
                  text-red-600 hover:text-red-800
                  opacity-0 group-hover:opacity-100 transition"
            title="Hapus Kategori"
          >
            <Trash class="size-4" />
          </button>

          <div class="flex justify-between items-center relative z-10">
            <!-- KIRI: Info -->
            <div class="space-y-1">
              <div class="font-semibold text-gray-900 dark:text-gray-100">
                {{ item.name }}
              </div>

              <div class="text-xs text-gray-500">
                Produk: {{ item.products_count }}
              </div>

              <div
                class="inline-block rounded px-2 py-0.5 text-xs"
                :class="item.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600'"
              >
                {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
              </div>
            </div>

            <!-- KANAN: Image Thumbnail -->
            <div v-if="item.image" class="ml-4 flex-shrink-0 relative z-10">
              <img
                :src="item.image"
                alt="Kategori Image"
                class="w-16 h-16 object-cover rounded-md border"
              />
            </div>
          </div>
        </div>
        

        <!-- EMPTY -->
        <div
          v-if="kategori.length === 0"
          class="col-span-full py-10 text-center text-gray-500"
        >
          Data kategori belum tersedia
        </div>
      </div>

      <!-- FLOATING BUTTON -->
      <!-- CREATE -->
      <Link
        href="/kategori/buat/baru"
        class="fixed bottom-6 right-6 z-50"
      >
        <div
          class="
            flex items-center justify-center
            size-12
            rounded-full
            bg-blue-600
            text-white
            shadow-lg
            hover:bg-blue-700
            active:scale-95
            transition
            focus:outline-none
            focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          "
        >
          <Plus class="size-6" />
        </div>
      </Link>


    </div>

    <!-- DELETE DIALOG -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Kategori?</DialogTitle>
          <DialogDescription>
            Kategori
            <strong>{{ selectedKategori?.name }}</strong>
            akan dihapus.
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex justify-end gap-2">
          <button
            class="rounded-md border px-4 py-2"
            @click="showDeleteDialog = false"
          >
            Batal
          </button>

          <button
            class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            @click="deleteKategori"
          >
            Ya, Hapus
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </AppLayout>
</template>
