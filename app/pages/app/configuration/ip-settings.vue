<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <BaseHeader title="IP Approval List">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <Button variant="outline" class="!text-primary" @click="open = true">
        <Icon name="material-symbols:sort" class="!text-primary" />
        Filter
      </Button>
      <Button>
        <Icon class="!text-white" name="material-symbols:language" />
        Whitelist IP
      </Button>
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <ConfigurationIpSettingsTable />
  </div>
</template>
