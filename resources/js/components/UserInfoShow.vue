<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import type { User } from '@/types';
import { computed } from 'vue';

interface Props {
    user: User;
    showBranch?: boolean;
    showCover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showBranch: false,
    showCover: false,
});

const { getInitials } = useInitials();

// Compute whether we should show the avatar image
const showAvatar = computed(
    () => props.user.avatar && props.user.avatar !== '',
);
</script>

<template>
  <div class="w-full">

    <!-- COVER -->
    <div class="relative h-32 w-full overflow-hidden rounded-xl bg-muted">
      <img
        v-if="showCover && user.cover != null"
        :src="`/storage/${user.cover}`"
        alt="Cover"
        class="h-full w-full object-cover"
      />
      <div v-else class="h-full w-full object-cover">
      </div>
    </div>

    <!-- AVATAR (OVERLAP, CENTER) -->
    <div class="relative flex justify-center">
      <div
        class="absolute -top-10 flex h-20 w-20 items-center justify-center
               rounded-full border-4 border-background bg-background overflow-hidden"
      >
        <Avatar class="h-full w-full rounded-full">
          <AvatarImage
            v-if="showAvatar"
            :src="`/storage/${user.avatar}`"
            :alt="user.name"
            class="object-cover"
          />
          <AvatarFallback class="text-lg font-semibold">
            {{ getInitials(user.name) }}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>

    <!-- USER INFO -->
    <div class="pt-10 text-center">
      <div class="text-base font-semibold truncate">
        {{ user.name }}
      </div>
      <div class="text-xs text-muted-foreground truncate">
        {{ user.phone }}
      </div>

      <!-- <div
        v-if="showBranch"
        class="text-xs text-muted-foreground truncate"
      >
        {{ user.branch?.name }}
      </div> -->
    </div>

  </div>
</template>

