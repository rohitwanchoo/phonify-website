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

const perPage = 10
const currentPage = ref(1)

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

const { data: callTimingList, status, pending } = await useLazyAsyncData('/get-call-timings', () =>
  useApi().post('/get-call-timings', {}), {
  transform: (res) => {
    return res.data
  },
})

const meta = ref<Meta>({
  current_page: currentPage.value,
  per_page: perPage,
  last_page: 1,
  total: 0,
})

// Watch for callTimingList changes to update meta
watchEffect(() => {
  if (callTimingList.value) {
    const total = callTimingList.value.length
    meta.value = {
      current_page: currentPage.value,
      per_page: perPage,
      last_page: Math.ceil(total / perPage),
      total,
    }
  }
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
