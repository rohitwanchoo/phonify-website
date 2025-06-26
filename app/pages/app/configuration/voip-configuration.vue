<script setup lang="ts">
import { Input } from '~/components/ui/input'
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
    <ConfigurationVoipConfigurationTable />
  </div>
</template>
