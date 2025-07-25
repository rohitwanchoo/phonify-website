<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const start = ref(0)
const limit = ref(10)

const { data: didList, status, refresh } = await useLazyAsyncData('did-configuration-list', () =>
  useApi().post('/did', {
    // TODO: Dummy pagination
    start: start.value,
    limit: limit.value,
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
    <BaseHeader title="DID Configuration">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>

        <!-- Trigger Button -->
        <Button>
          Action
          <Icon name="material-symbols:arrow-drop-down" class="text-xl text-white" />
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsDidConfigurationTable :loading="status === 'pending'" :total-rows="didList?.total_rows " :start :limit :list="didList?.data" @refresh="refresh" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>
