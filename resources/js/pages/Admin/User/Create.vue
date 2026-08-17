<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, usePage } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import SearchableSelect from '@/components/SearchableSelect.vue'
import SearchableSelectDependent from '@/components/SearchableSelectDependent.vue'
import { Plus } from 'lucide-vue-next'

const props = defineProps<{
  branches: Array<{ value: string; label: string }>,
  provinces: Array<{ value: string; label: string }>,
  cities?: Array<{ value: string; label: string }>,
  districts?: Array<{ value: string; label: string }>,
  villages?: Array<{ value: string; label: string }>
}>()

// ================= DATA =================
const form = ref({
  name: '',
  email: '',
  username: '',
  phone: '',
  password: '',
  is_active: true,
  is_admin: false,
  level: '',
  class: '',
  branch_id: null,
  street_address: '',
  zip_code: '',
  rute: '',
  province_code: null,
  city_code: null,
  district_code: null,
  village_code: null,
  avatar: null as File | null,
  cover: null as File | null
})

// ================= LISTS =================
const branches = ref(props.branches ?? [])
const provinces = ref(props.provinces ?? [])
const cities = ref(props.cities ?? [])
const districts = ref(props.districts ?? [])
const villages = ref(props.villages ?? [])

// ================= MEDIA PREVIEW =================
const avatarPreview = ref(null)
const coverPreview = ref(null)

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

// ================= CASCADE WATCHERS =================
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
    onSuccess: page => { cities.value = page.props.cities ?? [] }
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
    onSuccess: page => { districts.value = page.props.districts ?? [] }
  })
})

watch(() => form.value.district_code, () => {
  form.value.village_code = null
  villages.value = []

  if (!form.value.district_code) return
  router.reload({
    only: ['villages'],
    data: { district_code: form.value.district_code },
    onSuccess: page => { villages.value = page.props.villages ?? [] }
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

// ================= SUBMIT =================
function submit() {
  form.value.class = userEndClassTags.value.join(', ')
  const fd = new FormData()

  Object.entries(form.value).forEach(([k, v]) => {
    if (v === null) return
    fd.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v as any)
  })

  router.post(`/admin/pengguna`, fd, {
    preserveScroll: true,
  })
}

// ================= TAG INPUT =================
const userEndClassInput = ref('')
const userEndClassTags = ref<string[]>([])

function addUserEndClassTag() {
  const value = userEndClassInput.value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // ganti spasi jadi dash
      .replace(/[^a-z0-9\-]/g, '') // hapus karakter selain a-z, 0-9, -
      .replace(/\-+/g, '-');       // ganti dash ganda jadi satu
  if (!value) return
  if (!userEndClassTags.value.includes(value)) {
    userEndClassTags.value.push(value)
  }
  userEndClassInput.value = ''
  form.value.class = userEndClassTags.value.join(', ')
}

function removeUserEndClassTag(tag: string) {
  userEndClassTags.value = userEndClassTags.value.filter(t => t !== tag)
  form.value.class = userEndClassTags.value.join(', ')
}

</script>

<template>
  <Head title="Tambah Pengguna"/>
  <AppLayout>
    <div class="p-6 space-y-6 max-w-6xl mx-auto">

      <!-- MEDIA -->
      <Card>
        <CardHeader><CardTitle>Media</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-6">
          <div class="flex flex-col items-center gap-3">
            <Label>Avatar</Label>
            <div class="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="avatarPreview" :src="'/storage/' + avatarPreview" class="w-full h-full object-cover"/>
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" class="w-40" @change="onAvatarChange"/>
          </div>

          <div class="flex flex-col gap-3">
            <Label>Cover</Label>
            <div class="w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="coverPreview" :src="'/storage/' + coverPreview" class="w-full h-full object-cover"/>
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" @change="onCoverChange"/>
          </div>
        </CardContent>
      </Card>

      <!-- INFO USER -->
      <Card>
        <CardHeader><CardTitle>Info User</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-4">
          <div><Label>Nama</Label><Input v-model="form.name"/></div>
          <div><Label>Username</Label><Input v-model="form.username" @blur="generateSlugUsername"/></div>
          <div><Label>Phone</Label><Input v-model="form.phone"/></div>
          <div><Label>Email</Label><Input v-model="form.email"/></div>
          <div><Label>Password</Label><Input type="password" v-model="form.password"/></div>
        </CardContent>
      </Card>

      <!-- ALAMAT -->
      <Card>
        <CardHeader><CardTitle>Alamat</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <SearchableSelectDependent v-model="form.province_code" :items="provinces" label="Provinsi"/>
            <SearchableSelectDependent v-model="form.city_code" :items="cities" label="Kabupaten / Kota" :disabled="!form.province_code"/>
            <SearchableSelectDependent v-model="form.district_code" :items="districts" label="Kecamatan" :disabled="!form.city_code"/>
            <SearchableSelectDependent v-model="form.village_code" :items="villages" label="Desa" :disabled="!form.district_code"/>
          </div>

          <div>
            <Label>Alamat Lengkap</Label>
            <textarea v-model="form.street_address" rows="3" class="w-full border rounded px-3 py-2"/>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div><Label>Kode Pos</Label><Input v-model="form.zip_code"/></div>
            <div><Label>Rute</Label><Input v-model="form.rute"/></div>
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
        <CardContent class="grid md:grid-cols-2 gap-4">
          <div>
            <Label class="mb-2 block">Kelas</Label>
            
            <!-- List Tag yang sudah ditambahkan -->
            <div class="flex flex-wrap gap-2 mb-2">
              <span 
                v-for="tag in userEndClassTags" 
                :key="tag" 
                class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm"
              >
                {{ tag }}
                <button type="button" @click="removeUserEndClassTag(tag)" class="text-red-500 hover:text-red-700">✕</button>
              </span>
            </div>

            <!-- Input Group dengan tombol Tambah (Enter) -->
            <div class="flex gap-2">
              <Input 
                v-model="userEndClassInput" 
                placeholder="Ketik nama kelas..." 
                @keyup.enter.prevent="addUserEndClassTag"
                class="flex-1"
              />
              <Button 
                type="button" 
                variant="secondary" 
                @click="addUserEndClassTag"
                class="shrink-0"
              >
                <Plus class="size-4"/>
              </Button>
            </div>
            <p class="text-[10px] text-muted-foreground mt-1 italic">
              *Tekan Tambah jika tombol Enter tidak muncul di keyboard HP.
            </p>
          </div>

          <div>
            <Label>Level</Label>
            <select v-model="form.level" class="w-full border rounded px-3 py-2">
              <option value="">- Pilih Level -</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div class="flex gap-2 items-end">
            <Button type="button" :variant="!form.is_admin ? 'default' : 'outline'" @click="form.is_admin = false">Tolak Izin</Button>
            <Button type="button" :variant="form.is_admin ? 'default' : 'outline'" @click="form.is_admin = true">Ya, Izinkan</Button>
          </div>

          <div>
            <Label>Cabang</Label>
            <SearchableSelect v-model="form.branch_id" :items="branches" label="Cabang" value-key="value" label-key="label"/>
          </div>
        </CardContent>
      </Card>

      <!-- ACTION -->
      <div class="flex justify-end">
        <Button class="w-full md:w-auto" type="button" @click="submit">Simpan</Button>
      </div>

    </div>
  </AppLayout>
</template>
