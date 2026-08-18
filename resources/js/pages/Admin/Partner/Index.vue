<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, Link } from '@inertiajs/vue3'
import { ref, watch, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { type BreadcrumbItem } from '@/types'
import { ChevronsLeft, ChevronsRight, Plus, Search } from 'lucide-vue-next'
import { debounce } from 'lodash'

const props = defineProps<{
  partners: any
  filters: {
    search?: string
  }
}>()

/* =========================
   SEARCH (DEBOUNCED)
========================= */
const search = ref(props.filters.search ?? '')

// 1. Definisikan fungsi debounce
const debouncedSearch = debounce((searchValue: string) => {
  router.get(
    '/admin/mitra',
    { search: searchValue },
    { 
      preserveState: true, 
      replace: true, 
      preserveScroll: true 
    }
  )
}, 500)

// 2. Gunakan watch untuk memantau perubahan input
let initialized = false
watch(search, (newValue) => {
  if (!initialized) {
    initialized = true
    return
  }
  debouncedSearch(newValue)
})

// 3. Cleanup timer saat pindah halaman
onUnmounted(() => {
  debouncedSearch.cancel()
})

/* =========================
   DELETE DIALOG
========================= */
const showDeleteDialog = ref(false)
const selectedPartner = ref<any>(null)

function confirmDelete(partner: any) {
  selectedPartner.value = partner
  showDeleteDialog.value = true
}

function deletePartner() {
  if (!selectedPartner.value) return

  router.delete(`/admin/mitra/${selectedPartner.value.id}`, {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteDialog.value = false
      selectedPartner.value = null
    },
  })
}

/* =========================
   BREADCRUMB
========================= */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Partner', href: '/admin/mitra' },
]
</script>

<template>
  <Head title="Partner" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="px-3 space-y-4 py-4">

      <!-- HEADER -->
      <div class="flex justify-between items-center gap-3">
        <div class="relative w-full sm:w-72">
          <label for="pencarian"><Search class="absolute left-3 top-2.5 size-5 text-gray-400" /></label>
          <input id="pencarian"
            v-model="search"
            placeholder="Cari Data..."
                          class="w-full border rounded-md px-3 py-2 ps-10
                              bg-white text-gray-900
                              dark:bg-gray-800 dark:text-gray-100
                              dark:border-gray-700
                              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>   

        <Link href="/admin/mitra/create">
          <Button><Plus class="size-5"/></Button>
        </Link>
      </div>

      <!-- TABLE -->
      <div class="bg-background rounded-xl overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted-foreground text-white">
            <tr>
              <th class="p-2 text-left">No.</th>
              <th class="p-2 text-left">Nama</th>
              <th class="p-2 text-left">Slug</th>
              <th class="p-2 text-left">Phone</th>
              <th class="p-2 text-left">Alamat</th>
              <th class="p-2 text-center">Open</th>
              <th class="p-2 text-center">Status</th>
              <th class="p-2 text-center w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(p, i) in partners.data"
              :key="p.id"
              class="border-b"
            >
              <td class="p-2">{{ partners.from + i }}</td>
              <td class="p-2">{{ p.name }}</td>
              <td class="p-2">{{ p.slug }}</td>
              <td class="p-2">{{ p.phone }}</td>
              <td class="p-2 truncate max-w-xs">
                {{ p.street_address ?? '-' }}
              </td>
              <td class="p-2 text-center">
                <span
                  class="px-2 py-0.5 rounded text-xs"
                  :class="p.is_open == true 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'"
                >
                  {{ p.is_open == true  ? 'Buka' : 'Tutup' }}
                </span>
              </td>
              <td class="p-2 text-center">
                <span
                  class="px-2 py-0.5 rounded text-xs"
                  :class="p.is_active == true 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'"
                >
                  {{ p.is_active == true  ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="p-2 flex gap-2 justify-center">
                <Link :href="`/admin/mitra/${p.id}/edit`">
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  @click="confirmDelete(p)"
                >
                  Hapus
                </Button>
              </td>
            </tr>

            <tr v-if="partners.data.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">
                Tidak ada data partner
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- DELETE DIALOG -->
      <Dialog v-model:open="showDeleteDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Partner?</DialogTitle>
            <DialogDescription>
              Partner
              <strong>{{ selectedPartner?.name }}</strong>
              akan dihapus secara
              <span class="text-red-600 font-semibold">PERMANEN</span>.
              <br />
              Seluruh cabang yang terhubung tidak akan ikut terhapus.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter class="flex justify-end gap-2">
            <Button variant="outline" @click="showDeleteDialog = false">
              Batal
            </Button>
            <Button variant="destructive" @click="deletePartner">
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <!-- PAGINATION -->
      <div
        v-if="partners.links"
        class="flex justify-center mt-4"
      >
        <nav
          class="flex items-center gap-1 text-sm
                overflow-x-auto whitespace-nowrap px-2 pb-3
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >

          <!-- FIRST PAGE -->
          <Link
            v-if="partners.links[1]?.url"
            :href="partners.links[1].url"
            preserve-scroll
            preserve-state
            class="px-3 py-1 rounded bg-muted hover:text-blue-500"
          >
            <ChevronsLeft class="w-4 h-4" />
          </Link>

          <!-- NUMBERED PAGES -->
          <template
            v-for="(link, i) in partners.links.filter(l => /^\d+$/.test(l.label))"
            :key="i"
          >
            <Link
              v-if="link.url"
              :href="link.url"
              preserve-scroll
              preserve-state
              class="px-3 py-1 rounded bg-muted hover:text-blue-500"
              :class="{
                'bg-primary text-primary-foreground font-semibold': link.active
              }"
            >
              {{ link.label }}
            </Link>

            <span
              v-else
              class="px-3 py-1 rounded opacity-50"
            >
              {{ link.label }}
            </span>
          </template>

          <!-- LAST PAGE -->
          <Link
            v-if="partners.links[partners.links.length - 2]?.url"
            :href="partners.links[partners.links.length - 2].url"
            preserve-scroll
            preserve-state
            class="px-3 py-1 rounded bg-muted hover:text-blue-500"
          >
            <ChevronsRight class="w-4 h-4" />
          </Link>

        </nav>
      </div>



    </div>
  </AppLayout>
</template>
