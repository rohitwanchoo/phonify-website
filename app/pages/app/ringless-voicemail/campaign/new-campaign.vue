<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'

const route = useRoute()
const router = useRouter()
const id = route.query.id
const isEdit = computed(() => !!id)
const pageTitle = ref(isEdit.value ? 'Edit Campaign' : 'Create New Campaign')

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

const { data: countryCodeList, status: countryCodeStatus } = await useLazyAsyncData('get-country-code-list', () =>
  useApi().post('/country-list', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// list voice template
const { data: voiceTemplateOptions, status: voiceTemplateStatus } = await useLazyAsyncData('voice-template-list', () =>
  useApi().get('/voice-templete', {
    // start: 0,
    // limit: 10,
  }), {
  immediate: true,
  transform: res => res.data,
})

const { data: sipGatewayOptions, status: sipGatewayStatus } = await useLazyAsyncData('sip-gateway-list', () =>
  useApi().get('/sip-gateways'), {
  immediate: true,
  transform: res => res.data,
})

const { data: customCallerIdOptions, status: customCallerIdListStatus } = await useLazyAsyncData('get-custom-caller-id-list', () =>
  useApi().post('/did'), {
  immediate: true,
  transform: res => res.data,
})

const callerIdOptions = ref([
  { id: 'area_code', name: 'Area Code' },
  { id: 'area_code_random', name: 'Area Code and Randomiser' },
  { id: 'custom', name: 'Custom' },
])

const callerTimeOptions = ref([
  { id: '1' },
  { id: '2' },
  { id: '5' },
  { id: '10' },
  { id: '20' },
  { id: '30' },
])

const callRatioOptions = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: `${i + 1}`,
    title: `${i + 1}`,
  })),
)

// Form validation schema with updated field names
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Name must be at least 3 characters'),
    country_code: z.number().min(1, 'Country code is required'),
    description: z.string().optional(),
    caller_id: z.string().min(1, 'Caller ID is required'),
    custom_caller_id: z.union([z.number(), z.string()]),
    call_duration: z.string().min(1, 'Call duration is required'),
    call_ratio: z.string().min(1, 'Call ratio is required'),
    call_time_start: z.string().optional(),
    call_time_end: z.string().optional(),
    voice_template_id: z.number().min(1, 'Voice Template is required'),
    sip_gateway_id: z.number().min(1, 'SIP Gateway is required'),
    time_based_calling: z.union([
      z.boolean().transform(val => (val ? 1 : 0)),
      z.number().int().min(0).max(1),
    ]).optional(),
    status: z.number().int().min(0).max(1),
  }),
)

const { handleSubmit, values, setFieldValue, setValues, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    status: 1,
    time_based_calling: 0,
  },
})

const loading = ref(false)
const fetchLoading = ref(false)

function onSelectCallerId(value: string) {
  if (value !== 'custom') {
    setFieldValue('custom_caller_id', '')
  }
  else {
    setFieldValue('custom_caller_id', undefined)
  }
}

function handleCancel() {
  if (isEdit.value) {
    resetForm()
    router.push({
      path: `/app/ringless-voicemail/campaign`,
    })
  }
  else {
    resetForm()
  }
}

async function fetchCampaignData() {
  if (!isEdit.value)
    return
  try {
    fetchLoading.value = true
    const res = await useApi().post('/ringless/campaign/show', {
      campaign_id: id,
    })

    if (res && res.length > 0) {
      const campaignData = res[0]

      const formValues = {
        title: campaignData.title,
        country_code: campaignData.country_code,
        description: campaignData.description,
        caller_id: campaignData.caller_id,
        custom_caller_id: campaignData.caller_id === 'custom' ? campaignData.custom_caller_id : '',
        call_duration: campaignData.call_duration.toString(),
        call_ratio: campaignData.call_ratio.toString(),
        call_time_start: campaignData.call_time_start?.substring(0, 5) || '',
        call_time_end: campaignData.call_time_end?.substring(0, 5) || '',
        voice_template_id: campaignData.voice_template_id || 0,
        sip_gateway_id: campaignData.sip_gateway_id || 0,
        time_based_calling: campaignData.time_based_calling === 1,
        status: Number.parseInt(campaignData.status),
      }

      setValues(formValues)
      pageTitle.value = campaignData.title
    }
  }
  catch (error) {
    console.error('Error fetching campaign data:', error)
    showToast({
      message: 'Failed to load campaign data',
      type: 'error',
    })
  }
  finally {
    fetchLoading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  values.time_based_calling = values.time_based_calling ? 1 : 0
  try {
    let res
    if (isEdit.value) {
      // Edit mode - call update API
      res = await useApi().post('/ringless/campaign/edit', {
        ...values,
        campaign_id: id, // Include the campaign ID for update
      })
    }
    else {
      // Create mode - call add API
      res = await useApi().post('/ringless/campaign/add', values)
    }

    if (res.success) {
      showToast({
        message: res.message,
        type: 'success',
      })
      router.push({
        path: `/app/ringless-voicemail/campaign`,
      })
    }
    else {
      showToast({
        message: res.message || (isEdit.value ? 'Failed to update campaign' : 'Failed to create campaign'),
        type: 'error',
      })
    }
  }
  catch (error) {
    console.error('Error submitting form:', error)
    showToast({
      message: isEdit.value ? 'Failed to update campaign' : 'Failed to create campaign',
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})

onMounted(async () => {
  await fetchCampaignData()
})
</script>

<template>
  <BaseHeader :title="pageTitle" :breadcrumbs="breadcrumbs">
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
                  type="single"
                  @update:model-value="(val) => setFieldValue('status', val)"
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
            <div class="flex flex-col sm:flex-row gap-[16px] w-full">
              <div class="sm:w-1/2">
                <FormField v-slot="{ componentField }" v-model="values.title" name="title">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        autofocus
                        type="text"
                        class="text-sm font-normal placeholder:text-sm h-11"
                        placeholder="Enter Campaign Name"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="sm:w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.country_code" name="country_code">
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
                            <template v-if="countryCodeStatus === 'pending'">
                              <div class="flex items-centeusr justify-center p-4">
                                <Icon name="eos-icons:loading" size="24" />
                              </div>
                            </template>
                            <template v-else>
                              <SelectItem v-for="item in countryCodeList" :key="item.id" :value="item.id">
                                (+{{ item.phonecode }}) {{ item.name }}
                              </SelectItem>
                            </template>
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
            <div class="flex flex-col sm:flex-row gap-[16px] w-full">
              <div class="sm:w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.caller_id" name="caller_id">
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
              <div class="sm:w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.custom_caller_id" name="custom_caller_id">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Custom Caller Id
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" :disabled="values.caller_id !== 'custom'">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Custom Caller Id" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <template v-if="customCallerIdListStatus === 'pending'">
                              <div class="flex items-center justify-center p-4">
                                <Icon name="eos-icons:loading" size="24" />
                              </div>
                            </template>
                            <template v-else>
                              <SelectItem v-for="item in customCallerIdOptions" :key="item.id" :value="Number(item.cli)">
                                {{ formatNumber(item.cli) }} {{ item.cnam }} {{ item.forward_number }}
                              </SelectItem>
                            </template>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-[16px] w-full">
              <div class="sm:w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.call_duration" name="call_duration">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Call Duration
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                          <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select Call Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in callerTimeOptions" :key="item.id" :value="item.id">
                              {{ item.id }} minutes
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="sm:w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.call_ratio" name="call_ratio">
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
            <div class="flex flex-col md:flex-row gap-4 w-full">
              <!-- Time Range Section -->
              <div class="flex flex-col md:flex-row gap-2 md:justify-between md:items-center w-full md:w-1/2">
                <!-- From Time -->
                <div class="w-full md:w-1/2">
                  <FormField v-slot="{ componentField }" v-model="values.call_time_start" name="call_time_start">
                    <FormItem>
                      <FormLabel class="font-normal text-white text-sm">
                        From
                      </FormLabel>
                      <FormControl>
                        <div class="flex justify-between w-full items-center border px-3 rounded-sm h-11">
                          <p class="text-sm">
                            From
                          </p>
                          <Input
                            type="time"
                            v-bind="componentField"
                            class="shadow-none border-none w-full max-w-[120px]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>

                <!-- To Time -->
                <div class="w-full md:w-1/2">
                  <FormField v-slot="{ componentField }" v-model="values.call_time_end" name="call_time_end">
                    <FormItem>
                      <FormLabel class="font-normal text-white text-sm">
                        To
                      </FormLabel>
                      <FormControl>
                        <div class="flex justify-between w-full items-center border px-3 rounded-sm h-11">
                          <p class="text-sm">
                            To
                          </p>
                          <Input
                            type="time"
                            v-bind="componentField"
                            class="shadow-none border-none w-full max-w-[120px]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage class="text-sm" />
                    </FormItem>
                  </FormField>
                </div>
              </div>

              <!-- Voice Template Section -->
              <div class="w-full md:w-1/2">
                <FormField
                  v-slot="{ componentField, errorMessage }"
                  v-model="values.voice_template_id"
                  name="voice_template_id"
                >
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Voice Template
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger
                          :class="errorMessage && 'border-red-600'"
                          class="w-full !h-11"
                        >
                          <SelectValue
                            class="text-sm data-[placeholder]:text-muted-foreground"
                            placeholder="Select Voice Template"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <template v-if="voiceTemplateStatus === 'pending'">
                              <div class="flex items-center justify-center p-4">
                                <Icon name="eos-icons:loading" size="24" />
                              </div>
                            </template>
                            <template v-else>
                              <SelectItem
                                v-for="item in voiceTemplateOptions"
                                :key="item.templete_id"
                                :value="item.templete_id"
                              >
                                {{ item.templete_name }}
                              </SelectItem>
                            </template>
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
            <div class="w-full flex flex-col sm:flex-row items-start">
              <div class="w-full sm:w-1/2">
                <FormField v-slot="{ componentField, errorMessage }" v-model="values.sip_gateway_id" name="sip_gateway_id">
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
                            <template v-if="sipGatewayStatus === 'pending'">
                              <div class="flex items-center justify-center p-4">
                                <Icon name="eos-icons:loading" size="24" />
                              </div>
                            </template>
                            <template v-else>
                              <SelectItem v-for="item in sipGatewayOptions" :key="item.id" :value="item.id">
                                {{ item.client_name }}
                              </SelectItem>
                            </template>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-sm" />
                  </FormItem>
                </FormField>
              </div>
              <div class="w-full sm:w-1/2">
                <FormField v-slot="{ value, handleChange }" name="time_based_calling">
                  <FormItem>
                    <FormLabel class="font-normal text-white">
                      Enable Time Zone
                    </FormLabel>
                    <div class="w-full bg-[#00A0860D] h-11 sm:m-1.5 rounded-sm flex items-center justify-between px-3 text-sm">
                      <p>Enable Time Zone Rule</p>
                      <FormControl>
                        <Switch
                          class="data-[state=checked]:bg-green-600"
                          :model-value="value"
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
        </div>
      </form>
    </div>
    <div class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4 gap-2 flex ">
      <Button class="w-1/2 h-[52px]" variant="outline" :disabled="loading || fetchLoading" @click="handleCancel">
        <Icon name="material-symbols:close" size="20" />
        Cancel
      </Button>
      <Button class="w-1/2 h-[52px]" type="submit" :loading="loading" :disabled="fetchLoading" @click="onSubmit">
        <Icon name="material-symbols:save" size="20" />
        {{ isEdit ? 'Update campaign' : 'Save Campaign' }}
      </Button>
    </div>
  </div>
</template>
