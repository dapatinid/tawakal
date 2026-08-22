<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { router, Link, usePage } from "@inertiajs/vue3";
import ProductTile from "@/components/ProductTile.vue";
import CartSidebar from "@/components/CartSidebar.vue";
import CheckoutModal from "@/components/CheckoutModal.vue";
import { ShoppingBasket, ChevronsLeft, ChevronsRight, SlidersHorizontal, Sparkles, ScrollText } from "lucide-vue-next";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// ======================================================
// PROPS
// ======================================================
const props = defineProps({
  products: Object,
  allProductForText: Object,
  search: { type: String, default: "" },
  users: Array,
  categories: Array,
  brands: Array,
});


// Ambil branch_id dari user yang login (Inertia shared props)
const branchId = computed(() => usePage().props.auth.user.branch_id);

// ======================================================
// QUERY STATE (SINGLE SOURCE OF TRUTH)
// ======================================================
const urlParams = new URLSearchParams(window.location.search);

const page = ref(Number(urlParams.get("page")) || 1);
const perPage = ref(Number(urlParams.get("per_page")) || 100);
const sortBy = ref(urlParams.get("sort_by") || "updated_at");
const sortDirection = ref(urlParams.get("sort_direction") || "desc");
const searchInput = ref(urlParams.get("search") || props.search || "");
const selectedCategories = ref(
  urlParams.get("categories")
    ? urlParams.get("categories").split(",").map(Number)
    : []
);
const selectedBrands = ref(
  urlParams.get("brands")
    ? urlParams.get("brands").split(",").map(Number)
    : []
);

// ======================================================
// SCROLL
// ======================================================
const scrollContainer = ref(null);

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    localStorage.setItem("pos_scroll", scrollContainer.value.scrollTop);
  }
});

onMounted(() => {
  const saved = localStorage.getItem("pos_scroll");
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

// ======================================================
// QUERY BUILDER (WAJIB)
// ======================================================
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

// ======================================================
// FILTER / SORT / PER PAGE
// ======================================================
function applyFilters() {
  page.value = 1;
  router.get("/pos", buildQuery({ page: 1 }), {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  });
}

function setPerPage(n) {
  perPage.value = n;
  page.value = 1;
  applyFilters();
}

function toggleCategory(id) {
  const i = selectedCategories.value.indexOf(id);
  i > -1
    ? selectedCategories.value.splice(i, 1)
    : selectedCategories.value.push(id);
  applyFilters();
}

function toggleBrand(id) {
  const i = selectedBrands.value.indexOf(id);
  i > -1
    ? selectedBrands.value.splice(i, 1)
    : selectedBrands.value.push(id);
  applyFilters();
}

// ======================================================
// SEARCH (DEBOUNCE)
// ======================================================
let timeout = null;

function debouncedSearch() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    page.value = 1;
    router.get("/pos", buildQuery({ page: 1 }), {
      preserveState: true,
      replace: true,
    });
  }, 1000);
}

function resetSearch() {
  searchInput.value = "";
  applyFilters();
}

// ======================================================
// SYNC PAGE FROM INERTIA URL (PAGINATION FIX)
// ======================================================
const inertiaPage = usePage();

watch(
  () => inertiaPage.url,
  () => {
    const params = new URLSearchParams(window.location.search);
    page.value = Number(params.get("page")) || 1;
  }
);

// ======================================================
// CART (TIDAK DIUBAH)
// ======================================================

const cartKey = "pos_cart_v1";
// const cartItems = ref(JSON.parse(localStorage.getItem(cartKey) || "[]"));
const cartOpen = ref(window.innerWidth >= 768);
const filterOpen = ref(false);
const checkoutOpen = ref(false);
const checkoutCustomerID = ref(null);
const checkoutUserAlias = ref("");
const checkoutNotes = ref("");
const checkoutPaymentMethod = ref("cash");
const checkoutDate = ref("");
const checkoutOrderType = ref("");

const groups = ["A","B","C","D","E","F","G"];
const activeGroup = ref(localStorage.getItem("pos_cart_activeGroup") || "A");

// Fungsi pembantu untuk membuat key unik (misal: "1_A", "1_B")
const getActiveKey = (groupName) => `${branchId.value}_${groupName}`;

// Ambil semua cart dari localStorage
let rawCart = JSON.parse(localStorage.getItem(cartKey) || "{}");

// Struktur cart di localStorage:
// { A: [...items], B: [...], C: [...], D: [...], E: [...] }
// Jika belum ada, inisialisasi
const cartItems = ref(rawCart[getActiveKey(activeGroup.value)] || []);

// Simpan ke localStorage
function saveCart() {
  // Simpan cartItems ke dalam key unik branch_group
  const key = getActiveKey(activeGroup.value);
  rawCart[key] = cartItems.value;
  
  localStorage.setItem(cartKey, JSON.stringify(rawCart));
  localStorage.setItem("pos_cart_activeGroup", activeGroup.value);
}

// ==========================
// CHANGE GROUP
// ==========================
function setGroup(g) {
  if (!groups.includes(g)) return;
  
  // 1. Simpan data grup lama sebelum pindah
  saveCart();
  
  // 2. Update grup aktif
  activeGroup.value = g;
  
  // 3. Muat data baru berdasarkan key unik branch_grup
  const newKey = getActiveKey(g);
  cartItems.value = rawCart[newKey] || [];
  
  localStorage.setItem("pos_cart_activeGroup", activeGroup.value);
}

function addToCart(product) {
  const found = cartItems.value.find(i => i.product_id === product.id);
  if (found) {
    found.quantity_mins++;
    found.subtotal = found.quantity_mins * found.price;
  } else {
    cartItems.value.push({
      branch_id: branchId.value,
      product_id: product.id,
      sku: product.sku,
      name: product.name,
      cost: Number(product.cost),
      price: Number(product.price),
      quantity_mins: 1,
      subtotal: Number(product.price),
      slug: product.slug,
      group: activeGroup.value
    });
  }
  saveCart();
}

function updateCartQty({ product, quantity_mins }) {
  const found = cartItems.value.find(i => i.product_id === product.id);
  if (found) {
    found.quantity_mins = quantity_mins;
    found.subtotal = found.price * quantity_mins;
    saveCart();
  }
}

function removeFromCart(product) {
  cartItems.value = cartItems.value.filter(i => i.product_id !== product.id);
  saveCart();
}

function clearCart() {
  cartItems.value = [];
  saveCart();
}

const totalItems = computed(() =>
  cartItems.value.reduce((s, i) => s + Number(i.quantity_mins || 0), 0)
);

const subtotal = computed(() =>
  cartItems.value.reduce((s, i) => s + Number(i.subtotal || 0), 0)
);

// WATCHERS sync ke localStorage
watch(
  cartItems, 
  () => {
    try {
      saveCart();
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // Gunakan vue-sonner untuk memberi tahu kasir
        toast.error("Gagal menyimpan! Memori Browser Penuh. Mohon hapus beberapa keranjang yang tidak terpakai.");
        
        // Opsi: Hapus otomatis log scroll atau query lama untuk memberi ruang
        // localStorage.removeItem("pos_scroll");
        // localStorage.removeItem("pos_last_query");
      }
    }
  }, 
  { deep: true }
);

// Hapus seluruh items di group aktif
function clearActiveGroupCart() {
  cartItems.value = [];
  saveCart(); // pastikan tersimpan di localStorage
}


function openCheckout() {
  checkoutOpen.value = true;
}

function onCheckoutDone() {
  cartItems.value = [];
  checkoutOpen.value = false;
}

watch(branchId, (newBranchId) => {
  if (newBranchId) {
    // Saat branch berubah, muat data yang sesuai dengan branch baru tersebut
    const key = `${newBranchId}_${activeGroup.value}`;
    cartItems.value = rawCart[key] || [];
  }
});

////  SCANNER SUPPORT (ENTER KEY) ////

const isScanMode = ref(false);

function toggleScanMode() {
  isScanMode.value = !isScanMode.value;
}

function handleScanEnter() {
  if (!searchInput.value) return;

  const keyword = searchInput.value.trim().toLowerCase();

  // Coba cari by SKU dulu
  let found = props.allProductForText.find(p =>
    p.sku && p.sku.toLowerCase() === keyword
  );

  // Jika tidak ketemu by SKU, coba cari by Barcode
  if (!found) {
    found = props.allProductForText.find(p =>
      p.barcode && p.barcode.toLowerCase() === keyword
    );
  }

  if (!found) return;

  addToCart(found);

  searchInput.value = "";
}

// ======================================================
// PERSIST LAST QUERY
// ======================================================
watch(
  () => [
    searchInput.value,
    selectedCategories.value,
    selectedBrands.value,
    perPage.value,
    sortBy.value,
    sortDirection.value,
    props.products?.current_page,
  ],
  () => {
    localStorage.setItem(
      "pos_last_query",
      JSON.stringify({
        search: searchInput.value,
        categories: selectedCategories.value,
        brands: selectedBrands.value,
        per_page: perPage.value,
        sort_by: sortBy.value,
        sort_direction: sortDirection.value,
        page: props.products?.current_page ?? 1,
      })
    );
  },
  { deep: true }
);

// ================================================
// ORDER TEXT IMPORT (FINAL)
// ================================================

// Ambil blok antara DAFTAR PESANAN : dan ========
function extractOrderBlock(text) {
  const regex = /DAFTAR PESANAN\s*:(.*?)(?=^=+|\Z)/ms;
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

// Ambil username customer jika bertipe member
function extractMemberUsername(text) {
  if (typeof text !== "string") return null;

  const clean = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  const match = clean.match(/Customer\s*:\s*(.*?)\s*\(\s*member\s*\)/i);

  if (!match) return null;

  return match[1].trim();
}

function extractUserAlias(text) {
  if (typeof text !== "string") return "";

  // Tangkap alias setelah "atas nama" — inline di baris Customer
  // Contoh: "Customer : AdminDapatin (member) - atas nama Yuda"
  const match = text.match(/atas\s+nama\s+([^\r\n]+)/i);
  return match ? match[1].trim() : "";
}

// Ambil nama guest (non-member): teks setelah "Customer :" hingga akhir baris
// Contoh: "Customer : Wawan" → "Wawan"
function extractGuestName(text) {
  if (typeof text !== "string") return "";

  // Pastikan bukan member (tidak ada "(member)" di baris yang sama)
  const line = (text.match(/Customer\s*:.*$/im) || [])[0] || "";
  if (/\(\s*member\s*\)/i.test(line)) return "";

  const match = line.match(/Customer\s*:\s*([^\r\n]+)/i);
  return match ? match[1].trim() : "";
}



// Ambil notes
function extractNotes(text) {
  const match = text.match(/CATATAN\s*:(.*?)(?=====+)/si);
  return match ? match[1].trim() : "";
}

// Ambil payment method
function extractPayment(text) {
  const match = text.match(/PEMBAYARAN\s*:\s*([^\n]+)/i);
  return match ? normalizePaymentMethod(match[1]) : "cash";
}

// Ambil tanggal
function extractDate(text) {
  if (!text) return "";

  // Tangkap semua karakter printable setelah "Pesan untuk :" hingga akhir baris
  const match = text.match(/Pesan\s*untuk\s*:\s*([^\r\n]+)/i);

  return match ? match[1].trim() : "";
}


// Ambil jenis pesanan
function extractOrderType(text) {
  if (!text) return null;

  const match = text.match(/Jenis Pesanan\s*:\s*([^\n]+)/i);
  if (!match) return null;

  const raw = match[1].trim().toLowerCase();

  if (raw.includes("dine")) return "dine_in";
  if (raw.includes("self")) return "self_pickup";
  if (raw.includes("pickup")) return "self_pickup";
  if (raw.includes("delivery")) return "delivery";

  return null;
}


function normalizeDate(raw) {
  if (!raw) {
    return dayjs().format("YYYY-MM-DDTHH:mm");
  }

  const cleaned = raw.replace(/\s+/g, " ").trim();

  // Memecah format "10/06/2026 14:26" menjadi bagian-bagian menggunakan regex pembatas
  const parts = cleaned.split(/[\s/.:]+/);
  
  if (parts.length >= 5) {
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2];
    const h = parts[3].padStart(2, "0");
    const min = parts[4].padStart(2, "0");

    // Format output untuk <input type="datetime-local">
    return `${y}-${m}-${d}T${h}:${min}`;
  }

  // Fallback ke Day.js default jika formatnya berbeda
  const parsed = dayjs(cleaned);
  return parsed.isValid()
    ? parsed.format("YYYY-MM-DDTHH:mm")
    : dayjs().format("YYYY-MM-DDTHH:mm");
}

function normalizePaymentMethod(method) {
  if (!method) return "cash";

  const clean = method.toLowerCase().trim();

  if (clean.includes("cash")) return "cash";
  if (clean.includes("bank")) return "bank";
  if (clean.includes("transfer")) return "transfer";
  if (clean.includes("ewallet")) return "ewallet";
  if (clean.includes("qris")) return "qris";

  return "cash"; // default
}

// Pecah item → format 2 baris: Nama Produk + "x jumlah"
function parseOrderItems(block) {
  const lines = block
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const items = [];

  for (let i = 0; i < lines.length; i += 2) {
    const nameLine = lines[i];
    const qtyLine = lines[i + 1];

    // === AMBIL SKU: KATA PERTAMA SAJA ===
    const skuMatch = nameLine.match(/^(\S+)/);
    if (!skuMatch) continue;

    const sku = skuMatch[1];

    // === AMBIL QTY ===
    const qtyMatch = qtyLine?.match(/x\s*(\d+)/i);
    const qty = qtyMatch ? Number(qtyMatch[1]) : 1;

    items.push({ sku, qty });
  }

  return items;
}


// Fuzzy matching sederhana
function similarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;

  let matches = 0;
  for (const word of a.split(" ")) {
    if (b.includes(word)) matches++;
  }
  return matches / a.split(" ").length;
}

function findBestMatch(sku, products) {
  let best = null;
  let bestScore = 0;

  for (const p of products) {
    const score = similarity(sku, p.sku);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

function findUserByUsername(username, users) {
  if (!username || !Array.isArray(users)) return null;

  return users.find(
    u => u.username && u.username.toLowerCase() === username.toLowerCase()
  ) || null;
}



// Emit dari CartSidebar → proses order text → isi modal
// Emit dari CartSidebar → proses order text → isi modal
function onImportOrder(orderText) {
  if (!orderText) return;

  const block = extractOrderBlock(orderText);
  const items = parseOrderItems(block);

  items.forEach(item => {
    const best = findBestMatch(item.sku, props.allProductForText);
    if (!best) return;
    addToCart(best);
    updateCartQty({ product: best, quantity_mins: item.qty });
  });

  // Notes, payment, orderType → ref DAN localStorage (modal baca LS saat mount)
  const notes = extractNotes(orderText) || "";
  checkoutNotes.value = notes;
  localStorage.setItem("pos_last_notes", notes);

  const payment = extractPayment(orderText) || "cash";
  checkoutPaymentMethod.value = payment;
  localStorage.setItem("pos_last_payment", payment);

  const orderType = extractOrderType(orderText) ?? null;
  checkoutOrderType.value = orderType;
  if (orderType) localStorage.setItem("pos_last_order_type", orderType);
  else localStorage.removeItem("pos_last_order_type");

  // Date: normalize → simpan ke ref DAN langsung ke localStorage
  const rawDate = extractDate(orderText);
  const normalizedDate = rawDate ? normalizeDate(rawDate) : null;
  checkoutDate.value = normalizedDate;
  if (normalizedDate) {
    localStorage.setItem("pos_last_date", normalizedDate);
  }

  // Customer & UserAlias
  const memberUsername = extractMemberUsername(orderText);
  if (memberUsername) {
    // MEMBER: cari user by username → pakai id-nya, alias dari "atas nama"
    const user = findUserByUsername(memberUsername, props.users);
    if (user) {
      checkoutCustomerID.value = user.id;
      localStorage.setItem("pos_last_customer", user.id);
    }
    const alias = extractUserAlias(orderText);
    if (alias) {
      checkoutUserAlias.value = alias;
      localStorage.setItem("pos_last_user_alias", alias);
    }
  } else {
    // NON-MEMBER: pakai Customer Umum (id=3), alias dari nama setelah "Customer :"
    checkoutCustomerID.value = 3;
    localStorage.setItem("pos_last_customer", 3);
    const guestName = extractGuestName(orderText);
    if (guestName) {
      checkoutUserAlias.value = guestName;
      localStorage.setItem("pos_last_user_alias", guestName);
    }
  }

  // Buka modal checkout setelah semua field terisi
  // openCheckout();
}


//////////// FULLSCREEN CONTROL ////////////



const toggleFullscreen = () => {
  const elem = document.documentElement;

  if (!document.fullscreenElement) {
    // Masuk ke Full Screen
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari/Chrome Lama */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  } 
  // else {
  //   // Keluar dari Full Screen
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.webkitExitFullscreen) {
  //     document.webkitExitFullscreen();
  //   } else if (document.msExitFullscreen) {
  //     document.msExitFullscreen();
  //   }
  // }
};


</script>



<template>
  <div class="flex h-screen">
    <Toaster position="top-right" richColors />

    <div v-show="!cartOpen" class="hidden sm:flex justify-center items-center relativemx-auto w-full sm:w-80 lg:w-96">
       <span @click="cartOpen = true" class="text-base font-semibold text-gray-500 dark:text-gray-200 text-nowrap rounded-full py-1 px-3 border border-gray-300 dark:border-gray-700 cursor-pointer">Buka CART</span>
    </div>

    <!-- Sidebar Cart -->
    <CartSidebar
      v-model:items="cartItems"
      v-model:open="cartOpen"
      @checkout="openCheckout"
      @import-order="onImportOrder"
      @clear-group="clearActiveGroupCart"
    />

    <!-- Product list -->
    <div ref="scrollContainer" class="overflow-auto ms-auto w-full sm:w-[calc(100vw-20rem)] lg:w-[calc(100vw-24rem)] pb-16 bg-gradient-to-br from-blue-100 via-white to-red-100 dark:from-blue-950 dark:via-gray-900 dark:to-red-950 from-10% to-90%">
      <div class="flex items-center justify-between sticky top-0 mb-0.5 p-4 backdrop-blur-xl">
        <!-- Tombol Cart (mobile) -->
        <button
          class="relative flex items-center gap-2 px-2 py-1.5 bg-accent rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500"
          @click="() => { 
            cartOpen = true; 
            // toggleFullscreen() 
            }"
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

            <!-- 🆕 INPUT ORDER TEXT -->
            <!-- <textarea
              v-model="orderText"
              @keydown.enter.prevent="runOrderImport"
              placeholder="Paste order di sini lalu tekan Enter"
              class="w-[260px] border dark:border-gray-800 rounded-lg p-2 text-sm h-[90px] resize-none focus:ring focus:ring-blue-200"
            ></textarea> -->

          <input
            v-model="searchInput"
            @input="!isScanMode && debouncedSearch()"
            @keydown.enter.prevent="isScanMode && handleScanEnter()"
            type="text"
            :placeholder="isScanMode ? 'Inputkan Kode' : 'Cari produk...'"
            :class="[
                'w-full border-2 rounded-lg p-2 pr-10 text-sm focus:ring',
                isScanMode
                  ? 'border-red-500 ring-red-200'
                  : 'border-accent-foreground/30 ring-blue-200'
              ]"
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

        <!-- Dashboard -->
        <Link
          :href="'/penjualan'"
          class="ms-auto items-center py-1 flex justify-center text-gray-500 dark:text-gray-300 rounded-md"
        >
          <ScrollText class="size-5 hover:text-blue-500" />
        </Link>
      </div>




      <!-- Products -->
      <div
        class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 px-2"
      >
        <ProductTile
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
      <div class="flex justify-center mt-4" v-if="products?.links?.length > 3">
        <nav class="flex items-center gap-1 text-sm overflow-x-auto px-2 pb-3">

          <!-- First -->
          <Link
            v-if="products.links[1]?.url"
            :href="products.links[1].url"
            @click="scrollToTop"
            preserve-scroll
            preserve-state
            class="px-3 py-1 border rounded hover:bg-muted"
          >
            <ChevronsLeft class="w-4 h-4" />
          </Link>

          <!-- Number -->
          <template v-for="(link, i) in products.links.filter(l => /^\d+$/.test(l.label))" :key="i">
            <Link
              :href="link.url ?? '#'"
              @click="scrollToTop"
              preserve-scroll
              preserve-state
              class="px-3 py-1 border rounded"
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
            class="px-3 py-1 border rounded hover:bg-muted"
          >
            <ChevronsRight class="w-4 h-4" />
          </Link>

        </nav>
      </div>
      
      <!-- GROUP BUTTON -->
      <div class="fixed bottom-2 left-0 sm:left-[20rem] lg:left-[24rem] right-0 z-30 flex gap-2 px-3 overflow-x-auto no-scrollbar">
        <button
          v-for="g in groups"
          :key="g"
          @click="setGroup(g)"
          class="px-3 py-1 rounded-md text-xs text-nowrap font-semibold flex items-center gap-1 select-none"
          :class="{
            'bg-blue-500 text-white': activeGroup === g,
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': activeGroup !== g
          }"          
        >
          Cart {{ g }}
          <Sparkles
            v-if="rawCart[branchId + '_' + g] && rawCart[branchId + '_' + g].length > 0"
            class="w-4 h-4"
            :class="{
              'text-white': activeGroup === g,
              'text-red-400': activeGroup !== g
            }"
          />
        </button>
        
        <Link href="/pembayaran" class="px-3 py-1 rounded-md text-xs text-nowrap font-semibold flex items-center gap-1 select-none bg-gray-200 text-black dark:bg-gray-800 dark:text-white">Pembayaran</Link>
        <Link href="/jurnal" class="px-3 py-1 rounded-md text-xs text-nowrap font-semibold flex items-center gap-1 select-none bg-gray-200 text-black dark:bg-gray-800 dark:text-white">Jurnal</Link>
        <Link href="/stok" class="px-3 py-1 rounded-md text-xs text-nowrap font-semibold flex items-center gap-1 select-none bg-gray-200 text-black dark:bg-gray-800 dark:text-white">Mutasi Stok</Link>
        <Link href="/produk" class="px-3 py-1 rounded-md text-xs text-nowrap font-semibold flex items-center gap-1 select-none bg-gray-200 text-black dark:bg-gray-800 dark:text-white">Atur Produk</Link>
        <button @click="toggleScanMode" class="px-3 py-1 rounded-md text-xs text-nowrap font-semibold flex items-center gap-1 select-none bg-gray-200 text-black dark:bg-gray-800 dark:text-white">Mode</button>
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
                  router.get('/pos', {
                    search: searchInput,
                    per_page: perPage,
                    sort_by: sortBy,
                    sort_direction: sortDirection
                  }, { preserveState: true, replace: true });
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
                <option value="name">Nama Produk</option>
                <option value="price">Harga</option>
                <option value="created_at">Tanggal Dibuat</option>
                <option value="updated_at">Tanggal Diubah</option>
              </select>

              <select
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
    <CheckoutModal
      v-model:open="checkoutOpen"
      v-model:customerID="checkoutCustomerID"
      v-model:userAlias="checkoutUserAlias"
      v-model:notes="checkoutNotes"
      v-model:paymentMethod="checkoutPaymentMethod"
      v-model:date="checkoutDate"
      v-model:orderType="checkoutOrderType"
      :items="cartItems"
      :users="users"
      @done="onCheckoutDone"
    />
  </div>
</template>


<style scoped>

/* sembunyikan scrollbar tapi tetap bisa scroll */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE & Edge */
  scrollbar-width: none;     /* Firefox */
}


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
</style>