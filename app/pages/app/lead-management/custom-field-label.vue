<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')
const showDialog = ref(false)
const editMode = ref<'add' | 'edit'>('add')
const selectedRowData = ref<any>(null)

const { data: customfieldlabelData, status: customfieldlabelStatus, refresh: customfieldlabelRefresh } = await useLazyAsyncData('customfieldlabel', () =>
  useApi().get('/custom-field-labels', {
    params: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  transform: res => res,
})

function handleAddRefresh() {
  start.value = 0
  customfieldlabelRefresh()
}

function handleEdit(rowData: any) {
  selectedRowData.value = rowData
  editMode.value = 'edit'
  showDialog.value = true
}

function handleDialogClosed() {
  selectedRowData.value = null
  editMode.value = 'add'
}

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return customfieldlabelRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return customfieldlabelRefresh()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  customfieldlabelRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <BaseHeader title="Custom Field Label">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
      <LeadManagementCustomFieldLabelAdd
        v-model:open="showDialog"
        :mode="editMode"
        :initial-data="selectedRowData"
        @refresh="handleAddRefresh"
        @closed="handleDialogClosed"
      />
    </template>
  </BaseHeader>

  <!-- TABLE -->
  <div class="w-full h-[calc(100vh-165px)] overflow-y-auto mt-4">
    <LeadManagementCustomFieldLabelTable
      :limit="limit"
      :total-rows="customfieldlabelData?.total"
      :start="start"
      :list="customfieldlabelData?.data || []"
      :loading="customfieldlabelStatus === 'pending'"
      @page-navigation="changePage"
      @change-limit="changeLimit"
      @refresh="customfieldlabelRefresh"
      @edit="handleEdit"
    />
  </div>
</template>
