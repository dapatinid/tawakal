<template>
  <div class="flex h-screen">

          <!-- Overlay TUTUP -->
      <div
        v-if="isStoreClosed"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              z-500 bg-red-600/90 text-white text-3xl font-bold 
              px-8 py-4 rounded-xl shadow-xl backdrop-blur-sm"
      >
        TUTUP
      </div>

    <Toaster position="top-right" richColors />

    <div v-show="!cartOpen" class="hidden sm:flex justify-center items-center relativemx-auto w-full sm:w-80 lg:w-96">
       <span @click="cartOpen = true" class="text-base font-semibold text-gray-500 dark:text-gray-200 text-nowrap rounded-full py-1 px-3 border border-gray-300 dark:border-gray-700 cursor-pointer">Buka CART</span>
    </div>

    <!-- Sidebar Cart -->
    <CartSidebarOrderNow
          :isclosed="isStoreClosed"
          :items="activeCartItems"
          @update:items="replaceCartItems"     
          v-model:open="cartOpen"
          @checkout="openCheckout"
          @remove-item="removeCartItem"
          @clear-store-cart="clearActiveStoreCart"
          @open-store-modal="storeOpen = true" 
        />

    <!-- Product list -->
    <div ref="scrollContainer" class="overflow-auto ms-auto w-full sm:w-[calc(100vw-20rem)] lg:w-[calc(100vw-24rem)] pb-30 bg-linear-to-br from-blue-100 via-white to-red-100 dark:from-blue-950 dark:via-gray-900 dark:to-red-950 from-10% to-90%">
      <div class="flex items-center justify-between sticky top-0 mb-0.5 p-4 backdrop-blur-xl">
        <!-- Tombol Cart (mobile) -->
        <button
          class="relative flex items-center gap-2 px-2 py-1.5 bg-accent rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500"
          @click="cartOpen = true"
        >
          <span
            v-if="totalItems > 0"
            class="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full absolute -top-2 -left-2"
          >
            {{ totalItems }}
          </span>
          <ShoppingBasket class="size-5" />
        </button>

        <!-- Search Input -->
        <div class="flex-1 mx-3 relative flex items-center">
          <input
            v-model="searchInput"
            @input="debouncedSearch"
            type="text"
              :placeholder="currentStore
                // ? `Cari Produk di ${currentStore.name} ~ ${currentStore.partner.name}` // ini catatan penting, jangan hapus
                ? `Cari di ${currentStore.name}...`
                : 'Pilih store terlebih dahulu...'"
            class="w-full border-accent-foreground/30 border-2 rounded-lg p-2 pr-10 text-sm focus:ring focus:ring-blue-200"
          />

          <!-- Tombol Reset (X) -->
          <button
            v-if="searchInput.length > 0"
            @click="resetSearch"
            class="absolute right-[50px] top-1/2 -translate-y-1/2 text-gray-800 dark:text-gray-100 hover:bg-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full size-5 text-[10pt]"
            title="Reset pencarian"
          >
            ✕
          </button>

          <!-- Tombol Filter -->
          <button
            class="-ml-[45px] px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center gap-1 scale-95"
            @click="filterOpen = true"
            title="Filter produk"
          >
            <SlidersHorizontal class="size-5" />
          </button>
        </div>

        <!-- Pilih Toko -->
        <div
          class="ms-auto items-center py-1 flex justify-center text-gray-500 dark:text-gray-300 rounded-md"
          @click="storeOpen = true"
          title="Pilih Toko"
        >
          <Store class="size-5 hover:text-blue-500" />
        </div>
      </div>

      <!-- Products -->
      <div
        class="columns-2 xs:columns-3 sm:columns-3 lg:columns-4 xl:columns-5 gap-1.5 px-2"
      >
        <ProductTileOrderNow class="mb-1.5 break-inside-avoid"
          v-for="p in products.data"
          :key="p.id"
          :product="p"
          :cart-items="cartItems"
          @add="addToCart"
          @updateQty="updateCartQty"
          @remove="removeFromCart"
        />
      </div>

      <!-- Pagination -->
      <div
        class="flex justify-center mt-4"
        v-if="products?.links?.length > 3"
      >
        <nav
          class="flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap px-2 pb-3"
        >
          <!-- First -->
          <Link
            v-if="products.links[1]?.url"
            :href="products.links[1].url"
            @click="scrollToTop"
            preserve-scroll
            preserve-state
            class="px-3 py-1 border rounded hover:bg-muted flex items-center justify-center"
            title="First page"
          >
            <ChevronsLeft class="w-4 h-4" />
          </Link>

          <!-- Numbered -->
          <template
            v-for="(link, i) in products.links.filter(l => /^\d+$/.test(l.label))"
            :key="i"
          >
            <Link
              :href="link.url ?? '#'"
              @click="scrollToTop"
              preserve-scroll
              preserve-state
              class="px-3 py-1 border rounded hover:bg-muted hover:text-foreground"
              :class="{
                'bg-primary text-primary-foreground font-bold': link.active,
                'opacity-50 pointer-events-none': !link.url,
              }"
            >
              {{ link.label }}
            </Link>
          </template>

          <!-- Last -->
          <Link
            v-if="products.links[products.links.length - 2]?.url"
            :href="products.links[products.links.length - 2].url"
            @click="scrollToTop"
            preserve-scroll
            preserve-state
            class="px-3 py-1 border rounded hover:bg-muted flex items-center justify-center"
            title="Last page"
          >
            <ChevronsRight class="w-4 h-4" />
          </Link>
        </nav>
      </div>



    </div>

    <!-- Sidebar Filter -->
     <transition name="slide-filter">
      <div
        v-if="filterOpen"
        class="fixed inset-0 z-40 flex"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-transparent"
          @click="filterOpen = false"
        ></div>

        <!-- Panel Sidebar -->
        <div
          class="relative ml-auto bg-white dark:bg-black w-80 h-full shadow-lg transform transition-transform duration-500 ease-in-out flex flex-col"
          :class="filterOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <!-- Header tetap fix di atas -->
          <div class="p-4 border-b flex justify-between items-center flex-shrink-0 bg-white dark:bg-black z-10">
            <div class="flex justify-start items-center">
              <h2 class="text-lg font-semibold">Filter Produk</h2>

              <!-- Tombol Reset Filter -->
              <button
                v-if="selectedCategories.length > 0 || selectedBrands.length > 0"
                @click="
                  selectedCategories = [];
                  selectedBrands = [];
                  router.get(storeUrl(), {
                    search: searchInput,
                    per_page: perPage,
                    sort_by: sortBy,
                    sort_direction: sortDirection
                  }, { preserveScroll: true, preserveState: true, replace: true });
                "
                class="py-1 px-2 ms-2 text-xs text-center rounded-md bg-red-200 dark:bg-red-900 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200 transition-colors duration-300"
              >
                Reset Filter
              </button>
            </div>
            <button
              @click="filterOpen = false"
              class="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <!-- Isi filter scrollable -->
          <div class="flex-1 overflow-y-auto p-4 text-gray-400 text-sm">

                        
          <!-- Jumlah Per Halaman -->
          <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Tampil per Halaman
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="n in [20, 50, 100, 500, 1000]"
              :key="n"
              @click="setPerPage(n)"
              class="px-2 py-1 rounded-md border text-xs font-medium transition-colors duration-300"
              :class="perPage === n
                ? 'text-background border-gray-500 bg-gray-800 dark:bg-gray-100'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'"
            >
              {{ n }}
            </button>
          </div>
            
            <!-- Filter Sort -->
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">
              Urutkan Berdasarkan
            </h3>

            <div class="flex flex-col gap-2">
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="w-full border rounded-md p-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-white"
              >
                <option value="random">Acak</option>
                <option value="name">Nama Produk</option>
                <option value="price">Harga</option>
                <option value="created_at">Baru</option>
                <option value="updated_at">Populer</option>
              </select>

              <!-- ✅ Sembunyikan direction saat random -->
              <select
                v-if="sortBy !== 'random'"
                v-model="sortDirection"
                @change="applyFilters"
                class="w-full border rounded-md p-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-white"
              >
                <option value="asc">Naik (A–Z / Murah–Mahal / Terlama)</option>
                <option value="desc">Turun (Z–A / Mahal–Murah / Terbaru)</option>
              </select>
            </div>  

            <!-- Filter Category -->
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">
              Kategori
            </h3>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="toggleCategory(cat.id)"
                class="px-2 py-1 rounded-full border text-xs font-medium transition-colors duration-300"
                :class="selectedCategories.includes(cat.id)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'"
              >
                {{ cat.name }}
              </button>
            </div>

            <!-- Filter Brand -->
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">
              Brand
            </h3>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="brand in brands"
                :key="brand.id"
                @click="toggleBrand(brand.id)"
                class="px-2 py-1 rounded-full border text-xs font-medium transition-colors duration-300"
                :class="selectedBrands.includes(brand.id)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'"
              >
                {{ brand.name }}
              </button>
            </div>  

          </div>
        </div>
      </div>
    </transition>

    <!-- Checkout Modal -->
    <CheckoutModalOrderNow
      v-model:open="checkoutOpen"
      v-model:items="activeCartItems"
      :activeStore="currentStore"
      :userName="userName"
      @done="clearActiveStoreCart"
    />

    <!-- Store Modal -->
    <StoreModal
      v-model:open="storeOpen"
      :stores="stores"
      :activeStore="currentStore"
      @select="applyStoreFilter"
    />

    <div class="fixed bottom-5 left-5 sm:left-85 lg:left-100 z-40 flex flex-col items-start gap-3">

      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 -z-10"
        @click="closeFabMenu"
      ></div>

      <transition-group name="fab-item" tag="div" class="flex flex-col items-start gap-3 ms-2">
        <div
          v-for="(item, idx) in (mobileMenuOpen ? fabMenuItems : [])"
          :key="item.label"
          :style="{ 
            transitionDelay: mobileMenuOpen 
              ? `${(fabMenuItems.length - 1 - idx) * 40}ms`  /* Buka: dari bawah ke atas */
              : `${idx * 40}ms`                             /* Tutup: dari atas ke bawah */
          }"
          class="flex items-center gap-3 group"
        >
          <Link
            :href="item.href"
            @click="closeFabMenu"
            class="size-12 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800
                  shadow-lg flex items-center justify-center
                  text-foreground hover:bg-accent hover:text-blue-500 transition-colors"
          >
            <component :is="item.icon" class="size-5" />
          </Link>

          <Link :href="item.href"
              @click="closeFabMenu"
              class="px-3 py-1.5 text-xs font-medium rounded-md shadow-md
                        bg-white dark:bg-gray-900 
                        border border-gray-200 dark:border-gray-800 
                        text-gray-700 dark:text-gray-200 whitespace-nowrap">
            {{ item.label }}
          </Link>
        </div>
      </transition-group>

      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="size-14 rounded-full bg-foreground text-background shadow-xl
              flex items-center justify-center transition-transform active:scale-90 ml-1"
        :title="mobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
      >
        <transition name="fab-icon" mode="out-in">
          <X v-if="mobileMenuOpen" key="x" class="size-6" />
          <Menu v-else key="menu" class="size-6" />
        </transition>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { router, Link, usePage } from "@inertiajs/vue3";
import ProductTileOrderNow from "@/Components/ProductTileOrderNow.vue";
import CartSidebarOrderNow from "@/Components/CartSidebarOrderNow.vue";
import CheckoutModalOrderNow from "@/Components/CheckoutModalOrderNow.vue";
import StoreModal from "@/Components/StoreModal.vue";
import { ShoppingBasket, ChevronsLeft, ChevronsRight, SlidersHorizontal, Store, Menu, X, Home, NotepadText, User } from "lucide-vue-next";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

/* =========================
   PROPS
========================= */
const props = defineProps({
  products: Object,
  search: { type: String, default: "" },
  users: Array,
  userName: String,
  categories: Array,
  brands: Array,
  stores: Array,
  currentStore: Object,
});

const isStoreClosed = computed(() => {
  return props.currentStore && props.currentStore.is_open === false;
});

/* =========================
   INITIAL STORE REDIRECT
========================= */
const storeFromLS = Number(localStorage.getItem("ordernow_selected_store"));
const urlParams = new URLSearchParams(window.location.search);
const isOnStoreSlugPage = window.location.pathname.startsWith('/@');

if (props.currentStore) {
  localStorage.setItem("ordernow_selected_store", props.currentStore.id);
  localStorage.setItem("ordernow_selected_store_slug", props.currentStore.slug);
}

if (storeFromLS && !isOnStoreSlugPage) {
  // Cari slug dari props.stores berdasarkan id
  const savedStore = props.stores?.find(s => s.id === storeFromLS);
  if (savedStore?.slug) {
    router.visit(`/@${savedStore.slug}`, {
      method: "get",
      replace: true,
      preserveState: false,
    });
  }
}

/* =========================
   STATE
========================= */
const page = ref( Number(new URLSearchParams(window.location.search).get("page")) || 1 );
const perPage = ref(Number(urlParams.get("per_page")) || 100);
const sortBy = ref("updated_at");
const sortDirection = ref("desc");
const searchInput = ref(props.search || "");

const selectedCategories = ref([]);
const selectedBrands = ref([]);
const selectedStore = ref(Number(urlParams.get("store")) || 1);

const storeOpen = ref(false);
const scrollContainer = ref(null);

/* =========================
   FLOATING MENU (kiri bawah)
========================= */
const mobileMenuOpen = ref(false);
const fabMenuItems = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Transaksi", href: "/transaksi", icon: NotepadText },
  { label: "Akun Saya", href: "/settings/profile", icon: User },
];

function closeFabMenu() {
  mobileMenuOpen.value = false;
}

/* =========================
   SCROLL PERSIST
========================= */
onBeforeUnmount(() => {
  if (scrollContainer.value) {
    localStorage.setItem("ordernow_scroll", scrollContainer.value.scrollTop);
  }
});

onMounted(() => {
  const saved = localStorage.getItem("ordernow_scroll");
  if (scrollContainer.value && saved) {
    scrollContainer.value.scrollTop = Number(saved);
  }
});

function scrollToTop() {
  requestAnimationFrame(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0;
    }
  });
}


/* =========================
   QUERY BUILDER (DITAMBAH PAGE)
========================= */
function buildQuery(overrides = {}) {
  return {
    search: searchInput.value ?? "",
    categories: selectedCategories.value.join(","),
    brands: selectedBrands.value.join(","),
    per_page: perPage.value ?? 100,
    sort_by: sortBy.value ?? "updated_at",
    sort_direction: sortDirection.value ?? "desc",
    page: overrides.page ?? page.value ?? 1,
    ...overrides,
  };
}

function storeUrl() {
  const slug = props.currentStore?.slug;
  return slug ? `/@${slug}` : '/ordernow';
}

/* =========================
   FILTER ACTIONS
========================= */
function setPerPage(n) {
  perPage.value = n;
  page.value = 1;

  router.get(storeUrl(), buildQuery(), {  // ← ganti /ordernow
    preserveScroll: true,
    preserveState: true,
    replace: true,
  });
}

function toggleCategory(id) {
  const idx = selectedCategories.value.indexOf(id);
  idx > -1
    ? selectedCategories.value.splice(idx, 1)
    : selectedCategories.value.push(id);

  page.value = 1;
  applyFilters();
}

function toggleBrand(id) {
  const idx = selectedBrands.value.indexOf(id);
  idx > -1
    ? selectedBrands.value.splice(idx, 1)
    : selectedBrands.value.push(id);

  page.value = 1;
  applyFilters();
}

function applyStoreFilter(store) {
  selectedStore.value = store.id;
  page.value = 1;

  // Navigasi ke URL dengan slug
  router.visit(`/@${store.slug}`, {
    method: 'get',
    data: buildQuery({ page: 1 }),
    preserveScroll: true,
    preserveState: false, // false karena ganti store = ganti halaman
    replace: true,
  });

  // localStorage tetap pakai branch_id
  localStorage.setItem("ordernow_selected_store", store.id);
  localStorage.setItem("ordernow_selected_store_slug", store.slug);
}

function applyFilters() {
  page.value = 1;

  router.get(storeUrl(), buildQuery({ page: 1 }), {  // ← ganti /ordernow
    preserveScroll: true,
    preserveState: true,
    replace: true,
  });
}


/* =========================
   INIT FROM URL
========================= */
onMounted(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("page"))
    page.value = Number(params.get("page"));

  if (params.get("per_page"))
    perPage.value = Number(params.get("per_page"));

  if (params.get("search"))
    searchInput.value = params.get("search");

  if (params.get("categories"))
    selectedCategories.value = params.get("categories").split(",").map(Number);

  if (params.get("brands"))
    selectedBrands.value = params.get("brands").split(",").map(Number);

  if (params.get("sort_by"))
    sortBy.value = params.get("sort_by");

  if (params.get("sort_direction"))
    sortDirection.value = params.get("sort_direction");
});



/* =========================
   SEARCH (DEBOUNCE)
========================= */
let timeout = null;
const debouncedSearch = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    page.value = 1;

    router.get(storeUrl(), buildQuery({ page: 1 }), {  // ← ganti /ordernow
      preserveScroll: true,
      preserveState: true,
      replace: true,
    });
  }, 1000);
};


function resetSearch() {
  searchInput.value = "";
  page.value = 1;
  applyFilters();
}

/* =========================
   CART (UNCHANGED)
========================= */
const cartKey = "ordernow_cart_v1";
const cartItems = ref(JSON.parse(localStorage.getItem(cartKey) || "[]"));
const checkoutOpen = ref(false);
const filterOpen = ref(false);
const cartOpen = ref(window.innerWidth >= 768);

function addToCart(product) {
  const found = cartItems.value.find(
    i => i.product_id === product.id && i.store_id === props.currentStore.id
  );
  if (found) {
    const updatedItem = { ...found, quantity_mins: found.quantity_mins + 1, subtotal: found.price * (found.quantity_mins + 1) };
    cartItems.value.splice(cartItems.value.indexOf(found), 1, updatedItem);
  } else {
    cartItems.value = [...cartItems.value, {
      store_id: props.currentStore.id,
      product_id: product.id,
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      quantity_mins: 1,
      subtotal: Number(product.price),
      preview: product.images?.[0] ?? "",
    }];
  }
}



const activeCartItems = computed(() =>
  cartItems.value.filter(
    i => i.store_id === props.currentStore.id
  )
);

function replaceCartItems(newItems) {
  const others = cartItems.value.filter(
    i => i.store_id !== props.currentStore.id
  );
  cartItems.value = [...others, ...newItems]; // assign array baru supaya reactive
}


function handleSidebarUpdateItems(newItems) {
  const others = cartItems.value.filter(i => i.store_id !== currentStore.id);
  cartItems.value = [...others, ...newItems];
}


// misal di parent (Index.vue)
function updateCartQty({ product, quantity_mins }) {
  const idx = cartItems.value.findIndex(
    i => i.product_id === product.id && i.store_id === props.currentStore.id
  );
  if (idx !== -1) {
    // clone objek supaya reactive
    const updatedItem = { ...cartItems.value[idx], quantity_mins, subtotal: cartItems.value[idx].price * quantity_mins };
    cartItems.value.splice(idx, 1, updatedItem); // replace di array
    // Atau assign array baru untuk memastikan reactivity
    cartItems.value = [...cartItems.value];
  }
}



function removeFromCart(product) {
  cartItems.value = cartItems.value.filter(
    i => !(i.product_id === product.id && i.store_id === props.currentStore.id)
  );
}



function removeCartItem({ product_id, store_id }) {
  cartItems.value = cartItems.value.filter(
    i => !(i.product_id === product_id && i.store_id === store_id)
  );
}

function clearActiveStoreCart() {
  cartItems.value = cartItems.value.filter(
    i => Number(i.store_id) !== Number(props.currentStore.id)
  );
}






const totalItems = computed(() =>
  activeCartItems.value.reduce(
    (s, i) => s + Number(i.quantity_mins || 0),
    0
  )
);


watch(
  cartItems,
  (v) => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(v));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // Beri peringatan ke user
        toast.error("Penyimpanan penuh! Tolong hapus beberapa item di keranjang.");
      }
    }
  },
  { deep: true }
);

function openCheckout() {
  checkoutOpen.value = true;
}

/* =========================
   PERSIST LAST QUERY (PAGE MASUK)
========================= */
watch(
  () => ({
    search: searchInput.value,
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    per_page: perPage.value,
    sort_by: sortBy.value,
    sort_direction: sortDirection.value,
    store: selectedStore.value,
    page: page.value,
  }),
  v => localStorage.setItem("ordernow_last_query", JSON.stringify(v)),
  { deep: true }
);

const inertiaPage = usePage();

watch(
  () => inertiaPage.url,
  () => {
    const params = new URLSearchParams(window.location.search);
    const newPage = Number(params.get("page")) || 1;

    if (page.value !== newPage) {
      page.value = newPage;
    }
  }
);

</script>



<style scoped>
.slide-filter-enter-active,
.slide-filter-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-filter-enter-from,
.slide-filter-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-filter-enter-to,
.slide-filter-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Item menu floating: muncul/hilang dari atas tombol */
.fab-item-enter-active,
.fab-item-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.fab-item-enter-from,
.fab-item-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.85);
}

.fab-item-enter-to,
.fab-item-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fab-item-move {
  transition: transform 0.25s ease;
}

/* Transisi icon hamburger <-> X pada tombol utama */
.fab-icon-enter-active,
.fab-icon-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fab-icon-enter-from,
.fab-icon-leave-to {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.fab-icon-enter-to,
.fab-icon-leave-from {
  opacity: 1;
  transform: rotate(0) scale(1);
}
</style>