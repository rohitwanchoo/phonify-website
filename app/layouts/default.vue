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
  SidebarProvider
} from '@/components/ui/sidebar'
import MainBar from '~/components/app-sidebar/Main.vue'
</script>

<template>
  <SidebarProvider>
    <MainBar />
    <SidebarInset>
      <header class="flex h-16  items-center gap-2 ">
        <div class="w-full">
          <CoreNavbar />
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
      <div class="flex flex-1 flex-col gap-4 p-4 pt-5 md:rounded-tl-xl bg-white">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
