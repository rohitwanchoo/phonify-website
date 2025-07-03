<script setup lang="ts">
import moment from 'moment'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import ConfirmAction from '@/components/ConfirmAction.vue'

const campaignList = ref<any>(null)
const loading = ref(false)

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const router = useRouter()

// Original API call remains exactly as you provided
const { data, success, message } = await useLazyAsyncData('campaigns-list', async () => {
  const response = await useApi().post('api-data', {
    params: {
    },
  })
  return response
})

watch(data, (newData) => {
  if (newData) {
    campaignList.value = newData
  }
}, { immediate: true })

// Client-side filtering based on API data
const filteredList = computed(() => {
  if (!campaignList.value?.data)
    return []
  const query = searchQuery.value.toLowerCase()
  return campaignList.value.data.filter((item: any) =>
    item.title?.toLowerCase().includes(query)
    || item.campaign?.toLowerCase().includes(query)
    || item.method?.toLowerCase().includes(query)
    || (item.is_deleted === '0' ? 'inactive' : 'active').includes(query),
  )
})

// Client-side pagination
const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return filteredList.value.slice(start, end)
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}

watch(searchQuery, () => {
  pageStart.value = 0
})

const totalRows = computed(() => filteredList.value.length)
const currentPage = computed(() => Math.floor(pageStart.value / limit.value) + 1)
const lastPage = computed(() => Math.ceil(totalRows.value / limit.value))

const showDeleteConfirm = ref(false)
const selectedApiIdForDelete = ref<number | null>(null)
const selectedApiIdForDuplicate = ref<number | null>(null)

function handleDeleteClick(row: any) {
  selectedApiIdForDelete.value = row.id
  showDeleteConfirm.value = true
}

function handleDuplicateClick(row: any) {
  selectedApiIdForDuplicate.value = row.id
  // Call the duplicate API
  useApi().post('copy-api', {
    api_id: selectedApiIdForDuplicate.value,
  }).then((res: any) => {
    if (res.success) {
      showToast({
        message: `${res.message} (New List ID: ${res.list_id})`,
        type: 'success',
      })
      refreshNuxtData('campaigns-list')
    } else {
      showToast({
        message: res.message || 'Failed to duplicate API.',
        type: 'error',
      })
    }
  }).catch((err: any) => {
    showToast({
      message: err.message || 'Failed to duplicate API.',
      type: 'error',
    })
  })
}

// Add this function
function handleEditClick(row: any) {
  router.push({ path: '/app/configuration/api/create', query: { id: row.id } })

}

async function handleDeleteConfirm() {
  try {
    const res = await useApi().post('delete-api', {
      api_id: selectedApiIdForDelete.value,
    })
    if (res.success) {
      showToast({
        message: res.message,
        type: 'success',
      })
      refreshNuxtData('campaigns-list')
    } else {
      showToast({
        message: res.message || 'Failed to delete API.',
        type: 'error',
      })
    }
  } catch (err: any) {
    showToast({
      message: err.message || 'Failed to delete API.',
      type: 'error',
    })
  } finally {
    showDeleteConfirm.value = false
    selectedApiIdForDelete.value = null
  }
}

function handleDeleteCancel() {
  showDeleteConfirm.value = false
  selectedApiIdForDelete.value = null
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="API">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search API" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button @click="router.push('/app/configuration/api/create')">
          <Icon class="!text-white" name="lucide:plus" />
          Add API
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationApiTable
        :list="paginatedList"
        :loading="!campaignList"
        @delete-row="handleDeleteClick"
        @duplicate-row="handleDuplicateClick"
        @edit-row="handleEditClick"
      />
    </div>
    <div v-if="totalRows" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
      <div class="flex-1 text-xs text-primary">
        <div class="flex items-center gap-x-2 justify-center sm:justify-start">
          Showing {{ currentPage }} to
          <span>
            <select v-model="limit" class="border rounded px-2 py-1 text-xs" @change="changeLimit(Number($event.target.value))">
              <option v-for="n in [10, 15, 20, 50]" :key="n" :value="n">{{ n }}</option>
            </select>
          </span>
          of {{ totalRows }} entries
        </div>
      </div>
      <div class="space-x-2">
        <TableServerPagination
          :total-items="Number(totalRows)"
          :current-page="Number(currentPage)"
          :items-per-page="Number(limit)"
          :last-page="Number(lastPage)"
          @page-change="changePage"
        />
      </div>
    </div>

    <ConfirmAction
      v-model="showDeleteConfirm"
      :confirm="handleDeleteConfirm"
      :cancel="handleDeleteCancel"
      title="Delete API"
      description="You are about to delete this API. Do you wish to proceed?"
    />
  </div>
</template>
