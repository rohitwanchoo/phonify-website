<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { useSidebar } from './utils'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
const toggle = ref(true)
const isMobile = useMediaQuery('(max-width: 768px)')

function handleClick() {
  if (!isMobile.value) {
    toggleSidebar()
    toggle.value = !toggle.value
  }
}
</script>

<template>
  <button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('relative mt-2 w-[150px] h-[55px] overflow-hidden', props.class)"
    @click="handleClick"
  >
    <!-- Logo 1 -->
    <img
      src="/images/logo/phonify-logo.png"
      alt="Logo 1"
      class="absolute top-1/2 left-1/2 h-[40px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out"
      :class="{
        'opacity-100': toggle && !isMobile,
        'opacity-0': !toggle || isMobile
      }"
    >
    <!-- Logo 2 -->
    <img
      src="/images/logo/phonify-logo-2.png"
      alt="Logo 2"
      class="absolute top-1/2 left-1/14 h-[35px] -translate-y-1/2 transition-opacity duration-300 ease-in-out"
      :class="{
        'opacity-0': toggle && !isMobile,
        'opacity-100': !toggle || isMobile
      }"
    >

    <span class="sr-only">Toggle Sidebar</span>
  </button>
</template>
