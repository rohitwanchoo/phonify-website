<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import moment from 'moment'

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 10,
  total: 50,
}

const { data: campaignList, status, refresh } = await useLazyAsyncData('campaigns-list', async () => {
  const response = await useApi().get('campaigns', {})
  return response
})

</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Campaign">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Nuxt-link to="/app/campaign/new-campaign">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Create Campaign
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CampaignTable :list="campaignList?.data"  :meta="meta" :loading="status === 'pending'" />
    </div>
  </div>
</template>
