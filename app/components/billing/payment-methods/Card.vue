<script setup lang="ts">
import { Button } from '@/components/ui/button'
import masterCard from '~/assets/svg/billing/master-card.svg'

interface Props {
  data: {
    name: string
    card: {
      brand: string
      last4: string
      exp_month: string
      exp_year: string
    }
  }
  type?: string
}
defineProps<Props>()
const emits = defineEmits(['view'])
</script>

<template>
  <div class="border rounded-lg flex justify-between py-5 px-4">
    <div>
      <div class="flex gap-x-4 items-center">
        <img :src="type" class="h-10 w-[56px]" alt="masterCard">
        <div>
          <div class="text-[16px] font-medium">
            {{ data?.card?.brand }}
          </div>
          <div class="text-xs text-gray-500">
            XXXX XXXX XXXX {{ data?.card?.last4 }} &#xb7;  Expiry: {{ data?.card?.exp_month }}/{{ data?.card?.exp_year }}
          </div>
        </div>
      </div>
    </div>
    <div class="space-x-3">
      <BillingPaymentMethodsView :data="data" />

      <!-- <Button variant="outline" size="icon" @click="emits('view')">
        <Icon name="mdi:eye" />
      </Button> -->
      <Button variant="outline" size="icon">
        <Icon name="material-symbols:edit-square" />
      </Button>
      <Button variant="outline" size="icon" class="text-red-600 border-red-600 hover:text-red-600/80">
        <Icon name="mdi:trash-can" />
      </Button>
    </div>
  </div>
</template>
