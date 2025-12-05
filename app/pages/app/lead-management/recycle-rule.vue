<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const showSheet = ref(false)

const start = ref(0)
const limit = ref(10)
const search = ref('')

const isEdit = ref(false)
const open = ref(false)
const editRowData = ref({})

// Store active filter parameters
const activeFilters = ref<Record<string, any>>({})

const { data: recycleRules, status: recycleRuleStatus, refresh: refreshRecycleRule } = await useLazyAsyncData('recycle-rule', () =>
  useApi().post('/recycle-rule', {
    ...activeFilters.value,
    start: start.value,
    limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshRecycleRule()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshRecycleRule()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshRecycleRule()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

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

// Handle filter application
async function handleApplyFilter(filterParams: Record<string, any>) {
  activeFilters.value = filterParams
  start.value = 0 // Reset pagination
  await refreshRecycleRule() // Refresh data with new filters
}

// Handle filter clearing
async function handleClearFilter() {
  activeFilters.value = {}
  start.value = 0 // Reset pagination
  await refreshRecycleRule() // Refresh data without filters
}
</script>

<template>
  <!-- HEADER -->
  <BaseHeader title="Recycle Rules">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
      <LeadManagementRecycleRuleFilter
        v-if="recycleRules?.data"
        v-model:open="showSheet"
        @apply-filter="handleApplyFilter"
        @clear-filter="handleClearFilter"
      />
      <LeadManagementRecycleRuleAdd v-model:open="open" :initial-data="editRowData" :is-edit="isEdit" @update:open="onModelUpdate" />
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <LeadManagementRecycleRuleTable
      :limit="limit"
      :total-rows="recycleRules?.total"
      :start="start"
      :list="recycleRules?.data || []"
      :loading="recycleRuleStatus === 'pending'"
      @page-navigation="changePage"
      @change-limit="changeLimit"
      @edit="onEdit"
    />
  </div>
</template>
