<script setup>
import { router } from '@inertiajs/vue3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const props = defineProps({
  open: Boolean,
  paymentId: Number,
})

const emit = defineEmits(["update:open"])

function close() {
  emit("update:open", false)
}

function deletePayment() {
  router.delete(`/pembayaran-penjualan/${props.paymentId}`, {
    preserveScroll: true,
    onSuccess: () => close()
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="val => emit('update:open', val)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Hapus Pembayaran</DialogTitle>
        <DialogDescription>
          Tindakan ini tidak dapat dibatalkan. Cek jumlah pembayaran setelah selesai hapus.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="outline" @click="close">Batal</Button>
        <Button variant="destructive" @click="deletePayment">
          Hapus
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>