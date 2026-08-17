<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, usePage, router } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted } from 'vue'
import debounce from 'lodash/debounce'

const page = usePage()

/* =======================
 | TABS
 ======================= */
const activeTab = ref<'saldo' | 'neraca'>('saldo')

/* =======================
 | DATA FROM BACKEND
 ======================= */
const assets = computed(() => page.props.assets)
const liabilities = computed(() => page.props.liabilities)
const meta = computed(() => page.props.meta)
const accountBalances = computed(() => page.props.accountBalance ?? [])

/* =======================
 | FILTER STATE (NERACA)
 ======================= */
const dateFrom = ref(page.props.filters?.date_from ?? '')
const dateTo   = ref(page.props.filters?.date_to ?? '')

/* =======================
 | BREADCRUMBS
 ======================= */
const breadcrumbs = [{ title: 'Neraca', href: '/neraca' }]

/* =======================
 | WATCH FILTER
 | (HANYA UNTUK TAB NERACA)
 ======================= */
watch(
  [dateFrom, dateTo],
  debounce(() => {
    if (activeTab.value !== 'neraca') return

    router.get(
      '/neraca',
      {
        date_from: dateFrom.value || undefined,
        date_to: dateTo.value || undefined,
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
 | FORMATTER
 ======================= */
const format = (n: number) =>
  Number(n || 0).toLocaleString('id-ID')

/* =====================================================
 | TAB 1 — NERACA SALDO (ACCOUNT BALANCE)
 ===================================================== */

/* NR ONLY */
const nrBalances = computed(() =>
  accountBalances.value.filter((r: any) =>
    String(r.akun).includes('NR-')
  )
)

/* ASSET */
const saldoAssets = computed(() =>
  nrBalances.value
    .filter((r: any) => String(r.akun).includes('NR-DB'))
    .map((r: any) => ({
      akun: r.akun,
      total: Number(r.balance),
    }))
)

const totalSaldoAssets = computed(() =>
  saldoAssets.value.reduce((t: number, r: any) => t + r.total, 0)
)

/* LIABILITAS / EKUITAS */
const saldoLiabilities = computed(() =>
  nrBalances.value
    .filter((r: any) => String(r.akun).includes('NR-KR'))
    .map((r: any) => ({
      akun: r.akun,
      total: Number(r.balance) * -1,
    }))
)


const totalSaldoLiabilities = computed(() =>
  saldoLiabilities.value.reduce((t: number, r: any) => t + r.total, 0)
)

/* =======================
 | LABA RUGI BERJALAN
 | (DARI ACCOUNT BALANCE)
 ======================= */
const labaRugiSaldo = computed(() =>
  accountBalances.value
    .filter((r: any) => String(r.akun).startsWith('LR-'))
    .reduce((t: number, r: any) => t + (Number(r.balance) * -1), 0)
)


/* TOTAL LIABILITAS + EKUITAS + LABA RUGI */
const totalSaldoLiabilitiesFinal = computed(() =>
  totalSaldoLiabilities.value + labaRugiSaldo.value
)


/* =======================
 | TABS HANDLER
 ======================= */

const saldoTab = ref<HTMLElement | null>(null)
const neracaTab = ref<HTMLElement | null>(null)

const bgStyle = computed(() => {
  const el =
    activeTab.value === 'saldo'
      ? saldoTab.value
      : neracaTab.value

  if (!el) return {}

  return {
    width: `${el.offsetWidth}px`,
    transform: `translateX(${el.offsetLeft}px)`,
  }
})

function setTab(tab: 'saldo' | 'neraca') {
  activeTab.value = tab
}

onMounted(() => {
  activeTab.value = activeTab.value
})

</script>

<template>
  <Head title="Neraca" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-4 space-y-4">

      <!-- =======================
           TABS
      ======================== -->
<div class="relative inline-flex gap-2 border-b-2 w-full border-background">
  <!-- Sliding Background -->
  <div
    class="absolute top-0 left-0 h-full rounded-t-lg bg-background transition-transform duration-300 ease-in-out"
    :style="bgStyle"
  />

  <button
    ref="saldoTab"
    class="relative z-10 px-4 py-2 text-sm font-semibold rounded-t-lg"
    :class="activeTab === 'saldo'
      ? 'text-blue-600'
      : 'text-foreground'"
    @click="setTab('saldo')"
  >
    Neraca Saldo
  </button>

  <button
    ref="neracaTab"
    class="relative z-10 px-4 py-2 text-sm font-semibold rounded-t-lg"
    :class="activeTab === 'neraca'
      ? 'text-blue-600'
      : 'text-foreground'"
    @click="setTab('neraca')"
  >
    Neraca
  </button>
</div>




      <!-- =================================================
           TAB 1 — NERACA SALDO (DEFAULT)
      ================================================== -->
      <div v-if="activeTab === 'saldo'" class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- ASSET -->
        <div class="border bg-white/70 dark:bg-gray-900/70">
          <h3 class="px-4 py-3 font-semibold border-b bg-accent">
            ASSET
          </h3>

          <table class="w-full text-sm">
            <tbody>
              <tr v-for="(row, i) in saldoAssets" :key="row.akun">
                <td class="px-4 py-2 w-6">{{ i + 1 }}</td>
                <td class="px-4 py-2">{{ row.akun.slice(6).trim() }}</td>
                <td class="px-4 py-2 text-right font-semibold">
                  {{ format(row.total) }}
                </td>
              </tr>

              <tr class="border-t font-bold">
                <td colspan="2" class="px-4 py-3">TOTAL ASSET</td>
                <td class="px-4 py-3 text-right">
                  {{ format(totalSaldoAssets) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- LIABILITAS / EKUITAS -->
        <div class="border bg-white/70 dark:bg-gray-900/70">
          <h3 class="px-4 py-3 font-semibold border-b bg-accent">
            LIABILITAS & EKUITAS
          </h3>

          <table class="w-full text-sm">
            <tbody>
              <tr v-for="(row, i) in saldoLiabilities" :key="row.akun">
                <td class="px-4 py-2 w-6">{{ i + 1 }}</td>
                <td class="px-4 py-2">{{ row.akun.slice(6).trim() }}</td>
                <td class="px-4 py-2 text-right font-semibold">
                  {{ format(row.total) }}
                </td>
              </tr>

                <tr class="border-t font-semibold">
                <td colspan="2" class="px-4 py-3">
                    LABA / RUGI BERJALAN
                </td>
                <td
                    class="px-4 py-3 text-right"
                    :class="labaRugiSaldo >= 0
                    ? 'text-green-600'
                    : 'text-red-600'"
                >
                    {{ format(labaRugiSaldo) }}
                </td>
                </tr>


              <tr class="border-t font-bold">
                <td colspan="2" class="px-4 py-3">
                  TOTAL LIABILITAS & EKUITAS
                </td>
                <td class="px-4 py-3 text-right">
                  {{ format(totalSaldoLiabilitiesFinal) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- =================================================
           TAB 2 — NERACA (DINAMIS)
      ================================================== -->
      <div v-if="activeTab === 'neraca'" class="space-y-4">

        <!-- NERACA GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- ASSET -->
          <div class="border bg-white/70 dark:bg-gray-900/70">
            <h3 class="px-4 py-3 font-semibold border-b bg-accent">
              ASSET
            </h3>

            <table class="w-full text-sm">
              <tbody>
                <tr v-for="(row, i) in assets.rows" :key="row.akun">
                  <td class="px-4 py-2 w-6">{{ i + 1 }}</td>
                  <td class="px-4 py-2">{{ row.akun.slice(6).trim() }}</td>
                  <td class="px-4 py-2 text-right font-semibold">
                    {{ format(row.total) }}
                  </td>
                </tr>

                <tr class="border-t font-bold">
                  <td colspan="2" class="px-4 py-3">TOTAL ASSET</td>
                  <td class="px-4 py-3 text-right">
                    {{ format(assets.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- LIABILITAS & EKUITAS -->
          <div class="border bg-white/70 dark:bg-gray-900/70">
            <h3 class="px-4 py-3 font-semibold border-b bg-accent">
              LIABILITAS & EKUITAS
            </h3>

            <table class="w-full text-sm">
              <tbody>
                <tr v-for="(row, i) in liabilities.rows" :key="row.akun">
                  <td class="px-4 py-2 w-6">{{ i + 1 }}</td>
                  <td class="px-4 py-2">{{ row.akun.slice(6).trim() }}</td>
                  <td
                    class="px-4 py-2 text-right font-semibold"
                    :class="row.akun.includes('Laba')
                      ? row.total >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                      : ''"
                  >
                    {{ format(row.total) }}
                  </td>
                </tr>

                <tr class="border-t font-bold">
                  <td colspan="2" class="px-4 py-3">
                    TOTAL LIABILITAS & EKUITAS
                  </td>
                  <td class="px-4 py-3 text-right">
                    {{ format(liabilities.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>


        <!-- FILTER -->
        <div
          class="flex flex-wrap gap-3 p-4 items-center rounded-xl
                 bg-gray-100/70 dark:bg-gray-800/70
                 border border-gray-200 dark:border-gray-700">

          <input type="date" v-model="dateFrom" class="px-3 py-2 rounded-lg text-sm" />
          <span>s.d</span>
          <input type="date" v-model="dateTo" class="px-3 py-2 rounded-lg text-sm" />

          <div class="ms-auto text-sm font-semibold">
            <span
              :class="meta?.is_balance
                ? 'text-green-600'
                : 'text-red-600'">
              {{ meta?.is_balance ? 'NERACA IMBANG' : 'NERACA TIDAK IMBANG' }}
            </span>
          </div>
        </div>        
      </div>

    </div>
  </AppLayout>
</template>
