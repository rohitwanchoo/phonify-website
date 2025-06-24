<script setup lang="ts">
import { Icon } from '#components'
import { ref } from 'vue'
import AddDialog from '@/components/lead-management/recycle-rule/AddDialog.vue'
import FilterSheet from '@/components/lead-management/recycle-rule/FilterSheet.vue'
import { Input } from '~/components/ui/input'

const showDialog = ref(false)
const showSheet = ref(false)
</script>

<template>
  <!-- HEADER -->
  <BaseHeader title="Recycle Rules">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <FilterSheet v-model:open="showSheet" />
      <AddDialog v-model:open="showDialog" />
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <LeadManagementRecycleRuleTable />
  </div>
</template>
