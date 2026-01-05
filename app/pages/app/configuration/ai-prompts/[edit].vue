<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import * as z from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

// Dialog state for Add Function
const addFunctionDialogOpen = ref(false)
const functionActionMode = ref<'add' | 'edit' | 'delete'>()
const functionData = ref()

// Show HTML toggle
const showHtml = ref(false)

const route = useRoute()
const router = useRouter()

const speechEngine = ref(null)

function onListen() {
  (speechEngine.value as any)?.play()
}

// Fetch prompt data if in edit mode
const promptId = computed(() => route.query.id as string)
const isEditMode = computed(() => promptId.value && route.params.edit === 'edit')

const { data: promptData, status: promptDataStatus } = await useLazyAsyncData('prompt-data', () =>
  useApi().get(`/prompts/${promptId.value}`), {
  transform: res => res.data,
  immediate: !!isEditMode.value,
})

const { data: voiceData, status: voiceStatus } = await useLazyAsyncData('voice-data', () =>
  useApi().get('/prompt-voices'), {
  transform: res => res.data,
})

const { data: leadPlaceholderOptions, status: leadPlaceholderStatus } = await useLazyAsyncData('lead-placeholder', () =>
  useApi().post('/label'), {
  transform: res => res.data,
  immediate: true,
})

const breadcrumbs = [
  {
    label: 'Manage Prompts',
    href: '/app/configuration/ai-prompts',
  },
  {
    label: !isEditMode.value ? 'Add New Prompt' : 'Edit Prompt Details',
    active: true,
  },
]

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Title is required'),
    voice_name: z.string().min(1, 'Voice selection is required'),
    initial_greeting: z.string().min(1, 'Initial greeting is required'),
    lead_placeholder: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
  }),
)

const { handleSubmit, values, isSubmitting, setValues, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    voice_name: '',
    initial_greeting: '',
    lead_placeholder: '',
    description: '',
  },
})

// Populate form when prompt data is loaded
watch(promptData, (data) => {
  if (data && isEditMode.value) {
    setValues({
      title: data?.prompt?.title || '',
      voice_name: data?.prompt?.voice_name || '',
      initial_greeting: data?.prompt?.initial_greeting || '',
      description: data?.prompt?.description || '',
    })
  }
})

// Reactive ref for description content to ensure proper reactivity
const description = ref('')

// Character count for description - now properly reactive
const descriptionLength = computed(() => {
  // Strip HTML tags for character count
  const textContent = description.value.replace(/<[^>]*>/g, '').trim()
  return textContent.length
})

// Watch description ref and sync with form
watch(description, (newContent) => {
  setFieldValue('description', newContent)
})

// Watch form values.description and sync with ref
watch(() => values.description, (newContent) => {
  if (newContent !== description.value) {
    description.value = newContent ?? ''
  }
})

// Function to insert placeholder into description
function insertPlaceholder(placeholder: string) {
  const currentDescription = description.value || ''
  const newDescription = `${currentDescription}{{${placeholder}}} `
  description.value = newDescription
  setFieldValue('description', newDescription)
}

function updatePlaceholder(newVal: any) {
  insertPlaceholder(newVal)
  // Reset the select after inserting
  setFieldValue('lead_placeholder', '')
}

function addFunction() {
  functionActionMode.value = 'add'
  addFunctionDialogOpen.value = true
  functionData.value = promptData.value?.functions
}

function editFuction(data: any) {
  functionActionMode.value = 'edit'
  addFunctionDialogOpen.value = true
  functionData.value = data
}

function deleteFuction(data: any) {
  functionActionMode.value = 'delete'
  addFunctionDialogOpen.value = true
  functionData.value = data
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload = {
      title: values?.title,
      description: values?.description,
      initial_greeting: values?.initial_greeting,
      voice_name: values?.voice_name,
    }

    let response
    if (isEditMode.value) {
      response = await useApi().post(`/prompts/update/${promptId.value}`, payload)
    }
    else {
      response = await useApi().post('/prompts', payload)
    }

    // Simulate success
    if (response?.success === true) {
      showToast({
        message: response?.message,
        type: 'success',
      })
      router.push('/app/configuration/ai-prompts')
    }
    else {
      showToast({
        message: response?.message,
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
  <BaseHeader :title="!isEditMode ? 'Add New Prompt' : 'Edit Prompt Details'" :breadcrumbs="breadcrumbs">
    <template v-if="isEditMode" #actions>
      <Button
        variant="destructive"
        class="h-11"
        @click="addFunction"
      >
        <Icon class="!text-white text-xl" name="material-symbols:add" />
        Add Function
      </Button>
    </template>
  </BaseHeader>

  <div class="relative h-[calc(100vh-190px)] overflow-y-auto mt-6">
    <form class="space-y-4 h-full" @submit.prevent="onSubmit">
      <div class="h-full rounded-xl bg-neutral-50 space-y-2.5">
        <div class="space-y-4 p-3 bg-gray-50 rounded-xl">
          <div class="bg-white rounded-xl border border-zinc-100">
            <div class="w-full bg-white border-b border-zinc-100 rounded-t-xl px-5 py-5 flex items-center justify-between">
              <h5 class="text-lg font-medium text-primary/100">
                Prompt Details
              </h5>
              <BaseSpeechEngine
                ref="speechEngine"
                :text="values.initial_greeting ?? ''"
                :voice="values.voice_name ?? ''"
              >
                <Button
                  type="button"
                  class="h-9"
                  :disabled="!values.voice_name || !values.initial_greeting"
                  @click="onListen"
                >
                  <Icon name="material-symbols:volume-up" class="text-base" />
                  Listen
                </Button>
              </BaseSpeechEngine>
            </div>

            <div class="p-5 w-full space-y-5">
              <div class="grid grid-cols-2 gap-5 items-start">
                <!-- Title -->
                <FormField v-slot="{ componentField, errorMessage }" name="title">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Title
                    </FormLabel>
                    <FormControl>
                      <div v-if="promptDataStatus === 'pending'">
                        <BaseSkelton class="w-full !h-11" rounded="rounded-sm" />
                      </div>
                      <Input
                        v-else
                        v-bind="componentField"
                        placeholder="Enter Title Name"
                        :class="errorMessage && 'border-red-600'"
                        class="w-full !h-11"
                      />
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>

                <!-- Voice -->
                <FormField v-slot="{ componentField, errorMessage }" name="voice_name">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Voice
                    </FormLabel>
                    <FormControl>
                      <div v-if="promptDataStatus === 'pending'">
                        <BaseSkelton class="w-full !h-11" rounded="rounded-sm" />
                      </div>
                      <Select v-else v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue placeholder="Select Voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-if="voiceStatus === 'pending'" :value="null">
                            <Icon name="eos-icons:loading" />
                          </SelectItem>
                          <template v-else>
                            <SelectItem v-for="(item, index) in voiceData" :key="index" :value="item.value">
                              {{ item.label }}
                            </SelectItem>
                          </template>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>

              <!-- Initial Greeting -->
              <FormField v-slot="{ componentField, errorMessage }" name="initial_greeting" class="col-span-2">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Initial Greeting
                  </FormLabel>
                  <FormControl>
                    <div v-if="promptDataStatus === 'pending'">
                      <BaseSkelton class="w-full h-25" rounded="rounded-sm" />
                    </div>
                    <Textarea
                      v-else
                      v-bind="componentField"
                      placeholder="Enter Greeting"
                      :class="errorMessage && 'border-red-600'"
                      class="w-full min-h-25 resize-none"
                      rows="4"
                    />
                  </FormControl>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>

              <!-- Lead Placeholders -->
              <FormField v-slot="{ componentField }" name="lead_placeholder" class="col-span-2">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Lead Placeholders
                  </FormLabel>
                  <FormControl>
                    <div v-if="promptDataStatus === 'pending'">
                      <BaseSkelton class="w-full h-11" rounded="rounded-sm" />
                    </div>
                    <Select v-else v-bind="componentField" @update:model-value="updatePlaceholder">
                      <SelectTrigger class="w-full !h-11">
                        <SelectValue placeholder="Select to Insert" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-if="leadPlaceholderStatus === 'pending'" :value="null">
                          <Icon name="eos-icons:loading" />
                        </SelectItem>
                        <template v-else>
                          <SelectItem v-for="item in leadPlaceholderOptions" :key="item.id" :value="item.title">
                            {{ item?.title }}
                          </SelectItem>
                        </template>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              </FormField>

              <!-- Description with Text Editor -->
              <FormField name="description" class="col-span-2">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Description
                  </FormLabel>
                  <FormControl>
                    <div v-if="promptDataStatus === 'pending'">
                      <BaseSkelton class="w-full h-25" rounded="rounded-sm" />
                    </div>
                    <BaseQuillEditor
                      v-else
                      v-model="description"
                      content-type="html"
                      @toggle-view="() => showHtml = !showHtml"
                    />
                  </FormControl>
                  <div class="flex justify-between">
                    <FormMessage class="text-red-500 w-70" />
                    <span class="w-full text-right text-xs text-muted-foreground select-none">
                      {{ descriptionLength }}/500 Characters
                    </span>
                  </div>
                </FormItem>
              </FormField>

              <!-- Optional preview modal -->
              <div v-if="showHtml" class="border rounded p-3 bg-gray-50 whitespace-pre-wrap">
                {{ description }}
              </div>
            </div>
          </div>

          <div v-if="promptData?.functions.length" class="bg-white rounded-xl border border-zinc-100">
            <div class="px-5 py-3 border-b border-zinc-100">
              <h5 class="text-stone-900 text-base font-medium">
                Functions
              </h5>
              <p class="text-zinc-600 text-xs">
                Add or update functions for this prompt. Each function must have a type and a name.
              </p>
            </div>
            <div class="p-5">
              <div v-if="promptDataStatus === 'pending'" class="space-y-3">
                <BaseSkelton v-for="i in 3" :key="i" class="h-20 w-full pb-3 bg-neutral-50 rounded-lg overflow-hidden" rounded="rounded-sm" />
              </div>
              <div v-else class="space-y-5">
                <div v-for="(item, index) in promptData?.functions" :key="index" class="pb-3 bg-neutral-50 rounded-lg space-y-3 overflow-hidden">
                  <div class="w-full px-5 py-3 bg-zinc-100 flex justify-between items-center">
                    <h6 class="text-stone-900 text-sm">
                      Functions No. {{ String(index + 1).padStart(2, '0') }}
                    </h6>
                    <div class="flex justify-start items-center gap-3">
                      <Button variant="ghost" size="icon" type="button" class="h-fit w-fit" @click="editFuction(item)">
                        <Icon name="material-symbols:edit" size="16" class="text-black" />
                      </Button>
                      <Button variant="ghost" size="icon" type="button" class="h-fit w-fit" @click="deleteFuction(item)">
                        <Icon name="material-symbols:delete" size="16" class="text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <div class="h-10 px-5 flex justify-start items-center gap-10">
                    <div class="min-w-20 flex flex-col justify-start items-start gap-2">
                      <Label class="justify-start text-zinc-500 text-xs font-normal">
                        Type:
                      </Label>
                      <p class="justify-center text-stone-900 text-sm font-normal uppercase">
                        {{ item?.type }}
                      </p>
                    </div>
                    <div class="w-px bg-zinc-200 h-full" />
                    <div class="flex flex-col justify-start items-start gap-2">
                      <Label class="justify-start text-zinc-500 text-xs font-normal">
                        Name:
                      </Label>
                      <p class="justify-center text-stone-900 text-sm font-normal">
                        {{ item?.name }}
                      </p>
                    </div>
                    <div class="w-px h-full bg-zinc-200" />
                    <div class="flex flex-col justify-start items-start gap-2">
                      <div class="justify-start text-zinc-500 text-xs font-normal">
                        {{ item?.type === 'call' ? 'Number:' : 'Template:' }}
                      </div>
                      <div class="justify-center text-stone-900 text-sm font-normal">
                        {{ item?.type === 'call' ? formatNumber(item?.phone) : item?.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="sticky bottom-0 right-0 w-full bg-white p-5 rounded-b-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]">
          <Button
            class="w-full h-12 bg-red-600 hover:bg-red-500"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </div>
    </form>
  </div>

  <!-- Add Function Dialog -->
  <ConfigurationAiPromptsAddOrEditFunction v-model:open="addFunctionDialogOpen" :function-action-mode="functionActionMode" :function-data="functionData" :prompt-data="promptData" />
</template>
