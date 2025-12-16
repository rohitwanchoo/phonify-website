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
import { Label } from '~/components/ui/label'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.query.id as string)
const isEdit = computed(() => !!id.value)

const senderPlaceholders = ['first_name', 'last_name', 'email', 'mobile', 'company_name']
const templateNameInputRef = ref<any>(null)

const { data: labelsList, status: labelsListStatus } = await useLazyAsyncData('labels', () =>
  useApi().post('/label'), {
  transform: res => res.data,
  immediate: true,
})

const { data: customFieldLabelsList, status: customFieldLabelsListStatus } = await useLazyAsyncData('custom-field-labels', () =>
  useApi().get('/custom-field-labels'), {
  transform: res => res.data,
  immediate: true,
})

// Fetch Data for Edit
const { data: templateData, status: templateDataStatus } = await useLazyAsyncData('sms-template-data', () =>
  useApi().post('/sms-templete', {
    templete_id: id.value,
  }), {
  transform: res => res.data,
  immediate: !!isEdit.value,
})

// Schema
const formSchema = toTypedSchema(z.object({
  templete_name: z.string().min(1, 'Template name is required'),
  templete_desc: z.string().min(1, 'Template content is required'),
}))

const { handleSubmit, values, setValues, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    templete_name: '',
    templete_desc: '',
  },
})

// Populate form when template data is loaded
watch(templateData, (data) => {
  if (data && isEdit.value) {
    setValues({
      templete_name: data[0]?.templete_name || '',
      templete_desc: data[0]?.templete_desc || '',
    })
  }
})

onMounted(() => {
  // Focus the input after DOM is ready
  templateNameInputRef.value?.$el?.focus?.()
})

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

function insertPlaceholder(val: any) {
  const value = String(val)
  if (!value)
    return

  let el: HTMLTextAreaElement | null = null
  let currentValue = ''
  let modelKey: 'templete_desc' | null = null

  // Always target template content if specific focus tracking is tricky or defaulted
  // But strictly we check focusState or fallback to textareaRef if it exists
  if (focusState.value === 'template' || textareaRef.value) {
    el = textareaRef.value
    currentValue = values.templete_desc || ''
    modelKey = 'templete_desc'
  }

  if (!el || !modelKey)
    return

  // If we haven't tracked cursor yet (e.g. user just clicked dropdown without focusing text area), append to end
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

const onSubmit = handleSubmit(async (values) => {
  try {
    let res
    if (isEdit.value) {
      res = await useApi().post('/edit-sms-templete', {
        templete_id: id.value,
        ...values,
      })
    }
    else {
      res = await useApi().post('/add-sms-templete', values)
    }

    if (res?.success === 'true') {
      showToast({
        message: res.message,
        type: 'success',
      })
      router.push('/app/sms/text-template')
    }
    else {
      showToast({
        message: res?.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: error.message,
      type: 'error',
    })
  }
})

const breadcrumbs = computed(() => [
  {
    label: 'SMS Template List',
    href: '/app/sms/text-template',
  },
  {
    label: isEdit.value ? 'Edit SMS Template' : 'Add SMS Template',
    active: true,
  },
])
</script>

<template>
  <BaseHeader :title="isEdit ? 'Edit SMS Template' : 'Add SMS Template'" :breadcrumbs="breadcrumbs" />
  <div class="flex gap-6 mt-6">
    <!-- Left section -->
    <div class="h-[calc(100vh-190px)] w-full relative bg-white rounded-xl border border-zinc-100 flex flex-col overflow-hidden min-h-[400px]">
      <div class="w-full px-5 py-4 border-b border-zinc-100 flex justify-start items-center">
        <div class="text-slate-800 mt-1 text-[16px] font-medium">
          Template Details
        </div>
      </div>
      <form class="w-full flex-1 overflow-x-auto" @submit="onSubmit">
        <div class="p-5 flex flex-col gap-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <!-- Template Name -->
            <FormField v-slot="{ componentField }" name="templete_name" class="flex-1">
              <FormItem class="w-full flex flex-col gap-1">
                <FormLabel class="text-slate-800 text-sm font-medium">
                  Template Name
                </FormLabel>
                <FormControl>
                  <BaseSkelton v-if="templateDataStatus === 'pending'" class="h-11 w-full pb-3 bg-neutral-50 rounded-lg overflow-hidden" rounded="rounded-sm" />
                  <Input
                    v-else
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
            <div class="flex-1 w-full flex flex-col gap-1">
              <Label class="text-slate-800 text-sm font-medium">Labels</Label>
              <!-- Use :model-value="null" to prevent selection sticking if supported, or just let it update -->
              <Select @update:model-value="insertPlaceholder">
                <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-zinc-200">
                  <SelectValue placeholder="Select Labels" class="text-sm text-slate-800" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-if="labelsListStatus === 'pending'" :value="null" disabled>
                    <Icon name="eos-icons:loading" />
                  </SelectItem>
                  <template v-else>
                    <SelectItem v-for="(item, index) in labelsList" :key="index" :value="item.title">
                      {{ item.title }}
                    </SelectItem>
                  </template>
                </SelectContent>
              </Select>
            </div>

            <div class="flex-1 w-full flex flex-col gap-1">
              <Label class="text-slate-800 text-sm font-medium">Sender Details</Label>
              <Select @update:model-value="insertPlaceholder">
                <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-zinc-200">
                  <SelectValue placeholder="Select Sender Details" class="text-sm text-slate-800" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="option in senderPlaceholders" :key="option" :value="option">
                    {{ option }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Custom Placeholders -->
            <div class="flex-1 w-full flex flex-col gap-1">
              <Label class="text-slate-800 text-sm font-medium">Custom Placeholders</Label>
              <Select @update:model-value="insertPlaceholder">
                <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-zinc-200">
                  <SelectValue placeholder="Select Placeholder" class="text-sm text-slate-800" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-if="customFieldLabelsListStatus === 'pending'" :value="null" disabled>
                    <Icon name="eos-icons:loading" />
                  </SelectItem>
                  <template v-else>
                    <SelectItem v-for="(item, index) in customFieldLabelsList.data" :key="index" :value="item.title">
                      {{ item.title }}
                    </SelectItem>
                  </template>
                </SelectContent>
              </Select>
            </div>
          </div>
          <!-- Template -->
          <div>
            <FormField v-slot="{ componentField }" name="templete_desc">
              <FormItem class="w-full flex flex-col gap-1">
                <FormLabel class="text-slate-800 text-sm font-medium">
                  Template
                </FormLabel>
                <FormControl>
                  <BaseSkelton v-if="templateDataStatus === 'pending'" class="h-[100px] md:h-[250px] xl:h-[330px] w-full pb-3 bg-neutral-50 rounded-lg overflow-hidden" rounded="rounded-sm" />
                  <Textarea
                    v-else
                    ref="textareaRef"
                    v-bind="componentField"
                    placeholder="SMS Template..."
                    class="w-full h-[100px] md:h-[250px] xl:h-[330px] text-sm"
                    @focus="setFocus('template')"
                    @click="trackCursor($event, 'template')"
                    @keyup="trackCursor($event, 'template')"
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
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="onSubmit"
        >
          <Icon name="material-symbols:save" class="w-5 h-5 text-white" />
          Save
        </Button>
      </div>
    </div>

    <!-- Right Preview Section -->
    <div class="w-full max-h-[calc(100vh-190px)] max-w-96 min-w-96">
      <SmsTextTemplatePreview :content="values.templete_desc" />
    </div>
  </div>
</template>
