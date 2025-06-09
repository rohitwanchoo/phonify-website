<script setup lang="ts">
import { Input } from '~/components/ui/input'

export interface callTimingList {
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

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 20,
}

const pageStart = ref(0)
const limit = ref(10)

const { data: callTimingList, status, refresh } = await useLazyAsyncData('get-call-timings', () =>
  useApi().post('/get-call-timings', {
    body: {
      start: pageStart.value,
      limit: limit.value,
    },
  }), {
  transform: (res) => {
    return res
  },
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
  return refresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refresh()
}
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
      <CallTimesTable :limit="limit" :total-rows="callTimingList?.total_rows" :start="pageStart" :list="callTimingList?.data || []" :loading="status === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>
