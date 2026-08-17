<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  category: {
    id: number
    name: string
    slug: string
    is_active: boolean
    image?: string | null
  }
}>()

// Form state
const form = useForm({
  name: props.category.name ?? '',
  slug: props.category.slug ?? '',
  is_active: !!props.category.is_active,
  image: null as File | null,
  remove_image: false,
})

const imagePreview = ref(props.category.image ?? null)

// File change & preview
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files[0]) return
  form.image = target.files[0]
  form.remove_image = false

  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(target.files[0])
}

// Remove image
function removeImageFunc() {
  form.image = null
  form.remove_image = true
  imagePreview.value = null
}

// Submit form
function submit() {
  if (!form.name) {
    alert('Nama wajib diisi!')
    return
  }

  const data = new FormData()
  data.append('name', form.name)
  data.append('slug', form.slug ?? '')
  data.append('is_active', form.is_active ? '1' : '0')
  data.append('remove_image', form.remove_image ? '1' : '0')
  if (form.image) data.append('image', form.image)
  data.append('_method', 'PUT') // penting agar Laravel menerima PUT

  router.post(`/kategori/${props.category.id}`, data, {
    preserveScroll: true,
    onSuccess: () => console.log('Kategori berhasil diperbarui'),
    onError: (errors) => console.log(errors),
  })
}

const breadcrumbs = [
  { title: 'Ubah Kategori', href: `/kategori/${props.category.id}/edit` },
]
</script>

<template>
  <Head title="Edit Kategori" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-xl mx-auto p-6 space-y-6">

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Nama -->
        <div>
          <Label class="mb-2">Nama</Label>
          <Input v-model="form.name" required   class="bg-background"/>
        </div>

        <!-- Slug -->
        <div>
          <Label class="mb-2">Slug</Label>
          <Input v-model="form.slug"   class="bg-background"/>
        </div>

        <!-- Image -->
        <div class="space-y-2">
          <Label class="mb-2">Ganti Image</Label>
          <Input type="file" @change="onFileChange"   class="bg-background"/>

          <div v-if="imagePreview" class="mt-2 flex items-center gap-2">
            <img :src="imagePreview" class="w-32 h-32 object-cover rounded-md border" />
            <Button type="button" variant="destructive" @click="removeImageFunc">
              Hapus Gambar
            </Button>
          </div>
        </div>

        <!-- Aktif -->
        <div class="flex items-center gap-3">
          <Switch v-model="form.is_active" />
          <Label>Aktif</Label>
        </div>

        <!-- Tombol -->
        <div class="flex pt-4">
          <Button type="submit" class="w-full">Update</Button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>
