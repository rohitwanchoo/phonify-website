<script setup lang="ts">
const showSheet = ref(false)

const start = ref(0)
const limit = ref(10)

// Store active filter parameters
const activeFilters = ref<Record<string, any>>({})

const { data: report, status: reportStatus, refresh: reportRefresh } = await useLazyAsyncData('report', () =>
  useApi().post('/report', {
    ...activeFilters.value,
    lower_limit: start.value,
    upper_limit: limit.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return reportRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return reportRefresh()
}

// Handle filter application
async function handleApplyFilter(filterParams: Record<string, any>) {
  activeFilters.value = filterParams
  start.value = 0 // Reset pagination
  await reportRefresh() // Refresh data with new filters
}

// Handle filter clearing
async function handleClearFilter() {
  activeFilters.value = {}
  start.value = 0 // Reset pagination
  await reportRefresh() // Refresh data without filters
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Reports">
      <template #actions>
        <!-- Trigger Button -->
        <ReportCallDataFilterSheet
          v-model:open="showSheet"
          class="bg-black text-white"
          @apply-filter="handleApplyFilter"
          @clear-filter="handleClearFilter"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <ReportCallDataTable
      :limit="limit"
      :total-rows="report?.record_count"
      :start="start" :list="report?.data || []"
      :loading="reportStatus === 'pending'"
      @page-navigation="changePage"
      @limit-change="changeLimit"
    />
  </div>
</template>
