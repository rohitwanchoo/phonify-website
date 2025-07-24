<script setup lang="ts">
import { Input } from '~/components/ui/input'
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Caller ID Name Reports">
      <template #actions>
      
<div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <!-- Trigger Button -->
       <ReportCallerIdNameManualCallSheet class="bg-black text-white" v-model:form-values="filterValues" @apply-filter="applyFilter" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportCallerIdNameTable />
    </div>
  </div>
</template>
