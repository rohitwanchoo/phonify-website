<script setup lang="ts">

</script>

<template>
  <BaseHeader title="Company Settings" />
  <div>
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
      <div class="bg-white border rounded-lg p-4 md:col-span-7">
        <ConfigurationCompanySettingsSystemEmailSettings />
      </div>
      <div class="bg-white border rounded-lg p-4 md:col-span-5">
        <ConfigurationCompanySettingsDemoLogo />
      </div>
    </div>
    <div class="bg-white border rounded-lg p-4">
      <ConfigurationCompanySettingsNotificationParameters />
    </div>
  </div>
</template>
