<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@/components/ui/switch'

const { user } = useAuth()

const enableCallbackReminder = ref<boolean>()
const showSheet = ref(false)
const activeFilters = ref<Record<string, any>>({})

const start = ref(0)
const limit = ref(10)

const { data: callbackData, status: callbackStatus, refresh: callbackRefresh } = await useLazyAsyncData('callback', () =>
  useApi().post('/callback', {
    ...activeFilters.value,
    lower_limit: start.value,
    upper_limit: limit.value,
    id: user.value?.id,
    reminder: enableCallbackReminder.value,
  }), {
  transform: res => res,
})

// Watch for changes in API data and update the reminder state
watch(callbackData, (newData) => {
  if (newData && typeof newData.reminder !== 'undefined') {
    enableCallbackReminder.value = newData.reminder
  }
}, { immediate: true })

// Watch for changes in the switch and refresh data when toggled
watch(enableCallbackReminder, async (newValue) => {
  activeFilters.value.reminder = newValue
  await callbackRefresh()
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return callbackRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return callbackRefresh()
}

// Handle filter application
async function handleApplyFilter(filterParams: Record<string, any>) {
  activeFilters.value = filterParams
  start.value = 0 // Reset pagination
  await callbackRefresh() // Refresh data with new filters
}

// Handle filter clearing
async function handleClearFilter() {
  activeFilters.value = {}
  start.value = 0 // Reset pagination
  await callbackRefresh() // Refresh data without filters
}
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
              class="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 cursor-pointer"
            />
          </div>

          <!-- Existing Filter Sheet -->
          <ReportCallBackFilterSheet
            v-model:open="showSheet"
            @apply-filter="handleApplyFilter"
            @clear-filter="handleClearFilter"
          />
        </div>
      </template>
    </BaseHeader>
    <!-- TABLE -->
    <div>
      <ReportCallBackTable
        :limit="limit"
        :total-rows="callbackData?.record_count"
        :start="start"
        :list="callbackData?.data || []"
        :loading="callbackStatus === 'pending'"
        @page-navigation="changePage"
        @change-limit="changeLimit"
      />
    </div>
  </div>
</template>
