<template>
<transition name="fade">
  <div v-if="open" class="fixed inset-0 z-[999]">

    <div class="absolute inset-0 bg-black/50 dark:bg-white/50"></div>

    <div class="relative z-[1000] flex items-center justify-center min-h-screen px-4">

      <div
        class="bg-white dark:bg-black w-full max-w-lg rounded-xl
               px-4 py-0 shadow-lg
               max-h-[85vh] overflow-y-auto no-scrollbar"
      >

        <div class="sticky top-0 left-0 right-0  grid grid-cols-3 items-center py-3 bg-background z-50">

          <div></div>

          <div class="relative z-10 gap-2 text-gray-400 flex items-center justify-center">
            <strong class="text-foreground font-black">STORE</strong> 
          </div>

          <div class="flex justify-end">
            <CircleX v-if="hasSelectedStore" @click="close"  class="text-red-400 hover:text-muted-foreground"/>
          </div>

        </div>
        <div class="flex justify-between items-center">
          <Link :href="`/${activeStore.partner.slug}`"
            class="w-full p-2 rounded-xl border
                  bg-[radial-gradient(circle_at_top_center,theme(colors.gray.500),theme(colors.black))]
                  dark:bg-[radial-gradient(circle_at_top_center,theme(colors.gray.400),theme(colors.white))]"
          >
            <div v-if="activeStore" class="flex gap-2 text-base text-accent mt-1 px-2">
              <div class="">
                <strong>{{ activeStore.name }} </strong>
                <div class="flex flex-wrap gap-x-2 items-center">
                  <span class="text-gray-300 dark:text-gray-800 line-clamp-3 text-xs">{{ activeStore.street_address }} • {{ activeStore.phone }}</span>
                  <span class="text-gray-300 dark:text-gray-800 text-xl flex flex-wrap gap-x-2 text-xs">{{ activeStore.partner.name }} <ExternalLink class="size-4"/></span>
                </div>
              </div>
              <div class="grow-0 ms-auto my-auto"><Store class="size-12"/> </div>
            </div>
          </Link>
        </div>

        <div class="mt-4 mb-3 text-center">
          <Link 
            :href="`/partners`" 
            class="text-xs text-blue-500 hover:text-blue-600 font-medium transition duration-200"
          >
            Lihat semua vendor
          </Link>
          <div class="flex items-center my-3">
            <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span class="flex-shrink mx-4 text-gray-400 text-xs tracking-wider">atau</span>
            <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>
        </div>

        <div class="mb-3">
          <div class="relative w-full">
            <label for="pencarian"><Search class="absolute right-3 top-2.5 size-5 text-gray-400" /></label>
            <input id="pencarian"
              v-model="search"
              type="text"
              placeholder="Cari Store lain..."
              class="px-3 py-2.5 rounded-lg text-sm
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-foreground focus:outline-none w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">

          <div
            v-for="store in filteredStores"
            :key="store.id"
            @click="select(store)"
            class="relative p-3 border rounded-lg cursor-pointer text-center transition"
            :class="{
              'bg-primary/10 border-primary dark:bg-primary/20': activeStore && activeStore.id === store.id,
              'hover:bg-gray-100 dark:hover:bg-gray-800': true
            }"
          >
            <span
              v-if="storeCartCount[store.id]"
              class="absolute -top-2 -right-2 min-w-[20px] h-5 px-1
                    rounded-full bg-blue-500 text-white text-xs
                    flex items-center justify-center font-bold"
            >
              {{ storeCartCount[store.id] }}
            </span>

            <p class="font-bold">{{ store.name }}</p>
            <p class="text-sm italic">{{ store.partner.name }}</p>
            <p class="text-xs text-gray-500">{{ store.phone }}</p>
          </div>

        </div>

      </div>

    </div>

  </div>
</transition>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import { CircleX, ExternalLink, Search, Store } from 'lucide-vue-next';
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  open: Boolean,
  stores: Array,
  activeStore: Object
});

const emit = defineEmits(['update:open', 'select']);

const hasSelectedStore = ref(false);
const search = ref("");
const cartItems = ref([]);
const CART_KEY = "ordernow_cart_v1";

function loadCart() {
  try {
    cartItems.value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    cartItems.value = [];
  }
}

onMounted(() => {
  hasSelectedStore.value = !!localStorage.getItem('ordernow_selected_store');
  loadCart();
});

watch(
  () => props.open,
  (open) => {
    if (open) loadCart();
  }
);

// 1. Deklarasikan storeCartCount lebih dulu agar bisa dipakai di filteredStores
const storeCartCount = computed(() => {
  const map = {};
  for (const item of cartItems.value) {
    if (!item.store_id) continue;
    map[item.store_id] = (map[item.store_id] || 0) + Number(item.quantity_mins || 0);
  }
  return map;
});

// 2. Modifikasi filteredStores untuk menerapkan sort
const filteredStores = computed(() => {
  // Hindari mutasi props langsung dengan membuat salinan array (spread operator)
  let result = [...props.stores];

  // Filter Pencarian
  if (search.value) {
    const keyword = search.value.toLowerCase();
    result = result.filter(store =>
      store.name.toLowerCase().includes(keyword) ||
      store.phone?.toLowerCase().includes(keyword) ||
      store.partner?.name?.toLowerCase().includes(keyword)
    );
  }

  // Sortir agar yang memiliki item di keranjang (ada badge) tampil di atas
  return result.sort((a, b) => {
    const countA = storeCartCount.value[a.id] || 0;
    const countB = storeCartCount.value[b.id] || 0;

    // Jika A punya badge dan B tidak, A naik ke atas
    if (countA > 0 && countB === 0) return -1;
    
    // Jika B punya badge dan A tidak, B naik ke atas
    if (countB > 0 && countA === 0) return 1;

    // Jika keduanya punya badge, urutkan dari kuantitas item terbanyak (opsional, sebagai bonus)
    if (countA > 0 && countB > 0) {
      return countB - countA;
    }

    // Jika keduanya tidak punya badge, urutkan sesuai abjad nama tokonya agar rapi
    return a.name.localeCompare(b.name);
  });
});

function close() {
  loadCart(); 
  emit('update:open', false);
}

function select(store) {
  loadCart(); 
  emit('select', store);
  close();
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* sembunyikan scrollbar tapi tetap bisa scroll */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE & Edge */
  scrollbar-width: none;     /* Firefox */
}
</style>