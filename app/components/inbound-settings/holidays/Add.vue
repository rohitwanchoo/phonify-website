<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import moment from 'moment'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import * as z from 'zod'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const props = defineProps<{
  initialData?: { id: number, name: string, month: string, date: string }
  isEdit?: boolean
}>()

const emit = defineEmits(['refresh', 'complete', 'update:open'])

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const monthOptions = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const dayOptions = ref(Array.from({ length: 31 }, (_, i) => {
  const d = (i + 1).toString().padStart(2, '0')
  return d
}))

const isEditMode = computed(() => !!props.isEdit)

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'Holiday name is required'),
  month: z.string().min(1, 'Select a month'),
  date: z.string().min(1, 'Select a date'),
}))

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
})

watch(open, async (newValue) => {
  if (newValue && props.isEdit && props.initialData) {
    setValues({
      name: props.initialData.name,
      month: String(props.initialData.month),
      date: String(props.initialData.date).padStart(2, '0'),
    })
  }
  else {
    resetForm({
      values: {
        name: '',
        month: '',
        date: '',
      },
    })
  }
})

const loading = ref(false)

const onSubmit = handleSubmit((values) => {
  loading.value = true
  const api = '/save-holiday-detail'

  let payload = {}

  if (props.isEdit && props.initialData) {
    payload = {
      holiday_id: props.initialData.id,
      name: values.name,
      date: values.date,
      month: values.month,
    }
  }
  else {
    payload = {
      holiday_id: 0,
      name: values.name,
      date: values.date,
      month: values.month,
    }
  }

  useApi().post(api, { data: payload }).then((response) => {
    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
      emit('refresh')
      emit('complete')
      open.value = false
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }).catch((error) => {
    showToast({
      message: error.message,
      type: 'error',
    })
  }).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="text-xl" name="material-symbols:add" />
          Add Holiday
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? 'Edit Holiday' : 'Create New Holiday' }}
        </DialogTitle>
      </DialogHeader>
      <form class="space-y-4 py-2" @submit="onSubmit">
        <!-- Name -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Enter Holiday name" class="h-11" />
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
                <SelectTrigger class="!h-11 w-full">
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
        <FormField v-slot="{ componentField }" name="date">
          <FormItem>
            <FormLabel>Day</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="!h-11 w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="day in dayOptions"
                    :key="day"
                    :value="day"
                  >
                    {{ day }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Footer Buttons -->
        <DialogFooter>
          <DialogClose class="sm:w-1/2">
            <Button variant="outline" class="h-11  w-full">
              <Icon name="material-symbols:close" size="20" />
              Close
            </Button>
          </DialogClose>
          <Button :disabled="loading" for="form" class="h-11 sm:w-1/2" type="submit" :loading="loading" @click="onSubmit">
            <Icon name="material-symbols:save" size="20" />
            {{ isEdit ? 'Update' : 'Save' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
