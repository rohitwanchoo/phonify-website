<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import moment from 'moment'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'

export interface LeadField {
  label: string
  value: string | null
  is_dialing: number
  is_visible: number
  is_editable: number
  alternate_phone: string | null
}

export interface LeadDataResponse {
  number: string
  lead_id: number
  list_id: number
  data: Record<string, LeadField>
}

interface Props {
  leadData: LeadDataResponse
}
const props = defineProps<Props>()

const route = useRoute()

// SMS Constants
const SMS_SEGMENT_SIZE = 160 // Standard SMS segment size
const SMS_SEGMENT_SIZE_UNICODE = 70 // Unicode SMS segment size
const MAX_SEGMENTS = 10 // Maximum number of segments allowed
const MAX_CHARACTERS = SMS_SEGMENT_SIZE * MAX_SEGMENTS // 1600 characters

// Delivery status tracking
const lastSentMessageId = ref<string | null>(null)
const deliveryStatus = ref<'idle' | 'sending' | 'sent' | 'delivered' | 'failed'>('idle')
const deliveryStatusMessage = ref('')

// REACTIVE DATA - Phone & Form State
const phoneCountryCode = ref(1)

// Check if message contains unicode characters (non-ASCII)
function hasUnicode(text: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[^\x00-\x7F]/.test(text)
}

// Calculate SMS segments
function calculateSegments(message: string): { segments: number, segmentSize: number, isUnicode: boolean } {
  const isUnicode = hasUnicode(message)
  const segmentSize = isUnicode ? SMS_SEGMENT_SIZE_UNICODE : SMS_SEGMENT_SIZE

  if (message.length === 0) {
    return { segments: 0, segmentSize, isUnicode }
  }

  // For multi-part messages, headers reduce available space
  if (message.length <= segmentSize) {
    return { segments: 1, segmentSize, isUnicode }
  }

  // Multi-part SMS uses some characters for headers
  const multiPartSegmentSize = isUnicode ? 67 : 153
  const segments = Math.ceil(message.length / multiPartSegmentSize)

  return { segments, segmentSize: multiPartSegmentSize, isUnicode }
}

// FORM VALIDATION SCHEMA
const formSchema = toTypedSchema(z.object({
  leadContact: z.string().min(1, 'Lead contact number is required'),
  agentContact: z.union([z.string(), z.number()]).refine(val => val !== '', 'Agent contact number is required'),
  template: z.union([z.string(), z.number()]).optional(),
  templateMessage: z.string().min(1, 'Message is required').max(MAX_CHARACTERS, `Max ${MAX_CHARACTERS} characters`),
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

// Fetch SMS templates for the current lead
const { data: textMessageData, status: smsDataStatus } = useLazyAsyncData('get-sms-email-list', () =>
  useApi().post('/get-sms-email-list', {
    lead_id: route.params.id,
  }), {
  transform: res => res,
  server: false, // Don't wait for server-side rendering
})

// Fetch list of phone countries with codes
const { data: countrylist, status: countriesStatus } = useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  server: false, // Don't wait for server-side rendering
})

// Fetch list of agent contact number
const { data: agentContactList, status: agentContactStatus } = useLazyAsyncData('agent-contact-list', () =>
  useApi().get('/sms_did_list'), {
  transform: res => res.data,
  server: false, // Don't wait for server-side rendering
})

/**
 * Calculate message character count and segments for display
 */
const messageLength = computed(() => values.templateMessage?.length || 0)

const messageSegmentInfo = computed(() => {
  const message = values.templateMessage || ''
  return calculateSegments(message)
})

const segmentWarning = computed(() => {
  const { segments, isUnicode } = messageSegmentInfo.value
  if (segments > MAX_SEGMENTS) {
    return `Message exceeds ${MAX_SEGMENTS} segments. Please shorten your message.`
  }
  if (segments > 1) {
    return `This message will be sent as ${segments} SMS segments.${isUnicode ? ' (Unicode detected)' : ''}`
  }
  if (isUnicode && messageLength.value > 0) {
    return 'Unicode characters detected. Max 70 characters per segment.'
  }
  return null
})

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

// FORM SUBMISSION
/**
 * Handle form submission - sends SMS message
 * Formats phone number with country code and calls SMS API
 */
const onSubmit = handleSubmit(async (vals) => {
  // Check segment limit
  if (messageSegmentInfo.value.segments > MAX_SEGMENTS) {
    showToast({
      message: `Message too long. Please reduce to ${MAX_SEGMENTS} segments or less.`,
      type: 'error',
    })
    return
  }

  deliveryStatus.value = 'sending'
  deliveryStatusMessage.value = 'Sending message...'

  try {
    // Format phone number: remove non-digits and add country code
    const formatMaskaToNumber = vals.leadContact.replace(/\D/g, '')
    const fullPhoneNumber = `${phoneCountryCode.value}${formatMaskaToNumber}`

    // Prepare SMS payload
    const payload = {
      to: fullPhoneNumber,
      from: vals.agentContact,
      message: vals.templateMessage.trim(),
      date: moment().format('YYYY-MM-DD'),
      voip_provider: 'didforsale',
      lead_id: props.leadData?.lead_id,
    }

    // Send SMS via API
    const response = await useApi().post('/send-sms', payload)

    // Handle API response
    if (response?.success !== false) {
      deliveryStatus.value = 'sent'
      deliveryStatusMessage.value = 'Message sent successfully!'
      lastSentMessageId.value = response?.message_id || null

      showToast({
        message: response?.message || 'SMS sent successfully',
        type: 'success',
      })

      // Clear form after successful send
      setFieldValue('templateMessage', '')
      setFieldValue('template', '')

      // Start polling for delivery status if message ID is available
      if (lastSentMessageId.value) {
        pollDeliveryStatus(lastSentMessageId.value)
      }
    }
    else {
      deliveryStatus.value = 'failed'
      deliveryStatusMessage.value = response?.message || 'Failed to send SMS'
      showToast({
        message: response?.message || 'Failed to send SMS',
        type: 'error',
      })
    }
  }
  catch (error: any) {
    deliveryStatus.value = 'failed'
    const errorMessage = error?.response?.data?.message
      || error?.message
      || 'Failed to send SMS. Please try again.'
    deliveryStatusMessage.value = errorMessage
    showToast({
      message: errorMessage,
      type: 'error',
    })
  }
})

/**
 * Poll for delivery status updates
 */
async function pollDeliveryStatus(messageId: string) {
  // Poll for up to 30 seconds
  const maxAttempts = 6
  let attempts = 0

  const poll = async () => {
    if (attempts >= maxAttempts || lastSentMessageId.value !== messageId) {
      return
    }

    try {
      const response = await useApi().get(`/sms-status/${messageId}`)
      if (response?.status === 'delivered') {
        deliveryStatus.value = 'delivered'
        deliveryStatusMessage.value = 'Message delivered!'
        return
      }
      else if (response?.status === 'failed') {
        deliveryStatus.value = 'failed'
        deliveryStatusMessage.value = response?.error || 'Delivery failed'
        return
      }
    }
    catch {
      // Silently fail status check - message was already sent
    }

    attempts++
    if (attempts < maxAttempts) {
      setTimeout(poll, 5000) // Poll every 5 seconds
    }
  }

  setTimeout(poll, 5000) // Start polling after 5 seconds
}

/**
 * Reset delivery status
 */
function resetDeliveryStatus() {
  deliveryStatus.value = 'idle'
  deliveryStatusMessage.value = ''
  lastSentMessageId.value = null
}

/*
 * Watch for template selection changes and update message content
 * Automatically fills in the message field when a template is selected
 */
// watch(() => values.template, (newId) => {
//   if (newId && textMessageData.value?.sms) {
//     const selectedTemplate = textMessageData.value.sms.find(
//       (item: { templete_id: number }) => item.templete_id === Number(newId),
//     )
//     if (selectedTemplate) {
//       setFieldValue('templateMessage', selectedTemplate.templete_desc)
//     }
//   }
// }, { immediate: true })

function handleSelectTemplate(newId: any) {
  if (newId && textMessageData.value?.sms) {
    const selectedTemplate = textMessageData.value.sms.find(
      (item: { templete_id: number }) => item.templete_id === Number(newId),
    )
    if (selectedTemplate) {
      setFieldValue('templateMessage', selectedTemplate.templete_desc)
    }
  }
}
onMounted(() => {
  if (props.leadData) {
    const dialingNumber = Object.values(props.leadData.data).find((item: { is_dialing: number }) => item.is_dialing === 1)?.value
    setFieldValue('leadContact', String(dialingNumber))
  }
})
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
                    <Select v-model="phoneCountryCode" disabled>
                      <SelectTrigger class="w-fit data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue>
                          <span v-if="countriesStatus === 'pending'" class="text-sm text-gray-400">
                            <Icon name="eos-icons:loading" class="animate-spin" />
                          </span>
                          <span v-else class="text-sm text-nowrap">
                            {{ getCountryLabel(String(phoneCountryCode)) }}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-if="countriesStatus === 'pending'"
                          class="text-center justify-center"
                          :value="null"
                          disabled
                        >
                          <Icon name="eos-icons:loading" class="animate-spin" />
                        </SelectItem>
                        <template v-else>
                          <SelectItem
                            v-for="(item, index) in countrylist"
                            :key="index"
                            :value="item.phone_code"
                          >
                            {{ item.country_name }} (+{{ item.phone_code }})
                          </SelectItem>
                        </template>
                      </SelectContent>
                    </Select>

                    <!-- Phone Number Input with Mask -->
                    <Input
                      v-maska="'(###) ###-####'"
                      disabled
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
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-if="agentContactStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                          <Icon name="eos-icons:loading" />
                        </SelectItem>
                        <!-- <div v-else-if="agentContactList?.length === 0">
                        <span class="text-sm text-gray-400">No agent contact found.</span>
                      </div> -->
                        <SelectItem v-for="option in agentContactList" :key="option.cli" :value="option.cli">
                          {{ formatNumber(option.cli) }} - <span class="capitalize">{{ option.voip_provider }}</span>
                        </SelectItem>
                      </SelectGroup>
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
                <Select v-bind="componentField" :disabled="smsDataStatus === 'pending'" @update:model-value="handleSelectTemplate">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-if="smsDataStatus === 'pending'"
                      class="text-center justify-center"
                      :value="null"
                      disabled
                    >
                      <Icon name="eos-icons:loading" class="animate-spin" />
                      <span class="ml-2">Loading templates...</span>
                    </SelectItem>
                    <template v-else>
                      <SelectItem
                        v-for="option in textMessageData?.sms"
                        :key="option.templete_id"
                        :value="option.templete_id"
                      >
                        {{ option.templete_name }}
                      </SelectItem>
                    </template>
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
                  :maxlength="MAX_CHARACTERS"
                  rows="8"
                  class="resize-y pr-14 min-h-[150px]"
                  @focus="resetDeliveryStatus"
                />
              </FormControl>

              <!-- Validation Message and Character/Segment Counter -->
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <FormMessage class="flex-1" />
                  <div class="text-right space-y-1">
                    <span class="text-xs text-muted-foreground select-none block">
                      {{ messageLength }}/{{ MAX_CHARACTERS }} Characters
                    </span>
                    <span v-if="messageSegmentInfo.segments > 0" class="text-xs select-none block"
                      :class="messageSegmentInfo.segments > MAX_SEGMENTS ? 'text-red-500' : 'text-muted-foreground'"
                    >
                      {{ messageSegmentInfo.segments }} SMS segment{{ messageSegmentInfo.segments !== 1 ? 's' : '' }}
                    </span>
                  </div>
                </div>

                <!-- Segment Warning -->
                <div v-if="segmentWarning" class="flex items-start gap-2 p-2 rounded-md text-xs"
                  :class="messageSegmentInfo.segments > MAX_SEGMENTS ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'"
                >
                  <Icon :name="messageSegmentInfo.segments > MAX_SEGMENTS ? 'material-symbols:error' : 'material-symbols:info'" size="16" class="flex-shrink-0 mt-0.5" />
                  <span>{{ segmentWarning }}</span>
                </div>
              </div>
            </FormItem>
          </FormField>
        </div>

        <!-- DELIVERY STATUS SECTION -->
        <div v-if="deliveryStatus !== 'idle'" class="p-3 rounded-lg border"
          :class="{
            'bg-blue-50 border-blue-200': deliveryStatus === 'sending',
            'bg-green-50 border-green-200': deliveryStatus === 'sent' || deliveryStatus === 'delivered',
            'bg-red-50 border-red-200': deliveryStatus === 'failed'
          }"
        >
          <div class="flex items-center gap-2">
            <Icon
              v-if="deliveryStatus === 'sending'"
              name="eos-icons:loading"
              size="18"
              class="text-blue-600 animate-spin"
            />
            <Icon
              v-else-if="deliveryStatus === 'sent'"
              name="material-symbols:check-circle"
              size="18"
              class="text-green-600"
            />
            <Icon
              v-else-if="deliveryStatus === 'delivered'"
              name="material-symbols:done-all"
              size="18"
              class="text-green-600"
            />
            <Icon
              v-else-if="deliveryStatus === 'failed'"
              name="material-symbols:error"
              size="18"
              class="text-red-600"
            />
            <span class="text-sm"
              :class="{
                'text-blue-700': deliveryStatus === 'sending',
                'text-green-700': deliveryStatus === 'sent' || deliveryStatus === 'delivered',
                'text-red-700': deliveryStatus === 'failed'
              }"
            >
              {{ deliveryStatusMessage }}
            </span>
            <Badge v-if="deliveryStatus === 'delivered'" variant="outline" class="ml-auto text-green-700 border-green-300">
              Delivered
            </Badge>
          </div>
        </div>

        <!-- SUBMIT BUTTON SECTION -->
        <div>
          <Button
            type="submit"
            :disabled="isSubmitting || messageSegmentInfo.segments > MAX_SEGMENTS"
            :loading="isSubmitting"
            class="w-full h-11"
          >
            <Icon name="material-symbols:chat" size="20" />
            {{ messageSegmentInfo.segments > 1 ? `Send ${messageSegmentInfo.segments} SMS` : 'Send Text' }}
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
