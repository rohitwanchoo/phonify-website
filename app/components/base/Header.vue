<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

defineProps<HeaderProps>()

interface HeaderProps {
  title?: string
  breadcrumbs?: {
    label: string
    href?: string | (() => void)
    active?: boolean
  }[]
}
function navigateToPath(val: any) {
  if (typeof val === 'function') {
    val()
  }
  else {
    navigateTo(val)
  }
}
</script>

<template>
  <div class="flex items-center justify-between flex-wrap">
    <div class="text-2xl font-medium space-y-2">
      <div v-if="breadcrumbs?.length">
        <Breadcrumb>
          <BreadcrumbList>
            <div v-for="(item, index) in breadcrumbs" :key="item.label" class="flex items-center gap-x-2">
              <BreadcrumbItem>
                <BreadcrumbLink class="font-normal" :class="item.active && 'text-primary'" @click="item.href && navigateToPath(item.href)">
                  {{ item.label }}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
            </div>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div class="text-nowrap">
        {{ title }}
      </div>
    </div>
    <div class="flex items-center gap-x-3 flex-wrap gap-y-3">
      <slot name="actions" />
    </div>
  </div>
</template>
