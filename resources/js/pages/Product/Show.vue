<script setup lang="ts">
import { Head, Link } from "@inertiajs/vue3";
import { ArrowLeft, ChevronLeft, ChevronRight, Link2, LucideMessageCircleQuestion, MessageCircleMore, MessageCircleWarning, Minus, Plus, ShoppingBasket, Store, X } from "lucide-vue-next";
import { ref, onMounted, onUnmounted, computed } from "vue";

const props = defineProps<{
  product: {
    id?: number;
    slug?: string;
    sku?: string;
    name?: string;
    group?: string;
    variant?: string;
    unit_name?: string;
    price?: number;
    strikethroughprice?: number;
    weight?: number;
    description?: string;
    images?: string[] | null;
    branch?: { 
      id?: number;
      name?: string; 
      slug?: string; // ← Tambahkan baris ini
      phone?: string;
      partner?: {           // <--- TAMBAHKAN BLOK INI
              name?: string;
              slug?: string;
            } | null;      
    } | null;
    category?: { name?: string } | null;
    brand?: { name?: string } | null;
    rating?: number;
    stock?: number;
    in_stock?: boolean | string;
    is_promo?: boolean | string;
    is_featured?: boolean | string;
  },
  variants: Array<{
    id: number;
    slug: string;
    name: string;
    variant?: string;
  }>;
  relatedProducts: {
    id: number;
    name: string;
    price: number;
    images: string[] | null;
  };
  hasOnlineAdmin: boolean;
}>();

// ========= SLIDER STATE =========
const current = ref(0);
let intervalId: any = null;

// Auto slide
onMounted(() => {
  if (props.product.images && props.product.images.length > 1) {
    intervalId = setInterval(() => next(), 5000);
  }
});
onUnmounted(() => intervalId && clearInterval(intervalId));

function next() {
  if (!props.product.images) return;
  current.value = (current.value + 1) % props.product.images.length;
}
function prev() {
  if (!props.product.images) return;
  current.value = (current.value - 1 + props.product.images.length) % props.product.images.length;
}

// Swipe
let touchStartX = 0;
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
}
function onTouchEnd(e: TouchEvent) {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 40) diff < 0 ? next() : prev();
}

// Format util
function formatCurrency(num: number | null | undefined) {
  if (num === null || num === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}
function formatNumber(v: number | null | undefined) {
  if (v === null || v === undefined) return "-";
  return Number(v).toLocaleString("id-ID");
}

// ========= FULLSCREEN IMAGE =========
const fullscreenImage = ref<string | null>(null);
const deviceHeight = window.innerHeight;

function openFullscreen(img: string) {
  fullscreenImage.value = previewUrl(img);
}
function closeFullscreen() {
  fullscreenImage.value = null;
}

// ========= CART =========
// Ganti baris inisialisasi lama menjadi ref reaktif:
const activeStoreId = ref<number>(1);

// Temukan atau sesuaikan blok onMounted Anda menjadi seperti ini:
onMounted(() => {
  // 1. Validasi apakah relasi branch dari backend tersedia
  if (props.product && props.product.branch) {
    const freshBranchId = (props.product as any).branch_id || (props.product.branch as any).id;
    const freshBranchSlug = (props.product.branch as any).slug;

    if (freshBranchId) {
      // 2. Set nilai variabel reaktif agar keranjang belanja di halaman ini singkron
      activeStoreId.value = Number(freshBranchId);

      // 3. Paksa localStorage merekam identitas Toko/Branch baru yang memiliki produk ini
      localStorage.setItem("ordernow_selected_store", String(freshBranchId));
      if (freshBranchSlug) {
        localStorage.setItem("ordernow_selected_store_slug", String(freshBranchSlug));
      }
    }
  } else {
    // Fallback jika data branch kosong, ambil dari localStorage lama
    activeStoreId.value = Number(localStorage.getItem("ordernow_selected_store") || 1);
  }

  // Logika autoslide gambar bawaan Anda tetap di bawah ini
  if (props.product.images && props.product.images.length > 1) {
    intervalId = setInterval(() => next(), 5000);
  }
});

const cartKey = "ordernow_cart_v1";
const cartItems = ref<any[]>(
  JSON.parse(localStorage.getItem(cartKey) || "[]")
);
const totalQtyInCart = computed(() =>
  activeCartItems.value.reduce(
    (sum, i) => sum + Number(i.quantity_mins),
    0
  )
);

const activeCartItems = computed(() =>
  cartItems.value.filter(i => i.store_id === activeStoreId.value)
);


function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cartItems.value));
}

function addToCart() {
  const product = props.product;

  // Pastikan store_id dikonversi ke Number agar perbandingan === valid
  const found = cartItems.value.find(
    i =>
      Number(i.product_id) === Number(product.id) &&
      Number(i.store_id) === Number(activeStoreId.value)
  );

  if (found) {
    found.quantity_mins++;
    found.subtotal = found.quantity_mins * found.price;
  } else {
    cartItems.value.push({
      store_id: Number(activeStoreId.value), // Pastikan disimpan sebagai Number
      product_id: Number(product.id),        // Pastikan disimpan sebagai Number
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      quantity_mins: 1,
      subtotal: Number(product.price),
      preview: product.images?.[0] ?? "",
    });
  }

  saveCart();
}

function decreaseQty() {
  const found = cartItems.value.find(
    i =>
      Number(i.product_id) === Number(props.product.id) &&
      Number(i.store_id) === Number(activeStoreId.value)
  );

  if (!found) return;

  if (found.quantity_mins > 1) {
    found.quantity_mins--;
    found.subtotal = found.quantity_mins * found.price;
  } else {
    // Filter untuk menghapus item jika quantity sudah mencapai 0
    cartItems.value = cartItems.value.filter(
      i =>
        !(
          Number(i.product_id) === Number(props.product.id) &&
          Number(i.store_id) === Number(activeStoreId.value)
        )
    );
  }

  saveCart();
}

function updateQty(e: Event) {
  const value = Number((e.target as HTMLInputElement).value);

  const found = cartItems.value.find(
    i =>
      Number(i.product_id) === Number(props.product.id) &&
      Number(i.store_id) === Number(activeStoreId.value)
  );

  if (!found) return;

  found.quantity_mins = isNaN(value) || value < 1 ? 1 : value;
  found.subtotal = found.quantity_mins * found.price;

  saveCart();
}

// Sempurnakan juga computed itemQty agar tombolnya ikut berubah menjadi mode +/- saat item ditemukan
const itemQty = computed(() => {
  const found = activeCartItems.value.find(
    i => Number(i.product_id) === Number(props.product.id)
  );
  return found ? found.quantity_mins : 0;
});


const showStock = computed(() => {
  const isJasa = props.product.category?.name?.toLowerCase() === 'jasa';
  return !isJasa && props.product.stock > 0;
});


function previewUrl(path?: string | null) {
  if (!path) return '';
  return path.startsWith('http')
    ? path
    : `/storage/${path}`;
}

//// Helper untuk membangun link ke halaman ordernow dengan query terakhir

// SESUDAH
// Perbaikan fungsi membangun link ke halaman ordernow menuju slug branch produk terkait
const orderNowHref = computed(() => {
  // 1. Prioritas Utama: Ambil slug mutlak milik branch produk yang sedang dibuka
  const productBranchSlug = props.product?.branch?.slug;

  // 2. Fallback: Jika tidak ada branch di produk, baru cari di cache atau gunakan default
  const slug = productBranchSlug ? productBranchSlug : (localStorage.getItem("ordernow_selected_store_slug") || "dapatin-pusat");
  
  const baseUrl = `/@${slug}`;

  // 3. Ambil sisa query pencarian terakhir
  const saved = localStorage.getItem("ordernow_last_query");
  if (!saved) return baseUrl;

  try {
    const q = JSON.parse(saved);
    const params = new URLSearchParams();

    // 4. Bangun parameter HANYA JIKA nilainya valid / tidak kosong
    if (q.search) {
      params.append('search', q.search);
    }
    if (Array.isArray(q.categories) && q.categories.length > 0) {
      params.append('categories', q.categories.join(","));
    }
    if (Array.isArray(q.brands) && q.brands.length > 0) {
      params.append('brands', q.brands.join(","));
    }
    
    // Pertahankan pagination dan sorting jika ada
    params.append('per_page', String(q.per_page ?? 20));
    params.append('sort_by', q.sort_by ?? "name");
    params.append('sort_direction', q.sort_direction ?? "asc");
    params.append('page', String(q.page ?? 1));

    const queryString = params.toString();
    
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;

  } catch (error) {
    // Jika ada error saat membaca localStorage, buang semua query dan arahkan ke base url bersih
    return baseUrl;
  }
});


// ========= WHATSAPP DROPDOWN =========
const showWaMenu = ref(false);

function toggleWaMenu() {
  showWaMenu.value = !showWaMenu.value;
}

function closeWaMenu() {
  showWaMenu.value = false;
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative')) {
    showWaMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});


</script>


<template>
  <Head :title="`${product.name}`" />

  <div class="min-h-screen bg-white dark:bg-black pb-20">
    <div class="grid grid-cols-1 md:grid-cols-2">

      <!-- ========= IMAGE AREA ========= -->
      <div>
        <div class="relative w-full aspect-square bg-accent overflow-hidden">

          <!-- Back button -->
          <a
            href="javascript:history.back()"
            class="absolute top-3 left-3 z-20 bg-black/30 text-white p-2 rounded-full backdrop-blur"
          >
            <ArrowLeft/>
          </a>

          <!-- Single image -->
          <img
            v-if="product.images?.length === 1"
            :src="previewUrl(product.images[0])"
            class="w-full aspect-square object-cover cursor-pointer"
            @click="openFullscreen(product.images[0])"
          />

          <!-- Slider -->
          <div
            v-else-if="product.images?.length > 1"
            class="relative w-full h-full"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <div
              class="flex transition-transform duration-500"
              :style="{ transform: `translateX(-${current * 100}%)` }"
            >
              <div
                v-for="(img, i) in product.images"
                :key="i"
                class="w-full flex-shrink-0"
              >
                <img
                  :src="previewUrl(img)"
                  class="w-full aspect-square object-cover cursor-pointer"
                  @click="openFullscreen(img)"
                />
              </div>
            </div>

            <!-- Prev/Next -->
            <button
              @click="prev"
              class="absolute left-2 top-1/2 -translate-y-1/2 text-white p-1 rounded-full"
            >
              <ChevronLeft/>
            </button>
            <button
              @click="next"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-white p-1 rounded-full"
            >
              <ChevronRight/>
            </button>

            <!-- Dots -->
            <div class="absolute bottom-2 w-full flex justify-center gap-1">
              <div
                v-for="(img, i) in product.images"
                :key="'dot-'+i"
                class="w-2 h-2 rounded-full"
                :class="{ 'bg-white': current === i, 'bg-white/40': current !== i }"
              />
            </div>
          </div>

          <!-- No image -->
          <div
            v-else
            class="text-sm text-slate-400 w-full aspect-square flex items-center justify-center"
          >
            No Image
          </div>
        </div>
      </div>

      <!-- ========= INFO + DESKRIPSI ========= -->
      <div class="space-y-4">
        <!-- Harga -->
        <div class="px-4 space-y-3 border-b-4 dark:border-gray-800 pb-4">
          <p class="text-3xl font-bold text-blue-600 mt-4">
            {{ formatCurrency(product.price) }} <span :class="product.strikethroughprice > product.price ? 'px-2 rounded-md text-base line-through text-blue-600/50' : 'hidden' " class="">{{ formatCurrency(product.strikethroughprice) }}</span>
          </p>

          <p class="text-xl font-semibold flex items-center gap-1">
            <span :class="product.is_featured ? 'bg-green-400 px-2 rounded-md text-base' : 'hidden' " class="">{{ product.is_featured ? "TOP" : "" }}</span>
            {{ product.name }}
          </p>

          <p v-if="variants.length > 1" class="">
            <span class="text-sm text-gray-600 dark:text-gray-400 py-1 px-2 border border-gray-300 dark:border-gray-700 rounded-lg">{{ product.variant || "-" }}</span>
          </p>
        </div>

        <!-- VARIANT YANG satu GROUP dalam PRODUCT -->
        <div
          v-if="Array.isArray(variants) && variants.length > 1"
          class="pb-4 border-b-4 dark:border-gray-800"
        >
          <h2 class="font-semibold px-4 mb-2">Varian Produk</h2>

          <div class="flex flex-wrap gap-2 px-4">
            <Link
              v-for="v in variants"
              :key="v.id"
              :href="`/product/${v.slug ?? v.id}`"
              class="px-3 py-1 rounded-lg border text-sm"
              :class="{
                'bg-blue-600 text-white border-blue-600': v.id === product.id,
                'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700': v.id !== product.id
              }"
            >
              {{ v.variant || v.name }}
            </Link>
          </div>
        </div>
                
        <!-- TILE RATING | STOK | PROMO -->
        <div class="pb-4 border-b-4 dark:border-gray-800">
          <div class="flex justify-center text-center gap-2 mx-4">
            <!-- Rating (SELALU MUNCUL) -->
            <div class="text-amber-400 my-4 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 w-full">
              <p class="text-xs">Rating</p>
              <p class="text-lg font-semibold">⭐ {{ product.rating ?? '4.5' }}</p>
            </div>

            <!-- Stok (HIDDEN JIKA jasa ATAU in_stock = false) -->
            <div
              v-if="showStock && product.in_stock === true"
              class="text-green-600 my-4 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 w-full"
            >
              <p class="text-xs">Stok</p>
              <p class="text-lg font-semibold">📦 {{ product.stock ?? 0 }}</p>
            </div>

            <!-- Promo -->
            <div
              v-if="product.is_promo === true"
              class="text-blue-500 my-4 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 w-full"
            >
              <p class="text-xs">Promo</p>
              <p class="text-sm font-semibold">🏷️ Ya</p>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="px-4 space-y-1 border-b-4 dark:border-gray-800 pb-4">
          
          <Link :href="`/${product.branch?.partner?.slug}`" class="flex border px-4 py-3 gap-2 rounded-lg mb-4 items-center">
            <div class="grow-0 "><Store/></div>
            <div class="flex justify-between items-center grow">
              <span>{{ product.branch?.name || "-" }}</span>
              <!-- STATUS ADMIN BRANCH -->
              <div
                class="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium"
                :class="hasOnlineAdmin
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-500'"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="hasOnlineAdmin ? 'bg-green-500' : 'bg-gray-400'"
                ></span>

                <span>
                  {{ hasOnlineAdmin ? 'Online' : 'Offline' }}
                </span>
              </div>

            </div>
          </Link>

          <h2 class="font-semibold mb-1">Info Produk</h2>

          <div class="flex items-end justify-between text-sm mx-2">
            <span class="text-foreground pr-1">Kategori</span>
            <div class="flex-grow border-b border-dotted border-gray-300 mb-1 mx-1"></div>
            <span class="text-end pl-1">
              {{ product.categories && product.categories.length
              ? product.categories.map(c => c.name).join(', ')
              : '-' }}
            </span>
          </div>

          <div class="flex items-end justify-between text-sm mx-2">
            <span class="text-foreground pr-1">Merk</span>
            <div class="flex-grow border-b border-dotted border-gray-300 mb-1 mx-1"></div>
            <span class="text-end pl-1">{{ product.brand?.name || "-" }}</span>
          </div>

          <div class="flex items-end justify-between text-sm mx-2">
            <span class="text-foreground pr-1">Berat</span>
            <div class="flex-grow border-b border-dotted border-gray-300 mb-1 mx-1"></div>
            <span class="text-end pl-1">{{ formatNumber(product.weight) }} kg</span>
          </div>

          <div v-if="product.unit_name" class="flex items-end justify-between text-sm mx-2">
            <span class="text-foreground pr-1">Satuan</span>
            <div class="flex-grow border-b border-dotted border-gray-300 mb-1 mx-1"></div>
            <span class="text-end pl-1">{{ product.unit_name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Deskripsi -->
    <div class="space-y-2 border-b-4 dark:border-gray-800 my-4 pb-4 px-4">
      <h2 class="font-semibold">Deskripsi</h2>
      <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {{ product.description || "-" }}
      </p>
    </div>

    <!-- ========= PRODUK TERKAIT ========= -->
    <div class="py-4 space-y-3">


      <h2 class="font-semibold px-4">Lihat juga produk lain</h2>

      <div
        v-if="relatedProducts && relatedProducts.length"
        class="flex items-start gap-4 overflow-x-auto pb-3 px-4"
      >
        <template v-for="item in relatedProducts" :key="item.id">
          <div
            class="w-44 flex-none min-w-[11rem] bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 flex flex-col"
          >
            <img
              v-if="item.images && item.images.length"
              :src="previewUrl(item.images[0])"
              class="w-full aspect-square object-cover rounded-t-lg"
            />

            <div
              v-else
              class="w-full aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-slate-400 text-sm rounded-t-lg"
            >
              No Image
            </div>

            <div class="p-2 space-y-1 relative">
              <!-- biarkan tinggi mengikuti text -->
              <p class="text-sm font-medium">
                {{ item.name }}
              </p>

              <p class="text-sm font-bold text-green-600">
                {{ formatCurrency(item.price) }}
              </p>

              <Link
                :href="`/product/${item.slug ?? item.id}`"
                class="text-xs text-blue-500 hover:underline absolute right-2.5 bottom-2"
              >
                <Link2 class="size-5" />
              </Link>
            </div>
          </div>
        </template>
        
      </div>

      <p v-else class="text-sm text-gray-500 dark:text-gray-400 px-4">
        Tidak ada produk terkait.
      </p>
    </div>

<!-- ========= BOTTOM ACTION BAR ========= -->
<div
  class="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)]"
>
  <div class="flex items-center gap-2 px-3 py-2 md:max-w-xl mx-auto">

    <!-- Cart -->
    <Link
      :href="orderNowHref"
      class="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700 active:scale-95"
    >
      <ShoppingBasket class="size-6" />

      <!-- contoh badge -->
      <span
        v-if="totalQtyInCart > 0"
        class="absolute -top-1 -left-1 h-5 min-w-[20px] rounded-full bg-red-600 px-1 text-xs text-white flex items-center justify-center"
      >
        {{ totalQtyInCart }}
      </span>
    </Link>

    <!-- MAIN ACTION -->

    <div v-if="product.in_stock === false" class="flex-1">

      <!-- Jika qty = 0 -->
      <button
        class="h-12 w-full rounded-xl bg-red-500 text-white text-base font-semibold active:scale-[0.99]"
      >
        Habis
      </button>

    </div>

    <div v-else class="flex-1">

      <!-- Jika qty = 0 -->
      <button
        v-if="itemQty === 0"
        @click="addToCart"
        class="h-12 w-full rounded-xl bg-foreground text-background text-base font-semibold active:scale-[0.99]"
      >
        + ke Keranjang
      </button>

      <!-- Jika qty > 0 -->
      <div
        v-else
        class="flex h-12 items-center justify-between rounded-xl bg-foreground text-background"
      >
        <!-- Minus -->
        <button
          @click="decreaseQty"
          class="h-full px-4 flex items-center justify-center active:bg-red-400 rounded-l-xl"
        >
          <Minus class="size-5" />
        </button>

        <!-- Qty -->
        <input
          type="number"
          min="1"
          :value="itemQty"
          @input="updateQty"
          class="w-full bg-transparent text-center text-lg font-semibold focus:outline-none"
        />

        <!-- Plus -->
        <button
          @click="addToCart"
          class="h-full px-4 flex items-center justify-center active:bg-blue-500 rounded-r-xl"
        >
          <Plus class="size-5" />
        </button>
      </div>
    </div>

    <!-- WhatsApp DROPDOWN -->
    <div class="relative">
      <!-- TOGGLE BUTTON -->
      <button
        @click="toggleWaMenu"
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white active:scale-95"
      >
        <MessageCircleMore class="size-6" />
      </button>

      <!-- DROPDOWN MENU -->
      <transition
        enter-active-class="transition ease-out duration-150"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="showWaMenu"
          class="absolute bottom-14 right-0 w-70 rounded-xl bg-white dark:bg-gray-900 border shadow-lg overflow-hidden z-50"
        >
          <!-- Tanya Produk -->
          <a
            :href="`https://wa.me/62${product.branch.phone}?text=Saya%20ingin%20bertanya%20tentang%20produk%20ini%20:%0A${product.name}%0Adapatin.id/product/${product.slug}`"
            target="_blank"
            @click="closeWaMenu"
            class="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LucideMessageCircleQuestion class="size-4 text-green-600" />
            <span>Tanyakan produk ini ke penjual</span>
          </a>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- Laporkan Produk -->
          <a
            :href="`https://wa.me/6289684561000?text=Saya%20ingin%20melaporkan%20produk%20berikut:%0A${product.name}%20milik%20store%20${product.branch.name}%0Adapatin.id/product/${product.slug}`"
            target="_blank"
            @click="closeWaMenu"
            class="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <MessageCircleWarning class="size-4" />
            <span>Laporkan produk ke admin</span>
          </a>
        </div>
      </transition>
    </div>


  </div>
</div>


  </div>

  <!-- ========= FULLSCREEN MODAL ========= -->
  <div
    v-if="fullscreenImage"
    class="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 overflow-auto"
    @click.self="closeFullscreen"
  >
    <button
      class="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full"
      @click="closeFullscreen"
    >
      <X size="24" />
    </button>

    <img
      :src="fullscreenImage"
      class="w-full max-w-full object-contain"
      :style="{ maxHeight: deviceHeight * 2 + 'px' }"
    />
  </div>
</template>
