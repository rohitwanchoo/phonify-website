<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: leadList, status: statusLeadList, refresh: refreshLeadList } = await useLazyAsyncData('lead-management-list', () =>
  useApi().post('/list', { start: start.value, limit: limit.value, search: search.value }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshLeadList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshLeadList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshLeadList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <BaseHeader title="Lists">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" @update:model-value="searchText" />
      <LeadManagementListsCreate />
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <LeadManagementListsTable :loading="statusLeadList === 'pending'" :list="leadList?.data || []" :limit="limit" :total-rows="leadList?.total_rows" :start="start" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refreshLeadList" />
  </div>
</template>
