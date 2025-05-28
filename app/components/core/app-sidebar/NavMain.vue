<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'
import { ChevronRight } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

const props = defineProps<{
  items: {
    title: string
    url: string
    icon?: string
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}>()

const route = useRoute()

const isActive = (url: string) => route.path === url
</script>

<template>
    <SidebarGroup>
     <div v-for="heading in Object.keys(items)">
      <SidebarGroupLabel class="uppercase">{{ heading }}</SidebarGroupLabel>
      <SidebarMenu>
        <template v-for="item in (items as any)[heading]" :key="item.title">
        <!-- Collapsible menu -->
        <Collapsible
          v-if="item.items"
          as-child
          :default-open="item.items.some(sub => isActive(sub.url))"
          class="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton
                :tooltip="item.title"
                :data-active="item.items.some(sub => isActive(sub.url))"
                class="lg:h-10"
              >
                <div class="translate-y-0.5 top-1/120 relative">
                  <Icon v-if="item.icon" :name="item.icon" />
                </div>
                <span>{{ item.title }}</span>
                <ChevronRight
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub class="mt-2">
                <SidebarMenuSubItem
                  v-for="subItem in item.items"
                  :key="subItem.title"
                >
                  <SidebarMenuSubButton
                    as-child
                    :data-active="isActive(subItem.url)"
                    class="text-primary/70 hover:text-primary ml-1 lg:h-10 hover:bg-accent pb-1 border-l-2 hover:border-primary rounded-none pl-4"
                  >
                    <NuxtLink :to="subItem.url">
                      <span>{{ subItem.title }}</span>
                    </NuxtLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <!-- Flat menu item -->
        <SidebarMenuItem v-else>
          <SidebarMenuButton
            as-child
            :tooltip="item.title"
            :data-active="isActive(item.url)"
            class="lg:h-10 "
          >
            <NuxtLink :to="item.url" class="flex items-center gap-2 w-full">
              <div class="translate-y-0.5 top-1/120 relative">
                <Icon v-if="item.icon" :name="item.icon" />
              </div>
              <span>{{ item.title }}</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </template>
      </SidebarMenu>
     </div>
    </SidebarGroup>

</template>
