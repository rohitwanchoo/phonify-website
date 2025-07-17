<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { useRouter } from 'vue-router'

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

const countryCodes = ref([
  { id: 1, name: 'USA', phonecode: '1' },
  { id: 2, name: 'UK', phonecode: '44' },
  { id: 3, name: 'Canada', phonecode: '1' },
  { id: 4, name: 'Australia', phonecode: '61' },
  { id: 5, name: 'India', phonecode: '91' },
])

const userOptions = ref([
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Robert Johnson' },
])

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    phoneNumber: z.string().min(10, 'Phone number must be 10 digits').max(10, 'Phone number must be 10 digits'),
    countryCode: z.string().min(1, 'Country code is required'),
    callerName: z.string().min(1, 'Caller name is required'),
    isMainline: z.boolean().default(false),
    redirectToLastAgent: z.boolean().default(false),
    enableSMS: z.boolean().default(false),
    enableSMSAI: z.boolean().default(false),
    assignedUser: z.string().optional(),
    isExclusiveForUser: z.boolean().default(false),
    applyCallTimes: z.boolean().default(false),
    applyHolidayCalendar: z.boolean().default(false),
    callScreeningAudio: z.boolean().default(false),
  }),
)

const { handleSubmit, values, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    countryCode: '1',
    isMainline: false,
    redirectToLastAgent: false,
    enableSMS: false,
    enableSMSAI: false,
    isExclusiveForUser: false,
    applyCallTimes: false,
    applyHolidayCalendar: false,
    callScreeningAudio: false,
  },
})

const loading = ref(false)
const router = useRouter()

function getCountryLabel(phoneCode: string) {
  const country = countryCodes.value.find(c => c.phonecode === phoneCode)
  return country ? `${country.name} (+${country.phonecode})` : 'Select Country'
}

const onSubmit = handleSubmit((values) => {
  loading.value = true
  console.log('Form submitted with values:', values)

  // Simulate API call
  setTimeout(() => {
    loading.value = false
    router.push({path: '/app/inbound-settings/did-configuration/edit',
    query: { id: row.original.id }})
  }, 1000)
})

function onCancel() {
  resetForm()
  console.log('Form cancelled and reset')
}
</script>

<template>
  <BaseHeader title="Edit Voice template" :breadcrumbs="breadcrumbs" />
  <div class="relative h-[calc(100vh-190px)] overflow-y-hidden border rounded-lg">
    <form class="space-y-4 h-full" @submit.prevent="onSubmit">
      <!-- Voice template DETAILS -->
      <div class="h-full rounded-lg bg-white">
        <div class="border-b px-5 py-5 flex items-center justify-between">
          <div class="text-lg font-medium text-primary/100">
            Voice template Details
          </div>
        </div>
        <div class="p-5 space-y-5 w-full">
          <div class="flex gap-[16px] w-full">
            <div class="w-1/2">
              <FormField v-slot="{ componentField, errorMessage }" name="phoneNumber">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div class="flex">
                      <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg overflow-hidden w-full">
                        <FormField v-slot="{ componentField: countryCodeComponentField }" name="countryCode">
                          <FormItem>
                            <FormControl>
                              <Select v-bind="countryCodeComponentField">
                                <SelectTrigger
                                  class="w-fit rounded-r-none bg-gray-100 !h-11"
                                  :class="errorMessage && 'border-red-600 border'"
                                >
                                  <SelectValue>
                                    <span class="text-sm text-nowrap">
                                      {{ getCountryLabel(values.countryCode) }}
                                    </span>
                                  </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem
                                      v-for="item in countryCodes"
                                      :key="item.id"
                                      :value="item.phonecode"
                                    >
                                      {{ item.name }} (+{{ item.phonecode }})
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        </FormField>
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
                  <FormMessage class="text-sm text-right" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/2">
              <FormField v-slot="{ componentField, errorMessage }" name="callerName">
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
            </div>
          </div>

          <div class="w-full flex gap-[16px]">
            <div class="w-1/4">
              <!-- Set As Mainline -->
              <FormField name="isMainline">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Set As Mainline
                  </FormLabel>
                  <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Set as mainline</p>
                    <FormControl>
                      <Switch
                        :checked="values.isMainline"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('isMainline', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/4">
              <!-- Redirect To Last Spoke Agent -->
              <FormField name="redirectToLastAgent">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Redirect To Last Spoke Agent
                  </FormLabel>
                  <div class="w-full bg-gray-50 h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Redirect to last spoke agent</p>
                    <FormControl>
                      <Switch
                        :checked="values.redirectToLastAgent"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('redirectToLastAgent', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/4">
              <!-- Enable SMS -->
              <FormField name="enableSMS">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Enable SMS
                  </FormLabel>
                  <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Enable SMS</p>
                    <FormControl>
                      <Switch
                        :checked="values.enableSMS"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('enableSMS', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/4">
              <!-- Enable SMS AI -->
              <FormField name="enableSMSAI">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Enable SMS AI
                  </FormLabel>
                  <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Enable SMS AI</p>
                    <FormControl>
                      <Switch
                        :checked="values.enableSMSAI"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('enableSMSAI', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
          </div>
          <div class="w-full">
            <FormField v-slot="{ componentField, errorMessage }" name="assignedUser">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Assign to User
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in userOptions" :key="item.id" :value="item.id">
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
          <div class="w-full flex gap-[16px]">
            <div class="w-1/4">
              <!-- Set Exclusive For User -->
              <FormField name="isExclusiveForUser">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Set exclusive for user
                  </FormLabel>
                  <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Set exclusive for user</p>
                    <FormControl>
                      <Switch
                        :checked="values.isExclusiveForUser"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('isExclusiveForUser', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/4">
              <!-- Apply Call Times -->
              <FormField name="applyCallTimes">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Apply call times
                  </FormLabel>
                  <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Apply call times</p>
                    <FormControl>
                      <Switch
                        :checked="values.applyCallTimes"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('applyCallTimes', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/4">
              <!-- Apply Holiday Calendar -->
              <FormField name="applyHolidayCalendar">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Apply holiday calendar
                  </FormLabel>
                  <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Apply Holiday calendar</p>
                    <FormControl>
                      <Switch
                        :checked="values.applyHolidayCalendar"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('applyHolidayCalendar', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
            <div class="w-1/4">
              <!-- Call Screening Audio -->
              <FormField name="callScreeningAudio">
                <FormItem>
                  <FormLabel class="font-normal text-white">
                    Call screening audio
                  </FormLabel>
                  <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                    <p>Call screening audio</p>
                    <FormControl>
                      <Switch
                        :checked="values.callScreeningAudio"
                        class="data-[state=checked]:bg-green-600"
                        @update:checked="(val) => setFieldValue('callScreeningAudio', val)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>
      </div>
      <div class="sticky bottom-0 right-0 w-full bg-white p-4 gap-2 flex border rounded-b-lg ">
        <Button class="w-1/2 h-[52px]" variant="outline" :loading="loading" type="button" @click="onCancel">
          <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:close'" size="20" />
          Cancel
        </Button>
        <Button class="w-1/2 h-[52px]" type="submit" :loading="loading">
          <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save'" size="20" />
          Save
        </Button>
      </div>
    </form>
  </div>
</template>
