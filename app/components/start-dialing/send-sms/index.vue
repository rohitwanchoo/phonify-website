<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import moment from 'moment'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

// REACTIVE DATA - Phone & Form State
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

// FORM SUBMISSION
/**
 * Handle form submission - sends SMS message
 * Formats phone number with country code and calls SMS API
 */
const onSubmit = handleSubmit(async (vals) => {
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
    }

    // Send SMS via API
    const response = await useApi().post('/send-sms', payload)

    // Handle API response
    if (response) {
      showToast({
        message: response.message || 'SMS sent successfully',
        type: 'success',
      })
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
