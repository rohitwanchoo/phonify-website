<script setup lang="ts">
const list = [
  {
    subscription: 'Premium',
    amount: 999,
    date: '2021-01-01',
    status: 'success',
  },
  {
    subscription: 'Premium',
    amount: 999,
    date: '2021-01-01',
    status: 'success',
  },
  {
    subscription: 'Premium',
    amount: 999,
    date: '2021-01-01',
    status: 'success',
  },
  {
    subscription: 'Premium',
    amount: 999,
    date: '2021-01-01',
    status: 'success',
  },
  {
    subscription: 'Premium',
    amount: 999,
    date: '2021-01-01',
    status: 'success',
  },
]
</script>

<template>
  <div>
    <BaseHeader title="Invoices">
      <template #actions>
        <BaseInputSearch />
      </template>
    </BaseHeader>
    <BillingInvoiceTable :list="list" />
  </div>
</template>
