<script setup lang="ts">
import { useDraggable, useElementSize, useWindowSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import MainBar from '@/components/core/app-sidebar/Main.vue'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

// Use the dialer composable
const { closeDialer, openDialer } = useDialer()
const containerElement = useTemplateRef<HTMLElement>('containerElement')

const { width, height } = useElementSize(containerElement)
const containerWidth = computed(() => width.value)

// Use the SIPml5 composable
const { cleanup } = useSIPml5()

// Initialize SIP on component mount
// onMounted(() => {
//   setTimeout(() => {
//     initializeSIP()
//   }, 3000)
// })

// Cleanup SIP on component unmount
onUnmounted(() => {
  cleanup()
})
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

  <Dialer @close="closeDialer" />
  <!-- <Dialer @close="closeDialer" /> -->

  <LayoutShortcuts :data="{ height, containerWidth }" @open-dialer="openDialer()" />
</template>
