<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: labelData, status: labelStatus, refresh: labelRefresh } = await useLazyAsyncData('label', () =>
  useApi().post('/label', {
    title: search.value,
  }), {
  transform: res => res,
})

const isEdit = ref(false)
const open = ref(false)
const editRowData = ref({})

// Function to open the edit model
function onEdit(original: any) {
  editRowData.value = original
  open.value = true
  isEdit.value = true
}
function onModelUpdate(val: boolean) {
  if (!val) {
    isEdit.value = false
  }
}

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
      <LeadManagementLabelAdd v-model:open="open" :initial-data="editRowData" :is-edit="isEdit" @update:open="onModelUpdate" />
    </template>
  </BaseHeader>

  <div class="flex gap-4 justify-between mt-6">
    <!-- TABLE -->
    <div class="w-full h-[calc(100vh-175px)] overflow-y-auto">
      <LeadManagementLabelTable :limit="limit" :total-rows="labelData?.total" :start="start" :list="labelData?.data || []" :loading="labelStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="labelRefresh" @edit="onEdit" />
    </div>
    <!-- Display Order -->
    <LeadManagementLabelDisplayOrder
      :label-status="labelStatus"
      :label-list="labelData?.data"
      class="hidden lg:block"
    />
  </div>
</template>
