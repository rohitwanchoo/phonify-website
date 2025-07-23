<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'reka-ui/date'
import { CalendarIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
// Define emits
const emit = defineEmits<{
  applyFilter: []
  clearFilter: []
}>()

// Sheet open state
const open = ref(false)
const formValues = defineModel<Record<string, any>>('formValues', {
  default: {
    whitelistIp: '',
    server: '',
    status: '',
    fromWeb: '',
  },
})

// Dummy data for dropdown options
const serverOptions = [
  { label: 'All', value: 'null' },
]

const statusOptions = [
  { value: '0', label: 'Pending' },
  { value: '1', label: 'Approved' },
  { value: '-1', label: 'Rejected' },
]

const fromWebOptions = [
  { label: 'All', value: null },
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' },
]

// Form validation schema

// const filterValues = defineModel({default :{
//   whitelistIp: '',
//   server: '',
//   status: '',
//   fromWeb: '',
// } })

// Submit handler
function onSubmit() {
  // Build filter parameters object with only filled values

  emit('applyFilter')
  open.value = false
}

// const formValues = ref({
//   whitelistIp: '',
//   server: '',
//   status: '',
//   fromWeb: '',
// })

// Clear filters
function clearFilters() {
  resetForm()
  emit('clearFilter')
  open.value = false
}
</script>

<template>
  <Button variant="outline" class="!text-white bg-black hover:bg-black" @click="open = true">
    <Icon name="material-symbols:sort" class="!text-white" />
    Filter
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
            Filter IVR Logs Call Reports
        </SheetTitle>
      </SheetHeader>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto space-y-6">
          <div class="flex-1 overflow-y-auto">
            <div class="mx-auto p-6 space-y-6">
              <div class="space-y-4">
                <!-- IP Address Field -->
                <div>
                  <label class="text-sm font-medium text-primary">Phone Number</label>
                  <Input
                    type="number"
                    class="h-11"
                    placeholder="Enter Phone Number"
                  />
                </div>

            
                <div>
                  <label class="text-sm font-medium text-primary">Campaign</label>
                  <Select>
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue  placeholder="Select Campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">
                        All
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label class="text-sm font-medium text-primary">DTMF</label>
                  <Select>
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue  placeholder="Select Campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">
                        All
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              

                <div class="space-y-1">
  <label class="text-sm font-medium text-primary">Date Range</label>
  <div class="flex flex-col md:flex-row gap-2">
    <!-- FROM DATE -->
    <FormField v-slot="{ componentField, value }" name="fromDate">
      <FormItem class="flex-1">
        <FormControl>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                class="w-full justify-start text-left font-normal hover:bg-transparent border border-gray-200 py-5"
                :class="!value ? 'text-muted-foreground' : ''"
              >
                <span>{{ value ? new Date(value).toLocaleDateString('en-GB') : 'DD/MM/YYYY' }}</span>
                <Icon name="material-symbols:calendar-today" size="20" class="ms-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar
                calendar-label="From Date"
                :model-value="value ? parseDate(new Date(value).toISOString().split('T')[0]) : undefined"
                initial-focus
                @update:model-value="(v) => {
                  componentField.onChange(v ? toDate(v) : undefined)
                }"
              />
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- TO DATE -->
    <FormField v-slot="{ componentField, value }" name="toDate">
      <FormItem class="flex-1">
        <FormControl>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                class="w-full justify-start text-left font-normal hover:bg-transparent border border-gray-200 py-5"
                :class="!value ? 'text-muted-foreground' : ''"
              >
                <span>{{ value ? new Date(value).toLocaleDateString('en-GB') : 'DD/MM/YYYY' }}</span>
                <Icon name="material-symbols:calendar-today" size="20" class="ms-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar
                calendar-label="To Date"
                :model-value="value ? parseDate(new Date(value).toISOString().split('T')[0]) : undefined"
                initial-focus
                @update:model-value="(v) => {
                  componentField.onChange(v ? toDate(v) : undefined)
                }"
              />
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</div>
<Button variant="outline" class=" w-full h-11 border border-red-600 rounded-sm flex justify-between items-center gap-2 px-3">
  <div class="flex gap-2 items-center justify-center text-sm text-primary">
  <Icon name="lsicon:file-pdf-filled" class="text-red-600 text-xl" />
          Download PDF
          </div>
           <Icon name="material-symbols:download" class="text-xl text-primary" />
        </Button>

        
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <!-- Sticky footer with buttons -->
      <div class="p-6 bg-white space-y-3">
        <Button class="w-full h-12 text-md" @click="onSubmit">
          <Icon name="material-symbols:search" class="text-md" />
          Search
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
