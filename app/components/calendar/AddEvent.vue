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

interface Props {
  data?: any
}
const props = defineProps<Props>()

const emits = defineEmits(['complete'])

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'required').max(50),
  description: z.string().min(1, 'required').max(100),
  start_date: z.string().min(1, 'Start date is required'),

}))

const { handleSubmit, validate, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
})

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const idEdit = computed(() => props.data?.id || 0)
const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  console.log(values)
})
</script>

<template>
  <!-- reset form when dialog close -->
  <Dialog v-model:open="open" @update:open="onModelOpen">
    <DialogTrigger as-child>
      <slot>
        <Button class="">
          <Icon class="!text-white" name="lucide:plus" />
          Add Event
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[615px] max-h-screen overflow-y-auto [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          {{ idEdit ? 'Edit' : 'Add' }} Event
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
                <Input placeholder="Enter Title" v-bind="componentField" class="h-11" />
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
                <Textarea placeholder="Comment here" v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 space-x-3 space-y-4 items-start ">
            <FormField
              v-slot="{ componentField }"
              name="start_date"
            >
              <FormItem>
                <FormLabel class="text-xs font-normal">
                  Start Date
                </FormLabel>
                <FormControl>
                  <Input placeholder="DD/MM/YYYY" type="date" v-bind="componentField" class="h-11 placeholder:uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="start_time"
            >
              <FormItem>
                <FormLabel class="text-xs font-normal">
                  Start Time
                </FormLabel>
                <FormControl>
                  <Input placeholder="DD/MM/YYYY" type="time" v-bind="componentField" class="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="end_date"
            >
              <FormItem>
                <FormLabel class="text-xs font-normal">
                  End Date
                </FormLabel>
                <FormControl>
                  <Input placeholder="DD/MM/YYYY" type="date" v-bind="componentField" class="h-11 placeholder:uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="end_time"
            >
              <FormItem>
                <FormLabel class="text-xs font-normal">
                  End Time
                </FormLabel>
                <FormControl>
                  <Input placeholder="DD/MM/YYYY" type="time" v-bind="componentField" class="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <DialogFooter>
            <DialogClose class="w-full sm:w-1/2">
              <Button variant="outline" class="h-11  w-full">
                <Icon name="mdi:close" />
                Close
              </Button>
            </DialogClose>
            <Button for="form" :disabled="loading" class="h-11 w-full sm:w-1/2" type="submit" @click="onSubmit">
              <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save' " size="18" />
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
