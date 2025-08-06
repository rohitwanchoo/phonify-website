<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { nextTick, onMounted, ref } from 'vue'
import { z } from 'zod'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'

// Dummy options
const labelOptions = ['Transactional', 'Welcome', 'Promotion']
const customPlaceholderOptions = ['company_name', 'appointment_date']
const senderPlaceholders = ['first_name', 'last_name', 'email', 'mobile', 'company_name']
const templateNameInputRef = ref<any>(null)

onMounted(() => {
  // Focus the input after DOM is ready
  templateNameInputRef.value?.$el?.focus?.()
})
// Schema
const formSchema = toTypedSchema(z.object({
  template_name: z.string().min(1, 'Template name is required'),
  leadPlaceholder: z.string().min(1, 'Label is required'),
  senderPlaceholder: z.string().min(1, 'Sender detail is required'),
  customPlaceholder: z.string().min(1, 'Custom placeholder is required'),

  template_html: z.string().min(1, 'Template content is required'),
}))

const { handleSubmit, values, setValues, setFieldError, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    template_name: '',
    leadPlaceholder: '',
    senderPlaceholder: '',
    customPlaceholder: '',
    template_html: '',
  },
})

const loading = ref(false)
const focusState = ref<'template' | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const cursorPos = ref({ start: 0, end: 0 })

function setFocus(field: 'template') {
  focusState.value = field
}

function trackCursor(e: Event, field: 'template') {
  const target = e.target as HTMLTextAreaElement
  focusState.value = field
  cursorPos.value = {
    start: target.selectionStart ?? 0,
    end: target.selectionEnd ?? 0,
  }
}

function insertPlaceholder(value: string) {
  setValues({
    customPlaceholder: '',
    leadPlaceholder: '',
    senderPlaceholder: '',
  })

  let el: HTMLTextAreaElement | null = null
  let currentValue = ''
  let modelKey: 'template_html' | null = null

  if (focusState.value === 'template') {
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

  nextTick(() => {
    if (el && 'focus' in el && typeof el.focus === 'function') {
      const newCursorPos = start + newText.length
      el.focus()
      el.setSelectionRange(newCursorPos, newCursorPos)
      cursorPos.value = { start: newCursorPos, end: newCursorPos }
    }
  })
}

const onSubmit = handleSubmit(() => {
  console.log('Form submitted successfully!')
})
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 ">
    <!-- Left section -->
    <div class="h-[calc(102vh-200px)] relative bg-white rounded-xl border border-zinc-100 flex flex-col overflow-hidden min-h-[400px] col-span-1 xl:col-span-8">
      <div class="w-full px-5 py-4 border-b border-zinc-100 flex justify-start items-center">
        <div class="text-slate-800 mt-1 text-[16px] font-medium">
          Template Details
        </div>
      </div>

      <form class="w-full flex-1 overflow-x-auto" @submit="onSubmit">
        <div class="p-5 flex flex-col gap-5 ">
          <!-- Row 1 -->
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Template Name -->
            <FormField v-slot="{ componentField }" name="template_name" class="flex-1">
              <FormItem class="w-full flex flex-col gap-1">
                <FormLabel class="text-slate-800 text-sm font-medium">
                  Template Name
                </FormLabel>
                <FormControl>
                  <Input
                    ref="templateNameInputRef"
                    v-bind="componentField"
                    placeholder="Enter Template Name"
                    class="px-3 py-2 h-11 bg-white rounded-lg outline outline-zinc-200 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Labels -->
            <FormField v-slot="{ componentField }" name="leadPlaceholder" class="flex-1">
              <FormItem class="w-full flex flex-col gap-1">
                <FormLabel class="text-slate-800 text-sm font-medium">
                  Labels
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-zinc-200">
                      <SelectValue placeholder="Select Labels" class="text-sm text-slate-800" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in labelOptions" :key="option" :value="option">
                        {{ option }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Row 2 -->
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Sender Details -->
            <FormField v-slot="{ componentField }" name="senderPlaceholder" class="flex-1">
              <FormItem class="w-full flex flex-col gap-1">
                <FormLabel class="text-slate-800 text-sm font-medium">
                  Sender Details
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-zinc-200">
                      <SelectValue placeholder="Select Sender Details" class="text-sm text-slate-800" />
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

            <!-- Custom Placeholders -->
            <FormField v-slot="{ componentField }" name="customPlaceholder" class="flex-1">
              <FormItem class="w-full flex flex-col gap-1">
                <FormLabel class="text-slate-800 text-sm font-medium">
                  Custom Placeholders
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-zinc-200">
                      <SelectValue placeholder="Select Placeholder" class="text-sm text-slate-800" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in customPlaceholderOptions" :key="option" :value="option">
                        {{ option }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Template -->
          <div>
            <FormField v-slot="{ componentField }" name="template_html">
              <FormItem class="w-full flex flex-col gap-1">
                <FormLabel class="text-slate-800 text-sm font-medium">
                  Template
                </FormLabel>
                <FormControl>
                  <Textarea
                    ref="textareaRef"
                    v-bind="componentField"
                    placeholder="SMS Template..."
                    class="w-full  h-[100px] md:h-[250px] xl:h-[330px] text-sm"
                    @focus="setFocus('template')"
                    @click="(e) => trackCursor(e, 'template')"
                    @keyup="(e) => trackCursor(e, 'template')"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </form>

      <!-- Save Button -->
      <div
        class="bottom-0 left-0 w-full p-5 bg-white flex justify-between z-10
            shadow-[0_-6px_12px_-4px_rgba(0,0,0,0.15)]"
      >
        <Button
          type="submit"
          class="flex-1 h-12"
          :loading="loading"
          :disabled="loading"
          @click="onSubmit"
        >
          <Icon name="material-symbols:save" class="w-5 h-5 text-white" />
          Save
        </Button>
      </div>
    </div>

    <!-- Right Preview Section -->
    <div class="w-full max-h-[calc(100vh-190px)] col-span-1 xl:col-span-4">
      <SmsTextTemplatePreview :content="values.template_html" />
    </div>
  </div>
</template>
