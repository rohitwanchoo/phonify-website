<script setup lang="ts">
import type { QuillEditor } from '@vueup/vue-quill'
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'

import { useFocus } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'

const props = defineProps<Props>()
const campaign_id = useRouteQuery('campaign_id')
const { user } = useUserSession()

interface LeadData {
  id: number
  list_id: number
  number: string
  lead_id: number
  data: Record<string, {
    label: string
    value: string
    is_dialing: number
    is_visible: number
    is_editable: number
    alternate_phone: string | null
  }>
}
interface Props {
  leadData: LeadData
}
const senderType = 'system' // Fixed sender type

const showHtml = ref(false)

// Email constants
const MAX_BODY_CHARACTERS = 10000 // Maximum characters for email body
const MAX_SUBJECT_CHARACTERS = 100

// Extract lead email from leadData
function getLeadEmail() {
  if (!props.leadData)
    return ''

  // Find the email entry in leadData (looking for title "Email")
  const emailEntry = Object.values(props.leadData).find((item: any) =>
    item?.title?.toLowerCase() === 'email',
  )

  return emailEntry?.value?.trim() || ''
}

// Define form validation schema using Zod
const formSchema = toTypedSchema(z.object({
  to: z.string().email('Please enter a valid email address'),
  from: z.string().optional(),
  template: z.number().optional(),
  LeadPlaceholders: z.string().optional(),
  SenderPlaceholders: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(MAX_SUBJECT_CHARACTERS, `Subject cannot exceed ${MAX_SUBJECT_CHARACTERS} characters`),
  templateContent: z.string().min(1, 'Email body is required').max(MAX_BODY_CHARACTERS, `Email body cannot exceed ${MAX_BODY_CHARACTERS} characters`),
}))

// Fetch sender details (agent emails)
const { data: emailSenderData } = await useLazyAsyncData('email-sender-details', () =>
  useApi().get(`/smtp/type/${senderType}`), {
  transform: res => res.data,
})

// fetch sender placeholders
const { data: senderPlaceholders } = await useLazyAsyncData('sender-placeholders-start-dialing', () =>
  useApi().get('/user/selected'), {
  transform: res => res.columns,
})

// get lead placeholders
const { data: leadPlaceholders } = await useLazyAsyncData('lead-placeholder-start-dialing', () =>
  useApi().post(`/label`), {
  transform: res => res.data,
})

// Set up form using vee-validate
const { handleSubmit, isSubmitting, values, setFieldValue, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    to: getLeadEmail(),
    from: 'System Email',
    template: undefined,
    LeadPlaceholders: '',
    SenderPlaceholders: '',
    subject: '',
    templateContent: '',
  },
})

// Set system email in from field when data is available
watch(emailSenderData, (data) => {
  if (data?.[0]?.from_email) {
    setFieldValue('from', data[0].from_email)
  }
  else if (data?.[0]?.from_name) {
    setFieldValue('from', data[0].from_name)
  }
}, { immediate: true })

// get email template
const { data: emailTemplateData, refresh: _refreshEmailTemplateData } = await useLazyAsyncData('email-template-start-dialing', () =>
  useApi().get('/email-templates'), {
  transform: res => res.data,
  immediate: true,
})

// get
const subjectRef = useTemplateRef<HTMLInputElement | null>('subjectRef')
const textareaRef = useTemplateRef<typeof QuillEditor | null>('textareaRef')
const textareaFocused = ref(false)

const { focused: subjectFocused } = useFocus(subjectRef)

// Cache last focused field and cursor positions to survive focus loss
const lastFocusedField = ref<'subject' | 'template_html' | null>(null)
const cursorPos = ref({ start: 0, end: 0 })

function cacheSubjectCursor() {
  const el = subjectRef.value
  if (!el)
    return
  const start = (el.selectionStart ?? (values.subject?.length || 0))
  const end = (el.selectionEnd ?? start)
  cursorPos.value = { start, end }
}

function updateSubjectCursorFromEvent(e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target)
    return
  const start = target.selectionStart ?? (values.subject?.length || 0)
  const end = target.selectionEnd ?? start
  cursorPos.value = { start, end }
  lastFocusedField.value = 'subject'
}

function cacheTemplateCursor() {
  // For Quill editor, fallback to insert at end of content
  const len = (values.templateContent || '').length
  cursorPos.value = { start: len, end: len }
}

watch([subjectFocused, textareaFocused], ([s, t]) => {
  if (s) {
    lastFocusedField.value = 'subject'
    cacheSubjectCursor()
  }
  else if (t) {
    lastFocusedField.value = 'template_html'
    cacheTemplateCursor()
  }
})

function _onFromChange() {
  // Placeholder for future use when from field becomes editable
}

// Insert placeholder
function insertPlaceholder(value: any) {
  let el: HTMLInputElement | HTMLTextAreaElement | null = null
  let currentValue = ''
  let modelKey: 'subject' | 'template_html' | null = null

  if (subjectFocused.value || lastFocusedField.value === 'subject') {
    el = subjectRef.value as HTMLInputElement | null
    currentValue = values.subject || ''
    modelKey = 'subject'
  }
  else if (textareaFocused.value || lastFocusedField.value === 'template_html') {
    el = textareaRef.value as HTMLTextAreaElement | null
    textareaRef.value?.insertMergeField(`[[${value}]]`)
  }

  if (!el || !modelKey)
    return

  const start = (modelKey === 'subject' && el && typeof (el as HTMLInputElement).selectionStart === 'number')
    ? (el as HTMLInputElement).selectionStart!
    : cursorPos.value.start
  const end = (modelKey === 'subject' && el && typeof (el as HTMLInputElement).selectionEnd === 'number')
    ? (el as HTMLInputElement).selectionEnd!
    : cursorPos.value.end
  const newText = `[[${value}]]`

  const updatedValue = currentValue.slice(0, start) + newText + currentValue.slice(end)

  setValues({
    ...values,
    [modelKey]: updatedValue,
  })

  // Update cursor AFTER DOM updates
  nextTick(() => {
    const newCursorPos = start + newText.length
    if (modelKey === 'subject' && el) {
      el?.focus()
      el?.setSelectionRange(newCursorPos, newCursorPos)
    }

    // Also update cursor cache in case user adds multiple placeholders
    cursorPos.value = {
      start: newCursorPos,
      end: newCursorPos,
    }
  })
}

// Reactive ref for template content to ensure proper reactivity
const templateContent = ref('')

// Character count for template content - now properly reactive
const templateContentLength = computed(() => {
  // Strip HTML tags for character count
  const textContent = templateContent.value.replace(/<[^>]*>/g, '').trim()
  return textContent.length
})

// Watch templateContent ref and sync with form
watch(templateContent, (newContent) => {
  setFieldValue('templateContent', newContent)
})

// Watch form values.templateContent and sync with ref
watch(() => values.templateContent, (newContent) => {
  const safeContent = newContent ?? ''
  if (safeContent !== templateContent.value) {
    templateContent.value = safeContent
  }
})

// Watch for changes in leadData and update the 'to' field
watch(() => props.leadData, (newLeadData) => {
  if (newLeadData) {
    const leadEmail = getLeadEmail()
    if (leadEmail) {
      setFieldValue('to', leadEmail)
    }
  }
}, { immediate: true, deep: true })

// Check if body exceeds limit
const bodyExceedsLimit = computed(() => templateContentLength.value > MAX_BODY_CHARACTERS)

// Submit handler for sending email
const onSubmit = handleSubmit(async (vals) => {
  // Check character limits
  if (bodyExceedsLimit.value) {
    showToast({
      message: `Email body exceeds ${MAX_BODY_CHARACTERS} characters. Please shorten your message.`,
      type: 'error',
    })
    return
  }

  try {
    const payload = {
      senderType: 'system',
      user_id: user.value?.id,
      campaign_id: campaign_id.value,
      subject: vals.subject,
      body: vals.templateContent,
      to: vals.to,
      lead_id: props.leadData?.lead_id,
    }

    const response = await useApi().post('/send-email/generic', payload)

    if (response?.success !== false) {
      showToast({
        message: response?.message || 'Email sent successfully',
        type: 'success',
      })

      // Clear form after successful send
      setFieldValue('subject', '')
      setFieldValue('templateContent', '')
      setFieldValue('template', undefined)
      templateContent.value = ''
    }
    else {
      showToast({
        message: response?.message || 'Failed to send email',
        type: 'error',
      })
    }
  }
  catch (error: any) {
    const errorMessage = error?.response?.data?.message
      || error?.message
      || 'Failed to send email. Please try again.'
    showToast({
      message: errorMessage,
      type: 'error',
    })
  }
})

function onTextareaFocus() {
  textareaFocused.value = true
  lastFocusedField.value = 'template_html'
}

function onTemplateChange(val: any) {
  const template = emailTemplateData.value.find((item: any) => item.id === val)
  if (template) {
    textareaRef.value?.setHTMLContent(template.template_html)
  }
}
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5] h-full">
    <form class="h-full" @submit.prevent="onSubmit">
      <div class="flex flex-col justify-between gap-6 h-full">
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
                    :class="{ 'bg-gray-50': componentField.modelValue }"
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
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      disabled
                      class="border-gray-200 h-11 bg-gray-50 pr-20"
                      placeholder="System email will be used"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      System
                    </span>
                  </div>
                </FormControl>
                <p class="text-xs text-gray-500">Emails are sent from your organization's system email address</p>
              </FormItem>
            </FormField>
          </div>
          <!-- Template -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="emailTemplateData?.length === 0" @update:model-value="onTemplateChange">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue :placeholder="emailTemplateData?.length === 0 ? 'No templates available' : 'Select template'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="template in emailTemplateData" :key="template?.id" :value="template?.id">
                      {{ template?.template_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-red-500" />
            </FormItem>
          </FormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Lead Placeholders -->
            <FormField v-slot="{ componentField, value }" name="LeadPlaceholders">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Lead Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField" @update:model-value="insertPlaceholder">
                    <SelectTrigger class="w-full px-3 !h-11 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                      <SelectValue placeholder="Select Lead Placeholder" class="justify-start text-slate-800 text-sm font-normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in leadPlaceholders" :key="option.id" type="menu" :value="option.title">
                        {{ option.title }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-red-500" />
              </FormItem>
            </FormField>
            <!-- Sender Placeholders -->
            <FormField v-slot="{ componentField }" name="SenderPlaceholders" @update:model-value="insertPlaceholder">
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
                      <SelectItem v-for="option in senderPlaceholders" :key="option" :value="option">
                        {{ option }}
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
                  ref="subjectRef"
                  placeholder="Enter Mail Subject"
                  v-bind="componentField"
                  class="border-gray-200 h-11"
                  @focus="updateSubjectCursorFromEvent"
                  @input="updateSubjectCursorFromEvent"
                  @keyup="updateSubjectCursorFromEvent"
                  @mouseup="updateSubjectCursorFromEvent"
                  @select="updateSubjectCursorFromEvent"
                />
              </FormControl>
              <FormMessage class="text-red-500" />
            </FormItem>
          </FormField>
          <!-- Message (full width) -->

          <FormField name="templateContent">
            <FormItem>
              <FormLabel>Template Preview</FormLabel>
              <FormControl>
                <BaseQuillEditor
                  ref="textareaRef"
                  v-model="templateContent"
                  class="h-full"
                  content-type="html"
                  @toggle-view="() => showHtml = !showHtml"
                  @focus="onTextareaFocus"
                />
              </FormControl>
              <div class="flex justify-between items-start gap-2">
                <FormMessage class="text-red-500 flex-1" />
                <span class="text-right text-xs select-none whitespace-nowrap"
                  :class="bodyExceedsLimit ? 'text-red-500' : 'text-muted-foreground'"
                >
                  {{ templateContentLength.toLocaleString() }}/{{ MAX_BODY_CHARACTERS.toLocaleString() }} Characters
                </span>
              </div>
              <div v-if="bodyExceedsLimit" class="flex items-center gap-2 p-2 rounded-md text-xs bg-red-50 text-red-700">
                <Icon name="material-symbols:error" size="16" />
                <span>Email body exceeds the maximum character limit. Please shorten your message.</span>
              </div>
            </FormItem>
          </FormField>
          <!-- Optional preview modal -->
          <div v-if="showHtml" class="border rounded p-3 bg-gray-50 whitespace-pre-wrap mt-4">
            {{ templateContent }}
          </div>
        </div>
        <!-- Button section -->
        <div>
          <Button
            type="submit"
            :disabled="isSubmitting || bodyExceedsLimit"
            :loading="isSubmitting"
            class="w-full h-11"
          >
            <Icon name="material-symbols:mail" size="20" />
            Send Email
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
