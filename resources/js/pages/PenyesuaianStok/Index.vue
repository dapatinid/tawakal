<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { type BreadcrumbItem } from '@/types'
import debounce from 'lodash/debounce'
import {
  Search,
  ChevronsLeft,
  ChevronsRight,
  PackageSearch,
  Factory,
  Plus,
  ClipboardList,
  Printer,
  Download,
  Upload,
} from 'lucide-vue-next'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import { onMounted, ref, watch } from 'vue'


// =======================================================
// PROPS
// =======================================================
const props = defineProps<{
  adjustments: any
  filters: any
}>()

// =======================================================
// BREADCRUMB
// =======================================================
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Penyesuaian Stok', href: '/penyesuaian-stok' },
]



// =======================================================
// FILTER STATE
// =======================================================
const searchQuery = ref(props.filters?.search ?? '')
const statusFilter = ref(props.filters?.status ?? '')
const flagFilter = ref(props.filters?.flag ?? '')

// =======================================================
// APPLY FILTER (SERVER SIDE)
// =======================================================
let initialized = false

// 1. Buat fungsi debounce secara terpisah
const debouncedFetchStok = debounce((params) => {
  router.get(
    '/penyesuaian-stok',
    params,
    {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    }
  )
}, 1000) 

watch(
  [searchQuery, statusFilter, flagFilter],
  () => {
    // 2. Cek inisialisasi agar immediate: true tidak langsung trigger API
    if (!initialized) {
      initialized = true
      return
    }

    // 3. Jalankan fungsi debounce
    debouncedFetchStok({
      search: searchQuery.value,
      status: statusFilter.value,
      flag: flagFilter.value,
      page: 1,
    })
  },
  { immediate: true }
)

// =======================================================
// DELETE
// =======================================================
const showDeleteDialog = ref(false)
const selected = ref<any>(null)

function confirmDelete(row: any) {
  selected.value = row
  showDeleteDialog.value = true
}

function deleteAdjustment() {
  if (!selected.value) return

  router.delete(`/penyesuaian-stok/${selected.value.id}`, {
    preserveScroll: true,        
    onSuccess: () => {
      showDeleteDialog.value = false
      selected.value = null
    },
  })
}

// =======================================================
// UPDATE STATUS
// =======================================================
function updateAdjustmentStatus(adjustment: any, status: string) {
  router.put(
    `/penyesuaian-stok/${adjustment.id}/editinfo`,
    { status },
    {
      preserveScroll: true,
    }
  );
}


// =======================================================
// UTIL
// =======================================================
function flagLabel(flag: string) {
  switch (flag) {
    case 'opname':
      return 'Stok Opname'
    case 'production':
      return 'Production'
    case 'tf_out':
      return 'Transfer Out'
    case 'tf_in':
      return 'Transfer In'
    default:
      return flag
  }
}

// fungsi util untuk pilih icon berdasarkan flag
function flagIcon(flag: string) {
  switch(flag) {
    case 'opname':
      return ClipboardList
    case 'production':
      return Factory
    case 'tf_out':
      return Upload
    case 'tf_in':
      return Download
    default:
      return ClipboardList
  }
}

function sumAdjustment(items: any[] = []) {
  return items.reduce((total, item) => {
    const subtotal   = Number(item.subtotal ?? 0)    // dari quantity_mins * price
    const totalcost  = Number(item.totalcost ?? 0)   // dari quantity_plus * cost

    return total + subtotal - totalcost
  }, 0)
}


function openPrintPackingSlip(id: number) {
  window.open(`/penyesuaian-stok/${id}/print-surat-jalan`, '_blank');
}
function openPrint(id: number) {
  window.open(`/penyesuaian-stok/${id}/print`, '_blank');
}


const cardGradient = (status: string) => {
  // Default card background
  const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--background') || '#ffffff';

  // Status colors
  let statusColor = '';
  switch (status) {
    case 'new':
      statusColor = '#2563eb'; // blue-600
      break;
    case 'done':
      statusColor = '#16a34a'; // green-600
      break;
    case 'canceled':
      statusColor = '#dc2626'; // red-600
      break;
    default:
      statusColor = 'transparent';
  }

  // Buat versi RGBA agar transisi smooth
  const rgbaStatus = statusColor.replace(/^#([0-9a-f]{6})$/i, (_, hex) => {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.5)`; // alpha 0.5 untuk blending
  });

  // Gradient smooth: status color (25%) → transparent → background
  return {
    background: `linear-gradient(to top left, ${rgbaStatus} 0%, ${rgbaStatus} 1%, ${defaultBg} 25%)`
  };
};


</script>

<template>
  <Head title="Penyesuaian Stok" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="px-3 mt-5 space-y-4">
      
      <div class="flex overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 gap-2 items-center">
        <button
          @click="flagFilter = ''"
          :class="flagFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        >
          All Types
        </button>
        <button
          @click="flagFilter = 'opname'"
          :class="flagFilter === 'opname' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        >
          Stok Opname
        </button>
        <button
          @click="flagFilter = 'production'"
          :class="flagFilter === 'production' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        >
          Production
        </button>
        <button
          @click="flagFilter = 'tf_out'"
          :class="flagFilter === 'tf_out' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        >
          Transfer Out
        </button>
        <button
          @click="flagFilter = 'tf_in'"
          :class="flagFilter === 'tf_in' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        >
          Transfer In
        </button>
      </div>

      <div class="flex justify-between gap-2 items-center">

        <div class="relative me-auto w-full lg:w-72">
          <label for="pencarian"><Search class="absolute left-3 top-2.5 size-5 text-gray-400" /></label>
          <input id="pencarian"
            v-model="searchQuery"
            placeholder="Cari kode / catatan..."
            class="ps-10 px-3 py-2.5 rounded-lg text-sm
                  bg-white dark:bg-gray-900
                  border border-gray-300 dark:border-gray-600
                  focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
          />
        </div>

          <select
            v-model="statusFilter"
            class="px-3 py-1.5 text-sm border rounded-md
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  border-gray-300 dark:border-gray-700"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>  

      </div>
    </div>

    <!-- LIST -->
    <div class="p-3 mt-2">
      <div
        v-if="props.adjustments.data.length === 0"
        class="text-center text-gray-500 py-12"
      >
        <PackageSearch class="mx-auto mb-2 size-8 opacity-40" />
        Tidak ada data adjustment
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
      >
        <template v-for="a in props.adjustments.data" :key="a.id">
          <ContextMenu>
            <ContextMenuTrigger>
              <Link :href="`/penyesuaian-stok/${a.id}/edit`" class="block">
                <div
                  class="relative p-4 rounded-lg hover:shadow-xl transition-all duration-500"
                  :style="cardGradient(a.status)"
                >
                  <!-- STATUS BADGE -->
                  <div
                    class="absolute -top-0.5 left-3 px-2 text-xs rounded"
                    :class="{
                      'text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800': a.status === 'new',
                      'text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-800': a.status === 'done',
                      'text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-800': a.status === 'canceled',
                    }"
                  >
                    {{ flagLabel(a.flag) }} • {{ a.status }}
                  </div>

                  <div class="relative mt-3 space-y-1 z-5">
                    <div class="font-semibold flex items-center gap-2">
                      <span>{{ a.code }} </span>
                        <span
                          v-if="a.counterpart_branch_name"
                          class="text-xs text-gray-500 text-right"
                        >
                          ↔ {{ a.counterpart_branch_name }}
                        </span>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ a.date }}
                      <span v-if="a.transfer_token" class="text-blue-600 font-bold">{{ a.transfer_token }}</span>
                    </div>
                    <div v-if="a.notes" class="text-sm text-gray-400 truncate">
                      <span
                        :class="sumAdjustment(a.items) >= 0 ? 'text-green-600' : 'text-red-600'"
                      >
                        {{ sumAdjustment(a.items).toLocaleString('id-ID') }}
                      </span> | {{ a.notes }}
                    </div>
                  </div>

                  <div class="absolute right-3 bottom-3 z-0 opacity-20">
                    <component :is="flagIcon(a.flag)" class="size-20 text-gray-400" />
                  </div>
                </div>
              </Link>
            </ContextMenuTrigger>

            <ContextMenuContent>
              
              <ContextMenuItem @click="openPrintPackingSlip(a.id)">
                Surat Jalan <Printer class="size-4 ms-auto" />
              </ContextMenuItem>
              <ContextMenuItem @click="openPrint(a.id)">
                Print <Printer class="size-4 ms-auto" />
              </ContextMenuItem>
              
              <div class="border-t my-1"></div>

              <ContextMenuItem class="text-blue-600" @click.prevent="updateAdjustmentStatus(a, 'new')" v-if="a.flag != 'tf_out' && a.flag != 'tf_in' && a.status != 'canceled'">
                Set: New
              </ContextMenuItem>
              <ContextMenuItem class="text-green-600" @click.prevent="updateAdjustmentStatus(a, 'done')" v-if="a.flag != 'tf_out' && a.flag != 'tf_in' && a.status != 'canceled'">
                Set: Done
              </ContextMenuItem>
              <ContextMenuItem class="text-blue-600" @click.prevent="updateAdjustmentStatus(a, 'new')" v-if="a.status == 'canceled'">
                Set: New
              </ContextMenuItem>
              <ContextMenuItem class="text-red-600" @click.prevent="updateAdjustmentStatus(a, 'canceled')" v-if="a.status != 'canceled'">
                Set: Canceled
              </ContextMenuItem>

              <div class="border-t my-1"></div>

              <ContextMenuItem class="text-red-600" @click.prevent="confirmDelete(a)">
                Hapus
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </template>
      </div>



    </div>

    <!-- PAGINATION -->
    <div
      v-if="props.adjustments.links?.length > 3"
      class="flex justify-center mt-4"
    >
      <nav class="flex items-center gap-1 text-sm px-2 pb-3">
        <Link
          v-if="props.adjustments.links[1]?.url"
          :href="props.adjustments.links[1].url"
          class="px-3 py-1 border rounded"
        >
          <ChevronsLeft class="size-4" />
        </Link>

        <template
          v-for="(link, i) in props.adjustments.links.filter(l => /^\d+$/.test(l.label))"
          :key="i"
        >
          <Link
            :href="link.url"
            class="px-3 py-1 border rounded"
            :class="{ 'bg-gray-200 font-semibold': link.active }"
          >
            {{ link.label }}
          </Link>
        </template>

        <Link
          v-if="props.adjustments.links[props.adjustments.links.length - 2]?.url"
          :href="props.adjustments.links[props.adjustments.links.length - 2].url"
          class="px-3 py-1 border rounded"
        >
          <ChevronsRight class="size-4" />
        </Link>
      </nav>
    </div>

    <!-- FLOATING BUTTON -->
    <!-- CREATE -->
    <div class="pb-24">
      <Link
        href="/penyesuaian-stok/create"
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
          <DialogTitle>Hapus Adjustment?</DialogTitle>
          <DialogDescription>
            Adjustment <strong>{{ selected?.code }}</strong> akan dihapus.
            <br />
            Semua stok & akun akan di-rollback.
            <br />
            <span class="text-red-600 font-semibold">
              Tindakan ini tidak bisa dibatalkan.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex justify-end gap-2">
          <button
            class="px-4 py-2 border rounded"
            @click="showDeleteDialog = false"
          >
            Batal
          </button>

          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            @click="deleteAdjustment"
          >
            Ya, Hapus
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </AppLayout>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>