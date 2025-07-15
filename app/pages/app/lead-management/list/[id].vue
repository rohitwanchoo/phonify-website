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
const excel = ref(false)
const search = ref('')

const { data: listLeads, status, refresh: leadsRefresh } = await useLazyAsyncData(
  'list-view-leads',
  () =>
    useApi().post(`/list-data/${id.value}/content?lower_limit=${start.value}&upper_limit=${limit.value}&search=${search.value}`),
  {
    transform: (res) => {
      const data = res.data.list_data.map((entry: Record<string, any>) => {
        const obj: Record<string, any> = {}
        res.data.list_header.forEach((key: string, index: number) => {
          obj[key] = entry[`option_${index + 1}`] ?? null
        })
        return obj
      })

      return { data, total_records: res.data.total_records, list_header: res.data.list_header }
    },
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
</script>

<template>
  <BaseHeader :title="name" :breadcrumbs>
    <template #actions>
      <BaseInputSearch v-model="search" class="w-[300px]" @update:model-value="searchText" />
      <Nuxt-link to="/app/campaign/new-campaign">
        <Button class="h-11">
          <Icon class="!text-white" name="lucide:download" />
          Download
        </Button>
      </Nuxt-link>
    </template>
  </BaseHeader>

  <LeadManagementListsLeadsTable :list="listLeads?.data || []" :limit :start :total-rows="listLeads?.total_records" :list-header="listLeads?.list_header" :loading="status === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" />
</template>
