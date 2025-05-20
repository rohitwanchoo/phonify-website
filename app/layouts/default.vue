<script setup lang="ts">
import DashSecOne from '@/components/dash-components/dash-sec-one/index.vue'
import DashSecTwo from '@/components/dash-components/dash-sec-two/index.vue'
<<<<<<<< HEAD:app/layouts/default.vue
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
========
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 pt-5 md:rounded-tl-xl bg-white">
    <DashSecOne />
    <DashSecTwo />
    <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
  </div>
>>>>>>>> 78d846c874b2eda6a0c7a395265bd77c4a115794:app/pages/app/dashboard/index.vue
</template>
