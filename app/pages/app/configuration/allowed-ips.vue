<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Allowed IPs">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <ConfigurationAllowedIpsAddDialog />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationAllowedIpsTable />
    </div>
  </div>
</template>
