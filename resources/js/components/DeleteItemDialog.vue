<script setup>
import { router } from "@inertiajs/vue3";
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
  itemId: Number,
});

const emit = defineEmits(["update:open"]);

function close() {
  emit("update:open", false);
}

function destroyItem() {
  router.delete(`/item-penjualan/${props.itemId}`, {
    preserveScroll: true,
    onSuccess: () => close(),
  });
}
</script>

<template>
  <Dialog :open="open" @update:open="v => emit('update:open', v)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Hapus Item</DialogTitle>
        <DialogDescription>
          Apakah Anda yakin ingin menghapus item ini?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="outline" @click="close">Batal</Button>
        <Button variant="destructive" @click="destroyItem">
          Hapus
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
