<script setup lang="ts">
import moment from 'moment'
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const start = ref<number>(0)
const limit = ref<number>(10)

const { data: campaignList, status, refresh: refreshCampaignList } = await useLazyAsyncData('campaigns-list', async () => {
  const response = await useApi().post('campaign', {
    start: start.value,
    limit: limit.value,
  })
  return response
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshCampaignList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshCampaignList()
}
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
      <CampaignTable :list="campaignList?.data" :total-rows="campaignList?.total_rows" :start :limit :loading="status === 'pending'" @refresh="refreshCampaignList" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>
