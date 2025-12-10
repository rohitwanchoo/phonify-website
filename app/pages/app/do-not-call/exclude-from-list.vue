<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const open = ref(false)
const initialData = ref<any>()
const isEdit = ref(false)

const { data: excludeNumber, status: excludeNumberStatus, refresh: refreshExcludeNumber } = await useLazyAsyncData('exclude-number-list', () =>
  useApi().post('/exclude-number', {
    lower_limit: start.value,
    upper_limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

function openEditModel(item: any) {
  initialData.value = item
  isEdit.value = true
  open.value = true
}

function onModelUpdate(val: boolean) {
  if (!val) {
    isEdit.value = false
  }
}

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshExcludeNumber()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshExcludeNumber()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshExcludeNumber()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <BaseHeader title="Exclude Number">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
      <!-- Upload DNC Dialog -->
      <!-- <DoNotCallDncUpload /> -->
      <!-- Add DNC Dialog -->
      <DoNotCallExcludeNumberAddOrEdit v-model:open="open" :initial-data="initialData" :is-edit="isEdit" @update:open="onModelUpdate" />
    </template>
  </BaseHeader>
  <div>
    <DoNotCallExcludeNumberTable
      :limit="limit"
      :total-rows="excludeNumber?.record_count"
      :start="start"
      :list="excludeNumber?.data"
      :loading="excludeNumberStatus === 'pending'"
      @page-navigation="changePage"
      @limit-change="changeLimit"
      @refresh="refreshExcludeNumber"
      @edit="openEditModel"
    />
  </div>
</template>
