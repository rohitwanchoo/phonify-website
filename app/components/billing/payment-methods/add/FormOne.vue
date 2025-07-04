<script setup lang="ts">
import type { PaymentMethod } from '@/types/paymentMethod'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'

import {
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'

interface Props {
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
})

const emits = defineEmits<{
  changeStep: [value: number]
}>()

const formState = useState<PaymentMethod>('create-payment-method-state')

const formOneSchema = toTypedSchema(z.object({
  full_name: z.string().min(1, 'full name is required').max(50, 'max'),
  number: props.isEdit
    ? z.string().optional()
    : z.string()
        .min(1, 'Card number is required')
        .regex(/^[0-9\s]{13,19}$/, 'Invalid card number format'),
  exp_month: z.number().min(1, 'expiry month is required'),
  exp_year: z.number().min(1, 'expiry year is required'),
  cvc: props.isEdit
    ? z.string().optional()
    : z.string().min(1, 'cvv is required').max(50, 'max'),

}))

const formOne = useForm({ validationSchema: formOneSchema })

const { handleSubmit: handleSubmitOne } = formOne

const validateFormOne = handleSubmitOne(() => {
  emits('changeStep', 2)
})
</script>

<template>
  <form id="formOne" @submit.prevent="validateFormOne">
    <div class="space-y-4 ">
      <FormField
        v-slot="{ componentField }"
        v-model="formState.full_name"
        name="full_name"
      >
        <FormItem>
          <FormLabel class="text-sm font-normal">
            Card Holder Name<span class="text-red-600">*</span>
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Holder Name" class="h-11" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-if="!props.isEdit"
        v-slot="{ componentField }"
        v-model="formState.number"
        name="number"
      >
        <FormItem>
          <FormLabel class="text-sm font-normal">
            Card Number<span class="text-red-600">*</span>
          </FormLabel>
          <FormControl>
            <Input v-maska="'#### #### #### ####'" v-bind="componentField" placeholder="XXXX XXXX XXXX XXXX" class="h-11" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div :class="isEdit ? 'grid sm:grid-cols-2' : 'grid sm:grid-cols-3'" class="gap-4 items-start">
        <FormField
          v-slot="{ componentField, errorMessage }"
          v-model="formState.exp_month"
          name="exp_month"
        >
          <FormItem>
            <FormLabel class="text-sm font-normal">
              Ex. Month <span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                  <SelectValue class="text-sm" placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="item in 12" :key="item" :value="item">
                      {{ item }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ componentField, errorMessage }"
          v-model="formState.exp_year"
          name="exp_year"
        >
          <FormItem>
            <FormLabel class="text-sm font-normal">
              Ex. Year <span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11 ">
                  <SelectValue class="text-sm" placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="item in Array.from({ length: 21 }, (_, i) => i + new Date().getFullYear())" :key="item" :value="item">
                      {{ item }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-if="!props.isEdit"
          v-slot="{ componentField }"
          v-model="formState.cvc"
          name="cvc"
        >
          <FormItem>
            <FormLabel class="text-sm font-normal">
              CVV<span class="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input v-maska="'###9'" v-bind="componentField" placeholder="CVV" class="h-11" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <DialogFooter>
        <DialogClose class="sm:w-1/2">
          <Button variant="outline" class="h-11  w-full">
            <Icon name="mdi:close" />
            Close
          </Button>
        </DialogClose>
        <Button for="formOne" class="h-11 sm:w-1/2" type="submit" @click="validateFormOne">
          <Icon name="material-symbols:arrow-forward" />
          Continue
        </Button>
      </DialogFooter>
    </div>
  </form>
</template>
