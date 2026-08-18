<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Wallet, QrCode, Landmark, CircleDollarSign, Plus, Trash, ArrowRightLeft } from 'lucide-vue-next'
import { FileDown } from 'lucide-vue-next'

const exportUrl = computed(() => {
    const params = new URLSearchParams()

    if (dateFrom.value) params.set('date_from', dateFrom.value)
    if (dateTo.value)   params.set('date_to',   dateTo.value)

    return `/laba-rugi/export?${params.toString()}`
})

const page = usePage()

/* =======================
   DATA
======================= */
const payments = computed(() => page.props.payments ?? [])
const summary = computed(() => page.props.summary)
const accountBalances = computed(() => page.props.accountBalance ?? [])

/* =======================
   SPLIT DATA (FRONTEND)
======================= */
const paymentsLRKR = computed(() =>
  payments.value.filter((p: any) =>
    String(p.kredit_akun ?? '').includes('LR-KR')
  )
)

const paymentsLRDB = computed(() =>
  payments.value.filter((p: any) =>
    String(p.debit_akun ?? '').includes('LR-DB')
  )
)

/* =======================
   PURE GROUPING (SUMMARY)
======================= */
const groupedLRKR = computed(() => {
  const map: Record<string, number> = {}

  paymentsLRKR.value.forEach((p: any) => {
    const akun = p.kredit_akun || 'Tanpa Akun'
    map[akun] = (map[akun] || 0) + Number(p.nominal)
  })

  return Object.entries(map).map(([akun, total]) => ({
    akun,
    total,
  }))
})

const groupedLRDB = computed(() => {
  const map: Record<string, number> = {}

  paymentsLRDB.value.forEach((p: any) => {
    const akun = p.debit_akun || 'Tanpa Akun'
    map[akun] = (map[akun] || 0) + Number(p.nominal)
  })

  return Object.entries(map).map(([akun, total]) => ({
    akun,
    total,
  }))
})

/* =======================
   TOTAL SUM
======================= */
const totalPemasukan = computed(() =>
  groupedLRKR.value.reduce((sum, row) => sum + Number(row.total), 0)
)

const totalPengeluaran = computed(() =>
  groupedLRDB.value.reduce((sum, row) => sum + Number(row.total), 0)
)


/* =======================
   FILTER STATE
======================= */
const dateFrom = ref(page.props.filters?.date_from ?? '')
const dateTo   = ref(page.props.filters?.date_to ?? '')
const orderBy  = ref(page.props.filters?.order_by ?? 'date')
const orderDir = ref(page.props.filters?.order_dir ?? 'desc')

/* =======================
   BREADCRUMBS
======================= */
const breadcrumbs = [{ title: 'Laba Rugi', href: '/laba-rugi' }]

/* =======================
   WATCH FILTER
======================= */
watch(
  [dateFrom, dateTo, orderBy, orderDir],
  debounce(() => {
    router.get(
      '/laba-rugi',
      {
        date_from: dateFrom.value || undefined,
        date_to: dateTo.value || undefined,
        order_by: orderBy.value,
        order_dir: orderDir.value,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    )
  }, 400)
)

/* =======================
   RESET FILTER
======================= */
const resetFilter = () => {
  dateFrom.value = ''
  dateTo.value = ''
  orderBy.value = 'date'
  orderDir.value = 'desc'
}

function truncateWords(text: string | null, limit = 8) {
  if (!text) return '-'
  const words = text.trim().split(/\s+/)
  return words.length <= limit ? text : words.slice(0, limit).join(' ') + '...'
}
</script>

<template>
  <Head title="Laba Rugi" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-3 space-y-4">

      <!-- =======================
           FILTERS
      ======================== -->
      <div class="flex flex-nowrap items-center gap-3 p-4 rounded-xl overflow-x-auto no-scrollbar
                  bg-gray-100/70 dark:bg-gray-800/70
                  border border-gray-200 dark:border-gray-700">

        <input type="date" v-model="dateFrom" class="px-3 py-2 rounded-lg text-sm" />
        <span>s.d</span>
        <input type="date" v-model="dateTo" class="px-3 py-2 rounded-lg text-sm" />

        <div class="ms-auto flex gap-3 items-center">
          <span>Sort</span>
          <select v-model="orderBy" class="px-2 py-1 border rounded text-xs">
            <option value="date">Tanggal</option>
            <option value="payment_method">Metode</option>
            <option value="mutation_type">Mutasi</option>
            <option value="created_at">Created</option>
            <option value="updated_at">Updated</option>
          </select>

          <select v-model="orderDir" class="px-2 py-1 border rounded text-xs">
            <option value="desc">DESC</option>
            <option value="asc">ASC</option>
          </select>

          <button
            @click="resetFilter"
            class="px-4 py-2 rounded-lg text-sm bg-gray-300 dark:bg-gray-700">
            Reset
          </button>

          <a
              :href="exportUrl"
              target="_blank"
              class="px-2 py-2 rounded-lg text-sm font-medium
                    flex items-center gap-2 whitespace-nowrap
                    bg-green-600 text-white hover:bg-green-700
                    transition-colors"
          >
              <FileDown class="size-4" />              
          </a>
        </div>
      </div>

      <!-- =======================
           TABLE LR-KR
      ======================== -->
      <h3 class="text-sm font-semibold px-2">Pemasukan</h3>

      <div class="scroll-container overflow-x-auto rounded-2xl border bg-white/70 dark:bg-gray-900/70">
        <table class="text-sm table-auto w-full">
          <thead class="bg-gray-100/80 dark:bg-gray-800/80 border-b">
            <tr>
              <th class="px-3 py-3 text-left">#</th>
              <th class="px-4 py-3 text-left">Akun</th>
              <th class="px-4 py-3 text-right">Nominal</th>
            </tr>
          </thead>
            <tbody>
              <tr
                  v-for="(row, i) in groupedLRKR"
                  :key="row.akun"
                  class="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800"
              >
                  <td class="px-3 py-3 w-6">{{ i + 1 }}</td>
                  <td class="px-4 py-3 font-semibold">
                  {{ row.akun.slice(6).trim() }}
                  </td>
                  <td class="px-4 py-3 text-right font-bold text-green-600">
                  {{ row.total.toLocaleString('id-ID') }}
                  </td>
              </tr>

              <tr v-if="groupedLRKR.length === 0">
                  <td colspan="3" class="px-6 py-10 text-center text-gray-500">
                  Data tidak tersedia
                  </td>
              </tr>

              <template v-if="groupedLRKR.length">
                <tr class="border-t bg-gray-50 dark:bg-gray-800">
                  <td class="px-3 py-3"></td>
                  <td class="px-4 py-3 font-semibold">
                    Total Pemasukan
                  </td>
                  <td class="px-4 py-3 text-right font-bold text-green-600">
                    {{ totalPemasukan.toLocaleString('id-ID') }}
                  </td>
                </tr>
              </template>


            </tbody>


        </table>
      </div>

      <!-- =======================
           TABLE LR-DB
      ======================== -->
      <h3 class="text-sm font-semibold px-2">Pengeluaran</h3>

      <div class="scroll-container overflow-x-auto rounded-2xl border bg-white/70 dark:bg-gray-900/70">
        <table class="text-sm table-auto w-full">
          <thead class="bg-gray-100/80 dark:bg-gray-800/80 border-b">
            <tr>
              <th class="px-3 py-3 text-left">#</th>
              <th class="px-4 py-3 text-left">Akun</th>
              <th class="px-4 py-3 text-right">Nominal</th>
            </tr>
          </thead>
            <tbody>
              <tr
                  v-for="(row, i) in groupedLRDB"
                  :key="row.akun"
                  class="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800"
              >
                  <td class="px-3 py-3 w-6">{{ i + 1 }}</td>
                  <td class="px-4 py-3 font-semibold">
                  {{ row.akun.slice(6).trim() }}
                  </td>
                  <td class="px-4 py-3 text-right font-bold text-red-600">
                  {{ row.total.toLocaleString('id-ID') }}
                  </td>
              </tr>

              <tr v-if="groupedLRDB.length === 0">
                  <td colspan="3" class="px-6 py-10 text-center text-gray-500">
                  Data tidak tersedia
                  </td>
              </tr>

              <template v-if="groupedLRDB.length">
                <tr class="border-t bg-gray-50 dark:bg-gray-800">
                  <td class="px-3 py-3"></td>
                  <td class="px-4 py-3 font-semibold">
                    Total Pengeluaran
                  </td>
                  <td class="px-4 py-3 text-right font-bold text-red-600">
                    {{ totalPengeluaran.toLocaleString('id-ID') }}
                  </td>
                </tr>
              </template>


            </tbody>


        </table>
      </div>


        <!-- =======================
            SUMMARY LABA RUGI
        ======================= -->
        <div
        class="mt-4 p-4 rounded-xl border
                bg-gray-100/70 dark:bg-gray-800/70
                border-gray-200 dark:border-gray-700
                space-y-2 text-sm">

        <div class="flex justify-between">
            <span class="font-semibold">
            Laba / Rugi Bersih
            </span>
            <span
            class="font-bold"
            :class="Number(summary.total_nominal ?? 0) >= 0
                ? 'text-green-600'
                : 'text-red-600'">
            {{ Number(summary.total_nominal).toLocaleString('id-ID') }}
            </span>
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
</style>
