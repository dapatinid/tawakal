<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Expand, Shrink } from 'lucide-vue-next';

// State reaktif untuk melacak apakah sedang dalam mode fullscreen
const isFullscreen = ref(false);

/**
 * Fungsi utilitas untuk memeriksa status fullscreen di browser (cross-browser).
 * Menggunakan casting untuk menenangkan TypeScript terkait vendor prefix.
 */
function getFullscreenStatus(): boolean {
    const doc = document as any; // Casting document ke 'any' untuk mengakses vendor prefix
    
    // Cek semua vendor prefix: standar, webkit, moz, ms
    return !!(doc.fullscreenElement || 
              doc.webkitFullscreenElement || 
              doc.mozFullScreenElement || 
              doc.msFullscreenElement);
}

/**
 * Handler utama untuk event perubahan status fullscreen dari browser.
 * Fungsi inilah yang memastikan state Vue sinkron dengan browser.
 */
function handleFullscreenChange() {
    // Perbarui state reaktif berdasarkan status yang dibaca
    isFullscreen.value = getFullscreenStatus();
    console.log('Fullscreen status changed:', isFullscreen.value); // Debugging
}


/**
 * Fungsi untuk mengalihkan mode fullscreen.
 */
function toggleFullscreen() {
    const currentStatus = getFullscreenStatus(); // Cek status saat ini

    if (currentStatus) {
        // Keluar dari mode fullscreen
        const doc = document as any;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) { 
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) { 
            doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) { 
            doc.msExitFullscreen();
        }
    } else {
        // Masuk ke mode fullscreen
        const docElm = document.documentElement as any;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullscreen) {
            docElm.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    }
}

// 2. Pasang event listener saat komponen dipasang (mounted)
onMounted(() => {
    // 💡 Pasang listener standar dan semua vendor prefix
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange); // Perhatikan huruf besar untuk MS

    // 💡 Inisialisasi status awal (untuk kasus refresh halaman)
    isFullscreen.value = getFullscreenStatus();
});

// 3. Bersihkan event listener saat komponen dilepas (unmounted)
onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});
</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-md bg-background text-sidebar-primary"
    >
        <AppLogoIcon class="size-5 fill-current text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-sm">
        <span class="mb-0.5 truncate leading-tight font-semibold"
            >UD.Tawakal</span
        >
    </div>
    <span
            @click="toggleFullscreen" 
            style="cursor: pointer;" 
            :title="isFullscreen ? 'Exit Fullscreen (Esc/F11)' : 'Enter Fullscreen (F11)'"
            class="mr-2 hover:text-yellow-500"
        >
            <Shrink v-if="isFullscreen" class="size-4"/> 
            <Expand v-else class="size-4"/> 
    </span>
</template>

