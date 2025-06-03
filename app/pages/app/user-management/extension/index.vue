<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 20,
}

const { data: extensionList, status } = await useLazyAsyncData('extension-list', () =>
  useApi().get('extension', {
    params: {
      page: 1,
      limit: 10,
    },
  }), {
  transform: (res) => {
    return res.data
  },
})

function toastTest() {
  showToast({ type: 'warning', message: 'Test' })
}
</script>

<template>
  <!-- {{ extensionList }} -->

  <div class="">
    <BaseHeader title="Extension List">
      <template #actions>
        <div class="relative w-full md:w-auto ">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button variant="outline" class="text-black bg-white" @click="toastTest">
          <Icon class="!text-black" name="lucide:download" />
          Excel
        </Button>
        <NuxtLink to="/app/user-management/extension/create">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Add Extensions
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>

    <UserManagementExtensionTable :list="extensionList || []" :meta="meta" :loading="status === 'pending'" />
  </div>
</template>
