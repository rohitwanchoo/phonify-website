<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import moment from 'moment'
import { FieldArray, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Separator } from '@/components/ui/separator'
import Textarea from '@/components/ui/textarea/Textarea.vue'

type Days = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'default'

interface callTimingList {
  id: number
  day: string
  from_time: string
  to_time: string
  department_id: number
  name: string
  description: string
  calltimeStatus: boolean
  actions?: string
}

const props = defineProps<{
  open: boolean
  editData?: callTimingList | null
}>()

const selectedDays = ref<Record<Days, boolean>>({
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  default: false,
})

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'required').max(50),
    weeks: z
      .array(
        z.object({
          day: z.string(),
          start: z.string(),
          stop: z.string(),
        }),
      )
      .superRefine((weeks, ctx) => {
        const selected = selectedDays.value
        weeks.forEach((week, index) => {
          const isSelected = selected[week.day as Days]

          // Only validate if the day is selected
          if (isSelected) {
            if (!week.start || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(week.start)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'start time required',
                path: [index, 'start'],
              })
            }
            if (!week.stop || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(week.stop)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'stop time required',
                path: [index, 'stop'],
              })
            }
          }
        })
      }),
  }),
)

const initialValues = {
  title: '',
  weeks: [
    { day: 'default', start: '', stop: '' },
    { day: 'sunday', start: '', stop: '' },
    { day: 'monday', start: '', stop: '' },
    { day: 'tuesday', start: '', stop: '' },
    { day: 'wednesday', start: '', stop: '' },
    { day: 'thursday', start: '', stop: '' },
    { day: 'friday', start: '', stop: '' },
    { day: 'saturday', start: '', stop: '' },
  ],
}

const { handleSubmit, validate, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues,
})

// Watch for editData changes and populate form
watch(() => props.editData, (newData) => {
  if (newData && props.open) {
    // Populate the form with edit data
    setFieldValue('title', newData.name)

    // Parse the day and times - you may need to adjust this based on your data structure
    // For example, if your data has specific day information
    if (newData.day) {
      const dayKey = newData.day.toLowerCase() as Days
      if (dayKey in selectedDays.value) {
        selectedDays.value[dayKey] = true

        // Find the corresponding week entry and update it
        const weekIndex = initialValues.weeks.findIndex(w => w.day === dayKey)
        if (weekIndex !== -1) {
          setFieldValue(`weeks.${weekIndex}.start` as const, newData.from_time.substring(0, 5)) // Remove seconds if present
          setFieldValue(`weeks.${weekIndex}.stop` as const, newData.to_time.substring(0, 5))
        }
      }
    }
  }
}, { immediate: true })

// Watch for dialog close and reset form
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    // Reset selected days
    Object.keys(selectedDays.value).forEach((key) => {
      selectedDays.value[key as Days] = false
    })
  }
})

function toggleDay(day: Days) {
  selectedDays.value[day] = !selectedDays.value[day]
  if (!Object.values(selectedDays.value).includes(true)) {
    validate()
  }
}

function toFullTime(t: string) {
  return moment(t, 'HH:mm').format('HH:mm:ss')
}
const departmentList = useNuxtData('department-list-call-times')

const onSubmit = handleSubmit(async (values) => {
  const filteredWeeks = values.weeks.filter(
    w => w.start && w.stop,
  )
  try {
    const payload = {
      id: props?.editData?.id,
      name: props?.editData?.name,
      day: values.weeks.map(d => d.day),
      from: filteredWeeks.map(f => toFullTime(f.start)),
      to: filteredWeeks.map(t => toFullTime(t.stop)),
    }

    const { data, status } = await useLazyAsyncData(() =>
      useApi().post('/save-call-timings', {
        body: payload,
      }),
    )
    emit('update:open', false)

    // Show success message
    showToast({
      type: 'success',
      message: 'Call time updated successfully',
    })
  }
  catch {
    showToast({
      type: 'error',
      message: 'An error occurred while saving the call time',
    })
  }
})
</script>

<template>
  <Dialog :open="open">
    <DialogContent class="sm:max-w-[715px] max-h-screen overflow-y-auto [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-base font-medium flex items-center justify-between">
          Edit Call Time
          <DialogClose class="cursor-pointer" @click="$emit('update:open', false)">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>

      <form id="form" @submit.prevent="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Title
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter call time name" v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Description
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Description" v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField, errorMessage }"
            name="department"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Department
              </FormLabel>
              <FormControl>
                <Select :default-value="10" v-bind="componentField">
                  <SelectTrigger :class="errorMessage ? 'border-red-600' : ''" class="w-1/2 gap-x-1 px-2 h-11">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in departmentList.data.value" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="space-y-3">
            <FieldArray v-slot="{ fields }" name="weeks">
              <div
                v-for="(field, index) in fields"
                :key="`weeks-${field.key}`"
                class="flex w-full justify-between flex-wrap"
              >
                <div class="flex items-center gap-x-3">
                  <Checkbox
                    :id="field.key"
                    class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    :checked="selectedDays[field.value.day]"
                    @update:model-value="() => toggleDay(field.value.day)"
                  />
                  <label :for="field.key" class="capitalize">{{ field.value.day }}</label>
                </div>

                <div class="flex w-full gap-x-2 max-w-[519px]">
                  <div class="w-full">
                    <FormField v-slot="{ componentField }" :name="`weeks[${index}].start`">
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            class="h-11"
                            :disabled="!selectedDays[field.value.day]"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="w-full">
                    <FormField v-slot="{ componentField }" :name="`weeks[${index}].stop`">
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            class="h-11"
                            :disabled="!selectedDays[field.value.day]"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </div>
            </FieldArray>
          </div>

          <DialogFooter class="">
            <DialogClose as-child>
              <Button variant="outline" class="h-11 w-full md:w-1/2" @click="$emit('update:open', false)">
                <Icon name="mdi:close" />
                Close
              </Button>
            </DialogClose>
            <Button type="submit" class="h-11 w-full md:w-1/2" :loading="status === 'pending'">
              <Icon name="material-symbols:save" size="18" />
              Update
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
