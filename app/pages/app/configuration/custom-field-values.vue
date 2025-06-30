<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Custom Field Values">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <ConfigurationCustomFieldValuesAddDialog />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationCustomFieldValuesTable />
    </div>
  </div>
</template>
