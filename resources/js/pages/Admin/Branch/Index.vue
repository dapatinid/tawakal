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
  branches: any
  filters: {
    search?: string
  }
}>()

/* =========================
   SEARCH (DENGAN DEBOUNCE)
========================= */
const search = ref(props.filters.search ?? '')

// 1. Definisikan fungsi debounce
const debouncedSearch = debounce((searchValue: string) => {
  router.get(
    '/admin/cabang',
    { search: searchValue },
    { preserveState: true, replace: true, preserveScroll: true }
  )
}, 1000)

// 2. Pantau perubahan input search
let initialized = false
watch(search, (newValue) => {
  if (!initialized) {
    initialized = true
    return
  }
  debouncedSearch(newValue)
})

// 3. Cleanup timer saat komponen di-unmount
onUnmounted(() => {
  debouncedSearch.cancel()
})

/* =========================
   DELETE DIALOG
========================= */
const showDeleteDialog = ref(false)
const selectedBranch = ref<any>(null)

function confirmDelete(branch: any) {
  selectedBranch.value = branch
  showDeleteDialog.value = true
}

function deleteBranch() {
  if (!selectedBranch.value) return

  router.delete(`/admin/cabang/${selectedBranch.value.id}`, {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteDialog.value = false
      selectedBranch.value = null
    },
  })
}

/* =========================
   BREADCRUMB
========================= */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Cabang', href: '/admin/cabang' },
]
</script>



<template>
  <Head title="Cabang" />

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

        <Link href="/admin/cabang/create">
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
              <th class="p-2 text-center">Partner</th>
              <th class="p-2 text-center">Open</th>
              <th class="p-2 text-center">Status</th>
              <th class="p-2 text-center w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(b, i) in branches.data"
              :key="b.id"
              class="border-b"
            >
              <td class="p-2">{{ branches.from + i }}</td>
              <td class="p-2">{{ b.name }}</td>
              <td class="p-2">{{ b.slug }}</td>
              <td class="p-2">{{ b.phone }}</td>
              <td class="p-2 truncate max-w-xs">
                {{ b.street_address ?? '-' }}
              </td>
              <td class="p-2 text-center">
                {{ b.partner?.name ?? '-' }}
              </td>
              <td class="p-2 text-center">
                <span
                  class="px-2 py-0.5 rounded text-xs"
                  :class="b.is_open == true
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'"
                >
                  {{ b.is_open == true ? 'Buka' : 'Tutup' }}
                </span>
              </td>
              <td class="p-2 text-center">
                <span
                  class="px-2 py-0.5 rounded text-xs"
                  :class="b.is_active == true
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'"
                >
                  {{ b.is_active == true ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="p-2 flex gap-2 justify-center">
                <Link :href="`/admin/cabang/${b.id}/edit`">
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  @click="confirmDelete(b)"
                >
                  Hapus
                </Button>
              </td>
            </tr>

            <tr v-if="branches.data.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500">
                Tidak ada data cabang
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- DELETE DIALOG -->
      <Dialog v-model:open="showDeleteDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Cabang?</DialogTitle>
            <DialogDescription>
              Cabang
              <strong>{{ selectedBranch?.name }}</strong>
              akan dihapus secara
              <span class="text-red-600 font-semibold">PERMANEN</span>.
              <br />
              Tindakan ini tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter class="flex justify-end gap-2">
            <Button variant="outline" @click="showDeleteDialog = false">
              Batal
            </Button>
            <Button variant="destructive" @click="deleteBranch">
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <!-- PAGINATION -->
      <div
        v-if="branches.links"
        class="flex justify-center mt-4"
      >
        <nav
          class="flex items-center gap-1 text-sm
                overflow-x-auto whitespace-nowrap px-2 pb-3
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >

          <!-- FIRST PAGE -->
          <Link
            v-if="branches.links[1]?.url"
            :href="branches.links[1].url"
            preserve-scroll
            preserve-state
            class="px-3 py-1 rounded bg-muted hover:text-blue-500"
          >
            <ChevronsLeft class="w-4 h-4" />
          </Link>

          <!-- NUMBERED PAGES -->
          <template
            v-for="(link, i) in branches.links.filter(l => /^\d+$/.test(l.label))"
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
            v-if="branches.links[branches.links.length - 2]?.url"
            :href="branches.links[branches.links.length - 2].url"
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
