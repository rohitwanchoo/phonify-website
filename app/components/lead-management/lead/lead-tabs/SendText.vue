<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <Form :form="form" @submit.prevent="onSubmit">
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <FormField name="leadContact">
            <FormItem class="w-full sm:w-1/2">
              <FormLabel>Lead contact No.</FormLabel>
              <FormControl>
                <Input v-model="form.values.leadContact" type="tel" placeholder="Enter phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="agentContact">
            <FormItem class="w-full sm:w-1/2">
              <FormLabel>Agent contact No.</FormLabel>
              <FormControl>
                <Select v-model="form.values.agentContact">
                  <SelectTrigger class="w-full">
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
        <FormField name="template">
          <FormItem>
            <FormLabel>Template</FormLabel>
            <FormControl>
              <Select v-model="form.values.template">
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
        <FormField name="message">
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <Textarea
                v-model="form.values.message"
                placeholder="Type your message"
                maxlength="200"
                rows="4"
                class="resize-y pr-14"
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
        <div>
          <Button type="submit" class="w-full mt-2">
            <Icon name="material-symbols:sms" class="mr-2" />
            Send SMS
          </Button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Icon } from '#components'

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

const formSchema = z.object({
  leadContact: z.string().min(1, 'Lead contact number is required'),
  agentContact: z.string().min(1, 'Agent contact number is required'),
  template: z.string().min(1, 'Template is required'),
  message: z.string().min(1, 'Message is required').max(200, 'Max 200 characters'),
})

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    leadContact: '',
    agentContact: '',
    template: '',
    message: '',
  },
})

const messageLength = computed(() => form.values.message?.length || 0)

function onSubmit(values: any) {
  // handle send sms
}
</script>

