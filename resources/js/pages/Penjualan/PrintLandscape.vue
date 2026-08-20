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
    <div class="text-right text-[10px] mb-1">
      {{ now }}
    </div>

    <div class="flex justify-between items-end font-bold mb-1">
      <div class="text-lg uppercase">UD. TAWAKAL</div>
      <div class="text-base">NOTA PENJUALAN</div>
    </div>

    <div class="text-xs border-b border-black pb-2 mb-2">
      Jl. Raya Sukarno-Hatta No.56, Weleri, Kendal, Tlp. 0294-3641523 (HP/WA 081329168567)
    </div>

    <div class="flex justify-between text-xs mb-3">
      <table class="w-[45%]">
        <tr>
          <td class="w-16 ">Customer</td>
          <td class="w-2 ">:</td>
          <td>{{ props.order.user.name || 'Pelanggan Umum' }}</td>
        </tr>
        <tr>
          <td class="align-top">Alamat</td>
          <td class="align-top">:</td>
          <td>{{ alamatLengkap }}</td>
        </tr>
      </table>
      
      <table class="w-[45%]">
        <tr>
          <td class="w-16 align-top">Operator</td>
          <td class="w-2 align-top">:</td>
          <td>{{ user.name || 'Kasir' }}</td>
        </tr>
        <tr>
          <td class="align-top">Tanggal</td>
          <td class="align-top">:</td>
          <td>{{ tanggalTransaksi }}</td>
        </tr>
        <tr>
          <td class="align-top">No. Jual</td>
          <td class="align-top">:</td>
          <td>{{ props.order.code || props.order.id }}</td>
        </tr>
      </table>
    </div>

    <table class="w-full text-xs border-collapse mb-4">
      <thead>
        <tr class="border-y border-black">
          <th class="py-1 text-left w-1/6">Kode</th>
          <th class="py-1 text-left w-2/6">Nama Produk</th>
          <th class="py-1 text-right w-1/6">@Harga</th>
          <th class="py-1 text-center w-1/12">Qty</th>
          <th class="py-1 text-right w-1/6">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.order.items" :key="item.id" class="border-b border-dashed border-foreground">
          <td class="py-1 align-top">{{ item.product?.code || item.product?.sku || '-' }}</td>
          <td class="py-1 align-top">{{ item.product?.name || item.product_name }}</td>
          <td class="py-1 text-right align-top">{{ Number(item.price).toLocaleString('id-ID') }}</td>
          <td class="py-1 text-center align-top">{{ item.quantity_mins }}</td>
          <td class="py-1 text-right align-top">
            {{ Number(item.subtotal || (item.price * item.quantity_mins)).toLocaleString('id-ID') }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between text-xs mt-4">
      <div class="flex flex-col items-center w-[25%]">
        <span>Customer</span>
        <div class="mt-12 w-full border-b border-black text-center truncate">
          {{ props.order.user.name || 'Pelanggan Umum' }}
        </div>
      </div>

      <div class="flex flex-col items-center w-[25%]">
        <span>Hormat kami,</span>
        <div class="mt-16 w-full border-b border-black text-center truncate">
          
        </div>
      </div>

      <div class="w-[40%] flex justify-end">
        <table class="w-full max-w-[200px]">
          <tr v-if="Number(props.order.discount) != 0">
            <td class="text-right py-1">Diskon</td>
            <td class="text-center">:</td>
            <td class="text-right">
              {{ Number(props.order.discount).toLocaleString('id-ID') }}
            </td>
          </tr>
          <tr v-if="Number(props.order.charge) != 0">
            <td class="text-right py-1">Ongkir</td>
            <td class="text-center">:</td>
            <td class="text-right">
              {{ Number(props.order.charge).toLocaleString('id-ID') }}
            </td>
          </tr>
          <tr v-if="Number(props.order.tax) != 0">
            <td class="text-right py-1">Pajak</td>
            <td class="text-center">:</td>
            <td class="text-right">
              {{ Number(props.order.tax).toLocaleString('id-ID') }}
            </td>
          </tr>
          <tr>
            <td class="text-right font-bold py-1">TOTAL</td>
            <td class="w-4 text-center">:</td>
            <td class="text-right font-bold w-24">
              {{ Number(props.order.grand_total).toLocaleString('id-ID') }}
            </td>
          </tr>
          <tr>
            <td class="text-right py-1">BAYAR</td>
            <td class="text-center">:</td>
            <td class="text-right">
              {{ Number(props.order.paid_amount).toLocaleString('id-ID') }}
            </td>
          </tr>
          <tr>
            <td class="text-right py-1">KURANG</td>
            <td class="text-center">:</td>
            <td class="text-right">
              {{ kurang > 0 ? kurang.toLocaleString('id-ID') : '0' }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Kertas Landscape dengan Lebar 19cm */
.print-container {
  width: 19cm;
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
    width: 19cm;
    margin: 0;
  }
}
</style>