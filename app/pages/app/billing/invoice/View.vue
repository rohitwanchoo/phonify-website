<script setup lang="ts">
import americanExpress from '~/assets/svg/billing/american-express.svg'

import masterCard from '~/assets/svg/billing/master-card.svg'
import paypal from '~/assets/svg/billing/paypal.svg'
import visa from '~/assets/svg/billing/visa.svg'
import Button from '~/components/ui/button/Button.vue'

const breadcrumbs = [
  {
    label: 'Invoices',
    href: '/app/billing/invoice',
  },
  {
    label: 'View Invoice',
    active: true,
  },
]

const list = [
  {
    subscription: 'Premium',
    amount: 999,
    date: '2021-01-01',
    status: 'success',
  },

]
</script>

<template>
  <BaseHeader title="Premium - 01 January 2025" :breadcrumbs>
    <template #actions>
      <Button variant="outline" class="text-sm rounded-[8px]">
        <Icon name="material-symbols:download" />
        Generate PDF
      </Button>
      <Button variant="default" class="text-sm rounded-[8px]">
        <Icon name="material-symbols:print" />
        Generate PDF
      </Button>
    </template>
    loading
  </BaseHeader>

  <div class="border rounded-lg">
    <div class="text-[16px] font-normal px-4 py-4 border-b">
      Set IVR Menu
    </div>
    <!-- body -->
    <div class="p-10 space-y-10">
      <div class="flex justify-between flex-wrap gap-y-4 flex-col-reverse sm:flex-row">
        <div class="font-semibold text-[24px]">
          Invoice #123456
          <div class="text-xs font-normal text-[#1F1E1C]">
            Issued on 01 January, 2025
          </div>
        </div>
        <div>
          <img class="h-[54px]" src="/images/logo/phonify-logo-full-text.svg" alt="">
        </div>
      </div>

      <!-- Invoice addresses -->
      <div class="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        <!-- ─────── To ─────── -->
        <div>
          <p class="text-xs text-[#1F1E1C] mb-1">
            To
          </p>
          <h2 class="font-semibold text-[16px] text-gray-900">
            Rudy Durgan
          </h2>

          <p class="text-gray-700 leading-tight text-xs ">
            34 Carmine St, New&nbsp;York,<br>
            NY&nbsp;10014, USA
          </p>

          <p class="mt-4 text-gray-700 leading-tight text-xs">
            <span class="font-medium">Phone:</span>+1 (555) 123 4567<br>
            <span class="font-medium">Email:</span> rudydurgan@gmail.com<br>
            <span class="font-medium">Account:</span> 9000-000003
          </p>
        </div>

        <!-- ─────── From ─────── -->
        <div class="text-left md:text-right">
          <p class="text-xs text-[#1F1E1C] mb-1">
            From
          </p>
          <h2 class="font-semibold text-[16px] text-gray-900">
            Phonify, Inc.
          </h2>

          <p class="text-gray-700 leading-tight text-xs">
            34 Carmine St, New&nbsp;York,<br>
            NY&nbsp;10014, USA
          </p>

          <p class="mt-4 text-gray-700 leading-tight text-xs">
            <span class="font-medium">Phone:</span>+1 (555) 123 4567<br>
            <span class="font-medium">Email:</span> billing@phonify.com<br>
            <span class="font-medium">Order&nbsp;ID:</span> 1000-000001
          </p>
        </div>
      </div>

      <BillingInvoiceViewTable :list />

      <!-- Payment -->
      <div class="space-y-2">
        <div class="text-sm font-normal">
          Payment Method
        </div>
        <div class="flex items-center gap-2">
          <img class="h-[48px]" :src="masterCard" alt="">
          <img class="h-[48px]" :src="visa" alt="">
          <img class="h-[48px]" :src="americanExpress" alt="">
          <img class="h-[48px]" :src="paypal" alt="">
        </div>
        <div class="text-[#1F1E1C] text-xs font-normal">
          *We do accept both, credit cards and Paypal.
        </div>
      </div>
      <div>
        <!-- Pricing Summary -->
        <div class="w-full sm:max-w-[200px] sm:ml-auto space-y-3 text-sm text-gray-700">
          <!-- Subtotal -->
          <div class="flex justify-between">
            <span class="text-sm font-medium">Sub-Total:</span>
            <span class="font-medium">$999.99</span>
          </div>

          <!-- Tax -->
          <div class="flex justify-between border-t pt-2">
            <span class="text-sm font-medium">Tax (0%):</span>
            <span class="font-medium">$0.00</span>
          </div>

          <!-- Shipping -->
          <div class="flex justify-between border-t pt-2">
            <span class="text-sm font-medium">Shipping:</span>
            <span class="font-medium">$0.00</span>
          </div>

          <!-- Total -->
          <div class="flex justify-between border-t pt-2 font-semibold">
            <span class="text-sm font-medium">Total:</span>
            <span class="font-medium">$999.99</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
