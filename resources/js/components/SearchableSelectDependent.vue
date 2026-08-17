<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, null],
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  label: { type: String, required: true },
  valueKey: { type: String, default: 'value' },
  labelKey: { type: String, default: 'label' },
  multiple: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
const wrapper = ref<HTMLElement | null>(null)
const open = ref(false)
const search = ref('')

// ===================
// NORMALIZED VALUE
// ===================
const selectedValues = computed<any[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue.map(String) : []
  }
  return props.modelValue !== null ? [String(props.modelValue)] : []
})

const selectedItems = computed(() =>
  props.items.filter(i => selectedValues.value.includes(String(i[props.valueKey])))
)

// ===================
// PLACEHOLDER
// ===================
const placeholder = computed(() => {
  if (props.multiple) return `Pilih ${props.label.toLowerCase()}...`
  return selectedItems.value[0]?.[props.labelKey] ?? `Cari ${props.label.toLowerCase()}...`
})

// ===================
// FILTER
// ===================
const filteredItems = computed(() =>
  props.items.filter(i =>
    i[props.labelKey].toLowerCase().includes(search.value.toLowerCase())
  )
)

// ===================
// SELECT ITEM
// ===================
function selectItem(item: any) {
  const value = String(item[props.valueKey])
  if (props.multiple) {
    const next = [...selectedValues.value]
    if (!next.includes(value)) next.push(value)
    emit('update:modelValue', next)
    search.value = ''
    open.value = true
  } else {
    emit('update:modelValue', value)
    search.value = item[props.labelKey]
    open.value = false
  }
}

// ===================
// REMOVE / CLEAR
// ===================
function removeItem(value: any) {
  const next = selectedValues.value.filter(v => v !== String(value))
  emit('update:modelValue', next)
}

function clearSingle() {
  emit('update:modelValue', null)
  search.value = ''
  open.value = true
}

// ===================
// SYNC SEARCH (SINGLE)
// ===================
watch(
  () => props.modelValue,
  () => {
    if (!props.multiple) search.value = selectedItems.value[0]?.[props.labelKey] ?? ''
  },
  { immediate: true }
)

// ===================
// CLICK OUTSIDE
// ===================
function onClickOutside(e: MouseEvent) {
  if (!wrapper.value) return
  if (!wrapper.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div class="relative" ref="wrapper">

    <!-- MULTIPLE TAGS -->
    <div v-if="multiple && selectedItems.length" class="flex flex-wrap gap-1 mb-1">
      <span v-for="item in selectedItems" :key="item[valueKey]"
            class="bg-gray-200 dark:bg-neutral-700 px-2 py-1 rounded text-sm flex items-center gap-1">
        {{ item[labelKey] }}
        <button @click="removeItem(item[valueKey])" class="text-gray-500 hover:text-red-600">✕</button>
      </span>
    </div>

    <!-- INPUT -->
    <div class="relative">
      <input type="text" v-model="search" :placeholder="placeholder"
             @focus="open = true"
             class="w-full border px-3 py-2 pr-8 rounded-md bg-background dark:text-white" />

      <button v-if="!multiple && modelValue !== null" @click="clearSingle"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">✕</button>
    </div>

    <!-- DROPDOWN -->
    <div v-if="open" class="absolute z-20 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 w-full mt-1 max-h-48 overflow-auto rounded shadow">
      <div v-for="item in filteredItems" :key="item[valueKey]"
           @click="selectItem(item)"
           class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700">
        {{ item[labelKey] }}
      </div>

      <div v-if="filteredItems.length === 0" class="text-sm p-3 text-gray-500 dark:text-gray-400">
        Tidak ada hasil
      </div>
    </div>

  </div>
</template>
