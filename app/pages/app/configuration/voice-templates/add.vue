<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Slider } from '~/components/ui/slider'
import { Textarea } from '~/components/ui/textarea'

const route = useRoute()

const editId = computed(() => route.query.id)

const templete_desc = ref('')

const formSchema = toTypedSchema(z.object({
  language: z.string().min(1, 'Language is required'),
  voice_name: z.string().min(1, 'Voice Name is required'),
  templete_name: z.string().min(1, 'Template Name is required'),
  labels: z.string().optional(),
  senderDetails: z.string().optional(),
  customPlaceholders: z.string().optional(),
  speed: z.array(z.number().min(0.5, 'Min 0.5').max(2, 'Max 2')),
  pitch: z.array(z.number().min(-12, 'Min -12').max(12, 'Max 12')),
  templete_desc: z.string().min(1, 'Template Preview is required'),
}))

const { handleSubmit, resetForm, values, errors, setFieldValue, setValues } = useForm({
  validationSchema: formSchema,
})

const senderPlaceholders = [
  'first_name',
  'last_name',
  'email',
  'mobile',
  'company_name',

]

const loading = ref(false)
const onSubmit = handleSubmit((vals) => {
  loading.value = true

  const payload = { ...vals }
  delete payload.labels
  delete payload.customPlaceholders
  delete payload.senderDetails
  payload.speed = String(vals.speed[0])
  payload.pitch = String(vals.pitch[0])

  useApi().post('add-voice-templete', payload).then((response) => {
    showToast({
      message: response.message,
    })
    navigateTo('/app/configuration/voice-templates')
  }).catch((error) => {
    showToast({
      type: 'error',
      message: error.message,
    })
  }).finally(() => {
    loading.value = false
  })
})
const { data: languages, status: languagesStatus, refresh: languageRefresh } = await useLazyAsyncData(
  'get-google-languages',
  () =>
    useApi().post(`/get-google-languages`, { start: 0, limit: 10 }),
  {
    transform: (res) => {
      const seen = new Set()
      return res.data.filter((item: any) => {
        if (seen.has(item.language_code))
          return false
        seen.add(item.language_code)
        return true
      })
    },
  },
)

const { data: labels, status: labelsStatus } = await useLazyAsyncData('labels-add-voice-template', () =>
  useApi().post('/label'), {
  transform: res => res.data,
})

const { data: customPlaceholders, status: customPlaceholdersStatus } = await useLazyAsyncData('custom-field-labels-voice-template', () =>
  useApi().get('/custom-field-labels'), {
  transform: res => res.data,
})

// Use ref for sliders and sync with form on change
const speed = ref([1])
const pitch = ref([0])
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const cursorPos = ref({ start: 0, end: 0 })

function trackCursor(e: Event) {
  const el = e.target as HTMLTextAreaElement
  cursorPos.value = {
    start: el.selectionStart ?? 0,
    end: el.selectionEnd ?? 0,
  }
}

function insertPlaceholder(value: any) {
  const textarea = textareaRef.value
  if (!textarea)
    return

  // Cache original value to avoid reactive duplication issues
  const currentText = values.templete_desc

  // Use cached cursor position
  const startPos = cursorPos.value.start
  const endPos = cursorPos.value.end
  const newText = ` [[${value}]] `

  const updated
    = currentText?.substring(0, startPos)
      + newText
      + currentText?.substring(endPos)

  setFieldValue('templete_desc', updated)

  const newCursorPos = startPos + newText.length
  nextTick(() => {
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }

    // Update cache for next insert
    cursorPos.value = {
      start: newCursorPos,
      end: newCursorPos,
    }
  })
}

function setEditValues() {
  //  TODO: get voice template with id api is not available
  // useApi().get(`/voice-template/${editId.value}`).then((response) => {
  //   console.log(response)
  // })
}

onMounted(() => {
  if (editId.value)
    setEditValues()
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <div class="flex items-center gap-x-2">
        <BreadcrumbItem>
          <BreadcrumbLink href="/app/configuration/voice-templates" class="font-normal">
            Voice Templates
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            Add Voice Templates
          </BreadcrumbPage>
        </BreadcrumbItem>
      </div>
    </BreadcrumbList>
  </Breadcrumb>
  <BaseHeader title="Add Voice Templates" />

  <form class="w-full relative h-full border border-gray-200 rounded-xl py-4 md:py-6 flex flex-col gap-4 pb-4" @submit.prevent="onSubmit">
    <div class="overflow-y-auto max-h-[88%]">
      <div class="flex items-center justify-between px-4 md:px-6 pb-3">
        <h2 class="text-lg font-semibold text-primary">
          Voice Template details
        </h2>
        <Button class="flex items-center gap-2">
          <Icon name="material-symbols:volume-up" class="text-base" />
          Listen
        </Button>
      </div>
      <Separator />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-6  px-6 pt-4">
        <!-- Language Dropdown -->
        <div class="w-full">
          <FormField v-slot="{ componentField, errorMessage }" name="language">
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11" :class="errorMessage && 'border-red-600'">
                    <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="languagesStatus === 'pending'" class="justify-center" disabled :value="null">
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="item in languages" :key="item.language_code" :value="item.language_code">
                        {{ item.language }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Voice Name Dropdown -->
        <div class="w-full">
          <FormField v-slot="{ componentField, errorMessage }" name="voice_name">
            <FormItem>
              <FormLabel>Voice Name</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11" :class="errorMessage && 'border-red-600'">
                    <SelectValue
                      class="text-sm placeholder:text-[#ef698180]"
                      placeholder="Select voice"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="languagesStatus === 'pending'" class="justify-center" disabled :value="null">
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="voice in languages" :key="voice.voice_name" :value="voice.voice_name">
                        {{ voice.voice_name }} ({{ voice.ssml_gender }})
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Template Name -->
        <div>
          <FormField v-slot="{ componentField }" name="templete_name">
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter template name"
                  class="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Labels -->
        <div>
          <FormField v-slot="{ componentField }" name="labels">
            <FormItem>
              <FormLabel>Labels</FormLabel>
              <FormControl>
                <Select v-bind="componentField" @update:model-value="insertPlaceholder">
                  <SelectTrigger class="w-full px-3 !h-11 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                    <SelectValue placeholder="Select Placeholder" class="justify-start text-slate-800 text-sm font-normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="labelsStatus === 'pending'" class="justify-center" disabled :value="null">
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in labels" :key="option.id" :value="option.title">
                        {{ option.title }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Sender Details -->
        <div>
          <FormField v-slot="{ componentField }" name="senderDetails" class="flex-1">
            <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
              <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                Sender Details
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField" @update:model-value="insertPlaceholder">
                  <SelectTrigger class="w-full px-3 py-2 !h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                    <SelectValue placeholder="Select Placeholder" class="justify-start text-slate-800 text-sm font-normal" />
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
        </div>
        <!-- Custom Placeholders -->
        <div>
          <FormField v-slot="{ componentField }" name="customPlaceholders" class="flex-1">
            <FormItem class="w-full flex flex-col justify-start items-start gap-1">
              <FormLabel class="justify-start text-slate-800 text-sm font-medium">
                Custom Placeholders
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField" @update:model-value="insertPlaceholder">
                  <SelectTrigger class="w-full px-3 !h-11 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                    <SelectValue placeholder="Select Placeholder" class="justify-start text-slate-800 text-sm font-normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="customPlaceholdersStatus === 'pending'" class="justify-center" disabled :value="null">
                      <Icon name="eos-icons:loading" />
                    </SelectItem>

                    <template v-else>
                      <SelectItem v-for="option in customPlaceholders" :key="option.title" :value="option.title">
                        {{ option.title }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Speed Slider -->

        <FormField v-slot="{ componentField }" v-model="speed" name="speed">
          <FormItem>
            <FormLabel class="flex justify-between">
              <div>
                Speed
              </div>

              <div class="text-sm font-light">
                Value: x {{ (Array.isArray(speed) && speed[0] !== undefined ? speed[0] : 1).toFixed(2) }}
              </div>
            </FormLabel>
            <FormControl
              class="[&_[data-slot=slider-range]]:bg-[#00A086]
            [&_[data-slot=slider-thumb]]:bg-[#162D3A]
            [&_[data-slot=slider-thumb]]:border-[#162D3A]"
            >
              <Slider
                :model-value="componentField.modelValue"
                :min="0.5"
                :max="2"
                :step="0.01"
                :name="componentField.name"
                :default-value="[0.25]"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Pitch Slider -->

        <FormField v-slot="{ componentField }" v-model="pitch" name="pitch">
          <FormItem>
            <FormLabel class="flex justify-between">
              <div>
                Pitch
              </div>
              <div class="text-sm font-light">
                Value: {{ Array.isArray(pitch) ? pitch[0] : pitch }}
              </div>
            </FormLabel>
            <FormControl
              class="[&_[data-slot=slider-range]]:bg-[#00A086]
              [&_[data-slot=slider-thumb]]:bg-[#162D3A]
              [&_[data-slot=slider-thumb]]:border-[#162D3A]"
            >
              <Slider
                :model-value="componentField.modelValue"
                :min="-12"
                :max="12"
                :step="1"
                :name="componentField.name"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <!-- Template Preview -->
      <div class="flex flex-col gap-2 mt-4 relative px-6">
        <FormField v-slot="{ componentField }" v-model="templete_desc" name="templete_desc">
          <FormItem>
            <FormLabel>Template Preview</FormLabel>
            <FormControl>
              <Textarea
                ref="textareaRef"
                v-bind="componentField"
                placeholder="Preview your template here..."
                rows="4"
                maxlength="200"
                class="xl:h-[130px] h-[50px] max-h-[190px]"
                @focus="trackCursor"
                @click="trackCursor"
                @keyup="trackCursor"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="text-xs text-muted-foreground select-none text-right mt-1">
          {{ values.templete_desc?.length || 0 }}/200 Characters
        </div>
      </div>
    </div>
    <!-- Submit Button (sticky to bottom of form div) -->
    <div class="absolute rounded-b-xl  bottom-0 left-0 w-full flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] bg-white border-t border-gray-200 p-7 z-10">
      <Button type="submit" :loading class="bg-[#162D3A] w-full py-6 text-md text-white flex items-center gap-2 hover:bg-[#162D3A] hover:text-white" @click="onSubmit">
        <Icon name="material-symbols:save" />
        Submit
      </Button>
    </div>
  </form>
</template>
