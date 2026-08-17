<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import SearchableSelect from '@/components/SearchableSelect.vue'

/* ===============================
   PROPS
=============================== */
const props = defineProps<{
  accounts: {
    code: string
    name: string
  }[]
  branches: {
    id: number
    name: string
  }[]
  defaultDate: string
}>()

/* ===============================
   FORM STATE
=============================== */
const form = ref({
  date: props.defaultDate,
  description: '',
  mutation_type: 'Transfer Antar Cabang',

  // 🔑 USER PICKS
  source_cash_account: '', // kredit (pengirim)
  target_cash_account: '', // debit (penerima)

  target_branch_id: null as number | null,
  nominal: 0,
})

/* ===============================
   NOMINAL FORMAT
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
  router.post('jurnal-transfer/store', form.value)
}

/* ===============================
   OPTIONS
=============================== */
const cashBankOptions = computed(() =>
  props.accounts
    .filter(a => a.code.startsWith('NR-DB CASH / BANK'))
    .map(a => ({
      id: a.code,     // value
      code: a.code,   // untuk label
      name: a.name,   // untuk label
      group: a.group,   // untuk label
    }))
)


const branchOptions = computed(() =>
  props.branches.map(b => ({
    id: b.id,
    name: b.name,
  }))
)

const breadcrumbs = [
  { title: 'Jurnal', href: '/jurnal' },
  { title: 'Transfer', href: '/jurnal-transfer' },
]
</script>


<template>
  <Head title="Transfer Antar Cabang" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-2xl w-full mx-auto "> 
    <form @submit.prevent="submit" class="p-4 space-y-4 bg-red-500/50 rounded-lg border border-white/40 shadow my-3 mx-3">

      <!-- TANGGAL -->
      <div>
        <label class="text-sm font-medium">Tanggal</label>
        <input
          v-model="form.date"
          type="datetime-local"
          required
          class="w-full border rounded px-3 py-2 bg-background"
        />
      </div>

      <!-- DESKRIPSI -->
      <div>
        <label class="text-sm font-medium">Deskripsi</label>
        <textarea
          v-model="form.description"
          rows="3"
          required
          class="w-full border rounded px-3 py-2 bg-background"
        />
      </div>

      <!-- CASH / BANK PENGIRIM -->
      <div>
        <label class="text-sm font-medium">
          Cash / Bank Pengirim (Kredit)
        </label>
        <SearchableSelect
          v-model="form.source_cash_account"
          :items="cashBankOptions"
          label="Pilih Cash / Bank Cabang Pengirim"
          :label-formatter="a => a.group ? `${a.name} • ${a.group}` : a.name"
        />
      </div>

      <!-- CABANG TUJUAN -->
      <div>
        <label class="text-sm font-medium">Cabang Tujuan</label>
        <SearchableSelect
          v-model="form.target_branch_id"
          :items="branchOptions"
          label="Pilih Cabang Tujuan"
        />
      </div>

      <!-- CASH / BANK PENERIMA -->
      <div>
        <label class="text-sm font-medium">
          Cash / Bank Penerima (Debit)
        </label>
        <SearchableSelect
          v-model="form.target_cash_account"
          :items="cashBankOptions"
          label="Pilih Cash / Bank Cabang Tujuan"
          :label-formatter="a => a.group ? `${a.name} • ${a.group}` : a.name"
        />
      </div>

      <!-- NOMINAL --> 
      <div>
        <label class="text-sm font-medium">Nominal</label>
        <input
          v-model="nominalDisplay"
          inputmode="numeric"
          required
          class="w-full border rounded px-3 py-2 text-right bg-background"
        />
      </div>

      <!-- INFO -->
      <div class="text-sm text-gray-300 italic">
        ℹ️ Sistem otomatis mencatat <b>Nominal Antar Cabang</b>. 
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-blue-600 text-white rounded-lg"
      >
        Kirim Transfer
      </button>
    </form>
    </div>
  </AppLayout>
</template>
