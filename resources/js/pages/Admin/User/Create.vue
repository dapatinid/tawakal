<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, useForm } from '@inertiajs/vue3'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import SearchableSelectDependent from '@/components/SearchableSelectDependent.vue'
import { type BreadcrumbItem } from '@/types'

type Option = { value: string; label: string }

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pengguna', href: '/admin/pengguna' },
  { title: 'Tambah Pengguna', href: '/admin/pengguna/create' },
]

const props = defineProps<{
  branches: Option[]
  provinces: Option[]
  cities?: Option[]
  districts?: Option[]
  villages?: Option[]
}>()

// ================= BATAS FILE (samakan dengan validasi di controller) =================
const MAX_AVATAR_KB = 2048
const MAX_COVER_KB = 4096

// ================= FORM =================
const form = useForm({
  name: '',
  email: '',
  username: '',
  phone: '',
  password: '',
  is_active: true,
  class: '',
  branch_id: null as string | null,
  street_address: '',
  zip_code: '',
  rute: '',
  province_code: null as string | null,
  city_code: null as string | null,
  district_code: null as string | null,
  village_code: null as string | null,
  avatar: null as File | null,
  cover: null as File | null,
})

// ================= LISTS =================
const cities = ref<Option[]>(props.cities ?? [])
const districts = ref<Option[]>(props.districts ?? [])
const villages = ref<Option[]>(props.villages ?? [])

// ================= MEDIA PREVIEW =================
const avatarPreview = ref<string | null>(null)
const coverPreview = ref<string | null>(null)

function setPreview(target: typeof avatarPreview, file: File | null) {
  if (target.value) URL.revokeObjectURL(target.value)
  target.value = file ? URL.createObjectURL(file) : null
}

function onFileChange(field: 'avatar' | 'cover', e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  const maxKb = field === 'avatar' ? MAX_AVATAR_KB : MAX_COVER_KB
  const preview = field === 'avatar' ? avatarPreview : coverPreview

  form.clearErrors(field)

  if (!file) {
    form[field] = null
    setPreview(preview, null)
    return
  }

  if (file.size > maxKb * 1024) {
    form[field] = null
    setPreview(preview, null)
    input.value = ''
    form.setError(field, `Ukuran file maksimal ${maxKb / 1024} MB.`)
    return
  }

  form[field] = file
  setPreview(preview, file)
}

onBeforeUnmount(() => {
  setPreview(avatarPreview, null)
  setPreview(coverPreview, null)
})

// ================= CASCADE WILAYAH =================
function loadRegion(
  key: 'cities' | 'districts' | 'villages',
  param: 'province_code' | 'city_code' | 'district_code',
  parentValue: string,
  stillValid: () => boolean,
  assign: (items: Option[]) => void,
) {
  router.reload({
    only: [key],
    data: { [param]: parentValue },
    preserveState: true,
    preserveScroll: true,
    replace: true,
    onSuccess: (page) => {
      // abaikan respons lama jika pilihan induk sudah berubah lagi
      if (!stillValid()) return
      assign((page.props[key] as Option[]) ?? [])
    },
  })
}

watch(() => form.province_code, (code) => {
  form.city_code = null
  form.district_code = null
  form.village_code = null
  cities.value = []
  districts.value = []
  villages.value = []
  if (!code) return
  loadRegion('cities', 'province_code', code, () => form.province_code === code, (v) => (cities.value = v))
})

watch(() => form.city_code, (code) => {
  form.district_code = null
  form.village_code = null
  districts.value = []
  villages.value = []
  if (!code) return
  loadRegion('districts', 'city_code', code, () => form.city_code === code, (v) => (districts.value = v))
})

watch(() => form.district_code, (code) => {
  form.village_code = null
  villages.value = []
  if (!code) return
  loadRegion('villages', 'district_code', code, () => form.district_code === code, (v) => (villages.value = v))
})

// ================= USERNAME =================
function generateSlugUsername() {
  if (!form.username) return
  form.username = form.username
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spasi jadi dash
    .replace(/[^a-z0-9\-]/g, '') // hapus karakter selain a-z, 0-9, -
    .replace(/-+/g, '-')         // dash ganda jadi satu
}

// ================= KELAS (TOGGLE) =================
const classTags = ref<string[]>([])

function toggleClass(role: string) {
  classTags.value = classTags.value.includes(role)
    ? classTags.value.filter((t) => t !== role)
    : [...classTags.value, role]
}

// ================= SUBMIT =================
function submit() {
  generateSlugUsername()

  form
    .transform((data) => ({
      ...data,
      class: classTags.value.join(', '),
    }))
    .post('/admin/pengguna', {
      forceFormData: true, // wajib agar file avatar/cover terkirim
      preserveScroll: true,
      onError: async () => {
        // gulir ke pesan error pertama
        await nextTick()
        document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      },
    })
}
</script>

<template>
  <Head title="Tambah Pengguna" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-6 space-y-6 max-w-6xl mx-auto">

      <!-- RINGKASAN ERROR -->
      <div
        v-if="form.hasErrors"
        role="alert"
        class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        Pengguna belum bisa disimpan. Periksa isian yang ditandai merah di bawah.
      </div>

      <!-- MEDIA -->
      <Card>
        <CardHeader><CardTitle>Media</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-6">
          <div class="flex flex-col items-center gap-3">
            <Label>Avatar</Label>
            <div class="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Pratinjau avatar" class="w-full h-full object-cover" />
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" class="w-40" @change="onFileChange('avatar', $event)" />
            <p class="text-xs text-muted-foreground">Maks. 2 MB</p>
            <p v-if="form.errors.avatar" data-error class="text-sm text-red-500">{{ form.errors.avatar }}</p>
          </div>

          <div class="flex flex-col gap-3">
            <Label>Cover</Label>
            <div class="w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="coverPreview" :src="coverPreview" alt="Pratinjau cover" class="w-full h-full object-cover" />
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" @change="onFileChange('cover', $event)" />
            <p class="text-xs text-muted-foreground">Maks. 4 MB</p>
            <p v-if="form.errors.cover" data-error class="text-sm text-red-500">{{ form.errors.cover }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- INFO USER -->
      <Card>
        <CardHeader><CardTitle>Info User</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">Nama</Label>
            <Input id="name" v-model="form.name" autocomplete="off" />
            <p v-if="form.errors.name" data-error class="text-sm text-red-500 mt-1">{{ form.errors.name }}</p>
          </div>

          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input id="username" v-model="form.username" autocomplete="off" @blur="generateSlugUsername" />
            <p v-if="form.errors.username" data-error class="text-sm text-red-500 mt-1">{{ form.errors.username }}</p>
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input id="phone" v-model="form.phone" type="tel" maxlength="20" autocomplete="off" />
            <p v-if="form.errors.phone" data-error class="text-sm text-red-500 mt-1">{{ form.errors.phone }}</p>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="form.email" type="email" autocomplete="off" />
            <p v-if="form.errors.email" data-error class="text-sm text-red-500 mt-1">{{ form.errors.email }}</p>
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input id="password" v-model="form.password" type="password" autocomplete="new-password" />
            <p class="text-xs text-muted-foreground mt-1">Minimal 6 karakter</p>
            <p v-if="form.errors.password" data-error class="text-sm text-red-500 mt-1">{{ form.errors.password }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- ALAMAT -->
      <Card>
        <CardHeader><CardTitle>Alamat</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <SearchableSelectDependent v-model="form.province_code" :items="props.provinces" label="Provinsi" />
              <p v-if="form.errors.province_code" data-error class="text-sm text-red-500 mt-1">{{ form.errors.province_code }}</p>
            </div>
            <div>
              <SearchableSelectDependent v-model="form.city_code" :items="cities" label="Kabupaten / Kota" :disabled="!form.province_code" />
              <p v-if="form.errors.city_code" data-error class="text-sm text-red-500 mt-1">{{ form.errors.city_code }}</p>
            </div>
            <div>
              <SearchableSelectDependent v-model="form.district_code" :items="districts" label="Kecamatan" :disabled="!form.city_code" />
              <p v-if="form.errors.district_code" data-error class="text-sm text-red-500 mt-1">{{ form.errors.district_code }}</p>
            </div>
            <div>
              <SearchableSelectDependent v-model="form.village_code" :items="villages" label="Desa" :disabled="!form.district_code" />
              <p v-if="form.errors.village_code" data-error class="text-sm text-red-500 mt-1">{{ form.errors.village_code }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="street_address">Alamat Lengkap</Label>
            <textarea
              id="street_address"
              v-model="form.street_address"
              rows="3"
              class="w-full border rounded px-3 py-2"
            />
            <p v-if="form.errors.street_address" data-error class="text-sm text-red-500 mt-1">{{ form.errors.street_address }}</p>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="zip_code">Kode Pos</Label>
              <Input id="zip_code" v-model="form.zip_code" maxlength="10" inputmode="numeric" />
              <p v-if="form.errors.zip_code" data-error class="text-sm text-red-500 mt-1">{{ form.errors.zip_code }}</p>
            </div>
            <div class="space-y-2">
              <Label for="rute">Rute</Label>
              <Input id="rute" v-model="form.rute" maxlength="100" />
              <p v-if="form.errors.rute" data-error class="text-sm text-red-500 mt-1">{{ form.errors.rute }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- STATUS -->
      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent class="flex gap-3">
          <Button type="button" :variant="form.is_active ? 'default' : 'outline'" @click="form.is_active = true">Aktif</Button>
          <Button type="button" :variant="!form.is_active ? 'default' : 'outline'" @click="form.is_active = false">Tidak Aktif</Button>
        </CardContent>
      </Card>

      <!-- PERMISSION -->
      <Card>
        <CardHeader><CardTitle>Permission</CardTitle></CardHeader>
        <CardContent class="flex gap-4 flex-wrap">
          <div>
            <Label class="mb-2 block">Pilih Kelas</Label>
            <div class="flex gap-2">
              <Button
                type="button"
                class="flex-1"
                :variant="classTags.includes('kasir') ? 'default' : 'outline'"
                @click="toggleClass('kasir')"
              >
                Kasir
              </Button>
              <Button
                type="button"
                class="flex-1"
                :variant="classTags.includes('customer') ? 'default' : 'outline'"
                @click="toggleClass('customer')"
              >
                Customer
              </Button>
              <Button
                type="button"
                class="flex-1"
                :variant="classTags.includes('supplier') ? 'default' : 'outline'"
                @click="toggleClass('supplier')"
              >
                Supplier
              </Button>
            </div>
            <p class="text-xs text-muted-foreground mt-2">
              Klik tombol untuk memilih atau membatalkan kelas. Bisa memilih lebih dari satu.
            </p>
            <p v-if="form.errors.class" data-error class="text-sm text-red-500 mt-1">{{ form.errors.class }}</p>
          </div>
          <div>
            <Label class="mb-2 block">Penugasan di Cabang</Label>
            <SearchableSelectDependent v-model="form.branch_id" :items="props.branches" label="Cabang" />
            <p v-if="form.errors.branch_id" data-error class="text-sm text-red-500 mt-1">{{ form.errors.branch_id }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- ACTION -->
      <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" :disabled="form.processing" @click="router.visit('/admin/pengguna')">
          Batal
        </Button>
        <Button class="w-full md:w-auto" type="button" :disabled="form.processing" @click="submit">
          {{ form.processing ? 'Menyimpan...' : 'Simpan' }}
        </Button>
      </div>

    </div>
  </AppLayout>
</template>