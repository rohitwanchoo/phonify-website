<script setup lang="ts">
import { useDraggable, useElementSize, useWindowSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import MainBar from '@/components/core/app-sidebar/Main.vue'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

// Use the dialer composable
const { isDialerOpen, closeDialer, openDialer } = useDialer()
const containerElement = useTemplateRef<HTMLElement>('containerElement')

const { width, height } = useElementSize(containerElement)
const containerWidth = computed(() => width.value)
// Define boundaries for dragging
</script>

<template>
  <SidebarProvider>
    <MainBar />
    <SidebarInset class="bg-secondary overflow-hidden">
      <header class="flex h-10 items-center gap-2 z-2">
        <div class="w-full fixed top-0 left-0">
          <CoreNavbar />
        </div>
      </header>
      <div ref="containerElement" class="p-4 pt-5 md:rounded-tl-xl bg-white mt-7 md:h-[calc(100vh-70px)] overflow-y-auto">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>

  <!-- Dialer teleported to body -->
  <Transition name="slide-fade">
    <Dialer v-if="isDialerOpen" @close="closeDialer" />
  </Transition>

  <LayoutShortcuts :data="{ height, containerWidth }" @open-dialer="openDialer()" />
</template>

<style scoped>
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
</style>
