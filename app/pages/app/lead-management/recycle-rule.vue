<script setup lang="ts">
import AddDialog from '@/components/lead-management/recycle-rule/AddDialog.vue'
import FilterSheet from '@/components/lead-management/recycle-rule/FilterSheet.vue'
import { Input } from '~/components/ui/input'

const showDialog = ref(false)
const showSheet = ref(false)

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

// Store active filter parameters
const activeFilters = ref<Record<string, any>>({})

const { data: recycleRules, status, refresh } = await useLazyAsyncData('recycle-rule', () =>
  useApi().post('/recycle-rule', {
    ...activeFilters.value,
  }), {
  transform: res => res,
})

const searchFilteredRules = computed(() => {
  if (!recycleRules.value)
    return []
  const query = searchQuery.value.toLowerCase()
  return recycleRules.value.data.filter((item: any) => {
    return (
      item?.campaign?.toLowerCase().includes(query)
      || item?.list?.toLowerCase().includes(query)
      || item?.disposition?.toLowerCase().includes(query)
      || item?.day?.toLowerCase().includes(query)
    )
  })
})

const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return searchFilteredRules.value.slice(start, end)
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  pageStart.value = 0
})

const selectedRecycleRule = ref<null | {
  id: number
  campaign_id: number
  list_id: number
  disposition_id: number
  day: string
  time: string
  call_time: number
  is_deleted: number
  updated_at: string
  campaign: string
  list: string
  disposition: string
}>(null)

function openEditDialog(recycleRule: any) {
  selectedRecycleRule.value = recycleRule
  showDialog.value = true
}

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}

// Handle filter application
async function handleApplyFilter(filterParams: Record<string, any>) {
  activeFilters.value = filterParams
  pageStart.value = 0 // Reset pagination
  await refresh() // Refresh data with new filters
}

// Handle filter clearing
async function handleClearFilter() {
  activeFilters.value = {}
  pageStart.value = 0 // Reset pagination
  await refresh() // Refresh data without filters
}
</script>

<template>
  <!-- HEADER -->
  <BaseHeader title="Recycle Rules">
    <template #actions>
      <div class="relative">
        <Input v-model="searchQuery" placeholder="Search List" class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <FilterSheet
        v-if="recycleRules?.data"
        v-model:open="showSheet"
        :recycle-rules="recycleRules?.data"
        @apply-filter="handleApplyFilter"
        @clear-filter="handleClearFilter"
      />
      <AddDialog v-model:open="showDialog" :initial-data="selectedRecycleRule" />
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <LeadManagementRecycleRuleTable :limit="limit" :total-rows="searchFilteredRules.length" :start="pageStart" :list="paginatedList || []" :loading="status === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refresh" @edit="openEditDialog" />
  </div>
</template>
