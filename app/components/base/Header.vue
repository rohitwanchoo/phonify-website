<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

defineProps<HeaderProps>()

interface HeaderProps {
  title?: string
  breadcrumbs?: {
    label: string
    href?: string
    active?: boolean
  }[]
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="text-2xl font-medium space-y-2">
      <div v-if="breadcrumbs?.length">
        <Breadcrumb>
          <BreadcrumbList>
            <div v-for="(item, index) in breadcrumbs" :key="item.label" class="flex items-center gap-x-2">
              <BreadcrumbItem>
                <BreadcrumbLink :href="item.href" class="font-normal" :class="item.active && 'text-primary'">
                  {{ item.label }}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
            </div>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        {{ title }}
      </div>
    </div>
    <div class="flex items-center gap-x-3">
      <slot name="actions" />
    </div>
  </div> 
</template>
