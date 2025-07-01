<script setup lang="ts">
import { useLazyAsyncData } from '#app'
import { Input } from '~/components/ui/input'

const { data: voipData, pending, refresh } = await useLazyAsyncData('voip-configurations', () =>
  useApi().get('/voip-configurations'), // GET request
{
  transform: res => res.data, // only extract the "data" array
})
</script>

<template>
  <BaseHeader title="VoIP Configuration">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search Config." />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <ConfigurationVoipConfigurationAddButton />
    </template>
  </BaseHeader>

  <div>
    <ConfigurationVoipConfigurationTable :list="voipData || []" :loading="pending" />
  </div>
</template>
