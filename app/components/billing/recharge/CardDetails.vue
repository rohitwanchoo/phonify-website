<script setup lang="ts">
import type { rechargeDetails } from '~/types/rechargeDetails'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import americanExpress from '~/assets/svg/billing/american-express.svg'
import dinersClub from '~/assets/svg/billing/diners-club.svg'
import discover from '~/assets/svg/billing/discover.svg'
import jcb from '~/assets/svg/billing/jcb.svg'
import masterCard from '~/assets/svg/billing/master-card.svg'
import visa from '~/assets/svg/billing/visa.svg'

const props = defineProps<{
  savedCards: Array<{
    value: string
    label: string
    data: rechargeDetails
  }>
}>()

const emit = defineEmits<{
  (e: 'cardSelected', data: rechargeDetails): void
}>()

const { formState, resetFormState } = useRechargeDetails()

const selectedCard = ref('add-new-card')

watch(selectedCard, (newValue) => {
  if (newValue === 'add-new-card') {
    resetFormState()
  }
  else {
    const saved = props?.savedCards.find((c: any) => c.value === newValue)
    if (saved) {
      emit('cardSelected', saved.data)
    }
  }
})

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const currentYear = new Date().getFullYear()
const yearOptions: number[] = []

for (let i = 0; i <= 10; i++) {
  yearOptions.push(currentYear + i)
}

const formCardDetailsSchema = toTypedSchema(
  z.object({
    cardHolderName: z.string().min(1, 'Card holder name is required'),
    cardNumber: z.string().min(1, 'Card number is required').regex(/^[0-9\s]{13,19}$/, 'Invalid card number format'),
    month: z.number().min(1, 'Month is required'),
    year: z.number().min(1, 'Year is required'),
    cvv: z.string().min(1, 'cvv is required').max(50, 'max'),
    amount: z.number().min(1, 'Amount is required'),
  }),
)

const formCardDetails = useForm({ 
  validationSchema: formCardDetailsSchema 
})

const { validate } = formCardDetails

// ✅ This exposes a function for the parent to call
async function isValid() {
  // If user picked an existing card, skip validation of fields
  if (selectedCard.value !== 'add-new-card') {
    return Number(formState.value.amount) > 0 // Only amount validation
  }
  const result = await validate()
  return result.valid
}

defineExpose({ isValid })
</script>

<template>
  <form id="formCardDetails" class="p-5 flex flex-col gap-5">
    <!-- Select Card -->
    <div class="w-full flex flex-col justify-start items-start gap-1">
      <Label class="justify-start text-slate-800 text-xs font-medium">
        Select Card
      </Label>
      <Select v-model="selectedCard">
        <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
          <SelectValue placeholder="Select Your Card" class="justify-start text-slate-800 text-xs font-normal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="add-new-card" class="text-slate-800 text-xs font-normal">
            Add New Card
          </SelectItem>
          <SelectItem v-for="option in savedCards" :key="option.value" :value="option.value" class="text-slate-800 text-xs font-normal">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div v-if="selectedCard === 'add-new-card'" class="flex items-start gap-4">
      <FormField v-slot="{ componentField }" v-model="formState.cardHolderName" name="cardHolderName" class="flex-1">
        <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
          <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
            Card Holder Name
            <span class="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="Enter The Name"
              class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
            />
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" v-model="formState.cardNumber" name="cardNumber" class="flex-1">
        <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
          <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
            Card Number
            <span class="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Input
              v-maska="'#### #### #### ####'"
              v-bind="componentField"
              placeholder="XXXX XXXX XXXX XXXX"
              class="h-11"
            />
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
    </div>

    <div v-if="selectedCard === 'add-new-card'" class="flex items-start gap-4">
      <FormField v-slot="{ componentField }" v-model="formState.month" name="month" class="flex-1">
        <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
          <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
            Ex. Month
            <span class="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                <SelectValue placeholder="Select Month" class="justify-start text-slate-800 text-xs font-normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in monthOptions" :key="option.value" :value="option.value" class="text-slate-800 text-xs font-normal">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" v-model="formState.year" name="year" class="flex-1">
        <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
          <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
            Ex. Year
            <span class="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full !h-11 px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                <SelectValue placeholder="Select Year" class="justify-start text-slate-800 text-xs font-normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in yearOptions" :key="option" :value="option" class="text-slate-800 text-xs font-normal">
                  {{ option }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
    </div>

    <div class="flex items-start gap-4">
      <FormField v-if="selectedCard === 'add-new-card'" v-slot="{ componentField }" v-model="formState.cvv" name="cvv" class="flex-1">
        <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
          <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
            CVV
            <span class="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Input
              v-maska="'###9'"
              v-bind="componentField"
              placeholder="Enter The CVV"
              class="px-3 py-2 h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
            />
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" v-model="formState.amount" name="amount" class="flex-1">
        <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
          <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
            Amount
            <span class="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div class="relative w-full">
              <span class="absolute top-0 left-0 text-black text-xs font-normal h-11 px-3 py-px bg-zinc-100 rounded-tl-lg rounded-bl-lg inline-flex justify-start items-center gap-1 overflow-hidden">USD $</span>
              <Input
                v-bind="componentField"
                type="number"
                placeholder="Enter The Amount"
                class="w-full h-11 pl-[64px] pr-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
              />
            </div>
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
    </div>
    <!-- Payment Methods (always shown) -->
    <div class="flex gap-3.5 items-center">
      <img class="h-5 sm:h-8 lg:h-12" :src="masterCard" alt="">
      <img class="h-5 sm:h-8 lg:h-12" :src="visa" alt="">
      <img class="h-5 sm:h-8 lg:h-12" :src="americanExpress" alt="">
      <img class="h-5 sm:h-8 lg:h-12" :src="discover" alt="">
      <img class="h-5 sm:h-8 lg:h-12" :src="dinersClub" alt="">
      <img class="h-5 sm:h-8 lg:h-12" :src="jcb" alt="">
    </div>

    <p v-if="selectedCard === 'add-new-card'" class="text-red-400 text-xs font-normal">
      *Card information will be automatically saved for auto refill
    </p>
  </form>
</template>
