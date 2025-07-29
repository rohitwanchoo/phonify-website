<script setup lang="ts">
const start = ref(0)
const limit = ref(10)

const { data: audioList, status, refresh } = await useLazyAsyncData('get-audio-list', () =>
  useApi().get('/audio-message', {
    params: {
      start: start.value,
      limit: limit.value,
    },

  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
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
    <BaseHeader title="Audio Messages" />

    <!-- TABLE -->
    <div>
      <InboundSettingsAudioMessagesTable :total-rows="audioList?.total_rows" :start :limit :list="audioList?.data" :loading="status === 'pending'" @refresh="refresh" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>
