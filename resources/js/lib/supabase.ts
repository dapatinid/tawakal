import { createClient } from '@supabase/supabase-js'

// Dibuat sekali, dipakai di mana saja
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
)

export default supabase