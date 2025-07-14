<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import americanExpress from '~/assets/svg/billing/american-express.svg'
import dinersClub from '~/assets/svg/billing/diners-club.svg'
import discover from '~/assets/svg/billing/discover.svg'
import jcb from '~/assets/svg/billing/jcb.svg'
import masterCard from '~/assets/svg/billing/master-card.svg'
import visa from '~/assets/svg/billing/visa.svg'

import { Button } from '~/components/ui/button'

const selectCard = [
  {
    value: 'add-new-card',
    label: 'Add New Card',
  },
  {
    value: 'xxxx-xxxx-xxxx-4443',
    label: 'xxxx xxxx xxxx 4443',
  },
]

// Mock data for existing cards
const existingCardData = {
  'xxxx-xxxx-xxxx-4443': {
    cardHolderName: 'John Doe',
    cardNumber: '4532123456784443',
    month: '12',
    year: '2027',
    cvv: '123',
    address: '123 Main Street',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipCode: '90210',
  },
}

const monthOptions = [
  { value: '01', label: '01' },
  { value: '02', label: '02' },
  { value: '03', label: '03' },
  { value: '04', label: '04' },
  { value: '05', label: '05' },
  { value: '06', label: '06' },
  { value: '07', label: '07' },
  { value: '08', label: '08' },
  { value: '09', label: '09' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
]

const yearOptions = [
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
  { value: '2029', label: '2029' },
  { value: '2030', label: '2030' },
]

// Form schema with conditional validation
const formSchema = toTypedSchema(z.object({
  selectCard: z.string().min(1, 'Please select a card'),
  cardHolderName: z.string().min(1, 'Card holder name is required'),
  cardNumber: z.string().min(1, 'Card number is required'),
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(1, 'Year is required'),
  cvv: z.string().min(1, 'CVV is required'),
  amount: z.string()
    .min(1, 'Amount is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number'),
  address: z.string().min(1, 'Address is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
}))

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    selectCard: 'add-new-card',
    cardHolderName: '',
    cardNumber: '',
    month: '',
    year: '',
    cvv: '',
    amount: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
  },
})

// Computed property to check if an existing card is selected
const isExistingCard = computed(() => {
  return values.selectCard && values.selectCard !== 'add-new-card'
})

// Watch for card selection changes
watch(() => values.selectCard, (newValue) => {
  if (newValue && newValue !== 'add-new-card') {
    // Pre-fill form with existing card data
    const cardData = existingCardData[newValue as keyof typeof existingCardData]
    if (cardData) {
      setFieldValue('cardHolderName', cardData.cardHolderName)
      setFieldValue('cardNumber', cardData.cardNumber)
      setFieldValue('month', cardData.month)
      setFieldValue('year', cardData.year)
      setFieldValue('cvv', cardData.cvv)
      setFieldValue('address', cardData.address)
      setFieldValue('country', cardData.country)
      setFieldValue('state', cardData.state)
      setFieldValue('city', cardData.city)
      setFieldValue('zipCode', cardData.zipCode)
    }
  }
  else {
    // Clear form when "Add New Card" is selected
    setFieldValue('cardHolderName', '')
    setFieldValue('cardNumber', '')
    setFieldValue('month', '')
    setFieldValue('year', '')
    setFieldValue('cvv', '')
    setFieldValue('address', '')
    setFieldValue('country', '')
    setFieldValue('state', '')
    setFieldValue('city', '')
    setFieldValue('zipCode', '')
  }
})

const onSubmit = handleSubmit((values) => {
  console.log(values)
})
</script>

<template>
  <div class="h-[calc(100vh-150px)] relative overflow-y-auto">
    <form @submit="onSubmit">
      <div class="bg-white rounded-xl border border-gray-100">
        <Tabs default-value="credit-card" class="w-full gap-0">
          <div class="pl-5 p-1.5 flex gap-2 items-center justify-between border-b border-gray-100">
            <h3 class="text-slate-800 text-base font-medium">
              Card Details
            </h3>
            <TabsList class="h-10 flex items-center space-x-1 bg-gray-100 rounded-lg p-0.5">
              <TabsTrigger
                value="credit-card"
                class="w-24 data-[state=active]:bg-slate-800 text-slate-800 font-medium data-[state=active]:text-white data-[state=active]:shadow text-xs px-2 py-1.5 rounded-lg"
              >
                Credit Card
              </TabsTrigger>
              <TabsTrigger
                value="paypal"
                class="w-24 data-[state=active]:bg-slate-800 text-slate-800 font-medium data-[state=active]:text-white data-[state=active]:shadow text-xs px-2 py-1.5 rounded-lg"
              >
                Paypal
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="credit-card">
            <div class="p-5 flex flex-col gap-5">
              <!-- Select Card -->
              <FormField v-slot="{ componentField }" name="selectCard" class="flex-1">
                <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                  <FormLabel class="justify-start text-slate-800 text-xs font-medium">
                    Select Card
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-full px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                        <SelectValue placeholder="Select Your Card" class="justify-start text-slate-800 text-xs font-normal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="option in selectCard" :key="option.value" :value="option.value" class="text-slate-800 text-xs font-normal">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage class="text-xs" />
                </FormItem>
              </FormField>

              <!-- New Card Fields (only shown when "Add New Card" is selected) -->
              <div v-if="!isExistingCard" class="space-y-5">
                <div class="flex items-start gap-4">
                  <FormField v-slot="{ componentField }" name="cardHolderName" class="flex-1">
                    <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                      <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                        Card Holder Name
                        <span class="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          v-bind="componentField"
                          placeholder="Enter The Name"
                          class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                        />
                      </FormControl>
                      <FormMessage class="text-xs" />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="cardNumber" class="flex-1">
                    <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                      <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                        Card Number
                        <span class="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          v-bind="componentField"
                          placeholder="Enter The Card Number"
                          class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                        />
                      </FormControl>
                      <FormMessage class="text-xs" />
                    </FormItem>
                  </FormField>
                </div>
                <div class="flex items-start gap-4">
                  <FormField v-slot="{ componentField }" name="month" class="flex-1">
                    <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                      <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                        Ex. Month
                        <span class="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger class="w-full px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
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
                  <FormField v-slot="{ componentField }" name="year" class="flex-1">
                    <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                      <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                        Ex. Year
                        <span class="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger class="w-full px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 inline-flex justify-between items-center overflow-hidden">
                            <SelectValue placeholder="Select Year" class="justify-start text-slate-800 text-xs font-normal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="option in yearOptions" :key="option.value" :value="option.value" class="text-slate-800 text-xs font-normal">
                              {{ option.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage class="text-xs" />
                    </FormItem>
                  </FormField>
                </div>
                <div class="flex items-start gap-4">
                  <FormField v-slot="{ componentField }" name="cvv" class="flex-1">
                    <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                      <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                        CVV
                        <span class="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          v-bind="componentField"
                          placeholder="Enter The CVV"
                          class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                        />
                      </FormControl>
                      <FormMessage class="text-xs" />
                    </FormItem>
                  </FormField>
                  <div class="flex-1" /> <!-- Spacer -->
                </div>
              </div>

              <!-- Amount Field (always shown) -->
              <FormField v-slot="{ componentField }" name="amount" class="flex-1">
                <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                  <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                    Amount
                    <span class="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div class="relative w-full">
                      <span class="absolute top-0 left-0 text-black text-xs font-normal h-9 px-3 py-px bg-zinc-100 rounded-tl-lg rounded-bl-lg inline-flex justify-start items-center gap-1 overflow-hidden">USD $</span>
                      <Input
                        v-bind="componentField"
                        placeholder="Enter The Amount"
                        class="w-full pl-[64px] pr-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-xs" />
                </FormItem>
              </FormField>

              <!-- Payment Methods (always shown) -->
              <div class="flex gap-3.5 items-center">
                <img class="h-5 sm:h-8 lg:h-12" :src="masterCard" alt="">
                <img class="h-5 sm:h-8 lg:h-12" :src="visa" alt="">
                <img class="h-5 sm:h-8 lg:h-12" :src="americanExpress" alt="">
                <img class="h-5 sm:h-8 lg:h-12" :src="discover" alt="">
                <img class="h-5 sm:h-8 lg:h-12" :src="dinersClub" alt="">
                <img class="h-5 sm:h-8 lg:h-12" :src="jcb" alt="">
              </div>

              <p class="text-red-400 text-xs font-normal">
                *Card information will be automatically saved for auto refill
              </p>
            </div>
          </TabsContent>
          <TabsContent value="paypal">
            <div class="p-5 flex flex-col gap-5">
              Coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Personal Details (always shown) -->
      <div class="bg-white rounded-xl border border-gray-100 mt-4">
        <h3 class="w-full p-5 pb-3 text-slate-800 text-left text-base font-medium border-b border-gray-100">
          Personal Details
        </h3>
        <div class="p-5 w-full flex flex-col gap-5">
          <div class="flex items-start gap-4">
            <FormField v-slot="{ componentField }" name="address" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                  Address
                  <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter Address"
                    class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="country" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                  Country
                  <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter Country"
                    class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>

          <div class="flex items-start gap-4">
            <FormField v-slot="{ componentField }" name="state" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                  State
                  <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter State"
                    class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="city" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                  City
                  <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter City"
                    class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="zipCode" class="flex-1">
              <FormItem class="w-full inline-flex flex-col justify-start items-start gap-1">
                <FormLabel class="justify-start text-slate-800 text-xs font-medium gap-0">
                  ZIP
                  <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter ZIP Code"
                    class="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
      <div class="w-full sticky bottom-0 p-5 bg-white shadow-md">
        <Button type="submit" class="w-full" size="lg">
          Make Payment of $999.99
        </Button>
      </div>
    </form>
  </div>
</template>
