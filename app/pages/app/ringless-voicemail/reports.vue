<script setup lang="ts">
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title=" Ringless Call Report">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <RinglessVoicemailReportsFilterSheet v-model:form-values="filterValues" class="bg-black text-white" @apply-filter="applyFilter" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <RinglessVoicemailReportsTable />
    </div>
  </div>
</template>
