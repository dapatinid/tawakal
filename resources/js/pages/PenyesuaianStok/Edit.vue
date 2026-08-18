<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, useForm, usePage, router } from '@inertiajs/vue3'
import { computed, onMounted, ref, watch } from 'vue'
import {
  Package,
  ClipboardList,
  Factory,
  Upload,
  Download,
  Trash2,
} from 'lucide-vue-next'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from "vue-sonner"

const page = usePage();

// =======================================================
// PROPS
// =======================================================
const props = defineProps<{
  adjustment: any
  products: any[]
  adjustmentItemsByToken?: Record<string, any[]>
  pendingAdjustments: any[]
}>()

// =======================================================
// STATE
// =======================================================
const isOpname = computed(() => props.adjustment.flag === 'opname')
const isProduction = computed(() => props.adjustment.flag === 'production')
const isTransfer = computed(() => props.adjustment.flag === 'tf_in' || props.adjustment.flag === 'tf_out')

const showDelete = ref(false)

// Map pending adjustments by product_id
const pendingMap = computed(() => {
  const map: Record<number, number> = {}

  props.pendingAdjustments?.forEach((i: any) => {
    if (!i.product_id) return

    const qty_plus = Number(i.quantity_plus ?? 0)
    const qty_mins = Number(i.quantity_mins ?? 0)

    map[i.product_id] = (map[i.product_id] || 0) + qty_plus - qty_mins
  })

  return map
})

// Toast flash messages
watch(
  () => page.props.flash,
  (flash) => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
    if (flash?.info) toast(flash.info);
  },
  { deep: true, immediate: true }
);

// =======================================================
// FORM (HISTORICAL SAFE)
// =======================================================
const form = useForm({
  date: props.adjustment.date,
  notes: props.adjustment.notes,
  
  items: props.adjustment.items.map((item: any) => {
    // 1. Tentukan nilai Qty awal secara absolut dari database
    const qPlus = Number(item.quantity_plus ?? 0)
    const qMins = Number(item.quantity_mins ?? 0)
    
    // 2. Jika ada plus, berarti positif. Jika ada mins, berarti negatif.
    let qty = 0
    if (qPlus > 0) {
      qty = qPlus
    } else if (qMins > 0) {
      qty = -qMins
    }

    // 3. NORMALIZE BY FLAG (hanya untuk transfer agar tetap konsisten)
    if (props.adjustment.flag === 'tf_out') {
      qty = -Math.abs(qty)
    }
    if (props.adjustment.flag === 'tf_in') {
      qty = Math.abs(qty)
    }

    const stockNow = Number(item.product?.stock ?? 0)
    
    // Perhitungan qty_system harus "mundur" dari stok sekarang
    // Jika stok 10 dan adjusment +2, maka system asal adalah 8.
    const qtySystem = stockNow - qty

    return {
      product_id: item.product_id,
      product_search: `${item.product.sku} — ${item.product.name} — ${item.product.stock}`,
      isOpen: false,
      qty_system: qtySystem,
      
      qty,
      qty_input: String(qty), // Sekarang akan menuliskan "-5" jika qty memang -5

      qty_real: isOpname.value ? Number(item.product.stock) : 0,
      notes: item.notes ?? '',
      cost: item.cost ?? 0,
      subtotal: item.subtotal ?? 0,
      totalcost: item.totalcost ?? 0,
    }
  })
})

// =======================================================
// WATCHERS - COST CALCULATION
// =======================================================
watch(
  () => form.items.map(i => ({ qty: i.qty, cost: i.cost })),
  () => {
    form.items.forEach(item => {
      const qty = Number(item.qty ?? 0)
      const cost = Number(item.cost ?? 0)
      
      if (qty > 0) {
        item.subtotal = qty * cost
        item.totalcost = 0
      } else {
        item.subtotal = 0
        item.totalcost = Math.abs(qty) * cost
      }
    })
  },
  { deep: true, immediate: true }
)

// =======================================================
// HELPERS
// =======================================================
function stockAfter(item: any) {
  return isOpname.value
    ? Number(item.qty_real)
    : Number(item.qty_system) + Number(item.qty ?? 0)
}

function stockBefore(item: any) {
  return Number(item.qty_system ?? 0)
}

function adjustmentDiff(item: any) {
  return isOpname.value
    ? Number(item.qty_real) - Number(item.qty_system)
    : Number(item.qty ?? 0)
}

// =======================================================
// NORMALIZER - BERBEDA UNTUK PRODUCTION VS TRANSFER
// =======================================================
function normalizeQtyByFlag(item: any) {
  // ⚠️ PRODUCTION: TIDAK ADA NORMALISASI (bisa + atau -)
  if (isProduction.value) {
    return // Skip normalization
  }

  // TRANSFER: PAKSA ARAH
  if (props.adjustment.flag === 'tf_out' && item.qty > 0) {
    item.qty = -Math.abs(item.qty)
  }

  if (props.adjustment.flag === 'tf_in' && item.qty < 0) {
    item.qty = Math.abs(item.qty)
  }
}

function incrementQty(item: any, step = 1) {
  item.qty = Number(item.qty ?? 0) + step
  normalizeQtyByFlag(item)
  item.qty_input = String(item.qty)
}

function decrementQty(item: any, step = 1) {
  item.qty = Number(item.qty ?? 0) - step
  normalizeQtyByFlag(item)
  item.qty_input = String(item.qty)
}

// =======================================================
// PRODUCTION: INPUT BEBAS (TIDAK NORMALISASI)
// =======================================================
function syncQtyProduction(item: any) {
  const val = item.qty_input

  // izinkan typing bebas termasuk minus
  if (val === '' || val === '-') return

  const num = Number(val)
  if (!Number.isNaN(num)) {
    item.qty = num // ✅ Langsung assign tanpa normalisasi
  }
}

function finalizeQtyProduction(item: any) {
  let num = Number(item.qty_input)

  if (Number.isNaN(num)) num = 0

  item.qty = num // ✅ Langsung assign tanpa normalisasi
  item.qty_input = String(item.qty)
}

// =======================================================
// TRANSFER: INPUT DENGAN NORMALISASI
// =======================================================
function syncQtyTransfer(item: any) {
  const val = item.qty_input

  // izinkan typing bebas
  if (val === '' || val === '-') return

  const num = Number(val)
  if (!Number.isNaN(num)) {
    item.qty = num
  }
}

function finalizeQtyTransfer(item: any) {
  let num = Number(item.qty_input)

  if (Number.isNaN(num)) num = 0

  item.qty = num
  normalizeQtyByFlag(item) // ✅ Normalisasi untuk transfer

  item.qty_input = String(item.qty)
}

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true

  // Force sync qty_input dari qty asli hasil inisialisasi form
  // Ini untuk memastikan jika di hosting ada 'race condition' saat booting halaman
  form.items.forEach(item => {
    if (item.qty !== 0) {
      item.qty_input = String(item.qty)
    }
  })
})

// OPNAME MODE - AUTO CALCULATE QTY FROM QTY_REAL
watch(
  () => form.items.map(i => i.qty_real),
  () => {
    if (!isMounted.value) return
    if (!isOpname.value) return

    form.items.forEach(item => {
      const diff = Number(item.qty_real) - Number(item.qty_system)
      item.qty = diff
      item.qty_input = String(diff)
    })
  },
  {
    deep: true,
    flush: 'post',
  }
)

// =======================================================
// ACTIONS
// =======================================================
function submit() {
  // ✅ VALIDASI SEBELUM SUBMIT
  const invalidItems = form.items.filter(item => !item.product_id)
  
  if (invalidItems.length > 0) {
    toast.error('Ada item yang belum dipilih produknya!')
    return
  }

  form.put(`/penyesuaian-stok/${props.adjustment.id}`)
}

function destroy() {
  router.delete(`/penyesuaian-stok/${props.adjustment.id}`, {
    onFinish: () => (showDelete.value = false),
  })
}

const breadcrumbs= [
    {
        title: 'Penyesuaian Stok',
        href: `/penyesuaian-stok`,
    },
    {
        title: 'Edit Penyesuaian',
        href: `/penyesuaian-stok/${props.adjustment.id}/edit`,
    },
];

// =======================================================
// MONITORING TRANSFER (READ ONLY)
// =======================================================
const transferItems = computed(() => {
  const token = props.adjustment.transfer_token
  if (!token) return []

  const adjustments = props.adjustmentItemsByToken?.[token] ?? []

  // map pengirim (tf_out) berdasarkan SKU
  const senderMap: Record<string, number> = {}

  adjustments.forEach(adj => {
    if (adj.flag === 'tf_out') {
      adj.items.forEach((i: any) => {
        if (i.product?.sku) {
          senderMap[i.product.sku] = i.quantity_mins
        }
      })
    }
  })

  // penerima (tf_in)
  const receiverItems = adjustments
    .filter(adj => adj.flag === 'tf_in')
    .flatMap(adj =>
      adj.items.map((i: any) => {
        const sku = i.product?.sku
        const qtyOut = sku ? senderMap[sku] ?? 0 : 0
        const qtyIn = i.quantity_plus ?? 0

        let status: 'done' | 'pending' | 'mismatch' = 'pending'
        if (qtyOut === 0) status = 'pending'
        else if (qtyOut === qtyIn) status = 'done'
        else status = 'mismatch'

        return {
          product_id: i.product_id,
          sku,
          product: i.product,
          qty_out: qtyOut,
          qty_in: qtyIn,
          status,
        }
      })
    )

  // item pengirim yang belum diterima
  const pendingItems = Object.entries(senderMap)
    .filter(([sku]) => !receiverItems.find(r => r.sku === sku))
    .map(([sku, qty]) => ({
      product_id: props.products.find(p => p.sku === sku)?.id ?? 0,
      sku,
      product: props.products.find(p => p.sku === sku) ?? { name: 'Unknown' },
      qty_out: qty,
      qty_in: 0,
      status: 'pending' as const,
    }))

  return [...receiverItems, ...pendingItems]
})

function createEmptyItem() {
  return {
    product_id: null,
    qty_system: null,

    qty: 0,
    qty_real: 0,
    qty_input: '0',

    notes: '',
    cost: 0,
    subtotal: 0,
    totalcost: 0,

    product_search: '',
    isOpen: false,
  }
}

function addItem() {
  form.items.push(createEmptyItem())
}

function removeItem(index: number) {
  if (form.items.length <= 1) return
  form.items.splice(index, 1)
}

function filteredProducts(item: any) {
  const search = item.product_search?.toLowerCase() || ''
  return props.products.filter(p =>
    p.name.toLowerCase().includes(search) ||
    p.sku.toLowerCase().includes(search)
  )
}

function selectProductItem(item: any, product: any) {
  item.product_id = product.id
  item.product_search = `${product.sku} — ${product.name} — ${product.stock}`
  item.isOpen = false

  // ✅ SET STOK SISTEM
  item.qty_system = Number(product.stock)

  // default cost
  item.cost = product.cost ?? 0

  if (isOpname.value) {
    // opname → real = stok sekarang
    item.qty_real = Number(product.stock)
    item.qty = 0
    item.qty_input = '0'
  } else {
    item.qty = 0
    item.qty_real = 0
    item.qty_input = '0'
  }
}

// =======================================================
// TOTAL COST SUMMARY (AKUNTANSI)
// =======================================================
const totalCostPositive = computed(() => {
  return form.items.reduce((sum, item) => {
    return sum + Math.max(Number(item.subtotal ?? 0), 0)
  }, 0)
})

const totalCostNegative = computed(() => {
  return form.items.reduce((sum, item) => {
    return sum + Math.max(Number(item.totalcost ?? 0), 0)
  }, 0)
})

const totalCostFinal = computed(() => {
  return totalCostPositive.value - totalCostNegative.value
})
</script>

<template>
  <Head title="Edit Penyesuaian" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="max-w-4xl mx-auto p-4 space-y-4">

      <!-- FLAG -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="tab in [
            { key: 'opname', label: 'Opname', icon: ClipboardList },
            { key: 'production', label: 'Production', icon: Factory },
            { key: 'tf_out', label: 'Transfer Out', icon: Upload },
            { key: 'tf_in', label: 'Transfer In', icon: Download },
          ]"
          :key="tab.key"
          disabled
          class="flex items-center justify-center gap-2 px-3 py-2 rounded border text-sm opacity-60"
          :class="adjustment.flag === tab.key
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-background'"
        >
          <component :is="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </div>

      <div class="grid grid-cols-1">
        <h3 class="mx-auto font-black text-xl text-foreground">{{ adjustment.code }}</h3>
      </div>

      <!-- TOKEN dan Branch Terkait-->
      <div
        v-if="props.adjustment.transfer_token"
        class="flex justify-between items-center border rounded px-3 py-2 bg-background"
      >
        <span class="text-sm">
          Transfer Token :
          <strong>{{ props.adjustment.transfer_token }}</strong>
        </span>

        <span
          v-if="props.adjustment.counterpart_branch_name"
          class="text-sm text-gray-500"
        >
          <template v-if="props.adjustment.flag === 'tf_out'">
            Ke {{ props.adjustment.counterpart_branch_name }}
          </template>

          <template v-else-if="props.adjustment.flag === 'tf_in'">
            Dari {{ props.adjustment.counterpart_branch_name }}
          </template>
        </span>
      </div>

      <!-- DATE & NOTES -->
      <div class="grid md:grid-cols-2 gap-3">
        <input disabled v-model="form.date" class="border rounded px-3 py-2" />
        <input v-model="form.notes" class="border rounded px-3 py-2" placeholder="Catatan penyesuaian" />
      </div>

      <!-- ITEMS -->
      <div class="space-y-3">
        <div
          v-for="(item, i) in form.items"
          :key="i"
          class="border rounded-lg p-3 space-y-2 bg-background"
        >

          <div class="flex items-center justify-between gap-2 font-semibold text-sm">
            <span class="flex flex-nowrap items-center gap-2">
              <Package class="size-4" />
              <span>Item {{ i + 1 }}</span>
            </span>

            <button
              type="button"
              @click="removeItem(i)"
              class="text-red-600 text-xs hover:text-red-800"
              v-if="form.items.length > 1"
            >
              Hapus Item
            </button>            
          </div>

          <div class="relative w-full">
            <input
              v-model="item.product_search"
              type="text"
              placeholder="Cari produk..."
              class="w-full border rounded px-3 py-2 text-sm"
              @focus="item.isOpen = true"
              @input="item.isOpen = true"
              @keydown.esc="item.isOpen = false"
            />

            <div
              v-if="item.isOpen && filteredProducts(item).length"
              class="absolute z-20 mt-1 w-full max-h-60 overflow-auto border rounded bg-white shadow"
            >
              <button
                v-for="p in filteredProducts(item)"
                :key="p.id"
                type="button"
                class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                @mousedown="selectProductItem(item, p)"
              >
                {{ p.sku }} — {{ p.name }}
                <span class="text-xs text-gray-400 ml-1">
                  ({{ p.stock }})
                </span>
              </button>
            </div>
          </div>

          <!-- OPNAME -->
          <div v-if="isOpname" class="grid grid-cols-3 gap-2">
            <input 
              disabled 
              :value="stockBefore(item)" 
              class="border rounded px-2 py-1 bg-accent text-center" 
            />

            <input
              disabled
              :value="adjustmentDiff(item)"
              class="border rounded px-2 py-1 text-center font-semibold"
              :class="adjustmentDiff(item) < 0 ? 'text-red-600' : 'text-green-600'"
            />

            <input
              v-model.number="item.qty_real"
              type="number"
              class="border rounded px-2 py-1 text-center"
            />

            <p
              v-if="pendingMap[item.product_id]"
              class="text-xs text-orange-600 mx-auto col-span-3"
            >
              Terdapat Qty NEW / CANCELED total: [ {{ pendingMap[item.product_id] }} ] 
            </p>          
          </div>

          <!-- NON OPNAME -->
          <div v-else class="grid grid-cols-3 gap-2">
            <input 
              disabled 
              :value="stockBefore(item)" 
              class="border rounded px-2 py-1 bg-accent text-center" 
            />

            <!-- ✅ PRODUCTION: Input bebas tanpa normalisasi -->
            <div v-if="isProduction" class="flex items-center border rounded overflow-hidden">
              <button 
                type="button" 
                @click="decrementQty(item)" 
                class="px-3 hover:bg-gray-100"
              >
                −
              </button>
              <input 
                class="text-center flex-1 min-w-0 px-2"
                type="text"
                v-model="item.qty_input"
                @input="syncQtyProduction(item)"
                @blur="finalizeQtyProduction(item)"
              />
              <button 
                type="button" 
                @click="incrementQty(item)" 
                class="px-3 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <!-- ✅ TRANSFER: Input dengan normalisasi -->
            <div v-else class="flex items-center border rounded overflow-hidden">
              <button 
                type="button" 
                @click="decrementQty(item)" 
                class="px-3 hover:bg-gray-100"
              >
                −
              </button>
              <input 
                class="text-center flex-1 min-w-0 px-2"
                type="text"
                v-model="item.qty_input"
                @input="syncQtyTransfer(item)"
                @blur="finalizeQtyTransfer(item)"
              />
              <button 
                type="button" 
                @click="incrementQty(item)" 
                class="px-3 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <input
              disabled
              :value="stockAfter(item)"
              class="border rounded px-2 py-1 bg-accent text-center font-semibold"
            />
          </div>

          <p v-if="isProduction" class="text-xs text-muted-foreground">
            💡 Production: Qty bisa positif (produksi) atau negatif (bahan baku)
          </p>

          <p v-if="adjustment.flag === 'tf_out'" class="text-xs text-muted-foreground">
            💡 Transfer Out: Qty otomatis negatif (stok keluar)
          </p>

          <p v-if="adjustment.flag === 'tf_in'" class="text-xs text-muted-foreground">
            💡 Transfer In: Qty otomatis positif (stok masuk)
          </p>

          <input 
            v-model="item.notes" 
            class="w-full border rounded px-3 py-2 text-sm" 
            placeholder="+ Catatan item"
          />

          <div class="text-gray-500 text-sm flex justify-between">
            <span>Cost: {{ Number(item.cost).toLocaleString('id-ID') }}</span>
            
            <span v-if="item.subtotal != 0" class="text-green-600">
              Total: {{ Number(item.subtotal).toLocaleString('id-ID') }}
            </span>
            
            <span v-else class="text-red-500">
              Total: -{{ Number(item.totalcost).toLocaleString('id-ID') }}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addItem"
        class="w-full py-2 border border-dashed rounded-lg text-sm hover:bg-gray-50"
      >
        + Tambah Item
      </button>

      <!-- TOTAL SUMMARY -->
      <div class="mt-3 border rounded-lg p-3 text-sm bg-background space-y-1">
        <div class="flex justify-between">
          <span class="text-gray-500">Total Cost (+)</span>
          <span class="text-green-600 font-semibold">
            {{ totalCostPositive.toLocaleString('id-ID') }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Total Cost (−)</span>
          <span class="text-red-600 font-semibold">
            {{ totalCostNegative.toLocaleString('id-ID') }}
          </span>
        </div>

        <div class="border-t pt-1 flex justify-between font-bold">
          <span>Total Akhir</span>
          <span
            :class="totalCostFinal >= 0
              ? 'text-green-600'
              : 'text-red-600'"
          >
            {{ totalCostFinal.toLocaleString('id-ID') }}
          </span>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="mt-3 flex gap-2">
        <!-- DELETE -->
        <button
          type="button"
          @click="showDelete = true"
          class="w-12 bg-red-500 text-white rounded-md py-2 grow-0 hover:bg-red-600"
        >
          <Trash2 class="size-5 mx-auto" />
        </button>

        <!-- UPDATE -->
        <button
          type="button"
          @click="submit"
          :disabled="form.processing"
          class="w-full bg-gray-800 text-white
                dark:bg-white dark:text-black
                rounded-md py-3 disabled:opacity-50
                hover:opacity-90 transition"
        >
          Update
        </button>
      </div>

      <!-- DELETE DIALOG -->
      <Dialog v-model:open="showDelete">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Adjustment?</DialogTitle>
            <DialogDescription>
              Data stok akan dikembalikan seperti semula.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter class="flex justify-end gap-2">
            <button class="px-4 py-2 border rounded hover:bg-gray-50" @click="showDelete = false">
              Batal
            </button>
            <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" @click="destroy">
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- MONITORING TRANSFER -->
      <div
        v-if="adjustment.transfer_token"
        class="mt-6 p-4 border rounded-lg bg-background"
      >
        <div class="mb-2 flex flex-nowrap gap-3">
          <h3 class="font-semibold">📦 Monitoring Transfer</h3>
          <span class="ms-auto px-2 rounded-sm flex items-center"
            :class="adjustment.status === 'done'
              ? 'text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-800'
              : 'text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800'"
          >
            {{ adjustment.status.toUpperCase() }}
          </span>
        </div>

        <table class="w-full mt-2 text-sm border-collapse">
          <thead>
            <tr class="border-b">
              <th class="text-left px-2 py-1">Produk</th>
              <th class="text-center px-2 py-1">Qty Out</th>
              <th class="text-center px-2 py-1">Qty In</th>
              <th class="text-center px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transferItems" :key="item.product_id" class="border-b">
              <td class="px-2 py-1">{{ item.product.name }}</td>
              <td class="text-center px-2 py-1">{{ item.qty_out }}</td>
              <td class="text-center px-2 py-1">{{ item.qty_in }}</td>
              <td class="text-center px-2 py-1">
                <span v-if="item.status === 'done'" class="text-green-600">
                  🟢 Diterima
                </span>
                <span v-else-if="item.status === 'pending'" class="text-yellow-500">
                  🟡 Menunggu
                </span>
                <span v-else class="text-red-600">
                  🔴 Tidak cocok
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AppLayout>
</template>