<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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

const isActive = ref('active')
const countryCode = [
  {
    id: 1,
    name: 'United States',
    code: '+1',
  },
  {
    id: 2,
    name: 'United Kingdom',
    code: '+44',
  },
  {
    id: 3,
    name: 'Canada',
    code: '+1',
  },
]

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'required').max(50),
  countryCode: z.string().min(1, 'required').max(10),
  description: z.string().min(1, 'required').max(255),
  callerId: z.string().min(1, 'required').max(50),
  customCallerId: z.string().min(1, 'required').max(50),
  dialingMode: z.string().min(1, 'required').max(50),
  callerGroup: z.string().min(1, 'required').max(50),

}))

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <!-- CAMPAIGN DETAILS -->
    <div class="border rounded-lg bg-white">
      <div class="border-b px-5 pt-[25.5px] pb-[17.5px] flex items-center justify-between">
        <div class="text-[16px] font-medium text-primary/100">
          Campaign Details
        </div>
        <div class="flex items-center gap-x-2">
          <div class="text-primary text-xs font-normal">
            status:
          </div>
          <div class="bg-[#FEF2F2] rounded-lg">
            <ToggleGroup v-model:model-value="isActive" type="single">
              <ToggleGroupItem value="active" class="!bg-[#FEF2F2] data-[state=on]:!bg-green-600 data-[state=on]:text-white font-normal gap-x-0 data-[state=on]:rounded-lg text-xs" aria-label="Status active">
                <Icon name="stash:circle-dot" size="30" />
                Active
              </ToggleGroupItem>
              <ToggleGroupItem value="inactive" class="!bg-[#FEF2F2] data-[state=on]:!bg-red-600 data-[state=on]:rounded-lg font-normal data-[state=on]:text-white text-xs" aria-label="Status inactive">
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
                <FormLabel class="font-normal text-xs">
                  Name
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-xs font-normal placeholder:text-xs h-11 " placeholder="Enter Campaign Name" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" name="countryCode">
              <FormItem>
                <FormLabel class="font-normal text-xs">
                  Country Code
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-xs placeholder:text-[#ef698180]" placeholder="Select Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in countryCode" :key="item.id" :value="item.code">
                          {{ item.name }} ({{ item.code }})
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="w-full">
          <FormField v-slot="{ componentField }" class="" name="description">
            <FormItem>
              <FormLabel class="font-normal text-xs">
                Description
              </FormLabel>
              <FormControl>
                <Textarea type="text" class="text-xs font-normal placeholder:text-xs h-11 " placeholder="Enter Campaign Name" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
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
            <FormField v-slot="{ componentField }" class="" name="callerId">
              <FormItem>
                <FormLabel class="font-normal text-xs">
                  Caller Id
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-xs font-normal placeholder:text-xs h-11 " placeholder="Search List" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="customCallerId">
              <FormItem>
                <FormLabel class="font-normal text-xs">
                  Custom Caller Id
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-xs font-normal placeholder:text-xs h-11 " placeholder="Search List" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="dialingMode">
              <FormItem>
                <FormLabel class="font-normal text-xs">
                  Dialing Mode
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-xs font-normal placeholder:text-xs h-11 " placeholder="Search List" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="callerGroup">
              <FormItem>
                <FormLabel class="font-normal text-xs">
                  Caller Group
                </FormLabel>
                <FormControl>
                  <Input type="text" class="text-xs font-normal placeholder:text-xs h-11 " placeholder="Search List" v-bind="componentField" />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
    </div>
    <!-- Time Based Calling -->
    <div class="border rounded-lg bg-white">
      <div class=" ">
        <Accordion type="single" collapsible>
          <AccordionItem v-slot="{ open }" value="item-1" class="px-5">
            <div class="flex items-center justify-between ">
              <div class="text-[16px] font-medium text-primary/100">
                Time Based Calling {{ open }}ds
              </div>
              <AccordionTrigger>
                <template #icon>
                  <Switch />
                </template>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              Hello from accordion content
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
    <Button type="submit" @click="onSubmit">
      submit
    </Button>
  </form>
</template>
