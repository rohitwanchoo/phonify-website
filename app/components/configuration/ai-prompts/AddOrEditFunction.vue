<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
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
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const props = defineProps<{
  initialData?: Record<string, any> | null
  isEdit?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

// Dummy data for function types
const functionTypes = [
  { id: 1, name: 'Send Email', value: 'send_email' },
  { id: 2, name: 'Send SMS', value: 'send_sms' },
  { id: 3, name: 'Create Task', value: 'create_task' },
  { id: 4, name: 'Update Contact', value: 'update_contact' },
]

// Dummy data for SMS templates
const smsTemplates = [
  { id: 1, name: 'Welcome Message', value: 'welcome_message' },
  { id: 2, name: 'Follow Up', value: 'follow_up' },
  { id: 3, name: 'Appointment Reminder', value: 'appointment_reminder' },
  { id: 4, name: 'Thank You', value: 'thank_you' },
]

const formSchema = toTypedSchema(z.object({
  type: z.string().min(1, 'Type is required'),
  name: z.string().min(1, 'Name is required'),
  sms_template: z.string().min(1, 'SMS Template is required'),
}))

const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    type: props.initialData?.type ?? '',
    name: props.initialData?.name ?? '',
    sms_template: props.initialData?.sms_template ?? '',
  },
})

const loading = ref(false)

watch(() => open.value, (newVal) => {
  if (newVal && props.isEdit && props.initialData) {
    setFieldValue('type', props.initialData.type)
    setFieldValue('name', props.initialData.name)
    setFieldValue('sms_template', props.initialData.sms_template)
  }
  else if (!newVal) {
    resetForm()
  }
})

const onSubmit = handleSubmit(async (values) => {
  const _api = props.isEdit ? '/edit-function' : '/add-function'
  let payload = {}

  if (props.isEdit) {
    payload = {
      function_id: props.initialData?.id,
      ...values,
    }
  }
  else {
    payload = { ...values }
  }

  try {
    loading.value = true

    // Simulating API call
    console.log('Function payload:', payload)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Replace with actual API call
    // const response = await useApi().post(api, payload)

    showToast({
      message: props.isEdit ? 'Function updated successfully' : 'Function added successfully',
      type: 'success',
    })

    resetForm()
    open.value = false
    // refreshNuxtData('functions')
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})

const onSaveAndNew = handleSubmit(async (values) => {
  try {
    loading.value = true

    // Simulating API call
    console.log('Function payload (Save and New):', values)
    await new Promise(resolve => setTimeout(resolve, 1000))

    showToast({
      message: 'Function added successfully',
      type: 'success',
    })

    resetForm()
    // Keep dialog open for adding new
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-[600px] max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-base font-medium">
          {{ props.isEdit ? 'Edit' : 'Add' }} Function
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <form id="function-form" class="space-y-4" @submit.prevent="onSubmit">
        <!-- Type Select -->
        <FormField v-slot="{ componentField, errorMessage }" name="type">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900">
              Type
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  :class="errorMessage && 'border-red-600'"
                  class="h-11 w-full"
                >
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="item in functionTypes"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Name Input -->
        <FormField v-slot="{ componentField, errorMessage }" name="name">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900">
              Name
            </FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                :class="errorMessage && 'border-red-600'"
                class="h-11"
                placeholder="Enter Name"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- SMS Template Select -->
        <FormField v-slot="{ componentField, errorMessage }" name="sms_template">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900">
              Select SMS Template
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  :class="errorMessage && 'border-red-600'"
                  class="h-11 w-full"
                >
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="item in smsTemplates"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Action Buttons -->
        <div class="flex justify-start items-center gap-3 pt-2">
          <Button
            v-if="!props.isEdit"
            type="button"
            variant="outline"
            class="flex-1 h-11"
            :loading="loading"
            :disabled="loading"
            @click="onSaveAndNew"
          >
            Save and New
          </Button>
          <Button
            type="submit"
            class="flex-1 h-11 bg-red-600 hover:bg-red-700"
            :loading="loading"
            :disabled="loading"
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
