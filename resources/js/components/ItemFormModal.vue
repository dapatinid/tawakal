<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from '@/components/SearchableSelect.vue';
import { Minus, Plus } from "lucide-vue-next";

const props = defineProps({
  modelValue: Boolean,
  item: { type: Object, default: () => ({}) },
  products: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "save"]);

// FORM
const form = reactive({
  id: null,
  product_id: "",
  price: 0,       // <-- angka murni
  stock: 0,
  quantity_mins: 1,
  subtotal: 0,
});

// Load data saat modal open
watch(
  () => props.item,
  (val) => {
    form.id = val.id ?? null;
    // Paksa menjadi string agar SearchableSelect mudah mengenalinya
    form.product_id = val.product_id ? String(val.product_id) : "";
    form.price = Number(val.price) || 0;
    form.quantity_mins = val.quantity_mins ?? 1;
  },
  { immediate: true }
);

// Update harga otomatis ketika product_id berubah
watch(
  () => form.product_id,
  (id) => {
    if (!id) return;
    // Gunakan perbandingan String
    const product = props.products.find((p) => String(p.id) === String(id));
    if (product) {
      form.price = Number(product.price) || 0;
      form.stock = Number(product.stock) || 0;
    }
  }
);

// Hitung subtotal
watch(
  [() => form.price, () => form.quantity_mins],
  () => {
    const price = Number(form.price) || 0;
    const qty = Number(form.quantity_mins) || 0;
    form.subtotal = price * qty;
  }
);

function close() {
  emit("update:modelValue", false);
}

function submit() {
  emit("save", {
    ...form,
    product_id: Number(form.product_id),
    price: Number(form.price),
    subtotal: form.subtotal,
  });
}
</script>

<template>
  <Dialog :open="modelValue" @update:open="v => $emit('update:modelValue', v)">
    <DialogContent @openAutoFocus.prevent>
      <DialogHeader>
        <DialogTitle>{{ form.id ? "Edit Item" : "Tambah Item" }}</DialogTitle>
        <DialogDescription>
          Cek item sebelum simpan.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">

        <!-- PRODUCT SELECT -->
      <div class="relative">
        <span v-if="form.product_id" class="absolute z-10 right-9 top-7.5 flex justify-end border border-accent bg-accent rounded-md"><span class="text-end px-2">Stok {{ form.stock }}</span></span>
        <Label class="mb-2">Produk</Label>
        <SearchableSelect
          v-model="form.product_id"
          :items="products"
          label="Produk"
          :labelFormatter="(item) => `${item.name} - ${item.stock}`"
        />
      </div>     

        <!-- Price -->
        <div>
          <Label class="mb-2">Harga</Label>
          <Input
            v-model.number="form.price"
            type="number"
            min="0"
            class="dark:bg-neutral-900 dark:text-white"
          />
        </div>

        <!-- Qty -->
        <div>
          <Label class="mb-2">Qty</Label>
          <div class="flex items-center gap-2">
            <!-- Tombol "-" -->
            <Button
              type="button"
              variant="outline"
              class="px-3"
              @click="form.quantity_mins = Math.max(0, Number(form.quantity_mins) - 1)"
            >
              <Minus class="size-5"/>
            </Button>

            <!-- Input Angka -->
            <Input
              type="number"
              v-model.number="form.quantity_mins"
              min="0"
              class="w-full text-center dark:bg-neutral-900 dark:text-white"
            />

            <!-- Tombol "+" -->
            <Button
              type="button"
              variant="outline"
              class="px-3"
              @click="form.quantity_mins = Number(form.quantity_mins) + 1"
            >
              <Plus class="size-5"/>
            </Button>
          </div>
        </div>


        <!-- Subtotal -->
        <div>
          <Label class="mb-2">Subtotal</Label>
          <div 
            class="border rounded p-2 dark:bg-neutral-900 dark:text-white dark:border-neutral-700"
          >
            Rp {{ form.subtotal.toLocaleString("id-ID") }}
          </div>
        </div>

      </div>

      <DialogFooter>
        <Button variant="outline" @click="close">Batal</Button>
        <Button @click="submit">{{ form.id ? "Simpan" : "Tambah" }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
