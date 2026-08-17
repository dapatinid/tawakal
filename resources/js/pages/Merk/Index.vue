<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { ImageOff, Plus, Trash } from 'lucide-vue-next'

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
const merk = computed(() => page.props.merk ?? [])

/* =======================
   DELETE STATE
======================= */
const showDeleteDialog = ref(false)
const selectedMerk = ref<any>(null)

function confirmDelete(item: any) {
  selectedMerk.value = item
  showDeleteDialog.value = true
}

function deleteMerk() {
  if (!selectedMerk.value) return

  router.delete(`/merk/${selectedMerk.value.id}`, {
    preserveScroll: true,
    onFinish: () => {
      showDeleteDialog.value = false
      selectedMerk.value = null
    },
  })
}

/* =======================
   NAVIGATION
======================= */
function goEdit(id: number) {
  if (userLevel) {
    router.get(`/merk/${id}/edit`)
  } else {
    router.get(`/produk?brand=${id}`)
  }
}

const breadcrumbs = [
  { title: 'Merk', href: '/merk' },
]
</script>

<template>
  <Head title="Merk" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="px-4 pt-5 pb-20 space-y-4">

      <!-- LIST -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <div
          v-for="item in merk"
          :key="item.id"
          @click="goEdit(item.id)"
          class="h-72 group relative cursor-pointer rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900
                p-6 px-4
                transition hover:shadow-lg overflow-hidden"
        >

          <!-- BACKGROUND IMAGE (DECORATIVE) -->
          <div
            v-if="item.image"
            class="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110 pointer-events-none"
            :style="{ backgroundImage: `url(${item.image})` }"
          ></div>

          <!-- DELETE -->
          <button
            @click.stop="confirmDelete(item)"
            class="absolute top-3 right-3 z-20
                  bg-background rounded-full p-1
                  text-red-600 hover:text-red-800
                  opacity-0 group-hover:opacity-100 transition"
            title="Hapus Merk"
          >
            <Trash class="size-4" />
          </button>

          <!-- AVATAR IMAGE -->
          <div
            v-if="item.image"
            class="flex mb-5 mt-1"
          >
            <img
              :src="item.image"
              alt="Merk Image"
              class="mx-auto w-32 h-32 object-cover rounded-full
                    border-4 border-white dark:border-gray-900
                    shadow-md"
            />
          </div>
          <div
            v-else
            class="flex mb-5 mt-1"
          >
            <div
              class="flex mx-auto w-32 h-32 object-cover rounded-full
                    border-4 border-white dark:border-gray-900 bg-muted
                    shadow-md"
            ><ImageOff class="size-10 mx-auto text-gray-300 dark:text-gray-700 mt-10"/></div>
          </div>

          <!-- CONTENT -->
          <div class="text-center space-y-1">
            <div class="font-semibold text-gray-900 dark:text-gray-100">
              {{ item.name }}
            </div>

            <div class="text-xs text-gray-500">
              Produk: {{ item.products_count }}
            </div>

            <div
              class="inline-block mt-2 rounded px-2 py-0.5 text-xs"
              :class="item.is_active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-600'"
            >
              {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
            </div>
          </div>
        </div>

        

        <!-- EMPTY -->
        <div
          v-if="merk.length === 0"
          class="col-span-full py-10 text-center text-gray-500"
        >
          Data merk belum tersedia
        </div>
      </div>

      <!-- FLOATING BUTTON -->
      <!-- CREATE -->
      <Link
        href="/merk/buat/baru"
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
          <DialogTitle>Hapus Merk?</DialogTitle>
          <DialogDescription>
            Merk
            <strong>{{ selectedMerk?.name }}</strong>
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
            @click="deleteMerk"
          >
            Ya, Hapus
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </AppLayout>
</template>
