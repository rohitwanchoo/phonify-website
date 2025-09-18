<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import ListTable from './table.vue'

const emit = defineEmits(['completed'])
const route = useRoute()
const campaign_id = route.query.id
const isEdit = computed(() => !!campaign_id)

const selectedRowIds = ref<number[]>([])
const start = ref(0)
const limit = ref(10)
const search = ref('')

const dialogRef = ref()

function openDialog() {
  dialogRef.value?.open()
}

const assignLoading = ref(false)

function handleContinue() {
  // assign list to campaign
  assignLoading.value = true
  useApi().post('/campaign/assign-lists', { campaign_id, lead_list_ids: selectedRowIds.value }).then(() => {
    assignLoading.value = false
    emit('completed')
  }).catch((error) => {
    showToast({ type: 'error', message: error.message })
  }).finally(() => {
    assignLoading.value = false
  })
}

// get list that is assigned to campaign with campaign_id
const { data: campaignList, status: campaignListStatus, refresh: refreshCampaignList } = await useLazyAsyncData('get-list-update-campaign', () =>
  useApi().post('/campaign-list', { campaign_id }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})
const { data: list, status: listStatus, refresh: listRefresh } = await useLazyAsyncData('get-list-create-campaign', () =>
  useApi().post('/list', { start: start.value, limit: limit.value, title: search.value }), {
  transform: (res) => {
    return { data: res.data, total_rows: res.total_rows }
  },
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return listRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return listRefresh()
}
// const tableList = computed(() => isEdit.value ? campaignList : list)
const loading = computed(() => campaignListStatus.value === 'pending' || listStatus.value === 'pending')

function setSelectedRow() {
  if (isEdit.value) {
    refreshCampaignList().then(() => {
      selectedRowIds.value = campaignList.value.map((val: { list_id: number }) => val.list_id)
    })
  }
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  listRefresh()
}, 1000, { maxWait: 5000 })

function searchList() {
  debouncedSearch()
}

onMounted(() => {
  setSelectedRow()
})
</script>

<template>
  <div class="px-4 py-6 h-[calc(100vh-255px)]">
    <div class="flex w-full flex-col sm:flex-row sm:justify-between items-center">
      <h2 class="text-xl text-primary">
        Lists
      </h2>
      <div class="flex items-center justify-between gap-5">
        <BaseInputSearch v-model="search" @update:model-value="searchList" />

        <Button class="h-10 cursor-pointer" @click="openDialog">
          + Create List
        </Button>
      </div>
    </div>
    <!-- data -->
    <ListTable
      v-model:selected-rows="selectedRowIds" :limit="limit" :total-rows="list?.total_rows"
      :start="start" :list="list?.data || []" :is-edit="isEdit" :loading="loading"
      @page-navigation="changePage" @change-limit="changeLimit"
    />
  </div>

  <div class="sticky bg-white bottom-0 right-0 w-full shadow-2xl p-4">
    <Button :loading="assignLoading" :disable="assignLoading" class="w-full h-[52px] cursor-pointer" type="submit" @click="handleContinue">
      Continue
      <Icon name="lucide:arrow-right" size="20" />
    </Button>
  </div>

  <!-- Dialog component -->
  <CampaignSelectListDialog ref="dialogRef" />
</template>
