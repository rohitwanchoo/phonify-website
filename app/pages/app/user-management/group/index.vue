<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Extension Group">
      <template #actions>
        <UserManagementGroupAdd />
        <!-- <Button>
          <Icon class="!text-white" name="lucide:plus" />
          Add Group
        </Button> -->
      </template>
    </BaseHeader>

    <div class="">
      <UserManagementGroupResizablePanels />
    </div>
  </div>
</template>
