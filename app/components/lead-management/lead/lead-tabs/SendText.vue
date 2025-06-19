<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <Form :form="form" @submit.prevent="onSubmit">
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 items-stretch">
          <FormField v-slot="{ componentField }" name="leadContact">
            <FormItem class="w-full sm:w-1/2 flex flex-col gap-1 justify-end">
              <FormLabel class="text-sm font-medium text-gray-700">
                Lead contact No.
              </FormLabel>
              <FormControl>
                <div class="flex">
                  <Select v-model="phoneCountryCode">
                    <SelectTrigger class="w-24 h-11 data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                      <SelectValue placeholder="USA (+1)" class="text-xs lg:text-sm" />
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
                    v-bind="componentField"
                    v-model="form.values.leadContact"
                    placeholder="Enter Phone Number"
                    class="border-gray-200 rounded-l-none text-xs lg:text-sm"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="agentContact" v-slot="{ componentField }">
            <FormItem class="w-full sm:w-1/2 flex flex-col gap-1 justify-end">
              <FormLabel class="text-sm font-medium text-gray-700">
                Agent contact No.
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full h-11">
                    <SelectValue placeholder="Agent Contact No." class="text-xs lg:text-sm" />
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
        <FormField name="template" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Template</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full h-11">
                  <SelectValue placeholder="Select template" class="text-xs lg:text-sm" />
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
                placeholder="Enter message here..."
                maxlength="200"
                rows="4"
                class="resize-y pr-14 text-xs lg:text-sm"
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
const phoneCountryCode = ref('+1')

function onSubmit(values: any) {
  // handle send sms
}
</script>