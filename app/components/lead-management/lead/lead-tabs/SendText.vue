<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'

const agentOptions = [
  { label: 'Agent 1', value: 'agent1' },
  { label: 'Agent 2', value: 'agent2' },
  { label: 'Agent 3', value: 'agent3' },
]
const templateOptions = [
  { label: 'Template 1', value: 'template1' },
  { label: 'Template 2', value: 'template2' },
  { label: 'Template 3', value: 'template3' },
]

const formSchema = toTypedSchema(z.object({
  leadContact: z.string().min(1, 'Lead contact number is required').regex(/^\d{10,15}$/, 'Please enter a valid phone number (10-15 digits)'),
  agentContact: z.string().min(1, 'Agent contact number is required'),
  template: z.string().min(1, 'Template is required'),
  message: z.string().min(1, 'Message is required').max(200, 'Max 200 characters'),
}))

const { handleSubmit, resetForm, errors, meta, isSubmitting, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    leadContact: '',
    agentContact: '',
    template: '',
    message: '',
  },
})

const messageLength = computed(() => values.message?.length || 0)
const phoneCountryCode = ref('+1')

const onSubmit = handleSubmit((vals) => {
  // handle send sms
})
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col  justify-between gap-6 md:h-[500px]">
        <!-- Form fields section -->
        <div class="flex-1 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Lead Contact -->
            <FormField v-slot="{ componentField }" name="leadContact">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Lead contact No.
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <Select v-model="phoneCountryCode">
                      <SelectTrigger class="w-24 h-11 data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue placeholder="USA (+1)" class="text-xs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">
                          USA (+1)
                        </SelectItem>
                        <SelectItem value="+44">
                          UK (+44)
                        </SelectItem>
                        <SelectItem value="+91">
                          IN (+91)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Enter Phone Number"
                      v-bind="componentField"
                      class="border-gray-200 rounded-l-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Agent Contact -->
            <FormField v-slot="{ componentField }" name="agentContact">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Agent contact No.
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full h-11">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in agentOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- Template (full width) -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full h-11">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in templateOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Message (full width) -->
          <FormField v-slot="{ componentField }" name="message">
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Enter message here..."
                  maxlength="200"
                  rows="8"
                  class="resize-y pr-14 min-h-[100px]"
                />
              </FormControl>
              <div class="flex justify-end mt-1">
                <span class="text-xs text-muted-foreground select-none">
                  {{ messageLength }}/200
                </span>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Button section -->
        <div>
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            <Icon name="material-symbols:chat" class="mr-1" />
            Send Text
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
