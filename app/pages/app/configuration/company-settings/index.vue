<script setup lang="ts">
const { data: smtpDetails } = await useLazyAsyncData('smtp-details', () =>
  useApi().get('/smtp/type/system'), {
  transform: res => res.data[0],
})
</script>

<template>
  <BaseHeader title="Company Settings" />
  <div>
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
      <div class="bg-white border rounded-lg p-4 md:col-span-7">
        <ConfigurationCompanySettingsSystemEmailSettings :data="smtpDetails" />
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
