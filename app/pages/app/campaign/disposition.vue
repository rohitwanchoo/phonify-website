<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: dispositionList, status: dispositionListStatus, refresh: refreshdispositionList } = await useLazyAsyncData('get-disposition-list', () =>
  useApi().post('/disposition', {
    start: start.value,
    limit: limit.value,
    title: search.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshdispositionList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshdispositionList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshdispositionList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

const open = ref(false)
const editRowData = ref({})
function onEdit(original: any) {
  editRowData.value = original
  open.value = true
}
watch(() => open.value, (val) => {
  if (!val) {
    editRowData.value = {}
  }
})
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Disposition">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search Disposition" @update:model-value="searchText" />
        <div>
          <CampaignDispositionAddEdit v-model:open="open" :data="editRowData" @complete="refreshdispositionList" />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CampaignDispositionTable :limit="limit" :total-rows="dispositionList?.total_rows" :start="start" :list="dispositionList?.data || []" :loading="dispositionListStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @edit="onEdit" @refresh="refreshdispositionList" />
    </div>
  </div>
</template>
