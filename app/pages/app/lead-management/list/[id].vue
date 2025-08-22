<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button'

const route = useRoute()
const id = computed(() => route.params.id)

const breadcrumbs = [
  {
    label: 'List',
    href: '/app/lead-management/list',
  },
  {
    label: 'Leads',
    active: true,
  },
]

const name = computed(() => route.query.name?.toString())

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: listLeads, status: listLeadsStatus, refresh: leadsRefresh } = await useLazyAsyncData(
  'list-view-leads',
  () =>
    useApi().post(`/list-data/${id.value}/content?lower_limit=${start.value}&upper_limit=${limit.value}&search=${search.value}`),
  {
    transform: (res) => res.data
  },
)

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return leadsRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return leadsRefresh()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  leadsRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

const downloadLoading = ref(false)

function downloadData() {
  downloadLoading.value = true
  useApi().get(`/list-data/${id.value}/content?excel=true`).then((response) => {
    exportToCSV({ name: response.data.list_name, header: response.data.list_header, data: response.data.list_data })
  }).finally(() => {
    downloadLoading.value = false
  })
}
</script>

<template>
  <BaseHeader :title="name" :breadcrumbs>
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" @update:model-value="searchText" />
      <Button class="h-11" @click="downloadData">
        <Icon class="!text-white" size="20" :name="downloadLoading ? 'eos-icons:loading' : 'material-symbols:download'" />
        Download
      </Button>
    </template>
  </BaseHeader>
  <LeadManagementListsLeadsTable :list="listLeads?.list_data || []" :limit :start :total-rows="listLeads?.total_records" :list-header="listLeads?.list_header" :loading="listLeadsStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" />
</template>
