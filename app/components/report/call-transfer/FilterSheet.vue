<script setup lang="ts">
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toTypedSchema } from '@vee-validate/zod'
import { CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import * as zod from 'zod'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

const open = ref(false)

// Define validation schema
const filterSchema = zod.object({
  workPhone: zod.string().optional(),
  extension: zod.string().optional(),
  campaign: zod.string().optional(),
  status: zod.string().optional(),
  fromDate: zod.date().optional(),
  toDate: zod.date().optional(),
}).refine(
  (data) => {
    if (data.fromDate && data.toDate) {
      return data.toDate >= data.fromDate
    }
    return true
  },
  {
    message: 'To date must be after or equal to from date',
    path: ['toDate'],
  },
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(filterSchema),
  initialValues: {
    workPhone: '',
    extension: null,
    campaign: null,
    status: null,
    fromDate: undefined,
    toDate: undefined,
  },
})

const onSubmit = handleSubmit((values) => {
  console.log('Filter Applied', values)
  open.value = false
})

function handleReset() {
  resetForm()
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
          Filter Call Transfer
        </SheetTitle>
      </SheetHeader>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto space-y-6">
          <div class="flex-1 overflow-y-auto">
            <div class="mx-auto p-6 space-y-6">
              <div class="space-y-4">
                <!-- Work Phone Field -->
                <FormField v-slot="{ componentField }" name="workPhone">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-primary">
                      Work Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        class="h-11"
                        placeholder="Enter Phone Number"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Extension Field -->
                <FormField v-slot="{ componentField }" name="extension">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-primary">
                      Extension
                    </FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger class="w-full !h-11">
                          <SelectValue placeholder="Select Extension" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem :value="null">
                          All
                        </SelectItem>
                        <!-- Add other SelectItem options here as needed -->
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Campaign Field -->
                <FormField v-slot="{ componentField }" name="campaign">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-primary">
                      Campaign
                    </FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger class="w-full !h-11">
                          <SelectValue placeholder="Select Campaign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem :value="null">
                          All
                        </SelectItem>
                        <!-- Add other SelectItem options here as needed -->
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Status Field -->
                <FormField v-slot="{ componentField }" name="status">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-primary">
                      Status
                    </FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger class="w-full !h-11">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem :value="null">
                          All
                        </SelectItem>
                        <!-- Add other SelectItem options here as needed -->
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Date Range -->
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
