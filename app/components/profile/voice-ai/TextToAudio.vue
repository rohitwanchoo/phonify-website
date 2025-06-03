<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const formSchema = toTypedSchema(z.object({
  language: z.string().min(1, 'Please select a language'),
  voice: z.string().min(1, 'Please select a voice'),
  text: z.string().min(1, 'Text is required'),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Text to audio input:', values)
  // Trigger audio playback here
})
</script>

<template>
  <form class="space-y-4 w-full h-full flex flex-col mt-4" @submit.prevent="onSubmit">
    <!-- Language and Voice Dropdowns in same row -->
    <div class="flex gap-4 w-full">
      <!-- Language Dropdown -->
      <FormField v-slot="{ componentField }" name="language" class="flex-1">
        <FormItem class="w-full">
          <label class="text-sm font-medium text-primary"> Language</label>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full p-5">
                <SelectValue placeholder="Choose a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">
                  English
                </SelectItem>
                <SelectItem value="spanish">
                  Spanish
                </SelectItem>
                <SelectItem value="french">
                  French
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>

      <!-- Voice Dropdown -->
      <FormField v-slot="{ componentField }" name="voice" class="flex-1">
        <FormItem class="w-full">
          <label class="text-sm font-medium text-primary">Voice Name</label>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full p-5">
                <SelectValue placeholder="Choose a Voice Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emma">
                  Emma
                </SelectItem>
                <SelectItem value="matthew">
                  Matthew
                </SelectItem>
                <SelectItem value="olivia">
                  Olivia
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
    </div>

    <!-- Text Area -->
    <FormField v-slot="{ componentField }" name="text">
      <FormItem class="w-full">
        <label class="text-sm font-medium text-primary">Text</label>
        <FormControl>
          <Textarea
            v-bind="componentField"
            placeholder="Type what you like your customers to hear and click on the icon to listen"
            class="w-full resize-none min-h-[120px] placeholder:text-[#162D3A80]"
            rows="10"
          />
        </FormControl>
        <FormMessage class="text-xs" />
      </FormItem>
    </FormField>

    <!-- Listen Button -->
    <!-- <div class="flex justify-end">
      <Button type="submit" variant="outline" class="flex items-center gap-2">
        <Icon name="lucide:volume-2" class="w-4 h-4" />
        Listen
      </Button>
    </div> -->
  </form>
</template>