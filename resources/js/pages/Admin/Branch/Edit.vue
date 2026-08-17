<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { type BreadcrumbItem } from '@/types';
import { SendHorizontal } from 'lucide-vue-next';

const props = defineProps<{
  branch: any;
  partners: Array<{ id: number; name: string }>;
}>();

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Edit Cabang', href: `/admin/cabang/${props.branch.id}/edit` },
];

const form = ref({
  partner_id: props.branch.partner_id,
  name: props.branch.name ?? '',
  slug: props.branch.slug ?? '',
  phone: props.branch.phone ?? '',
  type: props.branch.type ?? '',
  street_address: props.branch.street_address ?? '',
  is_open: !!props.branch.is_open,
  is_active: !!props.branch.is_active,
  logo: null as File | null,
  image: null as File | null,
});

// State untuk preview gambar baru secara real-time
const logoPreview = ref<string | null>(null);
const imagePreview = ref<string | null>(null);

// Fungsi cerdas untuk memperbaiki url broken di production
function getImageUrl(path: string | null) {
  if (!path) return '';

  // 1. Jika path adalah URL lengkap (seperti https://dapatin.id/branches/logo/...)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Cek apakah URL tersebut belum punya '/storage/'
    if (!path.includes('/storage/')) {
      // Kita selipkan '/storage/' tepat setelah nama domain utama
      const url = new URL(path);
      return `${url.origin}/storage${url.pathname}`;
    }
    return path;
  }

  // 2. Jika path adalah path relatif (seperti branches/logo/...)
  if (path.startsWith('storage/')) {
    return '/' + path;
  }
  if (path.startsWith('/storage/')) {
    return path;
  }

  return '/storage/' + path;
}

function handleLogoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  form.value.logo = file;
  logoPreview.value = file ? URL.createObjectURL(file) : null;
}

function handleImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  form.value.image = file;
  imagePreview.value = file ? URL.createObjectURL(file) : null;
}

function generateSlugSelf() {
  form.value.slug = form.value.slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
}

function submit() {
  const fd = new FormData();

  Object.entries(form.value).forEach(([key, val]) => {
    if (typeof val === 'boolean') {
      fd.append(key, val ? '1' : '0');
    } else if (val !== null) {
      fd.append(key, val as any);
    }
  });

  fd.append('_method', 'PUT');

  router.post(`/admin/cabang/${props.branch.id}`, fd, {
    preserveState: true,
    onSuccess: () => toast.success('Cabang berhasil diperbarui'),
  });
}

// ================= TAG INPUT =================
const typeInput = ref('')
const typeTags = ref<string[]>([])

if (form.value.type) {
  typeTags.value = form.value.type.split(',').map(s => s.trim())
}

function addTypeTag() {
  const value = typeInput.value.trim()
  if (!value) return
  if (!typeTags.value.includes(value)) {
    typeTags.value.push(value)
  }
  typeInput.value = ''
  form.value.type = typeTags.value.join(', ')
}

function removeTypeTag(tag: string) {
  typeTags.value = typeTags.value.filter(t => t !== tag)
  form.value.type = typeTags.value.join(', ')
}
</script>

<template>
  <Head title="Edit Cabang" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="py-4 px-3 space-y-4">
      <div class="flex flex-wrap lg:flex-nowrap gap-4">
        <div class="w-full lg:w-2/3 space-y-4">
          <Card class="px-5">
            <CardHeader><CardTitle>Info Cabang</CardTitle></CardHeader>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Partner</Label>
                <SearchableSelect v-model="form.partner_id" :items="partners" label="Partner" />
              </div>
              <div class="space-y-2">
                <Label>Nama Cabang</Label>
                <Input v-model="form.name" />
              </div>
              <div class="space-y-2">
                <Label>Slug</Label>
                <Input v-model="form.slug" @input="generateSlugSelf" />
              </div>
              <div class="space-y-2">
                <Label>No. Telepon</Label>
                <Input v-model="form.phone" />
              </div>
            </div>

            <div class="mt-4">
              <Label class="mb-2 block">Tipe Usaha</Label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="tag in typeTags" :key="tag" class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm">
                  {{ tag }}
                  <button type="button" @click="removeTypeTag(tag)" class="text-red-500 hover:text-red-700">✕</button>
                </span>
              </div>
              
              <div class="relative flex items-center">
                <Input 
                  v-model="typeInput" 
                  placeholder="Ketik dan tekan Enter atau tombol kirim..." 
                  @keyup.enter="addTypeTag"
                  class="pr-10" 
                />
                
                <button 
                  type="button"
                  @click="addTypeTag"
                  v-show="typeInput.trim() !== ''"
                  class="absolute right-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                  title="Tambah tipe"
                >
                  <SendHorizontal class="size-4" />
                </button>
              </div>
            </div>      

            <div class="space-y-2 mt-4">
              <Label>Alamat</Label>
              <Textarea v-model="form.street_address" rows="3" />
            </div>
          </Card>
        </div>

        <div class="w-full lg:w-1/3 space-y-4">
          <Card class="px-5">
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1">
              <button type="button" class="flex-1 py-1 rounded transition" :class="!form.is_active ? 'bg-white shadow' : 'text-gray-500'" @click="form.is_active = false">Tidak Aktif</button>
              <button type="button" class="flex-1 py-1 rounded transition" :class="form.is_active ? 'bg-green-500 text-white shadow' : 'text-gray-500'" @click="form.is_active = true">Aktif</button>
            </div>
            <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1 mt-3">
              <button type="button" class="flex-1 py-1 rounded transition" :class="!form.is_open ? 'bg-white shadow' : 'text-gray-500'" @click="form.is_open = false">Tutup</button>
              <button type="button" class="flex-1 py-1 rounded transition" :class="form.is_open ? 'bg-green-500 text-white shadow' : 'text-gray-500'" @click="form.is_open = true">Buka</button>
            </div>
          </Card>

          <Card class="px-5">
            <CardHeader><CardTitle>Media</CardTitle></CardHeader>
            <div class="space-y-3">
              <div>
                <Label>Logo</Label>
                <Input type="file" accept="image/*" @change="handleLogoChange" />
                <img v-if="logoPreview || branch.logo" :src="logoPreview || getImageUrl(branch.logo)" class="h-16 mt-2 rounded object-cover" />
              </div>
              <div>
                <Label>Background Image</Label>
                <Input type="file" accept="image/*" @change="handleImageChange" />
                <img v-if="imagePreview || branch.image" :src="imagePreview || getImageUrl(branch.image)" class="h-28 mt-2 rounded object-cover" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div class="flex justify-end">
        <Button class="w-full md:w-auto" @click="submit">Simpan Perubahan</Button>
      </div>
    </div>
  </AppLayout>
</template>