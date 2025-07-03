<script setup lang="ts">
import { Input } from '~/components/ui/input'

const filter = ref({

})

const { data: ipSettingList, refresh: refreshIpSettingList, status: ipSettingStatus } = await useLazyAsyncData('ip-setting-list', () =>
  useApi().get('/ip/query-ip-whitelist', {
    params: {
      ...filter.value,
    },
  }), {
  transform: res => res.data.slice(0, 10) || [],
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
</script>

<template>
  <BaseHeader title="IP Approval List">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <ConfigurationIpSettingsFilterSheet v-model:form-values="filterValues" @apply-filter="applyFilter" />
      <ConfigurationIpSettingsWhiteListIpDialog />
    </template>
  </BaseHeader>

  <!-- TABLE -->
  <div>
    <ConfigurationIpSettingsTable :list="ipSettingList || []" :loading="ipSettingStatus === 'pending'" />
  </div>
</template>
