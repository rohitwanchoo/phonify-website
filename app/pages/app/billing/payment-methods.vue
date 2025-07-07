<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'

import masterCard from '~/assets/svg/billing/master-card.svg'
import paypal from '~/assets/svg/billing/paypal.svg'
import visa from '~/assets/svg/billing/visa.svg'

const cardImage = {
  masterCard,
  visa,
  paypal,
}

// get payment methods from api
const { data: paymentMethods, status: paymentMethodsStatus, refresh: refreshPaymentMethods } = await useLazyAsyncData('get-payment-methods', () =>
  useApi().get('/stripe/get-customer-payment-method'), {
  transform: res => res.data[0].data,
})
</script>

<template>
  <BaseHeader title="Payment Methods / Cards">
    <template #actions>
      <BillingPaymentMethodsAdd @complete="refreshPaymentMethods" />
    </template>
  </BaseHeader>
  <div class="mt-2 space-y-3">
    <template v-if="paymentMethodsStatus === 'pending'">
      <BaseSkelton v-for="i in 2" :key="i" class="h-20 w-full mb-2" rounded="rounded-sm" />
    </template>
    <div v-for="card in paymentMethods" v-else :key="card.name">
      <BillingPaymentMethodsCard
        :data="card"
        :type="cardImage[card?.card?.brand as keyof typeof cardImage]"
        @complete="refreshPaymentMethods"
      />
    </div>
  </div>
</template>
