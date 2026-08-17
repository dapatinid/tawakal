<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { ref, watch, computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'vue-sonner';
import { type BreadcrumbItem } from '@/types';

const page = usePage();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Aset Tetap', href: '/aset-tetap' },
    { title: 'Tambah Aset', href: '/aset-tetap/tambah' }
];

// FORM DATA (Sesuai Migrasi Fixed Assets)
const form = ref({
  asset_code: '',
  name: '',
  category: 'kendaraan',
  purchase_date: new Date().toISOString().substr(0, 10), // Default hari ini
  purchase_cost: 0,
  residual_value: 0,
  useful_life_months: 60, // Default 5 tahun
  status: 'active',
});

// IMAGES LOGIC
const newImages = ref<{ file: File; preview: string }[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

function addFiles(files: FileList | File[]) {
  Array.from(files).forEach((file) => {
    if (!file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    newImages.value.push({ file, preview });
  });
}

function onImagesSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files) addFiles(input.files);
  input.value = '';
}

// Simulasi perhitungan penyusutan per bulan untuk UI
const monthlyEstimate = computed(() => {
  if (form.value.useful_life_months <= 0) return 0;
  return (form.value.purchase_cost - form.value.residual_value) / form.value.useful_life_months;
});

// SUBMIT STORE
function storeAsset() {
  const formData = new FormData();

  Object.entries(form.value).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  newImages.value.forEach((img) => {
    formData.append('images_new[]', img.file);
  });

  router.post('/aset-tetap', formData, {
    // onSuccess: () => {
    //   toast.success('Aset berhasil didaftarkan');
    // },
    onError: (errors) => {
      Object.values(errors).forEach((err) => toast.error(err as string));
    }
  });
}

const categories = [
    { id: 'bangunan', name: 'Bangunan' },
    { id: 'kendaraan', name: 'Kendaraan' },
    { id: 'peralatan', name: 'Peralatan' },
];
</script>

<template>
  <Head title="Tambah Aset Tetap" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="px-4 py-6 max-w-5xl mx-auto space-y-6 pb-20">
      
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold">Registrasi Aset Tetap</h1>
          <p class="text-sm text-muted-foreground">Input aset baru untuk mulai perhitungan penyusutan otomatis.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 space-y-6">
          <Card class="p-6">
            <CardHeader class="px-0 pt-0">
              <CardTitle>Informasi Aset</CardTitle>
            </CardHeader>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Kode Aset (Barcode/Internal)</Label>
                <Input v-model="form.asset_code" placeholder="Contoh: KDR-001" />
              </div>
              <div class="space-y-2">
                <Label>Nama Aset</Label>
                <Input v-model="form.name" placeholder="Misal: Toyota Avanza 2024" />
              </div>
              <div class="space-y-2">
                <Label>Kategori Aset</Label>
                <select v-model="form.category" class="w-full border rounded-md px-3 py-2 bg-background">
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <Label>Tanggal Perolehan</Label>
                <Input v-model="form.purchase_date" type="date" />
              </div>
            </div>
          </Card>

          <Card class="p-6 border-blue-100 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10">
            <CardHeader class="px-0 pt-0">
              <CardTitle class="text-blue-600 dark:text-blue-400">Data Akuntansi (Penyusutan)</CardTitle>
            </CardHeader>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label>Harga Perolehan (Rp)</Label>
                <Input v-model="form.purchase_cost" type="number" class="text-lg font-bold" />
              </div>
              <div class="space-y-2">
                <Label>Nilai Residu / Sisa (Rp)</Label>
                <Input v-model="form.residual_value" type="number" placeholder="Nilai di akhir umur" />
              </div>
              <div class="space-y-2">
                <Label>Umur Ekonomis (Bulan)</Label>
                <div class="flex items-center gap-3">
                    <Input v-model="form.useful_life_months" type="number" class="w-24" />
                    <span class="text-sm text-muted-foreground">= {{ (form.useful_life_months / 12).toFixed(1) }} Tahun</span>
                </div>
              </div>

              <div class="p-4 rounded-lg bg-white dark:bg-gray-950 border border-dashed flex flex-col justify-center">
                <span class="text-xs text-muted-foreground uppercase">Estimasi Beban / Bulan:</span>
                <span class="text-xl font-black text-green-600">
                    Rp {{ monthlyEstimate.toLocaleString() }}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div class="space-y-6">
          <Card class="p-6">
            <CardHeader class="px-0 pt-0">
              <CardTitle>Dokumentasi Fisik</CardTitle>
            </CardHeader>
            <div 
              @click="fileInput?.click()"
              class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <p class="text-xs text-gray-500">Klik untuk upload foto aset (STNK, Fisik, atau Invoice)</p>
              <input type="file" class="hidden" multiple accept="image/*" ref="fileInput" @change="onImagesSelected"/>
            </div>

            <div v-if="newImages.length" class="mt-4 grid grid-cols-2 gap-2">
              <div v-for="(img, index) in newImages" :key="index" class="relative group">
                <img :src="img.preview" class="w-full aspect-square object-cover rounded-md border" />
                <button @click="newImages.splice(index, 1)" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full size-5 text-[10px]">✕</button>
              </div>
            </div>
          </Card>

          <Card class="p-6">
            <Label>Catatan Tambahan</Label>
            <Textarea v-model="form.notes" placeholder="Lokasi penyimpanan atau nomor plat..." class="mt-2" rows="4" />
          </Card>

          <Button @click="storeAsset" class="w-full py-6 text-lg shadow-lg" size="lg">
            Simpan & Daftarkan Aset
          </Button>
        </div>

      </div>
    </div>
  </AppLayout>
</template>