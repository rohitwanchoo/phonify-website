<script setup lang="ts">
import type { QuillEditor } from '@vueup/vue-quill'
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const route = useRoute()

const isEdit = computed(() => route.query.id)

const showHtml = ref(false)

const { data: leadPlaceholders } = await useLazyAsyncData('lead-placeholder-email-template', () =>
  useApi().post('/label'), {
  transform: res => res.data,
})

const { data: customPlaceholders } = await useLazyAsyncData('custom-field-labels-email-template', () =>
  useApi().get('/custom-field-labels'), {
  transform: res => res.data,
})

const senderPlaceholders = [
  'first_name',
  'last_name',
  'email',
  'mobile',
  'company_name',
]

const formSchema = toTypedSchema(z.object({
  template_name: z.string().min(1, 'Template name is required'),
  leadPlaceholder: z.string().optional(),
  senderPlaceholder: z.string().optional(),
  customPlaceholder: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  template_html: z.string().min(1, 'Template content is required'),
}))

const { handleSubmit, resetForm, values, setFieldError, setValues, setFieldValue } = useForm({
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

// Reactive ref for template content
const templateContent = ref('')

// Character count for template content
const templateContentLength = computed(() => {
  const textContent = templateContent.value.replace(/<[^>]*>/g, '').trim()
  return textContent.length
})

const subjectRef = useTemplateRef<HTMLInputElement | null>('subjectRef')
const textareaRef = useTemplateRef<typeof QuillEditor | null>('textareaRef')
const textareaFocused = ref(false)
const { focused: subjectFocused } = useFocus(subjectRef)

// Cache last focused field and cursor positions
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
  const len = (values.template_html || '').length
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

// Sync templateContent ref with form
watch(templateContent, (newContent) => {
  setFieldValue('template_html', newContent)
})

// Sync form values with ref
watch(() => values.template_html, (newContent) => {
  const safeContent = newContent ?? ''
  if (safeContent !== templateContent.value) {
    templateContent.value = safeContent
  }
})

// Watch for changes in emailTemplate prop and update form values
watch(() => props.emailTemplate, (newTemplate) => {
  if (newTemplate && Object.keys(newTemplate).length > 0) {
    const htmlContent = newTemplate.template_html || ''
    setValues({
      template_name: newTemplate.template_name || '',
      leadPlaceholder: '',
      senderPlaceholder: '',
      customPlaceholder: '',
      subject: newTemplate.subject || '',
      template_html: htmlContent,
    })
    templateContent.value = htmlContent
  }
}, { immediate: true, deep: true })

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    let response
    if (props.emailTemplate.id) {
      response = await useApi().post(`/email-template/${props.emailTemplate.id}`, {
        ...values,
      })
    }
    else {
      response = await useApi().put('/email-template', {
        ...values,
        status: 1,
      })
    }

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
    handleFieldErrors(error?.data, (field: string, message: string | string[] | undefined) => {
      setFieldError(field as any, message)
    })
    showToast({
      message: `${error?.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})

// Insert placeholder function - matching first code's logic
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
    // For Quill editor, use the insertMergeField method
    textareaRef.value?.insertMergeField(`{{${value}}}`)
    return
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
      el.focus()
      el.setSelectionRange(newCursorPos, newCursorPos)
    }

    // Also update cursor cache in case user adds multiple placeholders
    cursorPos.value = {
      start: newCursorPos,
      end: newCursorPos,
    }
  })
}

function onTextareaFocus() {
  textareaFocused.value = true
  lastFocusedField.value = 'template_html'
}
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
    <!-- Details Section -->
    <div class="relative max-h-[calc(100vh-190px)] bg-white rounded-xl border border-zinc-100 flex flex-col overflow-hidden min-h-[400px] col-span-1 xl:col-span-8">
      <!-- Header -->
      <div class="w-full px-5 py-4 border-b border-zinc-100 flex justify-start items-center">
        <div class="justify-center text-slate-800 mt-1 text-[16px] font-medium">
          Template Details
        </div>
      </div>

      <!-- Form Content -->
      <form class="relative w-full overflow-x-auto flex-1" @submit="onSubmit">
        <div class="min-w-fit w-full flex-1 p-5 flex flex-col justify-start items-start gap-5">
          <!-- Template Name and Lead Placeholders Row -->
          <div class="w-full flex flex-col md:flex-row justify-start items-start gap-4">
            <FormField v-slot="{ componentField }" name="template_name" class="flex-1 w-full">
              <FormItem class="w-full flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                  Template Name
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter Template Name"
                    class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-sm font-normal placeholder:text-sm placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="leadPlaceholder" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                  Lead Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField" @update:model-value="insertPlaceholder">
                    <SelectTrigger class="w-full px-3 !h-11 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                      <SelectValue placeholder="Select Lead Placeholder" class="justify-start text-slate-800 text-sm font-normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in leadPlaceholders" :key="option.id" :value="option.title">
                        {{ option.title }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Sender and Custom Placeholders Row -->
          <div class="w-full flex flex-col md:flex-row justify-start items-start gap-4">
            <FormField v-slot="{ componentField }" name="senderPlaceholder" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                  Sender Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField" @update:model-value="insertPlaceholder">
                    <SelectTrigger class="w-full px-3 py-2 !h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                      <SelectValue placeholder="Select Sender Placeholder" class="justify-start text-slate-800 text-sm font-normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in senderPlaceholders" :key="option" :value="option">
                        {{ option }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="customPlaceholder" class="flex-1">
              <FormItem class="w-full flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                  Custom Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField" @update:model-value="insertPlaceholder">
                    <SelectTrigger class="w-full px-3 !h-11 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                      <SelectValue placeholder="Select Custom Placeholder" class="justify-start text-slate-800 text-sm font-normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in customPlaceholders?.data" :key="option.title" :value="option.title">
                        {{ option.title }}
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
                <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    ref="subjectRef"
                    v-bind="componentField"
                    placeholder="Enter Email Subject"
                    class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-sm font-normal placeholder:text-sm placeholder:text-slate-800/50"
                    @focus="updateSubjectCursorFromEvent"
                    @input="updateSubjectCursorFromEvent"
                    @keyup="updateSubjectCursorFromEvent"
                    @mouseup="updateSubjectCursorFromEvent"
                    @select="updateSubjectCursorFromEvent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Template Editor Row with Quill -->
          <div class="w-full flex justify-start items-start gap-4">
            <FormField name="template_html" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                  Template
                </FormLabel>
                <FormControl>
                  <BaseQuillEditor
                    ref="textareaRef"
                    v-model="templateContent"
                    content-type="html"
                    @toggle-view="() => showHtml = !showHtml"
                    @focus="onTextareaFocus"
                  />
                </FormControl>
                <div class="flex justify-between w-full">
                  <FormMessage class="text-red-500 w-fit" />
                  <span class="w-fit text-right text-xs text-muted-foreground select-none ml-auto">
                    {{ templateContentLength }}/500 Characters
                  </span>
                </div>
              </FormItem>
            </FormField>
          </div>

          <!-- Optional HTML Preview -->
          <div v-if="showHtml" class="w-full border rounded p-3 bg-gray-50 whitespace-pre-wrap">
            {{ templateContent }}
          </div>
        </div>
      </form>

      <!-- Fixed Save/Update Button -->
      <div class="bottom-0 left-0 w-full p-5 bg-white flex justify-between border-t border-zinc-100 z-10 shadow-2xl">
        <Button
          type="submit"
          variant="destructive"
          class="flex-1 h-11"
          :loading="loading"
          :disabled="loading"
          @click="onSubmit"
        >
          <Icon name="material-symbols:save" class="w-5 h-5 text-white" />
          {{ !isEdit ? 'Save' : 'Update' }}
        </Button>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="w-full max-h-[calc(100vh-190px)] col-span-1 xl:col-span-4">
      <ConfigurationEmailTemplatesAddPreview :template-html="values?.template_html || ''" />
    </div>
  </div>
</template>
