<script setup lang="ts">
import { Input } from '~/components/ui/input'

const filter = ref({

})
const start = ref(0)
const limit = ref(10)

await useLazyAsyncData('server-option-list', () =>
  useApi().get('/servers/client-servers '), {
  transform: res => res.data,
})

const { data: ipSettingList, refresh: refreshIpSettingList, status: ipSettingStatus } = await useLazyAsyncData('ip-setting-list', () =>
  useApi().post('/ip/query-ip-whitelist', {
    start: start.value,
    limit: limit.value,
    ...filter.value,
  }), {
  transform: res => res || [],
})

const filterValues = ref({})

async function applyFilter() {
  if (Object.keys(filterValues.value).length) {
    Object.entries(filterValues.value).forEach(([key, value]) => {
      if (value !== null)
        filter.value[key] = value
    })
    refreshIpSettingList()
  }
}

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshIpSettingList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshIpSettingList()
}

function clearFilter() {
  filterValues.value = {}
  filter.value = {}
  refreshIpSettingList()
}
</script>

<template>
  <BaseHeader title="IP Approval List">
    <template #actions>
      <BaseInputSearch class="w-[300px]" placeholder="search" />
      <ConfigurationIpSettingsFilterSheet v-model:form-values="filterValues" @apply-filter="applyFilter" @clear-filter="clearFilter" />
      <ConfigurationIpSettingsWhiteListIpDialog @refresh="refreshIpSettingList()" />
    </template>
  </BaseHeader>

  <!-- TABLE -->
  <div>
    <ConfigurationIpSettingsTable :limit :start :list="ipSettingList?.data || []" :total-rows="ipSettingList?.total" :loading="ipSettingStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refresh" />
  </div>
</template>
