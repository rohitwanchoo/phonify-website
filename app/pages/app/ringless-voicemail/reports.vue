<script setup lang="ts">
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title=" Ringless Call Report">
      <template #actions>
        <BaseInputSearch class="w-[300px]" />
        <RinglessVoicemailReportsFilterSheet v-model:form-values="filterValues" class="bg-black text-white" @apply-filter="applyFilter" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <RinglessVoicemailReportsTable />
    </div>
  </div>
</template>
