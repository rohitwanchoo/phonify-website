<script setup lang="ts">
import { Input } from '~/components/ui/input'
</script>

<template>
  <BaseHeader title="Company Settings" />
  <div>
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
      <div class="bg-white border rounded-lg p-4 md:col-span-7">
    <ConfigurationCompanySettingsSystemEmailSettings/>
      </div>
      <div class="bg-white border rounded-lg p-4 md:col-span-5">
        <!-- Second column content -->
        Column 2
      </div>
    </div>
    <div class="bg-white border rounded-lg p-4">
      <!-- Full width row content -->
      Full width row
    </div>
  </div>
</template>
