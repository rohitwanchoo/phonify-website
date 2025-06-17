<script setup>
import Button from '~/components/ui/button/Button.vue'
</script>

<template>
  <div class="p-4 border border-[#E4E4E7CC] rounded-2xl bg-primary">
    <div class="flex gap-4 justify-between items-center pb-2 border-b border-white/10">
      <div>
        <p class="text-white text-base font-medium mb-2">Display Order</p>
        <p class="text-white/70 text-xs">Drag and drop labels to change positions</p>
      </div>
      <Button variant="ghost" class="bg-white h-11 w-11 px-0">
        <Icon name="material-symbols:refresh" size="20" />
      </Button>
    </div>
  </div>
</template>
