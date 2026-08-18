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

const props = defineProps<{
  partners: Array<{ id: number; name: string }>;
}>();

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tambah Cabang', href: '/admin/cabang/create' },
];

const form = ref({
  partner_id: null as number | null,
  name: '',
  slug: '',
  phone: '',
  street_address: '',
  type: '',
  is_open: true,
  is_active: true,
  logo: null as File | null,
  image: null as File | null,
});

function generateSlug() {
  form.value.slug = form.value.slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');
}

function submit() {
  if (!form.value.partner_id) {
    alert('Partner wajib dipilih');
    return;
  }

  const fd = new FormData();

  Object.entries(form.value).forEach(([key, val]) => {
    if (typeof val === 'boolean') {
      fd.append(key, val ? '1' : '0');
    } else if (Array.isArray(val)) {
      val.forEach((v, i) => fd.append(`type[${i}]`, v));
    } else if (val !== null) {
      fd.append(key, val as any);
    }
  });

  router.post('/admin/cabang', fd, {
    // onSuccess: () => toast.success('Cabang berhasil ditambahkan'),
  });
}


// ================= TAG INPUT =================
const typeInput = ref('')
const typeTags = ref<string[]>([])

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
  <Head title="Tambah Cabang" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="py-4 px-3 space-y-4">

      <div class="flex flex-wrap lg:flex-nowrap gap-4">

        <!-- ================= LEFT (INFO UTAMA) ================= -->
        <div class="w-full lg:w-2/3 space-y-4">

          <!-- INFO CABANG -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Info Cabang</CardTitle>
            </CardHeader>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Partner</Label>
                <SearchableSelect
                  v-model="form.partner_id"
                  :items="partners"
                  label="Partner"
                />
              </div>

              <div class="space-y-2">
                <Label>Nama Cabang</Label>
                <Input v-model="form.name" />
              </div>

              <div class="space-y-2">
                <Label>Slug</Label>
                <Input v-model="form.slug" @blur="generateSlug" />
              </div>

              <div class="space-y-2">
                <Label>No. Telepon</Label>
                <Input v-model="form.phone" />
              </div>



              <div class="space-y-2">
                <Label>Tipe Usaha</Label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="tag in typeTags" :key="tag" class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm">
                    {{ tag }}
                    <button type="button" @click="removeTypeTag(tag)" class="text-red-500 hover:text-red-700">✕</button>
                  </span>
                </div>
                <Input v-model="typeInput" placeholder="Ketik dan tekan Enter..." @keyup.enter="addTypeTag"/>
              </div>                 
            </div>

            <div class="space-y-2 mt-4">
              <Label>Alamat</Label>
              <Textarea v-model="form.street_address" rows="3" />
            </div>
          </Card>

        </div>

        <!-- ================= RIGHT (STATUS & MEDIA) ================= -->
        <div class="w-full lg:w-1/3 space-y-4">

          <!-- STATUS -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>

            <!-- IS ACTIVE -->
            <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1">
              <button
                class="flex-1 py-1 rounded transition"
                :class="!form.is_active ? 'bg-white shadow' : 'text-gray-500'"
                @click="form.is_active = false"
              >
                Tidak Aktif
              </button>
              <button
                class="flex-1 py-1 rounded transition"
                :class="form.is_active ? 'bg-green-500 text-white shadow' : 'text-gray-500'"
                @click="form.is_active = true"
              >
                Aktif
              </button>
            </div>

            <!-- IS OPEN -->
            <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1 mt-3">
              <button
                class="flex-1 py-1 rounded transition"
                :class="!form.is_open ? 'bg-white shadow' : 'text-gray-500'"
                @click="form.is_open = false"
              >
                Tutup
              </button>
              <button
                class="flex-1 py-1 rounded transition"
                :class="form.is_open ? 'bg-green-500 text-white shadow' : 'text-gray-500'"
                @click="form.is_open = true"
              >
                Buka
              </button>
            </div>         
          </Card>

          <!-- MEDIA -->
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>

            <div class="space-y-3">
              <div>
                <Label>Logo</Label>
                <Input
                  type="file"
                  @change="e => form.logo = e.target.files?.[0] ?? null"
                />
              </div>

              <div>
                <Label>Background Image</Label>
                <Input
                  type="file"
                  @change="e => form.image = e.target.files?.[0] ?? null"
                />
              </div>
            </div>
          </Card>

        </div>
      </div>

      <!-- ACTION -->
      <div class="flex justify-end">
        <Button class="w-full md:w-auto" @click="submit">Simpan</Button>
      </div>

    </div>
  </AppLayout>
</template>
