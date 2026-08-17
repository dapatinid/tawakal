<template>
  <div class="border dark:border-gray-800 rounded-xl flex flex-col gap-2 bg-background">
    <!-- Gambar -->
    <Link :href="`/product/${product.slug ?? product.id}`" class="flex justify-center bg-zinc-50 dark:bg-zinc-900 rounded-t-xl overflow-hidden">
      <img
        v-if="product.images?.length > 0"
        :src="`/storage/${product.images[0]}`"
        alt=""
        class="w-full max-h-72 object-cover"
      />
      <div
        v-else
        class="text-sm text-slate-400 w-full aspect-square text-center pt-[calc(46%)] select-none"
      >
        No Image
      </div>
    </Link>

    <!-- Nama & Harga -->
    <div class="flex-1 mx-3">
      <!-- Badge -->
      <div class="flex gap-1 mb-1">
        <span
          v-if="product.is_featured === true"
          class="text-[10px] px-2 py-[1px] rounded font-medium
                bg-green-100 text-green-700
                dark:bg-green-900 dark:text-green-300"
        >
          TOP
        </span>
        <span
          v-if="product.is_promo === true"
          class="text-[10px] px-2 py-[1px] rounded font-medium
                bg-blue-100 text-blue-700
                dark:bg-blue-900 dark:text-blue-300"
        >
          PROMO
        </span>
      </div>

      <!-- Nama Produk (2 baris, truncate) -->
      <div class="font-medium text-xs line-clamp-2">
        {{ product.name }}
      </div>

      <!-- Harga -->
      <div class="text-sm mt-0.5">
        <span class="text-xs">Rp</span>{{ formatPrice(product.price) }}
      </div>
    </div>

    <!-- Tombol Jika stok kosong -->
    <div v-if="product.in_stock === false" class="px-3 pb-3">
      <Button
        class="w-full rounded-md py-[2.8px] text-red-500 border border-red-500/20 hover:bg-red-500 active:bg-foreground hover:text-white active:text-background select-none"
      >
        Habis
      </Button>
    </div>

    <!-- Tombol -->
    <div v-else class="px-3 pb-3">
      <!-- Jika belum di cart -->
      <button
        v-if="!inCart"
        class="w-full rounded-md py-[2.8px] border border-foreground/20 hover:bg-foreground active:bg-foreground hover:text-background active:text-background select-none"
        @click="$emit('add', product)"
      >
        + Cart
      </button>

      <!-- Jika sudah di cart -->
      <div
        v-else
        class="flex items-center justify-between border rounded-md dark:bg-gray-800 overflow-hidden"
      >
        <button
          class="px-2 py-2.25 dark:text-black bg-gray-200 dark:bg-gray-100 hover:bg-gray-300 select-none active:bg-red-500 dark:active:bg-red-500"
          @click="decrement"
        >
          <Minus class="size-3" />
        </button>

        <input
          type="number"
          class="w-full text-center text-sm border-x outline-none border-none no-arrows"
          v-model.number="editableQty"
          @keyup="onQtyInput"
          min="1"
        />

        <button
          class="px-2 py-2.25 dark:text-black bg-gray-200 dark:bg-gray-100 hover:bg-gray-300 select-none active:bg-blue-500 dark:active:bg-blue-500"
          @click="increment"
        >
          <Plus class="size-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { Plus, Minus } from 'lucide-vue-next';
import { Link } from "@inertiajs/vue3";

const props = defineProps({
  product: Object,
  cartItems: Array,
});
const emit = defineEmits(["add", "updateQty", "remove"]);

const inCartItem = computed(() =>
  props.cartItems.find((i) => i.product_id === props.product.id)
);

const inCart = computed(() => !!inCartItem.value);
const qty = computed(() => inCartItem.value?.quantity_mins || 0);
const editableQty = ref(qty.value);

// sinkron ketika qty di cart berubah
watch(qty, (v) => (editableQty.value = v));

function formatPrice(v) {
  return Number(v).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}



function increment() {
  editableQty.value++;
  emit("updateQty", {
    product: props.product,
    quantity_mins: editableQty.value
  });
}

function decrement() {
  editableQty.value--;
  if (editableQty.value <= 0) {
    emit("remove", props.product);
  } else {
    emit("updateQty", {
      product: props.product,
      quantity_mins: editableQty.value
    });
  }
}

function onQtyInput() {
  editableQty.value = Math.max(1, Number(editableQty.value) || 1);
  emit("updateQty", {
    product: props.product,
    quantity_mins: editableQty.value
  });
}




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
