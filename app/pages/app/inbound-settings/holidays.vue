<script setup lang="ts">
import { Icon, InboundSettingsHolidaysTable } from '#components'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const isDialogOpen = ref(false)
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Holidays">
      <template #actions>

        <!-- Dialog Trigger Button -->
        <Button @click="isDialogOpen = true">
          <Icon class="!text-white" name="lucide:plus" />
          Add Holiday
        </Button>

        <!-- Dialog Component -->
        <InboundSettingsHolidaysDialog v-model:open="isDialogOpen" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsHolidaysTable />
    </div>
  </div>
</template>
