<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { toTypedSchema } from '@vee-validate/zod'

import { useForm } from 'vee-validate'

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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

import { Switch } from '~/components/ui/switch'

const formState = useState<Campaign>('create-campaign-state')

const { callerIds, NoAgentAvailableList, timeIntervals, redirectToList, amdDropActions } = useCreateCampaign()

const formSchema = toTypedSchema(
  z.object({
    caller_id: z.string().min(1, 'Caller ID is required'),
    custom_caller_id: z.string().min(1, 'required').max(50).optional(),
    dial_mode: z.string().min(1, 'Dialing mode is required'),
    group_id: z.number().min(1, 'Caller group is required').max(50),
    call_ratio: z.string().optional().superRefine((val, ctx) => {
    // if dial_mode is predictive_dial
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
    no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
      if (formState.value.dial_mode === 'predictive_dial' && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No agent available action is required when dialing mode is predictive dial',
        })
      }
    }),
    automated_duration: z.boolean().optional(),
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
    voicedrop_no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
      if (values.no_agent_available_action === 2 && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Voice drop option is required when no agent available action is Voice drop option',
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
  }),
)

const { handleSubmit, resetForm, values, resetField, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    caller_id: '',
    custom_caller_id: 'custom-1',
    dial_mode: 1,
    group_id: 'group-1',
  },
})

const { data: customCallerIdList } = useNuxtData('get-custom-caller-id-list')
const { data: dialingModeList } = useNuxtData('get-dialing-mode-list')
const { data: extensionGroupList } = useNuxtData('get-extension-group-list')
const { data: voiceDropOptions } = useNuxtData('get-voice-drop-options')
const { data: inboundIVROptions } = useNuxtData('get-inbound-ivr-options')
const { data: audioMessageAMDList } = useNuxtData('get-audio-message-amd-list')
const { data: voiceTemplateAMDList } = useNuxtData('get-voice-template-amd-list')
const { data: ringGroupList } = useNuxtData('get-ring-group-list')

async function onSelectCallerId(val: any) {
  await refreshNuxtData('get-custom-caller-id-list')
  if (val === '1' && !customCallerIdList.value?.length) {
    await refreshNuxtData('get-custom-caller-id-list')
  }
  else {
    resetField('custom_caller_id')
  }
}
async function onSelectNoAgentAvailableAction(val: any) {
  if (val === 2 && !voiceDropOptions.value?.length) {
    await refreshNuxtData('get-voice-drop-options')
  }
  if (val === 3 && !inboundIVROptions.value?.length) {
    await refreshNuxtData('get-inbound-ivr-options')
  }
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

async function onSelectRedirectTo(val: any) {
  if (val === 1 && !audioMessageAMDList.value?.length) {
    await refreshNuxtData('get-audio-message-amd-list')
  }
  if (val === 2 && !voiceTemplateAMDList.value?.length) {
    await refreshNuxtData('get-voice-template-amd-list')
  }
  if (val === 3 && !voiceDropOptions.value?.length) {
    await refreshNuxtData('get-voice-drop-options')
  }
  if (val === 4 && !ringGroupList.value?.length) {
    await refreshNuxtData('get-ring-group-list')
  }
  if (val === 5 && !inboundIVROptions.value?.length) {
    await refreshNuxtData('get-inbound-ivr-options')
  }
}

async function onAmdDropActionChange(val: any) {
  if (val === 2 && !audioMessageAMDList.value?.length) {
    await refreshNuxtData('get-audio-message-amd-list')
  }
  if (val === 3 && !voiceTemplateAMDList.value?.length) {
    await refreshNuxtData('get-voice-template-amd-list')
  }
}

const onSubmit = handleSubmit(async (_values) => {
  // Form submission logic here
})
const enableEdit = ref(false)
</script>

<template>
  <form action="">
    <div class="border rounded-lg bg-white">
      <div class="border-b px-5 pt-5 pb-3 flex items-center justify-between">
        <div class="text-[16px] font-medium text-primary/100">
          Caller Details
        </div>
        <div v-if="!enableEdit" class="flex items-center gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="enableEdit = true">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
        <div v-else class="flex gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="enableEdit = false ; resetForm()">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button class="w-[105px] rounded" size="sm" @click="onSubmit">
            <Icon name="material-symbols:save-rounded" />
            Save
          </Button>
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
                        <SelectItem v-for="item in callerIds" :key="item.id" :value="String(item.value)">
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
                    <SelectTrigger :class="errorMessage && 'border-red-600'" :disabled="values.caller_id !== 'custom' " class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Custom Caller Id" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in customCallerIdList" :key="item.id" :value="item.cli">
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
            <FormField v-slot="{ componentField, errorMessage }" name="duration">
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
            <FormField v-slot="{ componentField, errorMessage }" name="no_agent_available_action">
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
                        <SelectItem v-for="item in audioMessageAMDList" :key="item.id" :value="item.id">
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
                        <SelectItem v-for="item in voiceTemplateAMDList" :key="item.templete_id" :value="item.templete_id">
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
                        <SelectItem v-for="item in ringGroupList" :key="item.id" :value="item.id">
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
                        <SelectItem v-for="item in audioMessageAMDList" :key="item.id" :value="item.id">
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
                        <SelectItem v-for="item in voiceTemplateAMDList" :key="item.templete_id" :value="item.templete_id">
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
  </form>
</template>
