<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { router, Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { type BreadcrumbItem } from '@/types';

const props = defineProps<{
  defaultDate: string,
  users: Array<{ id: number; name: string }>
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Penjualan', href: '/penjualan' },
    { title: 'Buat Penjualan', href: '/penjualan/buat/baru' }
];

// Form state
const form = ref({
  date: props.defaultDate,
  type: 'self_pickup',
  notes: '',
  user_id: null,
  user_alias: ''
});

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

// Submit form
const submit = () => {
  router.post('/penjualan/store', form.value, {
    onSuccess: () => {
      // Bisa tambahkan reset form jika perlu
      console.log('Penjualan berhasil dibuat');
    },
    onError: (errors) => {
      console.log(errors);
    }
  });
};
</script>

<template>
  <Head title="Buat Penjualan Baru" />

  <AppLayout  :breadcrumbs="breadcrumbs">
    <div class="p-3 mx-auto space-y-4 w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Buat Penjualan Baru</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">

          <!-- Tanggal -->
          <div>
            <label class="text-sm">Tanggal</label>
            <Input type="datetime-local" v-model="form.date" />
          </div>

          <!-- Tipe Penjualan -->
          <div>
            <label class="text-sm">Tipe Penjualan</label>
            <select v-model="form.type" class="w-full border rounded h-9 px-2">
              <option value="dine_in">Dine In</option>
              <option value="self_pickup">Self Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <!-- Customer -->
          <SearchableSelect
            v-model="form.user_id"
            :items="users"
            label="Nama Customer"
            value-key="id"
            text-key="name"
          />

          <!-- Atas Nama (khusus Customer Umum / Supplier Umum) -->
          <!-- <div v-if="isGeneralCustomer"> -->
          <div>
            <label class="block text-sm mb-1">Atas Nama</label>
            <Input v-model="form.user_alias" placeholder="Nama yang tercantum di nota" />
          </div>

          <!-- Catatan -->
          <div>
            <label class="text-sm">Catatan</label>
            <textarea v-model="form.notes" rows="4" class="w-full border rounded p-2"></textarea>
          </div>

          <!-- Tombol -->
          <div class="flex justify-end gap-2">
            <Link href="/penjualan">
              <Button variant="outline">Batal</Button>
            </Link>
            <Button @click="submit" :disabled="isGeneralCustomer && form.user_alias === ''">Buat Penjualan</Button>
          </div>

        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
