<script setup>
import { Head } from '@inertiajs/vue3';
import { computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const props = defineProps({
  adjustmentStock: Object,
});

// Waktu saat nota dicetak
const now = dayjs().format('DD/MM/YYYY HH:mm:ss');
// Waktu saat penyesuaian stok dibuat
const tanggalTransaksi = dayjs(props.adjustmentStock.created_at).format('DD/MM/YYYY HH:mm');

/* =========================
 * TOTAL SUM
 * ========================= */
const totalWeight = computed(() => {
  const items = props.adjustmentStock?.items;
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const weight = Number(item.totalweight || 0);

    // MINUS → dikurangkan
    if (Number(item.quantity_mins) > 0) {
      return total - weight;  
    }

    // PLUS → ditambahkan
    if (Number(item.quantity_plus) > 0) {
      return total + weight;
    }

    return total;
  }, 0);
});

onMounted(() => {
  // Memberikan sedikit jeda sebelum memanggil fungsi print
  setTimeout(() => window.print(), 500);
});
</script>

<template>
  <Head :title="'Print Surat Jalan #' + (props.adjustmentStock.code || props.adjustmentStock.id)" />

  <div class="print-container">
    <!-- Header Surat Jalan -->
    <div class="relative flex justify-between items-end font-bold mb-1">
      <div class="text-lg uppercase text-white print:text-transparent">.</div>
      <div class="text-base absolute -translate-x-1/2 left-1/2"></div>
      <div class="text-right text-[10px] mb-1">{{ now }}</div>
    </div>    

    <div class="flex justify-start items-end font-bold mb-2 border-b border-black pb-2">
      <div class="text-lg uppercase">SURAT PENGAMBILAN BARANG</div>
    </div>

    <!-- Informasi Meta Surat Jalan -->
    <div class="flex justify-between text-xs mb-3">
      <table class="w-[45%]">
        <tr>
          <td class="w-20 ">Dibuat Oleh</td>
          <td class="w-2 ">:</td>
          <td>{{ props.adjustmentStock.user_cre?.name || 'Admin/Operator' }}</td>
        </tr>
        <tr>
          <td class="">Token/Ref</td>
          <td class="">:</td>
          <td>{{ props.adjustmentStock.transfer_token || '-' }}</td>
        </tr>
      </table>
      
      <table class="w-[45%]">
        <tr>
          <td class="w-20 ">Tanggal</td>
          <td class="w-2 ">:</td>
          <td>{{ tanggalTransaksi }}</td>
        </tr>
        <tr>
          <td class="w-20">No. Surat</td>
          <td class="">:</td>
          <td>{{ props.adjustmentStock.code || props.adjustmentStock.id }}</td>
        </tr>
      </table>
    </div>

    <!-- Tabel Daftar Barang -->
    <table class="w-full text-xs border-collapse mb-4">
      <thead>
        <tr class="border-y border-black">
          <th class="py-1 text-left w-2/12">Kode</th>
          <th class="py-1 text-left w-4/12">Nama Produk</th>
          <th class="py-1 text-left w-1/12">Section</th>
          <th class="py-1 text-center w-1/12">Qty</th>
          <th class="py-1 text-right w-4/12">Keterangan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.adjustmentStock.items" :key="item.id" class="border-b border-dashed border-gray-400">
          <td class="py-1 align-top">{{ item.product?.code || item.product?.sku || '-' }}</td>
          <td class="py-1 align-top">{{ item.product?.name || item.product_name }}</td>
          <td class="py-1 align-top"></td>
          
          <!-- Qty (Menampilkan quantity_mins atau plus tergantung yang bernilai > 0) -->
          <td class="py-1 text-center align-top font-semibold">
            <span v-if="Number(item.quantity_mins) > 0">{{ item.quantity_mins }}</span>
            <span v-else>{{ item.quantity_plus }}</span>
          </td>
          
          <!-- Keterangan -->
          <td class="py-1 text-right align-top">
            <span v-if="Number(item.totalweight) > 0">
              {{ Number(item.totalweight).toLocaleString('id-ID') }} kg [
            </span>
            <span class="ml-8"> koli] </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Footer TTD -->
    <div class="flex justify-around text-xs mt-4">
      <div class="flex flex-col items-center w-[25%]">
        <span>Mengetahui</span>
        <div class="mt-12 w-full border-b border-black text-center truncate">
          UD. TAWAKAL
        </div>
      </div>

      <!-- BAGIAN YANG DIPERBAIKI: Menggunakan computed totalWeight -->
      <div class="flex flex-col items-center w-[25%]">
        <div>TOTAL BERAT</div>
        <div class="mt-1 font-bold text-lg">
          {{ totalWeight.toLocaleString('id-ID') }} kg
        </div>
      </div>

      <div class="flex flex-col items-center w-[25%]">
        <span>Hormat kami,</span>
        <div class="mt-12 w-full border-b border-black text-center truncate">
          {{ props.adjustmentStock.user_cre?.name || '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Kertas Landscape dengan Lebar 19cm */
.print-container {
  width: 19cm;
  margin: 0 auto;
  font-family: monospace;
  color: black;
  background-color: white;
}

/* Memaksa margin agar cetakan bersih */
@media print {
  @page {
    size: landscape;
    margin: 5mm; 
  }
  
  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
  }

  .print-container {
    width: 19cm;
    margin: 0;
  }
}
</style>