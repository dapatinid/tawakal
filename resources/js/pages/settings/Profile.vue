<script setup lang="ts">
import { Form, Head, Link, usePage, router } from '@inertiajs/vue3';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem } from '@/types';
import { ref, watch, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import SearchableSelectDependent from '@/components/SearchableSelectDependent.vue'
import { Pencil, Image, UserRound } from 'lucide-vue-next';

const props = defineProps<{
  user: any,
  provinces: any[],
  cities?: any[],
  districts?: any[],
  villages?: any[]
}>()


const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Profile settings', href: 'settings/profile' },
];



// ================= FORM =================
const form = ref({
  name: props.user.name ?? '',
  username: props.user.username ?? '',
  email: props.user.email ?? '',
  phone: props.user.phone ?? '',
  password: '',

  street_address: props.user.street_address ?? '',
  zip_code: props.user.zip_code ?? '',
  rute: props.user.rute ?? '',

  province_code: props.user.state ?? null,
  city_code: props.user.city ?? null,
  district_code: props.user.district ?? null,
  village_code: props.user.village ?? null,

  avatar: null as File | null,
  cover: null as File | null
})

// ================= LIST =================
const provinces = ref(props.provinces ?? [])
const cities = ref(props.cities ?? [])
const districts = ref(props.districts ?? [])
const villages = ref(props.villages ?? [])

// ================= PREVIEW =================
const avatarPreview = ref(props.user.avatar ? `/storage/${props.user.avatar}` : null)
const coverPreview = ref(props.user.cover ? `/storage/${props.user.cover}` : null)

function onAvatarChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  form.value.avatar = f
  avatarPreview.value = URL.createObjectURL(f)
}

function onCoverChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  form.value.cover = f
  coverPreview.value = URL.createObjectURL(f)
}

// ================= CASCADE =================
watch(() => form.value.province_code, () => {
  form.value.city_code = null
  form.value.district_code = null
  form.value.village_code = null
  cities.value = []
  districts.value = []
  villages.value = []

  if (!form.value.province_code) return
  router.reload({
    only: ['cities'],
    data: { province_code: form.value.province_code },
    onSuccess: page => cities.value = page.props.cities ?? []
  })
})

watch(() => form.value.city_code, () => {
  form.value.district_code = null
  form.value.village_code = null
  districts.value = []
  villages.value = []

  if (!form.value.city_code) return
  router.reload({
    only: ['districts'],
    data: { city_code: form.value.city_code },
    onSuccess: page => districts.value = page.props.districts ?? []
  })
})

watch(() => form.value.district_code, () => {
  form.value.village_code = null
  villages.value = []

  if (!form.value.district_code) return
  router.reload({
    only: ['villages'],
    data: { district_code: form.value.district_code },
    onSuccess: page => villages.value = page.props.villages ?? []
  })
})

function generateSlugUsername() {
  if (!form.value.username) return;
  form.value.username = form.value.username
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // ganti spasi jadi dash
    .replace(/[^a-z0-9\-]/g, '') // hapus karakter selain a-z, 0-9, -
    .replace(/\-+/g, '-');       // ganti dash ganda jadi satu
}

// ================= VALIDATION =================
const isFormValid = computed(() => {
  return (
    !!form.value.name?.trim() &&
    !!form.value.username?.trim() &&
    !!form.value.phone?.trim() &&
    !!form.value.email?.trim() &&
    !!form.value.province_code &&
    !!form.value.city_code &&
    !!form.value.district_code &&
    !!form.value.village_code &&
    !!form.value.street_address?.trim()
  )
})

// ================= SUBMIT =================
function submit() {
  const fd = new FormData()
  fd.append('_method', 'PATCH')

  Object.entries(form.value).forEach(([k, v]) => {
    if (v === null) return
    fd.append(k, v as any)
  })

  router.post('/settings/profile', fd, {
    preserveScroll: true,
    forceFormData: true,
  })
}


</script>


<template>
  <AppLayout :breadcrumbs="breadcrumbItems">
    <Head title="Profile settings" />
    <SettingsLayout>
    


    <div class="pb-2 space-y-6 max-w-5xl mx-auto">

    <!-- MEDIA -->
    <Card>

      <CardContent>
        <div class="relative">

          <!-- COVER -->
          <label
            class="group relative block h-40 w-full cursor-pointer overflow-hidden rounded-xl bg-muted"
          >
            <!-- Preview Image -->
            <img
              v-if="coverPreview"
              :src="coverPreview"
              class="h-full w-full object-cover"
            />

            <!-- Default Icon jika kosong -->
            <div
              v-else
              class="flex h-full w-full items-center justify-center text-muted-foreground"
            >
              <Image class="h-10 w-10" />
            </div>

            <!-- Pencil Overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center
                    bg-black/30 opacity-0 transition
                    group-hover:opacity-100"
            >
              <Pencil class="size-5 text-accent" />
            </div>

            <input
              type="file"
              class="hidden"
              accept="image/*"
              @change="onCoverChange"
            />
          </label>

          <!-- AVATAR -->
          <label
            class="group absolute left-1/2 -bottom-10 flex h-24 w-24
                  -translate-x-1/2 cursor-pointer items-center
                  justify-center overflow-hidden rounded-full
                  border-4 border-background bg-background shadow-xl"
          >
            <!-- Preview Image -->
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              class="h-full w-full object-cover"
            />

            <!-- Default Icon jika kosong -->
            <div
              v-else
              class="flex h-full w-full items-center justify-center
                    text-muted-foreground"
            >
              <UserRound class="h-8 w-8" />
            </div>

            <!-- Pencil Overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center
                    bg-black/30 opacity-0 transition
                    group-hover:opacity-100"
            >
              <Pencil class="size-5 text-accent" />
            </div>

            <input
              type="file"
              class="hidden"
              accept="image/*"
              @change="onAvatarChange"
            />
          </label>


        </div>

        <!-- Spacer karena avatar overlap -->
        <div class="mt-14 block gap-3 space-y-4">
          <div class="flex w-full"><input v-model="form.name" placeholder="Nama" class="text-center mx-auto outline-0 font-black"/></div>
          <div><label class="mb-2">Username</label><Input v-model="form.username" placeholder="Username" @blur="generateSlugUsername"/></div>
          <div><label class="mb-2">Phone</label><Input v-model="form.phone" placeholder="Phone"/></div>
          <div><label class="mb-2">Email</label><Input v-model="form.email" placeholder="Email" /></div>
        </div>
      </CardContent>
    </Card>


      <!-- INFO -->
      <!-- <Card>
        <CardHeader><CardTitle>Akun</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-4">                              
          <Input type="password" v-model="form.password" placeholder="Password (opsional)" />
        </CardContent>
      </Card> -->

      <!-- ALAMAT -->
      <Card>
        <CardHeader><CardTitle>Alamat</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <SearchableSelectDependent v-model="form.province_code" :items="provinces" label="Provinsi" />
          <SearchableSelectDependent v-model="form.city_code" :items="cities" label="Kota" />
          <SearchableSelectDependent v-model="form.district_code" :items="districts" label="Kecamatan" />
          <SearchableSelectDependent v-model="form.village_code" :items="villages" label="Desa" />

          <textarea v-model="form.street_address" placeholder="Detail Alamat : Gang, Jalan, RT / RW, Dusun." class="w-full border rounded p-2" />
          <Input v-model="form.zip_code" placeholder="KODE POS - tidak wajib diisi" />
          <!-- <Input v-model="form.rute" placeholder="Rute" /> -->
        </CardContent>
      </Card>

      <p v-show="!isFormValid" class="text-foreground text-sm">
        ℹ️ Silakan lengkapi semua field yang wajib diisi.
      </p>

      <div class="flex w-full">
        <Button class="w-full disabled:opacity-50 disabled:cursor-not-allowed" @click="submit" :disabled="!isFormValid">Simpan</Button>
      </div>

    </div>


    </SettingsLayout>
  </AppLayout>
</template>
