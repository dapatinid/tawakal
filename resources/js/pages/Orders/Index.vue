<script setup>
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/vue3';

const props = defineProps({ orders: Object });
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Orders</h1>

    <ul class="space-y-3">
      <li
        v-for="o in orders.data ?? orders"
        :key="o.id"
        class="p-4 border rounded-lg flex justify-between items-center"
      >
        <div>
          <div class="font-semibold">Order #{{ o.id }}</div>
          <div class="text-sm text-gray-600">Customer: {{ o.customer?.name || '~' }}</div>
        </div>

        <div class="flex items-center gap-3">
          <span class="font-medium">Rp{{ Number(o.paid_amount).toLocaleString() }}</span>

          <Link :href="'/orders/' + o.id">
            <Button variant="outline" size="sm">View</Button>
          </Link>
        </div>
      </li>
    </ul>
  </div>
</template>
