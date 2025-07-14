<script setup lang="ts">
import { Input } from '~/components/ui/input'

const { data: customFieldList, status, refresh } = await useLazyAsyncData('custom-field-list', async () => {
  const response = await useApi().get('custom-field-labels-values', {
  })
  return response
})
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Custom Field Values">
      <template #actions>
        <div class="relative mt-2 md:mt-0">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <ConfigurationCustomFieldValuesAddDialog :refresh="refresh" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationCustomFieldValuesTable
        :list="customFieldList?.data"
        :loading="status === 'pending'"
        :refresh="refresh"
      />
    </div>
  </div>
</template>
