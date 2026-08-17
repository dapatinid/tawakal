<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
// Impor kedua ikon yang dibutuhkan
import { PanelRightClose, PanelRightOpen } from 'lucide-vue-next'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

// Ambil status 'state' (atau 'open') dari useSidebar
const { toggleSidebar, state } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <PanelRightOpen v-if="state === 'expanded'" class="size-6"/>
    <PanelRightClose v-else class="size-6"/>
    
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>