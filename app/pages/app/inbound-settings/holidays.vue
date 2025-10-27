<script setup lang="ts">
import { ref } from 'vue'

const start = ref(0)
const limit = ref(10)

const open = ref(false)
const tempHoliday = ref<any>()
const isEdit = ref(false)

const { data: holidayList, status: holidayStatus, refresh: refreshHolidayList } = await useLazyAsyncData('did-get-all-holidays', () =>
  useApi().post('/get-all-holidays', {
    start: start.value,
    limit: limit.value,
  }), {
  transform: res => res.data,
})

function openEditModel(item: any) {
  tempHoliday.value = item
  isEdit.value = true
  open.value = true
}
function onModelUpdate(val: boolean) {
  if (!val) {
    isEdit.value = false
  }
}

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshHolidayList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshHolidayList()
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Holidays">
      <template #actions>
        <InboundSettingsHolidaysAdd v-model:open="open" :initial-data="tempHoliday" :is-edit="isEdit" @update:open="onModelUpdate" @complete="refreshHolidayList" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsHolidaysTable
        :start="start"
        :limit="limit"
        :total-rows="holidayList?.length || 0"
        :list="holidayList || []"
        :loading="holidayStatus === 'pending'"
        @page-navigation="changePage"
        @change-limit="changeLimit"
        @refresh="refreshHolidayList"
        @edit="openEditModel"
      />
    </div>
  </div>
</template>
