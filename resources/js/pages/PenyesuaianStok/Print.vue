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
const grandTotal = computed(() => {
  return (props.adjustmentStock.items ?? []).reduce((total, item) => {
    if (item.quantity_mins) {
      // pengurangan stok → negatif
      return total - Number(item.totalcost ?? 0)
    }

    // penambahan stok → positif
    return total + Number(item.subtotal ?? 0)
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

    <div class="mb-4">
      <div>Dibuat: <strong>{{ props.adjustmentStock.user_cre?.name || '-' }}</strong></div>
      <div>Tanggal: {{ formatTanggal(props.adjustmentStock.created_at) }}</div>
    </div>

    <table class="w-full text-sm mb-4 border-t border-b">
      <tbody>
        <tr v-for="item in props.adjustmentStock.items" :key="item.id">
          <td class="py-1">
            {{ item.product?.name }}
            <div v-if="item.quantity_mins" class="text-sm">
                -{{ item.quantity_mins }} × Rp{{ Number(item.cost).toLocaleString() }}
            </div>
            <div v-else class="text-sm">
                {{ item.quantity_plus }} × Rp{{ Number(item.cost).toLocaleString() }}
            </div>
          </td>
          <td v-if="item.quantity_mins" class="py-1 text-right">
            -Rp{{ Number(item.totalcost).toLocaleString() }}
          </td>
          <td v-else class="py-1 text-right">
            Rp{{ Number(item.subtotal).toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- END -->
    <div class="text-right text-base mt-1">
      Total: Rp{{ grandTotal.toLocaleString() }}
    </div>

  </div>
</template>
