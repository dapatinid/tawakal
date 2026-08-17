<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { SidebarTrigger } from '@/components/ui/sidebar'
import type { BreadcrumbItemType } from '@/types'
import { ArrowLeft, Bell, House } from 'lucide-vue-next'
import { usePage, router, Link } from '@inertiajs/vue3'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useNotifStore } from '@/composables/useNotifStore'

/* ======================
   PAGE & STATE
====================== */
const page = usePage()

const isDashboard = computed(() => page.url === '/dashboard')
const isNotifications = computed(() => page.url === '/notifications')

/* ======================
   BACK HISTORY
====================== */
const HISTORY_KEY = 'inertia:history'

function getHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function setHistory(history: string[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

function goBack() {
  const history = getHistory()

  if (history.length === 0) {
    router.visit('/dashboard')
    return
  }

  const previous = history.pop()
  setHistory(history)

  if (!previous || previous === window.location.pathname) {
    router.visit('/dashboard')
    return
  }

  ;(window as any).__inertiaBack?.()

  router.visit(previous, {
    preserveScroll: true,
    preserveState: true,
  })
}

/* ======================
   RESPONSIVE BREAKPOINT
====================== */
const isMobile = ref(false)

function handleResize() {
  isMobile.value = window.innerWidth < 768 // < md (Tailwind)
}

const { localNotifs, localUnread, initFromInertia, markAllRead } = useNotifStore()

// ✅ Init dari Inertia saat pertama mount
// Ganti computed notifications & unreadCount yang lama
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)

  // ✅ Init notif dari Inertia shared props
  const inertiaNotifs  = page.props.notifications?.latest ?? []
  const inertiaUnread  = page.props.notifications?.unread_count ?? 0
  initFromInertia(inertiaNotifs, inertiaUnread)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})


/* ======================
   PROPS
====================== */
const props = withDefaults(
  defineProps<{
    breadcrumbs?: BreadcrumbItemType[]
  }>(),
  {
    breadcrumbs: () => [],
  },
)

const resolvedBreadcrumbs = computed(() => {
  if (!props.breadcrumbs.length) return []

  // Jika mobile → ambil item terakhir saja
  if (isMobile.value) {
    return [props.breadcrumbs[props.breadcrumbs.length - 1]]
  }

  // Jika desktop → tampilkan semua
  return props.breadcrumbs
})

/* ======================
   NOTIFICATIONS (FROM BACKEND SHARE)
====================== */
const notifications = localNotifs
const unreadCount   = localUnread

/* ======================
   DROPDOWN STATE
====================== */
const showNotifDropdown = ref(false)

function toggleNotif() {
  showNotifDropdown.value = !showNotifDropdown.value
}

function closeNotif() {
  showNotifDropdown.value = false
}

function goToNotifications() {
  closeNotif()
  markAllRead() // ✅ reset badge lokal
  router.visit('/notifications')
}

/* ======================
   CLICK OUTSIDE HANDLER
====================== */
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-notification-dropdown]')) {
    closeNotif()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

/* ======================
   MESSAGE RESOLVER
====================== */
function resolveMessage(notif: any): string {
  const data = notif.data ?? {}
  const orderCode = data.order_code ?? '-'
  const actor = notif.actor ?? 'Unknown User'

  const formatRupiah = (value?: number) => {
    if (value === undefined || value === null) return '-'
    return new Intl.NumberFormat('id-ID').format(value)
  }

  switch (notif.type) {
    // =====================
    // ORDER ITEM
    // =====================
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

      return `${actor} mengubah Order ${orderCode} item ${product}
              qty (${beforeQty} → ${afterQty}) subtotal (${beforeSubtotal} → ${afterSubtotal})`
    }

    case 'order_item.deleted':  {
      const subtotal = formatRupiah(data.subtotal)
      return `${actor} menghapus qty ${data.qty} subtotal ${subtotal} item "${data.product}" dari Order ${orderCode}`
    }

    // =====================
    // PAYMENT
    // =====================
    case 'payment.updated': {
      const before = formatRupiah(data.nominal_before)
      const after  = formatRupiah(data.nominal_after)

      return `${actor} memperbarui pembayaran Order ${orderCode}
              (${before} → ${after})`
    }

    case 'payment.deleted': {
      const nominal = formatRupiah(data.nominal)

      return `${actor} menghapus pembayaran ${nominal} dari Order ${orderCode}`
    }

    case 'order.deleted': {
      const nominal = formatRupiah(data.nominal)

      return `${actor} menghapus Order ${orderCode} dengan GrandTotal ${nominal}`
    }

    case 'user.login': {
      return `${actor} ${data.notes ?? ''}`
    }

    // =====================
    // DEFAULT
    // =====================
    default:
      return `${actor} melakukan suatu aksi`
  }
}

</script>

<template>
  <header
    class="relative z-50 flex h-12 md:mx-3 items-center gap-2 border-sidebar-border/70 transition-[width,height]"
  >
    <div class="fixed md:static flex items-center w-[100vw] h-12 md:rounded-md bg-background md:shadow">

      <!-- LEFT -->
      <div class="w-full flex items-center justify-start me-2 h-full">
        <button
          v-if="!isDashboard"
          @click="goBack"
          class="px-3 md:rounded-l-md flex items-center h-full hover:bg-linear-to-r hover:from-gray-500/50 hover:to-transparent hover:cursor-pointer"
        >
          <ArrowLeft class="size-6" />
        </button>

        <Breadcrumbs
          v-if="resolvedBreadcrumbs.length"
          :breadcrumbs="resolvedBreadcrumbs"
          active-class="font-bold text-lg line-clamp-1"
          :class="isDashboard ? 'ms-4' : ''"
        />
      </div>

      <Link :href="'/'" class="h-full flex items-center hover:bg-muted px-2 rounded"><House class="4"/></Link>

      <!-- 🔔 NOTIFICATION -->
      <div
        class="relative h-full flex items-center"
        data-notification-dropdown
      >
        <button
          @click.stop="toggleNotif"
          class="relative h-full px-2 rounded flex items-center justify-center hover:bg-muted transition hover:cursor-pointer"
          aria-label="Notifikasi"
        >
          <Bell class="size-6" />

          <!-- unread dot -->
          <span
            v-if="unreadCount > 0"
            class="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"
          />
        </button>

        <!-- DROPDOWN -->
        <div
          v-if="showNotifDropdown && !isNotifications"
          class="absolute -right-10 top-full mt-2 w-80 rounded-md border bg-background shadow-lg overflow-hidden z-50"
        >
            <!-- header -->
            <div class="px-4 py-2 text-sm font-semibold border-b flex justify-between items-center">
            <span>Notifikasi</span>

            <span
                v-if="$page.props.notifications?.unread_count > 0"
                class="ml-2 inline-flex items-center justify-center
                    px-2 py-0.5 text-xs font-bold
                    bg-red-500 text-white rounded-full"
            >
                {{ $page.props.notifications.unread_count }}
            </span>
            </div>


          <!-- list -->
          <div class="max-h-80 overflow-y-auto divide-y">
            <div
              v-for="notif in notifications"
              :key="notif.id"
              class="px-4 py-3 text-sm flex gap-2 hover:bg-muted transition"
              :class="!notif.is_read ? 'font-medium' : 'text-muted-foreground'"
            >
              <span
                v-if="!notif.is_read"
                class="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"
              />
              <span>{{ resolveMessage(notif) }}</span>
            </div>

            <div
              v-if="notifications.length === 0"
              class="px-4 py-6 text-center text-sm text-muted-foreground"
            >
              Tidak ada notifikasi
            </div>
          </div>

          <!-- footer -->
          <button
            @click="goToNotifications"
            class="w-full px-4 py-2 text-sm text-primary hover:bg-muted transition border-t"
          >
            Lihat semua
          </button>
        </div>
      </div>

      <SidebarTrigger class="me-3 h-full w-10 hover:cursor-pointer" />
    </div>
  </header>
</template>
