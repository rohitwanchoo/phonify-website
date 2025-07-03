<script setup lang="ts">
import moment from 'moment'
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 10,
  total: 50,
}

const { data: campaignList, status, refresh } = await useLazyAsyncData('campaigns-list', async () => {
  const response = await useApi().get('campaigns', {
    params: {
      // start: 0,
      // limit: 5,
    },
  })
  return response
})
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Wallet Transactions">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
        <BillingWalletTransactionsTable />
    </div>
  </div>
</template>
