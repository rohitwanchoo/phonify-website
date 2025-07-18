<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const tempGroup = ref<any>({})
</script>

<template>
  <div>
    <BaseHeader title="Chat SMS">
      <template #actions>
        <SmsChatSheet v-model:form-values="filterValues" class="bg-black text-white" @apply-filter="applyFilter" />
      </template>
    </BaseHeader>

    <div>
      <SmsChatTable />
    </div>
  </div>
</template>
