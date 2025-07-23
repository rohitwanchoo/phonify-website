<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="IVR Logs Call Reports">
      <template #actions>
      

        <!-- Trigger Button -->
       <ReportIvrLogsFilterSheet class="bg-black text-white" v-model:form-values="filterValues" @apply-filter="applyFilter" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportIvrLogsTable />
    </div>
  </div>
</template>
