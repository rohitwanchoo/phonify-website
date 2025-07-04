<script setup lang="ts">
import type { PaymentMethod } from '@/types/paymentMethod'
import type { Extension } from '~/types/extension'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import { Button } from '@/components/ui/button'

import {
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

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,

})

// defineProps<Props>()

// const emits = defineEmits(['complete'])

const emits = defineEmits<{
  changeStep: [value: number]
  submit: []
}>()

interface Props {
  loading?: boolean
  isEdit?: boolean
}

const formState = useState<PaymentMethod>('create-payment-method-state')

const formSchema = toTypedSchema(z.object({
  country: z.string().min(1, 'country is required').max(50, 'max'),
  city: z.string().min(1, 'city is required').max(50, 'max'),
  postal_code: z.string().min(1, 'Zip is required').max(50, 'max'),
  state: z.string().min(1, 'state is required').max(50, 'max'),
  line1: z.string().min(1, 'line1 is required').max(50, 'max'),

}))

const formTwo = useForm({ validationSchema: formSchema })

const { handleSubmit } = formTwo

const onSubmit = handleSubmit(() => {
  emits('submit')
})

const countries = [

  {
    id: 'CA',
    name: 'Canada',
  },
  {
    id: 'US',
    name: 'United States',
  },
]
</script>

<template>
  <form id="form" @submit="onSubmit">
    <!-- STEP - 2 -->
    <div class="space-y-4">
      <FormField
        v-slot="{ componentField }"
        v-model="formState.line1"
        name="line1"
      >
        <FormItem>
          <FormLabel class="text-sm font-normal">
            Address<span class="text-red-600">*</span>
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Enter address" class="h-11" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div>
        <FormField
          v-slot="{ componentField, errorMessage }"
          v-model="formState.country"
          name="country"
        >
          <FormItem>
            <FormLabel class="text-sm font-normal">
              Country
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11 ">
                  <SelectValue class="text-sm" placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="item in countries" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <FormField
        v-slot="{ componentField }"
        v-model="formState.state"
        name="state"
      >
        <FormItem>
          <FormLabel class="text-sm font-normal">
            State<span class="text-red-600">*</span>
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Enter State" class="h-11" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        v-model="formState.city"
        name="city"
      >
        <FormItem>
          <FormLabel class="text-sm font-normal">
            City<span class="text-red-600">*</span>
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Enter City" class="h-11" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        v-model="formState.postal_code"
        name="postal_code"
      >
        <FormItem>
          <FormLabel class="text-sm font-normal">
            ZIP<span class="text-red-600">*</span>
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Enter Zip Code" class="h-11" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <DialogFooter>
        <div class="sm:w-1/2">
          <Button variant="outline" type="button" class="h-11  w-full" @click="emits('changeStep', 1)">
            <Icon name="material-symbols:arrow-back" />
            Back
          </Button>
        </div>
        <Button :disabled="loading" for="form" class="h-11 sm:w-1/2" type="submit" @click="onSubmit">
          <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save'" />
          {{ isEdit ? 'Update' : 'Save' }}
        </Button>
      </DialogFooter>
    </div>
  </form>
</template>
