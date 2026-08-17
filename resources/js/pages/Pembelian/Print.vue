<script setup>
import { Head } from '@inertiajs/vue3';
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/id';
 
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');

const props = defineProps({
  purchaseOrder: Object,
  barcodeSvg: String,
  qrSvg: String,
});

function formatTanggal(tgl) {
  return dayjs(tgl).format('dddd, D MMM YYYY, HH:mm');
}

const totalWeight = computed(() => {
  if (!props.purchaseOrder || !Array.isArray(props.purchaseOrder.items)) {
    return 0
  }

  return props.purchaseOrder.items.reduce((sum, item) => {
    return sum + Number(item.totalweight ?? 0)
  }, 0)
})

onMounted(() => {

  setTimeout(() => window.print(), 100);
});

</script>

<template>
  <Head :title="'Print Order #' + props.purchaseOrder.id" />

  <div class="p-1 print:p-0 max-w-md mx-auto font-mono flex flex-col gap-4">

    <header class="flex flex-col items-center gap-2 pt-8">

      <div v-if="props.qrSvg" class="size-20 flex justify-center mb-14">
        <div v-html="props.qrSvg"></div>
      </div>

      <!-- <div v-if="props.barcodeSvg" class="w-full">
        <div v-html="props.barcodeSvg" class="scale-75"></div>
      </div> -->

      <h2 class="font-bold text-center">
        {{ props.purchaseOrder.code }}
      </h2>
    </header>

    <section class="text-sm border-b border-dashed pb-2">
      <div class="flex justify-center">
        <span class="text-center font-bold">{{ props.purchaseOrder.user_alias ? props.purchaseOrder.user?.name + ` (an) ` + props.purchaseOrder.user_alias : props.purchaseOrder.user?.name }}</span>
      </div>
      <div class="flex justify-center">
        <span class="text-center">{{ formatTanggal(props.purchaseOrder.created_at) }}</span>
      </div>
    </section>


    <table class=" w-full text-sm border-b border-dashed">
      <tbody class="divide-y divide-dotted">
        <tr v-for="item in props.purchaseOrder.items" :key="item.id">
          <td class="py-2 pe-2">
            <div class="font-bold">{{ item.product?.name }}</div>
            <div class="text-xs text-gray-600">
              {{ item.quantity_plus }} × {{ Number(item.cost).toLocaleString() }}
            </div>
          </td>
          <td class="py-2 text-right align-top">
            {{ Number(item.subtotal).toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>

    <section class="flex flex-col gap-1 text-sm border-b border-dashed pb-4">
      <div class="flex justify-between italic">
        <span>Total Weight:</span>
        <span>{{ totalWeight.toLocaleString() }} kg</span>
      </div>
      
      <div v-if="Number(props.purchaseOrder.sub_total) != Number(props.purchaseOrder.grand_total)" class="flex justify-between">
        <span>Subtotal:</span>
        <span>{{ Number(props.purchaseOrder.sub_total).toLocaleString() }}</span>
      </div>

      <div v-if="Number(props.purchaseOrder.discount) != 0" class="flex justify-between">
        <span>Discount:</span>
        <span>-{{ Number(props.purchaseOrder.discount).toLocaleString() }}</span>
      </div>

      <div v-if="Number(props.purchaseOrder.charge) != 0" class="flex justify-between">
        <span>Charge:</span>
        <span>+{{ Number(props.purchaseOrder.charge).toLocaleString() }}</span>
      </div>

      <div v-if="Number(props.purchaseOrder.tax) != 0" class="flex justify-between">
        <span>Tax:</span>
        <span>+{{ Number(props.purchaseOrder.tax).toLocaleString() }}</span>
      </div>

      <div class="flex justify-between font-bold mt-1 pt-1 border-t border-dotted">
        <span>GRAND TOTAL:</span>
        <span>Rp{{ Number(props.purchaseOrder.grand_total).toLocaleString() }}</span>
      </div>
    </section>

    <footer class="flex flex-col gap-1 text-right">
      <div class="text-base text-gray-700">
        Bayar: <strong>Rp{{ Number(props.purchaseOrder.paid_amount).toLocaleString() }}</strong>
      </div>
      <div class="text-base">
        Status: 
        <span :class="Number(props.purchaseOrder.paid_amount) >= Number(props.purchaseOrder.grand_total) ? 'text-black font-bold' : 'text-gray-500 italic'">
          {{ Number(props.purchaseOrder.paid_amount) >= Number(props.purchaseOrder.grand_total) ? 'LUNAS' : 'BELUM LUNAS' }}
        </span>
      </div>
    </footer>

  </div>
</template>