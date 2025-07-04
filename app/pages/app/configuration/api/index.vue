<script setup lang="ts">
import moment from 'moment'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfigurationApiTable from '@/components/configuration/api/table/index.vue'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

// Dummy data for testing
const dummyLeads = [
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'GET',
    status: 'Active',
    api_template: 'Yes',
    date_created: '28/04/2025 02:45 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'POST',
    status: 'Active',
    api_template: 'No',
    date_created: '29/04/2025 09:10 AM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 3',
    url: 'https://phonify.com/site/demo',
    method: 'PUT',
    status: 'Inactive',
    api_template: 'Yes',
    date_created: '30/04/2025 11:30 AM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 2',
    url: 'https://phonify.com/site/demo',
    method: 'DELETE',
    status: 'Active',
    api_template: 'No',
    date_created: '01/05/2025 04:05 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'GET',
    status: 'Active',
    api_template: 'Yes',
    date_created: '02/05/2025 08:20 AM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 3',
    url: 'https://phonify.com/site/demo',
    method: 'POST',
    status: 'Inactive',
    api_template: 'No',
    date_created: '03/05/2025 06:55 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 2',
    url: 'https://phonify.com/site/demo',
    method: 'GET',
    status: 'Active',
    api_template: 'Yes',
    date_created: '04/05/2025 12:00 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'POST',
    status: 'Active',
    api_template: 'No',
    date_created: '05/05/2025 10:40 AM',
  },
]

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 4,
}

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const router = useRouter()

// Pagination and filtering logic
const filteredList = computed(() => {
  if (!dummyLeads)
    return []
  const query = searchQuery.value.toLowerCase()
  return dummyLeads.filter(item =>
    item.api_name?.toLowerCase().includes(query)
    || item.campaign_name?.toLowerCase().includes(query)
    || item.method?.toLowerCase().includes(query)
    || item.status?.toLowerCase().includes(query),
  )
})

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
        <Button @click="router.push('/app/configuration/api/api-list?mode=add')">
          <Icon class="!text-white" name="lucide:plus" />
          Add API
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationApiTable
        :list="paginatedList"
        :meta="meta"
        :loading="false"
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
  </div>
</template>
