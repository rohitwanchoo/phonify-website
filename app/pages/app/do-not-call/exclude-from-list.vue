<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const showAddDialog = ref(false)

const { data: excludeNumber, status: excludeNumberStatus, refresh: refreshExcludeNumber } = await useLazyAsyncData('exclude-number-list', () =>
  useApi().post('/exclude-number', {
    lower_limit: start.value,
    upper_limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

const selectedExcludeNumber = ref<null | {
  number: number
  first_name: string
  last_name: string
  company_name: string
  campaign_id: number
}>(null)

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshExcludeNumber()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshExcludeNumber()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshExcludeNumber()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <BaseHeader title="Exclude Number">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
      <!-- Upload DNC Dialog -->
      <DoNotCallDncUpload />
      <!-- Add DNC Dialog -->
      <DoNotCallExcludeNumberAdd v-model:open="showAddDialog" :initial-data="selectedExcludeNumber" />
    </template>
  </BaseHeader>
  <div>
    <DoNotCallExcludeNumberTable :limit="limit" :total-rows="excludeNumber?.record_count" :start="start" :list="excludeNumber?.data" :loading="excludeNumberStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" @refresh="refreshExcludeNumber" />
  </div>
</template>
