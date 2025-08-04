<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const pageStart = ref(0)
const limit = ref(10)

const { data: extensionList, status, refresh } = await useLazyAsyncData('extension-list', () =>
  useApi().get('extension', {
    params: {
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
  <!-- {{ extensionList }} -->

  <div class="">
    <BaseHeader title="Extension List">
      <template #actions>
        <div class="relative w-full md:w-auto ">
          <BaseInputSearch></BaseInputSearch>
          <!-- <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" /> -->
        </div>
        <Button variant="outline" class="text-black bg-white h-11" @click="toastTest">
          <Icon class="!text-black" name="lucide:download" />
          Excel
        </Button>
        <NuxtLink to="/app/user-management/extension/create">
          <Button class="h-11">
            <Icon class="!text-white" name="lucide:plus" />
            Add Extensions
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>

    <UserManagementExtensionTable :limit="limit" :total-rows="extensionList?.total_rows" :start="pageStart" :list="extensionList?.data || []" :loading="status === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refresh" />
  </div>
</template>
