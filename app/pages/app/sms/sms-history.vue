<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="SMS History">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button>
          <Icon class="!text-white" name="lucide:upload" />
          Export
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <SmsHistoryTable />
    </div>
  </div>
</template>
