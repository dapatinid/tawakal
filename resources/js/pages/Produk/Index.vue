<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/vue3';
import { ChevronsLeft, ChevronsRight, Plus, Search } from 'lucide-vue-next';
import { ref, computed, watch, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

const props = defineProps<{
  produk: any,
  brands: any[],
  categories: any[],
  totalAsset?: number | null,
  filters: {
    search?: string
    brand?: string
    category?: string
    status?: 'all' | 'active' | 'nonactive' | 'public' | 'private'
    stock_status?: 'aman' | 'low' | 'over'
    sort_by?: string
    sort_dir?: string
  }
}>()

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: '/produk',
    },
];


// Reactive state
const searchQuery = ref(props.filters.search ?? '')
const filterBrand = ref(props.filters.brand ?? null)
const filterCategory = ref(props.filters.category ?? null)
const filterActive = ref(props.filters.status ?? 'all')
const filterStockStatus = ref(props.filters.stock_status ?? 'all')
const sortBy = ref(props.filters.sort_by ?? 'name')
const sortDir = ref(props.filters.sort_dir ?? 'asc')


// Filtered & searched products
// 1. Definisikan fungsi debounce di luar watch
const debouncedApplyFilter = debounce((params) => {
  router.get(
    '/produk',
    params,
    {
      preserveState: true,
      replace: true,
    }
  )
}, 1000)

// 2. Watcher dengan flag initialized
let initialized = false

watch(
  [searchQuery, filterBrand, filterCategory, filterActive, filterStockStatus, sortBy, sortDir],
  () => {
    if (!initialized) {
      initialized = true
      return
    }

    debouncedApplyFilter({
      search: searchQuery.value || undefined,
      brand: filterBrand.value || undefined,
      category: filterCategory.value || undefined,
      status: filterActive.value !== 'all' ? filterActive.value : undefined,
      stock_status: filterStockStatus.value !== 'all' ? filterStockStatus.value : undefined,
      sort_by: sortBy.value,
      sort_dir: sortDir.value,
    })
  },
  { deep: true, immediate: true }
)

// 3. Batalkan timer jika user pindah halaman sebelum request terkirim
onUnmounted(() => {
  debouncedApplyFilter.cancel()
})


// Toggle active status
const toggleActive = (product: any) => {
    // 🔒 lock double click
    if (product._toggling) return;
    product._toggling = true;

    const originalStatus = Boolean(product.is_active);

    // optimistic update (paksa boolean)
    product.is_active = !originalStatus;

    router.put(`/produk/${product.id}/toggle-active`, {}, {
        preserveState: true,
        preserveScroll: true,

        onSuccess: (page) => {
            const updated = page.props.products?.data?.find(
                (p: any) => p.id === product.id
            );

            if (updated) {
                product.is_active = Boolean(updated.is_active);
            }

            toast.success('Product status updated');
        },

        onError: () => {
            product.is_active = originalStatus;
            toast.error('Gagal ubah status');
        },

        onFinish: () => {
            // 🔓 unlock
            product._toggling = false;
        }
    });
};


const productBgClass = (p: any) => {
  const stock = Number(p.stock)
  const lowAlert = Number(p.low_stock_alert)
  const overAlert = Number(p.overstock_alert)

  if (lowAlert != 0 && stock < lowAlert) {
    return 'bg-red-200 dark:bg-red-800'
  }

  if (overAlert != 0 && stock > overAlert) {
    return 'bg-yellow-300 dark:bg-yellow-700'
  }

  return 'bg-background'
}

const calculateAsset = () => {
  router.get(
    '/produk',
    {
      ...props.filters,
      search: searchQuery.value || undefined,
      brand: filterBrand.value || undefined,
      category: filterCategory.value || undefined,
      status: filterActive.value !== 'all' ? filterActive.value : undefined,
      stock_status: filterStockStatus.value !== 'all' ? filterStockStatus.value : undefined,
      sort_by: sortBy.value,
      sort_dir: sortDir.value,
      calculate: true,
    },
    {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    }
  )
}

</script>

<template>
    <Head title="Produk" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="pt-3 pb-24">

            <!-- Filter -->
            <div class="flex flex-nowrap items-center gap-3 mx-3 p-4 rounded-xl overflow-x-auto no-scrollbar
                  bg-gray-100/70 dark:bg-gray-800/70 border
                  border-gray-200 dark:border-gray-700">
                

                

                    <div class="relative shrink-0 overflow-hidden">
                      <select v-model="filterActive"
                        class="
                          appearance-none bg-background border-0
                          px-2 py-1 pr-5 rounded-md
                          text-sm font-medium
                          text-foreground
                          focus:outline-none cursor-pointer
                          truncate w-full
                        "
                      >
                        <option class="dark:bg-gray-800" value="all">All Status</option>
                        <option class="dark:bg-gray-800" value="active">Active</option>
                        <option class="dark:bg-gray-800" value="nonactive">Non Active</option>
                        <option class="dark:bg-gray-800" value="public">Public</option>
                        <option class="dark:bg-gray-800" value="private">Private</option>
                      </select>

                      <!-- caret -->
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        ▾
                      </span>
                    </div>

                    <div class="relative shrink-0 overflow-hidden">
                      <select
                        v-model="filterStockStatus"
                        class="
                          appearance-none bg-background border-0
                          px-2 py-1 pr-5 rounded-md
                          text-sm font-medium
                          text-foreground
                          focus:outline-none cursor-pointer
                          truncate w-full
                        "
                      >
                          <option class="dark:bg-gray-800" value="all">Aman (All)</option>
                          <option class="dark:bg-gray-800" value="low">Low Stock</option>
                          <option class="dark:bg-gray-800" value="over">Over Stock</option>
                      </select>

                      <span
                        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                              text-xs text-gray-400"
                      >
                        ▾
                      </span>
                    </div>

                    <div class="relative shrink-0 overflow-hidden">
                      <select
                        v-model="filterCategory"
                        class="
                          appearance-none bg-background border-0
                          px-2 py-1 pr-5 rounded-md
                          text-sm font-medium
                          text-foreground
                          focus:outline-none cursor-pointer
                          truncate w-full
                        "
                      >
                        <option class="dark:bg-gray-800" :value="null">All Categories</option>
                        <option class="dark:bg-gray-800"
                          v-for="c in props.categories"
                          :key="c.id"
                          :value="c.id"
                        >
                          {{ c.name }}
                        </option>
                      </select>

                      <!-- caret -->
                      <span
                        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                              text-xs text-gray-400"
                      >
                        ▾
                      </span>
                    </div>

                    <div class="relative shrink-0 overflow-hidden">
                      <select v-model="filterBrand"
                        class="
                          appearance-none bg-background border-0
                          px-2 py-1 pr-5 rounded-md
                          text-sm font-medium
                          text-foreground
                          focus:outline-none cursor-pointer
                          truncate w-full
                        "
                      >
                        <option class="dark:bg-gray-800" :value="null">All Brands</option>
                        <option class="dark:bg-gray-800"
                          v-for="b in props.brands"
                          :key="b.id"
                          :value="b.id"
                        >
                          {{ b.name }}
                        </option>
                      </select>

                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        ▾
                      </span>
                    </div>

                    <span class="ms-auto ps-3">Sort</span>

                    <!-- SORT BY -->
                    <div class="relative shrink-0 overflow-hidden">
                      <select
                        v-model="sortBy"
                        class="appearance-none bg-background border-0
                              px-2 py-1 pr-5 rounded-md
                              text-sm font-medium text-foreground
                              focus:outline-none cursor-pointer"
                      >
                        <option value="name">Name</option>
                        <option value="stock">Stock</option>
                        <option value="created_at">Created Date</option>
                        <option value="updated_at">Updated Date</option>
                      </select>
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        ▾
                      </span>
                    </div>

                    <!-- SORT DIRECTION -->
                    <div class="relative shrink-0 overflow-hidden">
                      <select
                        v-model="sortDir"
                        class="appearance-none bg-background border-0
                              px-2 py-1 pr-5 rounded-md
                              text-sm font-medium text-foreground
                              focus:outline-none cursor-pointer"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        ▾
                      </span>
                    </div>                      
                               
                
            </div>
            <div class="flex flex-wrap-reverse md:flex-nowrap justify-between items-center gap-3 p-3">

                <!-- Search product (AKAN KE BAWAH DI MOBILE) -->
                <div class="relative md:w-auto w-full">
                    <label for="pencarian"><Search class="absolute left-3 top-2.5 size-5 text-gray-400" /></label>
                    <input id="pencarian"
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Search product..." 
                    class="w-full border rounded-md px-3 py-2 ps-10
                            bg-white text-gray-900
                            dark:bg-gray-800 dark:text-gray-100
                            dark:border-gray-700
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

            </div>


            <!-- Product grid -->
            <div class="px-3 mb-5">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    <div 
                        div v-for="p in props.produk.data" :key="p.id"
                    >
                        <div class="p-3 border rounded-lg hover:shadow-md transition-all duration-500 ease-in-out flex justify-between items-center"
                          :class="productBgClass(p)"
                          :title="p.name">
                            <!-- Kiri: info product -->
                            <div class="flex-1">
                                <div class="block mb-2">
                                    <div class="font-medium line-clamp-1">{{ p.name }}</div>
                                    <div>Rp {{ Number(p.price).toLocaleString() }}</div>
                                </div>

                                <div class="flex items-center mt-2">
                                    <span class="mr-2 text-sm">Aktif</span>
                                    <input 
                                        type="checkbox" 
                                        class="toggle toggle-primary"
                                        :checked="p.is_active"
                                        @change="toggleActive(p)"
                                    />
                                    <span class="ms-auto me-1 ps-3 text-sm text-muted-foreground">Stok: </span><span class="">{{ Number(p.stock).toLocaleString() }}</span>
                                </div>
                            </div>

                            <!-- Kanan: thumbnail image / no image -->
                            <div class="ml-4 flex shrink-0">
                                <Link :href="`/produk/${p.id}/preview`">
                                    <template v-if="p.images && p.images.length">
                                        <img 
                                            :src="`/storage/${p.images[0]}`" 
                                            alt="Thumbnail" 
                                            class="w-20 h-20 object-cover rounded"
                                        />
                                    </template>
                                    <template v-else>
                                        <div class="w-20 h-20 bg-muted  rounded flex items-center justify-center text-sm text-gray-500">
                                            No image
                                        </div>
                                    </template>
                                </Link>
                            </div>
                        </div>
                    </div>


                </div>
            </div>


              <!-- =======================
                  PAGINATION (MOBILE SAFE)
              ======================= -->
              <div
                v-if="props.produk.last_page > 1"
                class="mt-4 mb-6 px-3"
              >
                <div class="overflow-x-auto no-scrollbar">
                  <div class="flex w-max gap-1 lg:mx-auto">

                    <!-- First -->
                    <button
                      :disabled="!props.produk.first_page_url"
                      @click="router.get(props.produk.first_page_url, {}, { preserveScroll: true })"
                      class="shrink-0 px-3 py-1 rounded-lg
                            bg-gray-200 dark:bg-gray-700
                            disabled:opacity-50"
                    >
                      <ChevronsLeft class="w-4 h-4" />
                    </button>

                    <!-- Numbers -->
                    <button
                      v-for="(link, i) in props.produk.links.filter(l => /^\d+$/.test(l.label))"
                      :key="i"
                      @click="router.get(link.url, {}, { preserveScroll: true })"
                      class="shrink-0 px-3 py-1 rounded-lg"
                      :class="link.active
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'"
                    >
                      {{ link.label }}
                    </button>

                    <!-- Last -->
                    <button
                      :disabled="!props.produk.last_page_url"
                      @click="router.get(props.produk.last_page_url, {}, { preserveScroll: true })"
                      class="shrink-0 px-3 py-1 rounded-lg
                            bg-gray-200 dark:bg-gray-700
                            disabled:opacity-50"
                    >
                      <ChevronsRight class="w-4 h-4" />
                    </button>

                  </div>
                </div>
              </div>         


              <!-- =======================
                  TOTAL ASSET SECTION
              ======================= -->
              <div class="px-3 mb-10 space-y-3">

                <!-- Tombol Hitung -->
                <button
                  @click="calculateAsset"
                  class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Hitung Nilai Produk
                </button>

                <!-- Hasil -->
                <div v-if="props.totalAsset !== null"
                    class="text-lg font-semibold text-background">
                  Total Nilai Produk:
                  Rp {{ Number(props.totalAsset).toLocaleString() }}
                </div>

              </div>     

              <div class="px-3 mb-10 space-y-3 space-x-3">
                <Link 
                    :href="'/produk/bulk-price'" 
                    class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                >
                    Penyesuaian Harga Massal
                </Link>    
                <Link 
                    :href="'/produk/bulk-price-alumunium'" 
                    class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                >
                    Penyesuaian Harga Massal (Alumunium)
                </Link>    
              </div>          

        <!-- FLOATING BUTTON -->
        <!-- CREATE -->
        <Link
          href="/produk/buat/baru"
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
    </AppLayout>
</template>

<style scoped>
/* Simple toggle switch (Tailwind CSS + DaisyUI style) */
.toggle {
  width: 2rem;
  height: 1rem;
  border-radius: 9999px;
  position: relative;
  appearance: none;
  background-color: #d1d5db;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.toggle:checked {
  background-color: #3b82f6;
}
.toggle::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: white;
  transition: transform 0.2s;
}
.toggle:checked::after {
  transform: translateX(1rem);
}


/* sembunyikan scrollbar tapi tetap bisa scroll */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE & Edge */
  scrollbar-width: none;     /* Firefox */
}

/* Scroll Container */
.scroll-container {
  max-height: 2000px;
  overflow-y: auto;

  /* Firefox Light Mode */
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.3) transparent;
}

/* Chrome, Edge, Safari - Light Mode */
.scroll-container::-webkit-scrollbar {
  width: 6px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.3);
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0,0,0,0.5);
}

.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

/* Dark Mode */
/* Pastikan class 'dark' diterapkan di <html> atau <body> */
html.dark .scroll-container {
  /* Firefox Dark Mode */
  scrollbar-color: rgba(128,128,128,0.6) transparent;
}

html.dark .scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(128,128,128,0.6); /* abu-abu */
}

html.dark .scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(128,128,128,0.8); /* lebih kontras saat hover */
}

html.dark .scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

</style>
