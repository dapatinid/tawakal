<script setup lang="ts">
import { dashboard } from '@/routes';
import { Head, Link } from '@inertiajs/vue3';
import { useAppearance } from '@/composables/useAppearance';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { 
  Sun, Moon, SpellCheck, ChevronDown, Expand, Shrink, 
  MapPin, MessageCircle 
} from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const { appearance, updateAppearance } = useAppearance();

function toggleAppearance() {
  const current = appearance.value;
  const next =
    current === 'system'
      ? 'light'
      : current === 'light'
      ? 'dark'
      : 'system';

  updateAppearance(next);
}

// --- Fullscreen State ---
const isFullscreen = ref(false);

function getFullscreenStatus() {
  const doc: any = document;
  return !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
}

function handleFullscreenChange() {
  isFullscreen.value = getFullscreenStatus();
}

function toggleFullscreen() {
  const doc: any = document;

  if (getFullscreenStatus()) {
    if (doc.exitFullscreen) doc.exitFullscreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
    else if (doc.msExitFullscreen) doc.msExitFullscreen();
  } else {
    const el: any = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  isFullscreen.value = getFullscreenStatus();
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});

// --- FAQ State ---
const activeFaq = ref<number | null>(null);

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index;
}

</script>

<template>
  <Head title="UD. Tawakal - Pusat Material Bangunan">
    <link rel="preconnect" href="https://rsms.me/" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  </Head>

  <div class="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950">

    <header class="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm z-50 sticky top-0">
      <Link class="flex flex-nowrap items-center gap-2" :href="'/'">
        <span class="size-8 text-blue-600 dark:text-blue-400"><AppLogoIcon /></span>
        <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Tawakal
        </h1>
      </Link>

      <nav class="flex items-center gap-2.5 text-sm ms-4">
        <button
          @click="toggleAppearance"
          class="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <SpellCheck v-if="appearance === 'system'" class="size-4 text-gray-700 dark:text-gray-300" />
          <Sun v-else-if="appearance === 'light'" class="size-4 text-gray-700 dark:text-gray-300" />
          <Moon v-else class="size-4 text-gray-700 dark:text-gray-300" />
        </button>    
        
        <button
          @click="toggleFullscreen"
          class="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          :title="isFullscreen ? 'Keluar Fullscreen' : 'Masuk Fullscreen'"
        >
          <Shrink v-if="isFullscreen" class="size-4 text-gray-700 dark:text-gray-300" />
          <Expand v-else class="size-4 text-gray-700 dark:text-gray-300" />
        </button>        

        <Link
          v-if="$page.props.auth?.user"
          :href="dashboard()"
          class="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Menu
        </Link>
        <template v-else>
          <Link
            :href="dashboard()"
            class="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Masuk
          </Link>
        </template>
      </nav>
    </header>

    <section class="relative flex flex-col items-center justify-center text-center px-6 py-32 flex-grow min-h-[60vh]">
      <img 
        src="https://plus.unsplash.com/premium_photo-1661962732747-18c93b05292a?w=900&auto=format&fit=crop" 
        alt="Background UD Tawakal"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div class="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm z-10"></div>
      
      <div class="relative z-20 max-w-3xl">
        <h2 class="text-5xl md:text-7xl font-extrabold text-blue-500 drop-shadow-sm leading-tight mb-4">
          UD. TAWAKAL
        </h2>
        <p class="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200">
          Mitra Terpercaya Kebutuhan Konstruksi & Interior Anda.
        </p>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-6 py-20 border-t border-gray-100 dark:border-gray-800">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Tentang Kami</h3>
        <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          <strong class="text-gray-900 dark:text-white">UD. Tawakal</strong> adalah toko spesialis bahan bangunan yang berfokus pada penyediaan material berkualitas tinggi untuk proyek Anda. Kami menyediakan produk unggulan yang meliputi <strong>Alumunium Extrusion, Kaca, Alumunium Composite Panel (ACP), dan berbagai Aksesoris</strong>. 
        </p>
        <p class="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          Kami mengedepankan kepuasan pelanggan dengan pelayanan yang cepat, proses order yang mudah, ketersediaan stok yang selalu terjaga, serta kemudahan logistik di mana seluruh proses pengiriman kami yang mengurus hingga sampai ke lokasi Anda dengan aman.
        </p>
      </div>
    </section>

    <section class="bg-gray-50 dark:bg-gray-950 px-6 py-20">
      <div class="max-w-6xl mx-auto">
        <h3 class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Produk Unggulan Kami</h3>
        
        <div class="flex flex-col md:flex-row gap-6 justify-center">
          
          <div class="flex-1 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
            <img src="https://shopcdnpro.grainajz.com/639/upload/product/45efaca0442909a387918739ef8e7aa3ff6052b8d36fa1da5f3af96108ed7b85.jpg" alt="Alumunium Extrusion" class="w-full h-48 object-cover" />
            <div class="p-5 text-center">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">Alumunium Extrusion</h4>
            </div>
          </div>

          <div class="flex-1 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
            <img src="https://images.unsplash.com/photo-1603433828270-600fc33d0d68?q=80&w=1548&auto=format&fit=crop" alt="Kaca" class="w-full h-48 object-cover" />
            <div class="p-5 text-center">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">Macam Macam Kaca</h4>
            </div>
          </div>

          <div class="flex-1 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
            <img src="https://www.pasangaluminiumkaca.com/wp-content/uploads/2023/02/acp-yang-sudah-berwarna-600x600.png" alt="ACP" class="w-full h-48 object-cover" />
            <div class="p-5 text-center">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">Alu. Composite Panel</h4>
            </div>
          </div>

          <div class="flex-1 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
            <img src="https://sc04.alicdn.com/kf/Hb6cf3fbecf4f4e32b95ea784a21b6e97w.jpg" alt="Aksesoris" class="w-full h-48 object-cover" />
            <div class="p-5 text-center">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">Aksesoris dan Komponen</h4>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-900 px-6 py-20 border-t border-gray-100 dark:border-gray-800">
      <div class="max-w-3xl mx-auto">
        <h3 class="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Sering Ditanyakan
        </h3>
        <div class="space-y-4">

          <div class="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
            <button
              @click="toggleFaq(1)"
              class="w-full flex justify-between items-center px-5 py-4 text-left"
            >
              <span class="font-medium text-gray-900 dark:text-white">
                Apakah melayani pengiriman ke luar kota?
              </span>
              <ChevronDown
                class="size-5 text-gray-600 dark:text-gray-400 transition-transform duration-300"
                :class="activeFaq === 1 ? 'rotate-180' : ''"
              />
            </button>
            <div
              v-show="activeFaq === 1"
              class="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm"
            >
              Ya, tim kami yang akan mengurus seluruh proses pengiriman. Kami melayani pengiriman ke berbagai area sesuai kesepakatan. Silakan hubungi admin kami untuk detail lebih lanjut.
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
            <button
              @click="toggleFaq(2)"
              class="w-full flex justify-between items-center px-5 py-4 text-left"
            >
              <span class="font-medium text-gray-900 dark:text-white">
                Bagaimana cara melakukan pemesanan (order)?
              </span>
              <ChevronDown
                class="size-5 text-gray-600 dark:text-gray-400 transition-transform duration-300"
                :class="activeFaq === 2 ? 'rotate-180' : ''"
              />
            </button>
            <div
              v-show="activeFaq === 2"
              class="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm"
            >
              Pemesanan sangat mudah. Anda cukup menghubungi nomor WhatsApp kami yang tertera di bagian kontak, sebutkan spesifikasi dan jumlah barang yang dibutuhkan, dan admin kami akan langsung merespons.
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
            <button
              @click="toggleFaq(3)"
              class="w-full flex justify-between items-center px-5 py-4 text-left"
            >
              <span class="font-medium text-gray-900 dark:text-white">
                Apakah barang selalu ready stock?
              </span>
              <ChevronDown
                class="size-5 text-gray-600 dark:text-gray-400 transition-transform duration-300"
                :class="activeFaq === 3 ? 'rotate-180' : ''"
              />
            </button>
            <div
              v-show="activeFaq === 3"
              class="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm"
            >
              Ya, UD. Tawakal berkomitmen menjaga ketersediaan stok agar Anda tidak perlu menunggu lama untuk mendapatkan material yang dibutuhkan (terutama untuk merk dan spesifikasi standar).
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="bg-gray-50 dark:bg-gray-950 px-6 py-20">
      <div class="max-w-5xl mx-auto">
        <h3 class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Hubungi Kami
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-stretch">

          <div class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
            <div class="p-4 bg-green-50 dark:bg-green-900/30 rounded-full mb-4">
              <MessageCircle class="size-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 class="font-bold text-lg text-gray-900 dark:text-white mb-2">WhatsApp</h4>
            <a href="https://wa.me/6287811112222" target="_blank" class="text-xl font-bold text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition">
              087811112222
            </a>
          </div>
          
          <div class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
              <MapPin class="size-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Lokasi Toko</h4>
            <p class="text-gray-600 dark:text-gray-400">Jl. Raya Weleri Timur, depan POM Bensin Weleri</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden min-h-[250px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d256.5836338339758!2d110.0790388632444!3d-6.965520970437175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7043e4c524666b%3A0x55b54c530463faa8!2sTawakal%20Aluminium%20Weleri!5e0!3m2!1sid!2sid!4v1784911634756!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style="border:0; min-height: 250px;" 
              allowfullscreen="true" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

        </div>
      </div>
    </section>

    <footer class="text-center py-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium">
      2026 ~ UD.TAWAKKAL.COM
    </footer>

  </div>
</template>