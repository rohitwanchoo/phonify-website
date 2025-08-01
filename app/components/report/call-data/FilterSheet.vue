<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

// Emit event to parent component with filter parameters
const emit = defineEmits<{
  applyFilter: [filterParams: Record<string, any>]
  clearFilter: []
}>()

// Sheet open state
const open = defineModel<boolean>('open', { default: false })

const { data: extension, status: extensionStatus, refresh: extensionRefresh } = await useLazyAsyncData('extension', () =>
  useApi().get('/extension'), {
  transform: res => res.data,
  immediate: false,
})

const { data: campaign, status: campaignStatus, refresh: campaignRefresh } = await useLazyAsyncData('campaign', () =>
  useApi().post('/campaign'), {
  transform: res => res.data,
  immediate: false,
})

const { data: disposition, status: dispositionStatus, refresh: dispositionRefresh } = await useLazyAsyncData('disposition', () =>
  useApi().post('/disposition'), {
  transform: res => res.data,
  immediate: false,
})

const { data: campaignType, status: campaignTypeStatus, refresh: campaignTypeRefresh } = await useLazyAsyncData('campaign-type', () =>
  useApi().get('/campaign-type'), {
  transform: res => res.data,
  immediate: false,
})

const { data: did, status: didStatus, refresh: didRefresh } = await useLazyAsyncData('did', () =>
  useApi().post('/did'), {
  transform: res => res.data,
  immediate: false,
})

const { data: stateList, status: stateListStatus, refresh: stateListRefresh } = await useLazyAsyncData('state-list', () =>
  useApi().post('/state-list', {
    country_id: 1,
  }), {
  transform: res => res.data,
  immediate: false,
})

watch(open, (val) => {
  if (val) {
    Promise.all([
      !extension.value?.length && extensionRefresh(),
      !campaign.value?.length && campaignRefresh(),
      !disposition.value?.length && dispositionRefresh(),
      !campaignType.value?.length && campaignTypeRefresh(),
      !did.value?.length && didRefresh(),
      !stateList.value?.length && stateListRefresh(),
    ])
  }
})

// Simple reactive filter values
const filters = ref({
  number: '',
  extension: '',
  campaign: '',
  disposition: '',
  route: '',
  type: '',
  did: '',
  state_list: '',
  start_date: '',
  end_date: '',
})

// Function to strip formatting from phone number
function stripPhoneFormatting(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '')
}

// Helper function to parse date string to Date object
function parseDateString(dateStr: string): Date | null {
  if (!dateStr)
    return null
  return new Date(`${dateStr}T00:00:00.000Z`)
}

function onSubmit() {
  // Build filter parameters object with only filled values
  const filterParams: Record<string, any> = {}

  if (filters.value.number) {
    filterParams.number = stripPhoneFormatting(filters.value.number)
  }
  if (filters.value.extension) {
    filterParams.extension = filters.value.extension
  }
  if (filters.value.campaign) {
    filterParams.campaign = filters.value.campaign
  }
  if (filters.value.disposition) {
    filterParams.disposition = [filters.value.disposition]
  }
  if (filters.value.route) {
    filterParams.route = filters.value.route
  }
  if (filters.value.type) {
    filterParams.type = filters.value.type
  }
  if (filters.value.did) {
    filterParams.did = filters.value.did
  }
  if (filters.value.state_list) {
    filterParams.state_list = filters.value.state_list
  }
  if (filters.value.start_date) {
    filterParams.start_date = filters.value.start_date
  }
  if (filters.value.end_date) {
    filterParams.end_date = filters.value.end_date
  }

  // Emit filter parameters to parent component
  emit('applyFilter', filterParams)

  // Close the sheet after applying filter
  open.value = false
}

// Function to clear all filters
function clearFilters() {
  filters.value = {
    number: '',
    extension: '',
    campaign: '',
    disposition: '',
    route: '',
    type: '',
    did: '',
    state_list: '',
    start_date: '',
    end_date: '',
  }

  // Emit clear filter event to parent
  emit('clearFilter')

  // Close the sheet
  open.value = false
}
</script>

<template>
  <Button variant="outline" class="h-11 !text-white bg-black hover:bg-black" @click="open = true">
    <Icon name="material-symbols:sort" size="20" class="!text-white" />
    Filter
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Filter Call Reports
        </SheetTitle>
      </SheetHeader>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto space-y-6">
          <div class="flex-1 overflow-y-auto">
            <div class="mx-auto p-6 space-y-6">
              <div class="space-y-4">
                <!-- Phone Number Field -->
                <div>
                  <label class="text-sm font-medium text-primary">Phone Number</label>
                  <Input
                    v-model="filters.number"
                    v-maska="'(###) ###-####'"
                    type="tel"
                    class="h-11"
                    placeholder="Enter Phone Number"
                  />
                </div>
                <!-- Extension Field -->
                <div>
                  <label class="text-sm font-medium text-primary">Extention List</label>
                  <Select v-model="filters.extension">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select an extension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="extensionStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem v-for="option in extension" :key="option.id" :value="option.extension">
                          {{ option.first_name }} {{ option.last_name }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </div>
                <!-- Campaign Fields -->
                <div>
                  <label class="text-sm font-medium text-primary">Camapign</label>
                  <Select v-model="filters.campaign">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select a Campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="campaignStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem v-for="option in campaign" :key="option.id" :value="option.id">
                          {{ option.title }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Disposition Field -->
                <div>
                  <label class="text-sm font-medium text-primary">Disposition</label>
                  <Select v-model="filters.disposition">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select a disposition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="dispositionStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
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

                <!-- Route Field -->
                <div>
                  <label class="text-sm font-medium text-primary">Route</label>
                  <Select v-model="filters.route">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select Campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">
                        Incoming
                      </SelectItem>
                      <SelectItem value="OUT">
                        Outgoing
                      </SelectItem>
                      <SelectItem value="TRANSFER">
                        Transfer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Type Field -->
                <div>
                  <label class="text-sm font-medium text-primary">Type</label>
                  <Select v-model="filters.type">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="campaignTypeStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem v-for="option in campaignType" :key="option.id" :value="option.id">
                          {{ option.title }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Did Field -->
                <div>
                  <label class="text-sm font-medium text-primary">DID List</label>
                  <Select v-model="filters.did">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select a DID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="didStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem v-for="option in did" :key="option.id" :value="option.id">
                          {{ option.cli }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label class="text-sm font-medium text-primary">Time Zone</label>
                  <Select>
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select Campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">
                        All
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Date Range -->
                <div class="space-y-1">
                  <label class="text-sm font-medium text-primary">Date Range</label>
                  <div class="flex flex-col md:flex-row gap-2">
                    <!-- FROM DATE -->
                    <div class="flex-1">
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button
                            variant="outline"
                            class="w-full justify-start text-left font-normal hover:bg-transparent border border-gray-200 py-5"
                            :class="!filters.start_date ? 'text-muted-foreground' : ''"
                          >
                            <span>{{ filters.start_date ? parseDateString(filters.start_date)?.toLocaleDateString('en-GB') : 'DD/MM/YYYY' }}</span>
                            <Icon name="material-symbols:calendar-today" size="20" class="ms-auto" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0">
                          <Calendar
                            calendar-label="From Date"
                            :model-value="filters.start_date ? parseDate(filters.start_date) : undefined"
                            initial-focus
                            @update:model-value="(v) => {
                              filters.start_date = v ? v.toString() : ''
                            }"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <!-- TO DATE -->
                    <div class="flex-1">
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button
                            variant="outline"
                            class="w-full justify-start text-left font-normal hover:bg-transparent border border-gray-200 py-5"
                            :class="!filters.end_date ? 'text-muted-foreground' : ''"
                          >
                            <span>{{ filters.end_date ? parseDateString(filters.end_date)?.toLocaleDateString('en-GB') : 'DD/MM/YYYY' }}</span>
                            <Icon name="material-symbols:calendar-today" size="20" class="ms-auto" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0">
                          <Calendar
                            calendar-label="To Date"
                            :model-value="filters.end_date ? parseDate(filters.end_date) : undefined"
                            initial-focus
                            @update:model-value="(v) => {
                              filters.end_date = v ? v.toString() : ''
                            }"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-primary">State / City / Area Codes</label>
                  <Select v-model="filters.state_list">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select a DID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="stateListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem v-for="option in stateList" :key="option.id" :value="option.id">
                          {{ option.name }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <Button variant="outline" class=" h-11 border border-primary rounded-sm flex justify-between items-center gap-2 px-3 w-[49%]">
                    <div class="flex gap-2 items-center justify-center text-sm text-primary">
                      <Icon name="lsicon:file-pdf-filled" class="text-red-600 text-xl" />
                      Download PDF
                    </div>
                    <Icon name="material-symbols:download" class="text-xl text-primary" />
                  </Button>
                  <Button variant="outline" class=" h-11 border border-primary rounded-sm flex justify-between items-center gap-2 px-3 w-[49%]">
                    <div class="flex gap-2 items-center justify-center text-sm text-primary">
                      <Icon name="lsicon:file-xls-filled" class="text-green-600 text-xl" />
                      Download Excel
                    </div>
                    <Icon name="material-symbols:download" class="text-xl text-primary" />
                  </Button>
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
</template>
