<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/vue3'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Eye, Pencil } from 'lucide-vue-next'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    product?: Record<string, any>
    priceAdjustments?: Array<Record<string, any>>
    barcodeSvg: String,
  }>(),
  {
    product: () => ({}),
    priceAdjustments: () => [],
  }
)

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: `/produk`,
    },
  {
    title: 'Detail Product',
    href: `/produk/${props.product.id}/preview`,
  },
]


const categoryNames = computed(() => {
  return props.product?.categories?.length
    ? props.product.categories.map((c: any) => c.name).join(', ')
    : '-'
})

function formatCurrency(num?: number) {
  if (num === null || num === undefined) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

function formatNumber(v?: number) {
  if (v === null || v === undefined) return '-'
  return Number(v)
    .toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
}

function previewUrl(path?: string) {
  if (!path) return ''
  return path.startsWith('http')
    ? path
    : `/storage/${path}`
}

</script>


<template>
  <Head title="Rincian Produk" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-3 space-y-4 pb-7">
      <div class="flex justify-start items-center mb-2 gap-3">
        <h1 class="text-2xl font-bold">Produk #{{ product?.id }}</h1>
        <Link v-if="product?.id" :href="`/product/${product.slug}`">
          <Eye class="size-5" />
        </Link>
        <Link v-if="product?.id" :href="`/produk/${product.id}/edit`" class="ms-auto">
          <Pencil class="size-5" />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Info Produk</CardTitle>
        </CardHeader>

        <CardContent class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <!-- NAMA + IDENTITAS -->
            <div>
              <p class="text-xs text-muted-foreground">Nama Produk</p>
              <p class="text-lg font-semibold leading-tight">
                {{ product?.name ?? '-' }}
              </p>

              <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Slug: {{ product?.slug ?? '-' }}</span>
                <span>SKU: {{ product?.sku ?? '-' }}</span>
              </div>
              <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Barcode: {{ product?.barcode ?? '-' }}</span>
                <span>HScode: {{ product?.hscode ?? '-' }}</span>
              </div>
            </div>

            <div class="flex justify-center items-start gap-2">
              <div v-if="props.barcodeSvg" class="">
                <div v-html="props.barcodeSvg" class="scale-75"></div>
              </div>
            </div>

            <!-- STOK -->
            <div class="text-right gap-2">              
              <p class="text-xs text-muted-foreground">Stok</p>
              <p class="text-lg font-semibold leading-tight">
                {{ formatNumber(product?.stock) }} <span class="text-xs text-muted-foreground">{{ product?.unit_name ?? 'satuan' }}</span>
              </p>
            </div>
          </div>

          <!-- GRID UTAMA -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <!-- KIRI -->
            <div class="space-y-1">
              <p>
                <span class="font-medium">Group:</span>
                {{ product?.group ?? '-' }}
              </p>

              <p>
                <span class="font-medium">Varian:</span>
                {{ product?.variant ?? '-' }}
              </p>

              <p>
                <span class="font-medium">Kategori:</span>
                {{ categoryNames }}
              </p>

              <p>
                <span class="font-medium">Merk:</span>
                {{ product?.brand?.name ?? '-' }}
              </p>
            </div>

            <!-- KANAN -->
            <div class="space-y-2">
              <!-- Harga -->
              <div>
                <p class="text-xs text-muted-foreground">Harga Jual</p>
                <div class="flex items-center gap-2">
                  <span class="text-xl font-bold text-primary">
                    {{ formatCurrency(product?.price) }}
                  </span>

                  <span
                    v-if="product?.strikethroughprice != 0"
                    class="text-xs line-through text-muted-foreground"
                  >
                    {{ formatCurrency(product?.strikethroughprice) }}
                  </span>
                </div>
              </div>

              <!-- Cost -->
              <p class="text-xs text-muted-foreground">
                Harga Dasar: {{ formatCurrency(product?.cost) }}
              </p>

              <!-- Rating & Poin -->
              <div class="flex gap-4 text-sm">
                <p>
                  <span class="font-medium">Rating:</span>
                  <span v-if="product?.rating">⭐ {{ product.rating }}/5</span>
                  <span v-else>-</span>
                </p>

                <p>
                  <span class="font-medium">Poin:</span>
                  {{ product?.poin ?? '-' }}
                </p>
              </div>

              <!-- Unit & Berat -->
              <div class="flex gap-4 text-sm">

                <p class="col-span-2">
                  <span class="font-medium">Berat:</span>
                  {{ formatNumber(product?.weight) }} kg
                </p>

                <p>
                  <span class="font-medium">Isi:</span>
                  {{ product?.contain ?? '-' }}
                </p>
              </div>
            </div>
          </div>

          <!-- STATUS BADGE -->
          <div class="flex flex-wrap gap-2 pt-2 border-t">
            <span
              v-if="product?.is_active"
              class="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700"
            >
              Aktif
            </span>
            
            <span
              v-if="product?.is_public"
              class="px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700"
            >
              Publik
            </span>

            <span
              v-if="product?.is_promo"
              class="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700"
            >
              Promo
            </span>

            <span
              v-if="product?.is_featured"
              class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700"
            >
              Unggulan
            </span>

            <span
              v-if="product?.in_stock"
              class="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700"
            >
              Stok Tersedia
            </span>

            <span
              v-else
              class="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
            >
              Stok Habis
            </span>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Deskripsi</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm">
            {{ product?.description || '-' }}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="product?.images?.length"
            class="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <div
              v-for="(img, index) in product.images"
              :key="index"
              class="relative"
            >
              <img
                :src="previewUrl(img)"
                class="w-full aspect-square object-cover rounded-md"
              />
            </div>
          </div>

          <p v-else class="text-sm text-muted-foreground">
            Tidak ada gambar
          </p>
        </CardContent>
      </Card>

<Card>
  <CardHeader>
    <CardTitle>Riwayat Perubahan Harga Dasar</CardTitle>
  </CardHeader>

  <CardContent>
    <div v-if="priceAdjustments.length" class="space-y-3">
      <div
        v-for="item in priceAdjustments"
        :key="item.id"
        class="border rounded-md p-3 text-sm space-y-1"
      >
        <div class="flex justify-between items-start gap-3">
          <div class="font-medium">
            {{ item.notes }}
          </div>

          <div
            class="font-semibold"
            :class="item.debit_akun.includes('Persediaan')
              ? 'text-green-600'
              : 'text-red-600'"
          >
            {{ item.nominal != 0 ? formatCurrency(item.nominal) : formatCurrency(item.notes.match(/([^=]+)$/)[0]) }}
          </div>
        </div>

        <div class="flex flex-wrap gap-x-1 gap-y-1 text-xs text-muted-foreground">
          <span>
            {{
              new Date(item.date).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            }}
          </span>

          <span>
            • {{ item.user_cre?.name ?? 'System' }}
          </span>
        </div>
      </div>
    </div>

    <p v-else class="text-sm text-muted-foreground">
      Belum ada riwayat perubahan harga dasar.
    </p>
  </CardContent>
</Card>

    </div>
  </AppLayout>
</template>


