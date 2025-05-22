<script setup lang="ts">
import DashSecOne from '@/components/dash-components/dash-sec-one/index.vue'
import DashSecTwo from '@/components/dash-components/dash-sec-two/index.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import MainBar from '@/components/core/app-sidebar/Main.vue'
</script>

<template>
  <SidebarProvider>
    <MainBar />
    <SidebarInset class="bg-secondary">
      <header class="flex h-10 items-center gap-2 ">
        <div class="w-full fixed top-0 left-0">
          <CoreNavbar />
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-5 md:rounded-tl-xl bg-white mt-7">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>