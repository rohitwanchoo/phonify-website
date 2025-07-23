<script setup lang="ts">
import { ref } from 'vue'

const filterValues = ref({})
function applyFilter() {}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Login History">
      <template #actions>
        <div class="flex items-center gap-4">
          <!-- Existing Filter Sheet -->
          <ReportLoginHistoryFilterSheet
            v-model:form-values="filterValues"
            class="bg-black text-white"
            @apply-filter="applyFilter"
          />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportLoginHistoryTable />
    </div>
  </div>
</template>
