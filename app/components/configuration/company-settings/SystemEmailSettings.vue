<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

interface MailConfig {
  id: number
  mail_driver: string
  mail_host: string
  mail_port: string
  mail_username: string
  mail_encryption: string
  api_key: string | null
  user_id: number | null
  created_at: string
  updated_at: string
  status: number
  sender_type: string
  campaign_id: number | null
  from_email: string
  from_name: string
}

interface Props {
  data: MailConfig
}

const props = defineProps<Props>()

const router = useRouter()

const infoRows = computed(() => [
  { label: 'Type', value: props?.data?.sender_type || '-' },
  { label: 'Driver Name', value: props?.data?.mail_driver || '-' },
  { label: 'Host Name', value: props?.data?.mail_host || '-' },
  { label: 'Username', value: props?.data?.mail_username || '-' },
  { label: 'Sender Email', value: props?.data?.from_email || '-' },
  { label: 'Sender Name', value: props?.data?.from_name || '-' },
])

function goToAddSmtp() {
  navigateTo({ path: '/app/configuration/smtp-settings/add-smtp', query: { id: props?.data?.id } })
}
</script>

<template>
  <div class="bg-white">
    <div class="flex flex-wrap items-center justify-between mb-4">
      <h2 class="text-base font-normal text-gray-900 dark:text-white">
        System Email Setting
      </h2>
      <Button
        class="inline-flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 mt-2 lg hover:bg-white hover:text-gray-700"
        type="button"
        @click="goToAddSmtp"
      >
        <Icon name="icons:update-email" size="15" />
        Update System Email Setting
      </Button>
    </div>
    <div class="border-b border-gray-200 mb-4 -mx-4" />

    <div class="space-y-3">
      <div
        v-for="row in infoRows"
        :key="row.label"
        class="rounded-md px-4 py-4 text-sm flex flex-col md:flex-row justify-between"
        style="background-color: #00A0860D;"
      >
        <span class="text-[#162D3AB2]">{{ row.label }}</span>
        <span class="text-[#162D3A] font-medium">{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>
