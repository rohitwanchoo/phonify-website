<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
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

const breadcrumbs = [
  {
    label: 'Extension List',
    href: '/app/user-management/extension',
  },
  {
    label: 'Add Extension',
    active: true,
  },
]
// fetch voice servers
const { data: voiceServers } = await useLazyAsyncData('get-voice-servers', () =>
  useApi().post('client_ip_list'), {
  transform: (res) => {
    return res.data || []
  },
})

// fetch client packages
const { data: ClientPackages } = await useLazyAsyncData('get-client-packages', () =>
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

const countries = [
  {
    id: 1,
    code: '+1',
    name: 'USA',
  },
  {
    id: 2,
    code: '+44',
    name: 'UK',
  },

]

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

const selectedCountry = ref('+1')

const formSchema = toTypedSchema(z.object({
  extension_name: z.string().regex(/^\d+$/, 'must be a number').min(1, 'required').max(4, 'maximum 4 character allowed'),
  first_name: z.string().min(1, 'required').max(50),
  last_name: z.string().min(1, 'required').max(50),
  email: z.string().min(1, 'required').email('invalid email format').max(50),
  mobile: z.string().regex(/^\d+$/, 'must be a number').min(1, 'required').max(10, 'maximum 10 character allowed'),
  // country_code: z.string().min(1, 'required'),
  follow_me: z.boolean(),
  call_forward: z.boolean(),
  voicemail: z.boolean(),
  vm_pin: z.string().min(1, 'required'),
  voicemail_send_to_email: z.boolean(),
  twinning: z.string().min(1, 'required'),
  asterisk_server_id: z.number().min(1, 'required'),
  timezone: z.string().min(1, 'required'),
  cli_setting: z.string().min(0, 'required'),
  cli: z.string().optional(), // initially optional
  // cnam: z.string().min(1, 'required'),
  password: z.string().min(1, 'required').max(10, 'maximum 10 character allowed'),
  extension_type: z.string().min(1, 'required'),
  sms_setting_id: z.number().min(1, 'required'),
  receive_sms_on_email: z.boolean(),
  receive_sms_on_mobile: z.boolean(),
  ip_filtering: z.boolean(),
  enable_2fa: z.boolean(),
  voip_configuration_id: z.number().min(1, 'required'),
  app_status: z.string().min(1, 'required'),
  package_id: z.number().min(1, 'required'),
  group_id: z.array(z.number()).min(1, 'At least one group must be selected'),

  // voiceServer: z.number().min(1, 'required'),
  // phoneNumber: z.string().min(1, 'required').max(10),
  // cliSettings: z.number().min(1, 'required'),
  // extensionType: z.string().min(1, 'required'),
  // package: z.string().min(1, 'required'),

}).refine((data) => {
  // If CLI setting is Custom (1), CLI must be provided and non-empty
  if (data.cli_setting === '1') {
    return data.cli && data.cli.trim() !== ''
  }
  return true
}, {
  message: 'CLI is required when CLI Setting is Custom',
  path: ['cli'],
}),
)

const { handleSubmit, values, setValues, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    timezone: 'America/New_York',
    app_status: 'active',
    call_forward: false,
    follow_me: false,

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
  setFieldValue('extension_name', extension.toString())
}

function autoGeneratePassword() {
  const password = Math.random().toString(36).slice(-8)
  setFieldValue('password', password)
}

function autoGenerateVoiceMailPin() {
  const voiceMailPin = Math.floor(1000 + Math.random() * 9000)
  setFieldValue('vm_pin', voiceMailPin.toString())
}
const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})

function onNumericInput(e: Event) {
  const input = e.target as HTMLInputElement
  const currentValue = input.value
  const numericValue = currentValue.replace(/\D/g, '')
  const truncatedValue = numericValue.slice(0, 4)

  if (currentValue !== truncatedValue) {
    input.value = truncatedValue
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
</script>

<template>
  <!-- {{ values }} -->
  <!-- {{ errors.extension }} -->
  <BaseHeader title="Add Extension" :breadcrumbs />

  <form class="space-y-4 relative h-[calc(100vh-165px)] overflow-y-auto">
    <!-- User Information -->
    <div>
      {{ values }}
    </div>
    <div class="w-full text-red-600 text-center">
      ////////////////////////////////////////////////////////////////////////////////////
    </div>
    <div>
      {{ errors }}
    </div>

    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        User Information
      </div>
      <div class="p-5 space-y-5 w-full">
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="first_name">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Type Fist Name" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="last_name">
              <FormItem>
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
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="extension_name">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Extension
                </FormLabel>
                <FormControl>
                  <!-- <Input type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Extension" v-bind="componentField" /> -->

                  <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg">
                    <Input type="text" class="text-sm focus-visible:ring-0 focus:ring-0 border-0 font-normal placeholder:text-sm h-11" v-bind="componentField" @input="onNumericInput" />
                    <Button type="button" class=" text-sm font-normal mr-1 rounded-lg" @click="autoGenerateExtension">
                      Auto Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="email">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Type E-mail" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="password">
              <FormItem>
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
          <div class="w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="asterisk_server_id">
              <FormItem>
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
            <FormItem>
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
                    maxlength="4"
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
        <div class="flex gap-x-2">
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            <FormField v-slot="{ value, handleChange }" name="follow_me">
              <FormItem class="flex items-center justify-between w-full">
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
              <FormItem class="flex items-center justify-between w-full">
                Call forward
                <FormControl>
                  <Switch
                    :model-value="value"
                    class="data-[state=checked]:bg-green-600" @update:model-value="handleChange"
                  />
                </FormControl>
                <!-- <FormMessage class="text-sm" /> -->
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            Voicemail
            <Switch class="data-[state=checked]:bg-green-600" />
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            Send Voicemail to email
            <Switch class="data-[state=checked]:bg-green-600" />
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
        <div class="flex gap-x-2">
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            Enable 2FA
            <Switch class="data-[state=checked]:bg-green-600" />
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            Allow Mobile App Login
            <Switch class="data-[state=checked]:bg-green-600" />
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            Twinning
            <Switch class="data-[state=checked]:bg-green-600" />
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            IP Filtering
            <Switch class="data-[state=checked]:bg-green-600" />
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
        <ul v-auto-animate="{ duration: 150 }" class="flex gap-x-3 items-start">
          <li class="w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="mobile">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg overflow-hidden w-full">
                      <Select v-model="selectedCountry" default-value="+1">
                        <SelectTrigger class="w-min border-none rounded-sm rounded-r-none bg-gray-100 !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Server" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in countries" :key="item.id" :value="item.code">
                              {{ item.name }} ({{ item.code }})
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        maxlength="10"
                        placeholder="Enter Phone Number"
                        class="text-sm focus-visible:ring-0 rounded-l-none focus:ring-0 border-0 font-normal placeholder:text-sm h-11"
                        v-bind="componentField"
                        @input="$event.target.value = $event.target.value.replace(/[^0-9]/g, '').slice(0, 10)"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </li>

          <li class="w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" class="" name="cli_setting">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  CLI Setting
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select CLI settings" />
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
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </li>
          <li v-if="values.cli_setting === '1'" class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="cli">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Custom CLI
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <Skeleton v-if="customCliStatus === 'pending'" class="h-11 w-full" />
                    <SelectTrigger v-else class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Custom CLI" />
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
        <div class="flex gap-x-3 items-start">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="extensionType">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Extension Type
                </FormLabel>
                <FormControl>
                  <Select default-value="Extension" v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in ['Extension']" :key="item" :value="item">
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
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="package_id">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Select Package
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Please Select Package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="(item, key) in ClientPackages" :key="key" :value="Number(key)">
                          {{ item.package_name }}
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
        <div class="flex gap-x-3 items-center">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="Group">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Group
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in extensionGroups" :key="item" :value="item">
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
            <FormField v-slot="{ componentField }" class="" name="timezone">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Times Zone
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in listTimezones()" :key="item" :value="item">
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
        </div>
      </div>
    </div>

    <!-- Message Forwarding -->
    <div class="border rounded-lg">
      <div class="px-5 pt-5 pb-3 text-[16px] font-medium border-b">
        Message Forwarding
      </div>
      <div class="p-5 space-y-5 flex">
        <div class="w-[30%] flex items-center gap-x-5">
          <div class="text-sm font-normal text-nowrap">
            Forward Incoming SMS To:
          </div>
          <div class="flex justify-between items-center w-full">
            <div class="flex items-center gap-x-1">
              <Checkbox id="email" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
              <Label class="text-sm font-normal" for="email">Email</Label>
            </div>
            <div class="flex items-center gap-x-1">
              <Checkbox id="sms" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
              <Label class="text-sm font-normal" for="sms">SMS</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sticky bottom-0 right-0 w-full  shadow-2xl p-4 bg-white">
      <Button class="w-full h-[52px]" type="submit" @click="onSubmit">
        <Icon name="material-symbols:save" size="20" />

        Submit
      </Button>
    </div>
  </form>
</template>
