<script setup lang="ts">
const props = defineProps({
  payload: Object,
})

// list live calls
const { data: liveCallList, status: liveCallStatus } = await useLazyAsyncData('get-live-call-list', () =>
  useApi().post('/live-call', props.payload), {
  transform: res => res.data,
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-7 gap-6">
    <div class="col-span-6 lg:col-span-5">
      <dashboardTableCallCount />
    </div>
    <div class="col-span-6 lg:col-span-2 w-full">
      <dashboardTableLiveCall :list="liveCallList" :loading="liveCallStatus === 'pending'" />
    </div>
  </div>
</template>
