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
    <!-- Header -->
    <BaseHeader title="SMTP">
      <template #actions>
        <BaseInputSearch />
        <Nuxt-Link to="/app/configuration/smtp-settings/add-smtp?mode=add">
          <Button class="h-11">
            <Icon class="!text-white" name="lucide:plus" />
            Add SMTP
          </Button>
        </Nuxt-Link>
      </template>
    </BaseHeader>

    <!-- Table -->
    <ConfigurationSmtpSettingsTable
      :list="smtpList"
      :loading="loading"
    />
  </div>
</template>
