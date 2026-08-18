import { ref } from 'vue'

// State global (shared antar komponen tanpa Pinia)
const localNotifs = ref<any[]>([])
const localUnread = ref(0)

export function useNotifStore() {

  function prependNotif(supabasePayload: any) {
    // Bangun objek notifikasi yang formatnya sama dengan
    // yang datang dari HandleInertiaRequests.php
    const newNotif = {
      id:         supabasePayload.id,
      type:       supabasePayload.type,
      data:       supabasePayload.data,
      actor:      supabasePayload.data?.actor_name ?? null,
      created_at: 'Baru saja',
      is_read:    false,
    }

    // Prepend ke depan list
    localNotifs.value.unshift(newNotif)

    // Tambah unread count
    localUnread.value++
  }

  function initFromInertia(inertiaNotifs: any[], inertiaUnread: number) {
    // Dipanggil sekali saat komponen mount, isi dari Inertia shared props
    // Hanya init jika localNotifs masih kosong (belum ada append dari Supabase)
    if (localNotifs.value.length === 0) {
      localNotifs.value = [...inertiaNotifs]
      localUnread.value = inertiaUnread
    }
  }

  function markAllRead() {
    localNotifs.value = localNotifs.value.map(n => ({ ...n, is_read: true }))
    localUnread.value = 0
  }

  return {
    localNotifs,
    localUnread,
    prependNotif,
    initFromInertia,
    markAllRead,
  }
}