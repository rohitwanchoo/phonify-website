<script setup lang="ts">
import { useLazyAsyncData } from '#app'
import { Input } from '~/components/ui/input'

const { data: voipData, status, refresh } = await useLazyAsyncData('voip-configurations', () =>
  useApi().get('/voip-configurations'), // GET request
{
  transform: res => res.data, // only extract the "data" array
})
</script>

<template>
  <BaseHeader title="VoIP Configuration">
    <template #actions>
      <BaseInputSearch class="w-[300px]" placeholder="search" />
      <ConfigurationVoipConfigurationCreate />
    </template>
  </BaseHeader>

  <div>
    <ConfigurationVoipConfigurationTable :list="voipData || []" :loading="status === 'pending'" />
  </div>
</template>
