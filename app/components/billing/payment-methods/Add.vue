<script setup lang="ts">
import type { Extension } from '~/types/extension'
import { toTypedSchema } from '@vee-validate/zod'

import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface RingGroup {
  id: number
  title: string
  email: string
  ring_type: number
  description: string
  receive_on: string
  extension: Extension[]
}

const props = defineProps<{
  tempRingGroup?: RingGroup
}>()

const emits = defineEmits(['complete'])

const isEdit = computed(() => {
  return Object.keys(props.tempRingGroup || {}).length > 0
})

const open = defineModel('open', {
  type: Boolean,
  default: false,
})
// validateField('full_name')
// validateField('number')
// validateField('exp_month')
// validateField('exp_year')
// validateField('cvv')
const formOneSchema = toTypedSchema(z.object({
  full_name: z.string().min(1, 'full name is required').max(50, 'max'),
  number: z.string().min(1, 'card number is required').max(50, 'max'),
  exp_month: z.number().min(1, 'expiry month is required'),
  exp_year: z.number().min(1, 'expiry year is required'),
  cvv: z.string().min(1, 'cvv is required').max(50, 'max'),

}))
const { handleSubmit: handleSubmitOne } = useForm({
  validationSchema: formOneSchema,
})

const formSchema = toTypedSchema(z.object({
  country: z.string().min(1, 'country is required').max(50, 'max'),
  city: z.string().min(1, 'city is required').max(50, 'max'),
  postal_code: z.string().min(1, 'Zip is required').max(50, 'max'),
  state: z.string().min(1, 'state is required').max(50, 'max'),
  line1: z.string().min(1, 'line1 is required').max(50, 'max'),

}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const loading = ref(false)
const onSubmit = handleSubmit((values) => {
  loading.value = true
  // // Handle form submission
  // console.log(values)
  const payload = {
    ...values,
    email: [values.email],
    extension: values.extension.map((item: { extension: number }) => `SIP/${item.extension}`),
  }
  useApi().post('/add-ring-group', payload).then((res) => {
    showToast({
      type: 'success',
      message: res.message,
    })
    loading.value = false
    emits('complete')
    open.value = false
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  }).finally(() => {
    loading.value = false
  })
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

const step = ref<number>(1)
const validateFormOne = handleSubmitOne(async (values) => {
  debugger
  step.value = 2
})
</script>

<template>
  <Dialog v-model:open="open" @update:open="onOpenDialog">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="!text-white" name="lucide:plus" />
          Add Card
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex justify-between">
          {{ isEdit ? 'Edit Payment Method' : 'Add Payment Method' }}
          <DialogClose class="cursor-pointer flex items-center">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>

      <!-- STEP - 2 -->
      <form v-if="step === 1" id="formOne" @submit.prevent="validateFormOne">
        <div class="space-y-4 ">
          <FormField
            v-slot="{ componentField }"
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
            v-slot="{ componentField }"
            name="number"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Card Number<span class="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input v-maska="'#### #### #### ####'" v-bind="componentField" placeholder="Card Number" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid sm:grid-cols-3 gap-4 items-start">
            <FormField
              v-slot="{ componentField }"
              name="exp_month"
            >
              <FormItem>
                <FormLabel class="text-sm font-normal">
                  Ex. Month <span class="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11 ">
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
              v-slot="{ componentField }"
              name="exp_year"
            >
              <FormItem>
                <FormLabel class="text-sm font-normal">
                  Ex. Year <span class="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11 ">
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
              v-slot="{ componentField }"
              name="cvc"
            >
              <FormItem>
                <FormLabel class="text-sm font-normal">
                  CVV<span class="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="CVV" class="h-11" />
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
            <Button :disabled="loading" for="formOne" class="h-11 sm:w-1/2" type="submit" @click="validateFormOne">
              <Icon name="material-symbols:arrow-forward" />
              Continue
            </Button>
          </DialogFooter>
        </div>
      </form>

      <form v-else id="form" @submit="onSubmit">
        <!-- STEP - 2 -->
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
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
              v-slot="{ componentField }"
              name="country"
            >
              <FormItem>
                <FormLabel class="text-sm font-normal">
                  Country
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full !h-11 ">
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
            <DialogClose class="sm:w-1/2">
              <Button variant="outline" class="h-11  w-full">
                <Icon name="mdi:close" />
                Close
              </Button>
            </DialogClose>
            <Button :disabled="loading" for="form" class="h-11 sm:w-1/2" type="submit" @click="onSubmit">
              <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save'" />
              {{ isEdit ? 'Update' : 'Save' }}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
