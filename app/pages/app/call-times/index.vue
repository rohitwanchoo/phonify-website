<script setup lang="ts">
import { Input } from '~/components/ui/input'

export interface CallTiming {
  id: number
  day: string
  from_time: string
  to_time: string
  department_id: number
  name: string
  description: string
  calltimeStatus: boolean
  actions?: string
}

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}
const meta = ref<Meta>({
  current_page: 1,
  per_page: 10,
  last_page: 10,
  total: 50,
})

const { data: callTimingList, status, pending } = await useLazyAsyncData('/get-call-timings', () =>
  useApi().post('/get-call-timings', {}), {
  transform: (res) => {
    return res.data
  },
})

// Create a reactive reference for the list
const data = ref<CallTiming[]>([])

// Sync API result to data ref
watchEffect(() => {
  if (callTimingList.value) {
    data.value = callTimingList.value
  }
})
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Times">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <div>
          <CallTimesCreate />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CallTimesTable :list="data" :meta="meta" :loading="pending" />
    </div>
  </div>
</template>
