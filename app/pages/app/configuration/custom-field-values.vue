<script setup lang="ts">
import { Button } from '~/components/ui/button/'
import { Input } from '~/components/ui/input'

const { data: customFieldList, status, refresh } = await useLazyAsyncData('custom-field-list', async () => {
  const response = await useApi().get('/custom-field-labels-values', {
    params: {
      start: 0,
      limit: 10,
    },
  })
  return response
})

// Dialog state management
const addDialogOpen = ref(false)
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
        <!-- Add Button triggering the dialog -->
        <Button @click="addDialogOpen = true">
          <Icon class="!text-white" name="lucide:plus" />
          Add Custom Field Value
        </Button>
        <!-- Combined Dialog Component -->
        <ConfigurationCustomFieldValuesDialog
          v-model:open="addDialogOpen"
          :refresh="refresh"
          @update:open="addDialogOpen = $event"
        />
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
