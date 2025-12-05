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

// Ref for the first input field to auto focus
const firstInputRef = ref<HTMLInputElement | null>(null)

const { data: userData, status: userDataStatus, refresh: userDataRefresh } = await useLazyAsyncData('user-data', () =>
  useApi().get('/users-list-new'), {
  transform: res => res.data,
  immediate: false,
})

watch(open, (val) => {
  if (val) {
    Promise.all([
      !userData.value?.length && userDataRefresh(),
    ])
  }
})

// Auto focus on component mount
onMounted(() => {
  if (open.value && firstInputRef.value) {
    firstInputRef.value.focus()
  }
})

// Simple reactive filter values
const filters = ref({
  user_id: '',
  ip: '',
  start_date: '',
  end_date: '',
})

// Helper function to parse date string to Date object
function parseDateString(dateStr: string): Date | null {
  if (!dateStr)
    return null
  return new Date(`${dateStr}T00:00:00.000Z`)
}

function onSubmit() {
  // Build filter parameters object with only filled values
  const filterParams: Record<string, any> = {}

  if (filters.value.user_id) {
    filterParams.user_id = filters.value.user_id
  }
  if (filters.value.ip) {
    filterParams.ip = filters.value.ip
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
    user_id: '',
    ip: '',
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
  <Button variant="outline" class="!text-white bg-black hover:bg-black h-11" @click="open = true">
    <Icon name="material-symbols:sort" size="20" class="!text-white" />
    Filter
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Filter Login History
        </SheetTitle>
      </SheetHeader>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto space-y-6">
          <div class="flex-1 overflow-y-auto">
            <div class="mx-auto p-6 space-y-6">
              <div class="space-y-4">
                <!-- User List Field -->
                <div>
                  <label class="text-sm font-medium text-primary">User List</label>
                  <Select v-model="filters.user_id">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="userDataStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem v-for="option in userData" :key="option.id" :value="option.id">
                          {{ option.first_name }} {{ option.last_name }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </div>

                <!-- IP Address Field -->
                <div>
                  <label class="text-sm font-medium text-primary">IP</label>
                  <Input ref="firstInputRef" v-model="filters.ip" placeholder="IP Address" class="h-11" />
                </div>

                <!-- Date Range Fields -->
                <div class="space-y-1">
                  <label class="text-sm font-medium text-primary">Date Range</label>
                  <div class="flex flex-col md:flex-row gap-2">
                    <!-- FROM DATE -->
                    <div class="flex-1">
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button
                            variant="outline"
                            class="w-full justify-start text-left font-normal hover:bg-transparent border border-gray-200 py-5 h-11"
                            :class="!filters.start_date ? 'text-muted-foreground' : ''"
                          >
                            <span>{{ filters.start_date ? parseDateString(filters.start_date)?.toLocaleDateString('en-GB') : 'From:' }}</span>
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
                            class="w-full justify-start text-left font-normal hover:bg-transparent border border-gray-200 py-5 h-11"
                            :class="!filters.end_date ? 'text-muted-foreground' : ''"
                          >
                            <span>{{ filters.end_date ? parseDateString(filters.end_date)?.toLocaleDateString('en-GB') : 'To:' }}</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky footer with buttons -->
      <div class="p-6 bg-white space-y-3">
        <Button type="button" class="w-full h-11" @click="onSubmit">
          <Icon name="material-symbols:search" size="20" />
          Search
        </Button>
        <Button type="button" variant="outline" class="w-full h-11" @click="clearFilters">          <Icon name="material-symbols:clear" />
          Clear Filters
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
