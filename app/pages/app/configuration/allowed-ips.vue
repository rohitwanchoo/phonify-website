<script setup lang="ts">
import { Input } from '~/components/ui/input'

const showDialog = ref(false)

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const { data: allowedIps, status: allowedIpsStatus, refresh: allowedIpsRefresh } = await useLazyAsyncData('allowed-ips', () =>
  useApi().get('/allowed-ips'), {
  transform: res => res,
})

const searchFilteredAllowedIps = computed(() => {
  if (!allowedIps.value)
    return []
  const query = searchQuery.value.toLowerCase()
  return allowedIps.value.data.filter((item: any) => {
    return (
      item?.ip_address?.toLowerCase().includes(query)
      || item?.label?.toLowerCase().includes(query)
    )
  })
})

const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return searchFilteredAllowedIps.value.slice(start, end)
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  pageStart.value = 0
})

const selectedAllowedIp = ref<null | {
  id: number
  ip_address: string
  label: string
  is_primary: string
  status: string
  created_at: string
  updated_at: string
}>(null)

function openEditDialog(allowedIp: any) {
  selectedAllowedIp.value = allowedIp
  showDialog.value = true
}

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Allowed IPs">
      <template #actions>
        <div class="relative">
          <Input v-model="searchQuery" placeholder="Search List" class="pr-8" />
          <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
        </div>
        <ConfigurationAllowedIpsAdd />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationAllowedIpsTable 
      :limit="limit" 
      :total-rows="searchFilteredAllowedIps.length" 
      :start="pageStart" 
      :list="paginatedList || []" 
      :loading="allowedIpsStatus === 'pending'" 
      @page-navigation="changePage" 
      @change-limit="changeLimit" 
      @refresh="allowedIpsRefresh" 
      @edit="openEditDialog" 
      />
    </div>
  </div>
</template>
