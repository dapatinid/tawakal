<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { router, Link, Head } from "@inertiajs/vue3";
import axios from "axios"; // Pastikan axios terinstall
import { 
  ShoppingBasket, 
  SlidersHorizontal, 
  Store, 
  Search,
  Sun, 
  Moon, 
  SpellCheck, 
  Expand, 
  Shrink, 
  LogIn,
  MoreVertical,
  Loader2
} from "lucide-vue-next";
import { useAppearance } from '@/composables/useAppearance';
import { onBeforeUnmount } from "vue";

const props = defineProps({
  products: Object,
  search: { type: String, default: "" },
  categories: Array,
  brands: Array,
  stores: Array,
});

const searchInput = ref(props.search || "");
const filterOpen = ref(false);
const selectedCategories = ref<number[]>([]);
const selectedBrands = ref<number[]>([]);
const menuOpen = ref(false);

// --- State Khusus Infinite Scroll ---
const localProducts = ref([]);
const nextPageUrl = ref(null);
const isLoadingMore = ref(false);
const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// 👇 TAMBAHKAN KODE INI 👇
// Memecah array produk menjadi dua untuk masonry mobile agar tidak ada re-flow layout
const mobileCol1 = computed(() => localProducts.value.filter((_, index) => index % 2 === 0));
const mobileCol2 = computed(() => localProducts.value.filter((_, index) => index % 2 !== 0));
// 👆 ------------------- 👆

// Sinkronisasi data lokal jika user melakukan pencarian / reset filter dari nol
watch(() => props.products, (newProducts) => {
  localProducts.value = [...newProducts.data];
  nextPageUrl.value = newProducts.next_page_url;
}, { deep: true });

// Fungsi utama mengambil halaman produk berikutnya
// Fungsi utama mengambil halaman produk berikutnya
async function loadMoreProducts() {
  if (isLoadingMore.value || !nextPageUrl.value) return;

  isLoadingMore.value = true;
  try {
    const response = await axios.get(nextPageUrl.value, {
      headers: { 'X-Infinitemarketplace': 'true' }
    });
    
    if (response.data && response.data.data) {
      // 1. Catat posisi scroll terkini sebelum merender data baru
      const currentScrollY = window.scrollY;

      // 2. Satukan produk lama dengan produk baru hasil fetch
      localProducts.value.push(...response.data.data);
      nextPageUrl.value = response.data.next_page_url;

      // 3. Tunggu Vue selesai merender elemen HTML yang baru ke layar
      await nextTick();

      // 4. Paksa posisi scroll kembali persis ke titik sebelum render
      window.scrollTo({
        top: currentScrollY,
        behavior: 'instant' // Penting: Gunakan instant agar tidak ada animasi meluncur yang terasa seperti 'melompat'
      });
    }
  } catch (error) {
    console.error("Gagal memuat produk tambahan:", error);
  } finally {
    isLoadingMore.value = false;
  }
}

// --- Logika Manajemen Tema ---
const { appearance, updateAppearance } = useAppearance();
function toggleAppearance() {
  const current = appearance.value;
  const next = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
  updateAppearance(next);
}

// --- Logika Layar Penuh ---
const isFullscreen = ref(false);
function getFullscreenStatus() {
  const doc: any = document;
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
}
function handleFullscreenChange() { isFullscreen.value = getFullscreenStatus(); }
function toggleFullscreen() {
  const doc: any = document;
  if (getFullscreenStatus()) {
    if (doc.exitFullscreen) doc.exitFullscreen();
  } else {
    const el: any = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  }
}

// --- Filter & Search Route Handling ---
const orderNowHref = computed(() => {
  const slug = localStorage.getItem("ordernow_selected_store_slug");
  return slug ? `/@${slug}` : "/welcome";
});

function applyFilters() {
  router.get('/', {
    search: searchInput.value,
    categories: selectedCategories.value.join(","),
    brands: selectedBrands.value.join(","),
  }, {
    preserveScroll: true,
    preserveState: true,
    replace: true,
  });
}

let timeout: any = null;
const debouncedSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => { applyFilters(); }, 600); // Dipercepat ke 600ms agar terasa snappy
};

function toggleCategory(id: number) {
  const idx = selectedCategories.value.indexOf(id);
  idx > -1 ? selectedCategories.value.splice(idx, 1) : selectedCategories.value.push(id);
  applyFilters();
}

function toggleBrand(id: number) {
  const idx = selectedBrands.value.indexOf(id);
  idx > -1 ? selectedBrands.value.splice(idx, 1) : selectedBrands.value.push(id);
  applyFilters();
}

function previewUrl(path?: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `/storage/${path}`;
}

function formatPrice(v: any) {
  return Number(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// --- Lifecycle Mount Observer ---


// Mengatur inisialisasi data (Mengecek cache sessionStorage terlebih dahulu)
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  isFullscreen.value = getFullscreenStatus();

  // 1. Coba pulihkan data produk dan posisi scroll dari session storage
  const savedProducts = sessionStorage.getItem("marketplace_products");
  const savedNextUrl = sessionStorage.getItem("marketplace_next_url");
  const savedScroll = sessionStorage.getItem("marketplace_scroll");

  if (savedProducts && savedNextUrl) {
    localProducts.value = JSON.parse(savedProducts);
    nextPageUrl.value = savedNextUrl;
    
    // Kembalikan posisi scroll setelah DOM selesai merender seluruh produk cache
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo(0, Number(savedScroll || 0));
      }, 50); // Beri micro-delay kecil agar masonry columns selesai menghitung tinggi card
    });
  } else {
    // Jika tidak ada cache (berarti akses pertama kali atau abis reload), ambil dari props
    localProducts.value = [...props.products.data];
    nextPageUrl.value = props.products.next_page_url;
  }

  // 2. Jalankan Detektor Scroll Otomatis (Intersection Observer)
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreProducts();
    }
  }, { rootMargin: '400px' }); // Ditingkatkan ke 400px agar lebih sigap memuat data

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});

// Rekam kondisi terkini tepat sebelum user meninggalkan halaman utama menuju detail produk
onBeforeUnmount(() => {
  sessionStorage.setItem("marketplace_products", JSON.stringify(localProducts.value));
  sessionStorage.setItem("marketplace_next_url", nextPageUrl.value || "");
  sessionStorage.setItem("marketplace_scroll", String(window.scrollY));

  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value);
  }
});

// Sinkronisasi data JIKA user mengetik search bar atau mengubah filter kategori/brand dari nol
watch(() => props.products, (newProducts) => {
  // Jika ini adalah hasil filter/pencarian baru (bukan load halaman berikutnya), reset cache storage
  const params = new URLSearchParams(window.location.search);
  if (params.get('search') || params.get('categories') || params.get('brands')) {
    sessionStorage.removeItem("marketplace_products");
    sessionStorage.removeItem("marketplace_next_url");
    sessionStorage.removeItem("marketplace_scroll");
  }
  
  localProducts.value = [...newProducts.data];
  nextPageUrl.value = newProducts.next_page_url;
}, { deep: true });
</script>

<template>
  <Head title="Marketplace - Selamat Datang" />

  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-foreground">
    <div class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b p-3 sm:p-4 shadow-sm text-gray-900 dark:text-white transition-colors duration-300">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-4">
        
        <div class="flex items-center flex-shrink-0">
            <Link href="/welcome" class="flex items-center select-none">
            <div class="size-10">
               <span class="size-9"><AppLogoIcon /></span>
            </div>
            <span class="-ms-1 text-xl font-extrabold tracking-tight hidden sm:block">
                apatin.id
            </span>
            </Link>
        </div>

        <div class="flex-1 flex items-center gap-2 max-w-2xl mx-auto w-full">
            <Link 
            :href="orderNowHref" 
            class="p-2 border dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative flex-shrink-0 transition-colors duration-200"
            title="Keranjang Belanja"
            >
            <ShoppingBasket class="size-5" />
            </Link>

            <div class="flex-1 relative flex items-center w-full">
            <Search class="absolute left-3 size-4 text-gray-400 pointer-events-none" />
            
            <input
                v-model="searchInput"
                @input="debouncedSearch"
                type="text"
                placeholder="Cari..."
                class="w-full pl-9 pr-10 py-2 border rounded-full text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
            
            <button 
                @click="filterOpen = true" 
                type="button"
                class="absolute right-2.5 p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Buka Filter"
            >
                <SlidersHorizontal class="size-4" />
            </button>
            </div>
        </div>

          <div class="relative flex items-center flex-shrink-0">
            
            <button 
              @click="menuOpen = !menuOpen"
              type="button"
              class="sm:hidden text-gray-700 dark:text-gray-300"
              title="Buka Menu Akses"
            >
              <MoreVertical class="size-5" />
            </button>

            <div 
              v-if="menuOpen || true"
              :class="[
                menuOpen ? 'grid grid-cols-2 gap-2 absolute top-12 right-0 w-36 bg-white dark:bg-gray-900 border dark:border-gray-800 p-2 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200' : 'hidden',
                'sm:flex sm:static sm:flex-row sm:items-center sm:gap-1.5 sm:p-0 sm:w-auto sm:bg-transparent sm:border-none sm:shadow-none sm:z-auto'
              ]"
            >
              <button
                @click="toggleAppearance"
                class="p-2 border dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center w-full"
                title="Ubah Tampilan Mode"
              >
                <SpellCheck v-if="appearance === 'system'" class="size-4.5" />
                <Sun v-else-if="appearance === 'light'" class="size-4.5" />
                <Moon v-else class="size-4.5" />
              </button>    
              
              <button
                @click="toggleFullscreen"
                class="p-2 border dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center w-full"
                :title="isFullscreen ? 'Keluar Fullscreen' : 'Masuk Fullscreen'"
              >
                <Shrink v-if="isFullscreen" class="size-4.5" />
                <Expand v-else class="size-4.5" />
              </button>        

              <Link 
                href="/login" 
                @click="menuOpen = false"
                class="p-2 text-xs font-semibold rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 col-span-2 sm:col-auto"
              >
                <LogIn class="size-4.5" />
                <span class="sm:hidden text-[11px]">Masuk</span>
              </Link>
            </div>

          </div>        

        </div>
    </div>

    <div class="p-2 sm:p-4 xl:px-20 xl:py-4 bg-linear-to-br from-blue-100 via-white to-red-100 dark:from-blue-950 dark:via-gray-900 dark:to-red-950 from-10% to-90%" style="overflow-anchor: none;">

<!-- 🖥️ TAMPILAN DESKTOP (Grid Standard) - Disembunyikan di Mobile -->
      <div class="hidden sm:grid sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <div 
            v-for="p in localProducts" 
            :key="p.id" 
            class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-auto"
          >
            <!-- Komponen Card Anda (Tetap sama) -->
            <Link :href="`/product/${p.slug ?? p.id}`" class="block w-full">
                <div class="flex justify-center bg-zinc-50 dark:bg-zinc-900 rounded-t-xl overflow-hidden w-full">
                  <img v-if="p.images?.length > 0" :src="previewUrl(p.images[0])" class="w-full aspect-square object-cover" />
                  <div v-else class="text-sm text-slate-400 w-full aspect-square text-center pt-[calc(46%)] select-none">No Image</div>
                </div>
                <div class="p-3 pb-2">
                  <div class="flex gap-1 mb-1">
                    <span v-if="p.is_featured === true" class="text-[10px] px-2 py-[1px] rounded font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">TOP</span>
                    <span v-if="p.is_promo === true" class="text-[10px] px-2 py-[1px] rounded font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">PROMO</span>
                  </div>
                  <h3 class="font-medium text-xs line-clamp-2 text-gray-800 dark:text-gray-200">{{ p.name }}</h3>
                  <div class="text-sm mt-1 text-gray-900 dark:text-white font-semibold"><span class="text-xs font-normal">Rp</span>{{ formatPrice(p.price) }}</div>
                </div>
            </Link>
            <div class="px-3 pb-3">
                <div class="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 pt-1.5 border-t border-gray-50 dark:border-gray-800/30">
                  <Store class="size-3 flex-shrink-0 text-blue-500" />
                  <span class="truncate" :title="p.branch?.name">{{ p.branch?.name }}</span>
                </div>
            </div>
          </div>
      </div>

      <!-- 📱 TAMPILAN MOBILE (Masonry Flex) - Disembunyikan di Desktop -->
      <div class="flex items-start gap-1.5 sm:hidden">
        
        <!-- Kolom Kiri -->
        <div class="flex-1 flex flex-col gap-1.5 w-1/2">
          <div 
            v-for="p in mobileCol1" 
            :key="'m1-'+p.id" 
            class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-auto w-full"
          >
            <!-- Isi dari Card persis sama dengan atas -->
            <Link :href="`/product/${p.slug ?? p.id}`" class="block w-full">
                <div class="flex justify-center bg-zinc-50 dark:bg-zinc-900 rounded-t-xl overflow-hidden w-full">
                  <img v-if="p.images?.length > 0" :src="previewUrl(p.images[0])" class="w-full max-h-72 object-cover" />
                  <div v-else class="text-sm text-slate-400 w-full aspect-square text-center pt-[calc(46%)] select-none">No Image</div>
                </div>
                <div class="p-3 pb-2">
                  <div class="flex gap-1 mb-1">
                    <span v-if="p.is_featured === true" class="text-[10px] px-2 py-[1px] rounded font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">TOP</span>
                    <span v-if="p.is_promo === true" class="text-[10px] px-2 py-[1px] rounded font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">PROMO</span>
                  </div>
                  <h3 class="font-medium text-xs line-clamp-2 text-gray-800 dark:text-gray-200">{{ p.name }}</h3>
                  <div class="text-sm mt-1 text-gray-900 dark:text-white font-semibold"><span class="text-xs font-normal">Rp</span>{{ formatPrice(p.price) }}</div>
                </div>
            </Link>
            <div class="px-3 pb-3">
                <div class="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 pt-1.5 border-t border-gray-50 dark:border-gray-800/30">
                  <Store class="size-3 flex-shrink-0 text-blue-500" />
                  <span class="truncate" :title="p.branch?.name">{{ p.branch?.name }}</span>
                </div>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan -->
        <div class="flex-1 flex flex-col gap-1.5 w-1/2">
          <div 
            v-for="p in mobileCol2" 
            :key="'m2-'+p.id" 
            class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-auto w-full"
          >
            <!-- Isi dari Card persis sama dengan atas -->
            <Link :href="`/product/${p.slug ?? p.id}`" class="block w-full">
                <div class="flex justify-center bg-zinc-50 dark:bg-zinc-900 rounded-t-xl overflow-hidden w-full">
                  <img v-if="p.images?.length > 0" :src="previewUrl(p.images[0])" class="w-full max-h-72 object-cover" />
                  <div v-else class="text-sm text-slate-400 w-full aspect-square text-center pt-[calc(46%)] select-none">No Image</div>
                </div>
                <div class="p-3 pb-2">
                  <div class="flex gap-1 mb-1">
                    <span v-if="p.is_featured === true" class="text-[10px] px-2 py-[1px] rounded font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">TOP</span>
                    <span v-if="p.is_promo === true" class="text-[10px] px-2 py-[1px] rounded font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">PROMO</span>
                  </div>
                  <h3 class="font-medium text-xs line-clamp-2 text-gray-800 dark:text-gray-200">{{ p.name }}</h3>
                  <div class="text-sm mt-1 text-gray-900 dark:text-white font-semibold"><span class="text-xs font-normal">Rp</span>{{ formatPrice(p.price) }}</div>
                </div>
            </Link>
            <div class="px-3 pb-3">
                <div class="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 pt-1.5 border-t border-gray-50 dark:border-gray-800/30">
                  <Store class="size-3 flex-shrink-0 text-blue-500" />
                  <span class="truncate" :title="p.branch?.name">{{ p.branch?.name }}</span>
                </div>
            </div>
          </div>
        </div>

      </div>      

      <div ref="loadMoreTrigger" class="w-full flex justify-center py-8 items-center min-h-[4rem]">
        <div v-if="isLoadingMore" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          <Loader2 class="size-5 animate-spin text-blue-500" />
          <span>Memuat produk lainnya...</span>
        </div>
        <div v-else-if="!nextPageUrl && localProducts.length > 0" class="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">
          🎉 Semua produk telah ditampilkan
        </div>
      </div>
    </div>    

    <div v-if="filterOpen" class="fixed inset-0 z-50 flex">
      <div class="absolute inset-0 bg-black/50" @click="filterOpen = false"></div>
      <div class="relative ml-auto bg-white dark:bg-gray-900 w-80 h-full shadow-xl flex flex-col">
        
        <div class="p-4 border-b flex justify-between items-center flex-shrink-0 bg-white dark:bg-gray-900 z-10">
          <div class="flex justify-start items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Filter</h2>

            <button
              v-if="selectedCategories.length > 0 || selectedBrands.length > 0"
              @click="
                selectedCategories = [];
                selectedBrands = [];
                router.get('/', {
                  search: searchInput,
                }, { 
                  preserveScroll: true, 
                  preserveState: true, 
                  replace: true 
                });
              "
              class="py-1 px-2 ms-2 text-xs text-center rounded-md bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-300 font-medium"
            >
              Reset Filter
            </button>
          </div>
          <button @click="filterOpen = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <h3 class="font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Kategori</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="cat in (categories as any)" :key="cat.id" @click="toggleCategory(cat.id)"
                class="px-2.5 py-1 text-xs border rounded-full transition-colors duration-200"
                :class="selectedCategories.includes(cat.id) ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <div>
            <h3 class="font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Merek / Brand</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="b in (brands as any)" :key="b.id" @click="toggleBrand(b.id)"
                class="px-2.5 py-1 text-xs border rounded-full transition-colors duration-200"
                :class="selectedBrands.includes(b.id) ? 'bg-green-500 text-white border-green-500' : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'"
              >
                {{ b.name }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>