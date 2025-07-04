<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const showDialog = ref(false)

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const { data: emailTemplates, status, refresh } = await useLazyAsyncData('email-templates', () =>
  useApi().get('/email-templates'), {
  transform: res => res,
})

const searchFilteredEmailTemplate = computed(() => {
  if (!emailTemplates.value)
    return []
  const query = searchQuery.value.toLowerCase()
  return emailTemplates.value.data.filter((item: any) => {
    return (
      item?.template_name?.toLowerCase().includes(query)
    )
  })
})

const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return searchFilteredEmailTemplate.value.slice(start, end)
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  pageStart.value = 0
})

const selectedEmailTemplate = ref<null | {
  id: number
  template_name: string
  template_html: string
  subject: string
  lead_status: string
  status: string
  send_bcc: string
  created_at: string
  updated_at: string
}>(null)

function openEditDialog(emailTemplate: any) {
  selectedEmailTemplate.value = emailTemplate
  showDialog.value = true
}

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}
</script>

<template>
  <!-- HEADER -->
  <BaseHeader title="Email Template List">
    <template #actions>
      <div class="relative mt-4">
        <Input v-model="searchQuery" placeholder="Search Template" class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <NuxtLink to="/app/configuration/email-templates/add">
        <Button>
          <Icon name="material-symbols:add" size="20" />
          Add Email Template
        </Button>
      </NuxtLink>
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <ConfigurationEmailTemplatesTable :limit="limit" :total-rows="searchFilteredEmailTemplate.length" :start="pageStart" :list="paginatedList || []" :loading="status === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refresh" @edit="openEditDialog" />
  </div>
</template>
