<script lang="ts" setup>
import {
  SidebarTrigger,
} from '@/components/ui/sidebar'
</script>

<template>
  <div class="w-full bg-secondary text-primary h-[45px] lg:h-[63px] flex items-center justify-between md:justify-end px-4">
    <SidebarTrigger class=" md:hidden" />
    <div class="flex gap-5 text-xs md:text-sm items-center">
      <nuxt-link to="/app/notifications">
        <button class=" bg-white px-2 py-1 rounded-md flex cursor-pointer">
          <Icon name="material-symbols-light:notifications" class="text-xl ms:text-2xl" />
        </button>
      </nuxt-link>
      <button class=" bg-white px-2 rounded-md ">
        <div class="flex items-center gap-1 py-1">
          <Icon name="material-symbols:person-rounded" class="text-xl ms:text-2xl" />
          <span>User</span>
          <Icon name="material-symbols:keyboard-arrow-down" class="text-xl ms:text-2xl" />
        </div>
      </button>
    </div>
  </div>
</template>
