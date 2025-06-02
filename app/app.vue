<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
</script>

<template>
  <Toaster
    position="top-center" :toast-options="{
      classes: {
        actionButton: '!bg-transparent !text-white !text-xs !border',
      },
    }"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style src="@/styles/main.css" />
