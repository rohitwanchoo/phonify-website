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

// Static agent options
const agentOptions = [
  { label: 'Agent 1', value: 5654544444 },
  { label: 'Agent 2', value: 5654544442 },
  { label: 'Agent 3', value: 5654544443 },
]

// Selected country code (defaults to +1)
const phoneCountryCode = ref(1)

// Form validation schema using Zod
const formSchema = toTypedSchema(z.object({
  leadContact: z.string().min(1, 'Lead contact number is required'),
  agentContact: z.number().min(1, 'Agent contact number is required'),
  template: z.number().min(1, 'Template is required'),
  templateMessage: z.string().min(1, 'Message is required').max(200, 'Max 200 characters'),
}))

// Fetch templates for the lead
const { data: textMessageData } = await useLazyAsyncData('get-sms-email-list', () =>
  useApi().post('/get-sms-email-list', {
    lead_id: props.leadData?.id,
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
    leadContact: props?.leadData?.phone_number,
    agentContact: undefined,
    template: undefined,
    templateMessage: '',
  },
})

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
  const formatMaskaToNumber = Number(vals?.leadContact?.replace(/\D/g, '') || '')

  const payload = {
    to: formatMaskaToNumber,
    from: vals.agentContact,
    message: vals.templateMessage,
    date: moment().format('YYYY-MM-DD'),
  }
  try {
    const response = await useApi().post('/send-sms', {
      ...payload,
    })

    if (response.success === true) {
      showToast({
        message: response?.message,
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
      message: `${error.message}`,
      type: 'error',
    })
  }
})
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col  justify-between gap-6 md:h-[500px]">
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
                      v-maska="'(###) ### ####'"
                      placeholder="Enter Phone Number"
                      v-bind="componentField"
                      class="h-11 border-gray-200 rounded-l-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Agent Contact -->
            <FormField v-slot="{ componentField }" name="agentContact">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Agent contact No.
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in agentOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
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
                  {{ messageLength }}/200
                </span>
              </div>
            </FormItem>
          </FormField>
        </div>
        <!-- Button section -->
        <div>
          <Button type="submit" :disabled="isSubmitting" :loading="isSubmitting" class="w-full">
            <Icon name="material-symbols:chat" class="mr-1 !h-11" />
            Send Text
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
