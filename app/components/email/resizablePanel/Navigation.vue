<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import Button from '~/components/ui/button/Button.vue'

import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'

interface Props {
  isCollapsed: boolean
}

const props = defineProps<Props>()

const senderList = [
  {
    title: 'All Sender',
    value: 'all-sender',
  },
  {
    title: 'Personal',
    value: 'personal',
  },
  {
    title: 'Business',
    value: 'business',
  },
  {
    title: 'Social',
    value: 'social',
  },
  {
    title: 'Promotions',
    value: 'promotions',
  },
  {
    title: 'Updates',
    value: 'updates',
  },
]

const tabs = [
  {
    icon: 'material-symbols:send-outline',
    title: 'Sent',
    value: 'sent',
  },
  {
    icon: 'material-symbols:inbox-outline',
    title: 'Inbox',
    value: 'inbox',
  },
  {
    icon: 'material-symbols:draft-outline',
    title: 'Draft',
    value: 'draft',
  },
  {
    icon: 'material-symbols:archive-outline',
    title: 'Archived',
    value: 'archived',
  },
]

const popoverModel = ref(false)
</script>

<template>
  <div class="flex flex-col w-full">
    <div v-if="!isCollapsed" class="w-full">
      <Select default-value="all-sender">
        <SelectTrigger class="w-full border-[#FFFFFF1A] !h-11">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="item in senderList" :key="item.value" :value="item.value">
              {{ item.title }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div v-else>
      <Popover v-model:open="popoverModel">
        <PopoverTrigger as-child>
          <Button variant="ghost" class="bg-primary  rounded h-9 w-[36.05px] mb-5" size="sm">
            <Icon class="flex-none" name="material-symbols:more-vert" size="20" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="p-0" side="right">
          <Select default-open default-value="all-sender" @update:model-value="popoverModel = false">
            <SelectTrigger class="w-full border-[#FFFFFF1A] !h-11">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in senderList" :key="item.value" :value="item.value">
                  {{ item.title }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>
    </div>
    <div v-if="!isCollapsed" class="text-[#FFFFFF99] text-xs font-normal mt-3 mb-2">
      GENERAL
    </div>
    <ScrollArea v-auto-animate>
      <div v-if="isCollapsed">
        <TooltipProvider>
          <div class="flex flex-col gap-y-2">
            <Tooltip v-for="tab in tabs" :key="tab.value">
              <TooltipTrigger as-child>
                <Button class="bg-primary border-[#FFFFFF1A]" variant="outline" size="icon">
                  <Icon :name="tab.icon" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" class="h-9 flex items-center">
                <p>{{ tab.title }}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <Tabs v-else default-value="sent" orientation="vertical" class="space-y-2 h-full p-0">
        <TabsList class="flex flex-col h-full gap-y-2 bg-transparent w-full p-0">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value" class="min-h-10 w-full border border-[#FFFFFF1A] bg-[#FFFFFF0D] text-white data-[state=active]:text-primary
               rounded-[4px] flex justify-start gap-x-3.5 items-center p-2 !text-sm !font-normal cursor-pointer hover:bg-[#FFFFFF0D]/80"
          >
            <Icon class="flex-none" :name="tab.icon" size="20" />
            <div class="text-sm font-normal">
              {{ tab.title }}
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </ScrollArea>
  </div>
</template>
