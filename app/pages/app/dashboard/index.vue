<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import DashSecOne from '@/components/dash-components/dash-sec-one/index.vue'

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
  SidebarTrigger,
} from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16  items-center gap-2 ">
        <div class="w-full">
          <CoreNavbar />
          <!-- <SidebarTrigger class="-ml-1 md:hidden" /> -->
          <!-- <Separator
            orientation="vertical"
            class="mr-2 data-[orientation=vertical]:h-4"
          /> -->
          <!-- <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> -->
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-5 md:rounded-tl-xl bg-red-900">
        <DashSecOne />
        <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
