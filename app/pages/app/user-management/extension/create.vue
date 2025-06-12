<script lang="ts" setup>
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from '~/components/ui/button'

import { Checkbox } from '~/components/ui/checkbox'

import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'

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

const servers = [
  {
    id: 1,
    name: 'sip2.phonify.com',
  },
  {
    id: 2,
    name: 'sip3.phonify.com',
  },
  {
    id: 3,
    name: 'sip4.phonify.com',
  },
  {
    id: 4,
    name: 'sip5.phonify.com',
  },
  {
    id: 5,
    name: 'sip6.phonify.com',
  },
]

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

const CLIS = [
  {
    id: 1,
    name: 'Area Code',
  },
  {
    id: 2,
    name: 'Custom',
  },
]

const Timezones = [
  {
    id: 1,
    name: '(GMT-05:00) Eastern Time (US & Canada)',
  },
  {
    id: 2,
    name: '(GMT-04:00) Atlantic Time (Canada)',
  },
  {
    id: 3,
    name: '(GMT-03:00) Brazil',
  },
]
const selectedCountry = ref('+1')

const formSchema = toTypedSchema(z.object({
  extension_name: z.string().regex(/^\d+$/, 'must be a number').min(1, 'required').max(4, 'maximum 4 character allowed'),
  first_name: z.string().min(1, 'required').max(50),
  last_name: z.string().min(1, 'required').max(50),
  email: z.string().min(1, 'required').email('invalid email format').max(50),
  mobile: z.string().regex(/^\d+$/, 'must be a number').min(1, 'required').max(10, 'maximum 10 character allowed'),
  // country_code: z.string().min(1, 'required'),
  follow_me: z.string().min(1, 'required'),
  call_forward: z.string().min(1, 'required'),
  voicemail: z.boolean(),
  vm_pin: z.string().min(1, 'required'),
  voicemail_send_to_email: z.boolean(),
  twinning: z.string().min(1, 'required'),
  asterisk_server_id: z.number().min(1, 'required'),
  timezone: z.number().min(1, 'required'),
  cli_setting: z.number().min(1, 'required'),
  cli: z.string().min(1, 'required'),
  cnam: z.string().min(1, 'required'),
  password: z.string().min(1, 'required').max(20),
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

}))

const { handleSubmit, values, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    timezone: 1,
  },
})
const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <!-- {{ values }} -->
  <!-- {{ errors.extension }} -->
  <BaseHeader title="Add Extension" :breadcrumbs />

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
                    <Input type="text" class="text-sm focus-visible:ring-0 focus:ring-0 border-0 font-normal placeholder:text-sm h-11" v-bind="componentField" />
                    <Button class=" text-sm font-normal mr-1 rounded-lg">
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
                    <Button class=" text-sm font-normal mr-1 rounded-lg">
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
                        <SelectItem v-for="item in servers" :key="item.id" :value="item.id">
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
                  <Input type="text" placeholder="Type VM Pin" class="text-sm focus-visible:ring-0 focus:ring-0 border-0 font-normal placeholder:text-sm h-11" v-bind="componentField" />
                  <Button class=" text-sm font-normal mr-1 rounded-lg">
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
            Follow Me
            <Switch class="data-[state=checked]:bg-green-600" />
          </div>
          <div class="flex items-center justify-between bg-[#00A0860D] p-4 rounded text-sm font-normal flex-1">
            Call forward
            <Switch class="data-[state=checked]:bg-green-600" />
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
        <div class="flex gap-x-3 items-start">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="mobile">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <div class="border flex items-center rounded-lg  w-full">
                      <Select v-model="selectedCountry" default-value="+1">
                        <SelectTrigger class="w-min border-none rounded-sm bg-gray-100 !h-11">
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
                      <Input type="text" placeholder="Enter Phone Number" class="text-sm focus-visible:ring-0 focus:ring-0 border-0 font-normal placeholder:text-sm h-11" v-bind="componentField" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>

          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="cli_setting">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  CLI Setting
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Area Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in CLIS" :key="item.id" :value="item.id">
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
                        <SelectItem v-for="item in [{ name: 'Package 1', id: 1 }]" :key="item.id" :value="item.id">
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
                        <SelectItem v-for="item in Timezones" :key="item.id" :value="item.id">
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
