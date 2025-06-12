<script setup>
import Input from '~/components/ui/input/Input.vue'
</script>

<template>
  <BaseHeader title="Labels">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <LeadManagementLabelAddLabel />
    </template>
  </BaseHeader>

  <div class="flex gap-4 justify-between">
    <LeadManagementLabelTable />
    <LeadManagementLabelDisplayOrder />
  </div>
</template>
