<script setup lang="ts">
import ConfigurationSmtpSettingsTable from '@/components/configuration/smtp-settings/table/index.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { data: smtpList, status: smtpStatus, refresh } = await useLazyAsyncData('smtp-list', () =>
  useApi().get('/smtps', {
    params: { start: 0, limit: 10 },
  }), {
  transform: (res) => {
    return res.data
  },
})

function updateStatus(val: { row: { id: number }, value: boolean }) {
  const { row, value } = val
  const payload = {
    id: row.id,
    status: value ? 1 : 0,
  }
  useApi().post('/status-update-smtp', payload).then((response) => {
    showToast({ message: response.message })
  }).catch((error) => {
    showToast({ type: 'error', message: error.message })
  })
}

const loading = computed(() => smtpStatus.value === 'pending')
</script>

<template>
  <div>
    <BaseHeader title="SMTP">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <NuxtLink to="/app/configuration/smtp-settings/add-smtp?mode=add">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Add SMTP
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>

    <!-- Table -->
    <ConfigurationSmtpSettingsTable
      :list="smtpList"
      :loading="loading"
      @update-status="updateStatus"
      @refresh="refresh"
    />
  </div>
</template>
