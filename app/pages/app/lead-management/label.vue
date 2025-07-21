<script setup lang="ts">
import { Input } from '~/components/ui/input'

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const showDialog = ref(false)

const { data: labelData, status: labelStatus, refresh: labelRefresh } = await useLazyAsyncData('label', () =>
  useApi().post('/label', {
    lower_limit: pageStart.value,
    upper_limit: limit.value,
    search: searchQuery.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
  return labelRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return labelRefresh()
}

// Watch search query and reset pagination
watch(searchQuery, () => {
  pageStart.value = 0
  labelRefresh()
})
</script>

<template>
  <BaseHeader title="Labels">
    <template #actions>
      <div class="relative">
        <Input v-model="searchQuery" placeholder="Search List" class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <LeadManagementLabelAdd v-model:open="showDialog" />
    </template>
  </BaseHeader>

  <div class="flex gap-4 justify-between">
    <!-- TABLE -->
    <div class="w-full h-[calc(100vh-165px)] overflow-y-auto">
      <LeadManagementLabelTable :limit="limit" :total-rows="labelData?.record_count" :start="pageStart" :list="labelData?.data || []" :loading="labelStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="labelRefresh" />
    </div>
    <!-- Display Order -->
    <LeadManagementLabelDisplayOrder
      v-if="labelStatus !== 'pending'"
      :label-list="labelData?.data"
      class="hidden lg:block"
    />
  </div>
</template>
