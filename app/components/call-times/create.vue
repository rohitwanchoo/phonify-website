<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useFocus } from '@vueuse/core'
import { FieldArray, useForm } from 'vee-validate'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import { Separator } from '@/components/ui/separator'
import Textarea from '../ui/textarea/Textarea.vue'

interface Props {
  data?: any
}
const props = defineProps<Props>()

const emits = defineEmits(['complete'])

const focusInput = shallowRef()
useFocus(focusInput, { initialValue: true })

const selectedDays = ref({
  default: false,
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
})

function resetSelectedDays() {
  selectedDays.value = {
    default: false,
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  }
}

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'required').max(50),
    description: z.string().min(1, 'required').max(100),
    weeks: z.array(
      z.object({
        day: z.string(),
        start: z.string().optional(),
        end: z.string().optional(),
      }),
    ).superRefine((weeks, ctx) => {
      weeks.forEach((week, index) => {
        const isSelected = selectedDays.value[week.day as keyof typeof selectedDays.value]

        if (isSelected) {
          if (!week.start) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'start time required',
              path: [index, 'start'],
            })
          }
          if (!week.end) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'end time required',
              path: [index, 'end'],
            })
          }
          // Validate end time is after start time
          if (week.start && week.end && week.start >= week.end) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'end time must be after start time',
              path: [index, 'end'],
            })
          }
        }
      })
    }),
  }),
)

const initialValues = ref({
  title: '',
  weeks: [
    { day: 'default', start: '', end: '' },
    { day: 'sunday', start: '', end: '' },
    { day: 'monday', start: '', end: '' },
    { day: 'tuesday', start: '', end: '' },
    { day: 'wednesday', start: '', end: '' },
    { day: 'thursday', start: '', end: '' },
    { day: 'friday', start: '', end: '' },
    { day: 'saturday', start: '', end: '' },
  ],
})

const { handleSubmit, validate, resetForm, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: initialValues.value,
})

function toggleDay(day: string) {
  const dayIndex = initialValues.value.weeks.findIndex(w => w.day === day)

  // If unchecked, clear the time values
  if (!selectedDays.value[day as keyof typeof selectedDays.value] && dayIndex !== -1) {
    setFieldValue(`weeks.${dayIndex}.start`, '')
    setFieldValue(`weeks.${dayIndex}.end`, '')
  }

  if (!Object.values(selectedDays.value).includes(true)) {
    validate()
  }
}

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const isEdit = computed(() => props.data?.id || 0)
const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  try {
    const week_plan = values.weeks.reduce((acc, { day, start, end }) => {
      if (start && end) { // ✅ only include if both present
        acc[day] = { start, end }
      }
      return acc
    }, {} as Record<string, { start: string, end: string }>)

    const data = {
      title: values.title,
      description: values.description,
      week_plan,
    }
    let api = '/call-timers'
    if (isEdit.value)
      api = `/call-timers/${isEdit.value && props.data.id}`

    const response = await useApi().post(api, data)
    loading.value = false
    resetForm()
    showToast({
      message: response.message || 'Call time created',
    })
    emits('complete')
    open.value = false
  }
  catch (error) {
    showToast({
      message: `${error}`,
      type: 'error',
    })
  }
})

watch(() => open.value, (val) => {
  if (val && isEdit.value) {
    // set common fields
    setFieldValue('title', props.data.title)
    setFieldValue('description', props.data.description)

    // Initialize empty weeks array with default structure
    const defaultWeeks = [
      { day: 'default', start: '', end: '' },
      { day: 'sunday', start: '', end: '' },
      { day: 'monday', start: '', end: '' },
      { day: 'tuesday', start: '', end: '' },
      { day: 'wednesday', start: '', end: '' },
      { day: 'thursday', start: '', end: '' },
      { day: 'friday', start: '', end: '' },
      { day: 'saturday', start: '', end: '' },
    ]

    if (props.data.week_plan) {
      // Transform week_plan → weeks[]
      const weeks = Object.entries(props.data.week_plan).map(([day, times]) => {
        return {
          day: day.toLowerCase(),
          start: (times as { start?: string }).start || '',
          end: (times as { end?: string }).end || '',
        }
      })

      // Merge with default structure to ensure all days are present
      const mergedWeeks = defaultWeeks.map((defaultWeek) => {
        const existingWeek = weeks.find(w => w.day === defaultWeek.day)
        return existingWeek || defaultWeek
      })

      // Set whole weeks array in form
      setFieldValue('weeks', mergedWeeks)

      // Update checkboxes
      mergedWeeks.forEach((week) => {
        if (week.start && week.end && week.day in selectedDays.value) {
          selectedDays.value[week.day as keyof typeof selectedDays.value] = true
        }
      })
    }
    else {
      // If no week_plan, set default empty structure
      setFieldValue('weeks', defaultWeeks)
    }
  }
})

function onModelOpen(val: boolean) {
  if (!val) {
    resetForm()
    resetSelectedDays()
  }
}

function onTimeChange(index: number) {
  // Update all weeks with the new end time and ensure they have a start time
  if (index !== 0)
    return

  const endTime = values.weeks?.[0]?.end || ''
  const startTime = values.weeks?.[0]?.start || ''

  if (endTime && startTime) {
    setFieldValue('weeks', values.weeks?.map(week => ({
      ...week,
      start: startTime, // Use existing start time or default
      end: endTime,
    })))
    selectedDays.value = {
      default: true,
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
    }
  }
}
</script>

<template>
  <!-- reset form when dialog close -->
  <Dialog v-model:open="open" @update:open="onModelOpen">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="!text-white" size="20" name="material-symbols:add" />
          Create Call Time
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[715px] max-h-screen overflow-y-auto [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          {{ isEdit ? 'Edit Call Time' : 'Create Call Time' }}
          <DialogClose class="cursor-pointer">
            <Icon name="material-symbols:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Title
              </FormLabel>
              <FormControl>
                <Input ref="focusInput" placeholder="Enter call time name" v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Description -->

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

          <div class="space-y-3">
            <FieldArray v-slot="{ fields }" name="weeks">
              <div
                v-for="(field, index) in fields"
                :key="`weeks-${field.key}`"
                class="flex w-full justify-between flex-wrap"
              >
                <div class="flex items-center gap-x-3">
                  <!-- Static checkbox, not part of form -->
                  <Checkbox
                    :id="String(field.key)"
                    v-model="selectedDays[(field.value as { day: string }).day as keyof typeof selectedDays]"
                    :checked="selectedDays[(field.value as { day: string }).day as keyof typeof selectedDays]"
                    class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    @update:model-value="() => { toggleDay((field.value as { day: string }).day) }"
                  />
                  <label :for="String(field.key)" class="capitalize">
                    {{ (field.value as { day: string }).day }}
                  </label>
                </div>

                <div class="flex w-full gap-x-2 max-w-[519px]">
                  <div class="w-full">
                    <FormField v-slot="{ componentField }" :name="`weeks[${index}].start`">
                      <FormItem>
                        <FormControl>
                          <Input
                            v-bind="componentField"
                            type="time"
                            class="h-11"
                            :disabled="!selectedDays[(field.value as { day: string }).day as keyof typeof selectedDays]"
                            @update:model-value="onTimeChange(index)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="w-full">
                    <FormField v-slot="{ componentField }" :name="`weeks[${index}].end`">
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            class="h-11"
                            v-bind="componentField"
                            :disabled="!selectedDays[(field.value as { day: string }).day as keyof typeof selectedDays]"
                            @update:model-value="onTimeChange(index)"
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

          <DialogFooter>
            <DialogClose class="w-full sm:w-1/2">
              <Button variant="outline" class="h-11  w-full">
                <Icon name="material-symbols:close" size="20" />
                Close
              </Button>
            </DialogClose>
            <Button for="form" :disabled="loading" :loading="loading" class="h-11 w-full sm:w-1/2" type="submit" @click="onSubmit">
              <Icon v-if="!loading" name="material-symbols:save" size="20" />
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
