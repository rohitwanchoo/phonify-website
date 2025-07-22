<script setup lang="ts">
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

import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'

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
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="w-full">
      <Select default-value="sent">
        <SelectTrigger class="w-full border-[#FFFFFF1A] !h-11">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <!-- <SelectLabel>select</SelectLabel> -->
            <SelectItem value="all-sender">
              All Sender
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="text-[#FFFFFF99] text-xs font-normal mt-3 mb-2">
      GENERAL
    </div>
    <ScrollArea>
      <Tabs orientation="vertical" class="space-y-2 h-full p-0">
        <TabsList class="flex flex-col h-full gap-y-2 bg-transparent w-full p-0">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value" class="min-h-10 w-full border border-[#FFFFFF1A] bg-[#FFFFFF0D] text-white data-[state=active]:text-primary
               rounded-[4px] flex justify-start gap-x-3.5 items-center p-2 !text-sm !font-normal cursor-pointer hover:bg-[#FFFFFF0D]/80"
          >
            <Icon :name="tab.icon" size="20" />
            <div class="text-sm font-normal">
              {{ tab.title }}
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </ScrollArea>
  </div>
</template>
