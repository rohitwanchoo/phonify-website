<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().min(1, 'URL is required'),
  method: z.string().min(1, 'Method is required'),
  campaign: z.string().min(1, 'Campaign is required'),
  disposition: z.string().min(1, 'Disposition is required'),
  api_template: z.boolean(),
}))

const campaignOptions = [
  { id: 1, name: 'Campaign 1' },
  { id: 2, name: 'Campaign 2' },
  { id: 3, name: 'Campaign 3' },
]

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    url: '',
    method: '',
    campaign: '',
    disposition: '',
    api_template: false,
  },
})

const onSubmit = handleSubmit((values) => {
  console.log('Form values:', values)
})

function onReset() {
  resetForm()
}
</script>

<template>
  <div class="border rounded-xl p-4 bg-white">
    <form class="" @submit.prevent="onSubmit">
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg">
          API Information
        </h2>
        <Button class="h-8 md:h-11 px-2 md:px-4" type="button" @click="onReset">
          <Icon name="material-symbols:refresh" class="text-base text-white" />
          Reset
        </Button>
      </div>

      <div class="-mx-4 border-b border-gray-200 mb-4" />

      <!-- Form Fields Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Name -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem class="flex flex-col gap-1 w-full">
            <FormLabel class="font-medium text-gray-700">
              Name
            </FormLabel>
            <FormControl>
              <Input class="py-5" v-bind="componentField" placeholder="Enter name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- URL -->
        <FormField v-slot="{ componentField }" name="url">
          <FormItem class="flex flex-col gap-1 w-full">
            <FormLabel class="font-medium text-gray-700">
              URL
            </FormLabel>
            <FormControl>
              <Input class="py-5" v-bind="componentField" placeholder="Enter URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Method -->
        <FormField v-slot="{ componentField }" name="method">
          <FormItem class="flex flex-col gap-1 w-full ">
            <FormLabel class="font-medium text-gray-700">
              Method
            </FormLabel>
            <FormControl>
              <Input class="py-5" v-bind="componentField" placeholder="Enter method" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Campaign -->
        <FormField v-slot="{ componentField }" name="campaign">
          <FormItem class="flex flex-col gap-1 w-full">
            <FormLabel class="font-medium text-gray-700">
              Campaign
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full py-5">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="item in campaignOptions"
                    :key="item.id"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Disposition (Full width) -->
        <FormField v-slot="{ componentField }" name="disposition">
          <FormItem class="flex flex-col gap-1 md:col-span-2 ">
            <FormLabel class="font-medium text-gray-700">
              Disposition
            </FormLabel>
            <FormControl>
              <Input class="py-5" v-bind="componentField" placeholder="Enter disposition" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- API Template Toggle (Full width) -->
        <div class="md:col-span-2">
          <div class="bg-[#00A0860D] p-4 rounded-lg">
            <FormField v-slot="{ value, handleChange }" name="api_template">
              <FormItem class="flex items-center justify-between text-sm">
                <FormLabel class="font-medium text-gray-700">
                  Set API Template
                </FormLabel>
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
    </form>
  </div>
</template>
