<script setup lang="ts">
import type { rechargeDetails } from '@/types/rechargeDetails'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formState = useState<rechargeDetails>('recharge-details-state')

const formPersonalDetailsSchema = toTypedSchema(z.object({
  address: z.string().min(1, 'Address is required').max(100, 'max'),
  country: z.string().min(1, 'Country is required').max(50, 'max'),
  state: z.string().min(1, 'State is required').max(50, 'max'),
  city: z.string().min(1, 'City is required').max(50, 'max'),
  zipCode: z.string().min(1, 'Zip is required').max(10, 'max'),
}))

const formPersonalDetails = useForm({ validationSchema: formPersonalDetailsSchema })

const { validate } = formPersonalDetails

async function isValid() {
  const result = await validate()
  return result.valid
}

defineExpose({ isValid })
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 mt-4">
    <h3 class="w-full p-5 pb-3 text-slate-800 text-left text-base font-medium border-b border-gray-100">
      Personal Details
    </h3>
    <form id="formPersonalDetails" class="p-5 w-full flex flex-col gap-5">
      <div class="flex items-start gap-4">
        <FormField v-slot="{ componentField }" v-model="formState.address" name="address" class="flex-1">
          <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
            <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
              Address
              <span class="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter Address"
                class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" v-model="formState.country" name="country" class="flex-1">
          <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
            <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
              Country
              <span class="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter Country"
                class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>
      </div>

      <div class="flex items-start gap-4">
        <FormField v-slot="{ componentField }" v-model="formState.state" name="state" class="flex-1">
          <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
            <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
              State
              <span class="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter State"
                class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" v-model="formState.city" name="city" class="flex-1">
          <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
            <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
              City
              <span class="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter City"
                class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" v-model="formState.zipCode" name="zipCode" class="flex-1">
          <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
            <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
              ZIP
              <span class="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter ZIP Code"
                class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>
      </div>
    </form>
  </div>
</template>
