<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'

const agentOptions = [
  { label: '2397463978', value: '2397463978' },
  { label: '2397463979', value: '2397463979' },
  { label: '2397463980', value: '2397463980' },
]

const formSchema = toTypedSchema(z.object({
  faxNumber: z.string().min(1, 'Fax number is required'),
  agentNumber: z.string().min(1, 'Agent number is required'),
}))

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    faxNumber: '',
    agentNumber: '',
  },
})

const onSubmit = handleSubmit((vals) => {
  // handle send fax
})
</script>

<template>
  <div class="p-4 bg-white rounded-md border border-[#F4F4F5]">
    <form class="flex flex-col justify-between md:h-[500px] h-full" @submit.prevent="onSubmit">
      <div>
        <div class="space-y-2">
          <div class="flex flex-col sm:flex-row gap-4">
            <FormField v-slot="{ componentField }" name="agentNumber">
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
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="faxNumber">
              <FormItem class="w-full sm:w-1/2">
                <FormLabel>Recipient Fax Number</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="tel" placeholder="Fax Number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="mt-6">
          <LeadManagementLeadFileUpload />
        </div>
      </div>
      <div class="w-full mt-4">
        <Button type="submit" :disabled="isSubmitting" class="w-full">
          <Icon name="material-symbols:fax" class="mr-1" />
          Send Fax
        </Button>
      </div>
    </form>
  </div>
</template>
