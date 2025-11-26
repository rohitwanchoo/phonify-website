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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const props = defineProps<{
  functionData?: any | null // Single function object for edit
  promptData?: any | null // Prompt object containing id and user_id
  functionActionMode?: string
}>()

const open = defineModel<boolean>('open', { default: false })

// Function types
const functionTypes = [
  { name: 'SMS', value: 'sms' },
  { name: 'Email', value: 'email' },
  { name: 'Call Redirect', value: 'call' },
  { name: 'cURL Request', value: 'curl' },
  { name: 'API / Webhook', value: 'api' },
]

// HTTP Methods for API
const httpMethods = [
  { name: 'GET', value: 'GET' },
  { name: 'POST', value: 'POST' },
  { name: 'PUT', value: 'PUT' },
  { name: 'PATCH', value: 'PATCH' },
  { name: 'DELETE', value: 'DELETE' },
]

// SMS template
const { data: smsTemplateList, status: smsTemplateListStatus, refresh: refreshSmsTemplateList } = await useLazyAsyncData('sms-template', () =>
  useApi().get('/sms-templete'), {
  transform: res => res.data,
  immediate: false,
})

// Email template
const { data: emailTemplateList, status: emailTemplateListStatus, refresh: refreshEmailTemplateList } = await useLazyAsyncData('email-template', () =>
  useApi().get('/email-templates'), {
  transform: res => res.data,
  immediate: false,
})

// Form validation schema with conditional validation
const formSchema = toTypedSchema(
  z.object({
    type: z.string().min(1, 'Type is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    message: z.string().optional(),
    phone: z.string().optional(),
    curl_request: z.string().optional(),
    curl_response: z.string().optional(),
    api_method: z.string().optional(),
    api_url: z.string().optional(),
    api_body: z.string().optional(),
    api_response: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Validate SMS type
    if (data.type === 'sms' && !data.message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['message'],
        message: 'SMS Template is required',
      })
    }

    // Validate Email type
    if (data.type === 'email' && !data.message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['message'],
        message: 'Email Template is required',
      })
    }

    // Validate Call type
    if (data.type === 'call' && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Phone number is required',
      })
    }

    // Validate cURL type
    if (data.type === 'curl') {
      if (!data.curl_request) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['curl_request'],
          message: 'cURL request is required',
        })
      }
      if (!data.curl_response) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['curl_response'],
          message: 'Expected response is required',
        })
      }
    }

    // Validate API type
    if (data.type === 'api') {
      if (!data.api_method) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['api_method'],
          message: 'HTTP method is required',
        })
      }
      if (!data.api_url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['api_url'],
          message: 'API URL is required',
        })
      }
      else if (data.api_url && !/^https?:\/\/.+/.test(data.api_url)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['api_url'],
          message: 'Valid URL is required',
        })
      }

      // Validate request body for non-GET methods
      if (data.api_method && !['GET', 'DELETE'].includes(data.api_method)) {
        // Required but must be valid JSON
        if (!data.api_body) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['api_body'],
            message: 'Request body is required for this method',
          })
        }
        else {
          try {
            JSON.parse(data.api_body)
          }
          catch {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['api_body'],
              message: 'Request body must be valid JSON',
            })
          }
        }
      }

      // Validate API Expected Response (optional)
      if (data.api_response) {
        try {
          JSON.parse(data.api_response)
        }
        catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['api_response'],
            message: 'Expected response must be valid JSON',
          })
        }
      }
    }
  }),
)

const { handleSubmit, values, isSubmitting, errors, resetForm, setValues, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    type: props.functionData?.type ?? '',
    name: props.functionData?.name ?? '',
    description: props.functionData?.description ?? '',
    message: props.functionData?.message ?? '',
    phone: props.functionData?.phone ?? '',
    curl_request: props.functionData?.curl_request ?? '',
    curl_response: props.functionData?.curl_response ?? '',
    api_method: props.functionData?.api_method ?? '',
    api_url: props.functionData?.api_url ?? '',
    api_body: props.functionData?.api_body ?? '',
    api_response: props.functionData?.api_response ?? '',
  },
})

// Watch dialog open/close
watch(() => open.value, (newVal) => {
  if (newVal) {
    if ((props.functionActionMode === 'edit' || props.functionActionMode === 'delete') && props.functionData) {
      // Load templates if needed for edit mode
      if (props.functionData.type === 'sms' && !smsTemplateList.value) {
        refreshSmsTemplateList()
      }
      else if (props.functionData.type === 'email' && !emailTemplateList.value) {
        refreshEmailTemplateList()
      }

      setValues({
        type: props.functionData.type,
        name: props.functionData.name,
        description: props.functionData.description ?? '',
        message: props.functionData.message ?? '',
        phone: props.functionData.phone ?? '',
        curl_request: props.functionData.curl_request ?? '',
        curl_response: props.functionData.curl_response ?? '',
        api_method: props.functionData.api_method ?? '',
        api_url: props.functionData.api_url ?? '',
        api_body: props.functionData.api_body ?? '',
        api_response: props.functionData.api_response ?? '',
      })
    }
  }
  else {
    resetForm()
  }
})

// Load templates when type changes
function onTypeChange(value: any) {
  // Clear fields from previous type
  setValues({
    message: '',
    phone: '',
    curl_request: '',
    curl_response: '',
    api_method: '',
    api_url: '',
    api_body: '',
    api_response: '',
  })

  if (value === 'sms' && !smsTemplateList.value) {
    refreshSmsTemplateList()
  }
  else if (value === 'email' && !emailTemplateList.value) {
    refreshEmailTemplateList()
  }
}

// Auto-generate slug from name
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s\-]+/g, '_') // spaces/dashes → underscore
    .replace(/[^a-z0-9_]/g, '') // only letters, numbers, underscore
}

watch(() => values.name, (newVal) => {
  if (!newVal)
    return
  const slug = slugify(newVal)
  if (slug !== newVal) {
    setFieldValue('name', slug)
  }
})

// Hide/show request body based on HTTP method
watch(() => values.api_method, (method) => {
  if (method === 'GET' || method === 'DELETE') {
    setFieldValue('api_body', '')
  }
})

const onSubmit = handleSubmit(async (values) => {
  const promptId = props.promptData?.prompt?.id
  const userId = props.promptData?.prompt?.user_id

  if (!promptId || !userId) {
    showToast({
      message: 'Prompt data is missing',
      type: 'error',
    })
    return
  }

  // Get all existing functions
  const existingFunctions = props.promptData?.functions || []
  let updatedFunctions = []

  if (props.functionActionMode === 'delete') {
    // Remove the function being deleted and keep all others
    updatedFunctions = existingFunctions.filter((fn: any) => fn.id !== props.functionData?.id)
  }
  else if (props.functionActionMode === 'edit') {
    // Build the updated function object
    const updatedFunction: any = {
      id: props.functionData?.id, // Include the ID for edit
      prompt_id: promptId,
      user_id: userId,
      type: values.type,
      name: values.name,
      description: values.description || null,
      message: null,
      phone: null,
      curl_request: null,
      curl_response: null,
      api_method: null,
      api_url: null,
      api_body: null,
      api_response: null,
    }

    // Add type-specific fields
    switch (values.type) {
      case 'sms':
      case 'email':
        updatedFunction.message = values.message
        break
      case 'call':
        updatedFunction.phone = values.phone
        break
      case 'curl':
        updatedFunction.curl_request = values.curl_request
        updatedFunction.curl_response = values.curl_response
        break
      case 'api':
        updatedFunction.api_method = values.api_method
        updatedFunction.api_url = values.api_url
        updatedFunction.api_body = values.api_body || null
        updatedFunction.api_response = values.api_response || null
        break
    }

    // Replace the edited function and keep all others
    updatedFunctions = existingFunctions.map((fn: any) =>
      fn.id === props.functionData?.id ? updatedFunction : fn,
    )
  }
  else {
    // Add mode - create new function and keep all existing ones
    const newFunction: any = {
      prompt_id: promptId,
      user_id: userId,
      type: values.type,
      name: values.name,
      description: values.description || null,
      message: null,
      phone: null,
      curl_request: null,
      curl_response: null,
      api_method: null,
      api_url: null,
      api_body: null,
      api_response: null,
    }

    // Add type-specific fields
    switch (values.type) {
      case 'sms':
      case 'email':
        newFunction.message = values.message
        break
      case 'call':
        newFunction.phone = values.phone
        break
      case 'curl':
        newFunction.curl_request = values.curl_request
        newFunction.curl_response = values.curl_response
        break
      case 'api':
        newFunction.api_method = values.api_method
        newFunction.api_url = values.api_url
        newFunction.api_body = values.api_body || null
        newFunction.api_response = values.api_response || null
        break
    }

    // Add new function to existing functions
    updatedFunctions = [...existingFunctions, newFunction]
  }

  const payload = {
    functions: updatedFunctions,
  }

  try {
    const response = await useApi().post(`/prompts/${promptId}/functions`, payload)

    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      open.value = false
      refreshNuxtData('prompt-data')
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
      message: error.message,
      type: 'error',
    })
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-[600px] max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-base font-medium">
          {{ props.functionActionMode === 'edit' ? 'Edit' : props.functionActionMode === 'delete' ? 'Delete' : 'Add' }} Function
        </DialogTitle>
      </DialogHeader>
      <Separator />
      {{ errors }}
      <form id="function-form" class="space-y-4" @submit.prevent="onSubmit">
        <!-- Type Select -->
        <FormField v-slot="{ componentField, errorMessage }" name="type">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900 gap-0">
              Type <span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField" @update:model-value="onTypeChange">
                <SelectTrigger
                  :class="errorMessage && 'border-red-600'"
                  class="!h-11 w-full"
                >
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="(item, index) in functionTypes"
                    :key="index"
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
            <FormLabel class="text-xs font-medium text-stone-900 gap-0">
              Name <span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                :class="errorMessage && 'border-red-600'"
                class="h-11"
                placeholder="Enter Name"
              />
            </FormControl>
            <p class="text-xs text-primary/70">
              Only letters, numbers, and underscores allowed. Will be converted to slug automatically.
            </p>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Description (Optional) -->
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900">
              Description
            </FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                class="min-h-20"
                placeholder="Enter description (optional)"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <!-- SMS Template Select -->
        <FormField v-if="values.type === 'sms'" v-slot="{ componentField, errorMessage }" name="message">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900 gap-0">
              Select SMS Template <span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  :class="errorMessage && 'border-red-600'"
                  class="!h-11 w-full"
                >
                  <SelectValue placeholder="Select SMS Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-if="smsTemplateListStatus === 'pending'" :value="null" disabled>
                    <Icon name="eos-icons:loading" />
                  </SelectItem>
                  <template v-else>
                    <SelectItem
                      v-for="(item, index) in smsTemplateList"
                      :key="index"
                      :value="item?.templete_desc"
                    >
                      {{ item.templete_name }}
                    </SelectItem>
                  </template>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Email Template Select -->
        <FormField v-if="values.type === 'email'" v-slot="{ componentField, errorMessage }" name="message">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900 gap-0">
              Select Email Template <span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  :class="errorMessage && 'border-red-600'"
                  class="!h-11 w-full"
                >
                  <SelectValue placeholder="Select Email Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-if="emailTemplateListStatus === 'pending'" :value="null" disabled>
                    <Icon name="eos-icons:loading" />
                  </SelectItem>
                  <template v-else>
                    <SelectItem
                      v-for="(item, index) in emailTemplateList"
                      :key="index"
                      :value="item.template_html"
                    >
                      {{ item.template_name }}
                    </SelectItem>
                  </template>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- Phone number for Call Redirect -->
        <FormField v-if="values.type === 'call'" v-slot="{ componentField, errorMessage }" name="phone">
          <FormItem>
            <FormLabel class="text-xs font-medium text-stone-900 gap-0">
              Phone Number <span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                v-maska="'+1 (###) ###-####'"
                v-bind="componentField"
                :class="errorMessage && 'border-red-600'"
                class="h-11"
                placeholder="Enter Phone number"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <!-- cURL Request -->
        <template v-if="values.type === 'curl'">
          <FormField v-slot="{ componentField, errorMessage }" name="curl_request">
            <FormItem>
              <FormLabel class="text-xs font-medium text-stone-900 gap-0">
                cURL Request <span class="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :class="errorMessage && 'border-red-600'"
                  class="min-h-[120px] text-xs"
                  placeholder="Paste complete cURL request here..."
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="curl_response">
            <FormItem>
              <FormLabel class="text-xs font-medium text-stone-900 gap-0">
                Expected Response <span class="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :class="errorMessage && 'border-red-600'"
                  class="min-h-[120px] text-xs"
                  placeholder="Expected response format..."
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
        </template>

        <!-- API / Webhook -->
        <template v-if="values.type === 'api'">
          <FormField v-slot="{ componentField, errorMessage }" name="api_method">
            <FormItem>
              <FormLabel class="text-xs font-medium text-stone-900 gap-0">
                HTTP Method <span class="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger
                    :class="errorMessage && 'border-red-600'"
                    class="!h-11 w-full"
                  >
                    <SelectValue placeholder="Select HTTP Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="(method, index) in httpMethods"
                      :key="index"
                      :value="method.value"
                    >
                      {{ method.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="api_url">
            <FormItem>
              <FormLabel class="text-xs font-medium text-stone-900 gap-0">
                API URL <span class="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :class="errorMessage && 'border-red-600'"
                  class="h-11"
                  placeholder="https://api.example.com/endpoint"
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField
            v-if="values.api_method && !['GET', 'DELETE'].includes(values.api_method)"
            v-slot="{ componentField, errorMessage }"
            name="api_body"
          >
            <FormItem>
              <FormLabel class="text-xs font-medium text-stone-900 gap-0">
                Request Body (JSON) <span class="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :class="errorMessage && 'border-red-600'"
                  class="min-h-[120px] text-xs"
                  placeholder='{ &quot;key&quot;: &quot;value&quot; }'
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="api_response">
            <FormItem>
              <FormLabel class="text-xs font-medium text-stone-900 justify-between">
                Expected Response (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  class="min-h-[120px] text-xs"
                  :class="errorMessage && 'border-red-600'"
                  placeholder="Expected API response format..."
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
        </template>

        <!-- Action Buttons -->
        <div class="flex justify-start items-center gap-3 pt-2">
          <DialogClose class="w-1/2">
            <Button variant="outline" type="button" class="w-full h-11">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            class="w-1/2 h-11 bg-red-600 hover:bg-red-700"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            <Icon name="material-symbols:save" size="20" />
            {{ functionActionMode === 'delete' ? 'Delete' : 'Save' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
