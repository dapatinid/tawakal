<script setup lang="ts">
// ==============================
// Imports
// ==============================
import { ref } from "vue";
import { Head, router } from "@inertiajs/vue3";

import AppLayout from "@/layouts/AppLayout.vue";
import { type BreadcrumbItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical, Plus, Pencil, Check, NotepadText, CircleDollarSign, PackageOpen, SquareChevronDown, Printer, ReceiptText, Truck } from "lucide-vue-next";

import ItemFormModal from "@/components/ItemFormModal.vue";
import DeleteItemDialog from "@/components/DeleteItemDialog.vue";
import PaymentFormModal from "@/components/PaymentFormModal.vue";
import DeletePaymentDialog from "@/components/DeletePaymentDialog.vue";




// ==============================
// Props
// ==============================
const props = withDefaults(
  defineProps<{
    order?: Record<string, any>;
    products?: Array<any>;
  }>(),
  {
    order: () => ({}),
    products: () => [],
  }
);

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Penjualan', href: '/penjualan' },
  { title: "Info Penjualan", href: `/penjualan/${props.order.id}` },
];


// ==============================
// Helpers
// ==============================
const sumPayments = (payments = []) =>
  payments.reduce((total, p) => total + Number(p.nominal ?? 0), 0);

const formatCurrency = (num) =>
  num || num === 0
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(num)
    : "-";

const formatPrice = (v) =>
  Number(v)
    .toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/,/g, ".");

const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.toLocaleDateString("id-ID", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = date.toLocaleDateString("id-ID", { weekday: "long" });
  const time = date.toLocaleTimeString("id-ID", { hour12: false });

  return `${year} ${month} ${day}, ${weekday} ${time}`;
};

const formatID = (v) => Number(v).toLocaleString("id-ID");


// ==============================
// Item: Add / Edit / Delete
// ==============================
const showItemModal = ref(false);
const itemEditing = ref({});

// const openAddItem = () => {
//   itemEditing.value = {};
//   showItemModal.value = true;
// };

const openEditItem = (item) => {
  itemEditing.value = { ...item };
  showItemModal.value = true;
};

const saveItem = (data) => {
  if (data.id) {
    router.put(`/item-penjualan/${data.id}`, data, {
      onSuccess: () => (showItemModal.value = false),
      preserveScroll: true,
    });
  } else {
    router.post(`/penjualan/${props.order.id}/item`, data, {
      onSuccess: () => (showItemModal.value = false),
      preserveScroll: true,
    });
  }
};

const deleteItemDialogOpen = ref(false);
const deleteItemId = ref(null);

const openDeleteItem = (id) => {
  deleteItemId.value = id;
  deleteItemDialogOpen.value = true;
};


// ==============================
// Payment: Add / Edit / Delete
// ==============================
const showPaymentModal = ref(false);
const paymentEditing = ref({});

const openAddPayment = () => {
  // Hitung sisa pembayaran
  const total = Number(props.order.grand_total ?? 0);
  const paid = Number(props.order.paid_amount ?? 0);
  const remaining = Math.max(total - paid, 0);

  // Format datetime-local: yyyy-MM-ddTHH:MM
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const formattedDate =
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate()) +
    "T" +
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes());

  // Set default ke form payment
  paymentEditing.value = {
    date: formattedDate,
    nominal_plus: remaining,
    payment_method: "cash",
  };

  showPaymentModal.value = true;
};

const openEditPayment = (p) => {
  paymentEditing.value = { ...p };
  showPaymentModal.value = true;
};

const savePayment = (data) => {
  if (data.id) {
    router.put(`/pembayaran-penjualan/${data.id}`, data, {
      onSuccess: () => (showPaymentModal.value = false),
      preserveScroll: true,
    });
  } else {
    router.post(`/penjualan/${props.order.id}/pembayaran`, data, {
      onSuccess: () => (showPaymentModal.value = false),
      preserveScroll: true,
    });
  }
};

const deleteDialogOpen = ref(false);
const deleteId = ref(null);

const openDelete = (id) => {
  deleteId.value = id;
  deleteDialogOpen.value = true;
};



// ==============================
// Inline Edit: Discount / Charge / Tax
// ==============================
const editing = ref({
  discount: false,
  charge: false,
  tax: false,
});

const values = ref({
  discount: props.order.discount,
  charge: props.order.charge,
  tax: props.order.tax,
});

const startEdit = (field) => (editing.value[field] = true);

const save = () => {
  editing.value = { discount: false, charge: false, tax: false };

  router.put(`/penjualan/${props.order.id}/biayalain`, {
    discount: values.value.discount,
    charge: values.value.charge,
    tax: values.value.tax,
  },{
    preserveScroll: true,
  });
};


// ==============================
// Inline Edit: Date & Status
// ==============================
const editingOrder = ref({
  date: false,
  status: false,
  type: false,
  notes: false,
});

const orderValues = ref({
  date: props.order.date,
  status: props.order.status,
  type: props.order.type,
  notes: props.order.notes,
});

const startEditOrder = (field) => (editingOrder.value[field] = true);

const saveInfoEdited = () => {
  editingOrder.value = { date: false, status: false, type: false, notes: false };

  router.put(`/penjualan/${props.order.id}/editinfo`, {
    date: orderValues.value.date,
    status: orderValues.value.status,
    type: orderValues.value.type,
    notes: orderValues.value.notes,
  },{
    preserveScroll: true,
  });
};

function openPrintLandscape(id: number) {
  window.open(`/penjualan/${id}/printLandscape`, '_blank');
}

function openPrint(id: number) {
  window.open(`/penjualan/${id}/print`, '_blank');
}

function openPrintPackingSlip(id: number) {
  window.open(`/penjualan/${id}/printPackingSlip`, '_blank');
}
</script>


<template>
    <Head title="Rincian Penjualan" />

    <AppLayout :breadcrumbs="breadcrumbs">
      <div class="p-3 space-y-4 pb-14">

        <div class="flex justify-between">        
          <h1 class="text-2xl font-bold">#{{ order.id }} <span class="text-sm"> Q{{ order.q }}</span></h1>
          <div class="flex items-center gap-2"> 
            
            <!-- PENCIL -->
            <button v-if="!editingOrder.status" @click="startEditOrder('status')">
              <Pencil class="w-4 h-4 text-white" />
            </button>

            <!-- INPUT MODE (SELECT) -->
            <template v-if="editingOrder.status">
              <button @click="saveInfoEdited('status')">
                <Check class="w-4 h-4 text-white" />
              </button>

              <select
                v-model="orderValues.status"
                class="h-7 border rounded px-2 text-sm
                      bg-white text-gray-900
                      dark:bg-neutral-900 dark:text-gray-100
                      border-gray-300 dark:border-neutral-700
                      focus:outline-none focus:ring-1
                      focus:ring-blue-500 dark:focus:ring-blue-400"
                @keydown.enter="saveInfoEdited('status')"
                @blur="saveInfoEdited('status')"
              >
                <option value="new">new</option>
                <option value="processing">processing</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="canceled">canceled</option>
              </select>
            </template>

            <!-- VIEW MODE -->
            <span v-else :class="{
                      'text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800 px-2 rounded-sm': order.status === 'new',
                      'text-yellow-600 dark:text-yellow-400 bg-yellow-200 dark:bg-yellow-800 px-2 rounded-sm': order.status === 'processing',
                      'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 rounded-sm': order.status === 'shipped',
                      'text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-800 px-2 rounded-sm': order.status === 'delivered',
                      'text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-800 px-2 rounded-sm': order.status === 'canceled',
            }">
              {{ 
                order.status === 'new' ? 'New' : 
                order.status === 'processing' ? 'Processing' : 
                order.status === 'shipped' ? 'Shipped' : 
                order.status === 'delivered' ? 'Delivered' : 
                order.status === 'canceled' ? 'Canceled' : order.status 
              }}
            </span>             
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle><div class="flex items-center gap-2"><NotepadText/>Informasi Penjualan</div></CardTitle>
          </CardHeader>
          <CardContent>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-nowrap overflow-x-auto">

              <!-- Kolom Kiri -->
              <div class="space-y-1">
                <div class="flex">
                  <div class="flex justify-between">
                    <span class="font-medium w-20">No.</span>
                    <span class="mx-2">:</span>
                  </div>
                  <span>{{ order.code }}</span>
                </div>

                <div class="flex">
                  <div class="flex justify-between">
                    <span class="font-medium w-20">Customer</span>
                    <span class="mx-2">:</span>
                  </div>
                    <span v-if="order.user.id == 2 || order.user.id == 3 || order.user.id == 4" class="">
                      {{ `${order.user_alias} (${order.user?.name})` }}
                    </span>
                    
                    <span v-else class="">
                      {{ order.user?.name || '~' }} {{ order.user_alias ? `an ${order.user_alias}` : '' }}
                    </span>
                </div>

                <div class="flex">
                  <div class="flex justify-between">
                    <span class="font-medium w-20">Tanggal</span>
                    <span class="mx-2">:</span>
                  </div>

                  <div class="flex items-center gap-2">
                    
                    <!-- INPUT MODE -->
                    <template v-if="editingOrder.date">
                      <Input
                        type="datetime-local"
                        class="h-7"
                        v-model="orderValues.date"
                        @keydown.enter="saveInfoEdited('date')"
                        @blur="saveInfoEdited('date')"
                      />
                      <button @click="saveInfoEdited('date')">
                        <Check class="w-4 h-4 text-green-600" />
                      </button>
                    </template>

                    <!-- VIEW MODE -->
                    <span v-else>{{ formatDate(order.date) }}</span>

                    <!-- PENCIL -->
                    <button v-if="!editingOrder.date" @click="startEditOrder('date')">
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div class="flex">
                  <div class="flex justify-between">
                    <span class="font-medium w-20">Type</span>
                    <span class="mx-2">:</span>
                  </div>

                  <div class="flex items-center gap-2">
                    
                    <!-- INPUT MODE (SELECT) -->
                    <template v-if="editingOrder.type">
                      <select
                        v-model="orderValues.type"
                        class="h-7 border rounded px-2 text-sm
                              bg-white text-gray-900
                              dark:bg-neutral-900 dark:text-gray-100
                              border-gray-300 dark:border-neutral-700
                              focus:outline-none focus:ring-1
                              focus:ring-blue-500 dark:focus:ring-blue-400"
                        @keydown.enter="saveInfoEdited('type')"
                        @blur="saveInfoEdited('type')"
                      >
                        <option value="dine_in">Dine In</option>
                        <option value="self_pickup">Self Pickup</option>
                        <option value="delivery">Delivery</option>
                      </select>

                      <button @click="saveInfoEdited('type')">
                        <Check class="w-4 h-4 text-green-600" />
                      </button>
                    </template>

                    <!-- VIEW MODE -->
                    <span v-else :class="{
                      'text-blue-500': order.type === 'dine_in',
                      'text-green-500': order.type === 'self_pickup',
                      'text-orange-500': order.type === 'delivery'
                    }">
                      {{ 
                        order.type === 'dine_in' ? 'Dine In' : 
                        order.type === 'self_pickup' ? 'Self Pickup' : 
                        order.type === 'delivery' ? 'Delivery' : order.type 
                      }}
                    </span>

                    <!-- PENCIL -->
                    <button v-if="!editingOrder.type" @click="startEditOrder('type')">
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>


              </div>

              <!-- Kolom Kanan -->
              <div class="space-y-1">
                <div class="flex">
                  <div class="flex justify-between">
                    <span class="font-medium w-20">Pembayaran</span>
                    <span class="mx-2">:</span>
                  </div>
                  <span>{{ order.payment_method }} ~ {{ order.payments.at(-1)?.payment_method }}</span>
                </div>

                <div class="flex">
                  <div class="flex justify-between">
                    <span class="font-medium w-20">Grand Total</span>
                    <span class="mx-2">:</span>
                  </div>
                  <span>{{ formatCurrency(order.grand_total) }}</span>
                </div>

                <div class="flex">
                  <div class="flex justify-between">
                    <span class="font-medium w-20">Total Bayar</span>
                    <span class="mx-2">:</span>
                  </div>
                  <span>{{ formatCurrency(order.paid_amount) }}</span>
                </div>

                <div class="flex">
                  <div class="flex justify-between">
                    <span v-if="order.change_amount < 0" class="font-medium w-20">Belum Bayar</span>
                    <span v-else class="font-medium w-20">Kembalian</span>
                    <span class="mx-2">:</span>
                  </div>
                  <span>{{ formatCurrency(order.change_amount) }}</span>
                </div>
              </div>

              <div class="space-y-1 mt-3 mb-3">
                <div class="flex items-center gap-2 -mt-1">
                  
                  <!-- INPUT MODE -->
                  <template v-if="editingOrder.notes">
                    <textarea class="w-full p-2 border"
                      type="text"
                      rows="5"
                      v-model="orderValues.notes"
                      @blur="saveInfoEdited('notes')"
                    ></textarea>
                    <button @click="saveInfoEdited('notes')">
                      <Check class="w-4 h-4 text-green-600" />
                    </button>
                  </template>

                  <!-- VIEW MODE -->
                  <span v-else class="whitespace-pre-line w-auto border border-accent-foreground border-dashed rounded-lg p-2">{{ order.notes ?? 'Tidak ada catatan' }}</span>

                  <!-- PENCIL -->
                  <button v-if="!editingOrder.notes" @click="startEditOrder('notes')">
                    <Pencil class="w-4 h-4 text-muted-foreground" />
                  </button>

                </div>
              </div>

              <div class="flex gap-2">
                <span class="h-10 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-sm text-xs leading-tight">
                  <div class="font-semibold">Dibuat: {{ order.user_cre?.name }}</div>
                  <div class="opacity-75">{{ formatDate(order.created_at) }}</div>
                </span>
                <span class="h-10 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-sm text-xs leading-tight">
                  <div class="font-semibold">Diubah: {{ order.user_upd?.name }}</div>
                  <div class="opacity-75">{{ formatDate(order.updated_at) }}</div>
                </span>
              </div>

            </div>
            

          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex items-center justify-between">
            <CardTitle><div class="flex items-center gap-2"><PackageOpen/>Produk</div></CardTitle>
            <Button size="sm" variant="ghost" @click="openEditItem()"><Plus /></Button>
          </CardHeader>
          <CardContent>

            <!-- MOBILE -->
            <div
              v-for="(item, i) in order.items"
              :key="i"
              class="md:hidden border rounded-lg p-3 -my-[1px] flex justify-between items-start gap-3"
            >
              <!-- KIRI -->
              <div class="flex-1">
                <div class="font-medium leading-tight">
                  {{ item.product?.name ?? '-' }}
                </div>

                <div class="text-xs text-muted-foreground mt-1">
                  {{ item.quantity_mins }} × {{ formatPrice(item.price) }}
                </div>
              </div>

              <!-- KANAN -->
              <div class="text-right flex flex-col items-end gap-1">
                <div class="font-semibold">
                  {{ formatPrice(item.subtotal) }}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger class="text-muted-foreground">
                    <SquareChevronDown class="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="openEditItem(item)">Edit</DropdownMenuItem>
                    <DropdownMenuItem @click="openDeleteItem(item.id)">Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <!-- DESKTOP -->
            <div class="hidden md:block overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left p-2 text-background">.</th>
                    <th class="text-left p-2">#</th>
                    <th class="text-left p-2">Nama</th>
                    <th class="text-right p-2">Harga</th>
                    <th class="text-right p-2">Qty</th>
                    <th class="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in order.items" :key="i" class="border-b">
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem @click="openEditItem(item)">Edit</DropdownMenuItem>
                          <DropdownMenuItem @click="openDeleteItem(item.id)">Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td class="p-2">{{ i + 1 }}</td>
                    <td class="p-2">{{ item.product?.name ?? '-' }}</td>
                    <td class="text-right p-2">{{ formatPrice(item.price) }}</td>
                    <td class="text-right p-2">{{ formatPrice(item.quantity_mins) }}</td>
                    <td class="text-right p-2 font-medium">{{ formatPrice(item.subtotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Separator class="my-2 bg-transparent" />
            <div class="w-full md:w-1/2 ms-auto text-sm">
              <div class="flex justify-between font-bold">
                <span>Sub Total : </span><span>{{ formatCurrency(order.sub_total) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Diskon :</span>

                <div class="flex items-center gap-2">
                  <!-- TOMBOL PENSIL -->
                  <button v-if="!editing.discount" @click="startEdit('discount')">
                    <Pencil class="w-4 h-4 text-muted-foreground" />
                  </button>

                  <!-- INPUT MODE -->
                  <template v-if="editing.discount">
                    <Input
                      type="number"
                      class="w-28 h-7"
                      v-model.number="values.discount"
                      @keydown.enter="save('discount')"
                      @blur="save('discount')"
                    />
                    <button @click="save('discount')">
                      <Check class="w-4 h-4 text-green-600" />
                    </button>
                  </template>

                  <!-- VIEW MODE -->
                  <span v-else>-Rp {{ formatID(order.discount) }}</span>
                </div>
              </div>
              <div class="flex justify-between">
                <span>Biaya+ :</span>

                <div class="flex items-center gap-2">
                  <button v-if="!editing.charge" @click="startEdit('charge')">
                    <Pencil class="w-4 h-4 text-muted-foreground" />
                  </button>

                  <template v-if="editing.charge">
                    <Input
                      type="number"
                      class="w-28 h-7"
                      v-model.number="values.charge"
                      @keydown.enter="save('charge')"
                      @blur="save('charge')"
                    />
                    <button @click="save('charge')">
                      <Check class="w-4 h-4 text-green-600" />
                    </button>
                  </template>

                  <span v-else>Rp {{ formatID(order.charge) }}</span>
                </div>
              </div>
              <div class="flex justify-between">
                <span>Pajak :</span>

                <div class="flex items-center gap-2">
                  <button v-if="!editing.tax" @click="startEdit('tax')">
                    <Pencil class="w-4 h-4 text-muted-foreground" />
                  </button>

                  <template v-if="editing.tax">
                    <Input
                      type="number"
                      class="w-28 h-7"
                      v-model.number="values.tax"
                      @keydown.enter="save('tax')"
                      @blur="save('tax')"
                    />
                    <button @click="save('tax')">
                      <Check class="w-4 h-4 text-green-600" />
                    </button>
                  </template>

                  <span v-else>Rp {{ formatID(order.tax) }}</span>
                </div>
              </div>
              <div class="flex justify-between font-bold">
                <span>Grand Total : </span><span>{{ formatCurrency(order.grand_total) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>   

        <Card>
          <CardHeader class="flex items-center justify-between">
            <CardTitle><div class="flex items-center gap-2"><CircleDollarSign/>Pembayaran</div></CardTitle>
            <Button size="sm" variant="ghost" @click="openAddPayment()" v-if="order.change_amount < 0"><Plus /></Button>
          </CardHeader>
          <CardContent>

            <!-- MOBILE -->
            <div
              v-for="(pay, p) in order.payments"
              :key="p"
              class="md:hidden border rounded-lg p-3 -my-[1px] flex justify-between items-start gap-3"
            >
              <!-- KIRI -->
              <div class="flex-1">
                <div class="font-medium leading-tight">
                  {{ pay.payment_method }}
                </div>

                <div class="text-xs text-muted-foreground mt-1">
                  Bayar: {{ formatPrice(pay.nominal_plus) }}
                  <span v-if="pay.nominal_mins > 0">
                    • Kembali: {{ formatPrice(pay.nominal_mins) }}
                  </span>
                </div>

                <div class="text-[11px] text-muted-foreground mt-1">
                  {{ formatDate(pay.date) }}
                </div>
              </div>

              <!-- KANAN -->
              <div class="text-right flex flex-col items-end gap-1">
                <div class="font-semibold">
                  {{ formatPrice(pay.nominal) }}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger class="text-muted-foreground">
                    <SquareChevronDown class="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="openEditPayment(pay)">Edit</DropdownMenuItem>
                    <DropdownMenuItem @click="openDelete(pay.id)">Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <!-- DESKTOP -->
            <div class="hidden md:block overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left p-2 text-background">.</th>
                    <th class="text-left p-2">#</th>
                    <th class="text-left p-2">Tanggal</th>
                    <th class="text-left p-2">Metode</th>
                    <th class="text-right p-2">Bayar</th>
                    <th class="text-right p-2">Kembalian</th>
                    <th class="text-right p-2">Diterima</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pay, p) in order.payments" :key="p" class="border-b">
                    <td class="text-left p-2 space-x-2">
                        <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem @click="openEditPayment(pay)">Edit</DropdownMenuItem>
                          <DropdownMenuItem @click="openDelete(pay.id)">Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td class="p-2">{{ p + 1 }}</td>
                    <td class="p-2 text-nowrap">{{ formatDate(pay.date) }}</td>
                    <td class="p-2">{{ pay.payment_method }}</td>
                    <td class="text-right p-2">{{ formatPrice(pay.nominal_plus) }}</td>
                    <td class="text-right p-2">{{ formatPrice(pay.nominal_mins) }}</td>
                    <td class="text-right p-2 font-medium">{{ formatPrice(pay.nominal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Separator class="my-2 bg-transparent" />
            <div class="w-full md:w-1/2 ms-auto text-sm">
              <div class="flex justify-between font-bold">
                <span>Total Diterima : </span><span>{{ formatCurrency(sumPayments(order.payments)) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>  
        <ItemFormModal
          v-model="showItemModal"
          :item="itemEditing"
          :products="props.products"
          @save="saveItem"
        />
        <DeleteItemDialog
          :open="deleteItemDialogOpen"
          :itemId="deleteItemId"
          @update:open="v => deleteItemDialogOpen = v"
        />
        <PaymentFormModal
          v-model="showPaymentModal"
          :payment="paymentEditing"
          @save="savePayment"
        /> 
        <DeletePaymentDialog
          :open="deleteDialogOpen"
          :paymentId="deleteId"
          @update:open="v => deleteDialogOpen = v"
        />


       
        <!-- FLOATING BUTTON -->
        <!-- PRINT -->
        <div class="fixed bottom-2 -translate-x-1/2 left-1/2 z-50">
          <div
            class="
              p-1 space-x-1
              flex items-center justify-center
              rounded-full
              bg-background
              shadow-md
            "
          >
            <Printer class="size-8 p-2 rounded-full hover:bg-blue-500" @click="openPrintLandscape(order.id)"/>
            <ReceiptText class="size-8 p-2 rounded-full hover:bg-blue-500" @click="openPrint(order.id)"/>
            <Truck class="size-8 p-2 rounded-full hover:bg-blue-500" @click="openPrintPackingSlip(order.id)"/>
          </div>
        </div> 
      </div>   
    </AppLayout>
</template>

