<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: ringGroupList, status: ringGroupListStatus, refresh: refreshRingGroupList } = await useLazyAsyncData('ring-group-list', () =>
  useApi().post('ring-group', {
    start: start.value,
    limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})
const open = ref(false)
const tempRingGroup = ref<any>()
const isEdit = ref(false)

function openEditModel(item: any) {
  tempRingGroup.value = item
  isEdit.value = true
  open.value = true
}

// Pagination
function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshRingGroupList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshRingGroupList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshRingGroupList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

function onModelUpdate(val: boolean) {
  if (!val) {
    isEdit.value = false
  }
}
</script>

<template>
  <BaseHeader title="Ring Group List">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
      <UserManagementRingGroupAdd v-model:open="open" :temp-ring-group="tempRingGroup" :is-edit="isEdit" @update:open="onModelUpdate" @complete="refreshRingGroupList" />
    </template>
  </BaseHeader>
  <UserManagementRingGroupTable
    :limit="limit"
    :total-rows="ringGroupList?.total"
    :list="ringGroupList?.data || []"
    :loading="ringGroupListStatus === 'pending'"
    @page-navigation="changePage"
    @change-limit="changeLimit"
    @edit="openEditModel"
  />
</template>
