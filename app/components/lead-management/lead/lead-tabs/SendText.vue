<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import moment from 'moment'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'

const props = defineProps({
  leadData: Object,
})

const route = useRoute()

const { } = useAuth

// Extension data management with pagination
const extensionData = ref([])
const extensionStart = ref(0)
const extensionLimit = ref(10)
const isLoadingMoreExtensions = ref(false)
const hasMoreExtensions = ref(true)
const extensionStatus = ref('idle')

// Initial extension load
async function loadExtensions(reset = false) {
  try {
    if (reset) {
      extensionStart.value = 0
      extensionData.value = []
      hasMoreExtensions.value = true
    }

    extensionStatus.value = 'pending'

    const response = await useApi().post('/extension-list', {
      start: extensionStart.value,
      limit: extensionLimit.value,
    })

    if (response.data) {
      const newExtensions = Array.isArray(response.data) ? response.data : []

      if (reset) {
        extensionData.value = newExtensions
      }
      else {
        extensionData.value = [...extensionData.value, ...newExtensions]
      }

      // Check if there are more items to load
      hasMoreExtensions.value = newExtensions.length === extensionLimit.value
      extensionStart.value += extensionLimit.value
    }

    extensionStatus.value = 'success'
  }
  catch (error) {
    console.error('Error loading extensions:', error)
    extensionStatus.value = 'error'
  }
  finally {
    isLoadingMoreExtensions.value = false
  }
}

// Load more extensions when scrolling
async function loadMoreExtensions() {
  if (isLoadingMoreExtensions.value || !hasMoreExtensions.value) {
    return
  }

  isLoadingMoreExtensions.value = true
  await loadExtensions(false)
}

// Handle scroll event in select dropdown
function handleExtensionScroll(event: Event) {
  const target = event.target as HTMLElement
  const threshold = 10 // pixels from bottom

  if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
    loadMoreExtensions()
  }
}

// Load initial extensions
await loadExtensions(true)

// Selected country code (defaults to +1)
const phoneCountryCode = ref(1)

const leadPhoneNumber = computed(() => {
  if (!props?.leadData)
    return ''

  const leadDataValues = Object.values(props.leadData)
  const dialingItem = leadDataValues.find((item: any) => item.is_dialing === 1)

  if (dialingItem?.value) {
    let phoneNumber = dialingItem.value.toString()
    // Remove +1- prefix if present
    if (phoneNumber.startsWith('+1-')) {
      phoneNumber = phoneNumber.replace('+1-', '')
    }
    // Keep only digits for the masked input
    return phoneNumber.replace(/\D/g, '')
  }

  return ''
})

// Form validation schema using Zod
const formSchema = toTypedSchema(z.object({
  leadContact: z.string().min(1, 'Lead contact number is required'),
  agentContact: z.union([z.string(), z.number()]).refine(val => val !== '', 'Agent contact number is required'),
  template: z.union([z.string(), z.number()]).refine(val => val !== '', 'Template is required'),
  templateMessage: z.string().min(1, 'Message is required').max(200, 'Max 200 characters'),
}))

// Fetch templates for the lead
const { data: textMessageData } = await useLazyAsyncData('get-sms-email-list', () =>
  useApi().post('/get-sms-email-list', {
    lead_id: route.params.id,
  }), {
  transform: res => res,
})

// Fetch list of phone countries
const { data: countrylist } = await useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: true,
})

// Helper to get country label from code
function getCountryLabel(code: string) {
  const country = countrylist.value?.find((c: { phone_code: number | string }) => String(c.phone_code) === code)
  return country ? `${country.country_code} (+${country.phone_code})` : ''
}

// Setup vee-validate form
const { handleSubmit, isSubmitting, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    leadContact: '',
    agentContact: '',
    template: '',
    templateMessage: '',
  },
})

// Watch for leadPhoneNumber changes and update form
watch(leadPhoneNumber, (newPhone) => {
  if (newPhone) {
    setFieldValue('leadContact', newPhone)
  }
}, { immediate: true })

// Watch for template changes and update the message
watch(() => values.template, (newId) => {
  if (newId && textMessageData.value?.sms) {
    const selectedTemplate = textMessageData.value.sms.find(
      (item: { templete_id: number }) => item.templete_id === Number(newId),
    )
    if (selectedTemplate) {
      setFieldValue('templateMessage', selectedTemplate.templete_desc)
    }
  }
}, { immediate: true })

// Message character length
const messageLength = computed(() => values.templateMessage?.length || 0)

// Handle form submission
const onSubmit = handleSubmit(async (vals) => {
  try {
    // Validate form data before processing
    if (!vals.leadContact || !vals.agentContact || !vals.templateMessage) {
      showToast({
        message: 'Please fill in all required fields',
        type: 'error',
      })
      return
    }

    const formatMaskaToNumber = vals.leadContact.replace(/\D/g, '')

    // Ensure we have a valid phone number
    if (!formatMaskaToNumber || formatMaskaToNumber.length < 10) {
      showToast({
        message: 'Please enter a valid phone number',
        type: 'error',
      })
      return
    }

    // Construct the full phone number with country code
    const fullPhoneNumber = `+${phoneCountryCode.value}${formatMaskaToNumber}`

    const payload = {
      to: fullPhoneNumber,
      from: vals.agentContact,
      message: vals.templateMessage.trim(),
      date: moment().format('YYYY-MM-DD'),
      voip_provider: 'didforsale',
    }
    const response = await useApi().post('/send-sms', payload)

    // Handle response
    if (response && response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })

      // Optional: Reset form or redirect
      // resetForm()
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
      message: `${error?.message}`,
      type: 'error',
    })
  }
})
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col justify-between gap-6 md:h-[500px]">
        <!-- Form fields section -->
        <div class="flex-1 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Lead Contact -->
            <FormField v-slot="{ componentField }" name="leadContact">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Lead contact No.
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <Select v-model="phoneCountryCode">
                      <SelectTrigger class="w-fit data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue>
                          <span class="text-sm text-nowrap">
                            {{ getCountryLabel(String(phoneCountryCode)) }}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="(item, index) in countrylist" :key="index" :value="item.phone_code">
                          {{ item.country_name }} (+{{ item.phone_code }})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      v-maska="'(###) ###-####'"
                      placeholder="Enter Phone Number"
                      v-bind="componentField"
                      class="h-11 border-gray-200 rounded-l-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Agent Contact with Pagination -->
            <FormField v-slot="{ componentField }" name="agentContact">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Agent contact No.
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Agent Contact No." />
                    </SelectTrigger>
                    <SelectContent
                      class="max-h-[200px] overflow-y-auto"
                      @scroll="handleExtensionScroll"
                    >
                      <!-- Loading state for initial load -->
                      <SelectItem
                        v-if="extensionStatus === 'pending' && extensionData.length === 0"
                        class="text-center justify-center"
                        :value="null"
                        disabled
                      >
                        <Icon name="eos-icons:loading" />
                      </SelectItem>

                      <!-- Extension items -->
                      <template v-else>
                        <SelectItem v-for="option in extensionData" :key="option.id" :value="option.mobile">
                          {{ option.first_name }} {{ option.last_name }}
                        </SelectItem>

                        <!-- Loading more indicator -->
                        <SelectItem
                          v-if="isLoadingMoreExtensions"
                          class="text-center justify-center"
                          :value="null"
                          disabled
                        >
                          <Icon name="eos-icons:loading" class="animate-spin" />
                          <span class="ml-2">Loading more...</span>
                        </SelectItem>

                        <!-- No more items indicator -->
                        <SelectItem
                          v-else-if="!hasMoreExtensions && extensionData.length > 0"
                          class="text-center justify-center text-gray-500"
                          :value="null"
                          disabled
                        >
                          No more items
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Template (full width) -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in textMessageData?.sms" :key="option.templete_id" :value="option.templete_id">
                      {{ option.templete_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Message (full width) -->
          <FormField v-slot="{ componentField }" name="templateMessage">
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Enter message here..."
                  maxlength="200"
                  rows="8"
                  class="resize-y pr-14 min-h-[100px]"
                />
              </FormControl>
              <div class="flex justify-between">
                <FormMessage class="w-full" />
                <span class="text-xs text-muted-foreground select-none w-full text-end">
                  {{ messageLength }}/200 Characters
                </span>
              </div>
            </FormItem>
          </FormField>
        </div>

        <!-- Button section -->
        <div>
          <Button type="submit" :disabled="isSubmitting" :loading="isSubmitting" class="w-full h-11">
            <Icon name="material-symbols:chat" size="20" />
            Send Text
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
