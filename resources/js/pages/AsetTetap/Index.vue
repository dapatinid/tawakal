<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/vue3';
import { ChevronsLeft, ChevronsRight, Plus, Search, Building2, Car, Drill } from 'lucide-vue-next';
import { ref, watch, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

const props = defineProps<{
  assets: any, // Menggunakan 'assets' sesuai konteks
  totalBookValue?: number | null,
  filters: {
    search?: string
    category?: string
    status?: 'active' | 'sold' | 'disposed' | 'archived' | 'all'
    sort_by?: string
    sort_dir?: string
  }
}>()

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Aset Tetap',
        href: '/aset-tetap',
    },
];

// Reactive state untuk Filter
const searchQuery = ref(props.filters.search ?? '')
const filterCategory = ref(props.filters.category ?? 'all')
const filterStatus = ref(props.filters.status ?? 'all')
const sortBy = ref(props.filters.sort_by ?? 'created_at')
const sortDir = ref(props.filters.sort_dir ?? 'desc')

// 1. Buat fungsi debounced router get
const debouncedApplyFilter = debounce((params) => {
  router.get(
    '/aset-tetap',
    params,
    {
      preserveState: true,
      replace: true,
    }
  )
}, 1000) // Jeda 1000ms

// 2. Gunakan watch untuk memantau perubahan
let initialized = false
watch(
  [searchQuery, filterCategory, filterStatus, sortBy, sortDir],
  () => {
    // Hindari request saat pertama kali halaman dimuat
    if (!initialized) {
      initialized = true
      return
    }

    debouncedApplyFilter({
      search: searchQuery.value || undefined,
      category: filterCategory.value !== 'all' ? filterCategory.value : undefined,
      status: filterStatus.value !== 'all' ? filterStatus.value : undefined,
      sort_by: sortBy.value,
      sort_dir: sortDir.value,
    })
  },
  { immediate: true }
)

// 3. Opsional: Bersihkan timer saat komponen hancur
onUnmounted(() => {
  debouncedApplyFilter.cancel()
})

// Helper untuk Icon Kategori
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'bangunan': return Building2;
    case 'kendaraan': return Car;
    default: return Drill;
  }
}

// Helper untuk warna badge status
const statusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'sold': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'disposed': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
}

const calculateTotalValue = () => {
  router.get(
    '/aset-tetap',
    { ...props.filters, calculate: true },
    { preserveState: true, preserveScroll: true }
  )
}
</script>

<template>
    <Head title="Daftar Aset Tetap" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="pt-3 pb-24">

            <div class="flex flex-nowrap items-center gap-3 mx-3 p-4 rounded-xl overflow-x-auto no-scrollbar
                  bg-gray-100/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
                
                <div class="relative shrink-0">
                  <select v-model="filterStatus" class="appearance-none bg-background border-0 px-3 py-1 pr-8 rounded-md text-sm font-medium focus:outline-none cursor-pointer">
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif (Depresiasi)</option>
                    <option value="sold">Terjual</option>
                    <option value="disposed">Dibuang/Rusak</option>
                    <option value="archived">Diarsipkan</option>
                  </select>
                  <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">▾</span>
                </div>

                <div class="relative shrink-0">
                  <select v-model="filterCategory" class="appearance-none bg-background border-0 px-3 py-1 pr-8 rounded-md text-sm font-medium focus:outline-none cursor-pointer">
                    <option value="all">Semua Kategori</option>
                    <option value="bangunan">Bangunan</option>
                    <option value="kendaraan">Kendaraan</option>
                    <option value="peralatan">Peralatan</option>
                  </select>
                  <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">▾</span>
                </div>

                <span class="ms-auto text-sm text-muted-foreground shrink-0">Urutkan:</span>

                <div class="relative shrink-0">
                  <select v-model="sortBy" class="appearance-none bg-background border-0 px-3 py-1 pr-8 rounded-md text-sm font-medium focus:outline-none cursor-pointer">
                    <option value="name">Nama</option>
                    <option value="purchase_date">Tgl Beli</option>
                    <option value="purchase_cost">Harga Beli</option>
                    <option value="created_at">Baru Ditambahkan</option>
                  </select>
                  <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">▾</span>
                </div>

                <div class="relative shrink-0">
                  <select v-model="sortDir" class="appearance-none bg-background border-0 px-3 py-1 pr-8 rounded-md text-sm font-medium focus:outline-none cursor-pointer">
                    <option value="asc">Terlama</option>
                    <option value="desc">Terbaru</option>
                  </select>
                  <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">▾</span>
                </div>                    
            </div>

            <div class="flex flex-wrap-reverse md:flex-nowrap justify-between items-center gap-3 p-3">
                <div class="relative md:w-80 w-full">
                    <Search class="absolute left-3 top-2.5 size-5 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari kode atau nama aset..." 
                          class="w-full border rounded-md px-3 py-2 ps-10
                                bg-white text-gray-900
                                dark:bg-gray-800 dark:text-gray-100
                                dark:border-gray-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
            </div>

            <div class="px-3 mb-5">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div v-for="asset in props.assets.data" :key="asset.id" class="group">
                        <div class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                            
                            <div class="p-4">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex items-center gap-2">
                                        <component :is="getCategoryIcon(asset.category)" class="size-5 text-blue-500" />
                                        <span class="text-xs font-mono text-gray-500 uppercase">{{ asset.asset_code }}</span>
                                    </div>
                                    <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase', statusClass(asset.status)]">
                                        {{ asset.status }}
                                    </span>
                                </div>

                                <Link :href="`/aset-tetap/${asset.id}`" class="block group-hover:text-blue-500 transition">
                                    <h3 class="font-bold text-lg leading-tight line-clamp-1">{{ asset.name }}</h3>
                                </Link>

                                <div class="mt-4 space-y-2 border-t dark:border-gray-800 pt-3">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-500">Harga Perolehan:</span>
                                        <span class="font-medium">Rp {{ Number(asset.purchase_cost).toLocaleString() }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm text-red-500">
                                        <span>Akum. Penyusutan:</span>
                                        <span>- Rp {{ Number(asset.accumulated_depreciation).toLocaleString() }}</span>
                                    </div>
                                    <div class="flex justify-between text-md font-bold text-green-600 dark:text-green-400 border-t dark:border-gray-800 pt-2">
                                        <span>Nilai Buku:</span>
                                        <span>Rp {{ Number(asset.book_value).toLocaleString() }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                                <div class="text-[10px] text-gray-500">
                                    Tgl Beli: {{ new Date(asset.purchase_date).toLocaleDateString('id-ID') }}
                                </div>
                                <div class="flex -space-x-2">
                                    <template v-if="asset.images && asset.images.length">
                                        <img v-for="(img, idx) in asset.images.slice(0,3)" :key="idx" 
                                            :src="`/storage/${img}`" class="size-6 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="props.assets.last_page > 1" class="mt-4 mb-6 px-3 flex justify-center">
                <div class="flex gap-1 overflow-x-auto no-scrollbar">
                    <button v-for="(link, i) in props.assets.links" :key="i"
                      @click="router.get(link.url)"
                      :disabled="!link.url"
                      v-html="link.label"
                      class="px-3 py-1 rounded-lg text-sm"
                      :class="link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 disabled:opacity-30'"
                    />
                </div>
            </div>

            <div class="mx-3 p-6 rounded-2xl bg-blue-600 text-white shadow-xl flex justify-between items-center">
                <div>
                    <p class="text-blue-100 text-sm">Estimasi Nilai Buku Seluruh Aset</p>
                    <h2 class="text-3xl font-bold mt-1">
                        Rp {{ props.totalBookValue ? Number(props.totalBookValue).toLocaleString() : '---' }}
                    </h2>
                </div>
                <button @click="calculateTotalValue" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-md transition text-sm">
                    Refresh Kalkulasi
                </button>
            </div>

            <Link href="/aset-tetap/tambah" class="fixed bottom-6 right-6 size-12 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all">
                <Plus class="size-6" />
            </Link>

        </div>
    </AppLayout>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>