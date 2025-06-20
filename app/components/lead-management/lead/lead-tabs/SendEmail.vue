<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'

const agentEmailOptions = [
  { label: 'agent1@email.com', value: 'agent1@email.com' },
  { label: 'agent2@email.com', value: 'agent2@email.com' },
  { label: 'agent3@email.com', value: 'agent3@email.com' },
]
const templateOptions = [
  { label: 'Welcome Template', value: 'welcome' },
  { label: 'Follow Up', value: 'followup' },
  { label: 'Closure', value: 'closure' },
]
const leadPlaceholderOptions = [
  { label: 'Lead Name', value: 'lead_name' },
  { label: 'Lead Company', value: 'lead_company' },
  { label: 'Lead Phone', value: 'lead_phone' },
]
const senderPlaceholderOptions = [
  { label: 'Agent Name', value: 'agent_name' },
  { label: 'Agent Department', value: 'agent_department' },
  { label: 'Agent Phone', value: 'agent_phone' },
]

const formSchema = toTypedSchema(z.object({
  to: z.string().email('Enter a valid email').min(1, 'Lead email is required'),
  from: z.string().email('Select a valid agent email').min(1, 'Agent email is required'),
  template: z.string().min(1, 'Template is required'),
  leadPlaceholder: z.string().min(1, 'Lead placeholder is required'),
  senderPlaceholder: z.string().min(1, 'Sender placeholder is required'),
  subject: z.string().min(1, 'Subject is required'),
  templateReview: z.string().min(1, 'Template review is required').max(500, 'Max 500 characters'),
}))

const { handleSubmit, resetForm, errors, meta, isSubmitting, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    to: '',
    from: '',
    template: '',
    leadPlaceholder: '',
    senderPlaceholder: '',
    subject: '',
    templateReview: '',
  },
})

const templateReviewLength = computed(() => values.templateReview?.length || 0)

const onSubmit = handleSubmit((vals) => {
  // handle send email
})
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col justify-between gap-6 md:h-[500px]">
        <!-- Form fields section -->
        <div class="flex-1 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Recipient Email -->
            <FormField v-slot="{ componentField }" name="to">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Recipient Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter lead email"
                    v-bind="componentField"
                    class="border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Agent -->
            <FormField v-slot="{ componentField }" name="from">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Agent
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full h-11">
                      <SelectValue placeholder="Select agent email" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in agentEmailOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- Template -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
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
          <!-- Subject (full width) -->
          <FormField v-slot="{ componentField }" name="subject">
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter subject"
                  v-bind="componentField"
                  class="border-gray-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Message (full width) -->
          <FormField v-slot="{ componentField }" name="templateReview">
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Type your email content"
                  maxlength="500"
                  rows="8"
                  class="resize-y pr-14 min-h-[100px]"
                />
              </FormControl>
              <div class="flex justify-end mt-1">
                <span class="text-xs text-muted-foreground select-none">
                  {{ templateReviewLength }}/500
                </span>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Button section -->
        <div>
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            <Icon name="material-symbols:mail" class="mr-1" />
            Send Email
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
