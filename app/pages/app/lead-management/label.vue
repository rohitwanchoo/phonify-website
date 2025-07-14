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

async function handleReorder(updatedList: any[]) {
  try {
    await Promise.all(
      updatedList.map((item, index) =>
        updateCrmLabel(item.id, {
          title: item.title,
          order: index + 1,
          edit_mode: true,
        }),
      ),
    )
    await labelRefresh()
  }
  catch {
    showToast({
      message: 'Failed to update label order',
      type: 'error',
    })
  }
}
</script>

<template>
  <BaseHeader title="Labels">
    <template #actions>
      <div class="relative">
        <Input v-model="searchQuery" placeholder="Search List" class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <LeadManagementLabelAdd v-model:open="showDialog" />
      <!-- <LeadManagementLabelAddLabel
        :initial-data="selectedLabel"
        :open="showDialog"
        @close="showDialog = false"
        @saved="fetchLabels"
      /> -->
    </template>
  </BaseHeader>

  <div class="flex gap-4 justify-between">
    <!-- TABLE -->
    <div class="w-full h-[calc(100vh-165px)] overflow-y-auto">
      <LeadManagementLabelTable :limit="limit" :total-rows="filteredLabel.length" :start="pageStart" :list="paginatedList || []" :loading="labelStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="labelRefresh" />
    </div>
    <LeadManagementLabelDisplayOrder
      :label-list="labelData?.data"
      :loading="labelStatus === 'pending'"
      class="hidden lg:block"
      @update-order="handleReorder"
    />
  </div>
</template>
