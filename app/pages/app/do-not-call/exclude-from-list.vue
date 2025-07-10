<script setup lang="ts">
import { Input } from '@/components/ui/input'

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const showAddDialog = ref(false)

const { data: excludeNumber, status: excludeNumberStatus, refresh: refreshExcludeNumber } = await useLazyAsyncData('exclude-number-list', () =>
  useApi().post('/exclude-number', {
    lower_limit: pageStart.value,
    upper_limit: limit.value,
    search: searchQuery.value,
  }), {
  transform: res => res,
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  refreshExcludeNumber()
  pageStart.value = 0
})

const selectedExcludeNumber = ref<null | {
  number: number
  first_name: string
  last_name: string
  company_name: string
  campaign_id: number
}>(null)

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
  return refreshExcludeNumber()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshExcludeNumber()
}
</script>

<template>
  <BaseHeader title="Exclude Number">
    <template #actions>
      <div class="relative mt-4 md:mt-0">
        <Input v-model="searchQuery" placeholder="Search" class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <!-- Upload DNC Dialog -->
      <DoNotCallDncUpload />
      <!-- Add DNC Dialog -->
      <DoNotCallExcludeNumberAdd v-model:open="showAddDialog" :initial-data="selectedExcludeNumber" />
    </template>
  </BaseHeader>
  <div>
    <DoNotCallExcludeNumberTable :limit="limit" :total-rows="excludeNumber?.record_count" :start="pageStart" :list="excludeNumber?.data" :loading="excludeNumberStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" @refresh="refreshExcludeNumber" />
  </div>
</template>
