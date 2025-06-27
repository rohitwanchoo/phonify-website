<script setup lang="ts">
import { Icon } from '#components'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  recycleRules: Array<Record<string, any>>
}>()

// Emit event to parent component with filter parameters
const emit = defineEmits<{
  applyFilter: [filterParams: Record<string, any>]
  clearFilter: []
}>()

const open = defineModel<boolean>('open', { default: false })

const campaignOptions = props.recycleRules.map(e => ({
  label: e.campaign,
  value: e.campaign_id,
}))
const listOptions = props.recycleRules.map(e => ({
  label: e.list,
  value: e.list_id,
}))
const dispositionOptions = props.recycleRules.map(e => ({
  label: e.disposition,
  value: e.disposition_id,
}))
const dayOptions = props.recycleRules.map(e => ({
  label: e.day,
  value: e.day,
}))
const callTimeOptions = props.recycleRules.map(e => ({
  label: e.call_time,
  value: e.call_time,
}))

// Simple reactive filter values
const filters = ref({
  campaign: '',
  list: '',
  disposition: '',
  day: '',
  callTime: '',
  fromTime: '',
  toTime: '',
})

function onSubmit() {
  // Build filter parameters object with only filled values
  const filterParams: Record<string, any> = {}

  if (filters.value.campaign) {
    filterParams.campaign_id = filters.value.campaign
  }
  if (filters.value.list) {
    filterParams.list_id = filters.value.list
  }
  if (filters.value.disposition) {
    filterParams.disposition_id = filters.value.disposition
  }
  if (filters.value.day) {
    filterParams.day = filters.value.day
  }
  if (filters.value.callTime) {
    filterParams.call_time = Number(filters.value.callTime)
  }
  if (filters.value.fromTime) {
    filterParams.from_time = filters.value.fromTime
  }
  if (filters.value.toTime) {
    filterParams.to_time = filters.value.toTime
  }

  // Emit filter parameters to parent component
  emit('applyFilter', filterParams)

  // Close the sheet after applying filter
  open.value = false
}

// Function to clear all filters
function clearFilters() {
  filters.value = {
    campaign: '',
    list: '',
    disposition: '',
    day: '',
    callTime: '',
    fromTime: '',
    toTime: '',
  }

  // Emit clear filter event to parent
  emit('clearFilter')

  // Close the sheet
  open.value = false
}
</script>

<template>
  <div>
    <Button variant="outline" class="!text-primary" @click="open = true">
      <Icon name="material-symbols:sort" class="!text-primary" />
      Filter
    </Button>
    <Sheet v-model:open="open">
      <SheetContent class="md:min-w-[483px] flex flex-col h-full">
        <SheetHeader class="bg-[#162D3A]">
          <SheetTitle class="text-white">
            Filter Recycle Rules
          </SheetTitle>
        </SheetHeader>
        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto">
          <div class="mx-auto p-6 space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Campaign</label>
                <Select v-model="filters.campaign">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in campaignOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">List</label>
                <Select v-model="filters.list">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in listOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Disposition</label>
                <Select v-model="filters.disposition">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select disposition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in dispositionOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Select Day</label>
                <Select v-model="filters.day">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in dayOptions" :key="option.value" :value="option.value" class="capitalize">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Call Time</label>
                <Select v-model="filters.callTime">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select call time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in callTimeOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Time Range (Optional)</label>
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1">
                    <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                      <div class="text-sm text-muted-foreground">
                        From:
                      </div>
                      <Input v-model="filters.fromTime" type="time" class="border-none shadow-none ml-auto w-28" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                      <div class="text-sm text-muted-foreground">
                        To:
                      </div>
                      <Input v-model="filters.toTime" type="time" class="border-none shadow-none ml-auto w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Sticky footer with buttons -->
        <div class="p-6 bg-white space-y-3">
          <Button type="button" class="w-full" @click="onSubmit">
            <Icon name="material-symbols:search" class="mr-1" />
            Apply Filter
          </Button>
          <Button type="button" variant="outline" class="w-full" @click="clearFilters">
            <Icon name="material-symbols:clear" class="mr-1" />
            Clear Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
