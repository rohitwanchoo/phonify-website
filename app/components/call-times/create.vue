<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import moment from 'moment'
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Textarea from '../ui/textarea/Textarea.vue'

type Days = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'default'

interface Props {
  data?: any
}
const props = defineProps<Props>()

const emits = defineEmits(['complete'])

const selectedDays = ref({
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
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  }
}

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'required').max(50),
  description: z.string().min(1, 'required').max(100),
  department: z.number().min(1, 'required'),
  weeks: z.array(
    z.object({
      day: z.string(),
      start: z.string(),
      stop: z.string(),
    }),
  ).superRefine((weeks, ctx) => {
    const selected = selectedDays.value
    weeks.forEach((week, index) => {
      const isSelected = selected[week.day as keyof typeof selected]

      // Only validate if checkbox is selected
      if (isSelected) {
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(week.start)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'start time required',
            path: [index, 'start'],
          })
        }

        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(week.stop)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'stop time required',
            path: [index, 'stop'],
          })
        }
      }
    })
  }),
}))

const initialValues = ref({
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
})

const { handleSubmit, validate, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: initialValues.value,
})

function toggleDay(day: string) {
  selectedDays.value[day as keyof typeof selectedDays.value] = !selectedDays.value[day as keyof typeof selectedDays.value]
  // if any day is deselected validate the form
  if (!Object.values(selectedDays.value).includes(true)) {
    validate()
  }
}

function toFullTime(t: string) {
  return moment(t, 'HH:mm').format('HH:mm:ss')
}
const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const idEdit = computed(() => props.data?.id || 0)

const onSubmit = handleSubmit(async (values) => {
  try {
    const filteredWeeks = values.weeks.filter(
      w => w.start && w.stop,
    )
    const data = {
      name: values.title,
      description: values.description,
      dept_id: values.department,
      day: filteredWeeks.map(d => d.day),
      from: filteredWeeks.map(f => toFullTime(f.start)),
      to: filteredWeeks.map(t => toFullTime(t.stop)),
    }
    if (idEdit.value) {
      (data as any).id = props.data.id
    }
    const response = await useApi().post('/save-call-timings', {
      data,
    })
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

const { data: departmentList } = await useLazyAsyncData('department-list-call-times', () =>
  useApi().post('/get-department-list', {

  }), {
  transform: (res) => {
    return res.data
  },
})

watch(() => open.value, (val) => {
  if (val && idEdit.value) {
    setFieldValue('title', props.data.name)
    setFieldValue('department', props.data.department_id)
    setFieldValue('description', props.data.description)
    if (props.data.day) {
      const dayKey = props.data.day.toLowerCase() as Days
      if (dayKey in selectedDays.value) {
        selectedDays.value[dayKey] = true

        // Find the corresponding week entry and update it
        const weekIndex = initialValues.value.weeks.findIndex(w => w.day === dayKey)
        if (weekIndex !== -1) {
          setFieldValue(`weeks.${weekIndex}.start` as const, props.data.from_time.substring(0, 5)) // Remove seconds if present
          setFieldValue(`weeks.${weekIndex}.stop` as const, props.data.to_time.substring(0, 5))
        }
      }
    }
    // setFieldValue('weeks', props.data.weeks.map((w: any) => ({ day: w.day, start: w.from, stop: w.to })))
  }
})

function onModelOpen(val: boolean) {
  if (!val) {
    resetForm()
    resetSelectedDays()
  }
}
</script>

<template>
  <!-- reset form when dialog close -->
  <Dialog v-model:open="open" @update:open="onModelOpen">
    <DialogTrigger as-child>
      <slot>
        <Button class="">
          <Icon class="!text-white" name="lucide:plus" />
          Create Call Time
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[715px] max-h-screen overflow-y-auto [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          {{ idEdit ? 'Edit Call Time' : 'Create Call Time' }}
          <DialogClose class="cursor-pointer">
            <Icon name="mdi:close" size="20" />
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
                <Input placeholder="Enter call time name" v-bind="componentField" class="h-11" />
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
                    <SelectItem v-for="item in departmentList" :key="item.id" :value="item.id">
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
                  <!-- Static checkbox, not part of form -->
                  <Checkbox
                    :id="field.key"
                    class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    :checked="selectedDays[field.value.day]"
                    @update:model-value="() => { toggleDay(field.value.day) }"
                  />
                  <label :for="field.key" class="capitalize">
                    {{ field.value.day }}
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
                            :disabled="!selectedDays[field.value.day]"
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
                            v-bind="componentField"
                            :disabled="!selectedDays[field.value.day]"
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
                <Icon name="mdi:close" />
                Close
              </Button>
            </DialogClose>
            <Button for="form" class="h-11 w-full sm:w-1/2" type="submit" @click="onSubmit">
              <Icon name="material-symbols:save" size="18" />
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
