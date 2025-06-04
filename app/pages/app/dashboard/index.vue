<script setup lang="ts">
// Protect this page with authentication
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 md:rounded-tl-xl bg-white">
    <dashboardCardsSection />
    <dashboardUsers />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardMap />
      <dashboardCalendar />
    </div>
    <dashboardTable />
  </div>
</template>
