<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const showSheet = ref(false)

const start = ref(0)
const limit = ref(10)
const search = ref('')

// Store active filter parameters
const activeFilters = ref<Record<string, any>>({})

const { data: transferReport, status: transferReportStatus, refresh: transferReportRefresh } = await useLazyAsyncData('transfer-report', () =>
  useApi().post('/transfer-report', {
    ...activeFilters.value,
    lower_limit: start.value,
    upper_limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return transferReportRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return transferReportRefresh()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  transferReportRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

// Handle filter application
async function handleApplyFilter(filterParams: Record<string, any>) {
  activeFilters.value = filterParams
  start.value = 0 // Reset pagination
  await transferReportRefresh() // Refresh data with new filters
}

// Handle filter clearing
async function handleClearFilter() {
  activeFilters.value = {}
  start.value = 0 // Reset pagination
  await transferReportRefresh() // Refresh data without filters
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Transfer">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="search" @update:model-value="searchText" />

        <!-- Trigger Button -->
        <ReportCallTransferFilterSheet
          v-model:open="showSheet"
          @apply-filter="handleApplyFilter"
          @clear-filter="handleClearFilter"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportCallTransferTable :limit="limit" :total-rows="transferReport?.total" :start="start" :list="transferReport?.data || []" :loading="transferReportStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>
