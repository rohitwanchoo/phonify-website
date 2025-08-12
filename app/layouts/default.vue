<script setup lang="ts">
import MainBar from '@/components/core/app-sidebar/Main.vue'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

// Use the dialer composable
const { isDialerOpen, closeDialer } = useDialer()
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
      <div class="p-4 pt-5 md:rounded-tl-xl bg-white mt-7 md:h-[calc(100vh-70px)] overflow-y-auto">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>

  <!-- Dialer teleported to body -->
  <Teleport to="body">
    <Dialer v-if="isDialerOpen" @close="closeDialer" />
  </Teleport>
</template>
