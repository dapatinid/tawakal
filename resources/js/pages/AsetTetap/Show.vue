<script setup lang="ts">
import { Head, Link } from "@inertiajs/vue3";
import AppLayout from '@/layouts/AppLayout.vue';
import { 
  ArrowLeft, 
  Calendar, 
  History, 
  Info, 
  TrendingDown, 
  Wallet, 
  ShieldCheck,
  FileText,
  Camera,
  Trash2,
  AlertTriangle,
  DollarSign
} from "lucide-vue-next";
import { ref, computed } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'vue-sonner';
import { router, useForm } from '@inertiajs/vue3';

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const props = defineProps<{
  asset: {
    id: number;
    asset_code: string;
    name: string;
    category: string;
    purchase_date: string;
    purchase_cost: number;
    residual_value: number;
    useful_life_months: number;
    accumulated_depreciation: number;
    images: string[] | null;
    status: 'active' | 'sold' | 'disposed' | 'archived';
    notes?: string;
    branch?: { name: string };
    payments?: Array<{
        id: number;
        mutation_type: string;
        nominal: number;
        date: string;
        notes?: string;
        payment_method?: string;
        }>;    
  }
}>();

const breadcrumbs = [
    { title: 'Aset Tetap', href: '/aset-tetap' },
    { title: props.asset.asset_code, href: '#' }
];

// ========= LOGIKA AKUNTANSI (FRONTEND PREVIEW) =========
const bookValue = computed(() => props.asset.purchase_cost - props.asset.accumulated_depreciation);
const progressDepreciation = computed(() => (props.asset.accumulated_depreciation / (props.asset.purchase_cost - props.asset.residual_value)) * 100);

// Format Util
const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

// TAMBAHKAN INI: Fungsi untuk merapikan tanggal
const formatDate = (dateString?: string | null) => {
  if (!dateString) return '-';
  
  // Mengambil 10 karakter pertama (YYYY-MM-DD)
  // Ini akan menangani baik format "2026-05-01 00:00:00" maupun "2026-03-31T17:00..."
  return dateString.substring(0, 10);
};

/* =======================
   SELL & DISPOSE STATE
======================= */
const showSellDialog = ref(false);
const sellForm = useForm({
    sell_price: bookValue.value, // Default ke nilai buku saat ini
    date: new Date().toISOString().split('T')[0],
});

const submitSell = () => {
    sellForm.post(`/aset-tetap/${props.asset.id}/sell`, {
        onSuccess: () => {
            showSellDialog.value = false;
            toast.success('Aset ditandai sebagai Terjual');
        }
    });
};

/* =======================
   DISPOSE STATE & LOGIC
======================= */
const showDisposeDialog = ref(false);
const disposeForm = useForm({
    date: new Date().toISOString().split('T')[0],
});

const openDisposeDialog = () => {
  showDisposeDialog.value = true;
};

const submitDispose = () => {
    disposeForm.post(`/aset-tetap/${props.asset.id}/dispose`, {
        onStart: () => { showDisposeDialog.value = false },
        onSuccess: () => {
            toast.success('Aset berhasil di-dispose');
        },
        onError: () => toast.error('Gagal melakukan pembuangan aset')
    });
};

/* =======================
   ARCHIVE STATE & LOGIC
======================= */
const showArchiveDialog = ref(false);

const openArchiveDialog = () => {
  showArchiveDialog.value = true;
};

const archiveAsset = () => {
  // Tambahkan objek kosong {} sebagai argumen kedua jika tidak ada data body
  router.patch(`/aset-tetap/${props.asset.id}/archive`, {}, {
    onStart: () => { showArchiveDialog.value = false },
    onSuccess: () => toast.success('Aset berhasil diarsipkan'),
    onError: () => toast.error('Gagal mengarsipkan aset')
  });
};

/* =======================
   DELETE STATE & LOGIC
======================= */
const showDeleteDialog = ref(false);

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
};

const deleteAsset = () => {
  router.delete(`/aset-tetap/${props.asset.id}`, {
    onStart: () => { showDeleteDialog.value = false },
    onSuccess: () => toast.success('Aset berhasil dihapus'),
    onError: () => toast.error('Gagal menghapus aset')
  });
};

function previewUrl(path?: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `/storage/${path}`;
}

// Form Penyusutan
const form = useForm({
  amount: Math.round((props.asset.purchase_cost - props.asset.residual_value) / props.asset.useful_life_months),
  date: new Date().toISOString().split('T')[0],
  notes: 'Penyusutan bulanan (straight-line)'
});

const submitDepreciation = () => {
  form.put(`/aset-tetap/${props.asset.id}/depreciate`, {
    preserveScroll: true,
    onSuccess: () => {
      toast.success('Penyusutan berhasil dicatat');
      form.reset('notes');
    },
    onError: () => toast.error('Gagal melakukan penyusutan')
  });
};

/* =======================
   PAYMENT LOGIC
======================= */


// Hitung Sisa Hutang
const remainingDebt = computed(() => {
    // 1. Nilai Total yang harus dibayar (Pengadaan)
    const totalInvoice = props.asset.payments?.find(p => p.mutation_type === 'Pengadaan Aset Tetap')?.nominal || 0;
    
    // 2. Total yang SUDAH dibayar (Pembayaran)
    // Pastikan string "Pembayaran Hutang Aset" sama dengan di Controller
    const totalPaid = props.asset.payments
        ?.filter(p => p.mutation_type === 'Pembayaran Hutang Aset')
        .reduce((acc, curr) => acc + Number(curr.nominal), 0) || 0;
    
    const remaining = totalInvoice - totalPaid;
    return remaining < 0 ? 0 : remaining; // Mencegah angka negatif
});

// Hitung Sisa Piutang
const remainingReceivable = computed(() => {
    // 1. Nilai Jual Aset
    const totalInvoice = props.asset.payments?.find(p => p.mutation_type === 'Penjualan Aset Tetap')?.nominal || 0;
    
    // 2. Total yang SUDAH diterima (Pembayaran)
    // Pastikan string "Pembayaran Piutang Jual Aset" sama dengan di Controller
    const totalReceived = props.asset.payments
        ?.filter(p => p.mutation_type === 'Pembayaran Piutang Jual Aset')
        .reduce((acc, curr) => acc + Number(curr.nominal), 0) || 0;
    
    const remaining = totalInvoice - totalReceived;
    return remaining < 0 ? 0 : remaining;
});

// 1. Tambahkan ref untuk data modal yang kurang
const paymentEditing = ref({
    date: '',
    nominal: 0,
    payment_method: 'CASH',
    type: 'debt',
    notes: ''
});

const showPaymentModal = ref(false);
const paymentType = ref<'debt' | 'receivable'>('debt');

// 2. Koreksi Fungsi openAddPayment
const openAddPayment = (type: 'debt' | 'receivable') => {
  paymentType.value = type;
  
  // Hitung sisa secara akurat
  const remaining = type === 'debt' ? remainingDebt.value : remainingReceivable.value;

  paymentEditing.value = {
    date: new Date().toISOString().split('T')[0],
    nominal: remaining,
    payment_method: "cash", 
    type: type,
    notes: ''
  };

  showPaymentModal.value = true;
};

// 3. Gabungkan submitPayment ke dalam savePayment (Inertia Form)
const payForm = useForm({
    nominal: 0,
    date: '',
    type: 'debt',
    payment_method: 'cash',
    notes: ''
});

const savePayment = () => {
  // Sync data dari ref modal ke Inertia Form
  payForm.nominal = paymentEditing.value.nominal;
  payForm.date = paymentEditing.value.date;
  payForm.type = paymentType.value;
  payForm.payment_method = paymentEditing.value.payment_method;
  payForm.notes = paymentEditing.value.notes;

  payForm.post(`/aset-tetap/${props.asset.id}/pay`, {
    onSuccess: () => {
      showPaymentModal.value = false;
      toast.success('Pembayaran berhasil dicatat');
    },
    preserveScroll: true,
  });
};

// 4. Koreksi Logic Filter (Gunakan mutation_type yang konsisten dengan Controller)
const procurementPayments = computed(() => {
  return props.asset.payments?.filter(p => 
    ['Pengadaan Aset Tetap', 'Pembayaran Hutang Aset'].includes(p.mutation_type)
  ) || [];
});

const salesPayments = computed(() => {
  return props.asset.payments?.filter(p => 
    ['Penjualan Aset Tetap', 'Pembayaran Piutang Jual Aset', 'Laba Penjualan Aset', 'Rugi Penjualan Aset'].includes(p.mutation_type)
  ) || [];
});


/* =======================
   IMAGE MANAGEMENT LOGIC
======================= */
const showImageDeleteDialog = ref(false);
const imageToDelete = ref<string | null>(null);

const imageUploadForm = useForm({
  images: [] as File[], // Ubah dari 'image' ke 'images' array
});

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  
  if (target.files?.length) {
    if (target.files.length > 5) {
        toast.error("Maksimal 5 foto sekali upload");
        return;
    }
    // Ubah FileList menjadi Array dan masukkan ke form
    imageUploadForm.images = Array.from(target.files);
    submitImages();
  }
};

const submitImages = () => {
  imageUploadForm.post(`/aset-tetap/${props.asset.id}/images`, {
    forceFormData: true,
    onSuccess: () => {
      imageUploadForm.reset();
      toast.success(`Foto berhasil ditambahkan`);
    },
    onError: () => toast.error('Gagal mengunggah beberapa foto'),
  });
};

// Fungsi untuk membuka dialog konfirmasi
const confirmDeleteImage = (path: string) => {
  imageToDelete.value = path;
  showImageDeleteDialog.value = true;
};

const executeDeleteImage = () => {
  if (!imageToDelete.value) return;

  router.delete(`/aset-tetap/${props.asset.id}/images`, {
    data: { path: imageToDelete.value },
    onStart: () => { showImageDeleteDialog.value = false },
    onSuccess: () => {
      toast.success('Foto dihapus');
      imageToDelete.value = null;
    },
    onError: () => toast.error('Gagal menghapus foto')
  });
};

// Fungsi open new tab
const openImage = (path: string) => {
  window.open(previewUrl(path), '_blank');
};

</script>

<template>
  <Head :title="`Detail Aset - ${asset.name}`" />
  <AppLayout :breadcrumbs="breadcrumbs">
    
    <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6 pb-24">
      
      <div class="flex flex-wrap justify-between gap-4">
        <div class="flex items-center gap-4">
            <div>
                <h1 class="text-2xl font-bold flex items-center gap-2">
                    {{ asset.name }}
                    <span 
                        class="text-xs px-2 py-1 rounded-full uppercase"
                        :class="{
                            'bg-green-100 text-green-700': asset.status === 'active',
                            'bg-blue-100 text-blue-700': asset.status === 'archived', // Tambahkan ini
                            'bg-red-100 text-red-700': asset.status === 'sold' || asset.status === 'disposed'
                        }"
                    >
                        {{ asset.status }}
                    </span>
                </h1>
                <p class="text-muted-foreground text-sm">Kode Aset: {{ asset.asset_code }} • {{ asset.branch?.name }}</p>
            </div>
        </div>
        <div class="flex gap-2">
            <Button 
                v-if="asset.status === 'active'"
                @click="showSellDialog = true" 
                variant="outline" size="sm" class="gap-2"
            >
                <DollarSign class="size-4" /> Sell
            </Button>

            <Button 
                v-if="asset.status === 'active'"
                @click="openDisposeDialog" 
                variant="outline" size="sm" class="gap-2"
            >
                <FileText class="size-4" /> Dispose
            </Button>

            <Button 
                v-if="asset.status === 'sold' || asset.status === 'disposed'"
                @click="openArchiveDialog" 
                variant="outline" size="sm" class="gap-2"
            >
                <FileText class="size-4" /> Archive
            </Button>

            <Button v-if="asset.status === 'archived'" @click="openDeleteDialog" variant="destructive" size="sm" class="gap-2">
                <Trash2 class="size-4" /> Delete
            </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card class="bg-blue-600 text-white border-none shadow-blue-200">
                <CardContent class="p-4 space-y-1">
                    <p class="text-xs opacity-80 uppercase font-semibold">Nilai Buku Saat Ini</p>
                    <p class="text-xl font-bold">{{ formatCurrency(bookValue) }}</p>
                    <div class="pt-2 text-[10px] flex items-center gap-1 opacity-90">
                        <Wallet class="size-3" /> Berdasarkan penyusutan terakhir
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="p-4 space-y-1">
                    <p class="text-xs text-muted-foreground uppercase font-semibold">Harga Perolehan</p>
                    <p class="text-xl font-bold">{{ formatCurrency(asset.purchase_cost) }}</p>
                    <div class="pt-2 text-[10px] flex items-center gap-1 text-muted-foreground">
                        <Calendar class="size-3" /> Diperoleh: {{ formatDate(asset.purchase_date) }}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="p-4 space-y-1">
                    <p class="text-xs text-muted-foreground uppercase font-semibold">Akumulasi Susut</p>
                    <p class="text-xl font-bold text-red-500">- {{ formatCurrency(asset.accumulated_depreciation) }}</p>
                    <div class="pt-2">
                        <div class="w-full bg-gray-100 rounded-full h-1.5">
                            <div class="bg-red-500 h-1.5 rounded-full" :style="{ width: progressDepreciation + '%' }"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
                <CardTitle class="text-lg flex items-center gap-2">
                    <Info class="size-5 text-blue-500" /> Spesifikasi & Akuntansi
                </CardTitle>
            </CardHeader>
            <CardContent class="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                    <p class="text-muted-foreground">Kategori</p>
                    <p class="font-medium capitalize">{{ asset.category }}</p>
                </div>
                <div>
                    <p class="text-muted-foreground">Umur Ekonomis</p>
                    <p class="font-medium">{{ asset.useful_life_months }} Bulan ({{ (asset.useful_life_months / 12).toFixed(1) }} Tahun)</p>
                </div>
                <div>
                    <p class="text-muted-foreground">Nilai Residu</p>
                    <p class="font-medium">{{ formatCurrency(asset.residual_value) }}</p>
                </div>
                <div>
                    <p class="text-muted-foreground">Metode Susut</p>
                    <p class="font-medium">Garis Lurus (Straight Line)</p>
                </div>
                <div class="col-span-2 pt-4 border-t">
                    <p class="text-muted-foreground mb-1">Catatan/Deskripsi</p>
                    <p class="whitespace-pre-line">{{ asset.notes || 'Tidak ada catatan tambahan.' }}</p>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle class="text-lg flex items-center gap-2">
                    <History class="size-5 text-orange-500" /> Riwayat Aset
                </CardTitle>
            </CardHeader>
            <CardContent>

                <div class="relative space-y-0 pb-2">
                    <div class="relative pl-8 pb-8">
                        <div class="absolute left-2.75 top-5 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                        <div class="absolute left-0 top-1 z-10 flex size-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 border-4 border-white dark:border-gray-950">
                            <div class="size-2 rounded-full bg-green-600"></div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-foreground">Aset Terdaftar</span>
                            <span class="text-xs text-muted-foreground mt-0.5">
                                {{ formatDate(asset.purchase_date) }} • Saldo Awal {{ formatCurrency(asset.purchase_cost) }}
                            </span>
                        </div>
                    </div>

                    <template v-for="(payment, index) in asset.payments" :key="payment.id">
                        <div v-if="payment.mutation_type === 'Penyusutan Aset Tetap'" class="relative pl-8 pb-8">
                            <div v-if="index !== (asset.payments?.length ?? 0) - 1" class="absolute left-2.75 top-5 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                            
                            <div class="absolute left-0 top-1 z-10 flex size-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 border-4 border-white dark:border-gray-950">
                                <div class="size-2 rounded-full bg-orange-500"></div>
                            </div>
                            
                            <div class="flex flex-col">
                                <div class="flex justify-between items-start">
                                    <span class="text-sm font-bold text-foreground">Penyusutan Periodik</span>
                                    <span class="text-[10px] text-muted-foreground">{{ formatDate(payment.date) }}</span>
                                </div>
                                <p v-if="payment.notes" class="text-[10px] text-muted-foreground italic">{{ payment.notes }}</p>
                                <div class="mt-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded w-fit">
                                    - {{ formatCurrency(payment.nominal) }}
                                </div>
                            </div>
                        </div>
                    </template>

                    <div v-if="asset.accumulated_depreciation <= 0" class="relative pl-8">
                        <p class="text-[10px] italic text-orange-500">
                            <Info class="inline size-3 mr-1" /> Belum ada aktivitas penyusutan tercatat.
                        </p>
                    </div>
                </div>

            </CardContent>
          </Card>
       
        </div>

        <div class="space-y-6">
       
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0">
                    <CardTitle class="text-sm flex items-center gap-2">
                        <Camera class="size-4" /> Dokumentasi Foto
                    </CardTitle>
                    <input 
                        type="file" 
                        ref="fileInput" 
                        class="hidden" 
                        accept="image/*" 
                        multiple 
                        @change="handleFileUpload" 
                    />
                    <Button 
                        variant="ghost" size="sm" class="h-8 px-2 text-blue-600"
                        @click="triggerFileInput" :disabled="imageUploadForm.processing"
                    >
                        <span v-if="imageUploadForm.processing">Mengunggah ({{ imageUploadForm.images.length }})...</span>
                        <span v-else>+ Tambah</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div v-if="asset.images && asset.images.length" class="grid grid-cols-2 gap-3">
                        <div 
                            v-for="(img, i) in asset.images" :key="i" 
                            class="group relative rounded-lg border aspect-square bg-slate-50 overflow-hidden"
                        >
                            <img 
                                :src="previewUrl(img)" 
                                @click="openImage(img)"
                                class="w-full h-full object-cover cursor-zoom-in transition-transform group-hover:scale-105"
                            />
                            
                            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    class="size-7 shadow-lg"
                                    @click.stop="confirmDeleteImage(img)"
                                >
                                    <Trash2 class="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                        <Camera class="size-8 opacity-20" />
                        <p class="text-xs mt-2">Belum ada foto</p>
                    </div>
                </CardContent>
            </Card>                 

            <Card class="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                <CardContent class="p-4 flex gap-3">
                    <AlertTriangle class="size-5 text-amber-600 shrink-0" />
                    <div>
                        <p class="text-xs font-bold text-amber-800 dark:text-amber-400">Peringatan Akuntansi</p>
                        <p class="text-[10px] text-amber-700 dark:text-amber-500 mt-1">
                            Nilai buku TIDAK OTOMATIS berkurang setiap akhir bulan, lakukan penyusutan dengan form penyusutan.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="asset.status === 'active' && bookValue > asset.residual_value">
                <CardHeader>
                    <CardTitle class="text-sm flex items-center gap-2">
                        <TrendingDown class="size-4 text-red-500" /> Form Penyusutan
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-[10px] uppercase font-bold text-muted-foreground">Nominal Susut (IDR)</label>
                        <input 
                            v-model="form.amount" 
                            type="number" 
                            class="w-full text-sm border rounded p-2 bg-background"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] uppercase font-bold text-muted-foreground">Tanggal Transaksi</label>
                        <input 
                            v-model="form.date" 
                            type="date" 
                            class="w-full text-sm border rounded p-2 bg-background"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] uppercase font-bold text-muted-foreground">Catatan</label>
                        <textarea 
                            v-model="form.notes" 
                            rows="2" 
                            class="w-full text-sm border rounded p-2 bg-background"
                        ></textarea>
                    </div>
                    <Button 
                        @click="submitDepreciation" 
                        class="w-full bg-red-600 hover:bg-red-700 text-white"
                        :disabled="form.processing"
                    >
                        {{ form.processing ? 'Memproses...' : 'Posting Penyusutan' }}
                    </Button>
                </CardContent>
            </Card>            
        </div>



                

      </div>


        <Card>
            <CardHeader class="flex flex-row items-center justify-between">
                <CardTitle class="text-lg flex items-center gap-2">
                    <Wallet class="size-5 text-purple-500" /> Pembayaran Pengadaan
                </CardTitle>
                <div class="text-right">
                    <p class="text-[10px] text-muted-foreground uppercase font-bold">Sisa Hutang</p>
                    <p class="text-sm font-bold text-red-600">{{ formatCurrency(remainingDebt) }}</p>
                </div>
            </CardHeader>
            <CardContent>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-left border-b text-muted-foreground text-[10px] uppercase">
                            <th class="pb-2">Tanggal</th>
                            <th class="pb-2">Keterangan</th>
                            <th class="pb-2 text-right">Nominal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pay in procurementPayments" :key="pay.id" class="border-b last:border-0">
                            <td class="py-3 text-xs">{{ formatDate(pay.date) }}</td>
                            <td class="py-3">
                                <p class="text-xs">{{ pay.payment_method || '-' }}{{ pay.notes ? ' • ' + pay.notes : '' }}</p>
                                <span class="font-medium text-[10px] text-muted-foreground">{{ pay.mutation_type }}</span>
                            </td>
                            <td class="py-3 text-right font-mono" :class="pay.mutation_type === 'Pembayaran Hutang Aset' ? 'text-blue-600' : 'text-foreground'">
                                {{ pay.mutation_type === 'Pembayaran Hutang Aset' ? '-' : '' }}{{ formatCurrency(pay.nominal) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button 
                    v-if="remainingDebt > 0"
                    @click="openAddPayment('debt')" 
                    variant="outline" size="sm" class="w-full mt-4 border-dashed border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                    + Pembayaran Hutang
                </Button>
            </CardContent>
        </Card>

        <Card v-if="asset.status === 'sold'">
            <CardHeader class="flex flex-row items-center justify-between">
                <CardTitle class="text-lg flex items-center gap-2">
                    <DollarSign class="size-5 text-green-600" /> Penerimaan Penjualan
                </CardTitle>
                <div class="text-right">
                    <p class="text-[10px] text-muted-foreground uppercase font-bold">Sisa Piutang</p>
                    <p class="text-sm font-bold text-orange-600">{{ formatCurrency(remainingReceivable) }}</p>
                </div>
            </CardHeader>
            <CardContent>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-left border-b text-muted-foreground text-[10px] uppercase">
                            <th class="pb-2">Tanggal</th>
                            <th class="pb-2">Keterangan</th>
                            <th class="pb-2 text-right">Nominal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pay in salesPayments" :key="pay.id" class="border-b last:border-0">
                            <td class="py-3 text-xs">{{ formatDate(pay.date) }}</td>
                            <td class="py-3">
                                <p class="text-xs">{{ pay.payment_method || '-' }}{{ pay.notes ? ' • ' + pay.notes : '' }}</p>
                                <span class="font-medium text-[10px] text-muted-foreground">{{ pay.mutation_type }}</span>
                            </td>
                            <td class="py-3 text-right text-green-600 font-mono">
                                {{ formatCurrency(pay.nominal) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button 
                    v-if="remainingReceivable > 0"
                    @click="openAddPayment('receivable')"
                    variant="outline" size="sm" class="w-full mt-4 border-dashed border-green-300 text-green-700 hover:bg-green-50"
                >
                    + Pembayaran Piutang (Terima Uang)
                </Button>
            </CardContent>
        </Card>   

    </div>

    <Dialog v-model:open="showPaymentModal">
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Catat Pembayaran {{ paymentType === 'debt' ? 'Hutang' : 'Piutang' }}</DialogTitle>
        <DialogDescription>Pastikan nominal dan metode pembayaran sesuai dengan bukti transaksi.</DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4 py-4">
        <div class="space-y-2">
            <label class="text-xs font-bold uppercase text-muted-foreground">Nominal (IDR)</label>
            <input v-model="paymentEditing.nominal" type="number" class="w-full border rounded p-2 bg-background" />
        </div>
        
        <div class="space-y-2">
            <label class="text-xs font-bold uppercase text-muted-foreground">Metode Pembayaran</label>
            <select v-model="paymentEditing.payment_method" class="w-full border rounded p-2 bg-background">
            <option value="cash">CASH</option>
            <option value="main cash">MAIN CASH</option>
            <option value="petty cash">PETTY CASH</option> 
            <option value="bank">BANK</option>
            <option value="ewallet">E-WALLET</option>
            <option value="qris">QRIS</option>
            </select>
        </div>

        <div class="space-y-2">
            <label class="text-xs font-bold uppercase text-muted-foreground">Tanggal</label>
            <input v-model="paymentEditing.date" type="date" class="w-full border rounded p-2 bg-background" />
        </div>

        <div class="space-y-2">
            <label class="text-xs font-bold uppercase text-muted-foreground">Catatan</label>
            <textarea v-model="paymentEditing.notes" type="text" placeholder="wajib ini keterangan" required class="w-full border rounded p-2 bg-background"></textarea>
        </div>
        </div>

        <DialogFooter>
        <Button variant="outline" @click="showPaymentModal = false">Batal</Button>
        <Button @click="savePayment" :disabled="payForm.processing">
            Simpan Transaksi
        </Button>
        </DialogFooter>
    </DialogContent>
    </Dialog>    

    <Dialog v-model:open="showSellDialog">
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Penjualan Aset</DialogTitle>
        <DialogDescription>Masukkan detail penjualan untuk aset {{ asset.name }}</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
            <div class="space-y-2">
                <label class="text-sm font-medium">Harga Jual (IDR)</label>
                <input v-model="sellForm.sell_price" type="number" class="w-full border rounded p-2 bg-background" />
                <p class="text-[10px] text-muted-foreground italic">Saran harga (Nilai Buku): {{ formatCurrency(bookValue) }}</p>
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium">Tanggal Penjualan</label>
                <input v-model="sellForm.date" type="date" class="w-full border rounded p-2 bg-background" />
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" @click="showSellDialog = false">Batal</Button>
            <Button @click="submitSell" :disabled="sellForm.processing">Konfirmasi Jual</Button>
        </DialogFooter>
    </DialogContent>
    </Dialog>    

    <Dialog v-model:open="showDisposeDialog">
    <DialogContent class="sm:max-w-106.25">
        <DialogHeader>
        <DialogTitle class="flex items-center gap-2 text-orange-600">
            <AlertTriangle class="size-5" /> Dispose (Buang) Aset?
        </DialogTitle>
        <DialogDescription class="pt-2 text-sm text-muted-foreground">
            Tindakan ini akan menghentikan penggunaan aset <strong>{{ asset.name }}</strong>. 
            Nilai buku saat ini sebesar <strong>{{ formatCurrency(bookValue) }}</strong> akan dicatat sebagai 
            <span class="text-red-500 font-semibold">kerugian/beban pembuangan aset</span>.
        </DialogDescription>
        </DialogHeader>

        <div class="py-4 space-y-4">
            <div class="space-y-2">
                <label class="text-[10px] uppercase font-bold text-muted-foreground">Tanggal Pembuangan</label>
                <input 
                    v-model="disposeForm.date" 
                    type="date" 
                    class="w-full text-sm border rounded p-2 bg-background focus:ring-2 focus:ring-orange-500 outline-none"
                />
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <p class="text-[10px] text-muted-foreground leading-relaxed">
                    <strong>Catatan Akuntansi:</strong> Sistem akan mendebit Akumulasi Penyusutan dan mengkredit Nilai Aset untuk membersihkan saldo di Neraca.
                </p>
            </div>
        </div>

        <DialogFooter class="flex justify-end gap-2 mt-2">
        <Button
            variant="outline"
            @click="showDisposeDialog = false"
        >
            Batal
        </Button>

        <Button
            class="bg-orange-600 hover:bg-orange-700 text-white"
            @click="submitDispose"
            :disabled="disposeForm.processing"
        >
            {{ disposeForm.processing ? 'Memproses...' : 'Konfirmasi Dispose' }}
        </Button>
        </DialogFooter>
    </DialogContent>
    </Dialog>    

    <Dialog v-model:open="showArchiveDialog">
      <DialogContent class="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-red-600">
            <AlertTriangle class="size-5" /> Arsipkan Aset Tetap?
          </DialogTitle>
            <DialogDescription class="pt-2">
            Aset <strong>{{ asset.name }}</strong> yang telah terjual/dibuang akan dipindahkan ke arsip. 
            Data ini tetap tersimpan untuk riwayat audit namun tidak akan muncul di daftar aset operasional.
            </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            @click="showArchiveDialog = false"
          >
            Batal
          </Button>

          <Button
            variant="destructive"
            @click="archiveAsset"
          >
            Ya, Arsipkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>    

    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-red-600">
            <AlertTriangle class="size-5" /> Hapus Aset Tetap?
          </DialogTitle>
          <DialogDescription class="pt-2">
            Aset <strong>{{ asset.name }}</strong> ({{ asset.asset_code }}) akan dihapus dari sistem secara permanen.
            <br /><br />
            Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi laporan neraca Anda.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            @click="showDeleteDialog = false"
          >
            Batal
          </Button>

          <Button
            variant="destructive"
            @click="deleteAsset"
          >
            Ya, Hapus Permanen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>    

    <Dialog v-model:open="showImageDeleteDialog">
        <DialogContent class="sm:max-w-100">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2 text-red-600">
                    <Trash2 class="size-5" /> Hapus Foto?
                </DialogTitle>
                <DialogDescription class="pt-2">
                    Foto ini akan dihapus permanen dari server. Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
            </DialogHeader>

            <div v-if="imageToDelete" class="mt-2 flex justify-center">
                <img :src="previewUrl(imageToDelete)" class="h-32 w-auto rounded-md border" />
            </div>

            <DialogFooter class="flex justify-end gap-2 mt-4">
                <Button variant="outline" @click="showImageDeleteDialog = false">
                    Batal
                </Button>
                <Button variant="destructive" @click="executeDeleteImage">
                    Ya, Hapus Foto
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>    

  </AppLayout>
</template>