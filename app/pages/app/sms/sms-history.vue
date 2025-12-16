<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: smsListResponse, status: smsListStatus, refresh: refreshSmsList } = await useLazyAsyncData('sms-lists', () =>
  useApi().get('sms', {
    query: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  transform: res => res.data,
  immediate: true,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshSmsList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshSmsList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshSmsList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="SMS History">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search Number / DID" @update:model-value="searchText" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <SmsHistoryTable
        :limit="limit"
        :total-rows="smsListResponse?.total"
        :start="start"
        :list="smsListResponse?.data || []"
        :loading="smsListStatus === 'pending'"
        @page-navigation="changePage"
        @change-limit="changeLimit"
      />
    </div>
  </div>
</template>
