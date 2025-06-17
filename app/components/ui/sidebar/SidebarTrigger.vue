<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const {
  toggleSidebar,
  setOpenMobile,
  openMobile,
  isMobile,
  state,
} = useSidebar()

const showLogo1 = computed(() => state.value === 'expanded' && !isMobile.value)
const showLogo2 = computed(() => state.value === 'collapsed' || isMobile.value)

const showLeftArrow = computed(() => state.value === 'expanded' && !isMobile.value)
const showRightArrow = computed(() => state.value === 'collapsed' && !isMobile.value)

function handleClick() {
  if (isMobile.value) {
    setOpenMobile(!openMobile.value)
  }
  else {
    toggleSidebar()
  }
}
</script>

<template>
  <button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('relative mt-2 w-[300px] h-[55px] overflow-hidden', props.class)"
    @click="handleClick"
  >
    <!-- Logo 1 -->
    <img
      src="/images/logo/phonify-logo.png"
      alt="Logo 1"
      class="absolute top-1/2 left-1/3 h-[40px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ease-in-out"
      :class="{
        'opacity-100 visible pointer-events-auto': showLogo1,
        'opacity-0 invisible pointer-events-none': !showLogo1
      }"
      style="will-change: opacity;"
    >
    <!-- Logo 2 -->
    <img
      src="/images/logo/phonify-logo-2.png"
      alt="Logo 2"
      class="absolute top-1/2 left-1/13 h-[35px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ease-in-out ml-2"
      :class="{
        'opacity-100 visible pointer-events-auto': showLogo2,
        'opacity-0 invisible pointer-events-none': !showLogo2
      }"
      style="will-change: opacity;"
    >

    <!-- Arrows for desktop only -->
    <ChevronLeft
      v-if="showLeftArrow"
      class="absolute right-8 top-1/2 h-6 w-6 -translate-y-1/2 text-primary transition-opacity duration-500 ease-in-out"
      style="will-change: opacity;"
    />
    <ChevronRight
      v-if="showRightArrow"
      class="absolute left-15 top-1/2 h-6 w-6 -translate-y-1/2 text-primary transition-opacity duration-500 ease-in-out"
      style="will-change: opacity;"
    />

    <span class="sr-only">Toggle Sidebar</span>
  </button>
</template>
