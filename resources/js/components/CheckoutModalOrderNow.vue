<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-white/50 transition-opacity duration-1000"
  >
    <div 
      class="bg-white dark:bg-black w-full max-w-2xl h-full max-h-screen overflow-y-auto shadow-lg py-6 transform transition-all duration-1000 scale-100"
    >
      <div class="grid grid-cols-3 items-center pb-2 mb-4 px-6">
        <h3 class="text-start text-transparent">.</h3>
        <h3 class="text-lg font-semibold text-center ">Checkout</h3>
        <button
          @click="$emit('update:open', false)"
          class="text-end text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-50 text-sm"
        >
          ✕
        </button>
      </div>

      <div class="space-y-3 overflow-y-auto px-6 pt-2">
        <Input
          v-model="customerName"
          label="Nama Customer"
          type="text"
          placeholder="Pesan Atas Nama siapa?"
          :class="customerNameError ? 'border-red-500' : ''"
        />
        <p v-if="customerNameError" class="text-red-500 text-xs -mt-2">
          Nama customer wajib diisi.
        </p>

        <div>
          <label class="block text-sm mb-1">Untuk kapan?</label>
          <input
            type="datetime-local"
            v-model="date"
            class="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label class="block text-sm mb-2">Tipe Pesanan</label>

          <div 
            class="grid gap-2"
            :class="isFnbStore ? 'grid-cols-3' : 'grid-cols-2'"
          >
            <label
              v-for="opt in orderTypeOptions"
              :key="opt.value"
              class="
                cursor-pointer border rounded-lg gap-3
                transition
              "
              :class="{
                'border-gray-800 bg-gray-100 dark:border-white dark:bg-neutral-900':
                  orderType === opt.value,
                'border-gray-300 hover:border-gray-500 dark:border-neutral-700':
                  orderType !== opt.value,
              }"
            >
              <input
                type="radio"
                class="hidden"
                :value="opt.value"
                v-model="orderType"
              />

              <div class="block m-2 items-center">
                <component
                  :is="opt.icon"
                  class="w-6 h-6 mx-auto"
                />

                <div class="font-medium text-sm text-center">
                  {{ opt.title }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {{ opt.desc }}
                </div>
              </div>
            </label>
          </div>
        </div>        

        <div>
          <label class="block text-sm mb-1">Catatan</label>
          <Textarea v-model="notes" rows="2" />
        </div>

        <div>
          <label class="block text-sm mb-1">Metode Pembayaran</label>

          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <label
              v-for="opt in paymentOptions"
              :key="opt.value"
              class="
                flex flex-col items-center justify-center gap-1
                border rounded-lg py-3 text-sm cursor-pointer select-none
                transition-all

                 text-gray-900 border-gray-300
                 dark:text-gray-200 dark:border-neutral-700
              "
              :class="{
                'border-primary ring-1 ring-primary bg-primary/5 dark:bg-primary/20':
                  paymentMethod === opt.value
              }"
            >
              <input
                type="radio"
                class="hidden"
                :value="opt.value"
                v-model="paymentMethod"
              />

              <component
                :is="opt.icon"
                class="w-5 h-5"
              />

              {{ opt.label }}
            </label>
          </div>
        </div>

        <div class="border-t pt-4 mt-4 space-y-1 text-sm">
          <div class="flex justify-between font-bold">
            <div>Total</div>
            <div>Rp {{ formatCurrency(subTotal) }}</div>
          </div>
        </div>

      </div>
      <div class="flex flex-wrap gap-2 pt-3 pb-3 bg-white dark:bg-black px-6 justify-center">
        <button
          class="w-full bg-gray-800 dark:bg-white text-white dark:text-black rounded-md py-2 hover:bg-gray-700 dark:hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex flex-nowrap justify-center items-center gap-2"
          @click="submitCheckout"
        >
          KIRIM SEKARANG <SendHorizonalIcon class="size-4"/>
        </button>
        <button
          class="w-1/3 text-gray-500 mt-3"
          @click="$emit('update:open', false)"
        >
          Nanti...
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { toast } from "vue-sonner";
import { usePage } from '@inertiajs/vue3'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Banknote, QrCode, Soup, ShoppingBag, Truck, SendHorizonalIcon, Wallet, Landmark } from "lucide-vue-next";

dayjs.extend(utc)
dayjs.extend(timezone)

const appTimezone = usePage().props.appTimezone

const props = defineProps({ 
  open: Boolean, 
  items: Array,
  activeStore: Object,
  userName: String,
});
const emit = defineEmits(["update:open", "done", "update:items"]);

const paymentOptions = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "bank", label: "Bank", icon: Landmark },
  { value: "ewallet", label: "e-Wallet", icon: Wallet },
  { value: "qris", label: "QRIS", icon: QrCode },
];

//
// Helpers
//
function safeNumber(v) {
  const n = Number(v);
  return isNaN(n) || n < 0 ? 0 : n;
}
function readNumberLS(key, fallback = 0) {
  const raw = localStorage.getItem(key);
  const num = Number(raw);
  return isNaN(num) ? fallback : num;
}
function formatCurrency(value) {
  const num = Number(String(value).replace(/\D/g, "")); 
  if (isNaN(num)) return "";
  return num.toLocaleString("id-ID");
}

//
// State utama (ambil initial dari localStorage)
//
const customerName = ref(localStorage.getItem("ordernow_last_customer") || "");
const notes = ref(localStorage.getItem("ordernow_last_notes") || "");
const paymentMethod = ref(localStorage.getItem("ordernow_last_payment") || "cash");
const date = ref("");
const orderType = ref(localStorage.getItem("ordernow_last_order_type") || null);

// 1. Definisikan logika deteksi toko F&B terlebih dahulu
const isFnbStore = computed(() => {
  if (!props.activeStore?.type) return false;
  const fnbKeywords = /fnb|f&b|f&amp;b|resto|restoran|restaurant|kafe|cafe|kuliner|makanan|warung/i;
  return fnbKeywords.test(props.activeStore.type.trim());
});

// 2. Ubah orderTypeOptions menjadi COMPUTED agar reaktif mengikuti isFnbStore
const orderTypeOptions = computed(() => {
  // Opsi dasar yang selalu ada untuk semua jenis toko
  const baseOptions = [
    {
      value: "self_pickup",
      title: "Self Pickup",
      desc: "Ambil sendiri sesuai jadwal",
      icon: ShoppingBag,
    },
    {
      value: "delivery",
      title: "Delivery",
      desc: "Diantarkan oleh penjual",
      icon: Truck,
    },
  ];

  // Jika isFnbStore bernilai true, selipkan "Dine In" ke urutan paling pertama (index 0)
  if (isFnbStore.value) {
    baseOptions.unshift({
      value: "dine_in",
      title: "Dine In",
      desc: "Makan di tempat (F&B)",
      icon: Soup,
    });
  }

  return baseOptions;
});

// MODIFIKASI FIX WATCHER: Diubah memantau properti activeStore utuh demi menghindari false-trigger pas inisialisasi awal
watch(() => props.activeStore, (newStore) => {
  if (newStore && !isFnbStore.value && orderType.value === "dine_in") {
    orderType.value = null;
    localStorage.removeItem("ordernow_last_order_type");
  }
}, { deep: true });

//
// Computed
//
const subTotal = computed(() => {
  const items = Array.isArray(props.items) ? props.items : [];
  return items.reduce((s, i) => s + safeNumber(i.subtotal), 0);
});

//
// Watchers
//
watch(customerName, (v) => {
  localStorage.setItem("ordernow_last_customer", v);
}, { immediate: true });

watch(date, (v) => {
  localStorage.setItem("ordernow_last_date", v);
}, { immediate: true });

watch(notes, (v) => {
  localStorage.setItem("ordernow_last_notes", v || "");
}, { immediate: true });

watch(paymentMethod, (v) => {
  localStorage.setItem("ordernow_last_payment", v || "cash");
}, { immediate: true });

watch(subTotal, (v) => {
  localStorage.setItem("ordernow_last_subtotal", safeNumber(v));
}, { immediate: true });

watch(orderType, (v) => {
  if (v) {
    localStorage.setItem("ordernow_last_order_type", v);
  } else {
    localStorage.removeItem("ordernow_last_order_type");
  }
}, { immediate: true });

//
// Validasi Nama Customer
//
const customerNameError = ref(false);

//
// Submit checkout 
//
async function submitCheckout() {

  if (!customerName.value || customerName.value.trim() === "") {
    toast.error("Nama customer wajib diisi", {
      description: "Silakan masukkan nama customer sebelum checkout."
    });
    customerNameError.value = true;   
    return; 
  } else {
    customerNameError.value = false;  
  }

  if (!date.value) {
    toast.error("Tanggal dan waktu wajib diisi", {
      description: "Pilih tanggal dan waktu pesanan.",
    });
    return;
  }

  if (!orderType.value) {
    toast.error("Tipe pesanan wajib dipilih", {
      description: "Silakan pilih tipe pesanan yang tersedia.",
    });
    return;
  }

  if (!paymentMethod.value) {
    toast.error("Metode pembayaran wajib dipilih", {
      description: "Jika Cashless nanti kirim bukti transfer.",
    });
    return;
  }

  if (!Array.isArray(props.items) || !props.items.length) {
    toast("Error checkout", { description: "Keranjang kosong." });
    return;
  }

  if (subTotal.value <= 0) {
    toast("Error checkout", { description: "Total harus lebih dari 0." });
    return;
  }

  const dateFormatted = dayjs(date.value).format("DD/MM/YYYY HH:mm");

  const itemLines = props.items
    .map((i) => `${i.sku} ${i.name} \nx ${i.quantity_mins} = Rp ${formatCurrency(i.subtotal)}`)
    .join("\n\n");

  const user = props.userName?.trim()
  const customer = customerName.value?.trim()

  let pesanAtasNama = "-"

  if (user && customer) {
    pesanAtasNama = `${user} (member) - atas nama ${customer}`
  } else if (user) {
    pesanAtasNama = `${user} (member)`
  } else if (customer) {
    pesanAtasNama = customer
  }

  const message =
  "ORDER NOW \n\n" +
  "Customer : " + pesanAtasNama + "\n" +
  "Pesan untuk : " + dateFormatted + "\n" +
  "Jenis Pesanan : " + orderType.value.replace("_", " ").toUpperCase() + "\n" +
  "Pembayaran : " + paymentMethod.value.toUpperCase() + "\n" +
  "Catatan : " + (notes.value || "-") + "\n\n" +
  "=========================\n\n" +
  "DAFTAR PESANAN :\n\n" +
  itemLines + "\n\n" +
  "=========================\n\n" +
  "Total : Rp " + formatCurrency(subTotal.value) + "\n\n" +
  "_lanjutkan pesan ini jangan diedit_" ;

  const text = encodeURIComponent(message);
  let phone = props.activeStore.phone;

  if (phone.startsWith("0")) {
    phone = "62" + phone.slice(1);
  }

  const redirectToWhatsApp = () => {
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  toast.success("Berhasil dialihkan ke WhatsApp...");
  setTimeout(redirectToWhatsApp, 3000);

  customerName.value = "";
  notes.value = "";
  paymentMethod.value = "";
  date.value = "";
  orderType.value = null;

  emit("done");
  emit("update:open", false);

  [
    "ordernow_last_customer",
    "ordernow_last_notes",
    "ordernow_last_payment",
    "ordernow_last_date",
    "ordernow_last_order_type",
    "ordernow_last_subtotal",
    "ordernow_last_checkout",
  ].forEach((k) => localStorage.removeItem(k));

  emit("update:open", false);
}
</script>