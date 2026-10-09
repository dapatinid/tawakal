<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { type BreadcrumbItem } from '@/types'
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SearchableSelect from '@/components/SearchableSelect.vue';
import SearchableSelectDependent from '@/components/SearchableSelectDependent.vue';
import { Plus } from 'lucide-vue-next';

const props = defineProps<{
  user: any;
  branches: Array<{ value: string; label: string }>;
  provinces: Array<{ value: string; label: string }>;
  cities?: Array<{ value: string; label: string }>;
  districts?: Array<{ value: string; label: string }>;
  villages?: Array<{ value: string; label: string }>;
}>();

// ================= FORM DATA =================
const form = ref({
  name: props.user.name ?? '',
  username: props.user.username ?? '',
  email: props.user.email ?? '',
  phone: props.user.phone ?? '',
  password: '',
  is_active: !!props.user.is_active,
  is_admin: !!props.user.is_admin,
  level: props.user.level ?? '',
  class: props.user.class ?? '',
  branch_id: props.user.branch_id !== null ? Number(props.user.branch_id) : null,
  street_address: props.user.street_address ?? '',
  zip_code: props.user.zip_code ?? '',
  rute: props.user.rute ?? '',
  province_code: props.user.state ?? null,
  city_code: props.user.city ?? null,
  district_code: props.user.district ?? null,
  village_code: props.user.village ?? null,
  avatar: null as File | null,
  cover: null as File | null,
});

// ================= STATE LISTS =================
const branchesList = ref(props.branches ?? []);
const provincesList = ref(props.provinces ?? []);
const citiesList = ref(props.cities ?? []);
const districtsList = ref(props.districts ?? []);
const villagesList = ref(props.villages ?? []);

// ================= REAL-TIME LOCAL PREVIEW =================
const avatarLocalPreview = ref<string | null>(null);
const coverLocalPreview = ref<string | null>(null);

// Fungsi cerdas andalan pencegah broken image di Production
function getImageUrl(path: string | null) {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (!path.includes('/storage/')) {
      const url = new URL(path);
      return `${url.origin}/storage${url.pathname}`;
    }
    return path;
  }

  if (path.startsWith('storage/')) return '/' + path;
  if (path.startsWith('/storage/')) return path;

  return '/storage/' + path;
}

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (!file) return;
  form.value.avatar = file;
  avatarLocalPreview.value = URL.createObjectURL(file);
}

function onCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (!file) return;
  form.value.cover = file;
  coverLocalPreview.value = URL.createObjectURL(file);
}

// ================= CASCADING WATCHERS (ALAMAT) =================
watch(() => form.value.province_code, () => {
  form.value.city_code = null;
  form.value.district_code = null;
  form.value.village_code = null;
  citiesList.value = [];
  districtsList.value = [];
  villagesList.value = [];

  if (!form.value.province_code) return;
  router.reload({
    only: ['cities'],
    data: { province_code: form.value.province_code },
    onSuccess: page => { citiesList.value = page.props.cities ?? [] }
  });
});

watch(() => form.value.city_code, () => {
  form.value.district_code = null;
  form.value.village_code = null;
  districtsList.value = [];
  villagesList.value = [];

  if (!form.value.city_code) return;
  router.reload({
    only: ['districts'],
    data: { city_code: form.value.city_code },
    onSuccess: page => { districtsList.value = page.props.districts ?? [] }
  });
});

watch(() => form.value.district_code, () => {
  form.value.village_code = null;
  villagesList.value = [];

  if (!form.value.district_code) return;
  router.reload({
    only: ['villages'],
    data: { district_code: form.value.district_code },
    onSuccess: page => { villagesList.value = page.props.villages ?? [] }
  });
});

function generateSlugUsername() {
  if (!form.value.username) return;
  form.value.username = form.value.username
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');
}

// ================= SUBMIT =================
function submit() {
  const fd = new FormData();
  fd.append('_method', 'PUT');

  Object.entries(form.value).forEach(([k, v]) => {
    if (v === null) return;
    fd.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : (v as any));
  });

  router.post(`/admin/customer/${props.user.id}`, fd, {
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => {
      // toast.success('Data customer berhasil diperbarui');
      if (avatarLocalPreview.value) URL.revokeObjectURL(avatarLocalPreview.value);
      if (coverLocalPreview.value) URL.revokeObjectURL(coverLocalPreview.value);
      avatarLocalPreview.value = null;
      coverLocalPreview.value = null;
    }
  });
}

// ================= KELAS IDENTITAS (Toggle) =================
const userEndClassTags = ref<string[]>([])

// 1. Parsing data dari database saat halaman Edit dimuat
if (props.user.class) {
  userEndClassTags.value = props.user.class
    .split(',')
    .map(s => s.trim().toLowerCase()) // Pastikan jadi huruf kecil semua agar terbaca oleh tombol
    .filter(Boolean) // Buang elemen kosong
}

// 2. Fungsi Toggle
function toggleUserEndClass(role: string) {
  if (userEndClassTags.value.includes(role)) {
    // Jika sudah ada, hapus
    userEndClassTags.value = userEndClassTags.value.filter(t => t !== role)
  } else {
    // Jika belum ada, tambahkan
    userEndClassTags.value.push(role)
  }
  
  // Update form.class dengan string yang dipisahkan koma
  form.value.class = userEndClassTags.value.join(', ')
}

function removeUserEndClassTag(tag: string) {
  userEndClassTags.value = userEndClassTags.value.filter(t => t !== tag)
  form.value.class = userEndClassTags.value.join(', ')
}

// Global flash messaging bridge
// const page = usePage();
// watch(() => page.props.flash, (flash: any) => {
//   if (flash?.success) toast.success(flash.success);
//   if (flash?.error) toast.error(flash.error);
// }, { deep: true, immediate: true });
</script>

<template>
  <Head title="Edit Customer"/>
  <AppLayout>
    <div class="p-6 space-y-6 max-w-6xl mx-auto">

      <Card>
        <CardHeader><CardTitle>Media</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-6">
          <div class="flex flex-col items-center gap-3">
            <Label class="mb-2">Avatar</Label>
            <div class="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="avatarLocalPreview || user.avatar" :src="avatarLocalPreview || getImageUrl(user.avatar)" class="w-full h-full object-cover"/>
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" class="w-40" @change="onAvatarChange"/>
          </div>

          <div class="flex flex-col gap-3">
            <Label class="mb-2">Cover</Label>
            <div class="w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="coverLocalPreview || user.cover" :src="coverLocalPreview || getImageUrl(user.cover)" class="w-full h-full object-cover"/>
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" @change="onCoverChange"/>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Info User</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2"><Label>Nama</Label><Input v-model="form.name"/></div>
          <div class="space-y-2"><Label>Username</Label><Input v-model="form.username" @blur="generateSlugUsername"/></div>
          <div class="space-y-2"><Label>Phone</Label><Input v-model="form.phone"/></div>
          <div class="space-y-2"><Label>Email</Label><Input v-model="form.email"/></div>
          <div class="space-y-2"><Label>Password (opsional)</Label><Input type="password" v-model="form.password"/></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Alamat</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Provinsi</Label>
              <SearchableSelectDependent v-model="form.province_code" :items="provincesList" label="Provinsi"/>
            </div>
            <div class="space-y-2">
              <Label>Kabupaten / Kota</Label>
              <SearchableSelectDependent v-model="form.city_code" :items="citiesList" label="Kabupaten / Kota" :disabled="!form.province_code"/>
            </div>
            <div class="space-y-2">
              <Label>Kecamatan</Label>
              <SearchableSelectDependent v-model="form.district_code" :items="districtsList" label="Kecamatan" :disabled="!form.city_code"/>
            </div>
            <div class="space-y-2">
              <Label>Desa</Label>
              <SearchableSelectDependent v-model="form.village_code" :items="villagesList" label="Desa" :disabled="!form.district_code"/>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Alamat Lengkap</Label>
            <textarea v-model="form.street_address" rows="3" class="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2"><Label>Kode Pos</Label><Input v-model="form.zip_code"/></div>
            <div class="space-y-2"><Label>Rute</Label><Input v-model="form.rute"/></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent>
          <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1 max-w-xs">
            <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="!form.is_active ? 'bg-white shadow' : 'text-gray-500'" @click="form.is_active = false">Tidak Aktif</button>
            <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.is_active ? 'bg-green-500 text-white shadow' : 'text-gray-500'" @click="form.is_active = true">Aktif</button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Permission & Kelas</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-6">
          <div class="w-full md:w-1/2">
            <Label class="mb-2 block">Pilih Kelas</Label>
            
            <!-- Area Daftar Tag yang Sedang Aktif -->
            <div class="hidden flex flex-wrap gap-2 mb-3 min-h-[32px]">
              <span 
                v-for="tag in userEndClassTags" 
                :key="tag" 
                class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm capitalize"
              >
                {{ tag }}
                <button type="button" @click="removeUserEndClassTag(tag)" class="text-red-500 hover:text-red-700">✕</button>
              </span>
              <span v-if="userEndClassTags.length === 0" class="text-sm text-gray-400 italic py-1">
                Belum ada kelas yang dipilih.
              </span>
            </div>

            <!-- Tombol Toggle Pilihan Dropdown/Kategori -->
            <div class="flex gap-2">
              <Button 
                type="button" 
                :variant="userEndClassTags.includes('customer') ? 'default' : 'outline'" 
                @click="toggleUserEndClass('customer')"
                class="flex-1"
              >
                + Customer
              </Button>
              <Button 
                type="button" 
                :variant="userEndClassTags.includes('supplier') ? 'default' : 'outline'" 
                @click="toggleUserEndClass('supplier')"
                class="flex-1"
              >
                + Supplier
              </Button>
            </div>
            
            <p class="text-[10px] text-muted-foreground mt-2 italic">
              *Klik tombol di atas untuk memilih sebagai Customer, Supplier, atau keduanya.
            </p>
          </div>
        </CardContent>
      </Card>

      <div class="flex justify-end">
        <Button class="w-full md:w-auto" type="button" @click="submit">Simpan Perubahan</Button>
      </div>

    </div>
  </AppLayout>
</template>