<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import { Input } from '~/components/ui/input'

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 20,
}

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const { data: crmLabelsList, status, refresh } = await useLazyAsyncData('crm-labels', () =>
  useApi().get('/crm-labels', {
  }), {
  transform: res => res,
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
  return refresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refresh()
}

function fetchLabels() {
  refresh()
}

const filteredLabel = computed(() => {
  if (!crmLabelsList.value?.data)
    return []
  const query = searchQuery.value.toLowerCase()
  return crmLabelsList.value.data.filter((item: any) => {
    return (
      item?.title?.toLowerCase().includes(query)
      || item?.data_type?.toLowerCase().includes(query)
      || item?.created_at?.toLowerCase().includes(query)
    )
  })
})

const selectedLabel = ref<null | {
  id: number
  title: string
  data_type: string
  values?: string
  created_at?: string
}>(null)

const showDialog = ref(false)

function openEditDialog(label: any) {
  selectedLabel.value = label
  showDialog.value = true
}

function openAddDialog() {
  selectedLabel.value = null
  showDialog.value = true
}
</script>

<template>
  <BaseHeader title="Labels">
    <template #actions>
      <div class="relative">
        <Input v-model="searchQuery" placeholder="Search List" class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <Button @click="openAddDialog">
        <Icon name="material-symbols:add" size="20" class="mr-1" />
        Add Label
      </Button>
      <LeadManagementLabelAddLabel
        :initial-data="selectedLabel"
        :open="showDialog"
        @close="showDialog = false"
        @saved="fetchLabels"
      />
    </template>
  </BaseHeader>

  <div class="flex gap-4 justify-between">
    <!-- TABLE -->
    <div class="w-full">
      <LeadManagementLabelTable :limit="limit" :total-rows="filteredLabel.length" :start="pageStart" :list="filteredLabel || []" :loading="status === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refresh" @edit="openEditDialog" />
    </div>
    <LeadManagementLabelDisplayOrder />
  </div>
</template>
