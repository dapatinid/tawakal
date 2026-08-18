<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { Bell, Check } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { type BreadcrumbItem } from '@/types';

const props = defineProps<{
  notifications: {
    data: Array<{
      id: number
      type: string
      data: Record<string, any>
      actor: string | null
      created_at: string
      is_read: boolean
    }>
    links: any
  }
}>()

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Notifikasi', href: '/notifications' },
]

const localNotifications = ref(
  props.notifications.data.map(n => ({ ...n }))
)

const markAsRead = (id: number) => {
  const notif = localNotifications.value.find(n => n.id === id)
  if (!notif || notif.is_read) return

  notif.is_read = true // optimistic

  router.patch(`/notifications/${id}/read`, {}, {
    preserveScroll: true,
    preserveState: true,
    onError: () => {
      notif.is_read = false // rollback
    },
  })
}



const markAllAsRead = () => {
  const unread = localNotifications.value.filter(n => !n.is_read)
  if (unread.length === 0) return

  unread.forEach(n => (n.is_read = true))

  router.patch('/notifications/read-all', {}, {
    preserveScroll: true,
    preserveState: true,
    onError: () => {
      unread.forEach(n => (n.is_read = false))
    },
  })
}



const resolveMessage = (notif: any) => {
  const data = notif.data ?? {}

  const orderCode = data.order_code ?? '-'

  const formatRupiah = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('id-ID').format(value)
  }

  switch (notif.type) {
    // =========================
    // ORDER ITEM
    // =========================
    case 'order_item.updated': {
      const beforeProduct = data.product_before
      const afterProduct  = data.product_after
      const beforeQty     = data.qty_before
      const afterQty      = data.qty_after
      const beforeSubtotal    = formatRupiah(data.subtotal_before)
      const afterSubtotal      = formatRupiah(data.subtotal_after)

      const product = (beforeProduct !== afterProduct) 
        ? `"${beforeProduct}" → "${afterProduct}"` 
        : `"${beforeProduct}"`;

      return `mengubah Order ${orderCode} item ${product}
              qty (${beforeQty} → ${afterQty}) subtotal (${beforeSubtotal} → ${afterSubtotal})`
    }

    case 'order_item.deleted': {
      const subtotal = formatRupiah(data.subtotal)
      return `menghapus qty ${data.qty} subtotal ${subtotal} item "${data.product}" dari Order ${orderCode}`
    }

    // =========================
    // PAYMENT
    // =========================
    case 'payment.updated': {
      const before = formatRupiah(data.nominal_before)
      const after  = formatRupiah(data.nominal_after)

      return `memperbarui pembayaran Order ${orderCode}
              (${before} → ${after})`
    }

    case 'payment.deleted': {
      const nominal = formatRupiah(data.nominal)

      return `menghapus pembayaran ${nominal} dari Order ${orderCode}`
    }

    case 'order.deleted': {
      const nominal = formatRupiah(data.nominal)

      return `menghapus Order ${orderCode} dengan GrandTotal ${nominal}`
    }

    case 'user.login': {
      return ` ${data.notes}`
    }

    // =========================
    // DEFAULT
    // =========================
    default:
      return 'melakukan suatu aksi'
  }
}




watch(
  () => props.notifications.data,
  (val) => {
    localNotifications.value = val.map(n => ({ ...n }))
  },
  { immediate: true }
)



</script>


<template>
  <Head title="Notifikasi" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-4xl mx-auto px-4 py-6 space-y-4">

      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b">
        <!-- Title -->
        <div class="flex items-center gap-2 me-7">
          <Bell class="w-5 h-5" />
          <h1 class="text-base font-semibold">Notifikasi</h1>
        </div>

        <!-- Action -->
        <button
          @click="markAllAsRead"
          class="
            text-xs font-medium
            text-primary
            hover:underline
            disabled:opacity-50
          "
        >
          Tandai semua
        </button>
      </div>


      <!-- List -->
      <div class="space-y-2">
        <div
          v-for="notif in localNotifications"
          :key="notif.id"
          class="flex gap-3 p-4 rounded-lg border transition"
          :class="notif.is_read
            ? 'bg-background'
            : 'bg-blue-100 dark:bg-blue-950 border-blue-200'"
        >
          <!-- Content -->
          <div class="flex-1 space-y-1">
            <p class="text-sm leading-snug">
              <span v-if="notif.actor" class="font-medium">
                {{ notif.actor }}
              </span>
              {{ resolveMessage(notif) }}
            </p>

            <!-- Time + unread dot -->
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{{ notif.created_at }}</span>

              <span
                v-if="!notif.is_read"
                class="w-2 h-2 rounded-full bg-blue-500"
              />
            </div>
          </div>

          <!-- Action -->
          <div class="relative group flex items-start">
            <button
              v-if="!notif.is_read"
              @click="markAsRead(notif.id)"
              class="
                p-2 rounded-md
                text-muted-foreground
                hover:text-primary
                hover:bg-primary/10
                transition
              "
              aria-label="Tandai dibaca"
            >
              <Check class="w-4 h-4" />
            </button>

            <!-- Tooltip -->
            <div
              class="
                absolute right-full top-1/2 -translate-y-1/2
                mr-2
                px-2 py-1
                text-xs text-white
                bg-black rounded
                opacity-0
                group-hover:opacity-100
                transition
                pointer-events-none
                whitespace-nowrap
              "
            >
              Tandai dibaca
            </div>
          </div>
        </div>

        <div
          v-if="localNotifications.length === 0"
          class="text-sm text-muted-foreground text-center py-10"
        >
          Tidak ada notifikasi
        </div>
      </div>


      <!-- Pagination (opsional) -->
    </div>
  </AppLayout>
</template>
