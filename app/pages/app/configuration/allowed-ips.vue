<script setup lang="ts">
import { Input } from '~/components/ui/input'

const showDialog = ref(false)

const start = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const { data: allowedIps, status: allowedIpsStatus, refresh: allowedIpsRefresh } = await useLazyAsyncData('allowed-ips', () =>
  useApi().get('/allowed-ips', {
    params: {
      start: start.value,
      limit: limit.value,
    },
  }), {
  transform: res => res.data,
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  start.value = 0
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
  start.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  start.value = 0
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Allowed IPs">
      <template #actions>
        <BaseInputSearch v-model="searchQuery" class="w-[300px]" placeholder="Search Allowed IPs" />
        <ConfigurationAllowedIpsAdd />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationAllowedIpsTable
        :limit="limit"
        :total-rows="allowedIps?.length"
        :start="start"
        :list="allowedIps || []"
        :loading="allowedIpsStatus === 'pending'"
        @page-navigation="changePage"
        @change-limit="changeLimit"
        @refresh="allowedIpsRefresh"
        @edit="openEditDialog"
      />
    </div>
  </div>
</template>
