<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useFilter } from 'reka-ui'

import { useForm } from 'vee-validate'
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

const emits = defineEmits([
  'completed',
])

const isActive = ref('Active')
const accordion = ref('')
const accordion2 = ref('')

const templates = [
  {
    id: 1,
    name: 'Template 1',
  },
  {
    id: 2,
    name: 'Template 2',
  },
  {
    id: 3,
    name: 'Template 3',
  },
]

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
    id: 0,
    name: 'Linear',
  },
  {
    id: 1,
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

const selectedCallTime = ref<{ id: number, name: string }>()

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
  useApi().post('/get-call-timings', {
  }), {
  transform: (res) => {
    return res.data
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
      title: `${item.cli}${item?.cnam ? ` - ${item.cnam}` : ''}${item.forward_number ? ` - ${item.forward_number}` : ''}`,
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
    refreshVoiceDropOptions()
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
  name: z.string().min(1, 'required').max(50),
  country_code: z.number().min(1, 'required'),
  description: z.string().min(1, 'required').max(255),
  caller_id: z.number().min(0, 'required'),
  custom_caller_id: z.string().min(1, 'required').max(50).optional().superRefine((val, ctx) => {
    if (values.caller_id === 1 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom Caller Is is required when Caller Is is Custom',
      })
    }
  }),
  dial_mode: z.string().min(1, 'required'),
  group_id: z.number().min(1, 'required').max(50),
  time_based_calling: z.boolean(),
  call_time: z.object({ id: z.number(), name: z.string() }).optional().superRefine((val, ctx) => {
    if (values.time_based_calling && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Call time is required',
      })
    }
  }),
  email: z.number().min(0, 'required'),
  sms: z.boolean(),
  send_report: z.boolean(),
  call_transfer: z.boolean(),
  disposition_id: z.array(z.number()).min(1, 'At least one disposition must be selected'),
  hopper_mode: z.number().min(0, 'required'),
  voip_configurations: z.number().min(1, 'required'),

  // if dial_mode is predictive_dial
  call_ratio: z.number().optional().superRefine((val, ctx) => {
    if (values.dial_mode !== 'super_power_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        // message: 'Call ratio is required when dialing mode is predictive dial',
        message: values.dial_mode === 'predictive_dial' ? 'Call ratio is required when dialing mode is predictive dial' : 'Simultaneous Calls is required when dialing mode is super power dial',
      })
    }
  }),
  duration: z.number().optional().superRefine((val, ctx) => {
    if (values.dial_mode !== 'super_power_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        // message: 'Duration is required when dialing mode is predictive dial',
        message: values.dial_mode === 'predictive_dial' ? 'Duration is required when dialing mode is predictive dial' : 'Time interval is required when dialing mode is super power dial',
      })
    }
  }),
  automated_duration: z.boolean().optional(),
  no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
    if (values.dial_mode === 'predictive_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No agent available action is required when dialing mode is predictive dial',
      })
    }
  }),
  amd: z.boolean().optional(),
  amd_drop_action: z.number().optional().superRefine((val, ctx) => {
    if (values.amd && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'AMD drop action is required when AMD is ON',
      })
    }
  }),
  audio_message_amd: z.number().optional().superRefine((val, ctx) => {
    // if amd_drop_action is 2 and amd is true then audio_message_amd is required
    if (values.amd_drop_action === 2 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Audio message AMD is required when AMD drop action is Audio Message',
      })
    }
  }),
  voice_message_amd: z.number().optional().superRefine((val, ctx) => {
    // if amd_drop_action is 3 and amd is true then voice_message_amd is required
    if (values.amd_drop_action === 3 && !val) {
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
  inbound_ivr_no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
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

const { handleSubmit, values, resetField, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    time_based_calling: false,
    sms: false,
    send_report: false,
    call_transfer: false,
  },
})

function onSelectCallerId(val: any) {
  if (val === 1 && !customCallerIdList.value?.length) {
    refreshCustomCallerIdList()
  }
  else {
    resetField('custom_caller_id')
  }
}

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})

const selectedDisposition = ref<any[]>([])
const open = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredDispositionList = computed(() => {
  const options = dispositionList.value.filter((item: { id: number }) => !selectedDisposition.value.includes(item.id))
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
</script>

<template>
  <!-- {{ values }} -->
  {{ errors }}
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
                <ToggleGroup v-model:model-value="isActive" type="single">
                  <ToggleGroupItem value="Active" class="!bg-[#FEF2F2] data-[state=on]:!bg-green-600 data-[state=on]:text-white font-normal gap-x-0 data-[state=on]:rounded-lg text-sm" aria-label="Status active">
                    <Icon name="stash:circle-dot" size="30" />
                    Active
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Inactive" class="!bg-[#FEF2F2] data-[state=on]:!bg-red-600 data-[state=on]:rounded-lg font-normal data-[state=on]:text-white text-sm" aria-label="Status inactive">
                    Inactive
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
          <div class="p-5 space-y-5 w-full">
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField }" class="" name="name">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="country_code">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Country Code
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Code" />
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
              <FormField v-slot="{ componentField }" class="" name="description">
                <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="caller_id">
                  <FormItem>
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
                            <SelectItem v-for="item in CallerIds" :key="item.id" :value="item.id">
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
                <FormField v-slot="{ componentField, errorMessage }" name="custom_caller_id">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Custom Caller Id
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" :disabled="values.caller_id !== 1 " class="w-full !h-11">
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
                <FormField v-slot="{ componentField, errorMessage }" name="dial_mode">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="group_id">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Caller Group
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Caller Group" />
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
                <FormField v-slot="{ componentField, errorMessage }" name="call_ratio">
                  <FormItem>
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
                            <SelectItem v-for="item in [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]" :key="item" :value="item">
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
                <FormField v-slot="{ componentField, errorMessage }" name="duration">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Duration in Sec
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in 15" :key="item" :value="item">
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
                <FormField v-slot="{ componentField, errorMessage }" name="no_agent_available_action">
                  <FormItem>
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
                <FormField v-slot="{ value, handleChange }" name="automated_duration">
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
                <FormField v-slot="{ componentField, errorMessage }" name="call_ratio">
                  <FormItem>
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
                            <SelectItem v-for="item in Array.from({ length: 30 }, (_, i) => i + 1)" :key="item" :value="item">
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
                <FormField v-slot="{ componentField, errorMessage }" name="duration">
                  <FormItem>
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
                            <SelectItem v-for="item in timeIntervals" :key="item.value" :value="item.value">
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
                <FormField v-slot="{ componentField, errorMessage }" name="redirect_to">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="outbound_ai_dropdown_audio_message">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="outbound_ai_dropdown_voice_message">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="outbound_ai_dropdown_extension">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="outbound_ai_dropdown_ring_group">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="outbound_ai_dropdown_ivr">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="voicedrop_no_agent_available_action">
                  <FormItem>
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
                <FormField v-slot="{ componentField, errorMessage }" name="inbound_ivr_no_agent_available_action">
                  <FormItem>
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
              <div v-if="values.dial_mode !== 'super_power_dial'">
                <FormField v-slot="{ value, handleChange }" name="amd">
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
              <FormField v-if="values.amd" v-slot="{ componentField, errorMessage }" name="amd_drop_action">
                <FormItem>
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
                <FormField v-if="values.amd_drop_action === 2" v-slot="{ componentField, errorMessage }" name="audio_message_amd">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Audion Message AMD
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
                <FormField v-if="values.amd_drop_action === 3" v-slot="{ componentField, errorMessage }" name="voice_message_amd">
                  <FormItem>
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
                <div class="flex items-center justify-between px-5" :class="accordion === 'item-1' && 'border-b'">
                  <div class="text-[16px] font-medium text-primary/100">
                    Time Based Calling
                  </div>
                  <AccordionTrigger>
                    <template #icon>
                      <FormField v-slot="{ value, handleChange }" name="time_based_calling">
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
                    </template>
                  </AccordionTrigger>
                </div>
                <AccordionContent class="p-5">
                  <Accordion v-model="accordion2" collapsible class="">
                    <AccordionItem value="item-2" class="">
                      <FormField v-slot="{ errorMessage }" v-model="selectedCallTime" name="call_time">
                        <FormItem>
                          <FormControl>
                            <AccordionTrigger :class="[selectedCallTime && '!text-black', errorMessage && 'border-red-600']" class=" border rounded-lg h-11 px-3 py-[14px] flex items-center hover:no-underline text-muted-foreground text-sm font-normal">
                              {{ selectedCallTime ? selectedCallTime?.name : 'Select Call Time' }}
                            </AccordionTrigger>
                          </FormControl>
                          <FormMessage class="text-sm" />
                        </FormItem>
                      </FormField>

                      <AccordionContent class="p-3 border rounded-lg mt-1 ">
                        <CallTimesCreate>
                          <Button type="button" class="w-full rounded-[8px]">
                            Create Custom Call Time <Icon name="lucide:plus" />
                          </Button>
                        </CallTimesCreate>
                        <Command v-model="selectedCallTime" selection-behavior="toggle" class="max-h-[300px] overflow-y-auto" @update:model-value="onSelectCallTime">
                          <CommandList>
                            <CommandGroup>
                              <template v-if="callTimingListStatus === 'pending'">
                                <CommandItem v-for="item in 10" :key="item" :value="item" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                                  <Skeleton class="h-[50px] w-full" />
                                </CommandItem>
                              </template>
                              <CommandItem v-for="item in callTimingList" v-else :key="item.name" :value="item" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                                {{ item.name }}
                                <Button size="icon" variant="outline">
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
              <FormField v-slot="{ componentField, errorMessage }" name="email">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Send Email
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                        <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select" />
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
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/2 flex items-center justify-between">
              <div class="flex flex-col gap-y-3">
                <FormField v-slot="{ value, handleChange }" name="sms">
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
                <FormField v-slot="{ value, handleChange }" name="send_report">
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
                <FormField v-slot="{ value, handleChange }" name="call_transfer">
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
                <FormField v-slot="{ componentField, errorMessage }" name="hopper_mode">
                  <FormItem>
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
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" name="voip_configurations">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      OutBound Line
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select" />
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
              <FormField v-slot="{ errorMessage }" v-model="selectedDisposition" name="disposition_id">
                <FormItem>
                  <FormControl>
                    <Combobox v-model="selectedDisposition" v-model:open="open" :ignore-filter="true">
                      <ComboboxAnchor as-child>
                        <TagsInput v-model="selectedDisposition" class="px-2 gap-2 [&_svg]:hidden w-full [&_[data-slot='command-input-wrapper']]:border-none [&_[data-slot='command-input-wrapper']]:px-1" @click="open = true">
                          <div class="flex gap-2 flex-wrap items-center ">
                            <TagsInputItem v-for="item in selectedDisposition" :key="item" class="rounded-[6px] border border-[#00A086] bg-[#00A0861A] py-3 px-[7px] flex item-center justify-between gap-x-2" :value="item">
                              <div>
                                {{ dispositionList.find((val: { id: any }) => val.id === item).title }}
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
      <Button class="w-full h-[52px]" type="submit" @click="onSubmit">
        Continue
        <Icon name="lucide:arrow-right" size="20" />
      </Button>
    </div>
  </div>
</template>
