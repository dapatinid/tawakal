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
    :class="[
      open ? 'translate-x-0' : '-translate-x-full',
      'w-full sm:w-80 lg:w-96'
    ]"
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
      <button 
        @click="$emit('open-store-modal')" 
        class="sm:hidden px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 dark:text-blue-400 dark:bg-blue-400/10 dark:hover:bg-blue-400/20 rounded-full transition-colors active:scale-95"
      >
        Lihat Semua
      </button>
      <h3 class="font-semibold"><span>{{ totalQty }} / </span><span>{{ items.length }} item{{ items.length > 1 ? 's' : '' }}</span></h3>      

    </div>

    <div ref="cartScrollContainer"
        class="py-2 overflow-y-auto" style="max-height: calc(100vh - 152px)">
      <template v-if="items.length">
        <div
          v-for="(it, idx) in items"
          :key="it.product_id + '-' + idx"
          class="flex items-center gap-3 px-2 pt-2 pb-2 border-b-2"
        >
          <Link :href="`/product/${it.slug}`" class="w-16 aspect-square rounded-md bg-gray-100 dark:bg-gray-800
                      flex items-center justify-center overflow-hidden">
            <img
              v-if="it.preview"
              :src="`/storage/${it.preview}`"
              alt="Product Image"
              class="w-full h-full object-cover"
            />
            <ImageIcon
              v-else
              class="w-6 h-6 text-gray-400 dark:text-gray-500"
            />
          </Link>

          <div class="block w-full"> 
            <div class="flex justify-between">
              <div class="font-medium line-clamp-1">{{ it.name }}</div>
              <div class="flex justify-end">
                <button @click="removeItem(it)" class="text-sm text-red-500 w-10 text-end cursor-pointer">X</button>
              </div>
            </div>

            <div class="grid grid-cols-2 items-center gap-2">
              <input
                type="number"
                class="p-1 focus:outline-0 hidden"
                v-model.number="it.price"
                @input="recalc(it); if (it.price < 0 || it.price === '') it.price = 0;"
                min="0"
                step="500"
                readonly
              />
              <div class="flex flex-nowrap">
                <button
                    @click="decrementQty(it)"
                    class="select-none p-1 w-8 rounded-l-md aspect-square bg-gray-200 dark:bg-gray-700 dark:text-white text-black active:bg-red-500 dark:active:bg-red-500 font-bold text-md"
                    :disabled="it.quantity_mins <= 1"
                  >
                  −
                </button>                
                <input
                  type="number"
                  class="p-1 text-center bg-muted no-arrows focus:bg-background focus:border-none focus:outline-0 w-12"
                  v-model.number="it.quantity_mins"
                  @input="recalc(it)"
                  min="1"
                  />
                <button
                  @click="incrementQty(it)"
                  class="select-none p-1 w-8 rounded-r-md aspect-square bg-gray-200 dark:bg-gray-700 dark:text-white text-black active:bg-blue-500 dark:active:bg-blue-500 font-bold"
                >
                  +
                </button>
              </div>
              <div class="text-end">Rp{{ formatPrice(it.subtotal) }}</div>
            </div>
          </div>
        </div>



        <div class="pt-2 mt-2 fixed left-0 bottom-0 w-full px-3 pb-4 bg-background border-t-2">
          <div class="flex justify-between font-semibold">
            Subtotal <span>Rp{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="mt-3 flex gap-2">
            <button class="w-12 bg-red-500 text-white rounded-md py-1 grow-0 " @click="clearCart">
              <Trash2 class="size-5 mx-auto" />
            </button>
            <button v-if="isclosed" class="w-full bg-gray-500 text-white dark:bg-gray-500 dark:text-black rounded-md py-2" disabled>
              Store Tutup
            </button>
            <button v-else class="w-full bg-gray-800 text-white dark:bg-white dark:text-black rounded-md py-2" @click="$emit('checkout')">
              Checkout
            </button>
          </div>
        </div>
      </template>

      <template v-else>

        <div class="text-sm text-slate-500 text-center my-7">Kosong</div>
             
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { Trash2, ArrowLeft, ImageIcon } from 'lucide-vue-next';
import { Link } from "@inertiajs/vue3";

const props = defineProps({
  isclosed: Boolean,
  items: Array,
  open: Boolean,
});

const emit = defineEmits(["update:open", "checkout", "update:items", "import-order", "remove-item", "clear-store-cart", "open-store-modal"]);

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
  return Number(v).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function recalc(item) {
  item.quantity_mins = Math.max(1, Number(item.quantity_mins));
  item.subtotal = Number(item.quantity_mins) * Number(item.price);
  emit("update:items", props.items);
}

// --- FUNGSI BARU UNTUK TOMBOL KUSTOM ---

/**
 * Menambah kuantitas item sebanyak 1 dan memicu perhitungan ulang.
 * @param {object} item - Item yang akan di-increment.
 */
function incrementQty(item) {
  // Tambah kuantitas, lalu pastikan nilai tetap berupa Number
  item.quantity_mins = Number(item.quantity_mins) + 1; 
  recalc(item); // Panggil recalc untuk update subtotal dan emit perubahan
}

/**
 * Mengurangi kuantitas item sebanyak 1 (minimal 1) dan memicu perhitungan ulang.
 * @param {object} item - Item yang akan di-decrement.
 */
function decrementQty(item) {
  // Cek apakah kuantitas di atas 1
  if (item.quantity_mins > 1) {
    item.quantity_mins = Number(item.quantity_mins) - 1;
    recalc(item); // Panggil recalc untuk update subtotal dan emit perubahan
  } else {
    // Jika sudah 1, pastikan tetap 1
    recalc(item);
  }
}

/**
 * Request hapus 1 item (identity-based, bukan index)
 */
function removeItem(item) {
  emit("remove-item", {
    product_id: item.product_id,
    store_id: item.store_id,
  });
}

/**
 * Request clear cart untuk store aktif saja
 */
function clearCart() {
  emit("clear-store-cart");
}


const totalQty = computed(() => {
  return props.items.reduce((sum, i) => sum + Number(i.quantity_mins), 0);
});

const subtotal = computed(() => {
  return props.items.reduce((s, i) => s + Number(i.subtotal), 0);
});
</script>

<style scoped>
/* Untuk browser berbasis WebKit (Chrome, Safari, Edge) */
.no-arrows::-webkit-outer-spin-button,
.no-arrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Untuk Firefox */
.no-arrows {
  -moz-appearance: textfield;
}
</style>