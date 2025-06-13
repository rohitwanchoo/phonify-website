<script setup lang="ts">
import { Icon } from '#components'
import LeadManagementListsDialog from '@/components/lead-management/lists/Dialog.vue'
import { Input } from '~/components/ui/input'
</script>

<template>
  <BaseHeader title="Lists">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <LeadManagementListsDialog />
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <LeadManagementListsTable />
  </div>
</template>
