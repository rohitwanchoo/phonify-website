<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const showSheet = ref(false)

const { data: cliReportData, status: cliReportStatus, refresh: cliReportRefresh } = await useLazyAsyncData('cli-report', () =>
  useApi().post('/cli-report', {
    lower_limit: start.value,
    upper_limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return cliReportRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return cliReportRefresh()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  cliReportRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Caller ID Name Reports">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />

        <!-- Trigger Button -->
        <ReportCallerIdNameManualCallSheet
          v-if="cliReportData?.data"
          v-model:open="showSheet"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportCallerIdNameTable :limit="limit" :total-rows="cliReportData?.record_count" :start="start" :list="cliReportData?.data" :loading="cliReportStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" />
    </div>
  </div>
</template>
