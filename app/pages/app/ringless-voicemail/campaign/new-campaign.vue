<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useFilter } from 'reka-ui'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'

const route = useRoute()
const id = route.query.id
const Title = route.query.name
const isEdit = computed(() => !!id)

const breadcrumbs = [
  {
    label: 'ringless voicemail',
    href: '/app/ringless-voicemail/campaign',
  },
  {
    label: isEdit.value ? 'Edit Campaign' : 'Create New Campaign',
    active: true,
  },
]

const headerTitle= isEdit.value ? Title:'Create New Campaign'

const countryCodes = ref([
  { id: 1, name: 'USA', phonecode: '1' },
  { id: 2, name: 'UK', phonecode: '44' },
  { id: 3, name: 'Canada', phonecode: '1' },
  { id: 4, name: 'Australia', phonecode: '61' },
])

const callerIdOptions = ref([
  { id: 'default', name: 'Default Caller ID' },
  { id: 'custom', name: 'Custom Caller ID' },
])

const customCallerIdOptions = ref([
  { id: 'sales', title: 'Sales Department', cli: '1234567890' },
  { id: 'support', title: 'Support Team', cli: '9876543210' },
])

const dialModeOptions = ref([
  { id: 'predictive', title: 'Predictive Dialing' },
  { id: 'progressive', title: 'Progressive Dialing' },
  { id: 'preview', title: 'Preview Dialing' },
])

const callRatioOptions = ref([
  { id: '1:1', title: '1:1 Ratio' },
  { id: '2:1', title: '2:1 Ratio' },
  { id: '3:1', title: '3:1 Ratio' },
])

const voiceTemplateOptions = ref([
  { id: 'welcome', title: 'Welcome Message' },
  { id: 'sales', title: 'Sales Pitch' },
  { id: 'followup', title: 'Follow-up' },
])

const sipGatewayOptions = ref([
  { id: 'standard', name: 'Standard Gateway' },
  { id: 'premium', name: 'Premium Gateway' },
  { id: 'enterprise', name: 'Enterprise Gateway' },
])

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    campaignName: z.string().min(3, 'Name must be at least 3 characters'),
    countryCode: z.string().min(1, 'Country code is required'),
    description: z.string().optional(),
    callerId: z.string().min(1, 'Caller ID is required'),
    customCallerId: z.string().optional(),
    dialMode: z.string().min(1, 'Dial mode is required'),
    callRatio: z.string().min(1, 'Call ratio is required'),
    callStartTime: z.string().optional(),
    callEndTime: z.string().optional(),
    voiceTemplate: z.string().optional(),
    sipGateway: z.string().min(1, 'SIP Gateway is required'),
    enableTimeZone: z.boolean().optional(),
    status: z.number().int().min(0).max(1),
  }),
)

const { handleSubmit, values, setFieldValue,setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    status: 1, // Default to active
    enableTimeZone: false,
  },
})

const loading = ref(false)

function onSelectCallerId(value: string) {
  if (value !== 'custom') {
    setFieldValue('customCallerId', '')
  }
}

function onSelectDialMode(value: string) {
  console.log('Selected dial mode:', value)
}

const onSubmit = handleSubmit((values) => {
  loading.value = true
  console.log('Form submitted with values:', values)

  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<template>
  <BaseHeader :title="headerTitle" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button variant="outline" class="h-11">
        <icon name="material-symbols:save-rounded" size="18" />
        Save as Draft
      </Button>
    </template>
  </BaseHeader>
  <div class=" relative h-[calc(100vh-190px)] overflow-y-auto">
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
               <ToggleGroup 
  :model-value="values.status" 
  @update:model-value="(val) => setFieldValue('status', val)" 
  type="single"
>
  <ToggleGroupItem 
    :value="1" 
    class="!bg-[#FEF2F2] data-[state=on]:!bg-green-600 data-[state=on]:text-white font-normal gap-x-0 data-[state=on]:rounded-lg text-sm" 
    aria-label="Status active"
  >
    <Icon name="stash:circle-dot" size="30" />
    Active
  </ToggleGroupItem>
  <ToggleGroupItem 
    :value="0" 
    class="!bg-[#FEF2F2] data-[state=on]:!bg-red-600 data-[state=on]:rounded-lg font-normal data-[state=on]:text-white text-sm" 
    aria-label="Status inactive"
  >
    Inactive
  </ToggleGroupItem>
</ToggleGroup>
              </div>
            </div>
          </div>
          <div class="p-5 space-y-5 w-full">
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField }" v-model="values.campaignName" name="campaignName">
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
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.countryCode" name="countryCode">
                  <FormItem>
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
                            <SelectItem v-for="item in countryCodes" :key="item.id" :value="item.phonecode">
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
              <FormField v-slot="{ componentField }" v-model="values.description" name="description">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter Campaign Description" v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>

        <!-- Voice Mail Details -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Voice Mail Details
            </div>
          </div>
          <div class="p-5 space-y-5 w-full">
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.callerId" name="callerId">
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
                            <SelectItem v-for="item in callerIdOptions" :key="item.id" :value="item.id">
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
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.customCallerId" name="customCallerId">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Custom Caller Id
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" :disabled="values.callerId !== 'custom'">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Custom Caller Id" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in customCallerIdOptions" :key="item.id" :value="item.id">
                              {{ item.title }} ({{ item.cli }})
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
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.dialMode" name="dialMode">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Dial Mode
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" @update:model-value="onSelectDialMode">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Dialing Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in dialModeOptions" :key="item.id" :value="item.id">
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
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.callRatio" name="callRatio">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Call Ratio
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select Call Ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in callRatioOptions" :key="item.id" :value="item.id">
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
              <div class="w-1/2 flex gap-2 flex-between items-center">
                <div class="w-1/2">
                  <FormField v-slot="{ componentField }" v-model="values.callStartTime" name="callStartTime">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        From
                      </FormLabel>
                      <FormControl>
                        <Input type="time" v-bind="componentField" class="" />
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>
                <div class="w-1/2">
                  <FormField v-slot="{ componentField }" v-model="values.callEndTime" name="callEndTime">
                    <FormItem>
                      <FormLabel class="font-normal text-sm">
                        To
                      </FormLabel>
                      <FormControl>
                        <Input type="time" v-bind="componentField" />
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>
              </div>
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.voiceTemplate" name="voiceTemplate">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Voice Template
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select Voice Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in voiceTemplateOptions" :key="item.id" :value="item.id">
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

        <!-- Other Information -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Other Information
            </div>
          </div>
          <div class="p-5">
            <div class=" gap-x-5 w-full flex items-start">
              <div class="w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.sipGateway" name="sipGateway">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      SIP Gateway
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select SIP Gateway" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in sipGatewayOptions" :key="item.id" :value="item.id">
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
                <FormField v-slot="{ componentField }" v-model="values.enableTimeZone" name="enableTimeZone">
                  <FormItem>
                    <FormLabel class="font-normal text-white">
                      Enable Time Zone
                    </FormLabel>
                    <div class="w-full bg-[#00A0860D] h-11 m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                      <p>Enable Time Zone Rule</p>
                      <Switch :checked="values.enableTimeZone" 
  @update:checked="(val) => setFieldValue('enableTimeZone', val)"
  class="data-[state=checked]:bg-green-600"  />
                    </div>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4 gap-2 flex ">
      <Button class="w-1/2 h-[52px]" variant="outline" :loading="loading" @click="onSubmit">
        <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:close'" size="20" />
        Cancel
      </Button>
      <Button class="w-1/2 h-[52px]" type="submit" :loading="loading" @click="onSubmit">
        <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save'" size="20" />
        Save Campaign
      </Button>
    </div>
  </div>
</template>