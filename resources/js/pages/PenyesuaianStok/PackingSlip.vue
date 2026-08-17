<script setup>
import { Head } from '@inertiajs/vue3'
import { onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/id'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('id')

const props = defineProps({
  adjustmentStock: Object,
})

function formatTanggal(tgl) {
  return dayjs(tgl).format('dddd, D MMM YYYY')
}

/* =========================
 * TOTAL SUM
 * ========================= */
const totalWeight = computed(() => {
  const items = props.adjustmentStock?.items
  if (!Array.isArray(items)) return 0

  return items.reduce((total, item) => {
    const weight = Number(item.totalweight || 0)

    // MINUS → dikurangkan
    if (Number(item.quantity_mins) > 0) {
      return total - weight
    }

    // PLUS → ditambahkan
    if (Number(item.quantity_plus) > 0) {
      return total + weight
    }

    return total
  }, 0)
})


onMounted(() => {
  setTimeout(() => window.print(), 100)
})
</script>


<template>
 <Head :title="'Print Order #' + props.adjustmentStock.id" />

  <div class="p-6 print:p-0 max-w-md mx-auto font-mono">
    <h2 class="text-xl font-bold mb-4">
      {{ props.adjustmentStock.code }}
    </h2>
    <h2 v-if="props.adjustmentStock.transfer_token" class="text-lg -mt-4 mb-4">
      token: {{ props.adjustmentStock.transfer_token }}
    </h2>

    <div class="mb-4">
      <div>Dibuat: <strong>{{ props.adjustmentStock.user_cre?.name || '-' }}</strong></div>
      <div>Tanggal: {{ formatTanggal(props.adjustmentStock.created_at) }}</div>
    </div>

    <table class="w-full text-sm mb-4 border-t border-b">
      <tbody>
        <tr v-for="item in props.adjustmentStock.items" :key="item.id">
          <td class="py-1">
            {{ item.product?.name }}

            <!-- MINUS -->
            <div v-if="Number(item.quantity_mins) > 0" class="text-sm">
              -{{ item.quantity_mins }} ×
              {{
                (
                  Number(item.totalweight) / Number(item.quantity_mins)
                ).toLocaleString()
              }} kg
            </div>

            <!-- PLUS -->
            <div v-else class="text-sm">
              {{ item.quantity_plus }} ×
              {{
                (
                  Number(item.totalweight) / Number(item.quantity_plus)
                ).toLocaleString()
              }} kg
            </div>
          </td>

          <!-- TOTAL WEIGHT -->
          <td class="py-1 text-right">
            <span v-if="Number(item.quantity_mins) > 0">-</span>
            {{ Number(item.totalweight).toLocaleString() }} kg
          </td>
        </tr>

      </tbody>
    </table>

    <!-- END -->
    <div class="text-right text-base mt-1">
      Total: {{ totalWeight.toLocaleString() }} kg
    </div>

  </div>
</template>
