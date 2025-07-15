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

const { data: campaigns, status: campaignStatus, refresh: campaignRefresh } = await useLazyAsyncData('campaign-list-filter', () =>
  useApi().post('/campaign '), {
  transform: res => res.data,
  immediate: false,
})

const { data: lists, status: listStatus, refresh: listRefresh } = await useLazyAsyncData('list-filter', () =>
  useApi().post('/list '), {
  transform: res => res.data,
  immediate: false,
})

const { data: disposition, status: dispositionStatus, refresh: dispositionRefresh } = await useLazyAsyncData('disposition-filter', () =>
  useApi().post('/disposition '), {
  transform: res => res.data,
  immediate: false,
})

watch(open, (val) => {
  if (val) {
    Promise.all([
      !campaigns.value?.length && campaignRefresh(),
      !lists.value?.length && listRefresh(),
      !disposition.value?.length && dispositionRefresh(),

    ])
  }
})

const dayOptions = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
]

const callTimeOptions = [
  { value: '1', label: '1' },
  { value: '2', label: 'less than or equal to 2' },
  { value: '3', label: 'less than or equal to 3' },
  { value: '4', label: 'less than or equal to 4' },
  { value: '5', label: 'less than or equal to 5' },
  { value: '6', label: 'less than or equal to 6' },
  { value: '7', label: 'less than or equal to 7' },
  { value: '8', label: 'less than or equal to 8' },
  { value: '9', label: 'less than or equal to 9' },
  { value: '10', label: 'less than or equal to 10' },
  { value: '11', label: 'less than or equal to 11' },
  { value: '12', label: 'less than or equal to 12' },
  { value: '13', label: 'less than or equal to 13' },
  { value: '14', label: 'less than or equal to 14' },
  { value: '15', label: 'less than or equal to 15' },
]

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
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="campaignStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in campaigns" :key="option.id" :value="option.id">
                        {{ option.title }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">List</label>
                <Select v-model="filters.list">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="listStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in lists" :key="option.list_id" :value="option.list_id">
                        {{ option.list }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Disposition</label>
                <Select v-model="filters.disposition">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="campaignStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in disposition" :key="option.id" :value="option.id">
                        {{ option.title }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Select Day</label>
                <Select v-model="filters.day">
                  <SelectTrigger class="w-full !h-11">
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
                  <SelectTrigger class="w-full !h-11">
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
                      <Input v-model="filters.fromTime" type="time" class="border-none shadow-none ml-auto w-28 focus-visible:ring-0" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                      <div class="text-sm text-muted-foreground">
                        To:
                      </div>
                      <Input v-model="filters.toTime" type="time" class="border-none shadow-none ml-auto w-28 focus-visible:ring-0" />
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
