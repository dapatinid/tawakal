<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const el = ref<HTMLElement | null>(null)
const STORAGE_KEY = 'sidebar-scroll-top'

function onScroll() {
  if (!el.value) return
  sessionStorage.setItem(STORAGE_KEY, String(el.value.scrollTop))
}

onMounted(() => {
  if (!el.value) return

  // restore scroll
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    el.value.scrollTop = Number(saved)
  }

  el.value.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (!el.value) return
  el.value.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
    ref="el"
    data-slot="sidebar-content"
    data-sidebar="content"
    class="sidebar-scroll"
    :class="cn(
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
      props.class
    )"
  >
    <slot />
  </div>
</template>

<style scoped>
/* ===============================
   SIDEBAR SCROLLBAR (MINIMAL)
=============================== */

/* Firefox */
.sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(120, 120, 120, 0.4) transparent;
}

/* Chrome, Edge, Safari */
.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(120, 120, 120, 0.35);
  border-radius: 6px;
}

/* Hover */
.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(120, 120, 120, 0.55);
}

/* Dark mode */
.dark .sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(180, 180, 180, 0.25);
}

.dark .sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(180, 180, 180, 0.45);
}
</style>

