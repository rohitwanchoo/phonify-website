<script setup lang="ts">
const breadcrumbs = [
  {
    label: 'SMS Template List',
    href: '/app/sms/text-template',
  },
  {
    label: 'Add SMS Template',
    active: true,
  },
]
</script>

<template>
  <BaseHeader title="Add SMS Template" :breadcrumbs="breadcrumbs" />
  <SmsTextTemplateCreateForm />
</template>
