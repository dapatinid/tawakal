<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { ref, computed, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import { ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

const props = defineProps({
    products: Object,
    queuedProducts: Array,
    categories: Array,
    brands: Array,
    filters: Object
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Produk', href: `/produk` },
    { title: 'Bulk Price Alumunium', href: `/produk/bulk-price-alumunium` },
];

const selectedIds = ref([]);
const showDialog = ref(false);
const showLogDialog = ref(false);
const selectedProductLog = ref(null);

// State untuk Ubah Cost (1) - Hanya Harga per Kg
const costPerKgValue = ref(0);

// State untuk Ubah Price (2)
const priceReference = ref('cost'); 
const priceMode = ref('percentage');
const priceValue = ref(0);

const openLogDialog = (item: any) => {
    selectedProductLog.value = item;
    showLogDialog.value = true;
};
const closeLogDialog = () => {
    showLogDialog.value = false;
    selectedProductLog.value = null;
};

// Filter state & watcher
const search = ref(props.filters.search || '');
const category = ref(props.filters.category || '');
const brand = ref(props.filters.brand || '');

watch([search, category, brand], debounce((newValues) => {
    router.get('/produk/bulk-price-alumunium', {
        search: newValues[0] || undefined,
        category: newValues[1] || undefined,
        brand: newValues[2] || undefined
    }, { preserveState: true, preserveScroll: true, replace: true });
}, 500));

const selectAll = computed({
    get: () => {
        const dataLength = props.products?.data?.length || 0;
        return selectedIds.value.length === dataLength && dataLength > 0;
    },
    set: (val) => {
        if (val) selectedIds.value = props.products?.data.map((p: any) => p.id);
        else selectedIds.value = [];
    }
});

const addToQueue = () => {
    if (!selectedIds.value.length) return;
    router.post('/produk/bulk-queue-alumunium', { ids: selectedIds.value }, {
        preserveScroll: true,
        onSuccess: () => {
            selectedIds.value = [];
            showDialog.value = true;
        }
    });
};

// Kalkulasi Cost Khusus Alumunium (Rp/Kg x Berat Total)
const calculateCostPreview = (q: any) => {
    const currentCost = Number(q.cost || 0);
    const val = Number(costPerKgValue.value || 0);
    
    // Jika input 0, maka tidak ada perubahan
    if (val === 0) return currentCost;

    // Ambil nilai berat produk
    const weight = Number(q.weight || 1); 
    
    // RUMUS FIX: Harga/Kg x Berat Profil
    return val * weight;
};

// Kalkulasi Price berdasarkan acuan terpilih
const calculatePricePreview = (q: any) => {
    const currentPrice = Number(q.price || 0);
    const val = Number(priceValue.value || 0);
    if (val === 0) return currentPrice;

    const baseValue = priceReference.value === 'cost' ? calculateCostPreview(q) : Number(q.price || 0);

    if (priceMode.value === 'percentage') {
        return baseValue + (baseValue * (val / 100));
    } else {
        return baseValue + val;
    }
};

const processQueuePrice = () => {
    router.post('/produk/bulk-process-price-alumunium', { 
        cost_per_kg_value: costPerKgValue.value,
        price_reference: priceReference.value,
        price_mode: priceMode.value,
        price_value: priceValue.value
    }, {
        preserveScroll: true,
        onSuccess: () => {
            if (props.queuedProducts && props.queuedProducts.length <= 100) {
                showDialog.value = false;
                costPerKgValue.value = 0;
                priceValue.value = 0;
            }
        }
    });
};

const removeFromQueue = (id: number) => {
    router.post(`/produk/bulk-remove-alumunium/${id}`, {}, { preserveScroll: true });
};
const removeFromQueueAll = () => {
    router.post(`/produk/bulk-remove-all-alumunium`, {}, { preserveScroll: true });
};

const sortedProducts = computed(() => {
    if (!props.products?.data) return [];
    return [...props.products.data].sort((a: any, b: any) => {
        const getLatestLogTime = (product: any) => {
            if (product.act_log && product.act_log.length > 0) {
                const lastLog = product.act_log[product.act_log.length - 1];
                return new Date(lastLog.datetime).getTime();
            }
            return product.updated_at ? new Date(product.updated_at).getTime() : 0;
        };
        return getLatestLogTime(b) - getLatestLogTime(a); 
    });
});

const displayLatestEditTime = (product: any) => {
    if (product.act_log && product.act_log.length > 0) {
        return formatDateTime(product.act_log[product.act_log.length - 1].datetime);
    }
    return formatDateTime(product.updated_at);
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const tahun = date.getFullYear()
  const bulan = String(date.getMonth() + 1).padStart(2, '0') 
  const tanggal = String(date.getDate()).padStart(2, '0')
  const jam = String(date.getHours()).padStart(2, '0')
  const menit = String(date.getMinutes()).padStart(2, '0')
  return `${tahun}-${bulan}-${tanggal}, ${jam}:${menit}`
}
</script>

<template>
    <Head title="Bulk Harga Alumunium" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="py-6 sm:px-6 lg:px-8">
            <div class="sm:flex sm:justify-between items-center mb-4 block mx-4 sm:mx-0">
                <h2 class="font-semibold text-xl text-gray-800 dark:text-white leading-tight mb-3 sm:mb-0">Penyesuaian Harga Alumunium</h2>
                <div class="flex flex-wrap gap-2">
                    <button @click="showDialog = true" class="text-sm bg-gray-200 dark:text-blue-500 px-3 py-1.5 rounded hover:bg-gray-300">
                        Lihat Antrian ({{ queuedProducts?.length || 0 }})
                    </button>
                    <button @click="addToQueue" class="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50" :disabled="!selectedIds.length">
                        Masukkan ke Antrian
                    </button>
                </div>
            </div>

            <div class="mb-4 overflow-x-auto scroll-container pb-2 gap-3 flex mx-4 sm:mx-0">
                <input type="text" v-model="search" placeholder="Cari profil alumunium..." class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm">
                
                <select v-model="category" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm">
                    <option value="">Semua Kategori</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>

                <select v-model="brand" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm">
                    <option value="">Semua Brand</option>
                    <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                </select>
            </div>

            <div class="bg-background shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div class="overflow-x-auto scroll-container relative pb-2">
                    <table class="w-full text-left text-sm whitespace-nowrap">
                        <thead class="bg-gray-50 border-b border-gray-200 font-medium dark:*:bg-gray-700 dark:border-gray-600">
                            <tr>
                                <th class="px-2 py-1.5 w-10 text-center"><input type="checkbox" v-model="selectAll" class="rounded border-gray-300"></th>
                                <th class="px-2 py-1.5 w-12 text-center">No</th>
                                <th class="px-2 py-1.5">Nama Profil</th>
                                <th class="px-2 py-1.5 text-center">Berat (kg)</th>
                                <th class="px-2 py-1.5 text-center">Panjang (m)</th>
                                <th class="px-2 py-1.5 text-right">Cost/kg</th>
                                <th class="px-2 py-1.5 text-right">Cost</th>
                                <th class="px-2 py-1.5 text-right">Price</th>
                                <th class="px-2 py-1.5 text-left">Riwayat Log</th>
                                <th class="px-2 py-1.5 text-left">Terakhir ubah</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(item, index) in sortedProducts" :key="item.id" class="hover:bg-blue-100/50" :class="{'bg-yellow-50/50': item.queue_act}">
                                <td class="px-2 py-1 text-center"><input type="checkbox" :value="item.id" v-model="selectedIds" class="rounded border-gray-300"></td>
                                <td class="px-2 py-1 text-center text-gray-500">{{ index + 1 }}</td>
                                <td class="px-2 py-1 font-medium">
                                    {{ item.name }}
                                    <span v-if="item.queue_act" class="ml-1 text-[10px] bg-yellow-200 text-yellow-800 px-1 rounded">Antre</span>
                                </td>
                                <td class="px-2 py-1 text-center text-gray-500 text-xs">{{ item.weight || '-' }}</td>
                                <td class="px-2 py-1 text-center text-gray-500 text-xs">{{ item.panjang || '-' }}</td>
                                <td class="px-2 py-1 text-right">{{ item.cost_per_kg }}</td>
                                <td class="px-2 py-1 text-right">{{ item.cost }}</td>
                                <td class="px-2 py-1 text-right font-semibold">{{ item.price }}</td>
                                
                                <td class="px-2 py-1 text-left text-xs">
                                    <button v-if="item.act_log && item.act_log.length" @click="openLogDialog(item)" class="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded font-medium transition-colors">
                                        Lihat Log ({{ item.act_log.length }})
                                    </button>
                                    <span v-else class="text-gray-300">-</span>
                                </td>
                                <td class="px-2 py-1 text-right font-semibold text-xs text-gray-600">
                                    {{ displayLatestEditTime(item) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-if="props.products?.last_page > 1" class="mt-4 mb-6 px-3">
            <div class="overflow-x-auto no-scrollbar">
                <div class="flex w-max gap-1 lg:mx-auto">
                    <button :disabled="!props.products.first_page_url" @click="router.get(props.products.first_page_url, {}, { preserveScroll: true })" class="shrink-0 px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"><ChevronsLeft class="w-4 h-4" /></button>
                    <button v-for="(link, i) in props.products.links.filter((l: any) => /^\d+$/.test(l.label))" :key="i" @click="router.get(link.url, {}, { preserveScroll: true })" class="shrink-0 px-3 py-1 rounded-lg" :class="link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'">{{ link.label }}</button>
                    <button :disabled="!props.products.last_page_url" @click="router.get(props.products.last_page_url, {}, { preserveScroll: true })" class="shrink-0 px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"><ChevronsRight class="w-4 h-4" /></button>
                </div>
            </div>
        </div>             

        <!-- DIALOG ANTRIAN -->
        <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div class="bg-background rounded-lg shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                <div class="px-4 py-3 border-b flex justify-between items-center bg-background">
                    <div>
                        <h3 class="font-bold text-lg">Proses Harga Alumunium</h3>
                        <p class="text-xs text-gray-500">Total ada {{ queuedProducts?.length || 0 }} produk di antrian.</p>
                    </div>
                    <button @click="showDialog = false" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>
                
                <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b bg-accent/5">
                    
                    <!-- PANEL COST (Hanya Harga per Kg) -->
                    <div class="p-3 bg-background rounded border border-accent shadow-sm">
                        <h4 class="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2 border-b pb-1 flex justify-between">
                            <span>1. Penyesuaian Cost (Modal)</span>
                            <span v-if="Number(costPerKgValue) !== 0" class="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-normal">Aktif</span>
                        </h4>
                        <div class="flex gap-2 items-end">
                            <div class="w-full">
                                <label class="block text-[10px] text-gray-500 mb-0.5">Harga Dasar (Rp/Kg) Baru (0 = Abaikan)</label>
                                <input type="number" v-model="costPerKgValue" step="any" class="w-full text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1 px-2" placeholder="Masukkan harga per kilogram...">
                            </div>
                        </div>
                        <p class="text-[9px] text-gray-400 mt-1.5 leading-tight">
                            *Cost akan dikalkulasi otomatis: <strong>Harga/Kg &times; Berat Profil</strong>
                        </p>
                    </div>

                    <!-- PANEL PRICE -->
                    <div class="p-3 bg-background rounded border border-accent shadow-sm">
                        <h4 class="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2 border-b pb-1 flex justify-between">
                            <span>2. Penyesuaian Price (Jual)</span>
                            <span v-if="Number(priceValue) !== 0" class="text-[10px] text-green-600 bg-green-50 px-1 rounded font-normal">Aktif</span>
                        </h4>
                        <div class="grid grid-cols-3 gap-2 items-end">
                            <div>
                                <label class="block text-[10px] text-gray-500 mb-0.5">Acuan</label>
                                <select v-model="priceReference" class="w-full text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1 px-1">
                                    <option value="cost">Cost (Modal Baru)</option>
                                    <option value="price">Price (Jual Lama)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] text-gray-500 mb-0.5">Mode</label>
                                <select v-model="priceMode" class="w-full text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1 px-1">
                                    <option value="percentage">Persen (%)</option>
                                    <option value="nominal">Nominal (Rp)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] text-gray-500 mb-0.5">Nilai (0 = Abaikan)</label>
                                <input type="number" v-model="priceValue" step="any" class="w-full text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1 px-2">
                            </div>
                        </div>
                    </div>

                </div>

                <div v-if="queuedProducts && queuedProducts.length > 100" class="bg-amber-50 text-amber-800 text-xs px-4 py-1.5 border-b border-amber-200">
                    ⚠️ Sistem hanya mengeksekusi 100 produk teratas terlebih dahulu untuk mencegah server timeout.
                </div>

                <div class="overflow-y-auto flex-1 p-4 bg-background">  
                    <table class="w-full text-xs border bg-background shadow-sm">
                        <thead class="bg-accent border-b sticky top-0 shadow-sm font-medium">
                            <tr>
                                <th class="px-2 py-1.5 text-left">Nama Profil Alumunium</th>
                                <th class="px-2 py-1.5 text-center w-16">Berat</th>
                                <th class="px-2 py-1.5 text-center w-16">Panjang (m)</th>
                                <th class="px-2 py-1.5 text-center w-20">Berat / m</th>
                                <th class="px-2 py-1.5 text-right w-24">Cost/kg</th>
                                <th class="px-2 py-1.5 text-right w-32">Cost Preview</th>
                                <th class="px-2 py-1.5 text-right text-blue-600 w-32">Price Preview</th>
                                <th class="px-2 py-1.5 text-center w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(q, idx) in queuedProducts" :key="q.id" class="border-b last:border-0" :class="{'opacity-50 bg-gray-50': idx >= 100}">
                                <td class="px-2 py-1 truncate max-w-xs">
                                    <span v-if="idx >= 100" class="text-[9px] bg-gray-300 text-gray-700 px-1 rounded mr-1">Nanti</span>
                                    {{ q.name }}
                                </td>
                                <td class="px-2 py-1 text-center font-mono text-gray-500 text-[11px] text-nowrap">
                                    {{ q.weight || 1 }} kg
                                </td>
                                <td class="px-2 py-1 text-center font-mono text-gray-500 text-[11px] text-nowrap">
                                    {{ q.panjang || 1 }} m
                                </td>
                                <td class="px-2 py-1 text-center font-mono text-gray-500 text-[11px] text-nowrap">
                                    {{ q.kg_per_meter || 1 }} kg/m
                                </td>
                                <td class="px-2 py-1 text-right font-mono text-gray-500 text-[11px] text-nowrap">
                                    {{ Number(q.cost_per_kg || 0).toLocaleString('id-ID') }}
                                </td>
                                
                                <td class="px-2 py-1 text-right">
                                    <span class="text-gray-400 line-through mr-1">{{ Number(q.cost || 0).toLocaleString('id-ID') }}</span>
                                    <span class="font-semibold text-gray-700" :class="{'text-blue-600 font-bold': Number(costPerKgValue) !== 0}">
                                        {{ calculateCostPreview(q).toLocaleString('id-ID') }}
                                    </span>
                                </td>

                                <td class="px-2 py-1 text-right">
                                    <span class="text-gray-400 line-through mr-1">{{ Number(q.price || 0).toLocaleString('id-ID') }}</span>
                                    <span class="font-bold text-green-600">
                                        {{ calculatePricePreview(q).toLocaleString('id-ID') }}
                                    </span>
                                </td>
                                
                                <td class="px-2 py-1 text-center">
                                    <button @click="removeFromQueue(q.id)" class="text-xs text-red-500 hover:text-red-700 font-medium hover:underline">Batal</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="px-4 py-3 border-t bg-background flex justify-start items-center">
                    <button @click="removeFromQueueAll" class="text-xs mr-3 text-red-500 hover:text-red-700 font-medium hover:underline">Hapus Semua</button>                    
                    <button @click="showDialog = false" class="ms-auto px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded mr-2 border border-accent">Tutup</button>
                    <button @click="processQueuePrice" :disabled="!queuedProducts || queuedProducts.length === 0" class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-medium">Eksekusi</button>
                </div>
            </div>
        </div>

        <!-- DIALOG LOG -->
        <div v-if="showLogDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div class="bg-background rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div class="px-4 py-3 border-b flex justify-between items-center bg-background">
                    <div>
                        <h3 class="font-bold text-lg text-foreground">Riwayat Log Harga</h3>
                        <p class="text-sm text-gray-600 font-medium">{{ selectedProductLog?.name }}</p>
                    </div>
                    <button @click="closeLogDialog" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                <div class="overflow-y-auto flex-1 p-5 bg-background">
                    <div class="relative border-l border-gray-200 ml-3">
                        <div v-for="(log, i) in selectedProductLog?.act_log.slice().reverse()" :key="i" class="mb-6 ml-4 last:mb-0">
                            <div class="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-[5.5px] mt-1.5 border border-white"></div>
                            <span class="block text-[11px] text-gray-400 font-mono mb-0.5">{{ log.datetime }}</span>
                            <span class="block text-sm font-medium text-foreground">{{ log.perubahan }}</span>
                            <span class="block text-xs text-gray-500 mt-0.5">Aksi: {{ log.aksi }}</span>
                        </div>
                    </div>
                </div>
                <div class="px-4 py-3 border-t bg-background flex justify-end">
                    <button @click="closeLogDialog" class="px-5 py-2 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md font-medium transition-colors">Tutup</button>
                </div>
            </div>
        </div>

    </AppLayout>
</template>

<style scoped>
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.3) transparent;
}
.scroll-container::-webkit-scrollbar {
  height: 8px;
  width: 6px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.25);
  border-radius: 4px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0,0,0,0.45);
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
</style>