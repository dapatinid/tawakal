<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, useForm } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import { Plus, Trash2, Package, Search, Upload, Download } from 'lucide-vue-next'
import { ClipboardList, Factory } from 'lucide-vue-next'
import { toast } from "vue-sonner"

const props = defineProps<{
  products: {
    id: number
    sku: string
    name: string
    stock: number
    cost?: number
  }[]
  pendingAdjustments: {
    product_id: number
    quantity_plus: number
    quantity_mins: number
  }[]
}>()

const flag = ref<'opname' | 'production' | 'tf_in' | 'tf_out'>('opname')
const isOpname = computed(() => flag.value === 'opname')

const pendingMap = computed(() => {
  const map: Record<number, number> = {}

  props.pendingAdjustments?.forEach((i: any) => {
    if (!i.product_id) return

    const qty_plus = Number(i.quantity_plus || 0)
    const qty_mins = Number(i.quantity_mins || 0)

    map[i.product_id] = (map[i.product_id] || 0) + qty_plus - qty_mins
  })

  return map
})

const form = useForm({
  flag: flag.value,
  transfer_token: '',
  date: '',
  notes: '',
  items: [
    {
      product_id: null,
      qty_system: 0,
      qty_real: 0,
      qty: 0,
      qty_input: '0', // ✅ Tambah qty_input
      notes: '',
      cost: 0,
      subtotal: 0,
      totalcost: 0,
      product_search: '',
      isOpen: false,
    },
  ],
})

watch(flag, v => (form.flag = v))

function productById(id: number | null) {
  return props.products.find(p => p.id === id)
}

function finalStock(item: any) {
  return Number(item.qty_system) + Number(item.qty || 0)
}

function opnameDiff(item: any) {
  return Number(item.qty_real) - Number(item.qty_system)
}

// =======================================================
// QTY MANAGEMENT (SAMA SEPERTI EDIT.VUE)
// =======================================================
function normalizeQtyByFlag(item: any) {
  if (flag.value === 'tf_out' && item.qty > 0) {
    item.qty = -Math.abs(item.qty)
  }

  if (flag.value === 'tf_in' && item.qty < 0) {
    item.qty = Math.abs(item.qty)
  }
}

function incrementQty(item: any, step = 1) {
  item.qty = Number(item.qty || 0) + step
  normalizeQtyByFlag(item)
  item.qty_input = String(item.qty) // ✅ Update qty_input
}

function decrementQty(item: any, step = 1) {
  item.qty = Number(item.qty || 0) - step
  normalizeQtyByFlag(item)
  item.qty_input = String(item.qty) // ✅ Update qty_input
}

function syncQty(item: any) {
  const val = item.qty_input

  // izinkan typing bebas
  if (val === '' || val === '-') return

  const num = Number(val)
  if (!Number.isNaN(num)) {
    item.qty = num
  }
}

function finalizeQty(item: any) {
  let num = Number(item.qty_input)

  if (Number.isNaN(num)) num = 0

  item.qty = num
  normalizeQtyByFlag(item)

  // 🔁 Set ulang input
  item.qty_input = String(item.qty)
}

// =======================================================
// COST CALCULATION
// =======================================================
watch(
  () => form.items.map(i => ({ qty: i.qty, cost: i.cost })),
  () => {
    form.items.forEach(item => {
      const qty = Number(item.qty || 0)
      const cost = Number(item.cost || 0)
      
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
// ITEM MANAGEMENT
// =======================================================
function addItem() {
  form.items.push({
    product_id: null,
    qty_system: 0,
    qty_real: 0,
    qty: 0,
    qty_input: '0',
    notes: '',
    cost: 0,
    subtotal: 0,
    totalcost: 0,
    product_search: '',
    isOpen: false,
  })
}

function removeItem(i: number) {
  if (form.items.length > 1) {
    form.items.splice(i, 1)
  }
}

/**
 * Auto set stock system saat product dipilih
 */
watch(
  () => form.items.map(i => i.product_id),
  () => {
    form.items.forEach(item => {
      const p = productById(item.product_id)
      if (!p) return

      // Set cost dari product
      item.cost = p.cost || 0

      if (isOpname.value) {
        const pending = pendingMap.value[p.id] || 0
        item.qty_system = p.stock - pending
      } else {
        item.qty_system = p.stock
      }
    })
  },
  { deep: true }
)

/**
 * 🔥 OPNAME MODE - AUTO CALCULATE QTY
 */
watch(
  () => form.items.map(i => [i.qty_real, i.qty_system]),
  () => {
    if (!isOpname.value) return
    form.items.forEach(item => {
      const diff = opnameDiff(item)
      item.qty = diff
      item.qty_input = String(diff)
    })
  },
  { deep: true }
)

/**
 * Normalize saat flag berubah
 */
watch(flag, () => {
  form.items.forEach(item => {
    normalizeQtyByFlag(item)
    item.qty_input = String(item.qty)
  })
})

function submit() {
  // ✅ VALIDASI
  const invalidItems = form.items.filter(item => !item.product_id)
  
  if (invalidItems.length > 0) {
    toast.error('Ada item yang belum dipilih produknya!')
    return
  }

  if (flag.value === 'tf_in' && !isTokenValid.value) {
    toast.error('Token transfer tidak valid!')
    return
  }

  form.post('/penyesuaian-stok')
}

const breadcrumbs = [
    { title: 'Penyesuaian Stok', href: '/penyesuaian-stok' },
    { title: 'Buat Penyesuaian', href: '/penyesuaian-stok/create' }
];

// =======================================================
// DROPDOWN PRODUK
// =======================================================
function selectProductItem(item: any, product: any) {
  item.product_id = product.id
  item.product_search = `${product.sku} — ${product.name} — ${product.stock}`
  item.isOpen = false

  // Auto-set stok system
  item.qty_system = product.stock

  // Set cost
  item.cost = product.cost || 0

  if (isOpname.value) {
    // ✅ Set qty_real ke stock saat ini
    item.qty_real = product.stock
    item.qty = 0
    item.qty_input = '0'
  } else {
    item.qty = 0
    item.qty_input = '0'
    normalizeQtyByFlag(item)
  }
}

function filteredProducts(item: any) {
  const search = item.product_search?.toLowerCase() || ''
  return props.products.filter(p =>
    p.name.toLowerCase().includes(search) ||
    p.sku.toLowerCase().includes(search)
  )
}

function hasPending(item: any) {
  if (!item.product_id) return false
  return (pendingMap.value[item.product_id] || 0) !== 0
}

// =======================================================
// TRANSFER TOKEN VALIDATION
// =======================================================
const isTokenValid = ref(false)
const tokenTouched = ref(false)

function loadTransferToken() {
  tokenTouched.value = true

  if (!form.transfer_token) {
    isTokenValid.value = false
    return toast.info('Masukkan token terlebih dahulu')
  }

  router.get(
    `/penyesuaian-stok/transfer-token/${form.transfer_token}`,
    {},
    {
      preserveState: true,
      replace: false,
      onSuccess: page => {
        const tfOut = page.props.tfOut

        if (!tfOut || !Array.isArray(tfOut.items)) {
          isTokenValid.value = false
          return toast.info('Token tidak valid atau sudah diterima')
        }

        // RESET ITEMS
        form.items = []

        // VALIDASI & MAP BERDASARKAN SKU
        for (const i of tfOut.items) {
          const sku = i.product?.sku

          if (!sku) {
            isTokenValid.value = false
            form.items = []
            return toast.info('Data transfer rusak (SKU tidak ditemukan)')
          }

          // CARI PRODUK DI CABANG PENERIMA (BERDASARKAN SKU)
          const targetProduct = props.products.find(p => p.sku === sku)

          if (!targetProduct) {
            isTokenValid.value = false
            form.items = []
            return toast.info(
              `Produk dengan SKU "${sku}" tidak tersedia di cabang ini`
            )
          }

          const qty = i.quantity_mins || 0

          form.items.push({
            product_id: targetProduct.id,
            qty_system: targetProduct.stock || 0,
            qty_real: 0,
            qty: qty,
            qty_input: String(qty), // ✅ Set qty_input juga
            notes: i.notes || '',
            cost: targetProduct.cost || 0,
            subtotal: 0,
            totalcost: 0,
            product_search: `${targetProduct.sku} — ${targetProduct.name} — ${targetProduct.stock}`,
            isOpen: false,
          })
        }

        // NORMALISASI QTY SESUAI FLAG
        form.items.forEach(item => {
          normalizeQtyByFlag(item)
          item.qty_input = String(item.qty)
        })

        isTokenValid.value = true
        toast.success('Token berhasil dimuat!')
      },
      onError: () => {
        isTokenValid.value = false
        toast.error('Gagal memuat token transfer')
      },
    }
  )
}

const canSubmit = computed(() => {
  if (flag.value === 'tf_in') {
    return form.transfer_token && isTokenValid.value && form.items.length > 0 && form.notes
  }
  return form.items.length > 0 && form.notes
})

const tokenClass = computed(() => {
  if (!tokenTouched.value) return 'border-gray-300'
  return isTokenValid.value ? 'border-green-500' : 'border-red-600'
})

// =======================================================
// TOTAL COST SUMMARY
// =======================================================
const totalCostPositive = computed(() => {
  return form.items.reduce((sum, item) => {
    return sum + Math.max(Number(item.subtotal || 0), 0)
  }, 0)
})

const totalCostNegative = computed(() => {
  return form.items.reduce((sum, item) => {
    return sum + Math.max(Number(item.totalcost || 0), 0)
  }, 0)
})

const totalCostFinal = computed(() => {
  return totalCostPositive.value - totalCostNegative.value
})
</script>

<template>
  <Head title="Buat Penyesuaian" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <form @submit.prevent="submit" class="max-w-2xl mx-auto p-4 space-y-4">

      <!-- FLAG -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button 
          type="button" 
          @click="flag = 'opname'"
          :class="flag === 'opname' ? 'bg-blue-600 text-white border-blue-600' : 'bg-background'"
          class="flex gap-2 items-center justify-center rounded border px-3 py-2 transition"
        >
          <ClipboardList class="size-4" /> Opname
        </button>

        <button 
          type="button" 
          @click="flag = 'production'"
          :class="flag === 'production' ? 'bg-blue-600 text-white border-blue-600' : 'bg-background'"
          class="flex gap-2 items-center justify-center rounded border px-3 py-2 transition"
        >
          <Factory class="size-4" /> Production
        </button>

        <button 
          type="button" 
          @click="flag = 'tf_out'"
          :class="flag === 'tf_out' ? 'bg-blue-600 text-white border-blue-600' : 'bg-background'"
          class="flex gap-2 items-center justify-center rounded border px-3 py-2 transition"
        >
          <Upload class="size-4" /> Transfer Out
        </button>

        <button 
          type="button" 
          @click="flag = 'tf_in'"
          :class="flag === 'tf_in' ? 'bg-blue-600 text-white border-blue-600' : 'bg-background'"
          class="flex gap-2 items-center justify-center rounded border px-3 py-2 transition"
        >
          <Download class="size-4" /> Transfer In
        </button>
      </div>

      <!-- DATE & NOTES -->
      <div class="grid md:grid-cols-2 gap-3">
        <input 
          v-model="form.date" 
          type="datetime-local" 
          class="border rounded px-3 py-2" 
        />
        <input 
          v-model="form.notes" 
          required 
          placeholder="Catatan (wajib)"
          class="border rounded px-3 py-2" 
        />
      </div>

      <!-- TRANSFER TOKEN (hanya untuk TF IN) -->
      <div v-if="flag === 'tf_in'" class="space-y-2">
        <div class="flex gap-2 items-center">
          <input 
            v-model="form.transfer_token"
            placeholder="Masukkan token Transfer In"
            :class="`border rounded px-3 py-2 flex-1 transition ${tokenClass}`" 
          />
          <button 
            type="button" 
            @click="loadTransferToken"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Ambil Persediaan
          </button>
        </div>
        
        <p v-if="tokenTouched && !isTokenValid" class="text-xs text-red-600">
          Token tidak valid atau sudah diterima
        </p>
        <p v-if="isTokenValid" class="text-xs text-green-600">
          ✓ Token valid - {{ form.items.length }} item dimuat
        </p>
      </div>

      <!-- ITEMS -->
      <div class="space-y-3">
        <div 
          v-for="(item, i) in form.items" 
          :key="i"
          class="border rounded-lg p-3 space-y-2 bg-background"
        >

          <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center text-sm font-semibold">
              <Package class="size-4" /> Item {{ i + 1 }}
            </div>
            <button 
              v-if="form.items.length > 1" 
              type="button" 
              @click="removeItem(i)"
              class="hover:bg-red-50 p-1 rounded transition"
            >
              <Trash2 class="size-4 text-red-600" />
            </button>
          </div>

          <!-- SEARCHABLE PRODUCT -->
          <div class="relative w-full">
            <Search class="absolute left-3 top-2.5 size-5 text-gray-400 pointer-events-none" />
            <input
              v-model="item.product_search"
              type="text"
              placeholder="Cari produk..."
              class="ps-10 px-3 py-2.5 rounded-lg text-sm w-full
                    bg-white dark:bg-gray-900
                    border border-gray-300 dark:border-gray-600
                    focus:ring-2 focus:ring-blue-500 focus:outline-none"
              @focus="item.isOpen = true"
              @input="item.isOpen = true"
              @keydown.esc="item.isOpen = false"
            />

            <div
              v-if="item.isOpen && filteredProducts(item).length"
              class="absolute mt-1 z-20 w-full rounded-lg border
                    border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-900 shadow-lg max-h-60 overflow-auto"
            >
              <button
                v-for="p in filteredProducts(item)"
                :key="p.id"
                type="button"
                @mousedown="selectProductItem(item, p)"
                class="w-full text-left px-3 py-2 text-sm
                      hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              >
                {{ p.sku }} — {{ p.name }}
                <span class="text-xs text-gray-400 ml-1">({{ p.stock }})</span>
              </button>
            </div>
          </div>

          <!-- OPNAME MODE -->
          <div v-if="isOpname" class="grid grid-cols-3 gap-2">
            <input 
              disabled 
              v-model.number="item.qty_system"
              class="border rounded px-2 py-1 bg-accent text-center" 
            />

            <input 
              disabled 
              :value="opnameDiff(item)"
              class="border rounded px-2 py-1 bg-accent text-center font-semibold"
              :class="opnameDiff(item) < 0 ? 'text-red-600' : 'text-green-600'" 
            />

            <input 
              v-model.number="item.qty_real" 
              type="number"
              class="border rounded px-2 py-1 text-center"
              placeholder="Stok real" 
            />

            <p v-if="hasPending(item)" class="text-xs text-orange-600 col-span-3">
              Qty sistem sudah dikurangi transaksi NEW / CANCELED
            </p>
          </div>

          <!-- NON OPNAME MODE -->
          <div v-else class="grid grid-cols-3 gap-2">
            <input 
              disabled 
              v-model.number="item.qty_system"
              class="border rounded px-2 py-1 bg-accent text-center" 
            />

            <div class="flex items-center border rounded overflow-hidden">
              <button
                type="button"
                @click="decrementQty(item)"
                class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                −
              </button>

              <input
                type="text"
                v-model="item.qty_input"
                @input="syncQty(item)"
                @blur="finalizeQty(item)"
                class="flex-1 min-w-0 text-center px-2 py-1 focus:outline-none"
                placeholder="0"
              />

              <button
                type="button"
                @click="incrementQty(item)"
                class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                +
              </button>
            </div>

            <input 
              disabled 
              :value="finalStock(item)"
              class="border rounded px-2 py-1 bg-accent text-center font-semibold" 
            />
          </div>
          
          <p v-if="flag === 'tf_out'" class="text-xs text-muted-foreground">
            💡 Qty harus bernilai minus (stok keluar)
          </p>

          <p v-if="flag === 'tf_in'" class="text-xs text-muted-foreground">
            💡 Qty harus bernilai plus (stok masuk)
          </p>

          <input 
            v-model="item.notes"
            placeholder="Catatan item (opsional)"
            class="w-full border rounded px-3 py-2 text-sm" 
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

        <button 
          type="button" 
          @click="addItem"
          class="w-full py-2 border border-dashed rounded-lg flex justify-center gap-2 hover:bg-gray-50 transition"
        >
          <Plus class="size-4" /> Tambah Item
        </button>
      </div>

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

      <button 
        type="submit"
        :disabled="form.processing || !canSubmit"
        class="w-full py-3 bg-blue-600 text-white rounded-lg 
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-blue-700 transition"
      >
        {{ form.processing ? 'Menyimpan...' : 'Simpan Adjustment' }}
      </button>

    </form>
  </AppLayout>
</template>