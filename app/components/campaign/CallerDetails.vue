<script setup lang="ts">
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

import { Switch } from '~/components/ui/switch'

const props = defineProps<{
  values: any
  isPreview: boolean
  loading: boolean

}>()

const emit = defineEmits(['setFieldValue', 'setFieldError', 'cancelEdit', 'submit'])

const { formState, callerIds, NoAgentAvailableList, timeIntervals, redirectToList, amdDropActions, enableEditSection } = useCreateCampaign()

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

function onSelectCallerId(val: any) {
  if (val === 'custom' && !customCallerIdList.value?.length) {
    refreshCustomCallerIdList()
  }
  else {
    emit('setFieldValue', 'custom_caller_id', '')
  }
}
// dialing mode list
const { data: dialingModeList } = await useLazyAsyncData('get-dialing-mode-list', () =>
  useApi().get('/campaign-type', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// extension group list
const { data: extensionGroupList } = await useLazyAsyncData('get-extension-group-list', () =>
  useApi().get('/extension-group', {

  }), {
  transform: (res) => {
    return res.data
  },
})

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

const { data: ringGroupList, status: ringGroupListStatus, refresh: refreshRingGroupList } = await useLazyAsyncData('get-ring-group-list', () =>
  useApi().post('/ring-group', {
  }), {
  transform: (res) => {
    return res.data
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

function onSelectDialMode(val: any): void {
  if (val === 'predictive_dial') {
    emit('setFieldValue', 'automated_duration', false)
    emit('setFieldValue', 'amd', false)
  }
  else {
    // remove automated_duration field
    emit('setFieldValue', 'automated_duration', undefined)
    emit('setFieldValue', 'amd', undefined)
  }
}

function onSelectNoAgentAvailableAction(val: any) {
  emit('setFieldValue', 'no_agent_dropdown_action', 0)
  emit('setFieldError', 'no_agent_dropdown_action', '')

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

function onAmdDropActionChange(val: any) {
  if (val === 2 && !audioMessageAMDList.value?.length) {
    refreshAudioMessageAMDList()
  }
  if (val === 3 && !voiceTemplateAMDList.value?.length) {
    refreshVoiceTemplateAMDList()
  }
}

const enableEdit = computed(() => enableEditSection.value === 'caller-details' || !props.isPreview)

watch(() => props.isPreview, (newVal) => {
  if (!newVal) {
    enableEditSection.value = ''
  }
})

function cancelEdit() {
  enableEditSection.value = ''
  emit('cancelEdit')
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b px-5 pt-5 pb-3 flex items-center justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Caller Details
      </div>
      <div v-if="isPreview " class="flex items-center gap-x-2">
        <div v-if="enableEditSection === 'caller-details'" class="flex gap-x-2">
          <Button variant="outline" :disabled="loading" size="sm" class="rounded" @click="cancelEdit">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button class="w-[105px] rounded" :disabled="loading" type="submit" size="sm" @click="emit('submit')">
            <Icon :name=" loading ? 'eos-icons:loading' : 'material-symbols:save-rounded'" />
            Save
          </Button>
        </div>
        <div v-else class="flex items-center gap-x-2">
          <Button :disabled="enableEditSection.length" variant="outline" size="sm" class="rounded" @click="enableEditSection = 'caller-details'">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
      </div>
    </div>
    <div class="p-5 space-y-5 w-full">
      <div class="flex gap-[16px] w-full">
        <div class="w-1/2">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.caller_id" name="caller_id">
            <FormItem v-auto-animate>
              <FormLabel class="font-normal text-sm" :class="!enableEdit && 'text-gray-400'">
                Caller Id
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField" @update:model-value="onSelectCallerId">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ callerIds?.find((val: any) => val.value === formState.caller_id)?.name }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div class="w-1/2">
          <FormField
            v-slot="{ componentField, errorMessage }" v-model="formState.custom_caller_id" name="custom_caller_id"
          >
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Custom Caller Id
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
                  <SelectTrigger :class="errorMessage && 'border-red-600'" :disabled="formState.caller_id !== 'custom' " class="w-full !h-11">
                    <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Custom Caller Id" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <div v-if="customCallerIdListStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                        <Icon name="eos-icons:loading" />
                      </div>
                      <SelectItem v-for=" item in customCallerIdList" v-else :key="item.id" :value="item.cli">
                        {{ item.title }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ customCallerIdList?.find((val: any) => val.cli === formState?.custom_caller_id)?.title }}
                </div>
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
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Dialing Mode
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField" @update:model-value="onSelectDialMode">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ dialingModeList?.find((val: any) => val.title_url === formState?.dial_mode)?.title }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div class="w-1/2">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.group_id" name="group_id">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Caller Group
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ extensionGroupList?.find((val: any) => val.id === formState?.group_id)?.title }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
      </div>

      <!-- if dialing mode is  predictive dial -->
      <div v-if="formState.dial_mode === 'predictive_dial'" class="grid grid-cols-2 gap-4">
        <div class="">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.call_ratio" name="call_ratio">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Call Ratio
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ formState?.call_ratio }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div class="">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.duration" name="duration">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Duration in Sec
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ formState?.duration }} Sec
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div class="">
          <FormField v-slot="{ componentField, errorMessage, value }" v-model="formState.no_agent_available_action" name="no_agent_available_action">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                No Agent available Action
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField" @update:model-value="onSelectNoAgentAvailableAction">
                  <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                    <SelectValue class="text-sm" :class="!value && 'text-muted-foreground'" placeholder="Select No Agent Available Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in NoAgentAvailableList" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ NoAgentAvailableList?.find((val: any) => val.id === formState?.no_agent_available_action)?.name }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div class="grid grid-cols-2 pt-2">
          <FormField v-slot="{ value, handleChange }" v-model="formState.automated_duration" name="automated_duration">
            <FormItem class="flex flex-col gap-y-3">
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="text-sm font-normal">
                Automated Duration
              </FormLabel>
              <FormControl>
                <Switch
                  v-if="enableEdit"
                  id="send-sms"
                  class="data-[state=checked]:bg-green-600"
                  :model-value="value"
                  @update:model-value="handleChange"
                />
                <div v-else :class="formState?.automated_duration ? 'text-green-600' : 'text-red-600'" class="text-[16px] font-normal">
                  {{ formState?.automated_duration ? 'Yes' : 'No' }}
                </div>
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
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Simultaneous Calls
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ formState?.call_ratio }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.duration" name="duration">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Time Interval
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ timeIntervals?.find((val: any) => val.value === formState?.duration)?.title }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.redirect_to" name="redirect_to">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Redirect To
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField" @update:model-value="onSelectRedirectTo">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ redirectToList?.find((val: any) => val.value === formState?.redirect_to)?.title }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <!-- If Redirect to is audio message -->
        <div v-if="values.redirect_to === 1">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.redirect_to_dropdown" name="redirect_to_dropdown">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Audio Message
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ audioMessageAMDList?.find((val: any) => val.id === formState?.redirect_to_dropdown)?.ann_id }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <!-- If Redirect to is voice template -->
        <div v-if="values.redirect_to === 2">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.redirect_to_dropdown" name="redirect_to_dropdown">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Voice Template
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ voiceTemplateAMDList?.find((val: any) => val.templete_id === formState?.outbound_ai_dropdown_voice_message)?.templete_name }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <!-- If Redirect to is extension -->
        <div v-if="values.redirect_to === 3">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.redirect_to_dropdown" name="redirect_to_dropdown">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Extension
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ voiceDropOptions?.find((val: any) => val.id === formState?.outbound_ai_dropdown_extension)?.first_name }} {{ voiceDropOptions?.find((val: any) => val.id === formState?.outbound_ai_dropdown_extension)?.last_name }} - {{ voiceDropOptions?.find((val: any) => val.id === formState?.outbound_ai_dropdown_extension)?.extension }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <!-- If Redirect to is ring group -->
        <div v-if="values.redirect_to === 4">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.redirect_to_dropdown" name="redirect_to_dropdown">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Ring Group
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ ringGroupList?.find((val: any) => val.id === formState?.outbound_ai_dropdown_ring_group)?.title }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <!-- If Redirect to is ivr -->
        <div v-if="values.redirect_to === 5">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.redirect_to_dropdown" name="redirect_to_dropdown">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                IVR
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ inboundIVROptions?.find((val: any) => val.id === formState?.outbound_ai_dropdown_ivr)?.ivr_desc }} - {{ inboundIVROptions?.find((val: any) => val.id === formState?.outbound_ai_dropdown_ivr)?.ivr_id }}
                </div>
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
          <FormField v-slot="{ componentField, errorMessage, value }" v-model="formState.no_agent_dropdown_action" name="no_agent_dropdown_action">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Voice Drop Option
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
                  <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                    <SelectValue class="text-sm" :class="!value && 'text-muted-foreground'" placeholder="Select Inbound IVR Option" />
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ voiceDropOptions?.find((val: any) => val.id === formState?.no_agent_dropdown_action)?.first_name }} {{ voiceDropOptions?.find((val: any) => val.id === formState?.no_agent_dropdown_action)?.last_name }} - {{ voiceDropOptions?.find((val: any) => val.id === formState?.no_agent_dropdown_action)?.extension }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <!-- if no_agent_available_action is 3(inbound ivr) -->
        <div v-if="values.no_agent_available_action === 3">
          <FormField v-slot="{ componentField, errorMessage, value }" v-model="formState.no_agent_dropdown_action" name="no_agent_dropdown_action">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Inbound IVR Option
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
                  <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                    <SelectValue class="text-sm" :class="!value && 'text-muted-foreground'" placeholder="Select Inbound IVR Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <div v-if="inboundIVROptionsStatus === 'pending'" class="flex justify-center h-5 bg-accent rounded hover:bg-accent/80 cursor-pointer items-center">
                        <Icon name="eos-icons:loading" />
                      </div>
                      <SelectItem v-for="item in inboundIVROptions" :key="item.ivr_id" :value="item.id">
                        {{ item.ivr_desc }} - {{ item.ivr_id }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div v-else class="text-[16px] font-normal text-primary">
                  <!-- TODO: need to change this after API fix -->
                  {{ inboundIVROptions?.find((val: any) => val.ivr_id === formState?.no_agent_dropdown_action)?.ivr_desc }} - {{ inboundIVROptions?.find((val: any) => val.ivr_id === formState?.no_agent_dropdown_action)?.ivr_id }}
                </div>
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
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="text-sm font-normal">
                AMD
              </FormLabel>
              <FormControl>
                <Switch
                  v-if="enableEdit"
                  id="send-sms"
                  class="data-[state=checked]:bg-green-600"
                  :model-value="value"
                  @update:model-value="handleChange"
                />
                <div v-else :class="formState?.amd ? 'text-green-600' : 'text-red-600'" class="text-[16px] font-normal">
                  {{ formState?.amd ? 'Yes' : 'No' }}
                </div>
              </FormControl>
            </FormItem>
          </FormField>
        </div>
        <!-- If AMD is ON -->
        <FormField v-if="values.amd" v-slot="{ componentField, errorMessage }" v-model="formState.amd_drop_action" name="amd_drop_action">
          <FormItem v-auto-animate>
            <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
              AMD Drop Action
            </FormLabel>
            <FormControl>
              <Select v-if="enableEdit" v-bind="componentField" @update:model-value="onAmdDropActionChange">
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
              <div v-else class="text-[16px] font-normal text-primary">
                {{ amdDropActions?.find((val: any) => val.id === formState?.amd_drop_action)?.name }}
              </div>
            </FormControl>
            <FormMessage class="text-sm" />
          </FormItem>
        </FormField>
        <div>
          <!-- When AMD Drop action is Audio Message -->
          <FormField v-if="values.amd_drop_action === 2" v-slot="{ componentField, errorMessage }" v-model="formState.voicedrop_option_user_id" name="voicedrop_option_user_id">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Audio Message AMD
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ audioMessageAMDList?.find((val: any) => val.id === formState?.voicedrop_option_user_id)?.ann_id }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>

          <!-- When AMD Drop action is voice template -->
          <FormField v-if="values.amd_drop_action === 3" v-slot="{ componentField, errorMessage }" v-model="formState.voicedrop_option_user_id" name="voicedrop_option_user_id">
            <FormItem v-auto-animate>
              <FormLabel :class="!enableEdit && 'text-gray-400'" class="font-normal text-sm">
                Voice Template AMD
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
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
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ voiceTemplateAMDList?.find((val: any) => val.templete_id === formState?.voicedrop_option_user_id)?.templete_name }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
