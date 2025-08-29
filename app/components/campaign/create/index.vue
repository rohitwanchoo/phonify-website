<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { toTypedSchema } from '@vee-validate/zod'
import moment from 'moment'
import { useFilter } from 'reka-ui'
import { useForm, validate } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Skeleton } from '@/components/ui/skeleton'

import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'

const props = defineProps<Props>()

const emits = defineEmits([
  'completed',
])

const formState = useState<Campaign>('create-campaign-state')
const route = useRoute()
const id = route.query.id

const isEdit = computed(() => !!id)
const accordion = ref('')
const accordion2 = ref('')

interface Props {
  dataLoading: boolean
}

const CallerIds = [
  {
    id: 0,
    name: 'Area code',
  },
  {
    id: 1,
    name: 'Custom (Enabled for Custom CLI)',
  },
  {
    id: 3,
    name: 'Area Code and Randomizer',
  },
]

const sendEmailOptions = [
  {
    id: 0,
    name: 'No',
  },
  {
    id: 1,
    name: 'With User Email',
  },
  {
    id: 2,
    name: 'With Campaign Email',
  },
  {
    id: 3,
    name: 'With System Email ',
  },
]

const hooperModes = [
  {
    id: 1,
    name: 'Linear',
  },
  {
    id: 2,
    name: 'Random',
  },
]

const timeIntervals = [
  {
    value: 60,
    title: '1 Min',
  },
  {
    value: 120,
    title: '2 Min',
  },
  {
    value: 300,
    title: '5 Min',
  },
  {
    value: 600,
    title: '10 Min',
  },
  {
    value: 1200,
    title: '20 Min',
  },
  {
    value: 1800,
    title: '30 Min',
  },
]

const redirectToList = [
  {
    value: 1,
    title: 'Audio Message',
  },
  {
    value: 2,
    title: 'Voice Template',
  },
  {
    value: 3,
    title: 'Extension',
  },
  {
    value: 4,
    title: 'RingGroup',
  },
  {
    value: 5,
    title: 'ivr',
  },
]

interface CallTimingList {
  id: number
  title: string
  description: string
  week_plan: Partial<Record<string, { start: string, end: string }>>
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}
const selectedRowData = ref<CallTimingList>()
const callTimeSheet = ref<boolean>(false)
// country code list
const { data: countyCodeList } = await useLazyAsyncData('get-country-code-list', () =>
  useApi().post('/country-list', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// call timing list
const { data: callTimingList, status: callTimingListStatus, refresh: callTimingListRefresh } = await useLazyAsyncData('get-call-timings-campaign', () =>
  useApi().get('/call-timers', {
  }), {
  transform: (res) => {
    return res.data.data
  },
  immediate: false,
})

// // email template list
// const { data: emailTemplateList } = await useLazyAsyncData('get-email-template', () =>
//   useApi().get('/email-templates', {

//   }), {
//   transform: (res) => {
//     return res.data
//   },
// })

// dialing mode list
const { data: dialingModeList } = await useLazyAsyncData('get-dialing-mode-list', () =>
  useApi().get('/campaign-type', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// custom caller id list
const { data: customCallerIdList, refresh: refreshCustomCallerIdList, status: customCallerIdListStatus } = await useLazyAsyncData('get-custom-caller-id-list', () =>
  useApi().post('/did', {

  }), {
  transform: (res) => {
    const data = res.data || []
    return data.map((item: { cli: string, cnam: string, forward_number: string }) => ({
      ...item,
      title: `${formatNumber(item?.cli)}${item?.cnam ? ` - ${item.cnam}` : ''}${item.forward_number ? ` - ${item.forward_number}` : ''}`,
    }))
  },
  immediate: false,
})

// extension group list
const { data: extensionGroupList } = await useLazyAsyncData('get-extension-group-list', () =>
  useApi().get('/extension-group', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// disposition list
const { data: dispositionList } = await useLazyAsyncData('get-disposition-list', () =>
  useApi().post('/disposition', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// outbound line list
const { data: outboundLineList } = await useLazyAsyncData('get-outbound-line-list', () =>
  useApi().get('/voip-configurations', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// No Agent Available List
const NoAgentAvailableList = [
  {
    id: 1,
    name: 'Hang Up',
  },
  {
    id: 2,
    name: 'Voice Drop',
  },
  {
    id: 3,
    name: 'Inbound IVR',
  },
]

// amd drop action list
const amdDropActions = [
  {
    id: 1,
    name: 'Hang Up',
  },
  {
    id: 2,
    name: 'Audio Message',
  },
  {
    id: 3,
    name: 'Voice template',
  },
]

// Audio Message AMD List
const { data: audioMessageAMDList, status: audioMessageAMDListStatus, refresh: refreshAudioMessageAMDList } = await useLazyAsyncData('get-audio-message-amd-list', () =>
  useApi().get('/audio-message', {

  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

// Voice Template AMD List
const { data: voiceTemplateAMDList, status: voiceTemplateAMDListStatus, refresh: refreshVoiceTemplateAMDList } = await useLazyAsyncData('get-voice-template-amd-list', () =>
  useApi().get('/voice-templete', {
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

// voice drop option list / extension
const { data: voiceDropOptions, status: voiceDropOptionsStatus, refresh: refreshVoiceDropOptions } = await useLazyAsyncData('get-voice-drop-options', () =>
  useApi().post('/active-extension-group-list', {
  }), {
  transform: (res) => {
    return res
  },
  immediate: false,
})

// inbound IVR option list
const { data: inboundIVROptions, status: inboundIVROptionsStatus, refresh: refreshInboundIVROptions } = await useLazyAsyncData('get-inbound-ivr-options', () =>
  useApi().post('/ivr', {
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

const { data: ringGroupList, status: ringGroupListStatus, refresh: refreshRingGroupList } = await useLazyAsyncData('get-ring-group-list', () =>
  useApi().post('/ring-group', {
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

function onEnableTimeBasedCalling(val: boolean) {
  if (val)
    accordion.value = 'item-1'
  else
    accordion.value = ''
  if (val && !callTimingList.value?.length) {
    callTimingListRefresh()
  }
}

function onAmdDropActionChange(val: any) {
  if (val === 2 && !audioMessageAMDList.value?.length) {
    refreshAudioMessageAMDList()
  }
  if (val === 3 && !voiceTemplateAMDList.value?.length) {
    refreshVoiceTemplateAMDList()
  }
}

function onSelectNoAgentAvailableAction(val: any) {
  if (val === 2 && !voiceDropOptions.value?.length) {
    refreshVoiceDropOptions().then(() => {
      console.log(voiceDropOptions.value)
    })
  }
  if (val === 3 && !inboundIVROptions.value?.length) {
    refreshInboundIVROptions()
  }
}
function onSelectRedirectTo(val: any) {
  if (val === 1 && !audioMessageAMDList.value?.length) {
    refreshAudioMessageAMDList()
  }
  if (val === 2 && !voiceTemplateAMDList.value?.length) {
    refreshVoiceTemplateAMDList()
  }
  if (val === 3 && !voiceDropOptions.value?.length) {
    refreshVoiceDropOptions()
  }
  if (val === 4 && !ringGroupList.value?.length) {
    refreshRingGroupList()
  }
  if (val === 5 && !inboundIVROptions.value?.length) {
    refreshInboundIVROptions()
  }
}

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Name is required').max(50),
  country_code: z.number().min(1, 'Country code is required'),
  description: z.string().min(1, 'Descriptions is required').max(255),
  caller_id: z.string().min(1, 'Caller ID is required'),
  custom_caller_id: z.string().max(50).optional().superRefine((val, ctx) => {
    if (formState.value.caller_id === '1' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom Caller Is is required when Caller Is is Custom',
      })
    }
  }),
  dial_mode: z.string().min(1, 'Dialing mode is required'),
  group_id: z.number().min(1, 'Caller group is required').max(50),
  time_based_calling: z.boolean(),
  call_time: z.object({ id: z.number().optional(), title: z.string().optional() }).optional().superRefine((val, ctx) => {
    if (values.time_based_calling && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Call time is required',
      })
    }
  }),
  email: z.number().min(0, 'Email is required'),
  sms: z.boolean(),
  send_report: z.boolean(),
  call_transfer: z.boolean(),
  disposition_id: z.array(z.number()).min(1, 'Disposition is required'),
  hopper_mode: z.number().min(0, 'Hopper Mode is required'),
  voip_configurations: z.number().min(1, 'Outbound Line is required'),

  // if dial_mode is predictive_dial
  call_ratio: z.string().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode !== 'super_power_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        // message: 'Call ratio is required when dialing mode is predictive dial',
        message: formState.value.dial_mode === 'predictive_dial' ? 'Call ratio is required when dialing mode is predictive dial' : 'Simultaneous Calls is required when dialing mode is super power dial',
      })
    }
  }),
  duration: z.string().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode !== 'super_power_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        // message: 'Duration is required when dialing mode is predictive dial',
        message: formState.value.dial_mode === 'predictive_dial' ? 'Duration is required when dialing mode is predictive dial' : 'Time interval is required when dialing mode is super power dial',
      })
    }
  }),
  automated_duration: z.boolean().optional(),
  no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode === 'predictive_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No agent available action is required when dialing mode is predictive dial',
      })
    }
  }),
  amd: z.boolean().optional(),
  amd_drop_action: z.number().optional().superRefine((val, ctx) => {
    if (formState.value.amd && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'AMD drop action is required when AMD is ON',
      })
    }
  }),
  audio_message_amd: z.number().optional().superRefine((val, ctx) => {
    // if amd_drop_action is 2 and amd is true then audio_message_amd is required
    if (formState.value.amd_drop_action === 2 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Audio message AMD is required when AMD drop action is Audio Message',
      })
    }
  }),
  voice_message_amd: z.number().optional().superRefine((val, ctx) => {
    // if amd_drop_action is 3 and amd is true then voice_message_amd is required
    if (formState.value.amd_drop_action === 3 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Voice template AMD is required when AMD drop action is Voice template',
      })
    }
  }),
  // if no_agent_available_action is 2 and amd is true then voicedrop_no_agent_available_action is required
  voicedrop_no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
    if (values.no_agent_available_action === 2 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Voice drop option is required when no agent available action is Voice drop option',
      })
    }
  }),
  // if no_agent_available_action is 3 and amd is true then inbound_ivr_no_agent_available_action is required
  inbound_ivr_no_agent_available_action: z.string().optional().superRefine((val, ctx) => {
    if (values.no_agent_available_action === 3 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Inbound IVR is required when no agent available action is Inbound IVR',
      })
    }
  }),

  // if dial_mode is outbound_ai
  redirect_to: z.number().optional().superRefine((val, ctx) => {
    if (values.dial_mode === 'outbound_ai' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Redirect to is required',
      })
    }
  }),

  outbound_ai_dropdown_audio_message: z.number().optional().superRefine((val, ctx) => {
    if (values.redirect_to === 1 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Audio message is required',
      })
    }
  }),

  outbound_ai_dropdown_voice_message: z.number().optional().superRefine((val, ctx) => {
    if (values.redirect_to === 2 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Voice template is required',
      })
    }
  }),

  outbound_ai_dropdown_extension: z.number().optional().superRefine((val, ctx) => {
    if (values.redirect_to === 3 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Extension is required',
      })
    }
  }),

  outbound_ai_dropdown_ring_group: z.number().optional().superRefine((val, ctx) => {
    if (values.redirect_to === 4 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ring group is required',
      })
    }
  }),

  outbound_ai_dropdown_ivr: z.number().optional().superRefine((val, ctx) => {
    if (values.redirect_to === 5 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'IVR is required',
      })
    }
  }),

}))

const { handleSubmit, values, resetField, errors, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    country_code: 0,
    description: '',
    caller_id: '',
    dial_mode: '',
    group_id: 0,
    voip_configurations: 0,
    disposition_id: [],
    call_time: {},
    time_based_calling: false,
    inbound_ivr_no_agent_available_action: '',
    voicedrop_no_agent_available_action: 0,
    no_agent_available_action: 0,
    outbound_ai_dropdown_ivr: 0,
    sms: false,
    send_report: false,
    call_transfer: false,
  },
})

function onSelectCallerId(val: any) {
  if (val === '1' && !customCallerIdList.value?.length) {
    refreshCustomCallerIdList()
  }
  else {
    resetField('custom_caller_id')
  }
}

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  if (isEdit.value) {
    emits('completed')
    return
  }
  loading.value = true
  const payload = {
    ...values,
    amd: formState.value?.amd ? '1' : ' 0',
    sms: formState.value?.sms ? 1 : 0,
    send_report: formState.value?.send_report ? 1 : 0,
    call_transfer: formState.value?.call_transfer ? '1' : '0',
    automated_duration: formState.value?.automated_duration ? '1' : '0',
    time_based_calling: formState.value?.time_based_calling ? 1 : 0,
    status: formState.value.status,
    call_schedule_id: formState.value.call_time?.id,
    // TODO: need info about below
    is_deleted: 0,

  }

  // remove undefined keys from payload
  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined),
  )
  useApi().post('/add-campaign', cleanedPayload).then(async (res: any) => {
    if (res.data.status) {
      await navigateTo({ query: { id: res.data.id } })
      emits('completed')
    }
    showToast({
      message: res.data.message,
    })
  }).catch((err: any) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  }).finally(() => {
    loading.value = false
  })
  // emits('completed')
  // console.log('Form submitted!', values)
})

const open = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredDispositionList = computed(() => {
  const options = dispositionList.value.filter((item: { id: number }) => !formState.value?.disposition_id?.includes(item.id))
  return searchTerm.value ? options.filter((option: { title: string }) => contains(option.title, searchTerm.value)) : options
})

function onSelectCallTime() {
  accordion2.value = ''
}

function onSelectDialMode(val: any): void {
  if (val === 'predictive_dial') {
    setFieldValue('automated_duration', false)
    setFieldValue('amd', false)
  }
  else {
    // remove automated_duration field
    setFieldValue('automated_duration', undefined)
    setFieldValue('amd', undefined)
  }
}

watch(() => formState.value?.time_based_calling, (newVal) => {
  if (newVal && isEdit.value) {
    accordion.value = 'item-1'
  }
})

onMounted(() => {
  if (!isEdit.value) {
    resetForm()
  }
})
</script>

<template>
  <div class=" relative h-[calc(100vh-190px)]">
    <div class=" m-5">
      <form class="space-y-4" @submit="onSubmit">
        <!-- CAMPAIGN DETAILS -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-[25.5px] pb-[17.5px] flex items-center justify-between">
            <div class="text-[16px] font-medium text-primary/100">
              Campaign Details
            </div>
            <div class="flex items-center gap-x-2">
              <div class="text-primary text-sm font-normal">
                status:
              </div>
              <div class="bg-[#FEF2F2] rounded-lg">
                <ToggleGroup v-model:model-value="formState.status" type="single">
                  <ToggleGroupItem :value="1" class="!bg-[#FEF2F2] data-[state=on]:!bg-green-600 data-[state=on]:text-white font-normal gap-x-0 data-[state=on]:rounded-lg text-sm" aria-label="Status active">
                    <Icon name="stash:circle-dot" size="30" />
                    Active
                  </ToggleGroupItem>
                  <ToggleGroupItem :value="0" class="!bg-[#FEF2F2] data-[state=on]:!bg-red-600 data-[state=on]:rounded-lg font-normal data-[state=on]:text-white text-sm" aria-label="Status inactive">
                    Inactive
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
          <div class="p-5 space-y-5 w-full">
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField }" v-model="formState.title" class="" name="title">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter Campaign Name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.country_code" name="country_code">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Country Code
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in countyCodeList" :key="item.id" :value="item.phonecode">
                              {{ item.name }} (+{{ item.phonecode }})
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <div class="w-full">
              <FormField v-slot="{ componentField }" v-model="formState.description" class="" name="description">
                <FormItem v-auto-animate>
                  <FormLabel class="font-normal text-sm">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter Campaign Name" v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>

        <!-- Caller Details -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Caller Details
            </div>
          </div>
          <div class="p-5 space-y-5 w-full">
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.caller_id" name="caller_id">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Caller Id
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" @update:model-value="onSelectCallerId">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Caller Id" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in CallerIds" :key="item.id" :value="String(item.id)">
                              {{ item.name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.custom_caller_id" name="custom_caller_id">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Custom Caller Id
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" :disabled="values.caller_id !== '1' " class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Custom Caller Id" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="customCallerIdListStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in customCallerIdList" v-else :key="item.id" :value="item.cli">
                              {{ item.title }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.dial_mode" name="dial_mode">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Dialing Mode
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" @update:model-value="onSelectDialMode">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Dialing Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in dialingModeList" :key="item.id" :value="item.title_url">
                              {{ item.title }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.group_id" name="group_id">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Caller Group
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select Caller Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in extensionGroupList" :key="item.id" :value="item.id">
                              {{ item.title }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- if dialing mode is  predictive dial -->
            <div v-if="values.dial_mode === 'predictive_dial'" class="grid grid-cols-2 gap-4">
              <div class="">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.call_ratio" name="call_ratio">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Call Ratio
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Call Ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]" :key="item" :value="String(item)">
                              {{ item }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.duration" name="duration">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Duration in Sec
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in 15" :key="item" :value="String(item)">
                              {{ item }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.no_agent_available_action" name="no_agent_available_action">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      No Agent available Action
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" @update:model-value="onSelectNoAgentAvailableAction">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select No Agent Available Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in NoAgentAvailableList" :key="item.id" :value="item.id">
                              {{ item.name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid grid-cols-2 pt-2">
                <FormField v-slot="{ value, handleChange }" v-model="formState.automated_duration" name="automated_duration">
                  <FormItem class="flex flex-col gap-y-3">
                    <FormLabel class="text-sm font-normal">
                      Automated Duration
                    </FormLabel>
                    <FormControl>
                      <Switch
                        id="send-sms"
                        class="data-[state=checked]:bg-green-600"
                        :model-value="value"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- If Dialing mode is outbound_ai -->
            <div v-if="values.dial_mode === 'outbound_ai'" class="grid grid-cols-2 gap-4">
              <div>
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.call_ratio" name="call_ratio">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Simultaneous Calls
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Simultaneous Calls" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in Array.from({ length: 30 }, (_, i) => i + 1)" :key="item" :value="String(item)">
                              {{ item }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div>
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.duration" name="duration">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Time Interval
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Time interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in timeIntervals" :key="item.value" :value="String(item.value)">
                              {{ item.title }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div>
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.redirect_to" name="redirect_to">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Redirect To
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" @update:model-value="onSelectRedirectTo">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Redirect To" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in redirectToList" :key="item.value" :value="item.value">
                              {{ item.title }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <!-- If Redirect to is audio message -->
              <div v-if="values.redirect_to === 1">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.outbound_ai_dropdown_audio_message" name="outbound_ai_dropdown_audio_message">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Audio Message
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Audio Message" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="audioMessageAMDListStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in audioMessageAMDList" v-else :key="item.id" :value="item.id">
                              {{ item.ann_id }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <!-- If Redirect to is voice template -->
              <div v-if="values.redirect_to === 2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.outbound_ai_dropdown_voice_message" name="outbound_ai_dropdown_voice_message">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Voice Template
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Audio Message" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="voiceTemplateAMDListStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in voiceTemplateAMDList" v-else :key="item.templete_id" :value="item.templete_id">
                              {{ item.templete_name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <!-- If Redirect to is extension -->
              <div v-if="values.redirect_to === 3">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.outbound_ai_dropdown_extension" name="outbound_ai_dropdown_extension">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Extension
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Extension" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="voiceDropOptionsStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in voiceDropOptions" :key="item.id" :value="item.id">
                              {{ item.first_name }} {{ item.last_name }} - {{ item.extension }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <!-- If Redirect to is ring group -->
              <div v-if="values.redirect_to === 4">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.outbound_ai_dropdown_ring_group" name="outbound_ai_dropdown_ring_group">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Ring Group
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Ring Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="ringGroupListStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in ringGroupList" v-else :key="item.id" :value="item.id">
                              {{ item.title }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <!-- If Redirect to is ivr -->
              <div v-if="values.redirect_to === 5">
                <FormField v-slot="{ componentField, errorMessage, value }" v-model="formState.outbound_ai_dropdown_ivr" name="outbound_ai_dropdown_ivr">
                  {{ value }}
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      IVR
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select IVR Option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="inboundIVROptionsStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in inboundIVROptions" :key="item.id" :value="item.id">
                              {{ item.ivr_desc }} - {{ item.ivr_id }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- No agent available action -->
            <div class="grid grid-cols-2 gap-4">
              <!-- if no_agent_available_action is 2(voice drop) -->
              <div v-if="values.no_agent_available_action === 2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.voicedrop_no_agent_available_action" name="voicedrop_no_agent_available_action">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Voice Drop Option
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Inbound IVR Option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="voiceDropOptionsStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in voiceDropOptions" :key="item.id" :value="item.id">
                              {{ item.first_name }} {{ item.last_name }} - {{ item.extension }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <!-- if no_agent_available_action is 3(inbound ivr) -->
              <div v-if="values.no_agent_available_action === 3">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.inbound_ivr_no_agent_available_action" name="inbound_ivr_no_agent_available_action">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Inbound IVR Option
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Inbound IVR Option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="inboundIVROptionsStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in inboundIVROptions" :key="item.ivr_id" :value="item.ivr_id">
                              {{ item.ivr_desc }} - {{ item.ivr_id }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- AMD section -->
            <div class="grid grid-cols-2 pt-2 gap-4">
              <div v-if="values.dial_mode && values.dial_mode !== 'super_power_dial'">
                <FormField v-slot="{ value, handleChange }" v-model="formState.amd" name="amd">
                  <FormItem class="flex flex-col gap-y-3">
                    <FormLabel class="text-sm font-normal">
                      AMD
                    </FormLabel>
                    <FormControl>
                      <Switch
                        id="send-sms"
                        class="data-[state=checked]:bg-green-600"
                        :model-value="value"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
              <!-- If AMD is ON -->
              <FormField v-if="values.amd" v-slot="{ componentField, errorMessage }" v-model="formState.amd_drop_action" name="amd_drop_action">
                <FormItem v-auto-animate>
                  <FormLabel class="font-normal text-sm">
                    AMD Drop Action
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField" @update:model-value="onAmdDropActionChange">
                      <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                        <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select AMD Drop Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="item in amdDropActions" :key="item.id" :value="item.id">
                            {{ item.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
              <div>
                <!-- When AMD Drop action is Audio Message -->
                <FormField v-if="values.amd_drop_action === 2" v-slot="{ componentField, errorMessage }" v-model="formState.audio_message_amd" name="audio_message_amd">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Audio Message AMD
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Audio Message AMD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="audioMessageAMDListStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in audioMessageAMDList" v-else :key="item.id" :value="item.id">
                              {{ item.ann_id }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>

                <!-- When AMD Drop action is voice template -->
                <FormField v-if="values.amd_drop_action === 3" v-slot="{ componentField, errorMessage }" v-model="formState.voice_message_amd" name="voice_message_amd">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Voice Template AMD
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Voice Template AMD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <div v-if="voiceTemplateAMDListStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                              <Icon name="eos-icons:loading" />
                            </div>
                            <SelectItem v-for="item in voiceTemplateAMDList" v-else :key="item.templete_id" :value="item.templete_id">
                              {{ item.templete_name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Based Calling -->
        <div class="border rounded-lg bg-white">
          <div class=" ">
            <Accordion v-model="accordion" collapsible>
              <AccordionItem value="item-1" class="">
                <div class="flex items-center justify-between px-5 h-[57px]" :class="accordion === 'item-1' && 'border-b'">
                  <div class="text-[16px] font-medium text-primary/100">
                    Time Based Calling
                  </div>
                  <div>
                    <div>
                      <FormField v-slot="{ value, handleChange }" v-model="formState.time_based_calling" name="time_based_calling">
                        <FormItem class="flex flex-row items-center justify-between">
                          <FormControl>
                            <Switch
                              class="data-[state=checked]:bg-green-600"
                              :model-value="value"
                              @update:model-value="(val) => {
                                handleChange(val);
                                onEnableTimeBasedCalling(val);
                              }"
                            />
                          </FormControl>
                        </FormItem>
                      </FormField>
                    </div>
                  </div>
                </div>
                <AccordionContent class="p-5">
                  <Accordion v-model="accordion2" collapsible class="">
                    <AccordionItem value="item-2" class="">
                      <FormField v-slot="{ errorMessage }" v-model="formState.call_time" name="call_time">
                        <FormItem v-auto-animate>
                          <FormControl>
                            <AccordionTrigger :class="[(formState.call_time && Object.keys(formState.call_time).length) && '!text-black', errorMessage && 'border-red-600']" class=" border rounded-lg h-11 px-3 py-[14px] flex items-center hover:no-underline text-muted-foreground text-sm font-normal">
                              {{ formState.call_time && Object.keys(formState.call_time).length ? formState.call_time.title : 'Select Call Time' }}
                            </AccordionTrigger>
                          </FormControl>
                          <div v-if="errorMessage" class="text-red-600 text-sm">
                            {{ errorMessage === 'Required' ? 'Call Time is required' : errorMessage }}
                          </div>
                        </FormItem>
                      </FormField>

                      <AccordionContent class="p-3 border rounded-lg mt-1 ">
                        <CallTimesCreate @complete="callTimingListRefresh()">
                          <Button type="button" class="w-full rounded-[8px]">
                            Create Custom Call Time <Icon name="lucide:plus" />
                          </Button>
                        </CallTimesCreate>
                        <Command v-model="formState.call_time" selection-behavior="toggle" class="max-h-[300px] overflow-y-auto" @update:model-value="onSelectCallTime">
                          <CommandList>
                            <CommandGroup>
                              <template v-if="callTimingListStatus === 'pending'">
                                <CommandItem v-for="item in 10" :key="item" :value="item" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                                  <Skeleton class="h-[50px] w-full" />
                                </CommandItem>
                              </template>
                              <CommandItem v-for="item in callTimingList" v-else :key="item.title" :value="item" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                                {{ item.title }}
                                <Button type="reset" size="icon" variant="outline" @click.stop="() => { selectedRowData = item; callTimeSheet = true }">
                                  <Icon name="mdi:eye" />
                                </Button>
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <!-- Send Details -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Send Details (temp.)
            </div>
          </div>
          <div class="p-5 gap-x-5 w-full flex items-center">
            <div class="w-1/2">
              <!-- <Label class="text-sm font-normal mb-5">Send Email</Label> -->
              <FormField v-slot="{ componentField, errorMessage }" v-model="formState.email" name="email">
                <FormItem v-auto-animate>
                  <FormLabel class="font-normal text-sm">
                    Send Email
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                        <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="item in sendEmailOptions" :key="item.id" :value="item.id">
                            {{ item.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <!-- <FormMessage class="text-sm" /> -->
                  <div v-if="errorMessage" class="text-red-600 text-sm">
                    {{ errorMessage === 'Required' ? 'Email is required' : errorMessage }}
                  </div>
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/2 flex items-center justify-between">
              <div class="flex flex-col gap-y-3">
                <FormField v-slot="{ value, handleChange }" v-model="formState.sms" name="sms">
                  <FormItem class="flex flex-col gap-y-3">
                    <FormLabel class="text-sm font-normal">
                      Send SMS
                    </FormLabel>
                    <FormControl>
                      <Switch
                        id="send-sms"
                        class="data-[state=checked]:bg-green-600"
                        :model-value="value"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
              <div class="flex flex-col gap-y-3">
                <FormField v-slot="{ value, handleChange }" v-model="formState.send_report" name="send_report">
                  <FormItem class="flex flex-col gap-y-3">
                    <FormLabel class="text-sm font-normal">
                      Send Report
                    </FormLabel>
                    <FormControl>
                      <Switch
                        id="send-report"
                        class="data-[state=checked]:bg-green-600"
                        :model-value="value"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
              <div class="flex flex-col gap-y-3">
                <FormField v-slot="{ value, handleChange }" v-model="formState.call_transfer" name="call_transfer">
                  <FormItem class="flex flex-col gap-y-3">
                    <FormLabel class="text-sm font-normal">
                      Call Transfer
                    </FormLabel>
                    <FormControl>
                      <Switch
                        class="data-[state=checked]:bg-green-600"
                        :model-value="value"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Details -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Other Details
            </div>
          </div>
          <div class="p-5">
            <div class=" gap-x-5 w-full flex items-start">
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.hopper_mode" name="hopper_mode">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      Hopper Mode Type
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in hooperModes" :key="item.id" :value="item.id">
                              {{ item.name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div v-if="errorMessage" class="text-red-600 text-sm">
                      {{ errorMessage === 'Required' ? 'Hopper Mode is required' : errorMessage }}
                    </div>
                    <!-- <FormMessage class="text-sm" /> -->
                  </FormItem>
                </FormField>
              </div>
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="formState.voip_configurations" name="voip_configurations">
                  <FormItem v-auto-animate>
                    <FormLabel class="font-normal text-sm">
                      OutBound Line
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11 truncate">
                          <SelectValue class="text-sm data-[placeholder]:text-muted-foreground truncate" placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in outboundLineList" :key="item.id" :value="item.id">
                              {{ item.name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <div class="mt-5">
              <Label class="text-sm font-normal">Disposition</Label>
              <FormField v-slot="{ errorMessage }" v-model="formState.disposition_id" name="disposition_id">
                <FormItem v-auto-animate>
                  <FormControl>
                    <Combobox v-model="formState.disposition_id" v-model:open="open" :ignore-filter="true">
                      <ComboboxAnchor as-child>
                        <TagsInput v-model="formState.disposition_id" class="px-2 gap-2 [&_svg]:hidden w-full [&_[data-slot='command-input-wrapper']]:border-none [&_[data-slot='command-input-wrapper']]:px-1" @click="open = true">
                          <div class="flex gap-2 flex-wrap items-center ">
                            <TagsInputItem v-for="item in formState.disposition_id" :key="item" class="rounded-[6px] border border-[#00A086] bg-[#00A0861A] py-3 px-[7px] flex item-center justify-between gap-x-2" :value="item">
                              <div>
                                {{ dispositionList?.find((val: { id: any }) => val.id === item).title }}
                              </div>
                              <TagsInputItemDelete class="mr-0">
                                <Icon name="lucide:x" />
                              </TagsInputItemDelete>
                            </TagsInputItem>
                          </div>
                          <ComboboxInput v-model="searchTerm" as-child class="border-none ">
                            <TagsInputInput placeholder="disposition..." class=" w-full p-0 border-none focus-visible:ring-0 h-auto " @keydown.enter.prevent />
                          </ComboboxInput>
                        </TagsInput>

                        <ComboboxList class="w-[--reka-popper-anchor-width]">
                          <ComboboxEmpty />
                          <ComboboxGroup class="w-[400px]">
                            <ComboboxItem
                              v-for="item in filteredDispositionList" :key="item.id" :value="item.id"
                              @select.prevent="(ev) => {
                                searchTerm = ''
                                setFieldValue('disposition_id', [...(values.disposition_id ?? []), ev.detail.value as number])
                                // selectedDisposition.push(ev.detail.value)
                                // validateField('disposition_id')

                                if (filteredDispositionList.length === 0) {
                                  open = false
                                }
                              }"
                            >
                              {{ item.title }}
                            </ComboboxItem>
                          </ComboboxGroup>
                        </ComboboxList>
                      </ComboboxAnchor>
                    </Combobox>
                  </FormControl>

                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4">
      <Button class="w-full h-[52px]" type="submit" :disabled="dataLoading" :loading="loading" @click="onSubmit">
        Continue
      </Button>
    </div>
  </div>

  <CallTimesTableSheet v-model:open="callTimeSheet" :call-time="selectedRowData as CallTimingList" />
</template>
