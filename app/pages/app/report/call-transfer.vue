<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Transfer">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>

        <!-- Trigger Button -->
        <Button>
            <Icon name="material-symbols:add" class="text-xl text-white" />
          Add Ring Group
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportCallTransferTable />
    </div>
  </div>
</template>
