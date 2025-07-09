<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'

const props = defineProps({
  emailTemplate: {
    type: Object as () => {
      id: number
      template_name: string
      template_html: string
      subject: string
      lead_status: string
      status: string
      send_bcc: string
      created_at: string
      updated_at: string
    },
    default: () => ({}),
  },
  emailTemplateStatus: String,
})

// Lead placeholders options
const leadPlaceholders = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
]

// Sender placeholders options
const senderPlaceholders = [
  { value: 'sender_name', label: 'Sender Name' },
  { value: 'sender_email', label: 'Sender Email' },
  { value: 'sender_title', label: 'Sender Title' },
  { value: 'sender_company', label: 'Sender Company' },
]

// Custom placeholders options
const customPlaceholders = [
  { value: 'custom_field_1', label: 'Custom Field 1' },
  { value: 'custom_field_2', label: 'Custom Field 2' },
  { value: 'custom_field_3', label: 'Custom Field 3' },
]

const formSchema = toTypedSchema(z.object({
  template_name: z.string().min(1, 'Template name is required'),
  leadPlaceholder: z.string().optional(),
  senderPlaceholder: z.string().optional(),
  customPlaceholder: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  template_html: z.string().min(1, 'Template content is required'),
}))

const { handleSubmit, resetForm, values, setFieldError, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    template_name: '',
    leadPlaceholder: '',
    senderPlaceholder: '',
    customPlaceholder: '',
    subject: '',
    template_html: '',
  },
})

const loading = ref(false)

// Watch for changes in emailTemplate prop and update form values
watch(() => props.emailTemplate, (newTemplate) => {
  if (newTemplate && Object.keys(newTemplate).length > 0) {
    setValues({
      template_name: newTemplate.template_name || '',
      leadPlaceholder: '',
      senderPlaceholder: '',
      customPlaceholder: '',
      subject: newTemplate.subject || '',
      template_html: newTemplate.template_html || '',
    })
  }
}, { immediate: true, deep: true })

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    const response = await useApi().put('/email-template', {
      ...values,
      status: 1,
    })

    if (response.success) {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      navigateTo({
        path: '/app/configuration/email-templates',
      })
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    handleFieldErrors(error?.data, setFieldError)
    showToast({
      message: `${error?.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex justify-start items-start gap-6">
    <div class="max-h-[calc(100vh-190px)] flex-1 bg-white rounded-xl border border-zinc-100 flex flex-col justify-start items-start overflow-hidden">
      <!-- Header -->
      <div class="w-full px-5 py-3 border-b border-zinc-100 flex justify-start items-center">
        <div class="justify-center text-slate-800 text-base font-medium">
          Template Details
        </div>
      </div>

      <!-- Form Content -->
      <form class="relative w-full overflow-x-auto" @submit="onSubmit">
        <div class="min-w-fit w-full flex-1 p-5 flex flex-col justify-start items-start gap-5">
          <!-- Template Name and Lead Placeholders Row -->
          <div class="w-full flex justify-start items-start gap-4">
            <FormField v-slot="{ componentField }" name="template_name" class="flex-1 w-full">
              <FormItem class="w-full flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium">
                  Template Name
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter Template Name"
                    class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="leadPlaceholder" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium">
                  Lead Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                      <SelectValue placeholder="Select Placeholder" class="justify-start text-slate-800 text-xs font-normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in leadPlaceholders" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Sender and Custom Placeholders Row -->
          <div class="w-full flex justify-start items-start gap-4">
            <FormField v-slot="{ componentField }" name="senderPlaceholder" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium">
                  Sender Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                      <SelectValue placeholder="Select Placeholder" class="justify-start text-slate-800 text-xs font-normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in senderPlaceholders" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="customPlaceholder" class="flex-1">
              <FormItem class="w-full flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium">
                  Custom Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                      <SelectValue placeholder="Select Placeholder" class="justify-start text-slate-800 text-xs font-normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in customPlaceholders" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Subject Row -->
          <div class="w-full flex justify-start items-start gap-4">
            <FormField v-slot="{ componentField }" name="subject" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter Email Subject"
                    class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Template Editor Row -->
          <div class="w-full flex justify-start items-start gap-4">
            <FormField v-slot="{ componentField }" name="template_html" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium">
                  Template
                </FormLabel>
                <FormControl>
                  <div class="w-full rounded-md outline outline-offset-[-1px] outline-zinc-200 flex flex-col justify-start items-start overflow-auto">
                    <!-- Text Area -->
                    <div class="w-full h-64 px-4 pt-3 pb-4 relative flex flex-col justify-start items-start overflow-hidden">
                      <Textarea
                        v-bind="componentField"
                        placeholder="Email Template..."
                        class="p-0 h-full border-none shadow-none resize-none text-sm font-normal leading-tight placeholder:text-slate-800/50 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Footer with Save Button -->
        <div class="sticky bottom-0 w-full p-5 rounded-b-lg bg-white shadow-md inline-flex justify-start items-start gap-4">
          <Button
            v-if="Object.keys(emailTemplate).length > 0"
            type="button"
            class="flex-1"
            :loading="loading"
            :disabled="loading"
            @click="$emit('edit', values)"
          >
            <Icon name="material-symbols:save" class="w-5 h-5 text-white" />
            Update
          </Button>
          <Button
            v-if="!emailTemplate?.id"
            type="submit"
            class="flex-1"
            :loading="loading"
            :disabled="loading"
          >
            <Icon name="material-symbols:save" class="w-5 h-5 text-white" />
            Save
          </Button>
        </div>
      </form>
    </div>
    <ConfigurationEmailTemplatesAddPreview :template-html="values?.template_html || ''" />
  </div>
</template>
