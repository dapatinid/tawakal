<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const props = defineProps({
  modelValue: Boolean,
  payment: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = ref({
  payment_method: '',
  nominal_plus: 0,
  date: '',
});

const nominalDisplay = ref('');

// max date
const now = new Date();
const offset = now.getTimezoneOffset() * 60000;

// Menambahkan 3 menit (3 * 60 * 1000 ms) ke waktu sekarang
const maxDateTime = ref(
  new Date(now.getTime() + (3 * 60000) - offset)
    .toISOString()
    .slice(0, 16)
);

// 🔥 Format datetime untuk input type="datetime-local"
function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

watch(() => props.payment, (v) => {
  const raw = v?.nominal_plus ?? 0;

  form.value = {
    payment_method: v?.payment_method ?? '',
    nominal_plus: raw,
    date: formatDateForInput(v?.date),
    id: v?.id ?? null,
  };

  nominalDisplay.value = formatRupiah(raw);
});

const paymentOptions = [
  { value: "cash", label: "Cash" },
  { value: "main cash", label: "Main Cash" },
  { value: "petty cash", label: "Petty Cash" },
  { value: "bank", label: "Bank" },
  { value: "ewallet", label: "e-Wallet" },
  { value: "qris", label: "QRIS" },
];

function formatRupiah(value) {
  if (!value) return '';
  return Number(value).toLocaleString('id-ID');
}

function parseNumber(value) {
  return Number(String(value).replace(/\./g, '').replace(/,/g, '')) || 0;
}

watch(nominalDisplay, (v) => {
  const raw = parseNumber(v);
  form.value.nominal_plus = raw;
  nominalDisplay.value = formatRupiah(raw);
});

function handleSave() {
  emit('save', form.value)
}

</script>

<template>
  <Dialog :open="modelValue" @update:open="(v) => emit('update:modelValue', v)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ form.id ? 'Edit Payment' : 'Tambah Payment' }}</DialogTitle>
        <DialogDescription>
          Cek setiap input pembayaran sebelum simpan.
        </DialogDescription>
      </DialogHeader>

      <!-- Wrap inputs dengan form -->
      <form class="grid flex-1 gap-2" @submit.prevent="handleSave">
        <Input
          v-model="form.date"
          type="datetime-local"
          :max="maxDateTime"
          class="input text-gray-500 dark:text-gray-200"
          @keydown.enter.prevent="handleSave"
        />
        <Input
          v-model="nominalDisplay"
          type="text"
          inputmode="numeric"
          class="input"
          placeholder="Nominal Bayar"
          @keydown.enter.prevent="handleSave"
        />
        <select
          v-model="form.payment_method"
          class="
            border rounded-md h-10 px-3 text-sm w-full
            bg-white text-gray-900
            focus-visible:ring-1 focus-visible:ring-primary
            dark:bg-neutral-900 dark:text-gray-200 dark:border-neutral-700
          "
          :class="{
            'text-gray-500 dark:text-gray-400': form.payment_method === '',
            'text-gray-900 dark:text-gray-200': form.payment_method !== ''
          }"
          @keydown.enter.prevent="handleSave"
        >
          <option value="" disabled>
            Pilih Metode Pembayaran
          </option>
          <option v-for="opt in paymentOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <DialogFooter>
          <!-- <Button variant="outline" @click="emit('update:modelValue', false)">Cancel</Button> -->
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>