<template>
  <div class="p-4">
    <h1 class="text-xl font-semibold">Products</h1>
    <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div v-for="p in products.data" :key="p.id" class="p-3 border rounded">
        <div class="font-medium">{{ p.name }}</div>
        <div>Rp {{ Number(p.price).toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ products: Object });
</script>