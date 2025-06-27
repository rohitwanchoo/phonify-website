<script setup lang="ts">
import { Button } from '~/components/ui/button'
</script>

<template>
  <BaseHeader title="IP Approval List">
    <template #actions>
      <Button variant="outline" class="!text-primary" @click="open = true">
        <Icon name="material-symbols:sort" class="!text-primary" />
        Filter
      </Button>
      <Button>
        <Icon class="!text-white" name="material-symbols:language" />
        Whitelist IP
      </Button>
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    table here
  </div>
</template>
