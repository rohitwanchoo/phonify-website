<script setup lang="ts">
import ConfigurationSmtpSettingsTable from '@/components/configuration/smtp-settings/table/index.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { data: smtpList, status: smtpStatus } = await useLazyAsyncData('smtp-list', () =>
  useApi().get('/smtps', {

  }), {
  transform: (res) => {
    return res.data
  },
})

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
    />
  </div>
</template>
