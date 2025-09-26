<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
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

const didPhone = ref(false)
const destinationItems = ref([])
const destinationStatus = ref()

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    cli: z.string(),
    cnam: z.string().min(1, 'Caller name is required'),
    default_did: z.boolean(),
    redirect_last_agent: z.boolean(),
    dest_type: z.number().optional(),
    ingroup: z.number().optional(),
    conf_id: z.number().optional(),
    extension: z.number().optional(),
    ivr_id_ooh: z.number().optional(),
    forward_number: z.string().optional(),
    sms: z.boolean(),
    sms_type: z.boolean(),
    set_exclusive_for_user: z.boolean(),
    call_time_department_id: z.number(),
    call_time_holiday: z.boolean(),
    call_screening_status: z.boolean(),
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
    ingroup: didData.value?.ingroup,
    conf_id: didData.value?.conf_id,
    extension: didData.value?.extension,
    ivr_id_ooh: didData.value?.ivr_id_ooh,
    forward_number: didData.value?.forward_number,
    sms: didData.value?.sms,
    sms_type: didData.value?.sms_type,
    set_exclusive_for_user: didData.value?.set_exclusive_for_user,
    call_time_department_id: didData.value?.call_time_department_id,
    call_time_holiday: didData.value?.call_time_holiday,
    call_screening_status: didData.value?.call_screening_status,
  },
})

watch(didData, (newData) => {
  if (newData) {
    setFieldValue('cli', newData?.cli)
    setFieldValue('cnam', newData?.cnam)
    setFieldValue('default_did', newData?.default_did === '1')
    setFieldValue('redirect_last_agent', newData?.redirect_last_agent === '1')
    setFieldValue('dest_type', Number(newData?.dest_type))
    setFieldValue('ingroup', Number(newData?.ingroup))
    setFieldValue('conf_id', Number(newData?.conf_id))
    setFieldValue('extension', Number(newData?.extension))
    setFieldValue('ivr_id_ooh', Number(newData?.ivr_id_ooh))
    setFieldValue('forward_number', newData?.forward_number)
    setFieldValue('sms', newData?.sms === '1')
    setFieldValue('sms_type', newData?.sms_type === '1')
    setFieldValue('set_exclusive_for_user', newData?.set_exclusive_for_user === '1')
    setFieldValue('call_time_department_id', newData?.call_time_department_id)
    setFieldValue('call_time_holiday', newData?.call_time_holiday === '1')
    setFieldValue('call_screening_status', newData?.call_screening_status === '1')
  }
})

watch(
  () => values.dest_type, // watch the form value
  (val) => {
    if (val === 0) {
      destinationStatus.value = ivrStatus.value
      destinationItems.value = ivrData.value
      refreshIvrData()
    }
    if (val === 1 || val === 2 || val === 6) {
      destinationItems.value = extensionListData.value
      destinationStatus.value = extensionListStatus.value
      refreshExtensionListData()
    }
    if (val === 4) {
      didPhone.value = true
    }
    else {
      didPhone.value = false
    }
    if (val === 5) {
      destinationItems.value = conferencingData.value
      destinationStatus.value = conferencingStatus.value
      refreshConferencingData()
    }
    if (val === 8) {
      destinationItems.value = ringGroupData.value
      destinationStatus.value = ringGroupStatus.value
      refreshRingGroupData()
    }
  },
  { immediate: true }, // run once initially
)

// computed to map dest_type → field name
const destinationFieldName = computed(() => {
  switch (values.dest_type) {
    case 0:
      return 'ivr_id_ooh'
    case 1:
    case 2:
    case 6:
      return 'extension'
    case 5:
      return 'conf_id'
    case 8:
      return 'ingroup'
    default:
      return ''
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await useApi().post('/save-edit-did', values)
    if (response?.success) {
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
      type: error,
    })
  }
})

function onCancel() {
  // Object.keys(values).forEach((field) => {
  //   setFieldValue(field as keyof typeof values, didData.value?.[field as keyof typeof didData.value])
  // })
}
</script>

<template>
  <BaseHeader title="Edit Phone Number" :breadcrumbs="breadcrumbs" />
  <div class="relative h-[calc(100vh-190px)] overflow-y-hidden border rounded-lg mt-6">
    <form class="space-y-4 h-full" @submit.prevent="onSubmit">
      <!-- Phone number details -->
      <div class="h-full rounded-lg bg-white">
        <div class="sticky top-0 right-0 z-10 w-full bg-white border-b px-5 py-5 flex items-center justify-between">
          <div class="text-lg font-medium text-primary/100">
            Phone Number Details
          </div>
        </div>
        <!-- loading -->
        <div v-if="didStatus === 'pending'" class="grid grid-cols-2 gap-x-4 gap-y-5 w-full p-5">
          <BaseSkelton v-for="i in 10" :key="i" class="h-11 w-full mb-2" rounded="rounded-sm" />
        </div>
        <div v-else class="h-[calc(100vh-190px)] p-5 w-full">
          <div class="grid grid-cols-2 gap-x-4 gap-y-5 items-end h-fit overflow-y-auto">
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

            <!-- Set As Mainline -->
            <FormField v-slot="{ value, handleChange }" v-model="values.default_did" name="default_did">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Set as mainline</p>
                  <FormControl>
                    <Switch
                      class="data-[state=checked]:bg-green-600 group"
                      :model-value="value"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
            <!-- Redirect To Last Spoke Agent -->
            <FormField v-slot="{ value, handleChange }" v-model="values.redirect_last_agent" name="redirect_last_agent">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Redirect to last spoke agent</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
            <div v-if="!values.redirect_last_agent" class="flex items-start gap-4">
              <!-- Destination Type -->
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" name="dest_type">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Destination Type
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Destination Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-if="destTypeStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                            <Icon name="eos-icons:loading" />
                          </SelectItem>
                          <template v-else>
                            <SelectItem v-for="item in destTypeData" :key="item.dest_id" :value="item.dest_id">
                              {{ item.dest_type }}
                            </SelectItem>
                          </template>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div v-if="values.dest_type !== 3" class="w-1/2">
                <!-- Destination type number -->
                <div v-if="values.dest_type === 4">
                  <FormField v-slot="{ componentField, errorMessage }" name="forward_number">
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
                      <FormMessage class="text-sm text-left" />
                    </FormItem>
                  </FormField>
                </div>
                <div v-else class="w-full">
                  <FormField v-slot="{ componentField, errorMessage }" :name="destinationFieldName">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        Destination
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                            <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Destination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-if="destinationStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                              <Icon name="eos-icons:loading" />
                            </SelectItem>
                            <template v-else>
                              <template v-if="values.dest_type === 0">
                                <SelectItem v-for="item in ivrData" :key="item.id" :value="item.id">
                                  {{ item.ivr_desc }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 1 || values.dest_type === 2 || values.dest_type === 6">
                                <SelectItem v-for="item in extensionListData" :key="item.id" :value="item.id">
                                  {{ item.first_name }} {{ item.last_name }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 8">
                                <SelectItem v-for="item in ringGroupData" :key="item.id" :value="item.id">
                                  {{ item.title }}
                                </SelectItem>
                              </template>
                              <template v-else-if="values.dest_type === 5">
                                <SelectItem v-for="item in conferencingData" :key="item.id" :value="item.id">
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
            </div>
            <!-- Enable SMS -->
            <FormField v-slot="{ value, handleChange }" v-model="values.sms" name="sms">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Enable SMS</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
            <!-- Enable SMS AI -->
            <FormField v-slot="{ value, handleChange }" v-model="values.sms_type" name="sms_type">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Enable SMS AI</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>

            <!-- Set Exclusive For User -->
            <FormField v-slot="{ value, handleChange }" v-model="values.set_exclusive_for_user" name="set_exclusive_for_user">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Set exclusive for user</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
                <FormMessage class="text-sm" />
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
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Destination Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="callTimesStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
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

            <!-- Apply Holiday Calendar -->
            <FormField v-slot="{ value, handleChange }" v-model="values.call_time_holiday" name="call_time_holiday">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Apply Holiday calendar</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
            <!-- Call Screening Audio -->
            <FormField v-slot="{ value, handleChange }" v-model="values.call_screening_status" name="call_screening_status">
              <FormItem>
                <div
                  class="w-full h-11 rounded-sm flex items-center justify-between px-3 text-sm"
                  :class="value ? 'bg-[#00A0860D]' : 'bg-gray-50'"
                >
                  <p>Call screening audio</p>
                  <FormControl>
                    <Switch
                      :model-value="value"
                      class="data-[state=checked]:bg-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                </div>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
      <div class="sticky bottom-0 right-0 w-full bg-white p-4 gap-2 flex border-t rounded-b-lg ">
        <Button class="w-1/2 h-[52px]" variant="outline" :loading="isSubmitting" type="button" @click="onCancel">
          <Icon name="material-symbols:close" size="20" />
          Cancel
        </Button>
        <Button class="w-1/2 h-[52px]" type="submit" :loading="isSubmitting">
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </div>
    </form>
  </div>
</template>
