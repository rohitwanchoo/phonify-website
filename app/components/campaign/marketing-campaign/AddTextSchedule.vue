<!-- components/EditDialog.vue -->
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
// import { format } from 'date-fns'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'reka-ui/date'
import { CalendarIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
const open = defineModel('open', { type: Boolean, default: false })

// Dummy data for select options
const leadList = [
  { list_id: '1', list: 'Premium Customers' },
  { list_id: '2', list: 'New Leads' },
  { list_id: '3', list: 'Inactive Users' },
  { list_id: '4', list: 'VIP Clients' },
]

const messageTemplates = [
  { id: '1', name: 'Welcome Message' },
  { id: '2', name: 'Follow-up' },
  { id: '3', name: 'Promotion' },
  { id: '4', name: 'Reminder' },
]

const daysOfWeek = [
  { id: '1', day: 'Monday' },
  { id: '2', day: 'Tuesday' },
  { id: '3', day: 'Wednesday' },
  { id: '4', day: 'Thursday' },
  { id: '5', day: 'Friday' },
  { id: '6', day: 'Saturday' },
  { id: '7', day: 'Sunday' },
]

const formSchema = toTypedSchema(
  z.object({
    list: z.string().min(1, 'List selection is required'),
    template: z.string().min(1, 'Template selection is required'),
    day: z.string().min(1, 'Day selection is required'),
    frequency: z.string().min(1, 'Frequency selection is required'),
    fromTime: z.string().min(1, 'Start time is required'),
    toTime: z.string().min(1, 'End time is required'),
    runDate: z.date({ required_error: 'Date is required' }),
  }),
)

const { handleSubmit, resetForm, isSubmitting, setValues, values } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted:', values)
  open.value = false
})

function onOpenChange(isOpen: boolean) {
  if (!isOpen) {
    resetForm()
  }
  open.value = isOpen
}
</script>

<template>
  <div>
    <!-- Dialog Content -->
    <Dialog :open="open" @update:open="onOpenChange">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Text Schedule</DialogTitle>
        </DialogHeader>
        <Separator />

        <form class="space-y-4 mt-4" @submit.prevent="onSubmit">
          <!-- List Select -->
          <FormField v-slot="{ componentField }" name="list">
            <FormItem>
              <FormLabel>Country Code</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in leadList" :key="option.list_id" :value="option.list_id">
                      {{ option.list }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Template Select -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Select List</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in messageTemplates" :key="option.id" :value="option.id">
                      {{ option.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Day Select -->
          <FormField v-slot="{ componentField }" name="day">
            <FormItem>
              <FormLabel>Text Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in daysOfWeek" :key="option.id" :value="option.id">
                      {{ option.day }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Frequency Select -->
          <FormField v-slot="{ componentField }" name="frequency">
            <FormItem>
              <FormLabel>DID</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">
                      Daily
                    </SelectItem>
                    <SelectItem value="weekly">
                      Weekly
                    </SelectItem>
                    <SelectItem value="monthly">
                      Monthly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Time Range -->
          <div>
  <div class="font-medium text-sm mb-1">
    Run Time
  </div>
  <div class="flex flex-col md:flex-row gap-4">
    <FormField v-slot="{ componentField, value }" name="runDate">
  <FormItem class="flex flex-col flex-1">
    <FormControl>
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            class="w-full justify-start text-left font-normal hover:bg-transparent border border-gray-300"
            :class="!value ? 'text-muted-foreground' : ''"
          >
            <span>{{ value ? new Date(value).toLocaleDateString('en-GB') : 'DD/MM/YYYY' }}</span>
            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            calendar-label="Run Date"
            :model-value="value ? parseDate(new Date(value).toISOString().split('T')[0]) : undefined"
            initial-focus
            @update:model-value="(v) => {
              if (v) {
                componentField.onChange(toDate(v))
              } else {
                componentField.onChange(undefined)
              }
            }"
          />
        </PopoverContent>
      </Popover>
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>
    
    <FormField v-slot="{ componentField }" name="toTime">
      <FormItem class="flex flex-col flex-1">
        <FormControl>
          <Input
            v-bind="componentField"
            type="time"
            class="border shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none pl-28"
            placeholder="00:00:00s"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</div>


          <DialogFooter class="w-full mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" class="flex-1 h-11" as-child>
              <DialogClose @click="resetForm">
                <Icon name="material-symbols:close" size="20" />
                Close
              </DialogClose>
            </Button>
            <Button type="submit" class="flex-1 h-11" :disabled="isSubmitting">
              <Icon name="material-symbols:save" size="20" />
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
