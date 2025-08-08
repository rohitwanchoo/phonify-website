<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'

const props = defineProps({
  leadData: Object,
})

const senderType = 'user' // Fixed sender type

// Define form validation schema using Zod
const formSchema = toTypedSchema(z.object({
  to: z.string().email('Lead Mail Id is required'),
  from: z.string().email('Agent Mail Id is required'),
  template: z.string().min(1, 'Please select a template').optional(),
  LeadPlaceholders: z.string().min(1, 'Please select a lead placeholder'),
  SenderPlaceholders: z.string().min(1, 'Please select a sender placeholder'),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject cannot exceed 100 characters'),
  templateContent: z.string().min(1, 'Template Preview is required')
}))

// Fetch sender details (agent emails)
const { data: emailSenderData } = await useLazyAsyncData('email-sender-details', () =>
  useApi().get(`/smtp/type/${senderType}`), {
  transform: res => res.data,
})

// Set up form using vee-validate
const { handleSubmit, isSubmitting, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    to: props?.leadData?.email,
    from: '',
    template: '',
    LeadPlaceholders: '',
    SenderPlaceholders: '',
    subject: '',
    templateContent: '',
  },
})

// Refs for managing selected sender and template data
const selectedSender = ref()
const emailTemplateData = ref([])
const selectedTemplateData = ref(null)

// Character count for template content
const templateContentLength = computed(() => values.templateContent?.length || 0)

// Watch for template change → auto-fill subject & content
watch(() => values.template, (newTemplateId) => {
  if (newTemplateId && emailTemplateData.value.length > 0) {
    const selectedTemplate = emailTemplateData.value.find((template: { id: number | string }) => template.id.toString() === newTemplateId)
    if (selectedTemplate) {
      selectedTemplateData.value = selectedTemplate
      setFieldValue('subject', (selectedTemplate as any).subject || '')
      setFieldValue('templateContent', (selectedTemplate as any).template_html || '')
    }
  }
  else {
    selectedTemplateData.value = null
  }
})

// Watch for sender selection → load related templates
watch(() => values.from, async (newFromEmail) => {
  if (newFromEmail && emailSenderData.value) {
    // Find the selected sender object by email to get its ID
    selectedSender.value = emailSenderData.value.find((sender: { from_email: string }) => sender.from_email === newFromEmail)

    if (selectedSender.value) {
      const { data: templateData } = await useLazyAsyncData(`email-template-${selectedSender.value.id}`, () =>
        useApi().get(`/email-template/${selectedSender.value.id}`), {
        transform: res => res.data,
      })

      // Normalize to array and update form values
      if (templateData.value) {
        emailTemplateData.value = Array.isArray(templateData.value) ? templateData.value : [templateData.value]

        // If only one template, auto-select it
        if (emailTemplateData.value.length === 1) {
          const singleTemplate = emailTemplateData.value[0]
          setFieldValue('template', (singleTemplate as any).id?.toString() ?? '')
          setFieldValue('subject', (singleTemplate as any)?.subject || '')
          setFieldValue('templateContent', (singleTemplate as any)?.template_html || '')
          selectedTemplateData.value = singleTemplate || null
        }
        else {
          // Multiple templates - clear fields and let user choose
          setFieldValue('template', '')
          setFieldValue('subject', '')
          setFieldValue('templateContent', '')
          selectedTemplateData.value = null
        }
      }
      else {
        // No templates found for sender – clear everything
        emailTemplateData.value = []
        setFieldValue('template', '')
        setFieldValue('subject', '')
        setFieldValue('templateContent', '')
        selectedTemplateData.value = null
      }
    }
  }
  else {
    // No sender selected – clear fields
    emailTemplateData.value = []
    selectedTemplateData.value = null
    setFieldValue('subject', '')
    setFieldValue('templateContent', '')
    setFieldValue('template', '')
  }
}, { immediate: true })

// Submit handler for sending email
const onSubmit = handleSubmit(async (vals) => {
  const payload = {
    senderType: 'user',
    user_id: selectedSender.value.user_id,
    campaign_id: selectedSender.value.campaign_id,
    subject: vals.subject,
    body: vals.templateContent,
    to: vals.to,
  }

  try {
    const response = await useApi().post('/send-email/generic', {
      ...payload,
    })

    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
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
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
})
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col justify-between gap-6 md:h-[550px]">
        <!-- Form fields section -->
        <div class="flex-1 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Recipient Email -->
            <FormField v-slot="{ componentField }" name="to">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  To
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Lead Mail Id"
                    v-bind="componentField"
                    class="border-gray-200 h-11"
                  />
                </FormControl>
                <FormMessage class="text-red-500" />
              </FormItem>
            </FormField>
            <!-- Agent -->
            <FormField v-slot="{ componentField }" name="from">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  From
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Agent Mail Id" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in emailSenderData" :key="option.id" :value="option.from_email">
                        {{ option.from_name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-red-500" />
              </FormItem>
            </FormField>
          </div>
          <!-- Template -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="emailTemplateData.length === 0">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue :placeholder="emailTemplateData.length === 0 ? 'No templates available' : 'Select template'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="template in emailTemplateData" :key="(template as any).id" :value="(template as any).id.toString()">
                      {{ (template as any).template_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-red-500" />
            </FormItem>
          </FormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Lead Placeholders -->
            <FormField v-slot="{ componentField }" name="LeadPlaceholders">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Lead Placeholders
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Select Placeholder"
                    v-bind="componentField"
                    class="border-gray-200 h-11"
                  />
                </FormControl>
                <FormMessage class="text-red-500" />
              </FormItem>
            </FormField>
            <!-- Sender Placeholders -->
            <FormField v-slot="{ componentField }" name="SenderPlaceholders">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Sender Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select Placeholder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in emailSenderData" :key="option.id" :value="option.from_email">
                        {{ option.from_name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-red-500" />
              </FormItem>
            </FormField>
          </div>

          <!-- Subject (full width) -->
          <FormField v-slot="{ componentField }" name="subject">
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Mail Subject"
                  v-bind="componentField"
                  class="border-gray-200 h-11"
                />
              </FormControl>
              <FormMessage class="text-red-500" />
            </FormItem>
          </FormField>
          <!-- Message (full width) -->
          <FormField v-slot="{ componentField }" name="templateContent">
            <FormItem>
              <FormLabel>Template Preview</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Enter message here..."
                  maxlength="500"
                  rows="8"
                  class="resize-y pr-14 min-h-[100px]"
                />
              </FormControl>
              <div class="flex justify-between">
                <FormMessage class="text-red-500 w-70" />
                <span class="w-full text-right text-xs text-muted-foreground select-none">
                  {{ templateContentLength }}/500 Characters
                </span>
              </div>
            </FormItem>
          </FormField>
        </div>
        <!-- Button section -->
        <div>
          <Button type="submit" :disabled="isSubmitting" :loading="isSubmitting" class="w-full h-11">
            <Icon name="material-symbols:mail" size="20"/>
            Send Email
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>