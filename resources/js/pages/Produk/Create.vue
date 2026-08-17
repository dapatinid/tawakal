<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'vue-sonner';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { type BreadcrumbItem } from '@/types';

const page = usePage();

// Props: categories dan brands
const props = defineProps<{
  categories: Array<{id:number, name:string}>,
  brands: Array<{id:number, name:string}>
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: `/produk`,
    },
    { title: 'Buat Produk', href: '/produk/buat/baru' }
];

// FORM DATA
const form = ref({
  sku: '',
  barcode: '',
  hscode: '',
  slug: '',
  name: '',
  group: '',
  variant: '',
  unit_name: '',
  contain: '',
  weight: 0,
  panjang: 0,
  lebar: 0,
  tinggi: 0,
  kg_per_meter: 0,
  cost_per_kg: 0,
  cost: 0,
  price: 0,
  strikethroughprice: 0,
  poin: 0,
  rating: 0,
  stock: 0,
  category_ids: [] as number[],
  brand_id: '',
  description: '',
  is_active: true,
  is_public: true,
  in_stock: true,
  is_featured: false,
  is_promo: false,
});

// IMAGES
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
  if (!input.files) return;
  addFiles(input.files);
  input.value = '';
}

function openFileInput() {
  fileInput.value?.click();
}

function onDropFiles(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
}

function removeNewImage(index: number) {
  URL.revokeObjectURL(newImages.value[index].preview);
  newImages.value.splice(index, 1);
}

// Watch errors dari backend
watch(
  () => page.props.errors,
  (errors) => {
    if (!errors) return;

    // Tampilkan semua error sebagai toast
    Object.values(errors).forEach((err: any) => {
      if (Array.isArray(err)) {
        // kadang Laravel kirim array
        err.forEach((e) => toast.error(e));
      } else {
        toast.error(err);
      }
    });
  },
  { deep: true, immediate: true }
);

function formatSKU() {
  if (!form.value.sku) return; // jika kosong, biarkan
  form.value.sku = form.value.sku
    .toString()
    .trim()
    .replace(/\s+/g, ''); // hapus semua spasi
}

function generateSlug() {
  if (!form.value.slug) return; // jika kosong, biarkan
  form.value.slug = form.value.slug
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // ganti spasi jadi dash
    .replace(/[^a-z0-9\-]/g, '') // hapus karakter selain a-z, 0-9, -
    .replace(/\-+/g, '-');     // ganti dash ganda jadi satu
}

const isSubmitting = ref(false);
// SUBMIT STORE
function storeProduct() {
  if (isSubmitting.value) return; // ← tolak request kedua
  isSubmitting.value = true;

  const formData = new FormData();

  Object.entries(form.value).forEach(([key, value]) => {
    // boolean → 1 / 0
    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }

    // array (category_ids)
    if (Array.isArray(value)) {
      value.forEach(v => {
        formData.append(`${key}[]`, String(v));
      });
      return;
    }

    // number
    if (typeof value === 'number') {
      formData.append(key, String(value));
      return;
    }

    // null / undefined
    if (value === null || value === undefined) {
      formData.append(key, '');
      return;
    }

    // string
    formData.append(key, String(value));
  });


  newImages.value.forEach((img) => {
    formData.append('images_new[]', img.file);
  });

  router.post('/produk/store', formData, {
    onSuccess: (page) => {
      const newId = (page.props.flash as Record<string, any>)?.new_product_id;
      toast.success('Produk berhasil dibuat');
      newImages.value.forEach((i) => URL.revokeObjectURL(i.preview));
      newImages.value = [];

      if (newId) {
        router.visit(`/produk/${newId}/preview`); // ← redirect manual
      }
    },
    onFinish: () => {
      isSubmitting.value = false;
    },
  });
}

///// Control harga per kg sesuai panjang
// Fungsi untuk auto-kalkulasi Harga Dasar (cost)
function calculateHarga() {
  const costPerKg = Number(form.value.cost_per_kg) || 0;
  const kgPerMeter = Number(form.value.kg_per_meter) || 0;
  const panjang = Number(form.value.panjang) || 0;

  // Jika ketiga variabel sudah diisi lebih dari 0, lakukan perkalian
  if (costPerKg > 0 && kgPerMeter > 0 && panjang > 0) {
    form.value.cost = costPerKg * kgPerMeter * panjang;
    form.value.weight = kgPerMeter * panjang;
    
    // Opsional: Jika Anda ingin "Harga Jual" (price) otomatis disamakan atau ditambahkan margin, 
    // Anda bisa memodifikasinya di sini. Contoh:
    // form.value.price = form.value.cost; 
  }
}

</script>

<template>
  <Head title="Buat Produk Baru" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <h1 class="px-4 mt-4 mb-3 text-xl font-bold">
      Buat Produk Baru
    </h1>

    <div class="px-4 space-y-4 pb-10">

      <!-- FORM CARD -->
      <div class="flex flex-wrap lg:flex-nowrap gap-4">

        <div class="w-full lg:w-2/3 space-y-4">
          <!-- Info Umum -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Info Umum</CardTitle>
            </CardHeader>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nama Produk -->
              <div class="space-y-2">
                <Label>Nama Produk</Label>
                <Input v-model="form.name" />
              </div>

              <!-- Grup -->
              <div class="space-y-2">
                <Label>Grup</Label>
                <Input v-model="form.group" />
              </div>

              <!-- Varian -->
              <div class="space-y-2">
                <Label>Varian</Label>
                <Input v-model="form.variant" />
              </div>

              <!-- Nama Satuan -->
              <div class="space-y-2">
                <Label>Nama Satuan</Label>
                <Input v-model="form.unit_name" />
              </div>

              <!-- Isi -->
              <div class="space-y-2">
                <Label>Isi</Label>
                <Input v-model="form.contain" />
              </div>
            </div>
          </Card>


          <!-- Nilai -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Nilai</CardTitle>
            </CardHeader>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Harga Dasar -->
              <div class="space-y-2">
                <Label>Harga Dasar</Label>
                <Input v-model="form.cost" type="number" />
              </div>

              <!-- Harga Jual -->
              <div class="space-y-2">
                <Label>Harga Jual</Label>
                <Input v-model="form.price" type="number" />
              </div>

              <!-- Harga Coret -->
              <div class="space-y-2">
                <Label>Harga Coret</Label>
                <Input v-model="form.strikethroughprice" type="number" />
              </div>

              <!-- Harga per kg -->
              <div class="space-y-2">
                <Label>Harga per kg</Label>
                <Input v-model="form.cost_per_kg" type="number" @input="calculateHarga"/>
              </div>

              <!-- Berat (kg) -->
              <div class="space-y-2">
                <Label>Berat (kg)</Label>
                <Input v-model="form.weight" type="number" />
              </div>

              <!-- Kg/Meter -->
              <div class="space-y-2">
                <Label>Kg/Meter</Label>
                <Input v-model="form.kg_per_meter" type="number" @input="calculateHarga"/>
              </div>

              <!-- Panjang (m) -->
              <div class="space-y-2">
                <Label>Panjang (m)</Label>
                <Input v-model="form.panjang" type="number" @input="calculateHarga"/>
              </div>
              <!-- Lebar (m) -->
              <div class="space-y-2">
                <Label>Lebar (m)</Label>
                <Input v-model="form.lebar" type="number" />
              </div>
              <!-- Tinggi (m) -->
              <div class="space-y-2">
                <Label>Tinggi (m)</Label>
                <Input v-model="form.tinggi" type="number" />
              </div>

              <!-- Poin -->
              <div class="space-y-2">
                <Label>Poin</Label>
                <Input v-model="form.poin" type="number" />
              </div>

              <!-- Rating -->
              <div class="space-y-2">
                <Label>Rating</Label>
                <Input v-model="form.rating" type="number" max="5" />
              </div>

              <!-- Stok -->
              <div class="space-y-2 hidden">
                <Label>Stok</Label>
                <Input v-model="form.stock" type="number" readonly/>
              </div>
            </div>
          </Card>


          <!-- Deskripsi -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Deskripsi</CardTitle>
            </CardHeader>
            <Textarea v-model="form.description" rows="5" class="w-full" />
          </Card>
        </div>

        <div class="w-full lg:w-1/3 space-y-4">
          <!-- Kode -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Kode</CardTitle>
            </CardHeader>
            <Label>Slug</Label>
            <Input
              v-model="form.slug"
              placeholder="Masukkan slug"
              @blur="generateSlug"
            />
            <Label>SKU</Label>
            <Input
              v-model="form.sku"
              placeholder="Masukkan SKU"
              @blur="formatSKU"
            />
            <Label>BARCODE</Label>
            <Input
              v-model="form.barcode"
              placeholder="Masukkan BARCODE"
            />
            <Label>HSCODE</Label>
            <Input
              v-model="form.hscode"
              placeholder="Masukkan HSCODE"
            />
          </Card>

          <!-- Relasi -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Relasi</CardTitle>
            </CardHeader>
            <Label>Kategori</Label>
            <SearchableSelect v-model="form.category_ids" :items="props.categories" label="Kategori" multiple/>
            <Label>Brand</Label>
            <SearchableSelect v-model="form.brand_id" :items="props.brands" label="Brand" />
          </Card>

          <!-- Status -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>

            <!-- Aktif / Tidak Aktif -->
            <div class="w-full">
              <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="!form.is_active
                    ? 'bg-white text-gray-700 shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_active = false"
                >
                  Tidak Aktif
                </button>
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="form.is_active
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_active = true"
                >
                  Aktif
                </button>
              </div>
            </div>

            <!-- Pakah Pulic -->
            <div class="w-full">
              <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="!form.is_public
                    ? 'bg-white text-gray-700 shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_public = false"
                >
                  Privat
                </button>
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="form.is_public
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_public = true"
                >
                  Publik
                </button>
              </div>
            </div>

            <!-- Stok -->
            <div class="w-full">
              <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="!form.in_stock
                    ? 'bg-white text-gray-700 shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.in_stock = false"
                >
                  Kosong
                </button>
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="form.in_stock
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.in_stock = true"
                >
                  Ada Stok
                </button>
              </div>
            </div>

            <!-- Unggulan -->
            <div class="w-full">
              <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="!form.is_featured
                    ? 'bg-white text-gray-700 shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_featured = false"
                >
                  Biasa
                </button>
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="form.is_featured
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_featured = true"
                >
                  Unggulan
                </button>
              </div>
            </div>

            <!-- Promo -->
            <div class="w-full">
              <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="!form.is_promo
                    ? 'bg-white text-gray-700 shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_promo = false"
                >
                  Bukan
                </button>
                <button
                  class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                  :class="form.is_promo
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-500 bg-transparent'"
                  @click="form.is_promo = true"
                >
                  Promo
                </button>
              </div>
            </div>

          </Card>

        </div>
      </div>

      <!-- Images -->
      <!-- <Card class="px-5">
        <Label>Images</Label>
        <div class="border-2 border-dashed rounded-md p-6 text-center cursor-pointer" @dragover.prevent @drop="onDropFiles" @click="openFileInput">
          Klik atau seret gambar ke sini
          <input type="file" class="hidden" multiple accept="image/*" ref="fileInput" @change="onImagesSelected"/>
        </div>

        <div v-if="newImages.length" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="(img, index) in newImages" :key="index" class="relative">
            <img :src="img.preview" class="w-full aspect-square object-cover rounded-md" />
            <button @click.stop="removeNewImage(index)" class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded">Batal</button>
          </div>
        </div>
      </Card> -->

      <div class="flex justify-end">
        <Button @click="storeProduct" :disabled="isSubmitting" class="w-full md:w-auto">{{ isSubmitting ? 'Menyimpan...' : 'Buat Produk' }}</Button>
      </div>

    </div>
  </AppLayout>
</template>
