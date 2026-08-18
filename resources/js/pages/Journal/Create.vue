<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { computed, ref, watch } from 'vue'
import SearchableSelect from '@/components/SearchableSelect.vue'

/* ===============================
   PROPS
=============================== */
const props = defineProps<{
  presets: {
    label: string
    mutation_type: string
    debit_akun: string
    kredit_akun: string
  }[]
  accounts: {
    code: string
    name: string
    group?: string
  }[]
  defaultDate: string
  users: Array<{ id: number; name: string }>
}>()

/* ===============================
   FORM STATE
=============================== */
const form = ref({
  date: props.defaultDate,        // yyyy-MM-ddTHH:mm
  user_id: null,
  user_alias: '',
  description: '',
  mutation_type: '',
  debit_akun: '',
  kredit_akun: '',
  nominal: 0,                     // angka asli ke backend
})



// max date
const now = new Date()

const maxDateTime = ref(
  new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
)

// Identifikasi Customer / Supplier Umum
const GENERAL_CUSTOMERS = ['pengguna umum','customer umum', 'supplier umum'];

const isGeneralCustomer = computed(() => {
  if (!form.value.user_id) return false;
  const user = props.users.find(u => u.id === Number(form.value.user_id));
  if (!user) return false;
  return GENERAL_CUSTOMERS.includes(user.name.toLowerCase());
});

// Reset user_alias saat bukan customer umum
watch(isGeneralCustomer, (v) => {
  if (!v) form.value.user_alias = '';
});

/* ===============================
   PRESET → AUTO SET AKUN
=============================== */
watch(
  () => form.value.mutation_type,
  (val) => {
    const preset = props.presets.find(p => p.mutation_type === val)
    if (!preset) return

    form.value.debit_akun  = preset.debit_akun
    form.value.kredit_akun = preset.kredit_akun
  }
)

/* ===============================
   NOMINAL FORMAT (1.000.000)
=============================== */
const nominalDisplay = ref('')

watch(nominalDisplay, (val) => {
  const numeric = val.replace(/\D/g, '')
  form.value.nominal = Number(numeric)
  nominalDisplay.value = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
})

/* ===============================
   SUBMIT
=============================== */
function submit() {
  router.post('/jurnal/store', form.value, {
    onError: (e) => {
      console.error(e)
    }
  })
}

/* ===============================
   DROPDOWN OPTIONS
=============================== */
const presetOptions = computed(() =>
  props.presets.map(p => ({
    id: p.mutation_type,
    name: p.label,
  }))
)

const accountOptions = computed(() =>
  props.accounts.map(a => ({
    id: a.code,
    name: `${a.name}`,
    // name: `${a.code} — ${a.name}`,
  }))
)

const breadcrumbs = [
  { title: 'Jurnal', href: '/jurnal' },
  { title: 'Buat Jurnal', href: '/jurnal/create' },
]
</script>

<template>
  <Head title="Buat Journal" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-2xl w-full mx-auto ">
    <form
      @submit.prevent="submit"
      class="p-4 space-y-4 bg-background/30 rounded-lg border border-white/40 shadow my-3 mx-3"
    >

      <!-- =======================
           TANGGAL
      ======================== -->
      <div class="space-y-1">
        <label class="text-sm font-medium">Tanggal</label>
        <input
          v-model="form.date"
          type="datetime-local"
          :max="maxDateTime"
          required
          class="w-full border rounded px-3 py-2 bg-background"
        />
      </div>

      <div class="space-y-1">

        <label class="text-sm font-medium">Nama</label>
        <!-- Atas Nama -->
        <SearchableSelect
          v-model="form.user_id"
          :items="users"
          label="Pihak Terkait"
          value-key="id"
          text-key="name"
        />

        <!-- Atas Nama (khusus Customer Umum / Supplier Umum) -->
        <div v-if="isGeneralCustomer">
          <input v-model="form.user_alias" required placeholder="Tulis atas nama siapa atau pihak terkait" class="w-full border p-2 bg-background"/>
        </div>
      </div>

      <!-- =======================
           DESKRIPSI
      ======================== -->
      <div class="space-y-1">
        <label class="text-sm font-medium">Deskripsi</label>
        <textarea
          v-model="form.description"
          required
          rows="3"
          placeholder="Deskripsi jurnal"
          class="w-full border rounded px-3 py-2 bg-background"
        />
      </div>

      <!-- =======================
           MUTATION TYPE (PRESET)
      ======================== -->
      <div class="space-y-1">
        <label class="text-sm font-medium">Jenis Transaksi</label>
        <SearchableSelect
          v-model="form.mutation_type"
          :items="presetOptions"
          label="Jenis Transaksi"
        />
      </div>

      <!-- =======================
           DEBIT & KREDIT
      ======================== -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-sm font-medium">Akun Debit</label>
          <SearchableSelect
            v-model="form.debit_akun"
            :items="accountOptions"
            label="Akun Debit"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium">Akun Kredit</label>
          <SearchableSelect
            v-model="form.kredit_akun"
            :items="accountOptions"
            label="Akun Kredit"
          />
        </div>
      </div>

      <!-- =======================
           NOMINAL
      ======================== -->
      <div class="space-y-1">
        <label class="text-sm font-medium">Nominal</label>
        <input
          v-model="nominalDisplay"
          required
          inputmode="numeric"
          placeholder="0"
          class="w-full border rounded px-3 py-2 bg-background text-right"
        />
      </div>

      <!-- =======================
           SUBMIT
      ======================== -->
      <button
        type="submit" :disabled="form.user_id == null"
        class="w-full py-3 bg-blue-600 text-white rounded-lg
               disabled:opacity-50"
      >
        Simpan Journal
      </button>

    </form>
    </div>
  </AppLayout>
</template>
