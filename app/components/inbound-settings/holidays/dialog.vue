<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { ref, watch, computed } from 'vue'

import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '~/components/ui/dialog'
import {
  FormControl, FormField, FormItem, FormMessage, FormLabel
} from '~/components/ui/form'

import { Input } from '~/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'

const monthOptions = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const dayOptions = Array.from({ length: 31 }, (_, i) => {
  const d = (i + 1).toString().padStart(2, '0')
  return { value: d, label: d }
})

const props = defineProps<{
  open: boolean
  rowData?: { id: number; name: string; month: string; day: string }
}>()

const emit = defineEmits(['update:open', 'submit'])
const isEditMode = computed(() => !!props.rowData)

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'Holiday name is required'),
  month: z.string().min(1, 'Select a month'),
  day: z.string().min(1, 'Select a date'),
}))

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
})

watch(() => props.open, (isOpen) => {
  if (isOpen && props.rowData) {
    setValues({
      name: props.rowData.name,
      month: props.rowData.month,
      day: props.rowData.day
    })
  } else {
    resetForm()
  }
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
  emit('update:open', false)
})
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? 'Edit Holiday' : 'Create New Holiday' }}
        </DialogTitle>
      </DialogHeader>

      <form class="space-y-4 py-2" @submit.prevent="onSubmit">
        <!-- Name -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Holiday name" class="h-11" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Month -->
        <FormField v-slot="{ componentField }" name="month">
          <FormItem>
            <FormLabel>Month</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="h-11 w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="month in monthOptions"
                    :key="month.value"
                    :value="month.value"
                  >
                    {{ month.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Day -->
        <FormField v-slot="{ componentField }" name="day">
          <FormItem>
            <FormLabel>Day</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="h-11 w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="day in dayOptions"
                    :key="day.value"
                    :value="day.value"
                  >
                    {{ day.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Footer Buttons -->
        <DialogFooter class="pt-4">
          <Button
            type="button"
            variant="outline"
            class="w-[49%]"
            @click="emit('update:open', false)"
          >
            <Icon name="material-symbols:close" />
            Cancel
          </Button>
          <Button type="submit" class="w-[49%]">
            <Icon name="material-symbols:save" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>