<script setup lang="ts">

</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Reports">
      <template #actions>
      

        <!-- Trigger Button -->
       <ReportCallDataFilterSheet class="bg-black text-white" v-model:form-values="filterValues" @apply-filter="applyFilter" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportIvrLogsTable />
    </div>
  </div>
</template>
