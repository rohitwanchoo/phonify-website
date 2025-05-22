<script setup lang="ts">
import DashSecOne from '@/components/dash-components/dash-sec-one/index.vue'
import DashSecTwo from '@/components/dash-components/dash-sec-two/index.vue'
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 md:rounded-tl-xl bg-white">
    <DashSecOne />
    <!-- <DashSecTwo /> -->
    <dashboardUsers />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardMap />
      <dashboardCalendar />
    </div>
    <dashboardTable />
  </div>
</template>
