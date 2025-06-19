<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'


const agentOptions = [
  { label: '2397463978', value: '2397463978' },
  { label: '2397463979', value: '2397463979' },
  { label: '2397463980', value: '2397463980' },
]


const formSchema = z.object({
  faxNumber: z.string().min(1, 'Fax number is required'),
  agentNumber: z.string().min(1, 'Agent number is required'),
})

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    faxNumber: '',
    agentNumber: '',

  },
})
</script>
<template>
    <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
      <Form :form="form">
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <FormField name="agentNumber" v-slot="{ componentField }">
              <FormItem class="w-full sm:w-1/2">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Agent Number" class="text-xs md:text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in agentOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="faxNumber" v-slot="{ componentField }">
              <FormItem class="w-full sm:w-1/2">
                <FormLabel>Recipient Fax Number</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="tel" placeholder="Fax Number" class="text-xs md:text-sm" />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="mt-6">
            <LeadManagementLeadFileUpload />
          </div>
    
        </div>
      </Form>
    </div>
  </template>



