<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useFocus } from '@vueuse/core'
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

const route = useRoute()

const isEdit = computed(() => route.query.id)

const { data: leadPlaceholders } = await useLazyAsyncData('lead-placeholder-email-template', () =>
  useApi().post('/label'), {
  transform: res => res.data,
})

// Custom placeholders options

const { data: customPlaceholders } = await useLazyAsyncData('custom-field-labels-email-template', () =>
  useApi().get('/custom-field-labels'), {
  transform: res => res.data.data,
})

// Sender placeholders options
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
    let response
    if (props.emailTemplate.id) {
      // update email template
      response = await useApi().post(`/email-template/${props.emailTemplate.id}`, {
        ...values,
      })
    }
    else {
      // create new email template
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

const subject = ref('')
const subjectRef = ref<HTMLInputElement | null>(null)

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const focusState = ref<'subject' | 'template' | null>(null)

function setFocus(field: 'subject' | 'template') {
  focusState.value = field
}

const cursorPos = ref({ start: 0, end: 0 })

function trackCursor(e: Event, field: 'subject' | 'template') {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  focusState.value = field
  cursorPos.value = {
    start: target.selectionStart ?? 0,
    end: target.selectionEnd ?? 0,
  }
}

// Insert placeholder
function insertPlaceholder(value: any) {
  setValues({ customPlaceholder: '', leadPlaceholder: '', senderPlaceholder: '' })
  let el: HTMLInputElement | HTMLTextAreaElement | null = null
  let currentValue = ''
  let modelKey: 'subject' | 'template_html' | null = null

  if (focusState.value === 'subject') {
    el = subjectRef.value
    currentValue = values.subject
    modelKey = 'subject'
  }
  else if (focusState.value === 'template') {
    el = textareaRef.value
    currentValue = values.template_html
    modelKey = 'template_html'
  }

  if (!el || !modelKey)
    return

  const start = cursorPos.value.start
  const end = cursorPos.value.end
  const newText = `[[${value}]]`

  const updatedValue = currentValue.slice(0, start) + newText + currentValue.slice(end)

  setValues({
    ...values,
    [modelKey]: updatedValue,
  })

  // Update cursor AFTER DOM updates
  nextTick(() => {
    const newCursorPos = start + newText.length
    el!.focus()
    el!.setSelectionRange(newCursorPos, newCursorPos)

    // Also update cursor cache in case user adds multiple placeholders
    cursorPos.value = {
      start: newCursorPos,
      end: newCursorPos,
    }
  })
}
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
    <!-- Details Section -->
    <div class="relative bg-white rounded-xl border border-zinc-100 flex flex-col overflow-hidden min-h-[400px] col-span-1 xl:col-span-8">
      <!-- Header -->
      <div class="w-full px-5 py-4 border-b border-zinc-100 flex justify-start items-center">
        <div class="justify-center text-slate-800 mt-1 text-[16px] font-medium">
          Template Details
        </div>
      </div>
      <!-- Form Content -->
      <form class="relative w-full overflow-x-auto flex-1" @submit="onSubmit">
        <div class="min-w-fit w-full flex-1 p-5 flex flex-col justify-start items-start gap-5 pb-28">
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
          <div class="w-full flex flex-col md:flex-row  justify-start items-start gap-4">
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
                      <SelectItem v-for="option in customPlaceholders" :key="option.title" :value="option.title">
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
            <FormField v-slot="{ componentField }" v-model="subject" name="subject" class="flex-1">
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
                    @focus="setFocus('subject')"
                    @click="(e) => trackCursor(e, 'subject')"
                    @keyup="(e) => trackCursor(e, 'subject')"
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
                <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                  Template
                </FormLabel>
                <FormControl>
                  <div class="w-full rounded-md outline outline-offset-[-1px] outline-zinc-200 flex flex-col justify-start items-start overflow-auto">
                    <!-- Text Area -->
                    <div class="w-full h-64 px-4 pt-3 pb-4 relative flex flex-col justify-start items-start overflow-hidden">
                      <Textarea
                        ref="textareaRef"
                        v-bind="componentField"
                        placeholder="Email Template..."
                        class="p-0 h-full border-none shadow-none resize-none text-sm rounded-none font-normal leading-tight placeholder:text-slate-800/50 focus-visible:ring-0"
                        @focus="setFocus('template')"
                        @click="(e) => trackCursor(e, 'template')"
                        @keyup="(e) => trackCursor(e, 'template')"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </form>
      <!-- Fixed Save/Update Button at the bottom of details section (outside form) -->
      <div class=" bottom-0 left-0 w-full p-5 bg-white flex justify-between z-10">
        <Button

          type="submit"
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
    <div class="w-full max-h-[calc(100vh-190px)]  col-span-1 xl:col-span-4">
      <ConfigurationEmailTemplatesAddPreview :template-html="values?.template_html || ''" />
    </div>
  </div>
</template>
