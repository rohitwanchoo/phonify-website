<script setup lang="ts">
import { Input } from '~/components/ui/input'
</script>

<template>
  <BaseHeader title="IP Approval List">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <ConfigurationIpSettingsFilterSheetButton />
      <ConfigurationIpSettingsWhiteListIpDialog />
    </template>
  </BaseHeader>

  <!-- TABLE -->
  <div>
    <ConfigurationIpSettingsTable />
  </div>
</template>
