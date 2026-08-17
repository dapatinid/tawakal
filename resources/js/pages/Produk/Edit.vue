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
import SearchableSelect from '@/components/SearchableSelect.vue';
import { type BreadcrumbItem } from '@/types';

const props = defineProps<{
  product: any,
  categories: Array<{id:number, name:string}>,
  brands: Array<{id:number, name:string}>
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: `/produk`,
    },
    {
      title: 'Detail Product',
      href: `/produk/${props.product.id}/preview`,
    },
    {
        title: 'Edit Produk',
        href: `/produk/${props.product.id}/edit`,
    },
];

// ----------------------------------
// FORM
// ----------------------------------
const form = ref({
  sku: props.product.sku ?? '',
  barcode: props.product.barcode ?? '',
  hscode: props.product.hscode ?? '',
  slug: props.product.slug ?? '',
  name: props.product.name ?? '',
  group: props.product.group ?? '',
  variant: props.product.variant ?? '',
  unit_name: props.product.unit_name ?? '',
  contain: props.product.contain ?? '',
  weight: props.product.weight ?? 0,
  panjang: props.product.panjang ?? 0,
  lebar: props.product.lebar ?? 0,
  tinggi: props.product.tinggi ?? 0,
  kg_per_meter: props.product.kg_per_meter ?? 0,
  cost_per_kg: props.product.cost_per_kg ?? 0,
  cost: props.product.cost ?? 0,
  price: props.product.price ?? 0,
  strikethroughprice: props.product.strikethroughprice ?? 0,
  poin: props.product.poin ?? 0,
  rating: props.product.rating ?? 0,
  low_stock_alert: props.product.low_stock_alert ?? 0,
  overstock_alert: props.product.overstock_alert ?? 0,
  stock: props.product.stock ?? 0,
  category_ids: props.product.categories?.map((c: any) => c.id) ?? [],
  brand_id: props.product.brand_id ?? '',
  description: props.product.description ?? '',
  is_active: Boolean(props.product.is_active),
  is_public: Boolean(props.product.is_public),
  in_stock: Boolean(props.product.in_stock),
  is_featured: Boolean(props.product.is_featured),
  is_promo: Boolean(props.product.is_promo),
});


// ----------------------------------
// DROPDOWN CATEGORY DAN BRAND
// ----------------------------------

const showCategoryDropdown = ref(false);
const categorySearch = ref('');

const filteredCategories = computed(() =>
  props.categories.filter(c =>
    c.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
);

function selectCategory(c) {
  form.value.category_id = c.id;
  categorySearch.value = c.name;
  showCategoryDropdown.value = false;
}

// --------------------------------

const showBrandDropdown = ref(false);
const brandSearch = ref('');

const filteredBrands = computed(() =>
  props.brands.filter(b =>
    b.name.toLowerCase().includes(brandSearch.value.toLowerCase())
  )
);

function selectBrand(b) {
  form.value.brand_id = b.id;
  brandSearch.value = b.name;
  showBrandDropdown.value = false;
}

categorySearch.value = props.product.category?.name ?? '';
brandSearch.value = props.product.brand?.name ?? '';

// ----------------------------------
// IMAGES STATE
// ----------------------------------
const existingImages = ref<string[]>(props.product.images ?? []);
const newImages = ref<{ file: File; preview: string }[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

// ----------------------------------
// IMAGE HANDLERS
// ----------------------------------
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

function removeExistingImage(index: number) {
  existingImages.value.splice(index, 1);
}

function removeNewImage(index: number) {
  URL.revokeObjectURL(newImages.value[index].preview);
  newImages.value.splice(index, 1);
}

function moveImageUp(index: number) {
  if (index === 0) return;
  const arr = existingImages.value;
  [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
}

function moveImageDown(index: number) {
  const arr = existingImages.value;
  if (index >= arr.length - 1) return;
  [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
}

// ----------------------------------
// SUBMIT UPDATE
// ----------------------------------
function updateProduct() {
  const formData = new FormData();

  Object.entries(form.value).forEach(([key, value]) => {
    // ARRAY (category_ids)
    if (Array.isArray(value)) {
      value.forEach((v) => {
        formData.append(`${key}[]`, String(v));
      });
      return;
    }

    // BOOLEAN → 1 / 0
    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }

    // NUMBER
    if (typeof value === 'number') {
      formData.append(key, String(value));
      return;
    }

    // NULL / UNDEFINED
    if (value === null || value === undefined) {
      formData.append(key, '');
      return;
    }

    // STRING
    formData.append(key, String(value));
  });



  formData.append('images_keep', JSON.stringify(existingImages.value));

  newImages.value.forEach((img) => {
    formData.append('images_new[]', img.file);
  });

  formData.append('_method', 'PUT');
 
  router.post(`/produk/${props.product.id}/update`, formData, {
    onSuccess: (page) => {
      const updatedId = (page.props.flash as Record<string, any>)?.updated_product_id;
      newImages.value.forEach((i) => URL.revokeObjectURL(i.preview));
      newImages.value = [];

      if (updatedId) {
        router.visit(`/produk/${updatedId}/preview`); // ← redirect manual
      }
    },
    onError: () => {},
  });
}

// ----------------------------------
// FORMAT SKU DAN SLUG
// ----------------------------------
function formatSKU() {
  if (!form.value.sku) return;
  form.value.sku = form.value.sku
    .toString()
    .trim()
    .replace(/\s+/g, ''); // hapus semua spasi
}

function generateSlug() {
  if (!form.value.slug) return;
  form.value.slug = form.value.slug
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // ganti spasi jadi dash
    .replace(/[^a-z0-9\-]/g, '') // hapus karakter selain a-z, 0-9, -
    .replace(/\-+/g, '-');       // ganti dash ganda jadi satu
}


// ----------------------------------
// FLASH MESSAGES DARI BACKEND
// ----------------------------------
const page = usePage();

// ----------------------------------
// FLASH MESSAGES (success, error, info)
// ----------------------------------
watch(
  () => page.props.flash,
  (flash) => {
    if (!flash) return;

    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
    if (flash.info) toast(flash.info);
  },
  { deep: true, immediate: true }
);

// ----------------------------------
// ERROR VALIDATION DARI BACKEND
// ----------------------------------
watch(
  () => page.props.errors,
  (errors) => {
    if (!errors) return;

    // Tampilkan semua error sebagai toast
    Object.values(errors).forEach((err: any) => {
      if (Array.isArray(err)) {
        err.forEach((e) => toast.error(e));
      } else {
        toast.error(err);
      }
    });
  },
  { deep: true, immediate: true }
);

const existingImagesPreview = computed(() =>
  existingImages.value.map(img => ({
    path: img,
    url: `/storage/${img}`,
  }))
);

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
  <Head title="Edit Produk" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <h1 class="px-4 mt-4 mb-3 text-xl font-bold">
      Product #{{ props.product.id }} {{ props.product.sku }}
    </h1>

    <div class="px-4 space-y-4 pb-10">
      <!-- FORM CARD -->

      <div class="flex flex-wrap lg:flex-nowrap gap-4">

      <div class="w-full lg:w-2/3 space-y-4">
      <Card class="px-5">
          <CardHeader>
            <CardTitle>Info Umum</CardTitle>
          </CardHeader>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Nama Produk</Label>
            <Input v-model="form.name" />
          </div>

          <div class="space-y-2">
            <Label>Grup</Label>
            <Input v-model="form.group" />
          </div>
          <div class="space-y-2">
            <Label>Varian</Label>
            <Input v-model="form.variant" />
          </div>

          <div class="space-y-2">
            <Label>Nama Satuan</Label>
            <Input v-model="form.unit_name" />
          </div>

          <div class="space-y-2">
            <Label>Isinya</Label>
            <Input v-model="form.contain" />
          </div>
        </div>
      </Card>
      
      <Card class="px-5">
          <CardHeader>
            <CardTitle>Nilai</CardTitle>
          </CardHeader>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label>Harga Dasar</Label>
            <Input v-model="form.cost" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Harga Jual</Label>
            <Input v-model="form.price" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Harga Coret</Label>
            <Input v-model="form.strikethroughprice" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Cost/kg</Label>
            <Input v-model="form.cost_per_kg" type="number" @input="calculateHarga"/>
          </div>

          <div class="space-y-2">
            <Label>Berat (kg)</Label>
            <Input v-model="form.weight" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Kg/Meter</Label>
            <Input v-model="form.kg_per_meter" type="number" @input="calculateHarga"/>
          </div>

          <div class="space-y-2">
            <Label>Panjang (m)</Label>
            <Input v-model="form.panjang" type="number" @input="calculateHarga"/>
          </div>

          <div class="space-y-2">
            <Label>Lebar (m)</Label>
            <Input v-model="form.lebar" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Tinggi (m)</Label>
            <Input v-model="form.tinggi" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Low Stock Alert</Label>
            <Input v-model="form.low_stock_alert" type="number" />
          </div>

          <div class="space-y-2">
            <Label>OverStock Alert</Label>
            <Input v-model="form.overstock_alert" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Stok</Label>
            <Input v-model="form.stock" type="number" readonly/>
          </div>

          <div class="space-y-2">
            <Label>Poin</Label>
            <Input v-model="form.poin" type="number" />
          </div>

          <div class="space-y-2">
            <Label>Rating</Label>
            <Input v-model="form.rating" type="number" max="5" />
          </div>
        </div>
      </Card>

      <!-- DESCRIPTION CARD -->
      <Card class="px-5">
          <CardHeader>
            <CardTitle>Deskripsi</CardTitle>
          </CardHeader>
        <Textarea v-model="form.description" rows="5" class="w-full" />
      </Card>
      </div>

      <div class="w-full lg:w-1/3 space-y-4">
        <Card class="px-5">
          <CardHeader>
            <CardTitle>Kode</CardTitle>
          </CardHeader>

          <!-- Slug -->
          <div class="space-y-2">
            <Label>Slug</Label>
            <Input v-model="form.slug" @blur="generateSlug" />
          </div>
          <!-- SKU -->
          <div class="space-y-2">
            <Label>SKU</Label>
            <Input v-model="form.sku" @blur="formatSKU" />
          </div>
          <!-- barcode -->
          <div class="space-y-2">
            <Label>BARCODE</Label>
            <Input v-model="form.barcode" type="alfanumeric" />
          </div>
          <!-- hscode -->
          <div class="space-y-2">
            <Label>HSCODE</Label>
            <Input v-model="form.hscode" type="alfanumeric" />
          </div>

        </Card>
        <Card class="px-5">
          <CardHeader>
            <CardTitle>Relasi</CardTitle>
          </CardHeader>
          <div class="space-y-2">
            <Label>Kategori</Label>
            <SearchableSelect
              v-model="form.category_ids"
              :items="categories"
              label="Kategori"
              multiple
            />
          </div>

          <div class="space-y-2">
            <Label>Brand</Label>
            <SearchableSelect
              v-model="form.brand_id"
              :items="brands"
              label="Brand"
            />
          </div>
        </Card>
        <Card class="px-5">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>

          <div class="w-full">
            <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
              
              <!-- OFF / Tidak Aktif -->
              <button
                class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                :class="!form.is_active
                  ? 'bg-white text-gray-700 shadow'
                  : 'text-gray-500 bg-transparent'"
                @click="form.is_active = false"
              >
                Tidak Aktif
              </button>

              <!-- ON / Aktif -->
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
          <div class="w-full">
            <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
              
              <!-- Public -->
              <button
                class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                :class="!form.is_public
                  ? 'bg-white text-gray-700 shadow'
                  : 'text-gray-500 bg-transparent'"
                @click="form.is_public = false"
              >
                Privat
              </button>

              <!-- ON / Aktif -->
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
          <div class="w-full">
            <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
              
              <!-- OFF / Tidak Aktif -->
              <button
                class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                :class="!form.in_stock
                  ? 'bg-white text-gray-700 shadow'
                  : 'text-gray-500 bg-transparent'"
                @click="form.in_stock = false"
              >
                Kosong
              </button>

              <!-- ON / Aktif -->
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
          <div class="w-full">
            <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
              
              <!-- OFF / Tidak Aktif -->
              <button
                class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                :class="!form.is_featured
                  ? 'bg-white text-gray-700 shadow'
                  : 'text-gray-500 bg-transparent'"
                @click="form.is_featured = false"
              >
                Biasa
              </button>

              <!-- ON / Aktif -->
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
          <div class="w-full">
            <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1 w-full select-none">
              
              <!-- OFF / Tidak Aktif -->
              <button
                class="flex-1 py-1 px-2 rounded-md text-center transition-all"
                :class="!form.is_promo
                  ? 'bg-white text-gray-700 shadow'
                  : 'text-gray-500 bg-transparent'"
                @click="form.is_promo = false"
              >
                Bukan
              </button>

              <!-- ON / Aktif -->
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

      <!-- IMAGES CARD -->
      <Card class="px-5">
        <div class="space-y-3">
          <Label>Images</Label>

          <!-- DROPZONE -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition"
            @dragover.prevent
            @drop="onDropFiles"
            @click="openFileInput"
          >
            <p class="text-sm text-gray-500">Klik atau seret file gambar ke sini</p>
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              multiple
              accept="image/*"
              @change="onImagesSelected"
            />
          </div>

          <!-- NEW IMAGES -->
          <div v-if="newImages.length" class="mt-4">
            <p class="font-medium mb-1">Gambar Baru (Preview)</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                v-for="(img, index) in newImages"
                :key="'new-' + index"
                class="relative group"
              >
                <img :src="img.preview" class="w-full aspect-square object-cover rounded-md" />
                <button
                  @click="removeNewImage(index)"
                  class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>

          <!-- EXISTING IMAGES -->
          <div v-if="existingImages.length" class="mt-3">
            <p class="font-medium mb-1">Gambar Lama</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                  v-for="(img, index) in existingImagesPreview"
  :key="img.path"
                class="relative group"
              >
                <img :src="img.url" class="w-full aspect-square object-cover rounded-md" />

                <div class="absolute top-1 left-1 flex gap-1">
                  <button @click.stop="moveImageUp(index)" class="bg-gray-200 text-black text-xs px-2 rounded">↑</button>
                  <button @click.stop="moveImageDown(index)" class="bg-gray-200 text-black text-xs px-2 rounded">↓</button>
                </div>
                <div class="absolute top-1 right-1 flex gap-1">
                  <button @click.stop="removeExistingImage(index)" class="bg-red-600 text-white text-xs px-2 rounded">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div class="flex justify-end">        
        <Button class="w-full md:w-auto" @click="updateProduct">Simpan Perubahan</Button>
      </div>
    </div>
  </AppLayout>
</template>