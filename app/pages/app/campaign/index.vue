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

// Map API data to table row structure
const tableRows = computed(() =>
  (campaignList.value?.data || []).map((item, idx) => ({
    ...item,
    siNo: idx + 1,
    name: item.title,
    callTime: item.call_time_start && item.call_time_end
      ? `${moment(item.call_time_start, 'HH:mm:ss').format('hh:mm A')} - ${moment(item.call_time_end, 'HH:mm:ss').format('hh:mm A')}`
      : 'N/A',
    list: item.group_id,
    dialed: `${item.min_lead_temp || 0}/${item.max_lead_temp || 0}`,
    hoppers: item.hopper_mode,
    dialingMode: item.dial_mode,
    dateTime: item.updated
      ? {
          date: moment(item.updated, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
          time: moment(item.updated, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A'),
        }
      : { date: '', time: '' },
    campaignStatus: item.status === 1,
  }))
)
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
      <CampaignTable :list="tableRows" :meta="meta" :loading="status === 'pending'" />
    </div>
  </div>
</template>
