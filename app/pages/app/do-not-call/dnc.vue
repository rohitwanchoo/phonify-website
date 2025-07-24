<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const showAddDialog = ref(false)

const { data: dncList, status: dncListStatus, refresh: refreshDncList } = await useLazyAsyncData('dnc-list', () =>
  useApi().post('/dnc', {
    lower_limit: start.value,
    upper_limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

const selectedDnc = ref<null | {
  number: number
  extension: number
  comment: string
}>(null)

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshDncList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshDncList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshDncList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <BaseHeader title="DNC List">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search Number / Exten.." @update:model-value="searchText" />
      <!-- Upload DNC Dialog -->
      <DoNotCallDncUpload />
      <!-- Add DNC Dialog -->
      <DoNotCallDncAdd v-model:open="showAddDialog" :initial-data="selectedDnc" />
    </template>
  </BaseHeader>
  <div>
    <DoNotCallDncTable :limit="limit" :total-rows="dncList?.record_count" :start="start" :list="dncList?.data" :loading="dncListStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" @refresh="refreshDncList" />
  </div>
</template>
