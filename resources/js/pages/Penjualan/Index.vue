<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/vue3';
import debounce from 'lodash/debounce'
import { 
  Search, 
  Printer, 
  Banknote, 
  ChevronsRight, 
  ChevronsLeft,
  ShoppingCart,
  Wallet,
  BadgeCheck,
  AlertCircle,
  Plus,
  PackageSearch,
  Check,
  FileDown
} from 'lucide-vue-next';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

import PaymentFormModal from '@/components/PaymentFormModal.vue';
import { ref, computed, watch } from 'vue';


function todayISO() {
  return toISODateLocal(new Date())
}
function toISODateLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function minusDaysISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return toISODateLocal(d)
}

function monthRangeISO() {
  const now = new Date()

  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  return {
    start: toISODateLocal(start),
    end: toISODateLocal(end),
  }
}
function yearRangeISO() {
  const now = new Date()

  const start = new Date(now.getFullYear(), 0, 1)   // 1 Jan
  const end = new Date(now.getFullYear(), 11, 31)   // 31 Des

  return {
    start: toISODateLocal(start),
    end: toISODateLocal(end),
  }
}

function setYearThis() {
  const y = yearRangeISO()
  startDate.value = y.start
  endDate.value = y.end
}
function setMonthThis() {
  const m = monthRangeISO()
  startDate.value = m.start
  endDate.value = m.end
}
function setWeekThis() {
  startDate.value = minusDaysISO(6)
  endDate.value = todayISO()
}
function setToday() {
  startDate.value = todayISO()
  endDate.value = todayISO()
}
function setYesterday() {
  startDate.value = minusDaysISO(1)
  endDate.value = minusDaysISO(1)
}



const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Penjualan', href: '/penjualan' },
];

// Props dari backend
const props = defineProps<{
  orders: any
  orderUnpaid: number
  filters: any
  summary: {
    total_order: number
    total_grand: number
    total_paid: number
    total_unpaid: number
  }
}>();

// =====================================================================
// FILTER PARAMETER (HARUS SATU KALI SAJA!)
// =====================================================================
const paymentStatus = ref(props.filters.payment_status ?? 'all');     // all | paid | unpaid
const orderStatus = ref(props.filters.order_status ?? ''); 
const searchQuery = ref(props.filters.search ?? '');
const startDate = ref(
  props.filters.start_date && props.filters.start_date !== ''
    ? props.filters.start_date
    : todayISO()
)

const endDate = ref(
  props.filters.end_date && props.filters.end_date !== ''
    ? props.filters.end_date
    : todayISO()
)



// Apply filter ke server (server-side filtering)
let initialized = false

// 1. Definisikan fungsi debounce di luar watch
const debouncedFetch = debounce((filters) => {
  router.get(
    '/penjualan',
    filters,
    {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    }
  )
}, 1000)

watch(
  [paymentStatus, orderStatus, searchQuery, startDate, endDate],
  () => {
    // 2. Logika inisialisasi agar tidak langsung nembak API saat pertama kali load
    if (!initialized) {
      initialized = true
      return
    }

    // 3. Panggil fungsi yang sudah di-debounce
    debouncedFetch({
      payment_status: paymentStatus.value,
      order_status: orderStatus.value,
      search: searchQuery.value,
      start_date: startDate.value,
      end_date: endDate.value,
      page: 1,
    })
  },
  { immediate: true }
)


// =====================================================================
// FORMAT WAKTU
// =====================================================================
function formatDateLocal(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// =====================================================================
// MODAL PAYMENT
// =====================================================================
const showPaymentModal = ref(false);
const paymentForm = ref({
  order_id: null as number | null,
  date: '',
  nominal_plus: '' as number | string,
  payment_method: '',
});

// Hitung sisa pembayaran
function calcSisa(order: any) {
  const total = Number(order?.grand_total ?? 0);
  const paid = Number(order?.paid_amount ?? 0);
  return Math.max(total - paid, 0);
}

function openLunaskan(order: any) {
  paymentForm.value = {
    order_id: order.id,
    date: formatDateLocal(),
    nominal_plus: calcSisa(order),
    payment_method: 'cash',
  };
  showPaymentModal.value = true;
}

function formatDateForLaravel(d: string) {
  if (!d) return new Date().toISOString().slice(0, 19).replace('T', ' ');
  if (d.includes('T')) return d.replace('T', ' ') + ':00';
  return d;
}

function savePayment(data: any) {
  const payload = {
    payment_method: String(data.payment_method || paymentForm.value.payment_method || '').trim(),
    nominal_plus: Number(data.nominal_plus ?? paymentForm.value.nominal_plus ?? 0),
    date: formatDateForLaravel(String(data.date ?? paymentForm.value.date ?? '')),
  };

  if (!payload.payment_method) return alert('Pilih metode pembayaran.');
  if (!payload.date) return alert('Tanggal pembayaran harus diisi.');

  const orderId = paymentForm.value.order_id;
  if (!orderId) return alert('Order ID tidak ditemukan.');

  router.post(`/penjualan/${orderId}/pembayaran`, payload, {
    preserveScroll: true,
    onSuccess: () => (showPaymentModal.value = false),
  });
}

function openPrint(id: number) {
  window.open(`/penjualan/${id}/print`, '_blank');
}

function updateOrderStatus(order: any, status: string) {
  router.put(
    `/penjualan/${order.id}/editinfo`,
    {
      date: order.date,        // wajib agar tidak null
      status: status,
      type: order.type,        // wajib agar tidak null
      notes: order.notes ?? '',
    },
    {
      preserveScroll: true,
      onSuccess: () => {
        // optional: toast / alert
      },
    }
  );
}

// =====================================================================
// DELETE ORDER (HANYA CANCELED)
// =====================================================================
const showDeleteDialog = ref(false)
const selectedOrder = ref<any>(null)

function confirmDelete(order: any) {
  selectedOrder.value = order
  showDeleteDialog.value = true
}

function deleteOrder() {
  if (!selectedOrder.value) return

  router.delete(`/penjualan/${selectedOrder.value.id}`, {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteDialog.value = false
      selectedOrder.value = null
    },
  })
}

// =======================
// BULK LUNASKAN MODE
// =======================
const bulkMode = ref(false)
const bulkPaymentDate = ref(formatDateLocal())
const bulkPaymentMethod = ref('cash')

function bulkLunaskan(order: any) {
  const sisa = calcSisa(order)
  if (sisa <= 0) return

  if (!bulkPaymentMethod.value || !bulkPaymentDate.value) {
    alert('Tanggal & metode pembayaran wajib diisi')
    return
  }

  // 🔥 isi paymentForm seperti modal
  paymentForm.value = {
    order_id: order.id,
    date: bulkPaymentDate.value,
    nominal_plus: sisa,
    payment_method: bulkPaymentMethod.value,
  }

  // 🔥 langsung pakai logic existing
  savePayment(paymentForm.value)
}


const exportUrl = computed(() => {
  const params = new URLSearchParams()

  if (paymentStatus.value && paymentStatus.value !== 'all')
    params.set('payment_status', paymentStatus.value)
  if (orderStatus.value)
    params.set('order_status', orderStatus.value)
  if (searchQuery.value)
    params.set('search', searchQuery.value)
  if (startDate.value)
    params.set('start_date', startDate.value)
  if (endDate.value)
    params.set('end_date', endDate.value)

  return `/penjualan/export?${params.toString()}`
})


</script>

<template>
  <Head title="Penjualan" />

  <AppLayout :breadcrumbs="breadcrumbs">

    <div class="mt-4 block space-y-3 mb-2">

    <!-- SUMMARY -->
    <div class="px-3 mt-2">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">

        <!-- Total Transaksi -->
        <div class="relative p-3 rounded-lg bg-white dark:bg-gray-900 border overflow-hidden">
          <ShoppingCart
            class="absolute right-2 top-1/2 -translate-y-1/2 size-12
                  text-gray-400 dark:text-gray-700 opacity-20 z-0"
          />
          <div class="relative z-10">
            <div class="text-xs text-gray-500">Total Transaksi</div>
            <div class="font-semibold text-lg">
              {{ props.summary.total_order }}
            </div>
          </div>
        </div>

        <!-- Total Tagihan -->
        <div class="relative p-3 rounded-lg bg-white dark:bg-gray-900 border overflow-hidden">
          <Wallet
            class="absolute right-2 top-1/2 -translate-y-1/2 size-12
                  text-blue-400 dark:text-blue-700 opacity-20 z-0"
          />
          <div class="relative z-10">
            <div class="text-xs text-gray-500">Total Tagihan</div>
            <div class="font-semibold text-lg">
              Rp{{ Number(props.summary.total_grand).toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Sudah Dibayar -->
        <div class="relative p-3 rounded-lg bg-white dark:bg-gray-900 border overflow-hidden">
          <BadgeCheck
            class="absolute right-2 top-1/2 -translate-y-1/2 size-12
                  text-green-500 dark:text-green-700 opacity-20 z-0"
          />
          <div class="relative z-10">
            <div class="text-xs text-gray-500">Sudah Dibayar</div>
            <div class="font-semibold text-lg text-green-600">
              Rp{{ Number(props.summary.total_paid).toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Sisa -->
        <div class="relative p-3 rounded-lg bg-white dark:bg-gray-900 border overflow-hidden">
          <AlertCircle
            class="absolute right-2 top-1/2 -translate-y-1/2 size-12
                  text-red-500 opacity-20 z-0"
          />
          <div class="relative z-10">
            <div class="text-xs text-gray-500">Sisa</div>
            <div class="font-semibold text-lg text-red-600">
              Rp{{ Number(props.summary.total_unpaid).toLocaleString() }}
            </div>
          </div>
        </div>

      </div>
    </div>


      <!-- DATE RANGE -->
      <div class="mx-3 mt-2 overflow-y-auto no-scrollbar">
        <div class="flex flex-nowrap gap-2 items-center">

        <!-- FILTER TABS -->
        <div class="p-1 space-x-1 font-medium bg-gray-200 dark:bg-gray-800 rounded-lg flex flex-nowrap text-nowrap">
          <button
            class="px-3 py-1 text-sm border rounded-md
                  border-transparent transition-colors"
            :class="paymentStatus === 'all' 
                    ? 'bg-white dark:bg-gray-500 text-gray-900 dark:text-white border-gray-400 dark:border-gray-600' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
            @click="paymentStatus = 'all'"
          >
            All
          </button>

          <button
            class="px-3 py-1 text-sm border rounded-md
                  border-transparent transition-colors"
            :class="paymentStatus === 'unpaid' 
                    ? 'bg-red-500 dark:bg-red-600 text-white border-red-600 dark:border-red-600' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
            @click="paymentStatus = 'unpaid'"
          >
            Unpaid ({{ orderUnpaid }})
          </button>

          <button
            class="px-3 py-1 text-sm border rounded-md
                  border-transparent transition-colors"
            :class="paymentStatus === 'paid' 
                    ? 'bg-white dark:bg-gray-500 text-gray-900 dark:text-white border-gray-400 dark:border-gray-600' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
            @click="paymentStatus = 'paid'"
          >
            Paid
          </button>
        </div>

          <select
            v-model="orderStatus"
            class="px-3 py-1.5 text-sm border rounded-md
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  border-gray-300 dark:border-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="new">New</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>

          <a :href="exportUrl"
            target="_blank"
            class="px-2 py-1.5 rounded-md text-sm font-medium
                  flex items-center gap-1 whitespace-nowrap
                  bg-green-600 text-white hover:bg-green-700
                  transition-colors"
            title="Export Excel"
          >
            <FileDown class="size-4" />
          </a>          

            <!-- KEMARIN -->
            <button
              @click="setYesterday"
              class="ms-auto text-sm px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-500 text-nowrap"
            >
              Kemarin
            </button>

          <!-- HARI INI -->
          <button
            @click="setToday"
            class="text-sm px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-500 text-nowrap"
          >
            Hari ini
          </button>

          <!-- PEKAN INI -->
          <button
            @click="setWeekThis"
            class="text-sm px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-500 text-nowrap"
          >
            Pekan ini
          </button>

          <!-- BULAN INI -->
          <button
            @click="setMonthThis"
            class="text-sm px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-500 text-nowrap"
          >
            Bulan ini
          </button>

          <!-- TAHUN INI -->
          <button
            @click="setYearThis"
            class="text-sm px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-500 text-nowrap"
          >
            Tahun ini
          </button>


          <!-- INPUT MANUAL -->
          <div class="flex items-center gap-1">
            <span class="text-sm text-white">Dari</span>
            <input
              type="date"
              v-model="startDate"
              class="border rounded-md px-2 py-1 text-sm
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    dark:border-gray-700"
            />
          </div>

          <div class="flex items-center gap-1">
            <span class="text-sm text-white">Sampai</span>
            <input
              type="date"
              v-model="endDate"
              class="border rounded-md px-2 py-1 text-sm
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    dark:border-gray-700"
            />
          </div>

        </div>
      </div>  


      <div class="flex md:flex-nowrap items-end flex-wrap-reverse px-3 gap-3">

          <!-- SEARCH INPUT -->
          <div class="relative w-full">
            <label for="pencarian"><Search class="absolute left-3 top-2.5 size-5 text-gray-400" /></label>
            <input id="pencarian"
              v-model="searchQuery"
              placeholder="Cari nama customer / kode..."
                            class="w-full border rounded-md px-3 py-2 ps-10
                                bg-white text-gray-900
                                dark:bg-gray-800 dark:text-gray-100
                                dark:border-gray-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>   

          <!-- BULK ACTION ACCORDION -->
          <div class="w-full border rounded-lg overflow-hidden">
            <button
              class="w-full flex justify-between items-center px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-800"
              @click="bulkMode = !bulkMode"
            >
              <span>Lunaskan Mode</span>
              <span
                class="text-xs px-2 py-0.5 rounded"
                :class="bulkMode ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'"
              >
                {{ bulkMode ? 'AKTIF' : 'OFF' }}
              </span>
            </button>

            <div v-if="bulkMode" class="p-3 space-y-2 bg-white dark:bg-gray-900">
              <!-- Tanggal -->
              <div class="flex items-center gap-2">
                <label class="text-sm w-20">Tanggal</label>
                <input
                  type="datetime-local"
                  v-model="bulkPaymentDate"
                  class="border rounded-md px-2 py-1 text-sm w-full"
                />
              </div>

              <!-- Payment Method -->
              <div class="flex items-center gap-2">
                <label class="text-sm w-20">Metode</label>
                <select
                  v-model="bulkPaymentMethod"
                  class="border rounded-md px-2 py-1 text-sm w-full"
                >
                  <option value="cash">Cash</option>
                  <option value="main cash">Main Cash</option>
                  <option value="petty cash">Petty Cash</option>
                  <option value="bank">Bank</option>
                  <option value="ewallet">e-Wallet</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>

              <p class="text-xs text-gray-500">
                Semua tombol <strong>Lunaskan</strong> akan menggunakan tanggal & metode ini.
              </p>
            </div>
          </div>

      </div>

    </div>

    <!-- ORDERS LIST -->
    <div class="p-3">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <template v-for="o in props.orders.data" :key="o.id">
          <Link :href="`/penjualan/${o.id}`" class="block">
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  class="relative p-4 rounded-lg select-none hover:shadow-xl transition-all duration-500"
                  :class="Number(calcSisa(o)) > 0 ? 'bg-red-200 dark:bg-red-900' : 'bg-background'"
                >
                  <!-- BULK LUNASKAN BUTTON -->
                  <button
                    v-if="bulkMode && calcSisa(o) > 0"
                    @click.prevent.stop="bulkLunaskan(o)"
                    class="absolute -bottom-2 right-2 p-3 text-xs rounded-full
                          bg-green-600 hover:bg-green-700 text-white shadow"
                  >
                    <Check class="size-5"/>
                  </button>
                  <div
                    class="absolute z-10 -top-1 left-2 text-sm px-2 rounded-sm"
                    :class="{
                      'text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800': o.status === 'new',
                      'text-yellow-600 dark:text-yellow-400 bg-yellow-200 dark:bg-yellow-800': o.status === 'processing',
                      'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800': o.status === 'shipped',
                      'text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-800': o.status === 'delivered',
                      'text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-800': o.status === 'canceled',
                    }"
                  >
                    Q{{ o.q }} • {{ o.status }}
                  </div>

                  <div class=" flex justify-between items-center">
                    <div class="truncate">
                      <div class="font-semibold">{{ o.code }}</div>
                      
                      <div v-if="o.user.id == 2 || o.user.id == 3 || o.user.id == 4" class="text-sm text-gray-500">
                        {{ `${o.user_alias} (an)` }}
                      </div>
                      
                      <div v-else class="text-sm text-gray-500">
                        {{ o.user?.name || '~' }} {{ o.user_alias ? `an ${o.user_alias}` : '' }}
                      </div>
                    </div>
                    
                    <div class="text-end">
                      <div class="font-medium">Rp{{ Number(o.grand_total).toLocaleString() }}</div>
                      <div class="text-sm text-gray-500">Rp{{ Number(o.paid_amount).toLocaleString() }}</div>
                    </div>
                  </div>
                    
                  <div class="bg-accent mt-2 py-1 px-2 rounded line-clamp-1">
                    <div class="font-sm text-gray-500">{{o.notes || '-'}}</div>
                  </div>
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent>

                <ContextMenuItem @click="openLunaskan(o)"  v-if="o.change_amount < 0">
                  Lunaskan <Banknote class="size-4 ms-auto" />
                </ContextMenuItem>
                
                <ContextMenuItem @click="openPrint(o.id)">
                  Print <Printer class="size-4 ms-auto" />
                </ContextMenuItem>

                <div class="border-t my-1"></div>

                <ContextMenuItem
                  @click="updateOrderStatus(o, 'new')"
                >
                  Set: New
                </ContextMenuItem>

                <ContextMenuItem
                  @click="updateOrderStatus(o, 'processing')"
                >
                  Set: Processing
                </ContextMenuItem>

                <ContextMenuItem
                  @click="updateOrderStatus(o, 'shipped')"
                >
                  Set: Shipped
                </ContextMenuItem>

                <ContextMenuItem
                  @click="updateOrderStatus(o, 'delivered')"
                >
                  Set: Delivered
                </ContextMenuItem>

                <ContextMenuItem
                  class="text-red-600"
                  @click="updateOrderStatus(o, 'canceled')"
                >
                  Set: Canceled
                </ContextMenuItem>

                <div v-if="o.status === 'canceled'" class="border-t my-1"></div>

                <ContextMenuItem
                  v-if="o.status === 'canceled'"
                  class="text-red-600 focus:text-red-600"
                  @click.prevent="confirmDelete(o)"
                >
                  Hapus Total
                </ContextMenuItem>

              </ContextMenuContent>

            </ContextMenu>
          </Link>
        </template>
      </div>
      <div
        v-if="props.orders.data.length === 0"
        class="text-center text-gray-500 py-12 mx-auto"
      >
        <PackageSearch class="mb-2 size-8 opacity-40 mx-auto" />
        Tidak ada data transaksi
      </div>
    </div>

    <!-- PAGINATION -->
    <div
      class="flex justify-center mt-4"
      v-if="props.orders.links && props.orders.links.length > 3"
    >
      <nav
        class="flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap px-2
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-3"
      >

        <!-- FIRST PAGE -->
        <Link
          v-if="props.orders.links[1]?.url"
          :href="`${props.orders.links[1].url}&payment_status=${paymentStatus}&order_status=${orderStatus}&search=${searchQuery}&start_date=${startDate}&end_date=${endDate}`"
          class="px-3 py-1 border rounded hover:bg-gray-100"
        >
          <ChevronsLeft class="w-4 h-4" />
        </Link>

        <!-- NUMBER PAGES -->
        <template
          v-for="(link, i) in props.orders.links.filter(l => /^\d+$/.test(l.label))"
          :key="i"
        >
          <Link
            :href="link.url ? `${link.url}&payment_status=${paymentStatus}&order_status=${orderStatus}&search=${searchQuery}&start_date=${startDate}&end_date=${endDate}` : null"
            class="px-3 py-1 border rounded hover:bg-gray-100"
            :class="{
              'bg-gray-200 font-semibold dark:text-black': link.active,
              'opacity-50 pointer-events-none': !link.url
            }"
          >
            {{ link.label }}
          </Link>
        </template>

        <!-- LAST PAGE -->
        <Link
          v-if="props.orders.links[props.orders.links.length - 2]?.url"
          :href="`${props.orders.links[props.orders.links.length - 2].url}&payment_status=${paymentStatus}&order_status=${orderStatus}&search=${searchQuery}&start_date=${startDate}&end_date=${endDate}`"
          class="px-3 py-1 border rounded hover:bg-gray-100"
        >
          <ChevronsRight class="w-4 h-4" />
        </Link>

      </nav>
    </div>   

    <!-- FLOATING BUTTON -->
    <!-- CREATE -->
    <div class="pb-24">
      <Link
        href="/penjualan/buat/baru"
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

    <PaymentFormModal
      v-model="showPaymentModal"
      :payment="paymentForm"
      @save="savePayment"
    />

    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Penjualan?</DialogTitle>
          <DialogDescription>
            Penjualan <strong>{{ selectedOrder?.code }}</strong> akan dihapus
            <span class="text-red-600 font-semibold">PERMANEN</span>.
            <br />
            Semua pembayaran & stok akan di-rollback.
            <br />
            Tindakan ini tidak bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex justify-end gap-2">
          <button
            class="px-4 py-2 rounded-md border"
            @click="showDeleteDialog = false"
          >
            Batal
          </button>

          <button
            class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            @click="deleteOrder"
          >
            Ya, Hapus
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
   
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
</style>
