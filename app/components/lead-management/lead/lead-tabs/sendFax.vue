<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'

const props = defineProps({
  leadData: Object,
})

// ===== CONSTANTS =====
// Available agent numbers for fax sending
const agentOptions = [
  { label: '2397463978', value: '2397463978' },
  { label: '2397463979', value: '2397463979' },
  { label: '2397463980', value: '2397463980' },
]

// ===== FORM SCHEMA =====
// Validation schema using Zod
const formSchema = toTypedSchema(z.object({
  faxNumber: z.string().min(1, 'Fax number is required'),
  agentNumber: z.string().min(1, 'Agent number is required'),
  file: z.array(z.instanceof(File)).min(1, 'File is required'),
}))

// ===== REACTIVE DATA =====
const file = ref<File>() // Selected file for upload

// ===== FORM SETUP =====
const { handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    faxNumber: '',
    agentNumber: '',
    file: [],
  },
})

// Field reference for file handling
const { setValue: setFile } = useField('file')

// ===== COMPUTED PROPERTIES =====
/**
 * Extracts and formats the lead phone number from leadData
 * Finds the dialing phone number and cleans it for form input
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

// ===== WATCHERS =====
/**
 * Watch for changes in leadPhoneNumber and auto-populate fax number field
 * This automatically fills the recipient fax number when lead data is available
 */
watch(leadPhoneNumber, (newPhone) => {
  if (newPhone) {
    setFieldValue('faxNumber', newPhone)
  }
}, { immediate: true })

// ===== METHODS =====
/**
 * Handles file selection from the file uploader component
 * @param files - Array of selected files
 */
function handleFileUpdate(files: File[]) {
  file.value = files[0]
  setFile(files)
}

/**
 * Form submission handler
 * Formats data and sends fax via API
 */
const onSubmit = handleSubmit(async (vals) => {
  // Remove all non-digit characters from fax number
  const formatMaskaToNumber = vals.faxNumber.replace(/\D/g, '')

  // Prepare form data for API submission
  const formData = new FormData()
  formData.append('callid', vals.agentNumber)
  formData.append('dialednumber', formatMaskaToNumber)
  formData.append('faxurl', file.value as File)

  try {
    // Send fax request to API
    const response = await useApi().post('/send-fax', formData)

    // Handle successful response
    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
    }
    else {
      // Handle API error response
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    // Handle network or other errors
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
})

// ===== COMMENTED OUT CODE =====
// Async data fetching for fax DID user (currently disabled)
// const { data: faxDidData } = await useLazyAsyncData('fax-did-user', () =>
//   useApi().post('/fax-did-user'), {
//   transform: res => res.data,
// })
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col justify-between gap-6 md:h-[500px]">
        <!-- ===== FORM FIELDS SECTION ===== -->
        <div class="flex-1 space-y-4">
          <!-- Agent Number and Fax Number Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Agent Number Selection (From) -->
            <FormField v-slot="{ componentField }" name="agentNumber">
              <FormItem class="flex flex-col gap-1">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Agent Number" class="text-xs md:text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in agentOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ formatNumber(option.value) }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Recipient Fax Number Input -->
            <FormField v-slot="{ componentField }" name="faxNumber">
              <FormItem class="flex flex-col gap-1">
                <FormLabel>Recipient Fax Number</FormLabel>
                <FormControl>
                  <Input
                    v-maska="'(###) ###-####'"
                    v-bind="componentField"
                    type="tel"
                    placeholder="Fax Number"
                    class="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- File Upload Section (Full Width) -->
          <div class="mt-6">
            <FormField name="file">
              <FormItem>
                <FormLabel>File Upload</FormLabel>
                <FormControl>
                  <BaseFileUploader
                    accept=".pdf"
                    max-size="10MB"
                    @update:files="handleFileUpdate"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- ===== SUBMIT BUTTON SECTION ===== -->
        <div>
          <Button
            type="submit"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            class="w-full h-11"
          >
            <Icon name="material-symbols:fax" size="20" />
            Send Fax
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
