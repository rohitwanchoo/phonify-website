<script lang="ts" setup>
import type { Extension } from '~/types/extension'
import { toTypedSchema } from '@vee-validate/zod'
import { templateRef } from '@vueuse/core'
import { useForm } from 'vee-validate'

import * as z from 'zod'
import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const route = useRoute()

const id = route.query.id

const isEdit = !!id

const firstNameRef = templateRef<HTMLInputElement>('firstNameRef')

const countries = await getCountriesAll()
// console.log('countries', countries)

const breadcrumbs = computed(() => [
  {
    label: 'Extension List',
    href: '/app/user-management/extension',
  },
  {
    label: isEdit ? 'Update Extension' : 'Add Extension',
    active: true,
  },
])
// fetch voice servers
const { data: voiceServers } = await useLazyAsyncData('get-voice-servers', () =>
  useApi().post('client_ip_list'), {
  transform: (res) => {
    return res.data || []
  },
})

// fetch client packages
const { data: clientPackages } = await useLazyAsyncData('get-client-packages', () =>
  useApi().get('client-packages'), {
  transform: (res) => {
    return res.data || []
  },
})

// fetch extension groups
const { data: extensionGroups } = await useLazyAsyncData('get-extension-groups', () =>
  useApi().get('/extension-group'), {
  transform: (res) => {
    return res.data || []
  },
})

const cliSettingsList = [
  {
    id: '0',
    name: 'Area Code',
  },
  {
    id: '1',
    name: 'Custom (Enabled for Custom CLI)',
  },
  {
    id: '2',
    name: 'Area Code and Randomizer',
  },
]

const extensionTypes = [
  {
    id: '1',
    name: 'Extension',
  },
  {
    id: '2',
    name: 'Ring Group',
  },
]

const { data: customCliList, refresh: customCliRefresh, status: customCliStatus } = await useLazyAsyncData('get-custom-cli-list', () =>
  useApi().post('did').catch((error) => {
    showToast({
      message: error.message,
      type: 'error',
    })
    return { data: [] }
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

// const selectedCountry = ref({ name: 'United States', dial_code: '+1', code: 'US' })

const formSchema = toTypedSchema(z.object({

  extension: isEdit
    ? z.string().optional()
    : z.string().regex(/^\d+$/, 'must be a number').min(1, 'Required').max(5, 'maximum 5 character allowed'),

  first_name: z.string().min(1, 'First Name is required').max(50),
  last_name: z.string().min(1, 'Last Name is required').max(50),

  email: z.string().min(1, 'Email is required').email('invalid email format').max(50),

  country_code: z.string().min(1, 'required'),
  mobile: z.string().min(1, 'Phone Number is required'),
  follow_me: z.boolean(),
  call_forward: z.boolean(),
  voicemail: z.boolean(),
  vm_pin: z.string().min(1, 'Voicemail Pin is required'),
  voicemail_send_to_email: z.boolean(),
  twinning: z.boolean(),

  asterisk_server_id: isEdit
    ? z.number().optional()
    : z.number().min(1, 'Voice Server is required'),

  timezone: z.string().min(1, 'required'),
  cli_setting: z.string().min(0, 'CLI Setting is required'),
  cli: z.string().min(1, 'required').optional().superRefine((val, ctx) => {
    if (values.cli_setting === '1' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CLI is required when CLI Setting is Custom',

      })
    }
  }),
  password: isEdit
    ? z.string().optional()
    : z.string().min(1, 'Password is required').max(10, 'maximum 10 character allowed'),

  extension_type: z.string().min(1, 'Extension Type is required'),
  sms_setting_id: z.number().min(1, 'required'),
  receive_sms_on_email: z.boolean(),
  receive_sms_on_mobile: z.boolean(),
  ip_filtering: z.boolean(),
  enable_2fa: z.boolean(),
  voip_configuration_id: z.number().min(1, 'required'),
  app_status: z.boolean(),

  package_id: isEdit
    ? z.number().optional()
    : z.number().min(1, 'Package is required'),

  group_id: z.array(z.number()).min(1, 'Group is required'),
}),
)

const { handleSubmit, values, errors, setFieldValue, setFieldError, validateField, validate } = useForm({
  validationSchema: formSchema,
  initialValues: {
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    asterisk_server_id: 0,
    vm_pin: '',
    extension_type: '',
    package_id: 0,
    group_id: [],
    timezone: 'America/New_York',
    country_code: '+1',
    app_status: false,
    call_forward: false,
    follow_me: false,
    voicemail: false,
    voicemail_send_to_email: false,
    enable_2fa: false,
    twinning: false,
    ip_filtering: false,
    sms_setting_id: 3, // TODO: need clarity
    voip_configuration_id: 2, // TODO: need clarity
    receive_sms_on_email: false,
    receive_sms_on_mobile: false,

  },
})

// if cli setting is custom then call api to get custom cli list
watch(() => values.cli_setting, (newValue) => {
  if (newValue === '1' && !customCliList.value?.length) {
    customCliRefresh()
  }
})

function autoGenerateExtension() {
  const extension = Math.floor(1000 + Math.random() * 9000)
  setFieldValue('extension', extension.toString())
}

function autoGeneratePassword() {
  const password = Math.random().toString(36).slice(-8)
  setFieldValue('password', password)
}

function autoGenerateVoiceMailPin() {
  const voiceMailPin = Math.floor(1000 + Math.random() * 9000)
  setFieldValue('vm_pin', voiceMailPin.toString())
}

function onNumericInput(e: Event) {
  const input = e.target as HTMLInputElement
  const currentValue = input.value
  const numericValue = currentValue.replace(/\D/g, '')
  const truncatedValue = numericValue.slice(0, 5)

  if (currentValue !== truncatedValue) {
    input.value = truncatedValue
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
const loading = ref(false)

const onSubmit = handleSubmit((values) => {
  loading.value = true
  // console.log('Form submitted!', values)
  const payload = {
    ...values,
    follow_me: values.follow_me ? '1' : '0',
    call_forward: values.call_forward ? '1' : '0',
    twinning: values.twinning ? '1' : '0',
    cnam: `${values.first_name} ${values.last_name}`,
    app_status: values.app_status ? '1' : '0',
    voicemail: values.voicemail ? '1' : '0',
    voicemail_send_to_email: values.voicemail_send_to_email ? '1' : '0',
    mobile: values.mobile.replace(/[-\s()]/g, ''),
    // country_code: selectedCountry.value.dial_code
  }

  // if edit
  if (isEdit) {
    payload.extension_id = id
    // remove unwanted from payload
    delete payload.password
    // delete payload.email
    delete payload.package_id
    delete payload.asterisk_server_id
    delete payload.extension

    useApi().post('/edit-extension-save ', payload).then((res) => {
      showToast({
        message: res.message,
      })

      navigateTo('/app/user-management/extension')
    }).catch((err) => {
      handleFieldErrors(err.data, setFieldError)

      showToast({
        message: err.message,
        type: 'error',
      })
      // handleFieldErrors(err.)
    }).finally(() => {
      loading.value = false
    })
    return
  }

  useApi().put('/user', payload).then((res) => {
    showToast({
      message: res.data.message,
      type: 'success',
    })

    navigateTo('/app/user-management/extension')
  }).catch((err) => {
    handleFieldErrors(err.data, setFieldError)

    showToast({
      message: err.message,
      type: 'error',
    })
    console.log(err)
  }).finally(() => {
    loading.value = false
  })
})

// get extension by id

const { data: extensionById, refresh: refreshExtensionById, status: extensionByIdStatus } = await useLazyAsyncData('get-extension-by-id', () =>
  useApi().post('/extension', {
    extension_id: id,
  }), {
  transform: (res) => {
    return res.data || {}
  },
  immediate: false,
})

const { data: countriesList, status: countriesListStatus } = await useLazyAsyncData('get-country-list', () =>
  useApi().post('/country-list'), {
  transform: (res) => {
    return res.data || {}
  },
})

function prefixWithPlus(code?: number): string {
  const codeString = code?.toString()
  return `+${codeString}`
}

async function setFieldValues() {
  await refreshExtensionById()
  // User Information
  setFieldValue('first_name', extensionById.value?.first_name)
  setFieldValue('last_name', extensionById.value?.last_name)
  setFieldValue('email', extensionById.value?.email)
  setFieldValue('extension', extensionById.value?.extension?.toString())
  setFieldValue('asterisk_server_id', extensionById.value?.asterisk_server_id)

  // Call & Voicemail Settings
  setFieldValue('vm_pin', JSON.stringify(extensionById.value?.vm_pin))
  setFieldValue('follow_me', Number(extensionById.value?.follow_me) > 0)
  setFieldValue('call_forward', Number(extensionById.value?.call_forward) > 0)
  setFieldValue('voicemail', Number(extensionById.value?.voicemail) > 0)
  setFieldValue('voicemail_send_to_email', Number(extensionById.value?.voicemail_send_to_email) > 0)

  // Security & Access
  setFieldValue('enable_2fa', Number(extensionById.value?.enable_2fa) > 0)
  setFieldValue('app_status', Number(extensionById.value?.app_status) > 0)
  setFieldValue('twinning', Number(extensionById.value?.twinning) > 0)
  setFieldValue('ip_filtering', Number(extensionById.value?.ip_filtering) > 0)

  // Contact Information
  setFieldValue('country_code', prefixWithPlus(extensionById.value?.country_code))
  setFieldValue('mobile', extensionById.value?.mobile)
  setFieldValue('cli_setting', extensionById.value?.cli_setting?.toString())
  if (extensionById.value?.cli_setting === 1) {
    setFieldValue('cli', extensionById.value?.cli)
  }

  // Extension Configuration
  setFieldValue('extension_type', extensionById.value?.extension_type)
  // setFieldValue('package_id', extensionById.value?.package_id)
  // setFieldValue('package_id', clientPackages.value && Object.keys(clientPackages.value).length ? Number(Object.keys(clientPackages.value)[0]) : 0) // TODO: change when package_id field available in extension by id

  setFieldValue('group_id', extensionById.value?.group.map(item => item.group_id))
  setFieldValue('timezone', extensionById.value?.timezone)

  // Message Forwarding
  setFieldValue('receive_sms_on_email', Number(extensionById.value?.receive_sms_on_email) > 0)
  setFieldValue('receive_sms_on_mobile', Number(extensionById.value?.receive_sms_on_mobile) > 0)
}

const emailEdit = ref(false)
const emailEditLoading = ref(false)

function updateEmail() {
  emailEditLoading.value = true
  useApi().post('/update-email', {
    email: values.email,
    user_id: id,
  }).then((res) => {
    showToast({
      message: res.message,
    })
    emailEdit.value = false
    refreshExtensionById()
  }).catch((err) => {
    showToast({
      message: err.message,
      type: 'error',
    })
  }).finally(() => {
    emailEditLoading.value = false
  })
}

onMounted(() => {
  if (isEdit) {
    // if edit
    setFieldValues()
  }
  firstNameRef.value?.$el?.focus()
})
</script>

<template>
  <BaseHeader :title="isEdit ? 'Update Extension' : 'Add Extension'" :breadcrumbs />
  <form class="space-y-4 relative h-[calc(100vh-165px)] overflow-y-auto">
    <!-- User Information -->
    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        User Information
      </div>
      <div class="p-5 space-y-5 w-full">
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="first_name">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input ref="firstNameRef" type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Type Fist Name" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="last_name">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Type Fist Name" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="flex gap-[16px] w-full flex-wrap md:flex-nowrap">
          <div class="w-full md:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="extension">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Extension
                </FormLabel>
                <FormControl>
                  <!-- <Input type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Extension" v-bind="componentField" /> -->

                  <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg">
                    <Input :disabled="isEdit" type="text" class="text-sm focus-visible:ring-0 focus:ring-0 border-0 font-normal placeholder:text-sm h-11" v-bind="componentField" @input="onNumericInput" />
                    <Button v-if="!isEdit" type="button" class=" text-sm font-normal mr-1 rounded-lg" @click="autoGenerateExtension">
                      Auto Generate
                    </Button>
                  </div>
                </FormControl>
                <div v-if="errorMessage" class="text-sm text-red-600">
                  {{ errorMessage === 'Required' ? 'Extension is required' : errorMessage }}
                </div>
                <!-- <FormMessage class="text-sm" /> -->
              </FormItem>
            </FormField>
          </div>
          <div class="w-full md:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="email">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  E-mail
                </FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input type="text" :disabled="isEdit && !emailEdit" :class="errorMessage && 'border-red-600'" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Type E-mail" v-bind="componentField" />
                    <div v-if="isEdit" class="sm:absolute top-1/2 sm:-translate-y-1/2 right-1 mt-1 sm:mt-0">
                      <Button v-if="!emailEdit" type="button" class="rounded" @click="emailEdit = true">
                        Edit
                      </Button>
                      <div v-else class="flex gap-x-1">
                        <Button :disabled="errorMessage || emailEditLoading" type="button" class="bg-green-600 rounded hover:bg-green-600/60" @click="updateEmail">
                          <Icon v-if="emailEditLoading" name="eos-icons:loading" class="text-white" />
                          save
                        </Button>
                        <Button class="bg-red-600 rounded hover:bg-red-600/60" type="button" @click="emailEdit = false">
                          cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row  gap-[16px] w-full">
          <div v-if="!isEdit" class="sm:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="password">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Password
                </FormLabel>
                <FormControl>
                  <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg">
                    <Input type="text" class="text-sm focus-visible:ring-0 focus:ring-0 border-0 font-normal placeholder:text-sm h-11" v-bind="componentField" />
                    <Button type="button" class=" text-sm font-normal mr-1 rounded-lg" @click="autoGeneratePassword">
                      Auto Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
          <div class="sm:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="asterisk_server_id">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Voice Server
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Server" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in voiceServers" :key="item.id" :value="item.server_id">
                          {{ item.domain }}
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

    <!-- Call & Voicemail Settings -->
    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        Call & Voicemail Settings
      </div>
      <div class="p-5 space-y-5">
        <div class="">
          <FormField v-slot="{ componentField, errorMessage }" class="" name="vm_pin">
            <FormItem v-auto-animate>
              <FormLabel class="font-normal text-sm">
                VoiceMail Pin
              </FormLabel>
              <FormControl>
                <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg">
                  <Input
                    type="text"
                    placeholder="Type VM Pin"
                    class="text-sm focus-visible:ring-0 focus:ring-0 border-0 font-normal placeholder:text-sm h-11"
                    v-bind="componentField"
                    @input="onNumericInput"
                  />
                  <Button type="button" class="text-sm font-normal mr-1 rounded-lg" @click="autoGenerateVoiceMailPin">
                    Auto Generate
                  </Button>
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div class="flex gap-x-2 flex-wrap gap-y-2">
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="follow_me">
              <FormItem class="flex items-center justify-between w-full text-nowrap">
                Follow Me
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="call_forward">
              <FormItem class="flex items-center justify-between w-full text-nowrap">
                Call forward
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600" @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="voicemail">
              <FormItem class="flex items-center justify-between w-full text-nowrap">
                Voicemail
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="voicemail_send_to_email">
              <FormItem class="flex items-center justify-between w-full text-nowrap">
                Send Voicemail to email
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
    </div>

    <!-- Security & Access -->
    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        Security & Access
      </div>
      <div class="p-5 space-y-5">
        <div class="flex gap-2 flex-wrap ">
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="enable_2fa">
              <FormItem class="flex items-center justify-between w-full">
                Enable 2FA
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="app_status">
              <FormItem class="flex items-center justify-between w-full">
                Allow Mobile App Login
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="twinning">
              <FormItem class="flex items-center justify-between w-full">
                Twinning
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="ip_filtering">
              <FormItem class="flex items-center justify-between w-full">
                IP Filtering
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
    </div>

    <!-- Call & Voicemail Settings -->
    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        Contact Information
      </div>
      <div class="p-5 space-y-5">
        <ul v-auto-animate="{ duration: 150 }" class="flex flex-col sm:flex-row gap-x-3 items-start">
          <li class="w-full sm:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="mobile">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg overflow-hidden w-full">
                      <FormField v-slot="{ componentField: countryCodeComponentField, errorMessage: countryCodeErrorMessage }" name="country_code" class="relative">
                        <FormItem v-auto-animate>
                          <FormControl>
                            <Select v-bind="countryCodeComponentField">
                              <SelectTrigger class="w-min rounded-r-none bg-gray-100 !h-11 overflow-hidden" :class="countryCodeErrorMessage && !errorMessage ? 'border-red-600 border' : 'border-none'">
                                <SelectValue as-child>
                                  <span class="text-sm">
                                    {{ values.country_code }} {{ countries.find(c => c.dial_code === values.country_code)?.code || '' }}
                                  </span>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem v-for="item in countries" :key="item?.code" :value="item.dial_code">
                                    {{ item.name }} ({{ item.dial_code }})
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage class="text-sm absolute bottom-0" />
                        </FormItem>
                      </FormField>
                      <Input
                        v-maska="phoneMask[countries.find(c => c.dial_code === values.country_code)?.code || '']"
                        placeholder="Enter Phone Number"
                        class="text-sm focus-visible:ring-0 rounded-l-none focus:ring-0 border-0 font-normal placeholder:text-sm h-11"
                        v-bind="componentField"
                        @input="validateField('mobile')"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage class="text-sm text-right" />
              </FormItem>
            </FormField>
          </li>

          <li class="w-full sm:w-1/2 mt-2 sm:mt-0">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="cli_setting">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  CLI Setting
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180] text-wrap" placeholder="Select CLI settings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in cliSettingsList" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <div v-if="errorMessage" class="text-sm text-red-600">
                  {{ errorMessage === 'Required' ? 'CLI Setting is required' : errorMessage }}
                </div>
                <!-- <FormMessage class="text-sm" /> -->
              </FormItem>
            </FormField>
          </li>
          <li v-if="values.cli_setting === '1'" class="w-full sm:w-1/2 mt-2 sm:mt-0">
            <FormField v-slot="{ componentField }" class="" name="cli">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Custom CLI
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <Skeleton v-if="customCliStatus === 'pending'" class="h-11 w-full" />
                    <SelectTrigger v-else class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180] text-wrap" placeholder="Custom CLI" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in customCliList" :key="item.id" :value="item.cli">
                          {{ item.title }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </li>
        </ul>
      </div>
    </div>

    <!-- Extension Configuration -->
    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        Extension Configuration
      </div>
      <div class="p-5 space-y-5">
        <div class="flex flex-col sm:flex-row gap-x-3 items-start">
          <div class="w-full sm:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="extension_type">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Extension Type
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Extension Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in extensionTypes" :key="item.id" :value="item.id">
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
          <div v-if="!isEdit" class="w-full mt-2 sm:mt-0 sm:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="package_id">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Select Package
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Please Select Package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="(item, key) in clientPackages" :key="key" :value="Number(key)">
                          <!-- (Remaining = Total Quantity - Assigned) -->
                          {{ item.package_name }} ({{ item.quantity - item.assigned.length }} remaining)
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
        <div class="flex flex-col md:flex-row gap-x-3 items-start">
          <div class="w-full md:w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="group_id">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Group
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField" multiple>
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in extensionGroups" :key="item" :value="item.id">
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
          <div class="w-full md:w-1/2 mt-2 sm:mt-0">
            <FormField v-slot="{ componentField }" class="" name="timezone">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm">
                  Times Zone
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-sm text-wrap py-2 placeholder:text-[#ef698180]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in timeZones" :key="item.value" :value="item.value">
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
      </div>
    </div>

    <!-- Message Forwarding -->
    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        Message Forwarding
      </div>
      <div class="p-5 space-y-5 flex">
        <div class="w-full  sm:w-[30%] flex  items-center gap-x-5">
          <div class="text-sm font-normal text-nowrap">
            Forward Incoming SMS To:
          </div>
          <div class="flex justify-between flex-wrap items-center gap-5 w-full">
            <div class="flex items-center gap-x-1">
              <FormField v-slot="{ value, handleChange }" name="receive_sms_on_email">
                <FormItem class="flex items-center gap-x-1">
                  <FormControl>
                    <Checkbox
                      id="email"
                      :model-value="value" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                  <Label class="text-sm font-normal" for="email">Email</Label>
                </FormItem>
              </FormField>
            </div>
            <div class="flex items-center gap-x-1">
              <FormField v-slot="{ value, handleChange }" name="receive_sms_on_mobile">
                <FormItem class="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      id="sms"
                      :model-value="value" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                  <Label class="text-sm font-normal" for="sms">SMS</Label>
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sticky bottom-0 right-0 w-full  shadow-2xl p-4 bg-white">
      <Button :disabled="extensionByIdStatus === 'pending'" class="w-full h-[52px]" type="submit" @click="onSubmit">
        <Icon :name="loading ? 'line-md:loading-twotone-loop' : 'material-symbols:save'" size="20" />
        {{ isEdit ? 'Update' : 'Submit' }}
      </Button>
    </div>
  </form>
</template>
