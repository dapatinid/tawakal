<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-white/50 transition-opacity duration-300"
  >
    <div
      class="bg-white dark:bg-black w-full max-w-2xl h-full max-h-screen overflow-y-auto shadow-lg py-6 transform transition-all duration-300 scale-100"
    >
      <div class="grid grid-cols-3 items-center pb-2 mb-4 px-6">
        <h3 class="text-start text-transparent">.</h3>
        <h3 class="text-lg font-semibold text-center">Checkout</h3>
        <button
          @click="$emit('update:open', false)"
          class="text-end text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-50 text-sm"
        >
          ✕
        </button>
      </div>

      <div class="space-y-3 overflow-y-auto px-6 pt-2">
        <SearchableSelect
          v-model="customerID"
          :items="props.users"
          label="Customer"
          value-key="id"
          :label-formatter="user => user.username ? `${user.name} • ${user.username}` : user.name"
        />

        <div>
          <label class="block text-sm mb-1">Atas Nama</label>
          <input
            type="text"
            v-model="userAlias"
            placeholder="Nama yang tercantum di nota"
            class="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Tanggal & Waktu</label>
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
              class="cursor-pointer border rounded-lg transition"
              :class="{
                'border-gray-800 bg-gray-100 dark:border-white dark:bg-neutral-900': orderType === opt.value,
                'border-gray-300 hover:border-gray-500 dark:border-neutral-700': orderType !== opt.value
              }"
            >
              <input type="radio" class="hidden" :value="opt.value" v-model="orderType" />
              <div class="block m-2 items-center">
                <component :is="opt.icon" class="w-6 h-6 mx-auto" />
                <div class="font-medium text-sm text-center">{{ opt.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 text-center">{{ opt.desc }}</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm mb-1">Catatan</label>
          <Textarea v-model="notes" rows="2" />
        </div>

        <div class="w-full grid grid-cols-3 gap-2">
          <div>
            <label class="block text-sm mb-1">Diskon</label>
            <input
              type="text"
              inputmode="numeric"
              :value="formatCurrency(discount)"
              @input="onDiscountInput"
              class="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Biaya+</label>
            <input
              type="text"
              inputmode="numeric"
              :value="formatCurrency(charge)"
              @input="onChargeInput"
              class="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Pajak</label>
            <input
              type="text"
              inputmode="numeric"
              :value="formatCurrency(tax)"
              @input="onTaxInput"
              class="p-2 border rounded w-full"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm mb-1">Metode Pembayaran</label>
          <select
            v-model="paymentMethod"
            class="border rounded-md h-10 px-3 text-sm w-full
                  bg-white text-gray-900
                  focus-visible:ring-1 focus-visible:ring-primary
                  dark:bg-neutral-900 dark:text-gray-200 dark:border-neutral-700"
          >
            <option value="" disabled>Pilih Metode Pembayaran</option>
            <option v-for="opt in paymentOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Nominal Bayar</label>
          <input
            type="text"
            inputmode="numeric"
            :value="formatCurrency(paidAmount)"
            @input="onPaidInput"
            class="p-2 border rounded w-full"
          />
        </div>

        <div class="border-t pt-4 mt-4 space-y-1 text-sm">
          <div class="flex justify-between font-bold">
            <div>Sub total</div>
            <div>Rp {{ formatPrice(subTotal) }}</div>
          </div>
          <div class="flex justify-between"><div>Diskon</div><div>Rp {{ formatPrice(discount) }}</div></div>
          <div class="flex justify-between"><div>Biaya+</div><div>Rp {{ formatPrice(charge) }}</div></div>
          <div class="flex justify-between"><div>Pajak</div><div>Rp {{ formatPrice(tax) }}</div></div>
          <div class="flex justify-between pb-2 font-medium"><div>Grand total</div><div>Rp {{ formatPrice(gTotal) }}</div></div>
          <div class="flex justify-between border-t pt-2 font-bold"><div>Bayar</div><div>Rp {{ formatPrice(paidAmount) }}</div></div>
          <div class="flex justify-between"><div>Kembalian</div><div>Rp {{ formatPrice(changeAmount) }}</div></div>
        </div>
      </div>

      <div class="flex gap-2 pt-3 pb-3 px-6 bg-white dark:bg-black">
        <button
          class="w-full bg-gray-800 dark:bg-white text-white dark:text-black rounded-md py-2 hover:bg-gray-700 dark:hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="submitCheckout"
        >
          Confirm & Pay
        </button>
        <button
          class="w-full bg-gray-500 text-white rounded-md py-2 hover:bg-gray-600"
          @click="$emit('update:open', false)"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { router, usePage } from "@inertiajs/vue3"; // ✅ FIX: usePage sekarang di-import dengan benar
import { toast } from "vue-sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import SearchableSelect from "@/components/SearchableSelect.vue";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Soup, Truck } from "lucide-vue-next";

dayjs.extend(utc);
dayjs.extend(timezone);

const appTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const props = defineProps({
  open: Boolean,
  items: Array,
  users: Array,
  customerID: Number,
  userAlias: String,
  notes: String,
  paymentMethod: String,
  date: String,
  orderType: String,
});

const emit = defineEmits([
  "update:open",
  "done",
  "update:customerID",
  "update:userAlias",
  "update:notes",
  "update:paymentMethod",
  "update:date",
  "update:orderType",
]);

// --- State (gabungkan props → localStorage → default) ---
function readLS(key, fallback = "") {
  const val = localStorage.getItem(key);
  return val !== null ? val : fallback;
}

// customerID, userAlias, date: init dari localStorage dulu,
// watch immediate di bawah akan override jika props sudah ada nilainya
const customerID = ref(Number(readLS("pos_last_customer", 0)));
const userAlias = ref(readLS("pos_last_user_alias", ""));
const date = ref(readLS("pos_last_date", null));
const discount = ref(Number(readLS("pos_last_discount", 0)));
const charge = ref(Number(readLS("pos_last_charge", 0)));
const tax = ref(Number(readLS("pos_last_tax", 0)));
const paidAmount = ref(Number(readLS("pos_last_paid", 0)));

// Menggunakan fallback data local storage agar sinkronisasi awal tidak rusak
const notes = ref(props.notes?.trim() || readLS("pos_last_notes", ""));
const paymentMethod = ref(props.paymentMethod?.trim() || readLS("pos_last_payment", "cash"));
const orderType = ref(props.orderType?.trim() || readLS("pos_last_order_type", null));

// --- Deteksi Toko F&B Menggunakan Global Auth State ---
const isFnbStore = computed(() => {
  try {
    const user = usePage().props.auth?.user;
    const branchType = user?.branch?.type || "";
    
    // Regex mendeteksi apakah branch tersebut F&B
    const fnbKeywords = /fnb|f&b|f&amp;b|resto|restoran|restaurant|kafe|cafe|kuliner|makanan|warung/i;
    return fnbKeywords.test(String(branchType).trim());
  } catch (error) {
    console.error("Gagal mendeteksi tipe branch:", error);
    return false;
  }
});

// --- Watch props → refs (immediate: true agar langsung sinkron saat mount) ---
watch(() => props.notes, v => { if (v != null) notes.value = v; }, { immediate: true });
watch(() => props.paymentMethod, v => { if (v) paymentMethod.value = v; }, { immediate: true });
watch(() => props.orderType, v => { if (v) orderType.value = v; }, { immediate: true });
watch(() => props.customerID, v => { if (v != null) customerID.value = v; }, { immediate: true });
watch(() => props.userAlias, v => { if (v != null) userAlias.value = v; }, { immediate: true });
watch(() => props.date, v => { if (v != null) date.value = v; }, { immediate: true });

// --- Watch refs → emit & localStorage ---
function safeNumber(v) { const n = Number(v); return isNaN(n) || n < 0 ? 0 : n; };
watch(discount, v => localStorage.setItem("pos_last_discount", safeNumber(v)), { immediate: true });
watch(charge, v => localStorage.setItem("pos_last_charge", safeNumber(v)), { immediate: true });
watch(tax, v => localStorage.setItem("pos_last_tax", safeNumber(v)), { immediate: true });
watch(paidAmount, v => localStorage.setItem("pos_last_paid", safeNumber(v)), { immediate: true });

watch(customerID, (newVal) => {
  localStorage.setItem("pos_last_customer", newVal ?? 0);
  emit("update:customerID", newVal);
});
watch(userAlias, (newVal) => {
  localStorage.setItem("pos_last_user_alias", newVal ?? "");
  emit("update:userAlias", newVal);
});
watch(date, (newVal) => {
  if (newVal) localStorage.setItem("pos_last_date", newVal);
  emit("update:date", newVal);
});

watch(notes, (v) => {
  const val = v ?? "";
  localStorage.setItem("pos_last_notes", val);
  if (val !== props.notes) {
    emit("update:notes", val);
  }
});

watch(paymentMethod, (v) => {
  const val = v || "cash";
  localStorage.setItem("pos_last_payment", val);
  if (val !== props.paymentMethod) {
    emit("update:paymentMethod", val);
  }
});

watch(orderType, (v) => {
  const val = typeof v === "string" && v.length ? v : null;
  if (val) {
    localStorage.setItem("pos_last_order_type", val);
  } else {
    localStorage.removeItem("pos_last_order_type");
  }
  if (val !== props.orderType) {
    emit("update:orderType", val);
  }
});

// --- Computed ---
const subTotal = computed(() => (props.items || []).reduce((s, i) => s + safeNumber(i.subtotal), 0));
const gTotal = computed(() => subTotal.value - discount.value + charge.value + tax.value);
const changeAmount = computed(() => paidAmount.value - gTotal.value);

// --- Options ---
const paymentOptions = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "ewallet", label: "e-Wallet" },
  { value: "qris", label: "QRIS" },
];

// Opsi Tipe Pesanan dinamis berdasarkan isFnbStore
const orderTypeOptions = computed(() => {
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

// Reset orderType jika toko beralih dari FnB ke toko retail biasa (non-FnB)
watch(() => isFnbStore.value, (fnb) => {
  if (!fnb && orderType.value === "dine_in") {
    orderType.value = null;
    localStorage.removeItem("pos_last_order_type");
  }
});

// --- Helpers ---
function formatCurrency(value) { return Number(value || 0).toLocaleString("id-ID"); }
function formatPrice(value) { return Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function extractNumber(value) { return Number(String(value).replace(/\D/g, "")) || 0; }
function onDiscountInput(e) { const raw = extractNumber(e.target.value); discount.value = raw; e.target.value = formatCurrency(raw); }
function onChargeInput(e) { const raw = extractNumber(e.target.value); charge.value = raw; e.target.value = formatCurrency(raw); }
function onTaxInput(e) { const raw = extractNumber(e.target.value); tax.value = raw; e.target.value = formatCurrency(raw); }
function onPaidInput(e) { const raw = extractNumber(e.target.value); paidAmount.value = raw; e.target.value = formatCurrency(raw); }

const selectedCustomer = computed(() => props.users?.find(u => u.id === customerID.value) || null);
const isGeneralCustomer = computed(() => {
  if (!selectedCustomer.value) return false;
  const name = selectedCustomer.value.name?.toLowerCase();
  return name === "supplier umum" || name === "customer umum" || name === "pengguna umum";
});

// --- Submit Checkout ---
async function submitCheckout() {
  if (isGeneralCustomer.value && !userAlias.value.trim()) {
    toast.error("Kolom Atas Nama wajib diisi.");
    return;
  }
  if (!orderType.value) { toast("Pilih tipe pesanan."); return; }
  if (!props.items || !props.items.length) { toast("Keranjang kosong."); return; }
  if (gTotal.value <= 0) { toast("Total harus > 0."); return; }

  const payload = {
    user_id: customerID.value || null,
    user_alias: userAlias.value.trim() || null,
    date: date.value,
    type: orderType.value,
    notes: notes.value || null,
    payment_method: paymentMethod.value || "cash",
    sub_total: subTotal.value,
    discount: discount.value,
    charge: charge.value,
    tax: tax.value,
    grand_total: gTotal.value,
    paid_amount: paidAmount.value,
    change_amount: changeAmount.value,
    items: props.items || [],
  };

  localStorage.setItem("pos_last_checkout", JSON.stringify(payload));

  try {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    const res = await fetch("/pos/checkout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-TOKEN": token },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); 
      console.error("Server Error Detail:", errorData);
      throw new Error(errorData.message || "Checkout gagal");
    }

    const data = await res.json();
    if (data && data.ok) {
      emit("done", data);
      emit("update:open", false);

      [
        "pos_cart_v1","pos_last_checkout","pos_last_customer","pos_last_user_alias",
        "pos_last_date","pos_last_notes","pos_last_discount","pos_last_charge","pos_last_tax",
        "pos_last_payment","pos_last_paid","pos_last_subtotal","pos_last_gtotal","pos_last_changeamount"
      ].forEach(k => localStorage.removeItem(k));

      customerID.value = 0;
      userAlias.value = "";
      notes.value = "";
      date.value = dayjs().tz(appTimezone).format("YYYY-MM-DDTHH:mm");
      discount.value = 0;
      charge.value = 0;
      tax.value = 0;
      paidAmount.value = 0;

      toast.success(
        `Berhasil 🎉 (Antrian: #${data.order_antrian})`,
        { duration: 3000 }
      );
      setTimeout(() => router.visit("/penjualan"), 4000);
    } else {
      toast.error("Error checkout");
    }
  } catch (e) {
    console.error(e);
    toast.error("Gagal kirim checkout");
  }
}
</script>