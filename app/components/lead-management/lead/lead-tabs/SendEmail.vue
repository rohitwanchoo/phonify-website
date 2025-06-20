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
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5] relative min-h-[400px] pb-4">
    <form @submit.prevent="onSubmit">
      <div class="space-y-4 flex flex-col justify-between md:h-[500px]">
        <div class="flex flex-col sm:flex-row gap-4">
          <FormField v-slot="{ componentField }" name="to">
            <FormItem class="w-full sm:w-1/2">
              <FormLabel>To</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="email" placeholder="Enter lead email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="from">
            <FormItem class="w-full sm:w-1/2">
              <FormLabel>From</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
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
        <div class="flex flex-col sm:flex-row gap-4">
          <FormField v-slot="{ componentField }" name="leadPlaceholder">
            <FormItem class="w-full sm:w-1/2">
              <FormLabel>Lead Placeholders</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select lead placeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in leadPlaceholderOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="senderPlaceholder">
            <FormItem class="w-full sm:w-1/2">
              <FormLabel>Sender Placeholders</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select sender placeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in senderPlaceholderOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <FormField v-slot="{ componentField }" name="subject">
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="text" placeholder="Enter subject" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="templateReview">
          <FormItem>
            <FormLabel>Template Review</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Type your email content"
                maxlength="500"
                rows="6"
                class="resize-y pr-14"
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
        <div>
          <Button type="submit" class="w-full mt-2" :disabled="isSubmitting">
            <Icon name="material-symbols:mail" class="mr-2" />
            Send Email
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
