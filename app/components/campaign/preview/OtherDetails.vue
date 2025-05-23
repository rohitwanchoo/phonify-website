<script setup lang="ts">
import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'
import { Switch } from '~/components/ui/switch'

const templates = [
  {
    id: 1,
    name: 'Template 1',
  },
  {
    id: 2,
    name: 'Template 2',
  },
  {
    id: 3,
    name: 'Template 3',
  },
]

const depositions = [
  'Callback',
  'Feedback',
  'Notification',
  'Event Trigger',
  'Confirmation',
  'Alert',
  'Reminder',
  'Execution',
  'Feedback',
  'Notification',
  'Event Trigger',
  'Confirmation',
  'Feedback',
  'Notification',
  'Event Trigger',
  'Confirmation',
  'Feedback',
  'Notification',
  'Event Trigger',
  'Confirmation',
  'Feedback',
  'Notification',
  'Event Trigger',
  'Confirmation',
  'Feedback',
  'Notification',
  'Event Trigger',
  'Confirmation',
]
const enableEdit = ref(false)
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b px-5 pt-5 pb-3 flex justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Other Details (temp.)
      </div>
      <div v-if="!enableEdit" class="flex items-center gap-x-2">
        <Button variant="outline" size="sm" class="rounded" @click="enableEdit = true">
          <Icon name="icons:edit-box" /> Edit
        </Button>
      </div>
      <div v-else class="flex gap-x-2">
        <Button variant="outline" size="sm" class="rounded" @click="enableEdit = false ">
          <Icon name="lucide:x" />
          Cancel
        </Button>
        <Button class="w-[105px] rounded" size="sm">
          <Icon name="material-symbols:save-rounded" />
          Save
        </Button>
      </div>
    </div>
    <div class="p-5">
      <div class=" gap-x-5 w-full flex items-center">
        <div class="w-1/2">
          <Label class="text-xs font-normal" :class="!enableEdit && 'text-gray-600'">Hopper Mode Type</Label>
          <Select v-if="enableEdit" class="">
            <SelectTrigger class="w-full !h-11">
              <SelectValue class="text-xs placeholder:text-[#ef698180]" placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in templates" :key="item.id" :value="item.id">
                  {{ item.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div v-else class="text-[16px] font-normal text-primary mt-1">
            {{ templates[0]?.name }}
          </div>
        </div>
        <div class="w-1/2">
          <Label class="text-xs font-normal" :class="!enableEdit && 'text-gray-600'">OutBound Line</Label>
          <Select v-if="enableEdit" class="">
            <SelectTrigger class="w-full !h-11">
              <SelectValue class="text-xs placeholder:text-[#ef698180]" placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in templates" :key="item.id" :value="item.id">
                  {{ item.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div v-else class="text-[16px] font-normal text-primary mt-1">
            {{ templates[0]?.name }}
          </div>
        </div>
      </div>
      <div class="mt-5">
        <Label class="text-xs font-normal" :class="!enableEdit && 'text-gray-600'">Deposition</Label>
        <div class="border rounded-lg p-3 flex flex-wrap gap-2">
          <div v-for="item in depositions" :key="item" class="rounded-[6px] border border-[#00A086] bg-[#00A0861A] flex gap-x-1 px-[5px] py-1">
            <div class="text-xs">
              {{ item }}
            </div>
            <Icon name="lucide:x" class="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
