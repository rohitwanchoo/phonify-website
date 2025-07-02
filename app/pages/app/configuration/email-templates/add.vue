<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const emit = defineEmits(['edit'])

const route = useRoute()
const editMode = computed(() => route.query.mode === 'edit')
const editId = computed(() => route.query.id ? Number(route.query.id) : null)

// Fetch the email template data if in edit mode
const { data: emailTemplate, status } = await useLazyAsyncData('email-template', () =>
  useApi().get(`/email-template/${editId.value}`, {
    id: editId.value,
    include: 'template_variables',
  }), {
  transform: res => res.data,
})

function handleEdit(updatedFormValues: Record<string, any>): void {
  console.log(updatedFormValues)
}



// Page title based on mode
const pageTitle = computed(() => editMode.value ? emailTemplate.value?.template_name : 'Add Email Template')
const breadcrumbTitle = computed(() => editMode.value ? 'Edit Email Template' : 'Add Email Template')
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <div class="flex items-center gap-x-2">
        <BreadcrumbItem>
          <BreadcrumbLink href="/app/configuration/email-templates" class="font-normal">
            Email Template List
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {{ breadcrumbTitle }}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </div>
    </BreadcrumbList>
  </Breadcrumb>
  <BaseHeader :title="pageTitle" />
  <ConfigurationEmailTemplatesAddDetails 
  :email-template="emailTemplate" 
  :email-template-status="status"
  @edit="handleEdit" />
</template>
