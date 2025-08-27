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

// REACTIVE DATA - Extension Management
// Extension data with pagination support
const extensionData = ref([])
const extensionStart = ref(0)
const extensionLimit = ref(10)
const isLoadingMoreExtensions = ref(false)
const hasMoreExtensions = ref(true)
const extensionStatus = ref('idle') // 'idle' | 'pending' | 'success' | 'error'

// REACTIVE DATA - Phone & Form State
// Selected country code (defaults to +1 for US)
const phoneCountryCode = ref(1)

// FORM VALIDATION SCHEMA
const formSchema = toTypedSchema(z.object({
  leadContact: z.string().min(1, 'Lead contact number is required'),
  agentContact: z.union([z.string(), z.number()]).refine(val => val !== '', 'Agent contact number is required'),
  template: z.union([z.string(), z.number()]).refine(val => val !== '', 'Template is required'),
  templateMessage: z.string().min(1, 'Message is required').max(200, 'Max 200 characters'),
}))

// FORM SETUP
const { handleSubmit, isSubmitting, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    leadContact: '',
    agentContact: '',
    template: '',
    templateMessage: '',
  },
})

// DATA FETCHING - API Calls
// Fetch SMS templates for the current lead
const { data: textMessageData } = await useLazyAsyncData('get-sms-email-list', () =>
  useApi().post('/get-sms-email-list', {
    lead_id: route.params.id,
  }), {
  transform: res => res,
})

// Fetch list of phone countries with codes
const { data: countrylist } = await useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: true,
})

// COMPUTED PROPERTIES
/**
 * Extract and format the lead's phone number from leadData
 * Removes +1- prefix and non-digit characters for clean display
 */
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

/**
 * Calculate message character count for display
 */
const messageLength = computed(() => values.templateMessage?.length || 0)

// UTILITY FUNCTIONS
/**
 * Get formatted country label from country code
 * @param code - Phone country code as string
 * @returns Formatted string like "US (+1)" or empty string if not found
 */
function getCountryLabel(code: string) {
  const country = countrylist.value?.find((c: { phone_code: number | string }) => String(c.phone_code) === code)
  return country ? `${country.country_code} (+${country.phone_code})` : ''
}

// EXTENSION DATA MANAGEMENT
/**
 * Load extensions with pagination support
 * @param reset - Whether to reset the list and start from beginning
 */
async function loadExtensions(reset = false) {
  try {
    // Reset pagination if requested
    if (reset) {
      extensionStart.value = 0
      extensionData.value = []
      hasMoreExtensions.value = true
    }

    extensionStatus.value = 'pending'

    // API call to fetch extensions
    const response = await useApi().post('/extension-list', {
      start: extensionStart.value,
      limit: extensionLimit.value,
    })

    if (response.data) {
      const newExtensions = Array.isArray(response.data) ? response.data : []

      // Update the extensions list
      if (reset) {
        extensionData.value = newExtensions
      }
      else {
        extensionData.value = [...extensionData.value, ...newExtensions]
      }

      // Update pagination state
      hasMoreExtensions.value = newExtensions.length === extensionLimit.value
      extensionStart.value += extensionLimit.value
    }

    extensionStatus.value = 'success'
  }
  catch {
    extensionStatus.value = 'error'
  }
  finally {
    isLoadingMoreExtensions.value = false
  }
}

/**
 * Load more extensions for pagination
 * Called when user scrolls near bottom of select dropdown
 */
async function loadMoreExtensions() {
  if (isLoadingMoreExtensions.value || !hasMoreExtensions.value) {
    return
  }

  isLoadingMoreExtensions.value = true
  await loadExtensions(false)
}

/**
 * Handle scroll event in extension select dropdown
 * Triggers loading more extensions when near bottom
 * @param event - Scroll event from the dropdown
 */
function handleExtensionScroll(event: Event) {
  const target = event.target as HTMLElement
  const threshold = 10 // pixels from bottom to trigger load

  if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
    loadMoreExtensions()
  }
}

// FORM SUBMISSION
/**
 * Handle form submission - sends SMS message
 * Formats phone number with country code and calls SMS API
 */
const onSubmit = handleSubmit(async (vals) => {
  try {
    // Format phone number: remove non-digits and add country code
    const formatMaskaToNumber = vals.leadContact.replace(/\D/g, '')
    const fullPhoneNumber = `+${phoneCountryCode.value}${formatMaskaToNumber}`

    // Prepare SMS payload
    const payload = {
      to: fullPhoneNumber,
      from: vals.agentContact,
      message: vals.templateMessage.trim(),
      date: moment().format('YYYY-MM-DD'),
      voip_provider: 'didforsale',
    }

    // Send SMS via API
    const response = await useApi().post('/send-sms', payload)

    // Handle API response
    if (response && response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
      // Optional: Reset form or redirect after successful send
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

// WATCHERS
/*
 * Watch for changes in leadPhoneNumber and update form field
 * Automatically populates lead contact field when leadData changes
 */
watch(leadPhoneNumber, (newPhone) => {
  if (newPhone) {
    setFieldValue('leadContact', newPhone)
  }
}, { immediate: true })

/*
 * Watch for template selection changes and update message content
 * Automatically fills in the message field when a template is selected
 */
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

// INITIALIZATION
// Load initial extension data on component mount
await loadExtensions(true)
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col justify-between gap-6">
        <!-- FORM FIELDS SECTION -->
        <div class="flex-1 space-y-4">
          <!-- Contact Fields Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Lead Contact Number Field -->
            <FormField v-slot="{ componentField }" name="leadContact">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Lead contact No.
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <!-- Country Code Selector -->
                    <Select v-model="phoneCountryCode">
                      <SelectTrigger class="w-fit data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue>
                          <span class="text-sm text-nowrap">
                            {{ getCountryLabel(String(phoneCountryCode)) }}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="(item, index) in countrylist"
                          :key="index"
                          :value="item.phone_code"
                        >
                          {{ item.country_name }} (+{{ item.phone_code }})
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <!-- Phone Number Input with Mask -->
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

            <!-- Agent Contact Field with Pagination -->
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
                      <!-- Initial Loading State -->
                      <SelectItem
                        v-if="extensionStatus === 'pending' && extensionData.length === 0"
                        class="text-center justify-center"
                        :value="null"
                        disabled
                      >
                        <Icon name="eos-icons:loading" />
                      </SelectItem>

                      <!-- Extension List Items -->
                      <template v-else>
                        <SelectItem
                          v-for="option in extensionData"
                          :key="option.id"
                          :value="option.mobile"
                        >
                          {{ option.first_name }} {{ option.last_name }}
                        </SelectItem>

                        <!-- Loading More Indicator -->
                        <SelectItem
                          v-if="isLoadingMoreExtensions"
                          class="text-center justify-center"
                          :value="null"
                          disabled
                        >
                          <Icon name="eos-icons:loading" class="animate-spin" />
                          <span class="ml-2">Loading more...</span>
                        </SelectItem>

                        <!-- End of List Indicator -->
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

          <!-- Template Selection Field -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in textMessageData?.sms"
                      :key="option.templete_id"
                      :value="option.templete_id"
                    >
                      {{ option.templete_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Message Text Area Field -->
          <FormField v-slot="{ componentField }" name="templateMessage">
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Enter message here..."
                  maxlength="200"
                  rows="8"
                  class="resize-y pr-14 min-h-[150px]"
                />
              </FormControl>

              <!-- Validation Message and Character Counter -->
              <div class="flex justify-between">
                <FormMessage class="w-full" />
                <span class="text-xs text-muted-foreground select-none w-full text-end">
                  {{ messageLength }}/200 Characters
                </span>
              </div>
            </FormItem>
          </FormField>
        </div>

        <!-- SUBMIT BUTTON SECTION -->
        <div>
          <Button
            type="submit"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            class="w-full h-11"
          >
            <Icon name="material-symbols:chat" size="20" />
            Send Text
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
