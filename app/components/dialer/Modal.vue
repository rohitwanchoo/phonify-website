<script setup>
defineProps({
  show: Boolean,
})

const emit = defineEmits(['close'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-0 flex items-center justify-center"
  >
    <div class="relative">
      <Dialer @close="emit('close')" />
    </div>
  </div>
</template>
