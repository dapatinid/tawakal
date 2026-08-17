<script setup lang="ts">
interface Props {
    title: string;
    description?: string;
}

defineProps<Props>();
</script>

<template>
    <header class="bg-background/50 rounded-lg px-3 py-2">
        <h3 class="mb-0.5 text-base font-medium">{{ title }}</h3>
        <p v-if="description" class="text-sm text-muted-foreground">
            {{ description }}
        </p>
    </header>
</template>
