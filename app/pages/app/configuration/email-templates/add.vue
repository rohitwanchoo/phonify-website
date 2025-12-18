<script setup lang="ts">
const route = useRoute()
const editId = computed(() => route.query.id ? Number(route.query.id) : null)

// Fetch the email template data if in edit mode
const { data: emailTemplate, status: emailTemplateStatus, refresh } = await useLazyAsyncData('email-template', () =>
  useApi().get(`/email-template/${editId.value}`, {
    id: editId.value,
    include: 'template_variables',
  }), {
  transform: res => res.data,
  immediate: false,
})
onMounted(() => {
  if (editId.value) {
    refresh()
  }
})
// Page title based on mode
const pageTitle = computed(() => editId.value ? emailTemplate.value?.template_name : 'Add Email Template')
const breadcrumbTitle = computed(() => editId.value ? 'Edit Email Template' : 'Add Email Template')
const breadcrumbs = [
  {
    label: 'Email Template list',
    href: '/app/configuration/email-templates',
  },
  {
    label: breadcrumbTitle.value,
    active: true,
  },
]
</script>

<template>
  <BaseHeader :title="pageTitle" :breadcrumbs="breadcrumbs" />
  <div class="pt-4">
    <ConfigurationEmailTemplatesAddDetails
      :email-template="emailTemplate"
      :email-template-status="emailTemplateStatus"
    />
  </div>
</template>
