<script setup lang="ts">
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { computed, ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
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


// Form validation schema

// const filterValues = defineModel({default :{
//   whitelistIp: '',
//   server: '',
//   status: '', 
//   fromWeb: '',
// } })


function onSubmit() {


  emit('applyFilter')
  open.value = false
}

function clearFilters() {
  resetForm()
  emit('clearFilter')
  open.value = false
}
</script>

<template>
  <Button variant="outline" class="!text-black bg-white hover:bg-white" @click="open = true">
    <Icon name="material-symbols:sort" class="!text-black" />
    Filter
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Filter Recieve Fax
        </SheetTitle>
      </SheetHeader>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto space-y-6">
          <div class="flex-1 overflow-y-auto">
            <div class="mx-auto p-6 space-y-6">
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-primary">Sender</label>
                  <Select>
  <SelectTrigger class="w-full !h-11">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem :value="'+1 (333) 123-4567'">
      +1 (333) 123-4567
    </SelectItem>
    <SelectItem :value="'333-987-6543'">
      +1 (333) 987-6543
    </SelectItem>
    <SelectItem :value="'333-555-1122'">
      +1 (333) 555-1122
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
