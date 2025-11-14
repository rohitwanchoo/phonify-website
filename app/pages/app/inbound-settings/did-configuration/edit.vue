<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import Textarea from '~/components/ui/textarea/Textarea.vue'

const breadcrumbs = [
  {
    label: 'DID configuration',
    href: '/app/inbound-settings/did-configuration',
  },
  {
    label: 'Edit Phone Numbers',
    active: true,
  },
]
const router = useRouter()
const route = useRoute()

// API Data fetching
const { data: didData, status: didStatus } = await useLazyAsyncData('did-data-by-id', () =>
  useApi().post('/get-did-by-id', {
    did_id: route?.query?.id,
  }), {
  transform: res => res.data,
  immediate: true,
})

const { data: callTimesData, status: callTimesStatus } = await useLazyAsyncData('get-department-list', () =>
  useApi().post('/get-department-list'), {
  transform: res => res.data,
  immediate: true,
})

const { data: destTypeData, status: destTypeStatus } = await useLazyAsyncData('get-destination-type', () =>
  useApi().post('/dest-type'), {
  transform: res => res.data,
  immediate: true,
})

const { data: ivrData, status: ivrStatus, refresh: refreshIvrData } = await useLazyAsyncData('get-ivr', () =>
  useApi().post('/ivr'), {
  transform: res => res.data,
  immediate: false,
})

const { data: extensionListData, status: extensionListStatus, refresh: refreshExtensionListData } = await useLazyAsyncData('get-extension-list', () =>
  useApi().post('/extension-list'), {
  transform: res => res.data,
  immediate: false,
})

const { data: conferencingData, status: conferencingStatus, refresh: refreshConferencingData } = await useLazyAsyncData('get-conferencing', () =>
  useApi().post('/conferencing'), {
  transform: res => res.data,
  immediate: false,
})

const { data: ringGroupData, status: ringGroupStatus, refresh: refreshRingGroupData } = await useLazyAsyncData('get-ring-group', () =>
  useApi().post('/ring-group'), {
  transform: res => res.data,
  immediate: false,
})

const { data: voiceAiData, status: voiceAiStatus, refresh: refreshVoiceAi } = await useLazyAsyncData('prompts', () =>
  useApi().get('/prompts'), {
  transform: res => res.data,
  immediate: false,
})

const { data: userData, status: userDataStatus, refresh: refreshUserData } = await useLazyAsyncData('user-data', () =>
  useApi().get('/users-list-new'), {
  transform: res => res.data,
  immediate: false,
})

const { data: countryList, status: countryListStatus, refresh: refreshCountryList } = await useLazyAsyncData('country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: false,
})

const { data: languageList, status: languageListStatus, refresh: refreshLanguageList } = await useLazyAsyncData('google-languages', () =>
  useApi().post('/get-google-languages'), {
  transform: res => res.data,
  immediate: false,
})

const voiceList = ref<any[]>([])
const voiceListStatus = ref('idle')

const voipProviderItems = [
  { label: 'DidForSale', value: 'didforsale' },
  { label: 'Plivo', value: 'plivo' },
  { label: 'Telnyx', value: 'telnyx' },
  { label: 'Twilio', value: 'twilio' },
]

const callScreeningOptions = [
  {
    label: 'Upload File',
    value: 'upload',
  },
  {
    label: 'Convert Text to Audio',
    value: 'text_to_speech',
  },
]

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    cli: z.string(),
    cnam: z.string().min(1, 'Caller name is required'),
    default_did: z.boolean().default(false),
    redirect_last_agent: z.boolean().default(false),
    dest_type: z.number().optional(),
    destination: z.string().optional(),
    country_code: z.number().optional(),
    dest_type_ooh: z.number().optional(),
    ingroup_ooh: z.number().optional(),
    conf_id_ooh: z.number().optional(),
    extension_ooh: z.number().optional(),
    ivr_id_ooh: z.number().optional(),
    voicemail_id_ooh: z.number().optional(),
    voice_ai_ooh: z.number().optional(),
    country_code_ooh: z.number().optional(),
    forward_number_ooh: z.string().optional(),
    sms: z.boolean().default(false),
    enable_sms_ai: z.boolean().default(false),
    assigned_user_id: z.number().optional(),
    set_exclusive_for_user: z.boolean().default(false),
    call_time_department_id: z.number(),
    call_time_holiday: z.boolean().default(false),
    call_screening_status: z.boolean().default(false),
    voip_provider: z.string().nullable(),
    ivr_audio_option: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    voice_name: z.string().optional().nullable(),
    speech_text: z.string().optional().nullable(),
    file: z.any().optional().nullable(),
  }).superRefine((data, ctx) => {
    // Validate dest_type when redirect_last_agent is false
    if (!data.redirect_last_agent && (data.dest_type === undefined || data.dest_type === null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dest_type'],
        message: 'Destination type is required',
      })
    }

    // Validate dest_type_ooh when call_time_holiday is true
    if (data.call_time_holiday && (data.dest_type_ooh === undefined || data.dest_type_ooh === null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dest_type_ooh'],
        message: 'Destination type is required when call time is holiday',
      })
    }

    // Validate assigned_user_id when sms is true
    if (data.sms && !data.assigned_user_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['assigned_user_id'],
        message: 'Assigned user is required',
      })
    }

    // Validate destination fields based on dest_type when redirect_last_agent is false
    if (!data.redirect_last_agent && data.dest_type !== undefined && data.dest_type !== 3 && !data.destination) {
      if (data.dest_type === 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['country_code'],
          message: 'Required',
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['destination'],
          message: 'Phone number is required',
        })
      }
      else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['destination'],
          message: 'Destination is required',
        })
      }
    }

    // Validate destination fields based on dest_type_ooh when call_time_holiday is true
    if (data.call_time_holiday && data.dest_type_ooh !== undefined && data.dest_type_ooh !== 3) {
      if (data.dest_type_ooh === 4 && !data.forward_number_ooh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['forward_number_ooh'],
          message: 'Phone number is required',
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['country_code_ooh'],
          message: 'Required',
        })
      }
      else if (data.dest_type_ooh === 0 && !data.ivr_id_ooh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ivr_id_ooh'],
          message: 'Destination is required',
        })
      }
      else if ([1, 2, 6].includes(data.dest_type_ooh) && (!data.extension_ooh || !data.voicemail_id_ooh)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['extension_ooh'],
          message: 'Destination is required',
        })
      }
      else if (data.dest_type_ooh === 5 && !data.conf_id_ooh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['conf_id_ooh'],
          message: 'Destination is required',
        })
      }
      else if (data.dest_type_ooh === 8 && !data.ingroup_ooh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ingroup_ooh'],
          message: 'Destination is required',
        })
      }
      else if (data.dest_type_ooh === 12 && !data.voice_ai_ooh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['voice_ai_ooh'],
          message: 'Destination is required',
        })
      }
    }
    // Validate call screening fields when enabled
    if (data.call_screening_status) {
      if (!data.ivr_audio_option) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ivr_audio_option'],
          message: 'Please select an audio option',
        })
      }

      if (data.ivr_audio_option === 'text_to_speech') {
        if (!data.language) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['language'],
            message: 'Language is required',
          })
        }
        if (!data.voice_name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['voice_name'],
            message: 'Voice name is required',
          })
        }
        if (!data.speech_text || data.speech_text.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['speech_text'],
            message: 'Text is required',
          })
        }
      }

      if (data.ivr_audio_option === 'upload' && !data.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['file'],
          message: 'Please upload an audio file',
        })
      }
    }
  }),

)

const { handleSubmit, values, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    cli: didData.value?.cli,
    cnam: didData.value?.cnam,
    default_did: didData.value?.default_did,
    redirect_last_agent: didData.value?.redirect_last_agent,
    dest_type: didData.value?.dest_type,
    destination: didData.value?.destination,
    country_code: didData.value?.country_code,
    dest_type_ooh: didData.value?.dest_type_ooh,
    ingroup_ooh: didData.value?.ingroup_ooh,
    conf_id_ooh: didData.value?.conf_id_ooh,
    extension_ooh: didData.value?.extension_ooh,
    ivr_id_ooh: didData.value?.ivr_id_ooh,
    voicemail_id_ooh: didData.value?.voicemail_id_ooh,
    voice_ai_ooh: didData.value?.voice_ai_ooh,
    country_code_ooh: didData.value?.country_code_ooh,
    forward_number_ooh: didData.value?.forward_number_ooh,
    sms: didData.value?.sms,
    enable_sms_ai: didData.value?.enable_sms_ai,
    assigned_user_id: didData.value?.assigned_user_id,
    set_exclusive_for_user: didData.value?.set_exclusive_for_user,
    call_time_department_id: didData.value?.call_time_department_id,
    call_time_holiday: didData.value?.call_time_holiday,
    call_screening_status: didData.value?.call_screening_status,
    voip_provider: didData.value?.voip_provider,
    ivr_audio_option: didData.value?.ivr_audio_option,
    language: didData.value?.language,
    voice_name: didData.value?.voice_name,
    speech_text: didData.value?.speech_text,
    file: null,
  },
})

// Watch didData and update form values
watch(didData, (newData) => {
  if (newData) {
    setFieldValue('cli', newData?.cli)
    setFieldValue('cnam', newData?.cnam)
    setFieldValue('default_did', newData?.default_did === '1')
    setFieldValue('redirect_last_agent', newData?.redirect_last_agent === '1')
    setFieldValue('dest_type', Number(newData?.dest_type))
    setFieldValue('destination', newData?.destination)
    setFieldValue('country_code', newData?.country_code)
    setFieldValue('dest_type_ooh', Number(newData?.dest_type_ooh))
    setFieldValue('ingroup_ooh', Number(newData?.ingroup_ooh))
    setFieldValue('conf_id_ooh', Number(newData?.conf_id_ooh))
    setFieldValue('extension_ooh', Number(newData?.extension_ooh))
    setFieldValue('ivr_id_ooh', Number(newData?.ivr_id_ooh))
    setFieldValue('voicemail_id_ooh', Number(newData?.voicemail_id_ooh))
    setFieldValue('voice_ai_ooh', Number(newData?.voice_ai_ooh))
    setFieldValue('country_code_ooh', newData?.country_code_ooh)
    setFieldValue('forward_number_ooh', newData?.forward_number_ooh)
    setFieldValue('sms', newData?.sms === '1')
    setFieldValue('enable_sms_ai', newData?.enable_sms_ai === '1')
    setFieldValue('assigned_user_id', Number(newData?.assigned_user_id) || 0)
    setFieldValue('set_exclusive_for_user', newData?.set_exclusive_for_user === '1')
    setFieldValue('call_time_department_id', Number(newData?.call_time_department_id))
    setFieldValue('call_time_holiday', newData?.call_time_holiday === 1)
    setFieldValue('call_screening_status', newData?.call_screening_status === '1')
    setFieldValue('voip_provider', newData?.voip_provider)
    setFieldValue('ivr_audio_option', newData?.ivr_audio_option)
    setFieldValue('language', newData?.language)
    setFieldValue('voice_name', newData?.voice_name)
    setFieldValue('speech_text', newData?.speech_text)
    setFieldValue('file', newData?.file)
  }
})

const { setValue: setFile } = useField('file')
const file = ref<File | null>(null)

function handleFileUpdate(files: File[]) {
  file.value = files[0] ?? null
  setFile(files[0])
}

// Watch destination when dest_type is 4 — keep only last 10 digits
watch(didData, (newData) => {
  if (newData && Number(newData.dest_type) === 4) {
    const rawNumber = newData?.destination || newData?.forward_number || ''
    const last10 = rawNumber.replace(/\D/g, '').slice(-10)
    setFieldValue('destination', last10)
  }
})

// Destination configuration mapping
const destinationConfig = {
  0: { data: ivrData, status: ivrStatus, refresh: refreshIvrData },
  1: { data: extensionListData, status: extensionListStatus, refresh: refreshExtensionListData },
  2: { data: extensionListData, status: extensionListStatus, refresh: refreshExtensionListData },
  5: { data: conferencingData, status: conferencingStatus, refresh: refreshConferencingData },
  6: { data: extensionListData, status: extensionListStatus, refresh: refreshExtensionListData },
  8: { data: ringGroupData, status: ringGroupStatus, refresh: refreshRingGroupData },
  12: { data: voiceAiData, status: voiceAiStatus, refresh: refreshVoiceAi },
}

// Helper function to fetch data only if not already loaded
async function fetchIfNeeded(data: Ref<any>, status: Ref<any>, refreshFn: () => Promise<any>) {
  if (!data.value && status.value !== 'pending') {
    await refreshFn()
  }
}

// Unified function to handle destination type changes - only fetch if needed
async function handleDestinationTypeChange(destType: number) {
  const config = (destinationConfig as Record<number, { data: Ref<any>, status: Ref<any>, refresh: () => Promise<any> }>)[destType]
  if (config) {
    await fetchIfNeeded(config.data, config.status, config.refresh)
  }
}

// Watch SMS toggle and refresh user data when enabled - only if not already loaded
watch(() => values.sms, async (newVal) => {
  if (newVal) {
    await fetchIfNeeded(userData, userDataStatus, refreshUserData)
  }
})

// Watch ivr_audio_option toggle and refresh language data when text - only if not already loaded
watch(() => values.ivr_audio_option, async (newVal) => {
  if (newVal === 'text_to_speech') {
    await fetchIfNeeded(languageList, languageListStatus, refreshLanguageList)
  }
})

// Watch language selection and refresh voice list
watch(() => values.language, async (newLanguage) => {
  if (newLanguage && newLanguage !== null) {
    // Clear current voice selection when language changes
    setFieldValue('voice_name', null)

    // Refresh voice list with new language code
    const languageItem = languageList.value?.find((item: { language: string }) => item.language === newLanguage)
    if (languageItem) {
      voiceListStatus.value = 'pending'
      try {
        const response = await useApi().post('/get-voice-name-on-google-languages', {
          language_code: languageItem.language_code,
        })
        voiceList.value = response.data
        voiceListStatus.value = 'success'
      }
      catch {
        voiceListStatus.value = 'error'
      }
    }
  }
})

// Load voice list on mount if language exists
watch(didData, async (newData) => {
  if (newData?.language && languageList.value) {
    const languageItem = languageList.value?.find((item: { language: any }) => item.language === newData.language)
    if (languageItem) {
      voiceListStatus.value = 'pending'
      try {
        const response = await useApi().post('/get-voice-name-on-google-languages', {
          language_code: languageItem.language_code,
        })
        voiceList.value = response.data
        voiceListStatus.value = 'success'
      }
      catch {
        voiceListStatus.value = 'error'
      }
    }
  }
}, { immediate: true })

// Watch both destination types with a single consolidated watcher
watch([() => values.dest_type, () => values.dest_type_ooh], async ([destType, destTypeOoh]) => {
  if (destType !== undefined) {
    await handleDestinationTypeChange(destType)

    // Load country list if dest_type is 4 (forward number)
    if (destType === 4) {
      await fetchIfNeeded(countryList, countryListStatus, refreshCountryList)
    }
  }
  if (destTypeOoh !== undefined) {
    await handleDestinationTypeChange(destTypeOoh)

    // Load country list if dest_type_ooh is 4 (forward number)
    if (destTypeOoh === 4) {
      await fetchIfNeeded(countryList, countryListStatus, refreshCountryList)
    }
  }
}, { immediate: true })

const destinationFieldNameOoh = computed(() => {
  const fieldMap = {
    0: 'ivr_id_ooh',
    1: 'extension_ooh',
    2: 'voicemail_id_ooh',
    5: 'conf_id_ooh',
    6: 'extension_ooh',
    8: 'ingroup_ooh',
    12: 'voice_ai_ooh',
  }
  return (fieldMap as Record<number, string>)[values.dest_type_ooh ?? 0] || ''
})

// Get destination data and status based on type
function getDestinationInfo(destType: number) {
  return (destinationConfig as Record<number, { data: Ref<any>, status: Ref<any> }>)[destType] || { data: ref([]), status: ref('idle') }
}

// Function to format mask to number
const formatMaskaToNumber = (mask: string) => Number(mask?.replace(/\D/g, '') || '')

const onSubmit = handleSubmit(async (values) => {
  try {
    // Prepare form data for file upload
    const formData = new FormData()

    // Add basic fields
    formData.append('did_id', didData.value?.id)
    formData.append('cli', formatMaskaToNumber(values.cli).toString())
    formData.append('cnam', values.cnam)
    formData.append('default_did', values.default_did ? '1' : '0')
    formData.append('redirect_last_agent', values.redirect_last_agent ? '1' : '0')
    formData.append('dest_type', values.dest_type?.toString() || '')
    formData.append('sms', values.sms ? '1' : '0')
    formData.append('enable_sms_ai', values.enable_sms_ai ? '1' : '0')
    formData.append('set_exclusive_for_user', values.set_exclusive_for_user ? '1' : '0')
    formData.append('call_time_department_id', values.call_time_department_id?.toString() || '0')
    formData.append('call_time_holiday', values.call_time_holiday ? '1' : '0')
    formData.append('call_screening_status', values.call_screening_status ? '1' : '0')
    formData.append('voip_provider', values.voip_provider ?? '')
    formData.append('area_code', didData?.value?.area_code || '')

    // Add destination fields
    if (values.dest_type === 0)
      formData.append('ivr_id', values.destination || '')
    if (values.dest_type === 1 || values.dest_type === 6)
      formData.append('extension', values.destination || '')
    if (values.dest_type === 2)
      formData.append('voicemail_id', values.destination || '')
    if (values.dest_type === 4) {
      formData.append('country_code', values.country_code?.toString() || '')
      formData.append('forward_number', values.destination || '')
    }
    if (values.dest_type === 5)
      formData.append('conf_id', values.destination || '')
    if (values.dest_type === 8)
      formData.append('ingroup', values.destination || '')
    if (values.dest_type === 12)
      formData.append('voice_ai', values.destination || '')

    // Add out of hours fields
    if (values.dest_type_ooh !== undefined) {
      formData.append('dest_type_ooh', values.dest_type_ooh.toString())
      formData.append('ingroup_ooh', values.ingroup_ooh?.toString() || '')
      formData.append('conf_id_ooh', values.conf_id_ooh?.toString() || '')
      formData.append('extension_ooh', values.extension_ooh?.toString() || '')
      formData.append('ivr_id_ooh', values.ivr_id_ooh?.toString() || '')
      formData.append('voicemail_id_ooh', values.voicemail_id_ooh?.toString() || '')
      formData.append('voice_ai_ooh', values.voice_ai_ooh?.toString() || '')
      formData.append('country_code_ooh', values.country_code_ooh?.toString() || '')
      formData.append('forward_number_ooh', formatMaskaToNumber(values.forward_number_ooh ?? '').toString())
    }

    // Add SMS fields
    if (values.sms && values.assigned_user_id) {
      formData.append('sms_email', values.assigned_user_id.toString())
    }

    // Add call screening fields
    if (values.call_screening_status) {
      if (values.ivr_audio_option === 'upload' && file.value) {
        formData.append('upload_type', 'file')
        formData.append('file', file.value)
        formData.append('call_screening_audio', 'Yes')
      }
      else if (values.ivr_audio_option === 'text_to_speech') {
        formData.append('upload_type', 'text')

        // Get language_code from selected language
        const languageItem = languageList.value?.find((item: { language: string | null | undefined }) => item.language === values.language)
        if (languageItem) {
          formData.append('language_code', languageItem.language_code)
        }

        formData.append('voice_name', values.voice_name || '')
        formData.append('text', values.speech_text || '')
      }
    }

    const response = await useApi().post('/save-edit-did', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response?.success === 'true') {
      showToast({
        message: response?.message,
        type: 'success',
      })
      router.push({ path: '/app/inbound-settings/did-configuration' })
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

function onCancel() {
  router.push({ path: '/app/inbound-settings/did-configuration' })
}

// Add this function before the onSubmit function
function speakText() {
  const text = values.speech_text

  if (!text || text.trim() === '') {
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  // Create speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text)

  // Optional: Configure voice settings
  utterance.rate = 1 // Speed (0.1 to 10)
  utterance.pitch = 1 // Pitch (0 to 2)
  utterance.volume = 1 // Volume (0 to 1)

  // Optional: Try to match selected language/voice
  const voices = window.speechSynthesis.getVoices()
  if (values.language && voices.length > 0) {
    // Try to find a matching voice based on language code
    const languageItem = languageList.value?.find((item: { language: string }) => item.language === values.language)
    if (languageItem) {
      const matchingVoice = voices.find(voice =>
        voice.lang.toLowerCase().includes(languageItem.language_code.toLowerCase().split('-')[0]),
      )
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }
    }
  }
  // Speak the text
  window.speechSynthesis.speak(utterance)
}
</script>

<template>
  <BaseHeader title="Edit Phone Number" :breadcrumbs="breadcrumbs" />
  <div class="relative h-[calc(100vh-190px)] overflow-y-auto mt-6">
    <form class="space-y-4 h-full" @submit.prevent="onSubmit">
      <div class="h-full rounded-lg bg-white">
        <div class="sticky top-0 right-0 z-10 w-full bg-white border rounded-t-lg px-5 py-5 flex items-center justify-between">
          <div class="text-lg font-medium text-primary/100">
            Phone Number Details
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="didStatus === 'pending'" class="grid grid-cols-2 gap-x-4 gap-y-5 w-full p-5 border-x">
          <BaseSkelton v-for="i in 10" :key="i" class="h-11 w-full mb-2" rounded="rounded-sm" />
        </div>

        <div v-else class="p-5 w-full border-x">
          <div class="grid grid-cols-2 gap-x-4 gap-y-5 items-end h-fit overflow-y-auto pb-1">
            <!-- Phone number -->
            <FormField v-slot="{ componentField, errorMessage }" name="cli">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    v-maska="'+# (###) ###-####'"
                    type="tel"
                    placeholder="Enter Phone Number"
                    :class="errorMessage && 'border-red-600'"
                    class="w-full !h-11"
                    disabled
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage class="text-sm text-left" />
              </FormItem>
            </FormField>

            <!-- Caller Name -->
            <FormField v-slot="{ componentField, errorMessage }" name="cnam">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Caller Name
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter caller name"
                    :class="errorMessage && 'border-red-600'"
                    class="w-full !h-11"
                  />
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>

            <!-- Toggle switches -->
            <FormField v-slot="{ value, handleChange }" name="default_did">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Set as mainline</p>
                  <FormControl>
                    <Switch
                      class="data-[state=checked]:bg-green-600 cursor-pointer"
                      :model-value="value"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="redirect_last_agent">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Redirect to last spoke agent</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600 cursor-pointer"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
              </FormItem>
            </FormField>

            <!-- Destination Type and Destination -->
            <template v-if="!values.redirect_last_agent">
              <div class="flex items-start gap-4 col-span-2">
                <div class="w-1/2">
                  <FormField v-slot="{ componentField, errorMessage }" name="dest_type">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        Destination Type
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                            <SelectValue placeholder="Select Destination Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-if="destTypeStatus === 'pending'" :value="null" disabled>
                              <Icon name="eos-icons:loading" />
                            </SelectItem>
                            <SelectItem v-for="item in destTypeData" v-else :key="item.dest_id" :value="item.dest_id">
                              {{ item.dest_type }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>

                <div v-if="values.dest_type !== 3" class="flex gap-2 w-1/2">
                  <div v-if="values.dest_type === 4" class="flex gap-2 w-full justify-start">
                    <FormField v-slot="{ componentField, errorMessage }" name="country_code">
                      <FormItem class="h-fit">
                        <FormLabel class="font-normal text-sm text-nowrap">
                          Counrty Code
                        </FormLabel>
                        <FormControl>
                          <Select v-bind="componentField">
                            <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-if="countryListStatus === 'pending'" :value="null" disabled>
                                <Icon name="eos-icons:loading" />
                              </SelectItem>
                              <template v-else>
                                <SelectItem v-for="item in countryList" :key="item.id" :value="item.phone_code">
                                  {{ item.country_code }} ({{ item.phone_code }})
                                </SelectItem>
                              </template>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage class="text-sm" />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField, errorMessage }" name="destination">
                      <FormItem class="w-full">
                        <FormLabel class="font-normal text-sm">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            v-maska="'(###) ###-####'"
                            type="tel"
                            placeholder="Enter Phone Number"
                            :class="errorMessage && 'border-red-600'"
                            class="w-full !h-11"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage class="text-sm" />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormField v-else v-slot="{ componentField, errorMessage }" name="destination">
                    <FormItem class="w-full">
                      <FormLabel class="font-normal text-sm">
                        {{ values.dest_type === 12 ? 'Voice Ai' : 'Destination' }}
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                            <SelectValue placeholder="Select Destination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-if="getDestinationInfo(values.dest_type ?? 0).status.value === 'pending'" :value="null" disabled>
                              <Icon name="eos-icons:loading" />
                            </SelectItem>
                            <template v-else>
                              <template v-if="values.dest_type === 0">
                                <SelectItem v-for="item in ivrData" :key="item.id" :value="String(item.id)">
                                  {{ item.ivr_desc }} - {{ item.ivr_id }}
                                </SelectItem>
                              </template>
                              <template v-else-if="[1, 2, 6].includes(values.dest_type ?? 0)">
                                <SelectItem v-for="item in extensionListData" :key="item.id" :value="String(item.id)">
                                  {{ item.first_name }} {{ item.last_name }} - {{ item.extension }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 5">
                                <SelectItem v-for="item in conferencingData" :key="item.id" :value="String(item.id)">
                                  {{ item.title }} - {{ item.conference_id }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 8">
                                <SelectItem v-for="item in ringGroupData" :key="item.id" :value="String(item.id)">
                                  {{ item.description }} - {{ item.title }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 12">
                                <SelectItem v-for="item in voiceAiData" :key="item.id" :value="String(item.id)">
                                  {{ item.title }}
                                </SelectItem>
                              </template>
                            </template>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>
              </div>
            </template>

            <div class="flex items-center gap-5">
              <!-- Enable SMS -->
              <FormField v-slot="{ value, handleChange }" name="sms">
                <FormItem class="w-full">
                  <div
                    class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                    :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                  >
                    <p>Enable SMS</p>
                    <FormControl>
                      <Switch
                        :model-value="value"
                        class="data-[state=checked]:bg-green-600 cursor-pointer"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              </FormField>

              <!-- SMS AI -->
              <FormField v-slot="{ value, handleChange }" name="enable_sms_ai">
                <FormItem class="w-full">
                  <div
                    class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                    :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                  >
                    <p>Enable SMS AI</p>
                    <FormControl>
                      <Switch
                        :model-value="value"
                        class="data-[state=checked]:bg-green-600 cursor-pointer"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              </FormField>
            </div>

            <!-- Assign to user -->
            <div v-if="values.sms">
              <FormField v-slot="{ componentField, errorMessage }" name="assigned_user_id">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Assign to User
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                        <SelectValue placeholder="Select User" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-if="userDataStatus === 'pending'" :value="null" disabled>
                          <Icon name="eos-icons:loading" />
                        </SelectItem>
                        <template v-else>
                          <SelectItem v-for="item in userData" :key="item.id" :value="item.id">
                            {{ item.first_name }} {{ item.last_name }} - {{ item.extension }}
                          </SelectItem>
                        </template>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ value, handleChange }" name="set_exclusive_for_user">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Set Exclusive For User</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600 cursor-pointer"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
              </FormItem>
            </FormField>

            <!-- Apply Call Times -->
            <FormField v-slot="{ componentField, errorMessage }" name="call_time_department_id">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Apply Call Times
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue placeholder="Select Call Times" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="callTimesStatus === 'pending'" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem :value="0">
                          No
                        </SelectItem>
                        <SelectItem v-for="item in callTimesData" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="call_time_holiday">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Apply Holiday Calendar</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600 cursor-pointer"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
              </FormItem>
            </FormField>

            <!-- Voip Provider -->
            <FormField v-slot="{ componentField, errorMessage }" name="voip_provider">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Voip Provider
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue placeholder="Select Voip Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="item in voipProviderItems" :key="item.value" :value="item.value">
                        {{ item.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>

            <!-- Out of Hours Destination -->
            <template v-if="values.call_time_holiday || values.call_time_department_id">
              <div class="flex items-start gap-4 col-span-2">
                <div class="w-1/2">
                  <FormField v-slot="{ componentField, errorMessage }" name="dest_type_ooh">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        Destination Type (Out Of Hours)
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                            <SelectValue placeholder="Select Destination Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-if="destTypeStatus === 'pending'" :value="null" disabled>
                              <Icon name="eos-icons:loading" />
                            </SelectItem>
                            <SelectItem v-for="item in destTypeData" v-else :key="item.dest_id" :value="item.dest_id">
                              {{ item.dest_type }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>

                <div v-if="values.dest_type_ooh !== 3" class="w-1/2">
                  <FormField v-if="values.dest_type_ooh === 4" v-slot="{ componentField, errorMessage }" name="forward_number_ooh">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          v-maska="'+# (###) ###-####'"
                          type="tel"
                          placeholder="Enter Phone Number"
                          :class="errorMessage && 'border-red-600'"
                          class="w-full !h-11"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>

                  <FormField v-else v-slot="{ componentField, errorMessage }" :name="destinationFieldNameOoh">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        Destination (Out Of Hours)
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                            <SelectValue placeholder="Select Destination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-if="getDestinationInfo(values.dest_type_ooh ?? 0).status.value === 'pending'" :value="null" disabled>
                              <Icon name="eos-icons:loading" />
                            </SelectItem>
                            <template v-else>
                              <template v-if="values.dest_type_ooh === 0">
                                <SelectItem v-for="item in ivrData" :key="item.id" :value="item.id">
                                  {{ item.ivr_desc }} - {{ item.ivr_id }}
                                </SelectItem>
                              </template>
                              <template v-else-if="[1, 2, 6].includes(values.dest_type_ooh ?? 0)">
                                <SelectItem v-for="item in extensionListData" :key="item.id" :value="item.id">
                                  {{ item.first_name }} {{ item.last_name }} - {{ item.extension }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type_ooh === 5">
                                <SelectItem v-for="item in conferencingData" :key="item.id" :value="item.id">
                                  {{ item.title }} - {{ item.conference_id }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type_ooh === 8">
                                <SelectItem v-for="item in ringGroupData" :key="item.id" :value="item.id">
                                  {{ item.description }} - {{ item.title }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type_ooh === 12">
                                <SelectItem v-for="item in voiceAiData" :key="item.id" :value="String(item.id)">
                                  {{ item.title }}
                                </SelectItem>
                              </template>
                            </template>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>
              </div>

              <FormField v-slot="{ value, handleChange }" name="call_screening_status">
                <FormItem>
                  <div
                    class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                    :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                  >
                    <p>Call Screening Audio</p>
                    <FormControl>
                      <Switch
                        :model-value="value"
                        class="data-[state=checked]:bg-green-600 cursor-pointer"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              </FormField>

              <div v-if="values.call_screening_status" class="col-span-2 p-4 bg-neutral-50 rounded-sm border border-zinc-100">
                <FormField v-slot="{ value, handleChange }" name="ivr_audio_option">
                  <FormItem>
                    <Tabs :model-value="value" class="w-full gap-4" @update:model-value="handleChange">
                      <TabsList class="w-full h-10 p-0.5 bg-zinc-100 rounded-[10px]">
                        <TabsTrigger v-for="(item, index) in callScreeningOptions" :key="index" :value="item.value" class="px-2 py-1.5 text-stone-900 text-xs font-medium data-[state=active]:bg-[#194B89] data-[state=active]:text-white transition-all cursor-pointer">
                          {{ item.label }}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent v-for="(option, index) in callScreeningOptions" :key="index" :value="option.value">
                        <div v-if="option.value === 'upload'">
                          <FormField name="file">
                            <FormItem>
                              <FormControl>
                                <BaseFileUploader accept=".mp3,.wav " max-size="5MB" @update:files="handleFileUpdate" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </FormField>
                        </div>
                        <div v-else class="space-y-4">
                          <div class="w-full flex gap-4 items-start">
                            <FormField v-slot="{ componentField, errorMessage }" name="language">
                              <FormItem class="w-full">
                                <FormLabel class="font-normal text-sm">
                                  Language
                                </FormLabel>
                                <FormControl>
                                  <Select v-bind="componentField">
                                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                                      <SelectValue placeholder="Select a Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem v-if="languageListStatus === 'pending'" :value="null" disabled>
                                        <Icon name="eos-icons:loading" />
                                      </SelectItem>
                                      <SelectItem v-for="item in languageList" v-else :key="item.id" :value="item.language">
                                        {{ item.language }}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage class="text-sm" />
                              </FormItem>
                            </FormField>

                            <FormField v-slot="{ componentField, errorMessage }" name="voice_name">
                              <FormItem class="w-full">
                                <FormLabel class="font-normal text-sm">
                                  Voice Name
                                </FormLabel>
                                <FormControl>
                                  <Select v-bind="componentField">
                                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                                      <SelectValue placeholder="Select a Voice Name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem v-if="voiceListStatus === 'pending'" :value="null" disabled>
                                        <Icon name="eos-icons:loading" />
                                      </SelectItem>
                                      <SelectItem v-for="item in voiceList" v-else :key="item.dest_id" :value="item.dest_id">
                                        {{ item.dest_type }}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage class="text-sm" />
                              </FormItem>
                            </FormField>
                          </div>
                          <FormField
                            v-slot="{ componentField }"
                            name="speech_text"
                          >
                            <FormItem>
                              <FormLabel class="w-full flex items-center justify-between text-normal text-sm">
                                Text
                                <Button type="button" variant="ghost" class="px-0 py-0 h-fit" @click="speakText">
                                  <Icon name="material-symbols:text-to-speech" size="14" />
                                </Button>
                              </FormLabel>
                              <FormControl>
                                <Textarea v-bind="componentField" type="text" placeholder="Type what you like your customers to hear and click on Icon to listen" class="px-3 py-3.5 min-h-[104px] placeholder:text-xs" />
                              </FormControl>
                              <FormMessage class="text-sm text-left" />
                            </FormItem>
                          </FormField>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormItem>
                </FormField>
              </div>
            </template>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="sticky bottom-0 right-0 w-full bg-white p-4 gap-2 flex items-center justify-center border rounded-b-lg">
          <Button class="w-1/2 h-[52px]" variant="outline" type="button" @click="onCancel">
            <Icon name="material-symbols:close" size="20" />
            Cancel
          </Button>
          <Button
            class="w-1/2 h-[52px]" type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting || didStatus === 'pending' || callTimesStatus === 'pending' || destTypeStatus === 'pending' || ivrStatus === 'pending' || extensionListStatus === 'pending' || conferencingStatus === 'pending' || ringGroupStatus === 'pending' || userDataStatus === 'pending'"
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
