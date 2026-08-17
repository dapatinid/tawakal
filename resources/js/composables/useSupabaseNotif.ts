import { createClient } from '@supabase/supabase-js'
import { ref, onMounted, onUnmounted } from 'vue'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function useSupabaseNotif(branchId: number | null, onNew: (payload: any) => void) {
    let channel: ReturnType<typeof supabase.channel> | null = null

    onMounted(() => {
        if (!branchId) return

        channel = supabase
            .channel(`notif-branch-${branchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `branch_id=eq.${branchId}`,  // filter per cabang
                },
                (payload) => {
                    onNew(payload.new)
                }
            )
            .subscribe()
    })

    onUnmounted(() => {
        if (channel) supabase.removeChannel(channel)
    })

    return { supabase }
}