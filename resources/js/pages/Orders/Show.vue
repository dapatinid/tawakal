<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const props = defineProps({
  order: Object,
})
</script>

<template>
  <Head title="Order Detail" />

  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Order #{{ props.order.id }}</h1>
      <Link :href="'/orders'">
        <Button variant="outline">← Back to Orders</Button>
      </Link>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Customer & Payment Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span class="font-medium">Customer Name:</span> {{ props.order.customer?.name || '~' }}</p>
            <p><span class="font-medium">Payment Method:</span> {{ props.order.payment_method }}</p>
          </div>
          <div>
            <p><span class="font-medium">Paid Amount:</span> {{ formatCurrency(props.order.paid_amount) }}</p>
            <p><span class="font-medium">Change Amount:</span> {{ formatCurrency(props.order.change_amount) }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2">#</th>
                <th class="text-left py-2">Product</th>
                <th class="text-right py-2">Price</th>
                <th class="text-right py-2">Qty</th>
                <th class="text-right py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in props.order.items" :key="i" class="border-b">
                <td class="py-2">{{ i + 1 }}</td>
                <td class="py-2">{{ item.product?.name ?? '-' }}</td>
                <td class="text-right py-2">{{ formatCurrency(item.price) }}</td>
                <td class="text-right py-2">{{ item.quantity_mins }}</td>
                <td class="text-right py-2 font-medium">{{ formatCurrency(item.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Separator class="my-4 bg-transparent" />
        <div class="w-full md:w-1/2 ms-auto">
          <div class="flex justify-between text-lg font-bold">
            <span>Sub Total : </span><span>{{ formatCurrency(props.order.sub_total) }}</span>
          </div>
          <div class="flex justify-between text-lg">
            <span>Diskon : </span><span>-{{ formatCurrency(props.order.discount) }}</span>
          </div>
          <div class="flex justify-between text-lg">
            <span>+Biaya : </span><span>{{ formatCurrency(props.order.charge) }}</span>
          </div>
          <div class="flex justify-between text-lg">
            <span>Pajak : </span><span>{{ formatCurrency(props.order.tax) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold">
            <span>Grand Total : </span><span>{{ formatCurrency(props.order.grand_total) }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
function formatCurrency(num) {
  if (!num && num !== 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}
</script>
