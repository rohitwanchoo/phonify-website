<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { useDebounceFn } from '@vueuse/core'

// Pagination and search variables
const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: ringlessCampaign, status: ringlessCampaignStatus, refresh: ringlessCampaignRefresh } = await useLazyAsyncData('ringless-campaign', () =>
  useApi().get('/ringless/campaign', {
    params: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    }
  }), {
  transform: res => res,
})

// Pagination functions
function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return ringlessCampaignRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return ringlessCampaignRefresh()
}

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  start.value = 0 // Reset to first page on new search
  ringlessCampaignRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Ringless Voicemail Campaigns">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" @update:model-value="searchText" placeholder="search" />
        <Nuxt-link to="/app/ringless-voicemail/campaign/new-campaign">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Create Campaign
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <RinglessVoicemailCampaignTable 
        :list="ringlessCampaign?.data || []" 
        :loading="ringlessCampaignStatus === 'pending'"
        :limit="limit"
        :total-rows="ringlessCampaign?.total_rows || 0"
        :start="start"
        @refresh="ringlessCampaignRefresh"
        @page-navigation="changePage"
        @change-limit="changeLimit"
      />
    </div>
  </div>
</template>