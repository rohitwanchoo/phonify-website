<script setup lang="ts">
import type { rechargeDetails } from '@/types/rechargeDetails'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const { formState, resetFormState } = useRechargeDetails()

const cardDetailsRef = ref()
const personalDetailsRef = ref()


// Track which card is selected
const selectedCard = ref<'add-new-card' | string>('add-new-card')

// Toggle whether to show card input fields
const showCardFields = ref(true)

const savedCards = [
  {
    value: '4443 4443 4443 4443',
    label: 'xxxx xxxx xxxx 4443',
    data: {
      cardHolderName: 'Alice Smith',
      cardNumber: '4443 4443 4443 4443',
      month: 5,
      year: 2027,
      cvv: '888',
      address: '222 Example Ave',
      country: 'United States',
      state: 'NY',
      city: 'New York',
      zipCode: '10001',
    },
  },
]

// When saved card selected
function handleCardSelected(cardData: rechargeDetails) {
  formState.value = {
    cardHolderName: cardData.cardHolderName,
    cardNumber: cardData.cardNumber || '',
    month: Number(cardData.month),
    year: Number(cardData.year),
    cvv: cardData.cvv,
    amount: Number(cardData.amount),
    address: cardData.address,
    country: cardData.country,
    state: cardData.state,
    city: cardData.city,
    zipCode: cardData.zipCode,
  }

  // Show/hide card fields
  if (selectedCard.value === 'add-new-card') {
    showCardFields.value = true
  }
  else {
    showCardFields.value = false
  }
}

async function onSubmit() {
  const isCardValid = await cardDetailsRef.value?.isValid?.()
  const isPersonalValid = await personalDetailsRef.value?.isValid?.()

  if (!isCardValid || !isPersonalValid) {
    return
  }

  // All valid, submit form
  const payload: rechargeDetails = { ...formState.value }
  console.log(payload)
  resetFormState()
}
</script>

<template>
  <BaseHeader title="Recharge" />
  <div class="h-[calc(100vh-150px)] relative overflow-y-auto">
    <Tabs default-value="credit-card" class="w-full gap-0 g-white rounded-xl border border-gray-100">
      <div class="pl-5 p-1.5 flex gap-2 items-center justify-between border-b border-gray-100">
        <h3 class="text-slate-800 text-base font-medium">
          Card Details
        </h3>
        <TabsList class="h-10 flex items-center space-x-1 bg-gray-100 rounded-lg p-0.5">
          <TabsTrigger
            value="credit-card"
            class="w-24 cursor-pointer data-[state=active]:bg-slate-800 text-slate-800 font-medium data-[state=active]:text-white data-[state=active]:shadow text-xs px-2 py-1.5 rounded-lg"
          >
            Credit Card
          </TabsTrigger>
          <TabsTrigger
            value="paypal"
            class="w-24 cursor-pointer data-[state=active]:bg-slate-800 text-slate-800 font-medium data-[state=active]:text-white data-[state=active]:shadow text-xs px-2 py-1.5 rounded-lg"
          >
            Paypal
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="credit-card">
        <BillingRechargeCardDetails ref="cardDetailsRef" :saved-cards="savedCards" @card-selected="handleCardSelected" />
      </TabsContent>
      <TabsContent value="paypal">
        <div class="p-5 flex flex-col gap-5">
          Paypal service is Coming soon..
        </div>
      </TabsContent>
    </Tabs>
    <BillingRechargePersonalDetails ref="personalDetailsRef" />
    <div class="w-full sticky bottom-0 p-5 bg-white shadow-md">
      <Button type="submit" class="w-full" size="lg" :disabled="formState.amount === 0" @click="onSubmit">
        Make Payment of ${{ formState.amount }}
      </Button>
    </div>
  </div>
</template>
