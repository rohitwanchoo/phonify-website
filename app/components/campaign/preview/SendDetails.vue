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
const enableEdit = ref(false)
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b px-5 pt-5 pb-3 flex justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Send Details (temp.)
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
    <div class="p-5 gap-x-5 w-full flex items-center">
      <div class="w-1/2">
        <Label class="text-xs font-normal" :class="!enableEdit && 'text-gray-600'">Send Email</Label>
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
        <div v-else class="text-[16px] font-normal text-primary">
          {{ templates[0]?.name }}
        </div>
      </div>
      <!-- <div class="w-1/2 flex items-center justify-between"> -->
      <div class="flex flex-col gap-y-3 w-1/2">
        <Label for="send-sms" :class="!enableEdit && 'text-gray-600'" class="text-xs font-normal">Send SMS</Label>
        <Switch v-if="enableEdit" id="send-sms" class="data-[state=checked]:bg-green-600" />
        <div v-else class="text-[16px] font-normal text-green-600">
          Yes
        </div>
      </div>

      <!-- </div> -->
    </div>
    <div class="p-5 gap-x-5 w-full flex items-center">
      <div class="flex flex-col gap-y-3 w-1/2">
        <Label for="send-report" :class="!enableEdit && 'text-gray-600'" class="text-xs font-normal">Send Report</Label>
        <Switch v-if="enableEdit" id="send-report" class="data-[state=checked]:bg-green-600" />
        <div v-else class="text-[16px] font-normal text-green-600">
          Yes
        </div>
      </div>
      <div class="flex flex-col gap-y-3 w-1/2">
        <Label for="call-transfer" :class="!enableEdit && 'text-gray-600'" class="text-xs font-normal">Call Transfer</Label>
        <Switch v-if="enableEdit" id="call-transfer" class="data-[state=checked]:bg-green-600" />
        <div v-else class="text-[16px] font-normal text-green-600">
          Yes
        </div>
      </div>
    </div>
  </div>
</template>
