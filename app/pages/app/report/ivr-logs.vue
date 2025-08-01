<script setup lang="ts">
const showSheet = ref(false)

const start = ref(0)
const limit = ref(10)

// Store active filter parameters
const activeFilters = ref<Record<string, any>>({})

const { data: ivrReport, status: ivrReportStatus, refresh: ivrReportRefresh } = await useLazyAsyncData('transfer-report', () =>
  useApi().post('/ivr-report', {
    ...activeFilters.value,
    lower_limit: start.value,
    upper_limit: limit.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return ivrReportRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return ivrReportRefresh()
}

// Handle filter application
async function handleApplyFilter(filterParams: Record<string, any>) {
  activeFilters.value = filterParams
  start.value = 0 // Reset pagination
  await ivrReportRefresh() // Refresh data with new filters
}

// Handle filter clearing
async function handleClearFilter() {
  activeFilters.value = {}
  start.value = 0 // Reset pagination
  await ivrReportRefresh() // Refresh data without filters
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="IVR Logs Call Reports">
      <template #actions>
        <!-- Trigger Button -->
        <ReportIvrLogsFilterSheet
          v-model:open="showSheet"
          class="bg-black text-white"
          @apply-filter="handleApplyFilter"
          @clear-filter="handleClearFilter"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportIvrLogsTable :limit="limit" :total-rows="ivrReport?.total" :start="start" :list="ivrReport?.data || []" :loading="ivrReportStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>
