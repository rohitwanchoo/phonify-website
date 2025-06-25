<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import { Input } from '~/components/ui/input'
import { updateCrmLabel } from '~/composables/useCrmLabel'

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

//Api need to change when lead-labels vailable, this is temporary (crm-labels)
const { data: crmLabelsList, status, refresh } = await useLazyAsyncData('crm-labels', () =>
  useApi().get('/crm-labels', {
  }), {
  transform: res => res,
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
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

// Then paginate the filtered data
const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return filteredLabel.value.slice(start, end)
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  pageStart.value = 0
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

async function handleReorder(updatedList: any[]) {
  try {
    await Promise.all(
      updatedList.map((item, index) =>
        updateCrmLabel(item.id, {
          title: item.title,
          order: index + 1,
          edit_mode: true,
        }),
      ),
    )
    await refresh()
  }
  catch {
    showToast({
      message: 'Failed to update label order',
      type: 'error',
    })
  }
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
    <div class="w-full h-[calc(100vh-145px)] overflow-y-auto">
      <LeadManagementLabelTable :limit="limit" :total-rows="filteredLabel.length" :start="pageStart" :list="paginatedList || []" :loading="status === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refresh" @edit="openEditDialog" />
    </div>
    <LeadManagementLabelDisplayOrder
      :label-list="crmLabelsList?.data"
      :loading="status === 'pending'"
      class="hidden lg:block"
      @update-order="handleReorder"
    />
  </div>
</template>
