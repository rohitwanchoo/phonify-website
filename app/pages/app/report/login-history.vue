<script setup lang="ts">
const start = ref(0)
const limit = ref(10)

const showSheet = ref(false)
const activeFilters = ref<Record<string, any>>({})

const { data: loginHistoryData, status: loginHistoryDataStatus, refresh: loginHistoryDataRefresh } = await useLazyAsyncData('login-history', () =>
  useApi().post('/login-history', {
    ...activeFilters.value,
    lower_limit: start.value,
    upper_limit: limit.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return loginHistoryDataRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return loginHistoryDataRefresh()
}

// Handle filter application
async function handleApplyFilter(filterParams: Record<string, any>) {
  activeFilters.value = filterParams
  start.value = 0 // Reset pagination
  await loginHistoryDataRefresh() // Refresh data with new filters
}

// Handle filter clearing
async function handleClearFilter() {
  activeFilters.value = {}
  start.value = 0 // Reset pagination
  await loginHistoryDataRefresh() // Refresh data without filters
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Login History">
      <template #actions>
        <div class="flex items-center gap-4">
          <!-- Existing Filter Sheet -->
          <ReportLoginHistoryFilterSheet
            v-if="loginHistoryData?.data"
            v-model:open="showSheet"
            @apply-filter="handleApplyFilter"
            @clear-filter="handleClearFilter"
          />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div class="h-[calc(100vh-160px)] overflow-y-auto">
      <ReportLoginHistoryTable :limit="limit" :total-rows="loginHistoryData?.record_count" :start="start" :list="loginHistoryData?.data || []" :loading="loginHistoryDataStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" />
    </div>
  </div>
</template>
