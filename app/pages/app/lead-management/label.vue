<script setup lang="ts">
import { Input } from '~/components/ui/input'

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const showDialog = ref(false)

const { data: labelData, status: labelStatus, refresh: labelRefresh } = await useLazyAsyncData('label', () =>
  useApi().post('/label', {
  }), {
  transform: res => res,
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}

const filteredLabel = computed(() => {
  if (!labelData.value?.data)
    return []
  const query = searchQuery.value.toLowerCase()
  return labelData.value.data.filter((item: any) => {
    return (
      item?.title?.toLowerCase().includes(query)
      || item?.data_type?.toLowerCase().includes(query)
      || item?.updated_at?.toLowerCase().includes(query)
    )
  })
})

// Then paginate the filtered data
const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return filteredLabel.value.slice(start, end)
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  pageStart.value = 0
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
      <LeadManagementLabelTable :limit="limit" :total-rows="filteredLabel.length" :start="pageStart" :list="paginatedList || []" :loading="labelStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="labelRefresh" />
    </div>
    <!-- Display Order -->
    <LeadManagementLabelDisplayOrder
      v-if="labelStatus !== 'pending'"
      :label-list="labelData?.data"
      class="hidden lg:block"
    />
  </div>
</template>
