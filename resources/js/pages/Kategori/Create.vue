<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, useForm, Link } from '@inertiajs/vue3'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const form = useForm({
  name: '',
  slug: '',
  image: null as File | null,
  is_active: true,
})

// image preview
const imagePreview = ref<string | null>(null)

// handle file change
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  form.image = target.files[0]

  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(target.files[0])
}

// submit
function submit() {
  form.post('/kategori', {
    forceFormData: true,
    preserveScroll: true,
  })
}

const breadcrumbs = [
  { title: 'Tambah Kategori', href: '/kategori/buat/baru' },
]
</script>

<template>
  <Head title="Tambah Kategori" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-xl mx-auto p-6 space-y-6">

      <form @submit.prevent="submit" class="space-y-4">

        <!-- Nama -->
        <div>
          <Label class="mb-2">Nama</Label>
          <Input v-model="form.name" class="bg-background" />
          <p v-if="form.errors.name" class="text-sm text-red-500">
            {{ form.errors.name }}
          </p>
        </div>

        <!-- Slug -->
        <div>
          <Label class="mb-2">Slug (opsional)</Label>
          <Input v-model="form.slug" class="bg-background" />
        </div>

        <!-- Image -->
        <div class="space-y-2">
          <Label class="mb-2">Image</Label>
          <Input type="file" @change="onFileChange" class="bg-background" />

          <!-- Preview -->
          <div v-if="imagePreview" class="mt-2">
            <span class="text-xs text-muted-foreground">Preview:</span>
            <img
              :src="imagePreview"
              class="mt-1 w-32 h-32 object-cover rounded-md border"
            />
          </div>
        </div>

        <!-- Aktif -->
        <div class="flex items-center gap-3">
          <Switch v-model="form.is_active" />
          <Label>Aktif</Label>
        </div>

        <!-- Action -->
        <div class="flex items-center gap-3 pt-4 w-full">
          <Button 
            type="submit" 
            variant="default" 
            class="w-1/2 cursor-pointer"
            :disabled="form.processing"
          >
            Simpan
          </Button>

          <Button 
            asChild
            variant="default" 
            class="w-1/2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/kategori">
              Batal
            </Link>
          </Button>
        </div>

      </form>
    </div>
  </AppLayout>
</template>
