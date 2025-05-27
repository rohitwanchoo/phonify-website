<script setup>
defineProps({
  classes: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'bg-skelton',
  },
  rounded: {
    type: String,
    default: 'rounded-xl',
  },
})
</script>

<template>
  <div :class="`${height} ${color} ${rounded} ${classes}`" class="animate-pulse skeletal-loader">
    <slot />
  </div>
  <!-- <span class="sr-only">Loading...</span> -->
</template>

<style scoped>
.skeletal-loader {
  background-image: linear-gradient(90deg, #EEE 40%, #ddd 50%, #EEE 60%);
  background-size: 320%;
  animation: skeletal-loading 1200ms linear infinite;
}
@keyframes skeletal-loading {
  from {
    background-position: 100%;
  }
  to {
    background-position: 0;
  }
}
</style>

