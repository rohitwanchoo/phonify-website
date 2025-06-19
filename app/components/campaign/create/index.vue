<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useFilter } from 'reka-ui'

import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

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

import { Skeleton } from '@/components/ui/skeleton'

import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'

const emits = defineEmits([
  'completed',
])

const isActive = ref('Active')
const accordion = ref('')
const accordion2 = ref('')

const templates = [
  {
    id: 1,
    name: 'Template 1',
  },
  {
    id: 2,
    name: 'Template 2',
  },
  {
    id: 3,
    name: 'Template 3',
  },
]

const CallerIds = [
  {
    id: 0,
    name: 'Area code',
  },
  {
    id: 1,
    name: 'Custom (Enabled for Custom CLI)',
  },
  {
    id: 3,
    name: 'Area Code and Randomizer',
  },
]

const selectedCallTime = ref<{ id: number, name: string }>()

// country code list
const { data: countyCodeList } = await useLazyAsyncData('get-country-code-list', () =>
  useApi().post('/country-list', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// call timing list
const { data: callTimingList, status: callTimingListStatus, refresh: callTimingListRefresh } = await useLazyAsyncData('get-call-timings-campaign', () =>
  useApi().post('/get-call-timings', {
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

// email template list
const { data: emailTemplateList } = await useLazyAsyncData('get-email-template', () =>
  useApi().get('/email-templates', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// dialing mode list
const { data: dialingModeList } = await useLazyAsyncData('get-dialing-mode-list', () =>
  useApi().get('/campaign-type', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// custom caller id list
const { data: customCallerIdList, refresh: refreshCustomCallerIdList } = await useLazyAsyncData('get-custom-caller-id-list', () =>
  useApi().post('/did', {

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

function onEnableTimeBasedCalling(val: boolean) {
  if (val && !callTimingList.value?.length) {
    callTimingListRefresh()
  }
}

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'required').max(50),
  country_code: z.number().min(1, 'required'),
  description: z.string().min(1, 'required').max(255),
  caller_id: z.number().min(0, 'required'),
  custom_caller_id: z.string().min(1, 'required').max(50).optional().superRefine((val, ctx) => {
    if (values.caller_id === 1 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom Caller Is is required when Caller Is is Custom',
      })
    }
  }),
  dial_mode: z.string().min(1, 'required'),
  callerGroup: z.string().min(1, 'required').max(50),

}))

const { handleSubmit, values, resetField } = useForm({
  validationSchema: formSchema,
})

function onSelectCallerId(val: number) {
  if (val === 1) {
    refreshCustomCallerIdList()
  }
  else {
    resetField('custom_caller_id')
  }
}

// const onSubmit = handleSubmit((values) => {
//   console.log('Form submitted!', values)
// })

function onSubmit() {
  emits('completed')
}

const depositions = [
  { value: 1, label: 'Call Back' },
  { value: 2, label: 'Cancelled By User' },
  { value: 3, label: 'Click2Call' },
  { value: 4, label: 'clickable' },
  { value: 5, label: 'clickable' },
  { value: 6, label: 'Disconnected' },
  { value: 7, label: 'Do Not Call' },
  { value: 9, label: 'No Answer' },
  { value: 10, label: 'No longer in Business' },
  { value: 11, label: 'Not Interested' },
  { value: 12, label: 'Outbound AI Dialed' },
  { value: 13, label: 'Sale - (Survey Done)' },
  { value: 14, label: 'Sale Made' },

]

const selectedDeposition = ref<string[]>([])
const open = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })
const filteredDeposition = computed(() => {
  const options = depositions.filter(i => !selectedDeposition.value.includes(i.label))
  return searchTerm.value ? options.filter(option => contains(option.label, searchTerm.value)) : options
})

function onSelectCallTime() {
  accordion2.value = ''
}
</script>

<template>
  <div class=" relative h-[calc(100vh-190px)]">
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
                <ToggleGroup v-model:model-value="isActive" type="single">
                  <ToggleGroupItem value="Active" class="!bg-[#FEF2F2] data-[state=on]:!bg-green-600 data-[state=on]:text-white font-normal gap-x-0 data-[state=on]:rounded-lg text-sm" aria-label="Status active">
                    <Icon name="stash:circle-dot" size="30" />
                    Active
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Inactive" class="!bg-[#FEF2F2] data-[state=on]:!bg-red-600 data-[state=on]:rounded-lg font-normal data-[state=on]:text-white text-sm" aria-label="Status inactive">
                    Inactive
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
          <div class="p-5 space-y-5 w-full">
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField }" class="" name="name">
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
                <FormField v-slot="{ componentField }" name="country_code">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Country Code
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in countyCodeList" :key="item.id" :value="item.phonecode">
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
              <FormField v-slot="{ componentField }" class="" name="description">
                <FormItem>
                  <FormLabel class="font-normal text-sm">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter Campaign Name" v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="text-sm" />
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>

        <!-- Caller Details -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Caller Details
            </div>
          </div>
          <div class="p-5 space-y-5 w-full">
            <div class="flex gap-[16px] w-full">
              <div class="w-1/2">
                <FormField v-slot="{ componentField }" name="caller_id">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Caller Id
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" @update:model-value="onSelectCallerId">
                        <SelectTrigger class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Caller Id" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="item in CallerIds" :key="item.id" :value="item.id">
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
                <FormField v-slot="{ componentField }" name="custom_caller_id">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Custom Caller Id
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger :disabled="values.caller_id !== 1 && customCallerIdList?.length" class="w-full !h-11">
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
                <FormField v-slot="{ componentField }" name="dial_mode">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Dialing Mode
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger class="w-full !h-11">
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
                <FormField v-slot="{ componentField }" name="callerGroup">
                  <FormItem>
                    <FormLabel class="font-normal text-sm">
                      Caller Group
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger class="w-full !h-11">
                          <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Caller Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="i in 3" :key="i" :value="`group-${i}`">
                              Caller Group {{ i }}
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

        <!-- Time Based Calling -->
        <div class="border rounded-lg bg-white">
          <div class=" ">
            <Accordion v-model="accordion" collapsible>
              <AccordionItem value="item-1" class="">
                <div class="flex items-center justify-between px-5" :class="accordion === 'item-1' && 'border-b'">
                  <div class="text-[16px] font-medium text-primary/100">
                    Time Based Calling
                  </div>
                  <AccordionTrigger>
                    <template #icon>
                      <Switch class="data-[state=checked]:bg-green-600" @update:model-value="onEnableTimeBasedCalling" />
                    </template>
                  </AccordionTrigger>
                </div>
                <AccordionContent class="p-5">
                  <Accordion v-model="accordion2" collapsible class="">
                    <AccordionItem value="item-2" class="">
                      <AccordionTrigger :class="selectedCallTime && '!text-black' " class=" border rounded-lg h-11 px-3 py-[14px] flex items-center hover:no-underline text-muted-foreground text-sm font-normal">
                        {{ selectedCallTime ? selectedCallTime?.name : 'Select Call Time' }}
                      </AccordionTrigger>

                      <AccordionContent class="p-3 border rounded-lg mt-1 ">
                        <CallTimesCreate>
                          <Button type="button" class="w-full rounded-[8px]">
                            Create Custom Call Time <Icon name="lucide:plus" />
                          </Button>
                        </CallTimesCreate>
                        <Command v-model="selectedCallTime" selection-behavior="toggle" class="max-h-[300px] overflow-y-auto" @update:model-value="onSelectCallTime">
                          <CommandList>
                            <CommandGroup>
                              <template v-if="callTimingListStatus === 'pending'">
                                <CommandItem v-for="item in 10" :key="item" :value="item" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                                  <Skeleton class="h-[50px] w-full" />
                                </CommandItem>
                              </template>
                              <CommandItem v-for="item in callTimingList" v-else :key="item.name" :value="item" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                                {{ item.name }}
                                <Button size="icon" variant="outline">
                                  <Icon name="mdi:eye" />
                                </Button>
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <!-- Send Details -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Send Details (temp.)
            </div>
          </div>
          <div class="p-5 gap-x-5 w-full flex items-center">
            <div class="w-1/2">
              <Label class="text-sm font-normal">Send Email</Label>
              <Select class="">
                <SelectTrigger class="w-full !h-11">
                  <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="item in emailTemplateList" :key="item.id" :value="item.id">
                      {{ item.template_name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="w-1/2 flex items-center justify-between">
              <div class="flex flex-col gap-y-3">
                <Label for="send-sms" class="text-sm font-normal">Send SMS</Label>
                <Switch id="send-sms" class="data-[state=checked]:bg-green-600" />
              </div>
              <div class="flex flex-col gap-y-3">
                <Label for="send-report" class="text-sm font-normal">Send Report</Label>
                <Switch id="send-report" class="data-[state=checked]:bg-green-600" />
              </div>
              <div class="flex flex-col gap-y-3">
                <Label for="call-transfer" class="text-sm font-normal">Call Transfer</Label>
                <Switch id="call-transfer" class="data-[state=checked]:bg-green-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Other Details -->
        <div class="border rounded-lg bg-white">
          <div class="border-b px-5 pt-5 pb-3">
            <div class="text-[16px] font-medium text-primary/100">
              Other Details
            </div>
          </div>
          <div class="p-5">
            <div class=" gap-x-5 w-full flex items-center">
              <div class="w-1/2">
                <Label class="text-sm font-normal">Hopper Mode Type</Label>
                <Select class="">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in templates" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="w-1/2">
                <Label class="text-sm font-normal">OutBound Line</Label>
                <Select class="">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in templates" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="mt-5">
              <Label class="text-sm font-normal">Deposition</Label>
              <Combobox v-model="selectedDeposition" v-model:open="open" :ignore-filter="true">
                <ComboboxAnchor as-child>
                  <TagsInput v-model="selectedDeposition" class="px-2 gap-2 [&_svg]:hidden w-full [&_[data-slot='command-input-wrapper']]:border-none [&_[data-slot='command-input-wrapper']]:px-1" @click="open = true">
                    <div class="flex gap-2 flex-wrap items-center ">
                      <TagsInputItem v-for="item in selectedDeposition" :key="item" class="rounded-[6px] border border-[#00A086] bg-[#00A0861A] p-[11px] px-[7px]" :value="item">
                        <TagsInputItemText />
                        <TagsInputItemDelete>
                          <Icon name="lucide:x" />
                        </TagsInputItemDelete>
                      </TagsInputItem>
                    </div>
                    <ComboboxInput v-model="searchTerm" as-child class="border-none ">
                      <TagsInputInput placeholder="deposition..." class=" w-full p-0 border-none focus-visible:ring-0 h-auto " @keydown.enter.prevent />
                    </ComboboxInput>
                  </TagsInput>

                  <ComboboxList class="w-[--reka-popper-anchor-width]">
                    <ComboboxEmpty />
                    <ComboboxGroup class="w-[400px]">
                      <ComboboxItem
                        v-for="item in filteredDeposition" :key="item.value" :value="item.label"
                        @select.prevent="(ev) => {

                          if (typeof ev.detail.value === 'string') {
                            searchTerm = ''
                            selectedDeposition.push(ev.detail.value)
                          }

                          if (filteredDeposition.length === 0) {
                            open = false
                          }
                        }"
                      >
                        {{ item.label }}
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </ComboboxAnchor>
              </Combobox>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4">
      <Button class="w-full h-[52px]" type="submit" @click="onSubmit">
        Continue
        <Icon name="lucide:arrow-right" size="20" />
      </Button>
    </div>
  </div>
</template>
