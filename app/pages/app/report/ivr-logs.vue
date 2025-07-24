<script setup lang="ts">

</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="IVR Logs Call Reports">
      <template #actions>
        <!-- Trigger Button -->
        <ReportIvrLogsFilterSheet class="bg-black text-white" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportIvrLogsTable />
    </div>
  </div>
</template>
