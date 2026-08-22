<script setup>
import { computed, ref, watch, nextTick } from "vue";
import { Trash2, ArrowLeft } from 'lucide-vue-next';
import { Link } from "@inertiajs/vue3";

const props = defineProps({
  items: Array,
  open: Boolean,
});

const emit = defineEmits(["update:open", "checkout", "update:items", "import-order", "clear-group"]);

const cartScrollContainer = ref(null);

watch(
  () => props.items.length,
  async () => {
    await nextTick();
    if (cartScrollContainer.value) {
      cartScrollContainer.value.scrollTop = cartScrollContainer.value.scrollHeight;
    }
  }
);

function closeSidebar() {
  emit("update:open", false);
}

function formatPrice(v) {
  return Number(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function recalc(item) {
  item.quantity_mins = Math.max(1, Number(item.quantity_mins));
  item.subtotal = Number(item.quantity_mins) * Number(item.price);
  emit("update:items", props.items);
}

function incrementQty(item) {
  item.quantity_mins = Number(item.quantity_mins) + 1;
  recalc(item);
}

function decrementQty(item) {
  if (item.quantity_mins > 1) item.quantity_mins = Number(item.quantity_mins) - 1;
  recalc(item);
}

function remove(idx) {
  props.items.splice(idx, 1);
  emit("update:items", props.items);
}

// === STATE & LOGIC UNTUK DROPUP SET HARGA ===
const showMarkup = ref(false);
const markupType = ref('nominal'); // Pilihan: 'nominal' atau 'persen'
const markupValue = ref('');

watch([markupType, markupValue], ([type, val]) => {
  props.items.forEach(it => {
    // Backup harga asli sebelum dimanipulasi agar bisa dibatalkan
    if (it._original_price === undefined) {
      it._original_price = it.price;
    }

    // Jika nilai kosong, null, atau <= 0, batalkan manipulasi dan kembalikan ke harga asli
    if (val === '' || val === null || val < 0) {
      it.price = it._original_price;
    } else {
      const cost = Number(it.cost) || 0;
      const v = Number(val);
      
      if (type === 'nominal') {
        it.price = cost + v;
      } else if (type === 'persen') {
        it.price = cost + (cost * (v / 100));
      }
    }
    recalc(it); // Selalu hitung ulang subtotal setelah mengubah price
  });
});

const totalQty = computed(() => props.items.reduce((sum, i) => sum + Number(i.quantity_mins), 0));
const subtotal = computed(() => props.items.reduce((s, i) => s + Number(i.subtotal), 0));

const orderText = ref("");
function runOrderImport() {
  const text = orderText.value.trim();
  if (!text) return;
  emit("import-order", text);
  orderText.value = ""; // reset setelah import
}

</script>

<template>
  <!-- Overlay untuk mobile -->
  <div
    v-if="open"
    class="fixed inset-0 bg-black/50 z-40 sm:hidden"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <div
    class="fixed top-0 left-0 h-full bg-white dark:bg-background shadow-lg z-50 transition-transform duration-300"
    :class="[open ? 'translate-x-0' : '-translate-x-full', 'w-full sm:w-80 lg:w-96']"
  >
    <div class="p-4 flex items-center justify-between border-b-2">
      <div class="flex justify-start">
        <button
          @click="closeSidebar"
          class="text-sm sm:hidden mr-2 text-gray-500 cursor-pointer"
        >
          <ArrowLeft class="size-4" />
        </button>
        <h3 class="sm:hidden font-semibold cursor-pointer" @click="closeSidebar">Cart</h3>
        <h3 class="hidden sm:flex font-semibold">Cart</h3>
      </div>
      <h3 class="font-semibold"><span>{{ totalQty }} / </span><span>{{ items.length }} item{{ items.length > 1 ? 's' : '' }}</span></h3>
    </div>

    <div ref="cartScrollContainer"
      class="p-2 overflow-y-auto" style="max-height: calc(100vh - 152px)"
    >
      <!-- ========================= -->
      <!-- CART ITEMS -->
      <!-- ========================= -->
      <div v-show="items.length > 0">
        <div
          v-for="(it, idx) in items"
          :key="it.product_id + '-' + idx"
          class="flex items-center gap-3 pt-2 border-b-2"
        >
          <div class="block w-full">
            <div class="flex justify-between">
              <Link :href="`/produk/${it.product_id}/show`" class="font-medium line-clamp-1">{{ it.name }}</Link>
              <div class="flex justify-end">
                <button
                  @click="remove(idx)"
                  class="text-sm text-red-500 w-10 text-end cursor-pointer"
                >
                  X
                </button>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <span class="text-sm hidden">{{ it.cost }}</span>
              <input
                type="number"
                class="p-1"
                v-model.number="it.price"
                @input="recalc(it); if (it.price < 0 || it.price === '') it.price = 0;"
                min="0"
                step="500"
              />

              <div class="grid grid-cols-3">
                <button
                  @click="decrementQty(it)"
                  class="select-none p-1 bg-gray-200 dark:bg-gray-800 dark:text-white text-black active:bg-red-500 dark:active:bg-red-500 font-bold text-md"
                  :disabled="it.quantity_mins <= 1"
                >
                  −
                </button>

                <input
                  type="number"
                  class="p-1 text-center no-arrows focus:bg-background focus:border-none focus:outline-0"
                  v-model.number="it.quantity_mins"
                  @input="recalc(it)"
                  min="1"
                />

                <button
                  @click="incrementQty(it)"
                  class="select-none p-1 bg-gray-200 dark:bg-gray-800 dark:text-white text-black active:bg-blue-500 dark:active:bg-blue-500 font-bold"
                >
                  +
                </button>
              </div>

              <div class="text-end">
                Rp{{ formatPrice(it.subtotal) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="pt-2 mt-2 fixed left-0 bottom-0 w-full px-3 pb-4 bg-background border-t-2"
        >
          <!-- Bagian Subtotal dan Dropup -->
          <div class="flex justify-between font-semibold items-center relative">
            <div class="flex items-center gap-2">
              Subtotal 
              
              <!-- Tombol Trigger Dropup -->
              <button 
                @click="showMarkup = !showMarkup" 
                class="text-[10px] sm:text-xs font-normal bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                Set Harga
              </button>
            </div>
            <span>Rp{{ formatPrice(subtotal) }}</span>

            <!-- Dropup Menu (Muncul ke atas) -->
            <div 
              v-if="showMarkup" 
              class="absolute bottom-full left-0 mb-3 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] p-3 rounded-lg z-30 font-normal"
            >
              <div class="flex flex-col gap-2 text-sm">
                <div class="flex justify-between items-center mb-1">
                  <label class="font-semibold text-xs text-gray-700 dark:text-gray-300">Set Harga dari Cost</label>
                  <button @click="showMarkup = false" class="text-red-500 font-bold text-xs cursor-pointer">✕</button>
                </div>
                
                <!-- Pilihan Nominal / Persen -->
                <select 
                  v-model="markupType" 
                  class="border p-1.5 rounded bg-transparent dark:border-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="nominal">Nominal (+Rp)</option>
                  <option value="persen">Persentase (+%)</option>
                </select>
                
                <!-- Input Nilai -->
                <input 
                  type="number" 
                  v-model="markupValue" 
                  placeholder="Masukkan nilai..."
                  class="border p-1.5 rounded bg-transparent dark:border-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full no-arrows"
                  min="0"
                />
              </div>
            </div>
          </div>

          <!-- Tombol Trash dan Checkout -->
          <div class="mt-3 flex gap-2">
            <button
              class="w-12 bg-red-500 text-white rounded-md py-1 grow-0"
              @click="$emit('clear-group')"
            >
              <Trash2 class="size-5 mx-auto" />
            </button>
            <button
              class="w-full bg-gray-800 text-white dark:bg-white dark:text-black rounded-md py-2"
              @click="$emit('checkout')"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      <!-- ========================= -->
      <!-- EMPTY STATE -->
      <!-- ========================= -->
      <div v-show="items.length == 0" class="mt-6">
        <div class="text-sm text-slate-500 text-center my-6">
          Kosong
        </div>
      </div>

      <!-- ========================= -->
      <!-- ORDER TEXT IMPORT (selalu tampil) -->
      <!-- ========================= -->
      <div v-show="items.length == 0" class="mt-4 px-1">
        <textarea
          v-model="orderText"
          placeholder="Tempel teks order di sini lalu klik Import."
          class="w-full h-52 border dark:border-gray-800 rounded-lg p-2 text-sm resize-none focus:ring focus:ring-blue-200"
        ></textarea>
        <button
          @click="runOrderImport"
          class="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md py-1.5"
        >
          Import Order
        </button>
      </div>
    </div>

  </div>
</template>



<style scoped>
.no-arrows::-webkit-outer-spin-button,
.no-arrows::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.no-arrows { -moz-appearance: textfield; }
</style>