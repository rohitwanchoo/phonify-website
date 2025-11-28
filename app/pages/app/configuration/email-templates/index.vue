<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button'

const showDialog = ref(false)

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: emailTemplateList, status: emailTemplateStatus, refresh: refreshEmailTemplate } = await useLazyAsyncData('email-templates', () =>
  useApi().get('/email-templates', {
    query: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  transform: res => res.data,
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
  start.value = Number((page - 1) * limit.value)
  return refreshEmailTemplate()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshEmailTemplate()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshEmailTemplate()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <!-- HEADER -->
  <BaseHeader title="Email Template List">
    <template #actions>
      <div class="relative">
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
      </div>
      <NuxtLink to="/app/configuration/email-templates/add">
        <Button variant="destructive" class="h-11">
          <Icon name="material-symbols:add" size="20" />
          Add Email Template
        </Button>
      </NuxtLink>
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <ConfigurationEmailTemplatesTable
      :limit="limit"
      :total-rows="emailTemplateList?.total"
      :start="start"
      :list="emailTemplateList?.data || []"
      :loading="emailTemplateStatus === 'pending'"
      @page-navigation="changePage"
      @change-limit="changeLimit"
      @edit="openEditDialog"
    />
  </div>
</template>
