<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
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

const { data: faxDidData } = await useLazyAsyncData('fax-did-user', () =>
  useApi().post('/fax-did-user'), {
  transform: res => res.data,
})

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
    <form @submit.prevent="onSubmit">
      {{ faxDidData }}
      <div class="flex flex-col justify-between gap-6 md:h-[500px]">
        <!-- Form fields section -->
        <div class="flex-1 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Agent Number (From) -->
            <FormField v-slot="{ componentField }" name="agentNumber">
              <FormItem class="flex flex-col gap-1">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
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
            <!-- Recipient Fax Number -->
            <FormField v-slot="{ componentField }" name="faxNumber">
              <FormItem class="flex flex-col gap-1">
                <FormLabel>Recipient Fax Number</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="tel" placeholder="Fax Number" class="h-11"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- File Upload (full width) -->
          <div class="mt-6">
            <LeadManagementLeadFileUpload />
          </div>
        </div>
        <!-- Button section -->
        <div>
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            <Icon name="material-symbols:fax" class="mr-1" />
            Send Fax
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
