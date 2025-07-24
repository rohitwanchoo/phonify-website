<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
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
      <InboundSettingsDidConfigurationTable />
    </div>
  </div>
</template>
