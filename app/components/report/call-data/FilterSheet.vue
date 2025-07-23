<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import { toDate } from 'reka-ui/date'
import { ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

// Sheet open state
const open = ref(false)
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
          Filter Call Reports
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
                  <label class="text-sm font-medium text-primary">Extention List</label>
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
                <div>
                  <label class="text-sm font-medium text-primary">Campaign</label>
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
                <div>
                  <label class="text-sm font-medium text-primary">Disposition</label>
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
                <div>
                  <label class="text-sm font-medium text-primary">Route</label>
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
                <div>
                  <label class="text-sm font-medium text-primary">type</label>
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
                </div><div>
                  <label class="text-sm font-medium text-primary">DID Lists</label>
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
                <div>
                  <label class="text-sm font-medium text-primary">State / City / Area Codes</label>
                  <Input
                    type="number"
                    class="h-11"
                    placeholder="Enter Code"
                  />
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
        <Button class="w-full h-12 text-md" @click="onSubmit">
          <Icon name="material-symbols:search" class="text-md" />
          Search
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
