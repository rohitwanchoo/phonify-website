<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')
const showConfigureDialog = ref(false)

const { data: leadList, status: statusLeadList, refresh: refreshLeadList } = await useLazyAsyncData('lead-management-list', () =>
  useApi().post('/list', { start: start.value, limit: limit.value, title: search.value }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshLeadList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshLeadList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshLeadList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

interface ListHeader {
  id: number
  list_id: number
  header: string
  column_name: string
  label_id: number
  is_search: number
  is_dialing: number
  is_visible: number
  is_editable: number
  is_deleted: number
  updated_at: string
  alternate_phone: string | null
}

interface ListData {
  campaign: string
  list: string
  campaign_id: number
  list_id: number
  updated_at: string
  is_active: number
  list_header: ListHeader[]
}

const listData = ref<ListData>()

async function getListHeaders({ campaign_id, list_id }: { campaign_id: string, list_id: string }) {
  const response = await useApi().post('/list', { campaign_id, list_id })
  // const response = await useApi().post('/list', { campaign_id: '20', list_id: '46' })
  listData.value = response.data
}

async function openListConfigureDialog(val: { campaign_id: string, list_id: string }) {
  await getListHeaders(val)
  showConfigureDialog.value = true
}
</script>

<template>
  <BaseHeader title="Lists">
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" @update:model-value="searchText" />
      <LeadManagementListsCreate @complete="openListConfigureDialog" />
    </template>
  </BaseHeader>
  <div @click="openListConfigureDialog({ campaign_id: '20', list_id: '46' })">
    test
  </div>
  <!-- TABLE -->
  <div>
    <LeadManagementListsTable :loading="statusLeadList === 'pending'" :list="leadList?.data || []" :limit="limit" :total-rows="leadList?.total_rows" :start="start" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refreshLeadList" />
  </div>
  <LeadManagementListsConfigureListDialog :list-data="listData" :open="showConfigureDialog" @update:open="showConfigureDialog = $event" />
</template>
