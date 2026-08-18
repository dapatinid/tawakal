<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { type BreadcrumbItem } from '@/types'

/* =========================
   BREADCRUMB
========================= */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tambah Mitra', href: '/admin/mitra/create' },
]

const now = new Date()
const oneYearLater = new Date()
oneYearLater.setFullYear(now.getFullYear() + 1)

function toDatetimeLocal(date: Date) {
  return date.toISOString().slice(0, 16)
}

/* =========================
   FORM STATE
========================= */
const form = ref({
  name: '',
  slug: '',
  phone: '',
  street_address: '',
  type: [] as any[],
  is_open: true,
  is_active: true,
  logo: null as File | null,
  image: null as File | null,
  registered: toDatetimeLocal(now),        // ✅ default now
  expires_on: toDatetimeLocal(oneYearLater), // ✅ default 1 tahun
})

/* =========================
   SLUG GENERATOR
========================= */
function generateSlug() {
  if (!form.value.name) return

  form.value.slug = form.value.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
}
function generateSlugSelf() {

  form.value.slug = form.value.slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
}

/* =========================
   SUBMIT
========================= */
function submit() {
  const fd = new FormData()

  fd.append('name', form.value.name)
  fd.append('slug', form.value.slug)
  fd.append('phone', form.value.phone ?? '')
  fd.append('street_address', form.value.street_address ?? '')
  fd.append('is_open', form.value.is_open ? '1' : '0')
  fd.append('is_active', form.value.is_active ? '1' : '0')
  fd.append('registered', form.value.registered ?? '')
  fd.append('expires_on', form.value.expires_on ?? '')

  if (Array.isArray(form.value.type)) {
    form.value.type.forEach((t, i) => {
      fd.append(`type[${i}]`, t)
    })
  }

  if (form.value.logo) fd.append('logo', form.value.logo)
  if (form.value.image) fd.append('image', form.value.image)

  router.post('/admin/mitra', fd, {
    // onSuccess: () => {
    //   toast.success('Partner berhasil ditambahkan')
    // },
  })
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
  <Head title="Tambah Mitra" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <h1 class="px-4 mt-4 mb-3 text-xl font-bold">
      Tambah Partner
    </h1>

    <div class="px-4 space-y-4 pb-10">
      <div class="flex flex-wrap lg:flex-nowrap gap-4">

        <!-- LEFT -->
        <div class="w-full lg:w-2/3 space-y-4">
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Info Partner</CardTitle>
            </CardHeader>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Nama Partner</Label>
                <Input v-model="form.name" @blur="generateSlug" />
              </div>

              <div class="space-y-2">
                <Label>Slug</Label>
                <Input v-model="form.slug" @input="generateSlugSelf"/>
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
          </Card>

          <Card class="px-5">
            <CardHeader>
              <CardTitle>Alamat</CardTitle>
            </CardHeader>
            <Textarea v-model="form.street_address" rows="4" />
          </Card>
        </div>

        <!-- RIGHT -->
        <div class="w-full lg:w-1/3 space-y-4">
          <Card class="px-5">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>

            <!-- IS ACTIVE -->
            <div class="space-y-2">
              <Label>Aktif</Label>
              <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1">
                <button
                  class="flex-1 py-1 rounded-md transition"
                  :class="!form.is_active
                    ? 'bg-white shadow text-gray-700'
                    : 'text-gray-500'"
                  @click="form.is_active = false"
                >
                  Tidak Aktif
                </button>
                <button
                  class="flex-1 py-1 rounded-md transition"
                  :class="form.is_active
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-500'"
                  @click="form.is_active = true"
                >
                  Aktif
                </button>
              </div>
            </div>

            <!-- IS OPEN -->
            <div class="space-y-2 mt-3">
              <Label>Status Operasional</Label>
              <div class="bg-gray-100 dark:bg-gray-950 flex rounded-lg p-2 gap-1">
                <button
                  class="flex-1 py-1 rounded-md transition"
                  :class="!form.is_open
                    ? 'bg-white shadow text-gray-700'
                    : 'text-gray-500'"
                  @click="form.is_open = false"
                >
                  Tutup
                </button>
                <button
                  class="flex-1 py-1 rounded-md transition"
                  :class="form.is_open
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-500'"
                  @click="form.is_open = true"
                >
                  Buka
                </button>
              </div>
            </div>
          </Card>

          <Card class="px-5">
            <CardHeader>
              <CardTitle>Langganan</CardTitle>
            </CardHeader>

            <div class="space-y-3">
              <div class="space-y-2">
                <Label>Tanggal Mulai (Registered)</Label>
                <Input
                  type="datetime-local"
                  v-model="form.registered"
                />
              </div>

              <div class="space-y-2">
                <Label>Tanggal Berakhir (Expires On)</Label>
                <Input
                  type="datetime-local"
                  v-model="form.expires_on"
                />
              </div>
            </div>
          </Card>

          <Card class="px-5">
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>

            <div class="space-y-3">
              <div class="space-y-2">
                <Label>Logo</Label>
                <Input
                  type="file"
                  @change="e => form.logo = e.target.files?.[0] ?? null"
                />
              </div>

              <div class="space-y-2">
                <Label>Background</Label>
                <Input
                  type="file"
                  @change="e => form.image = e.target.files?.[0] ?? null"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div class="flex justify-end">
        <Button class="w-full sm:w-auto" @click="submit">
          Simpan Partner
        </Button>
      </div>
    </div>
  </AppLayout>
</template>
