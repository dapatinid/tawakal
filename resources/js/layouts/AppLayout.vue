<script setup lang="ts">
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItemType } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css'; // vue-sonner v2 requires this import
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, watch, nextTick } from 'vue'; // ✅ SUPABASE NOTIF: tambah onUnmounted
import { usePage } from '@inertiajs/vue3'; // ✅ SUPABASE NOTIF
import supabase from '@/lib/supabase'
import { toast } from 'vue-sonner'; // ✅ SUPABASE NOTIF
import { useNotifStore } from '@/composables/useNotifStore'; // ✅ SUPABASE NOTIF: store untuk notifikasi

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const { prependNotif } = useNotifStore()


const backgroundImageUrl = computed(() => {
  // GANTI sesuai file di storage
  return "url('/storage/background/my-bg.png')"
})


// ============================================================
// ✅ SUPABASE NOTIF — Realtime subscription
// Tidak mengubah apapun di atas, hanya ditambahkan di sini
// ============================================================

const page = usePage()

const flash = computed(() => page.props.flash as { success?: string; error?: string; info?: string })

watch(flash, (val) => {
  if (!val?.success && !val?.error && !val?.info) return
  
  nextTick(() => {
    if (val?.success) toast.success(val.success)
    if (val?.error)   toast.error(val.error)
    if (val?.info)    toast.info(val.info)
  })
}, { immediate: true })

// Ambil branch_id dari auth user yang sudah ada di Inertia shared props
const branchId = computed(() => page.props.auth?.user?.branch_id ?? null)

// Map type notifikasi → pesan yang ramah
const notifMessages: Record<string, (data: any) => string> = {
  'payment.updated':      (d) => `💳 Payment order ${d.order_code} diperbarui`,
  'payment.deleted':      (d) => `🗑️ Payment order ${d.order_code} dihapus`,
  'order.deleted':        (d) => `❌ Order ${d.order_code} dihapus`,
  'order_item.updated':   (d) => `✏️ Item di order ${d.order_code} diubah`,
  'order_item.deleted':   (d) => `🗑️ Item di order ${d.order_code} dihapus`,
  'user.login':         (d) => `🔐 ${d.user_name} login via ${d.device_name}`,
}

// Simpan referensi channel agar bisa di-cleanup
let notifChannel: ReturnType<typeof supabase.channel> | null = null
const appId = import.meta.env.VITE_SUPABASE_APP_ID as string
const currentUser = computed(() => page.props.auth?.user ?? null)


onMounted(() => {

  const justLoggedIn = localStorage.getItem("just_logged_in");
  if (justLoggedIn) {
    localStorage.removeItem("just_logged_in");
    console.log("🔁 Reload sekali karena baru login");
    window.location.reload();
    return;
  }

  // const metaToken = document
  //   .querySelector('meta[name="csrf-token"]')
  //   ?.getAttribute("content");
  // if (metaToken) {
  //   localStorage.setItem("csrf_token", metaToken);
  // }

  if (!branchId.value) {
    console.log('[Supabase] branchId null, tidak subscribe') // ✅ debug
    return
  }

  if (!branchId.value || !currentUser.value) return

  const channelKey = `${appId}:${branchId.value}`

  notifChannel = supabase
    .channel(`notif-${channelKey}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        // Filter utama tetap pada branch melalui channel_key
        filter: `channel_key=eq.${channelKey}`, 
      },
      (payload) => {
        const notif = payload.new as any
        const user = currentUser.value
        
        // --- LOGIKA FILTER AUDIENCE (Replikasi dari Laravel Scope) ---
        let isAllowed = false

        // 1. Case: Private Message (Audience adalah User ID)
        if (!isNaN(notif.audience) && notif.audience != null) {
           if (parseInt(notif.audience) === user.id) isAllowed = true
        } 
        else {
          // 2. Case: Admin Only
          if (notif.audience === 'admin') {
            if (user.is_admin) isAllowed = true
          } 
          // 3. Case: Public (audience null atau kosong)
          else if (!notif.audience) {
            isAllowed = true
          }
        }

        // Jika tidak lolos filter audience, abaikan notifikasi ini
        if (!isAllowed) return

        // --- LANJUTKAN PROSES NOTIFIKASI ---
        const getMessage = notifMessages[notif.type]
        const message = getMessage
          ? getMessage(notif.data)
          : `🔔 Notifikasi: ${notif.type}`

        toast(message, { duration: 5000 })
        prependNotif(notif)
      }
    )
    .subscribe((status) => {
      console.log('[Supabase] status:', status)
    })
})


onUnmounted(() => {
  if (notifChannel) supabase.removeChannel(notifChannel)
})

// ============================================================
// ✅ END SUPABASE NOTIF
// ============================================================
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">

    <!-- BACKGROUND IMAGE -->
    <div
      class="absolute inset-0 bg-cover bg-center scale-105"
      :style="{ backgroundImage: backgroundImageUrl }"
    />

    <!-- BLUR OVERLAY -->
    <div class="absolute inset-0 backdrop-blur-2xl bg-white/30 dark:bg-black/40" />

    <!-- CONTENT -->
    <AppLayout
      :breadcrumbs="breadcrumbs"
      class="relative z-10"
    >
      <slot />
      <Toaster position="top-right" richColors />
    </AppLayout>

  </div>
</template>