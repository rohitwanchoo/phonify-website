<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
</script>

<template>
  <BaseHeader title="Email">
    <template #actions>
      <BaseInputSearch placeholder="Search here..." />
      <Button class="h-11">
        <Icon name="material-symbols:mail-outline" />
        New Email
      </Button>
    </template>
  </BaseHeader>
  <div>
    <EmailResizablePanel />
  </div>
</template>
