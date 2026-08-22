<script setup>
import { Head, usePage } from '@inertiajs/vue3';
import { computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const props = defineProps({
  order: Object,
  // barcodeSvg dan qrSvg sudah tidak digunakan di sini
});

// Waktu saat nota dicetak
const now = dayjs().format('DD/MM/YYYY HH:mm:ss');
// Waktu saat transaksi dibuat-
const tanggalTransaksi = dayjs(props.order.created_at).format('DD/MM/YYYY HH:mm');

// Hitung nilai kurang bayar (jika ada)
const kurang = computed(() => {
    const sisa = Number(props.order.grand_total) - Number(props.order.paid_amount);
    return sisa > 0 ? sisa : 0;
});

onMounted(() => {
  // Memberikan sedikit jeda sebelum memanggil fungsi print
  setTimeout(() => window.print(), 500);
});

const page = usePage();

// Ambil user dari props Inertia
const user = page.props.auth?.user;

const alamatLengkap = computed(() => {
    const user = props.order.user;
    if (!user) return '-';

    const jalan = user.street_address ? user.street_address + ', ' : '';
    const desa = user.village_relation?.name ? user.village_relation.name + ', ' : '';
    const kecamatan = user.district_relation?.name ? user.district_relation.name + ', ' : '';
    const kota = user.city_relation?.name ? user.city_relation.name + ', ' : '';
    const provinsi = user.province?.name ? user.province.name : '';

    return jalan + desa + kecamatan + kota + provinsi;
});
</script>

<template>
  <Head :title="'Print Nota #' + (props.order.code || props.order.id)" />

  <div class="print-container">
    <div class="relative flex justify-between items-end font-bold mb-1">
      <div class="text-lg uppercase text-background">.</div>
      <div class="text-base absolute -translate-x-1/2 left-1/2">SURAT JALAN</div>
      <div class="text-right text-[10px] mb-1">{{ now }}</div>
    </div>    

    <div class="flex justify-start items-end font-bold mb-1">
      <div class="text-lg uppercase">UD. TAWAKAL</div>
    </div>

    <div class="text-xs border-b border-black pb-2 mb-2">
      Jl. Raya Sukarno-Hatta No.56, Weleri, Kendal, Tlp. 0294-3641523 (HP/WA 081329168567)
    </div>

    <div class="flex justify-between text-sm mb-3">
      <table class="w-[45%] border-separate leading-none">
        <tr>
          <td class="w-16 ">Customer</td>
          <td class="w-2 ">:</td>
          <td>
            <span v-if="props.order.user_alias">{{ props.order.user.name }} an {{ props.order.user_alias }}</span>
            <span v-else>{{ props.order.user.name || 'Pelanggan Umum' }}</span>            
          </td>
        </tr>
        <tr>
          <td class="align-top">Alamat</td>
          <td class="align-top">:</td>
          <td>{{ alamatLengkap }}</td>
        </tr>
      </table>
      
      <table class="w-[45%]">
        <tr>
          <td class="">Tanggal</td>
          <td class="">:</td>
          <td>{{ tanggalTransaksi }}</td>
        </tr>
        <tr>
          <td class="">No. Jual</td>
          <td class="">:</td>
          <td>{{ props.order.code || props.order.id }}</td>
        </tr>
      </table>
    </div>

    <table class="w-full text-base border-collapse mb-4">
      <thead>
        <tr class="border-y border-black">
          <th class="px-1 text-left ">Kode</th>
          <th class="px-1 text-left  border-l border-black">Nama Produk</th>
          <th class="px-1 text-center border-l border-black">Qty</th>
          <th class="px-1 text-right  border-l border-black">Keterangan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.order.items" :key="item.id" class="border-b border-dashed border-foreground">
          <td class="px-1 align-top">{{ item.product?.code || item.product?.sku || '-' }}</td>
          <td class="px-1 align-top border-l border-black">{{ item.product?.name || item.product_name }}</td>
          <td class="px-1 text-center align-top border-l border-black">{{ item.quantity_mins }}</td>
          <td class="px-1 text-right align-top border-l border-black">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-around text-xs mt-4">
      <div class="flex flex-col items-center w-[25%]">
        <span>Customer</span>
        <div class="mt-12 w-full border-b border-black text-center truncate">
            <span v-if="props.order.user_alias">{{ props.order.user_alias }}</span>
            <span v-else>{{ props.order.user.name || 'Pelanggan Umum' }}</span>  
        </div>
      </div>

      <div class="flex flex-col items-center w-[25%]">
        <span>Hormat kami,</span>
        <div class="mt-16 w-full border-b border-black text-center truncate">
          
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Kertas Landscape dengan Lebar 21cm */
.print-container {
  width: 21cm;
  margin: 0 auto;
  font-family: monospace; /* Memberikan kesan nota klasik */
  color: black;
  background-color: white;
}

/* Memaksa margin agar cetakan bersih */
@media print {
  @page {
    size: landscape; /* Membantu browser mengatur orientasi cetak */
    margin: 5mm; 
  }
  
  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
  }

  .print-container {
    width: 21cm;
    margin: 0;
  }
}
</style>