<script setup lang="ts">
const { user } = useAuth()
const showSheet = ref(false)

const start = ref(0)
const limit = ref(10)

// Store active filter parameters
const activeFilters = ref<Record<string, any>>({})

const { data: transferReport, status: transferReportStatus, refresh: transferReportRefresh } = await useLazyAsyncData('transfer-report', () =>
  useApi().post('/transfer-report', {
    ...activeFilters.value,
    lower_limit: start.value,
    upper_limit: limit.value,
    id: user.value?.id,
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
        <!-- Trigger Button -->
        <ReportCallTransferFilterSheet
          v-model:open="showSheet"
          @apply-filter="handleApplyFilter"
          @clear-filter="handleClearFilter"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <ReportCallTransferTable
      :limit="limit"
      :total-rows="transferReport?.record_count"
      :start="start"
      :list="transferReport?.data || []"
      :loading="transferReportStatus === 'pending'"
      @page-navigation="changePage"
      @change-limit="changeLimit"
    />
  </div>
</template>
