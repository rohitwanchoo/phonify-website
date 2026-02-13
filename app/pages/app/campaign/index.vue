<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const start = ref<number>(0)
const limit = ref<number>(10)
const searchKeyword = ref<string>('')
const statusFilter = ref<string>('all')
const dialModeFilter = ref<string>('all')

const { data: campaignList, status, refresh: refreshCampaignList } = await useLazyAsyncData('campaigns-list', async () => {
  const response = await useApi().post('campaign', {
    start: start.value,
    limit: limit.value,
    title: searchKeyword.value,
  })
  return response
})

// Computed stats from API response
// Note: active/inactive counts are from current page only unless API provides totals
const stats = computed(() => {
  const campaigns = campaignList.value?.data || []
  const total = campaignList.value?.total_rows || 0
  // Use API-provided counts if available, otherwise calculate from current page
  const active = campaignList.value?.active_count
    ?? campaigns.filter((c: any) => c.status === 1 || c.status === '1').length
  const inactive = campaignList.value?.inactive_count
    ?? campaigns.filter((c: any) => c.status === 0 || c.status === '0').length
  return { total, active, inactive }
})

// Filtered campaigns
const filteredCampaigns = computed(() => {
  let campaigns = campaignList.value?.data || []
  if (statusFilter.value !== 'all') {
    const statusVal = statusFilter.value === 'active' ? 1 : 0
    campaigns = campaigns.filter((c: any) => c.status === statusVal)
  }
  if (dialModeFilter.value !== 'all') {
    campaigns = campaigns.filter((c: any) => c.dial_mode === dialModeFilter.value)
  }
  return campaigns
})

const filteredTotalRows = computed(() => {
  if (statusFilter.value === 'all' && dialModeFilter.value === 'all') {
    return campaignList.value?.total_rows || 0
  }
  return filteredCampaigns.value.length
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshCampaignList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshCampaignList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshCampaignList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

function clearFilters() {
  statusFilter.value = 'all'
  dialModeFilter.value = 'all'
}

const hasActiveFilters = computed(() => statusFilter.value !== 'all' || dialModeFilter.value !== 'all')
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Campaign">
      <template #actions>
        <BaseInputSearch v-model="searchKeyword" placeholder="Search Campaign" @update:model-value="searchText" />
        <Nuxt-link to="/app/campaign/new-campaign">
          <Button class="h-11">
            <Icon class="!text-white text-xl" name="material-symbols:add" />
            Create Campaign
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="material-symbols:campaign-outline" class="text-blue-600" size="24" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Campaigns</p>
            <p class="text-2xl font-semibold text-gray-900">
              <template v-if="status === 'pending'">
                <span class="animate-pulse">--</span>
              </template>
              <template v-else>
                {{ formatWithCommas(stats.total) }}
              </template>
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="material-symbols:check-circle-outline" class="text-green-600" size="24" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Active</p>
            <p class="text-2xl font-semibold text-green-600">
              <template v-if="status === 'pending'">
                <span class="animate-pulse">--</span>
              </template>
              <template v-else>
                {{ stats.active }}
              </template>
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-red-100 rounded-lg">
            <Icon name="material-symbols:cancel-outline" class="text-red-600" size="24" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Inactive</p>
            <p class="text-2xl font-semibold text-red-600">
              <template v-if="status === 'pending'">
                <span class="animate-pulse">--</span>
              </template>
              <template v-else>
                {{ stats.inactive }}
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">Filter by:</span>
        <Select v-model="statusFilter">
          <SelectTrigger class="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="dialModeFilter">
          <SelectTrigger class="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Dial Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dial Modes</SelectItem>
            <SelectItem value="super_power_dial">Super Power Dial</SelectItem>
            <SelectItem value="predictive_dial">Predictive Dial</SelectItem>
            <SelectItem value="outbound_ai">Outbound AI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button v-if="hasActiveFilters" variant="ghost" size="sm" class="text-gray-500 hover:text-gray-700" @click="clearFilters">
        <Icon name="lucide:x" size="16" class="mr-1" />
        Clear filters
      </Button>
    </div>

    <!-- TABLE -->
    <div>
      <CampaignTable
        :list="filteredCampaigns"
        :total-rows="filteredTotalRows"
        :start
        :limit
        :loading="status === 'pending'"
        @refresh="refreshCampaignList"
        @page-navigation="changePage"
        @change-limit="changeLimit"
      />
    </div>
  </div>
</template>
