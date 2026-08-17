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
import { type BreadcrumbItem } from '@/types';
import { SendHorizontal } from 'lucide-vue-next';

const props = defineProps<{
  partner: any;
}>();

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Edit Mitra', href: `/admin/mitra/${props.partner.id}/edit` },
];

function toDatetimeLocal(dateStr: string | null) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const offset = 7 * 60 * 60 * 1000; // WIB UTC+7
  const local = new Date(date.getTime() + offset);
  return local.toISOString().slice(0, 16);
}

const form = ref({
  name: props.partner.name ?? '',
  slug: props.partner.slug ?? '',
  phone: props.partner.phone ?? '',
  type: props.partner.type ?? '',
  street_address: props.partner.street_address ?? '',
  is_open: !!props.partner.is_open,
  is_active: !!props.partner.is_active,
  logo: null as File | null,
  image: null as File | null,
  registered: toDatetimeLocal(props.partner.registered),
  expires_on: toDatetimeLocal(props.partner.expires_on),
});

const logoPreview = ref<string | null>(null);
const imagePreview = ref<string | null>(null);

// Fungsi cerdas untuk memperbaiki url broken di production
function getImageUrl(path: string | null) {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (!path.includes('/storage/')) {
      const url = new URL(path);
      return `${url.origin}/storage${url.pathname}`;
    }
    return path;
  }

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
    .replace(/\-+/g, '-');
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

  router.post(`/admin/mitra/${props.partner.id}`, fd, {
    preserveState: true,
    onSuccess: () => toast.success('Data partner berhasil diperbarui'),
  });
}

// ================= TAG INPUT =================
const typeInput = ref('');
const typeTags = ref<string[]>([]);

if (form.value.type) {
  typeTags.value = form.value.type.split(',').map(s => s.trim());
}

function addTypeTag() {
  const value = typeInput.value.trim();
  if (!value) return;
  if (!typeTags.value.includes(value)) {
    typeTags.value.push(value);
  }
  typeInput.value = '';
  form.value.type = typeTags.value.join(', ');
}

function removeTypeTag(tag: string) {
  typeTags.value = typeTags.value.filter(t => t !== tag);
  form.value.type = typeTags.value.join(', ');
}
</script>

<template>
  <Head title="Edit Mitra" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <h1 class="px-4 mt-4 mb-3 text-xl font-bold">Partner #{{ props.partner.id }} — {{ props.partner.name }}</h1>
    <div class="px-4 space-y-4 pb-10">
      <div class="flex flex-wrap lg:flex-nowrap gap-4">
        <div class="w-full lg:w-2/3 space-y-4">
          <Card class="px-5">
            <CardHeader><CardTitle>Info Partner</CardTitle></CardHeader>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2"><Label>Nama Partner</Label><Input v-model="form.name" /></div>
              <div class="space-y-2"><Label>Slug</Label><Input v-model="form.slug" @input="generateSlugSelf"/></div>
              <div class="space-y-2"><Label>No. Telepon</Label><Input v-model="form.phone" /></div>
              <div>
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
                    placeholder="Ketik dan tekan Enter..." 
                    @keyup.enter="addTypeTag" 
                    class="pr-10"
                  />
                  
                  <button
                    type="button"
                    @click="addTypeTag"
                    v-show="typeInput.trim() !== ''"
                    class="absolute right-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none flex items-center justify-center"
                    title="Tambah tipe"
                  >
                    <SendHorizontal class="size-4" />
                  </button>
                </div>
              </div>              
            </div>
          </Card>
          <Card class="px-5">
            <CardHeader><CardTitle>Alamat</CardTitle></CardHeader>
            <div class="pb-5"><Textarea v-model="form.street_address" rows="4" /></div>
          </Card>
        </div>
        <div class="w-full lg:w-1/3 space-y-4">
          <Card class="px-5">
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <div class="pb-5 space-y-4">
              <div class="space-y-2">
                <Label>Aktif</Label>
                <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1">
                  <button type="button" class="flex-1 py-1 rounded-md transition" :class="!form.is_active ? 'bg-white shadow text-gray-700' : 'text-gray-500'" @click="form.is_active = false">Tidak Aktif</button>
                  <button type="button" class="flex-1 py-1 rounded-md transition" :class="form.is_active ? 'bg-green-500 text-white shadow' : 'text-gray-500'" @click="form.is_active = true">Aktif</button>
                </div>
              </div>
              <div class="space-y-2">
                <Label>Status Operasional</Label>
                <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1">
                  <button type="button" class="flex-1 py-1 rounded-md transition" :class="!form.is_open ? 'bg-white shadow text-gray-700' : 'text-gray-500'" @click="form.is_open = false">Tutup</button>
                  <button type="button" class="flex-1 py-1 rounded-md transition" :class="form.is_open ? 'bg-green-500 text-white shadow' : 'text-gray-500'" @click="form.is_open = true">Buka</button>
                </div>
              </div>
            </div>
          </Card>
          <Card class="px-5">
            <CardHeader><CardTitle>Langganan</CardTitle></CardHeader>
            <div class="space-y-3 pb-5">
              <div class="space-y-2"><Label>Tanggal Mulai (Registered)</Label><Input type="datetime-local" v-model="form.registered" /></div>
              <div class="space-y-2"><Label>Tanggal Berakhir (Expires On)</Label><Input type="datetime-local" v-model="form.expires_on" /></div>
            </div>
          </Card>
          <Card class="px-5">
            <CardHeader><CardTitle>Media</CardTitle></CardHeader>
            <div class="space-y-3 pb-5">
              <div>
                <Label>Logo</Label>
                <Input type="file" accept="image/*" @change="handleLogoChange" />
                <img v-if="logoPreview || partner.logo" :src="logoPreview || getImageUrl(partner.logo)" class="h-16 mt-2 rounded bg-white object-cover" />
              </div>
              <div>
                <Label>Background</Label>
                <Input type="file" accept="image/*" @change="handleImageChange" />
                <img v-if="imagePreview || partner.image" :src="imagePreview || getImageUrl(partner.image)" class="h-24 mt-2 rounded object-cover" />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div class="flex justify-end"><Button class="w-full sm:w-auto" @click="submit">Simpan Perubahan</Button></div>
    </div>
  </AppLayout>
</template>