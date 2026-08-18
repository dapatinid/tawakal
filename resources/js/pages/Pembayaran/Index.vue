<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Wallet, QrCode, Landmark, CircleDollarSign, Search, Plus, Banknote, Gem, Coins, LinkIcon, Link2, ChevronsRight, ChevronsLeft } from 'lucide-vue-next'

const page = usePage()

// ===== DATA =====
const payments = computed(() => page.props.payments)
const summary = computed(() => page.props.summary)
const accountBalances = computed(() => page.props.accountBalance ?? [])
const admins = computed(() => page.props.admins ?? [])

// ===== FILTER STATE =====
const dateFrom = ref(page.props.filters?.date_from ?? '')
const dateTo = ref(page.props.filters?.date_to ?? '')
const paymentMethod = ref(page.props.filters?.payment_method ?? '')
const userAdmin = ref<number | null>(page.props.filters?.user_admin ?? null)
const userId = ref(page.props.filters?.user_id ?? null)
const search = ref(page.props.filters?.search ?? '')
const orderBy = ref(page.props.filters?.order_by ?? 'date')
const orderDir = ref(page.props.filters?.order_dir ?? 'desc')

const extractPaymentMethod = (akun: string) =>
  akun?.match(/\(([^)]+)\)/)?.[1]?.toUpperCase() ?? null

const paymentMethodSelect = computed(() => {
  const methods = accountBalances.value
    .map(acc => extractPaymentMethod(acc.akun))
    .filter(Boolean)

  // unique
  return [...new Set(methods)].map(m => ({
    label: m,
    value: m.toLowerCase(), // untuk dikirim ke backend
  }))
})

const userAdminSelect = computed(() => {
  return admins.value.map(u => ({
    label: u.name,
    value: u.id, // kirim ID ke backend
  }))
})


// ===== ICON MAP =====
const extractMethod = (akun: string) => {
  if (!akun) return 'LAINNYA';
  
  // Mencoba mengambil teks di dalam kurung, misal: "Kas Toko (CASH)" -> "CASH"
  const match = akun.match(/\(([^)]+)\)/);
  const result = match ? match[1] : akun; 
  
  return result.toUpperCase().trim();
}
const iconMap: Record<string, any> = {
  CASH: CircleDollarSign,
  "MAIN CASH": Gem,
  "PETTY CASH": Coins,
  EWALLET: Wallet,
  BANK: Landmark,
  TRANSFER: Landmark,
  QRIS: QrCode,
}

// ===== BREADCRUMBS =====
const breadcrumbs = [{ title: 'Pembayaran', href: '/pembayaran' }]

// ===== WATCH FILTER =====
watch(
  [dateFrom, dateTo, paymentMethod, orderBy, orderDir, userId, search, userAdmin],
  debounce(() => {
    router.get(
      '/pembayaran',
      {
        date_from: dateFrom.value || undefined,
        date_to: dateTo.value || undefined,
        payment_method: paymentMethod.value || undefined,
        user_id: userId.value || undefined,
        search: search.value || undefined,
        order_by: orderBy.value,
        order_dir: orderDir.value,
        user_admin: userAdmin.value ?? undefined,
      },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }, 1000)
)

// ===== RESET =====
const resetFilter = () => {
  dateFrom.value = ''
  dateTo.value = ''
  paymentMethod.value = ''
  userAdmin.value = null
  userId.value = null
  search.value = ''
  orderBy.value = 'date'
  orderDir.value = 'desc'
}

// Pagination
const activeFilters = computed(() => ({
  date_from: dateFrom.value || undefined,
  date_to: dateTo.value || undefined,
  payment_method: paymentMethod.value || undefined,
  user_id: userId.value ?? undefined,
  user_admin: userAdmin.value ?? undefined,
  search: search.value || undefined,
  order_by: orderBy.value,
  order_dir: orderDir.value,
}))


const goToPage = (url: string | null) => {
  if (!url) return

  router.get(
    url,
    activeFilters.value,
    {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    }
  )
}

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

function setToday() {
  dateFrom.value = todayISO()
  dateTo.value = todayISO()
}
function setYesterday() {
  dateFrom.value = minusDaysISO(1)
  dateTo.value = minusDaysISO(1)
}


</script>

<template>
  <Head title="Pembayaran" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="py-3 space-y-3">

      <!-- Account Balance Carousel -->
      <div
        class="flex p-1 px-3 md:mx-3 md:px-0 gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth
              [-ms-overflow-style:none] [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="(acc, i) in accountBalances"
          :key="i"
          class="snap-center shrink-0
                w-[80%] sm:w-[45%] lg:w-[23%]
                relative overflow-hidden rounded-2xl
                border border-gray-200/60 dark:border-gray-700/60
                bg-white/70 dark:bg-gray-900/60 backdrop-blur
                shadow-sm hover:shadow-md transition-all p-4"
        >
          <component
            :is="iconMap[extractMethod(acc.akun)] ?? Banknote"
            class="absolute -right-2 -bottom-2 w-24 h-24
                  text-gray-50 dark:text-gray-700
                  pointer-events-none"
          />

          <div class="relative z-10 space-y-1">
            <div class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {{ extractMethod(acc.akun) }}
            </div>

            <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ Number(acc.balance).toLocaleString('id-ID') }}
            </div>

            <div class="text-xs text-gray-400 dark:text-gray-500 truncate">
              {{ new Date(acc.updated_at).toLocaleString('id-ID') }}
            </div>
          </div>
        </div>
      </div>


      <!-- Filters -->
      <div class="flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-3 p-4 mx-3 rounded-xl bg-gray-100/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">      
        
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

            <!-- KEMARIN -->
            <button
              @click="setYesterday"
              class="text-sm px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-500 text-nowrap"
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

      
        <input type="date" v-model="dateFrom" class="px-3 py-2 rounded-lg text-sm" />
        <span>s.d</span>
        <input type="date" v-model="dateTo" class="px-3 py-2 rounded-lg text-sm" />

        <div class="ms-auto flex flex-nowrap gap-3 items-center">
          <span>Sort</span>
          <select v-model="orderBy" class="px-2 py-1 border rounded text-xs">
            <option value="date">Tanggal</option>
            <option value="payment_method">Dompet</option>
            <option value="mutation_type">Mutasi</option>
            <option value="created_at">Created At</option>
            <option value="updated_at">Updated At</option>
          </select>
          <select v-model="orderDir" class="px-2 py-1 border rounded text-xs">
            <option value="desc">DESC</option>
            <option value="asc">ASC</option>
          </select>
          <button @click="resetFilter" class="ms-auto px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-sm">Reset</button>
        </div>
      </div>

      <!-- =======================
           SEARCH
      ======================== -->
      <div class="w-full flex justify-start items-center gap-3 px-3">
        <div class="relative w-full md:w-72">
          <label for="pencarian"><Search class="absolute left-3 top-2.5 size-5 text-gray-400" /></label>
          <input id="pencarian"
            v-model="search"
            type="text"
            placeholder="Cari..."
            class="ps-10 px-3 py-2.5 rounded-lg text-sm
          bg-white dark:bg-gray-900
          border border-gray-300 dark:border-gray-600
          focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
          />
        </div>

        <select
          v-model="paymentMethod"
          class="px-3 py-2 rounded-lg text-sm
                bg-white dark:bg-gray-900
                border border-gray-300 dark:border-gray-600"
        >
          <option value="">Semua Dompet</option>

          <option
            v-for="m in paymentMethodSelect"
            :key="m.value"
            :value="m.value"
          >
            {{ m.label }}
          </option>
        </select>        
      </div>

      <!-- Table -->
      <div class="hidden md:block scroll-container overflow-x-auto rounded-2xl border mx-3 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm">
        <table class="min-w-full text-sm">
          <thead class="sticky top-0 z-10 bg-gray-100/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">#</th>
              <th class="px-4 py-3 text-left">Tanggal</th>
              <th class="px-4 py-3 text-left">Pihak Terkait</th>
              <th class="px-4 py-3 text-left">Dompet</th>
              <th class="px-4 py-3 text-left">Keterangan</th>
              <th class="px-4 py-3 text-right">Nominal</th>
              <th class="px-4 py-3 text-left">Dibuat</th>
              <th class="px-4 py-3 text-left">Diubah</th>
              <th class="px-4 py-3 text-left">Cabang</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in payments.data" :key="p.id" class="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3">{{ payments.from + i }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <Link v-if="p.paymentable_url && p.paymentable_type !== 'App\\Models\\Journal'" :href="p.paymentable_url" class="text-blue-600 hover:underline font-medium">{{ p.date }}</Link>
                <template v-else>
                  <Link
                    v-if="p.target_branch_id == null"
                    :href="`/jurnal/${p.paymentable_id}/edit`"
                    class="text-blue-600 hover:underline font-medium"
                  >
                    {{ p.date }} 
                  </Link>

                  <!-- 3️⃣ Journal transfer → READ ONLY -->
                  <span
                    v-else
                    class="text-gray-400 cursor-not-allowed font-medium"
                    title="Journal transfer tidak dapat diedit"
                  >
                    {{ p.date }}
                  </span>
                </template>
              <br><span class="text-sm text-gray-400">{{ p.code !== '-' ? p.code : p.sku }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ p.user?.name ?? '-' }}<div v-if="p.paymentable?.user_alias" class="text-xs text-gray-400">{{ p.paymentable.user_alias }}</div></td>
              <td class="px-4 py-3">{{ p.payment_method ?? '-' }}</td>

              <td class="px-4 py-3">
                <div
                  :class="[
                    ((p.mutation_type ?? '') + ' | ' + (p.notes ?? p.paymentable_notes)).length >= 30
                      ? 'w-[30ch]'
                      : 'w-auto',
                    'line-clamp-6 break-words'
                  ]"
                >
                  <span>{{ p.mutation_type }}</span><br><span class="text-gray-500">{{ p.notes ?? p.paymentable_notes }}</span> 
                </div>
              </td>

              <td class="px-4 py-3 text-right font-semibold" :class="p.kredit_akun.includes('CASH / BANK') ? 'text-red-600' : 'text-green-600'">
                <span v-if="p.kredit_akun.includes('CASH / BANK')">-</span>{{ Number(p.nominal ?? 0).toLocaleString('id-ID') }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium">
                  {{ p.user_cre?.name ?? '-' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ p.created_at
                    ? new Date(p.created_at).toLocaleString('id-ID')
                    : '-' }}
                </div>
              </td>

              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium">
                  {{ p.user_upd?.name ?? '-' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ p.updated_at
                    ? new Date(p.updated_at).toLocaleString('id-ID')
                    : '-' }}
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ p.branch?.name ?? '-' }}</td>
            </tr>
            <tr v-if="payments.data.length === 0"><td colspan="9" class="px-6 py-10 text-center text-gray-500">Data pembayaran tidak tersedia</td></tr>
          </tbody>
          <tfoot class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <tr>
              <td colspan="5" class="px-4 py-3 font-semibold text-right">TOTAL</td>
              <td class="px-4 py-3 text-right font-bold">{{ Number(summary.total_nominal).toLocaleString('id-ID') }}</td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="md:hidden space-y-2 mx-3">
        <div
          v-for="(p, i) in payments.data"
          :key="p.id"
          class="border rounded-xl p-3 bg-white dark:bg-gray-900 shadow-sm"
        >
          <!-- Header: Nomor + Metode (DENGAN ICON) + Nominal -->
          <div class="flex justify-between items-start">
            <div class="flex-1 flex gap-3 items-start">
              <!-- ICON WRAPPER -->
              <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <component
                  :is="iconMap[extractMethod(p.payment_method ?? '')] ?? Banknote"
                  class="size-5 text-gray-600 dark:text-gray-400"
                />
              </div>
              
              <div>
                <div class="font-medium leading-none mb-1">{{ p.payment_method ?? '-' }}</div>
                <div class="text-md text-gray-500">
                  <template v-if="p.paymentable?.user_alias">
                    <span>{{ p.paymentable.user_alias }}</span> 
                    <span class="text-xs text-gray-400 block">{{ p.user?.name ?? '-' }}</span>
                  </template> 
                  <template v-else>
                    <span>{{ p.user?.name ?? '-' }}</span>
                  </template>
                </div>
              </div>
            </div>

            <!-- Nominal -->
            <div class="text-right font-semibold text-green-600" v-if="!p.kredit_akun.includes('CASH / BANK')">
              {{ Number(p.nominal ?? 0).toLocaleString('id-ID') }}
            </div>
            <div class="text-right font-semibold text-red-600" v-else>
              -{{ Number(p.nominal ?? 0).toLocaleString('id-ID') }}
            </div>
          </div>

          <!-- Body: Tanggal + Keterangan -->
          <div class="mt-2 text-sm text-gray-600 dark:text-gray-200 relative">
            <div class="text-nowrap line-clamp-1 truncate">{{ p.date }} <span class="text-xs text-gray-400">({{ p.code !== '-' ? p.code : p.sku }})</span></div>
            <div class="mt-1 line-clamp-4 break-words pe-8">
              {{ p.mutation_type }} <span class="text-gray-400">{{ p.notes ?? p.paymentable_notes }}</span>
            </div>

            <!-- Dropdown Aksi -->
            <Link v-if="p.paymentable_url && p.paymentable_type !== 'App\\Models\\Journal'" :href="p.paymentable_url" class="absolute right-0 bottom-0 text-blue-600 hover:underline font-medium"><Link2 class="size-5" /></Link>
            <template v-else>
              <Link
                v-if="p.target_branch_id == null"
                :href="`/jurnal/${p.paymentable_id}/edit`"
                class="absolute right-0 bottom-0 text-blue-600 hover:underline font-medium"
              >
                <Link2 class="size-5" /> 
              </Link> 

              <!-- 3️⃣ Journal transfer → READ ONLY -->
              <span
                v-else
                class="absolute right-0 bottom-0 text-gray-400 cursor-not-allowed font-medium"
                title="Journal transfer tidak dapat diedit"
              >
                <Link2 class="size-5" />
              </span>
            </template>
          </div>
        </div>

        <!-- Total Nominal Card -->
        <div class="mt-3 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-right font-bold text-lg flex justify-between items-center">
           <span>TOTAL :</span> <span>{{ Number(summary.total_nominal).toLocaleString('id-ID') }}</span> 
        </div>
      </div>

      <!-- =======================
          PAGINATION (MOBILE SAFE)
      ======================= -->
      <div class="mt-4 mb-6 px-3">
        <div class="overflow-x-auto no-scrollbar">
          <div class="flex w-max gap-1 lg:mx-auto">

            <!-- First -->
            <button
              :disabled="!payments.first_page_url"
              @click="goToPage(payments.first_page_url)"
              class="shrink-0 px-3 py-1 rounded-lg text-sm
                    bg-gray-200 dark:bg-gray-700
                    disabled:opacity-50"
            >
              <ChevronsLeft class="w-4 h-4" />
            </button>

            <!-- Numbers -->
            <button
              v-for="(link, i) in payments.links.filter(l => /^\d+$/.test(l.label))"
              :key="i"
              @click="goToPage(link.url)"
              class="shrink-0 px-3 py-1 rounded-lg text-sm"
              :class="link.active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'"
            >
              {{ link.label }}
            </button>

            <!-- Last -->
            <button
              :disabled="!payments.last_page_url"
              @click="goToPage(payments.last_page_url)"
              class="shrink-0 px-3 py-1 rounded-lg text-sm
                    bg-gray-200 dark:bg-gray-700
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