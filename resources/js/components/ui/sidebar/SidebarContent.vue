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
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-x-hidden',
      props.class
    )"
  >
    <slot />
  </div>
</template>

<style scoped>
/* ===============================
   SIDEBAR SCROLLBAR (HIDDEN)
=============================== */

.sidebar-scroll {
  /* Sembunyikan scrollbar untuk IE, Edge, dan Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Sembunyikan scrollbar untuk Chrome, Safari, dan Opera */
.sidebar-scroll::-webkit-scrollbar {
  display: none;
}
</style>