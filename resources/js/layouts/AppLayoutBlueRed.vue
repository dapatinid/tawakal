<script setup lang="ts">
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItemType } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css'; // vue-sonner v2 requires this import
import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

// onBeforeUnmount(() => localStorage.removeItem("csrf_token"));
onMounted(() => {

  const justLoggedIn = localStorage.getItem("just_logged_in");
  if (justLoggedIn) {
    localStorage.removeItem("just_logged_in");
    console.log("🔁 Reload sekali karena baru login");
    window.location.reload(); // reload penuh hanya sekali
  }

  // const metaToken = document
  //   .querySelector('meta[name="csrf-token"]')
  //   ?.getAttribute("content");
  // if (metaToken) {
  //   localStorage.setItem("csrf_token", metaToken);
  // }
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs" :class="'bg-gradient-to-br from-blue-200 via-white to-red-200 dark:from-blue-950 dark:via-gray-900 dark:to-red-950 from-10% to-90%'">
        <slot />
        <Toaster position="top-right" richColors />
    </AppLayout>
</template>
