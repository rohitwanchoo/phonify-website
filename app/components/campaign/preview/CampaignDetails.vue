<script setup lang="ts">
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
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'
import { Button } from '~/components/ui/button'

import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

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

}))

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: 'Campaign 1',
    countryCode: '+1',
    description: 'Lorem ipsum dolor sit amet consectetur. Mi ornare amet fermentum volutpat metus arcu libero habitasse ut. Sem eu in feugiat turpis in diam.',
  },
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})
const enableEdit = ref(false)
</script>

<template>
  <form>
    <div class="border rounded-lg bg-white">
      <div class="border-b px-5 pt-[25.5px] pb-[17.5px] flex items-center justify-between">
        <div class="text-[16px] font-medium text-primary/100">
          Campaign Details
        </div>
        <div v-if="!enableEdit" class="flex items-center gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="enableEdit = true">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
        <div v-else class="flex gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="enableEdit = false ; resetForm()">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button class="w-[105px] rounded" size="sm" @click="onSubmit">
            <Icon name="material-symbols:save-rounded" />
            Save
          </Button>
        </div>
      </div>
      <div class="p-5 space-y-5 w-full">
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="name">
              <FormItem>
                <FormLabel class="font-normal text-xs" :class="!enableEdit && 'text-gray-500'">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    v-if="enableEdit"
                    type="text" class="text-xs font-normal placeholder:text-xs h-11"
                    placeholder="Enter Campaign Name" v-bind="componentField"
                  />
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ values.name }}
                  </div>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" name="countryCode">
              <FormItem>
                <FormLabel class="font-normal text-xs" :class="!enableEdit && 'text-gray-500'">
                  Country Code
                </FormLabel>
                <FormControl>
                  <Select v-if="enableEdit" v-bind="componentField">
                    <SelectTrigger class="w-full !h-11 ">
                      <SelectValue class="text-xs" placeholder="Select Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in countryCode" :key="item.id" :value="item.code">
                          {{ item.name }} ({{ item.code }})
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ values.countryCode }}
                  </div>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="w-full">
          <FormField v-slot="{ componentField }" class="" name="description">
            <FormItem>
              <FormLabel class="font-normal text-xs" :class="!enableEdit && 'text-gray-500'">
                Description
              </FormLabel>
              <FormControl>
                <Textarea v-if="enableEdit" type="text" class="text-xs font-normal placeholder:text-xs  " placeholder="Enter Campaign Name" v-bind="componentField" />
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ values.description }}
                </div>
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
  </form>
</template>

<style>

</style>
