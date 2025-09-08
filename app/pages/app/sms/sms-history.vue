<script setup lang="ts">
import { Button } from '~/components/ui/button'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="SMS History">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
        <Button class="h-11">
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
