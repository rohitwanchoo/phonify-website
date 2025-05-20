<script setup lang="ts">
import DashSecOne from '@/components/dash-components/dash-sec-one/index.vue'
import DashSecTwo from '@/components/dash-components/dash-sec-two/index.vue'
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 pt-5 md:rounded-tl-xl bg-white">
    <DashSecOne />
    <DashSecTwo />
    <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
  </div>
</template>
