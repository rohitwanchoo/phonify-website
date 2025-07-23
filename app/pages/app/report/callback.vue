<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@/components/ui/switch'

const enableCallbackReminder = ref(false)
const filterValues = ref({})
function applyFilter() {}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Callback">
      <template #actions>
        <div class="flex items-center gap-4">
          <!-- Callback Reminder Switch with custom colors -->
          <div class="flex items-center gap-3 px-[16px] py-[12px] rounded-lg bg-[#00A0860D]">
            <label for="callback-reminder" class="text-xs font-medium leading-none text-[#162D3A]">
              Enable callback reminder alert
            </label>
            <Switch
              id="callback-reminder"
              v-model="enableCallbackReminder"
              class="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
            />
          </div>

          <!-- Existing Filter Sheet -->
          <ReportCallBackFilterSheet
            v-model:form-values="filterValues"
            class="bg-black text-white"
            @apply-filter="applyFilter"
          />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportCallBackTable />
    </div>
  </div>
</template>
