<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce'
import { Search, ListFilter, BarChart3, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

/* =====================================================
 * BASIC
 * ===================================================== */
const page = usePage()

const breadcrumbs = [{ title: 'Retur', href: '/retur' }]
const user = page.props.auth?.user

const stokList = computed(() => page.props.stokList)
const summary  = computed(() => page.props.summary)
const admins   = computed(() => page.props.admins ?? [])
const groupedData = computed(() => page.props.groupedData ?? null)

/* =====================================================
 * FILTER STATE
 * ===================================================== */
const productId     = ref<number | null>(page.props.filters?.product_id ?? null)
const productSearch = ref(page.props.filters?.product_search ?? '')
const dateFrom      = ref(page.props.filters?.date_from ?? '')
const dateTo        = ref(page.props.filters?.date_to ?? '')
const flagFilter    = ref(page.props.filters?.flag ?? '')
const statusFilter  = ref(page.props.filters?.status ?? '')
const orderBy       = ref(page.props.filters?.order_by ?? 'date')
const orderDir      = ref(page.props.filters?.order_dir ?? 'desc')
const userAdmin     = ref<number | null>(page.props.filters?.user_admin ?? null)
const viewMode      = ref(page.props.filters?.view ?? 'list') // 'list' atau 'grouped'

/* =====================================================
 * PRODUCT SEARCH DROPDOWN
 * ===================================================== */
const products = ref(page.props.products ?? [])
const isOpen = ref(false)
const isSelectingProduct = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

/* =====================================================
 * HELPERS
 * ===================================================== */
const buildQuery = () => ({
  product_id: productId.value ?? undefined,
  product_search: productId.value ? undefined : productSearch.value || undefined,
  date_from: dateFrom.value || undefined,
  date_to: dateTo.value || undefined,
  flag: flagFilter.value || undefined,
  status: statusFilter.value || undefined,
  order_by: viewMode.value === 'grouped' ? 'name' : orderBy.value,
  order_dir: viewMode.value === 'grouped' ? 'asc' : orderDir.value,
  user_admin: userAdmin.value ?? undefined,
  view: viewMode.value,
})

const fetchStok = debounce(() => {
  router.get('/retur', buildQuery(), {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  })
}, 400)

/* =====================================================
 * TOGGLE VIEW MODE
 * ===================================================== */
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grouped' : 'list'
  fetchStok()
}

/* =====================================================
 * WATCHERS (FILTER)
 * ===================================================== */
watch(
  [productId, dateFrom, dateTo, flagFilter, statusFilter, orderBy, orderDir, userAdmin],
  () => {
    if (isSelectingProduct.value) return
    fetchStok()
  }
)

/* =====================================================
 * WATCHERS (PRODUCT SEARCH INPUT)
 * ===================================================== */
watch(
  productSearch,
  debounce((value) => {
    if (isSelectingProduct.value) return

    if (!value) {
      productId.value = null
      isOpen.value = false
      fetchStok()
      return
    }

    isOpen.value = true

    router.get(
      '/retur',
      { ...buildQuery(), product_search: value },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['products'],
      }
    )
  }, 400)
)

/* =====================================================
 * SELECT PRODUCT
 * ===================================================== */
const selectProduct = (product: any) => {
  isSelectingProduct.value = true

  productId.value = Number(product.id)
  productSearch.value = `${product.name} (${product.stock})`
  isOpen.value = false

  router.get('/retur', buildQuery(), {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    onFinish: () => {
      isSelectingProduct.value = false
    },
  })
}

/* =====================================================
 * RESET
 * ===================================================== */
const resetFilter = () => {
  productId.value = null
  productSearch.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  flagFilter.value = ''
  statusFilter.value = ''
  orderBy.value = 'date'
  orderDir.value = 'desc'
  userAdmin.value = null
  viewMode.value = 'list'
  isOpen.value = false

  router.get('/retur', {}, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  })
}

/* =====================================================
 * PAGINATION
 * ===================================================== */
const goToPage = (url: string | null) => {
  if (!url) return

  router.get(url, buildQuery(), {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  })
}

/* =====================================================
 * ADMIN SELECT
 * ===================================================== */
const userAdminSelect = computed(() =>
  admins.value.map(u => ({ label: u.name, value: u.id }))
)

/* =====================================================
 * DROPDOWN CLICK OUTSIDE
 * ===================================================== */
const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
onBeforeUnmount(() => {
  fetchStok.cancel()
})

watch(products, v => {
  if (!v.length) isOpen.value = false
})
watch(() => page.props.products, v => {
  products.value = v ?? []
})
</script>


<template>
  <Head title="Retur" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-3 space-y-3">
      <!-- Filter -->
      <div class="flex flex-nowrap items-center gap-3 p-4 rounded-xl overflow-x-auto no-scrollbar
                  bg-gray-100/70 dark:bg-gray-800/70 border
                  border-gray-200 dark:border-gray-700">

        <div>
          <select v-model="flagFilter" class="px-3 py-2 rounded-lg text-sm
              bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600
              focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua Type</option>
            <option value="Penjualan">Jual</option>
            <option value="Pembelian">Beli</option>
            <!-- <option value="opname">Opname</option>
            <option value="production">Produksi</option>
            <option value="tf_out">Tf Out</option>
            <option value="tf_in">Tf In</option> -->
          </select>
        </div>

        <!-- STATUS -->
        <!-- <select
          v-model="statusFilter"
          class="px-3 py-2 rounded-lg text-sm
              bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="new">New</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="success">Success</option>
          <option value="done">Done</option>
          <option value="applied">Applied</option>
          <option value="canceled">Canceled</option>
        </select>   -->
        
        <select
          v-model="userAdmin"
          class="px-3 py-2 rounded-lg text-sm
                bg-white dark:bg-gray-900
                border border-gray-300 dark:border-gray-600"
        >
          <option :value="null">Oleh Semua</option>

          <option
            v-for="u in userAdminSelect"
            :key="u.value"
            :value="u.value"
          >
            {{ u.label }}
          </option>
        </select>

        <!-- Date From -->
        <div>
          <input v-model="dateFrom" type="date" class="px-3 py-2 rounded-lg text-sm" />
        </div>

        <div class=""><span>s.d</span></div>

        <!-- Date To -->
        <div> <input v-model="dateTo" type="date" class="px-3 py-2 rounded-lg text-sm" />
        </div>

        <div class="ms-auto flex flex-nowrap gap-3 items-center">
          
          <!-- Sort (hidden saat grouped view) -->
          <template v-if="viewMode === 'list'">
            <span>Sort</span>

            <select v-model="orderBy" class="px-2 py-1 border rounded text-xs">
              <option value="date">Tanggal</option>
              <option value="name">Produk</option>
              <option value="status">Status</option>
              <option value="created_at">Dibuat</option>
              <option value="updated_at">Diedit</option>
            </select>

            <select v-model="orderDir" class="px-2 py-1 border rounded text-xs">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </template>

          <!-- Reset -->
          <button @click="resetFilter" class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-sm">Reset</button>
        </div>
      </div>

      <!-- Search & Toggle View -->
      <div class="flex gap-3 items-center">
        <!-- Product search -->
        <div ref="dropdownRef" class="relative w-full md:w-72">
          <label for="pencarian"><Search class="absolute left-3 top-2.5 size-5 text-gray-400" /></label>
          <input id="pencarian"
            v-model="productSearch"
            type="text"
            placeholder="Cari produk..."
            class="ps-10 px-3 py-2.5 rounded-lg text-sm
         bg-white dark:bg-gray-900
         border border-gray-300 dark:border-gray-600
         focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
            @input="isOpen = true"
            @focus="isOpen = true"
            @keydown.esc="isOpen = false"
          />

          <div
            v-if="isOpen && products.length"
            class="absolute mt-1 z-20 w-full rounded-xl border
                   border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-900 shadow-lg max-h-60 overflow-auto"
          >
            <button
              v-for="p in products"
              :key="p.id"
              @click="selectProduct(p)"
              class="w-full text-left px-3 py-2 text-sm
                     hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              {{ p.name }}
              <span class="text-xs text-gray-400 ml-1">{{ p.stock }}</span>
            </button>
          </div>
        </div>

        <!-- Toggle View Button -->
        <button
          @click="toggleViewMode"
          class="ms-auto px-4 py-2.5 rounded-lg text-sm font-medium
                 flex items-center gap-2 whitespace-nowrap
                 transition-colors"
          :class="viewMode === 'grouped' 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          <component :is="viewMode === 'grouped' ? ListFilter : BarChart3" class="size-4" />
          {{ viewMode === 'grouped' ? 'List' : 'Group' }}
        </button>
      </div>

      <!-- ============================================
           GROUPED VIEW TABLE
           ============================================ -->
      <div
        v-if="viewMode === 'grouped' && groupedData"
        class="scroll-container overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700
               bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm"
      >
        <table class="min-w-full text-sm">
          <thead
            class="sticky top-0 z-10 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur
                   border-b border-gray-200 dark:border-gray-700"
          >
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">#</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Produk</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Jual</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Beli</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in groupedData"
              :key="item.product_id"
              class="odd:bg-white even:bg-gray-100
                     dark:odd:bg-gray-900 dark:even:bg-gray-800
                     hover:bg-blue-100 dark:hover:bg-gray-700
                     transition-colors"
            >
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium text-gray-800 dark:text-gray-100">{{ item.product_name }}</div>
                <div class="text-xs text-gray-400">ID: {{ item.product_id }}</div>
              </td>
              <td class="px-4 py-3 text-right text-red-600 font-medium">{{ Number(item.qty_jual).toLocaleString('id-ID') }}</td>
              <td class="px-4 py-3 text-right text-green-600 font-medium">{{ -Number(item.qty_beli).toLocaleString('id-ID') }}</td>
            </tr>

            <!-- Empty -->
            <tr v-if="groupedData.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                Tidak ada data yang sesuai filter
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ============================================
           LIST VIEW TABLE (EXISTING)
           ============================================ -->
      <div
        v-if="viewMode === 'list' && stokList"
        class="scroll-container overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700
               bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm"
      >
        <table class="min-w-full text-sm">
          <thead
            class="sticky top-0 z-10 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur
                   border-b border-gray-200 dark:border-gray-700"
          >
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">#</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Produk</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Price</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">ReturJual</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300" :class="user?.level == null ? 'hidden' : ''">Nilai</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Cost</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">ReturBeli</th>
              <th class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300" :class="user?.level == null ? 'hidden' : ''">Nilai</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Dibuat</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Diubah</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Cabang</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in stokList.data"
              :key="item.id"
              class="odd:bg-white even:bg-gray-100
                     dark:odd:bg-gray-900 dark:even:bg-gray-800
                     hover:bg-blue-100 dark:hover:bg-gray-700
                     transition-colors"
            >
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ stokList.from + index }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <Link
                  v-if="item.returnable_url"
                  :href="item.returnable_url"
                  class="text-blue-600 hover:underline font-medium"
                  title="Lihat order"
                >
                  {{ item.date }}
                </Link>

                <span v-else class="text-gray-400">
                  {{ item.date ?? '-' }}
                </span>
                <br><span class="text-sm text-gray-400">{{ item.code }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium text-gray-800 dark:text-gray-100">{{ item.name }}</div>
                <div class="text-xs text-gray-400">ID: {{ item.product_id }} | {{ item.flag ? item.flag : 'induk dihapus' }} | {{ item.status }}</div>
              </td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-200">{{ Number(item.price).toLocaleString('id-ID') }}</td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-200">{{ item.quantity_mins }}</td>
              <td class="px-4 py-3 text-right font-semibold text-green-600"  :class="user?.level == null ? 'hidden' : ''">{{ Number(item.subtotal).toLocaleString('id-ID') }}</td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-200">{{ Number(item.cost).toLocaleString('id-ID') }}</td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-200">{{ item.quantity_plus }}</td>
              <td class="px-4 py-3 text-right font-semibold text-red-600"  :class="user?.level == null ? 'hidden' : ''">{{ Number(item.totalcost).toLocaleString('id-ID') }}</td>
              
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium">
                  {{ item.user_cre?.name ?? '-' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ item.created_at
                    ? new Date(item.created_at).toLocaleString('id-ID')
                    : '-' }}
                </div>
              </td>

              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium">
                  {{ item.user_upd?.name ?? '-' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ item.updated_at
                    ? new Date(item.updated_at).toLocaleString('id-ID')
                    : '-' }}
                </div>
              </td>              
              <td class="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{{ item.branch?.name ?? '-' }}</td>
            </tr>

            <!-- Empty -->
            <tr v-if="stokList.data.length === 0">
              <td colspan="12" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                Data stok belum tersedia
              </td>
            </tr>
          </tbody>

          <!-- Summary -->
          <tfoot class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <tr>
              <td colspan="3" class="px-4 py-3 font-semibold text-right">TOTAL</td>
              <td class="px-4 py-3 text-right font-bold"></td>
              <td class="px-4 py-3 text-right font-bold">{{ summary.total_qty_mins }}</td>
              <td class="px-4 py-3 text-right font-bold text-green-600" :class="user?.level == null ? 'hidden' : ''">{{ Number(summary.total_subtotal).toLocaleString('id-ID') }}</td>
              <td class="px-4 py-3 text-right font-bold"></td>
              <td class="px-4 py-3 text-right font-bold">{{ summary.total_qty_plus }}</td>
              <td class="px-4 py-3 text-right font-bold text-red-600" :class="user?.level == null ? 'hidden' : ''">{{ Number(summary.total_totalcost).toLocaleString('id-ID') }}</td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

 
      <!-- =======================
          PAGINATION (MOBILE SAFE)
      ======================= -->
      <div
        v-if="viewMode === 'list' && stokList"
        class="mt-4 mb-6 px-3"
      >
        <div class="overflow-x-auto no-scrollbar">
          <div class="flex w-max gap-1 lg:mx-auto">

            <!-- First -->
            <button
              :disabled="!stokList.first_page_url"
              @click="goToPage(stokList.first_page_url)"
              class="shrink-0 px-3 py-1 rounded-lg text-sm
                    bg-gray-200 dark:bg-gray-700
                    text-gray-700 dark:text-gray-300
                    disabled:opacity-50"
            >
              <ChevronsLeft class="w-4 h-4" />
            </button>

            <!-- Numeric -->
            <button
              v-for="(link, i) in stokList.links.filter(l => /^\d+$/.test(l.label))"
              :key="i"
              :disabled="!link.url"
              @click="goToPage(link.url)"
              class="shrink-0 px-3 py-1 rounded-lg text-sm"
              :class="[
                link.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                !link.url && 'opacity-50 cursor-not-allowed'
              ]"
            >
              {{ link.label }}
            </button>

            <!-- Last -->
            <button
              :disabled="!stokList.last_page_url"
              @click="goToPage(stokList.last_page_url)"
              class="shrink-0 px-3 py-1 rounded-lg text-sm
                    bg-gray-200 dark:bg-gray-700
                    text-gray-700 dark:text-gray-300
                    disabled:opacity-50"
            >
              <ChevronsRight class="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>      
    
      
    </div>
  </AppLayout>
</template>


<style scoped>
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