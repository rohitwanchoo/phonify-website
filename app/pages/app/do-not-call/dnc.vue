<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const open = ref(false)
const initialData = ref<any>()
const isEdit = ref(false)

const { data: dncList, status: dncListStatus, refresh: refreshDncList } = await useLazyAsyncData('dnc-list', () =>
  useApi().post('/dnc', {
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
      <!-- TO DO: Add DNC Upload Dialog -->
      <!-- <DoNotCallDncUpload /> -->
      <!-- Add DNC Dialog -->
      <DoNotCallDncAdd v-model:open="open" :initial-data="initialData" :is-edit="isEdit" @update:open="onModelUpdate" @complete="refreshDncList" />
    </template>
  </BaseHeader>
  <div>
    <DoNotCallDncTable
      :limit="limit"
      :start="start"
      :total-rows="dncList?.record_count"
      :list="dncList?.data"
      :loading="dncListStatus === 'pending'"
      @page-navigation="changePage"
      @limit-change="changeLimit"
      @edit="openEditModel"
    />
  </div>
</template>
