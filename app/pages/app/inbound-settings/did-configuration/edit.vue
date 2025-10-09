<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
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
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'

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

const { data: userData, status: userDataStatus, refresh: refreshUserData } = await useLazyAsyncData('user-data', () =>
  useApi().get('/users-list-new'), {
  transform: res => res.data,
  immediate: false,
})

const voipProviderItems = [
  { label: 'DidForSale', value: 'didforsale' },
  { label: 'Plivo', value: 'plivo' },
  { label: 'Telnyx', value: 'telnyx' },
  { label: 'Twilio', value: 'twilio' },
]

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    cli: z.string(),
    cnam: z.string().min(1, 'Caller name is required'),
    default_did: z.boolean(),
    redirect_last_agent: z.boolean(),
    dest_type: z.number().optional(),
    destination: z.string().optional(),
    dest_type_ooh: z.number().optional(),
    ingroup_ooh: z.number().optional(),
    conf_id_ooh: z.number().optional(),
    extension_ooh: z.number().optional(),
    ivr_id_ooh: z.number().optional(),
    forward_number_ooh: z.string().optional(),
    sms: z.boolean(),
    enable_sms_ai: z.boolean(),
    assigned_user_id: z.number().optional(),
    set_exclusive_for_user: z.boolean(),
    call_time_department_id: z.number(),
    call_time_holiday: z.boolean(),
    call_screening_status: z.boolean(),
    voip_provider: z.string(),
  }).superRefine((data, ctx) => {
    // Validate dest_type when redirect_last_agent is false
    if (!data.redirect_last_agent && !data.dest_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dest_type'],
        message: 'Destination type is required when redirect last agent is disabled',
      })
    }

    // Validate dest_type_ooh when call_time_holiday is true
    if (data.call_time_holiday && !data.dest_type_ooh) {
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
        message: 'Assigned user is required when sms is enabled',
      })
    }

    // Validate destination fields based on dest_type when redirect_last_agent is false
    if (!data.redirect_last_agent && data.dest_type !== undefined && data.dest_type !== 3 && !data.destination) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destination'],
        message: 'Destination is required',
      })
    }

    // Validate destination fields based on dest_type_ooh when call_time_holiday is true
    if (data.call_time_holiday && data.dest_type_ooh !== undefined && data.dest_type_ooh !== 3) {
      if (data.dest_type_ooh === 4 && !data.forward_number_ooh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['forward_number_ooh'],
          message: 'Phone number is required',
        })
      }
      else if (data.dest_type_ooh === 0 && !data.ivr_id_ooh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ivr_id_ooh'],
          message: 'Destination is required',
        })
      }
      else if ([1, 2, 6].includes(data.dest_type_ooh) && !data.extension_ooh) {
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
    dest_type_ooh: didData.value?.dest_type_ooh,
    ingroup_ooh: didData.value?.ingroup_ooh,
    conf_id_ooh: didData.value?.conf_id_ooh,
    extension_ooh: didData.value?.extension_ooh,
    ivr_id_ooh: didData.value?.ivr_id_ooh,
    forward_number_ooh: didData.value?.forward_number_ooh,
    sms: didData.value?.sms,
    enable_sms_ai: didData.value?.enable_sms_ai,
    assigned_user_id: didData.value?.assigned_user_id,
    set_exclusive_for_user: didData.value?.set_exclusive_for_user,
    call_time_department_id: didData.value?.call_time_department_id,
    call_time_holiday: didData.value?.call_time_holiday,
    call_screening_status: didData.value?.call_screening_status,
    voip_provider: didData.value?.voip_provider,
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
    setFieldValue('dest_type_ooh', Number(newData?.dest_type_ooh))
    setFieldValue('ingroup_ooh', Number(newData?.ingroup_ooh))
    setFieldValue('conf_id_ooh', Number(newData?.conf_id_ooh))
    setFieldValue('extension_ooh', Number(newData?.extension_ooh))
    setFieldValue('ivr_id_ooh', Number(newData?.ivr_id_ooh))
    setFieldValue('forward_number_ooh', newData?.forward_number_ooh)
    setFieldValue('sms', newData?.sms === '1')
    setFieldValue('enable_sms_ai', newData?.enable_sms_ai === '1')
    setFieldValue('assigned_user_id', Number(newData?.assigned_user_id))
    setFieldValue('set_exclusive_for_user', newData?.set_exclusive_for_user === '1')
    setFieldValue('call_time_department_id', Number(newData?.call_time_department_id))
    setFieldValue('call_time_holiday', newData?.call_time_holiday === '1')
    setFieldValue('call_screening_status', newData?.call_screening_status === '1')
    setFieldValue('voip_provider', newData?.voip_provider)
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
}

// Unified function to handle destination type changes
function handleDestinationTypeChange(destType: number) {
  const config = (destinationConfig as Record<number, { data: Ref<any>, status: Ref<any>, refresh: () => Promise<any> }>)[destType]
  if (config) {
    config.refresh()
  }
}

// Watch SMS toggle and refresh user data when enabled
watch(() => values.sms, (newVal) => {
  if (newVal) {
    refreshUserData()
  }
})

// Watch both destination types with a single consolidated watcher
watch([() => values.dest_type, () => values.dest_type_ooh], ([destType, destTypeOoh]) => {
  if (destType !== undefined) {
    handleDestinationTypeChange(destType)
  }
  if (destTypeOoh !== undefined) {
    handleDestinationTypeChange(destTypeOoh)
  }
}, { immediate: true })

// const destinationFieldName = computed(() => getDestinationFieldName(values.dest_type ?? 0))
const destinationFieldNameOoh = computed(() => {
  const fieldMap = {
    0: 'ivr_id_ooh',
    1: 'extension_ooh',
    2: 'extension_ooh',
    5: 'conf_id_ooh',
    6: 'extension_ooh',
    8: 'ingroup_ooh',
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
    const response = await useApi().post('/save-edit-did', {
      did_id: didData.value?.id,
      cli: formatMaskaToNumber(values.cli),
      cnam: values.cnam,
      default_did: values.default_did ? '1' : '0',
      redirect_last_agent: values.redirect_last_agent ? '1' : '0',
      dest_type: values.dest_type,
      ivr_id: values.dest_type === 0 ? values.destination : undefined,
      extension: values.dest_type === 1 || 6 ? values.destination : undefined,
      voicemail_id: values.dest_type === 2 ? values.destination : undefined,
      forward_number: values.dest_type === 4 ? values.destination : undefined,
      conf_id: values.dest_type === 5 ? values.destination : undefined,
      ingroup: values.dest_type === 8 ? values.destination : undefined,
      dest_type_ooh: values.dest_type_ooh,
      ingroup_ooh: values.ingroup_ooh,
      conf_id_ooh: values.conf_id_ooh,
      extension_ooh: values.extension_ooh,
      ivr_id_ooh: values.ivr_id_ooh,
      forward_number_ooh: formatMaskaToNumber(values.forward_number_ooh ?? ''),
      sms: values.sms ? '1' : '0',
      enable_sms_ai: values.enable_sms_ai ? '1' : '0',
      assigned_user_id: values.assigned_user_id,
      set_exclusive_for_user: values.set_exclusive_for_user ? '1' : '0',
      call_time_department_id: values.call_time_department_id,
      call_time_holiday: values.call_time_holiday ? '1' : '0',
      call_screening_status: values.call_screening_status ? '1' : '0',
      voip_provider: values.voip_provider,
      area_code: didData?.value?.area_code,
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

                <div v-if="values.dest_type !== 3" class="w-1/2">
                  <FormField v-if="values.dest_type === 4" v-slot="{ componentField, errorMessage }" name="destination">
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

                  <FormField v-else v-slot="{ componentField, errorMessage }" name="destination">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        Destination
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
                                  {{ item.ivr_desc }}
                                </SelectItem>
                              </template>
                              <template v-else-if="[1, 2, 6].includes(values.dest_type ?? 0)">
                                <SelectItem v-for="item in extensionListData" :key="item.id" :value="String(item.id)">
                                  {{ item.first_name }} {{ item.last_name }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 5">
                                <SelectItem v-for="item in conferencingData" :key="item.id" :value="String(item.id)">
                                  {{ item.title }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 8">
                                <SelectItem v-for="item in ringGroupData" :key="item.id" :value="String(item.id)">
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

            <!-- Enable SMS -->
            <FormField v-slot="{ value, handleChange }" name="sms">
              <FormItem>
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
              <FormItem>
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
                            {{ item.first_name }} {{ item.last_name }}
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
                  <p>Set exclusive for user</p>
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
                      <SelectItem v-for="item in callTimesData" v-else :key="item.id" :value="item.id">
                        {{ item.name }}
                      </SelectItem>
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
                  <p>Apply Holiday calendar</p>
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

            <FormField v-slot="{ value, handleChange }" name="call_screening_status">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Call screening audio</p>
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
            <template v-if="values.call_time_holiday">
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
                                  {{ item.ivr_desc }}
                                </SelectItem>
                              </template>
                              <template v-else-if="[1, 2, 6].includes(values.dest_type_ooh ?? 0)">
                                <SelectItem v-for="item in extensionListData" :key="item.id" :value="item.id">
                                  {{ item.first_name }} {{ item.last_name }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type_ooh === 5">
                                <SelectItem v-for="item in conferencingData" :key="item.id" :value="item.id">
                                  {{ item.title }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type_ooh === 8">
                                <SelectItem v-for="item in ringGroupData" :key="item.id" :value="item.id">
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
          </div>
        </div>

        <!-- Form Actions -->
        <div class="sticky bottom-0 right-0 w-full bg-white p-4 gap-2 flex items-center justify-center border rounded-b-lg">
          <Button class="w-1/2 h-[52px]" variant="outline" type="button" @click="onCancel">
            <Icon name="material-symbols:close" size="20" />
            Cancel
          </Button>
          <Button class="w-1/2 h-[52px]" type="submit" :loading="isSubmitting" :disabled="isSubmitting">
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
