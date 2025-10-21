<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const showDialog = ref(false)

const { data: labelData, status: labelStatus, refresh: labelRefresh } = await useLazyAsyncData('label', () =>
  useApi().post('/label', {
    // start: start.value,
    // limit: limit.value,
    title: search.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return labelRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return labelRefresh()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  labelRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <BaseHeader title="Labels">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search Labels" @update:model-value="searchText" />
      <LeadManagementLabelAdd v-model:open="showDialog" />
    </template>
  </BaseHeader>

  <div class="flex gap-4 justify-between mt-6">
    <!-- TABLE -->
    <div class="w-full h-[calc(100vh-165px)] overflow-y-auto">
      <LeadManagementLabelTable :limit="limit" :total-rows="labelData?.total" :start="start" :list="labelData?.data || []" :loading="labelStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="labelRefresh" />
    </div>
    <!-- Display Order -->
    <LeadManagementLabelDisplayOrder
      :label-status="labelStatus"
      :label-list="labelData?.data"
      class="hidden lg:block"
    />
  </div>
</template>
