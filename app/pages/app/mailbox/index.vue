<script setup lang="ts">
import { ref } from 'vue'

const filterValues = ref({})
function applyFilter() {}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Mail Box Report">
      <template #actions>
        <div class="flex items-center gap-4">
          <!-- Existing Filter Sheet -->
          <MailBoxFilterSheet
            v-model:form-values="filterValues"
            class="bg-black text-white"
            @apply-filter="applyFilter"
          />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <MailBoxTable />
    </div>
  </div>
</template>
