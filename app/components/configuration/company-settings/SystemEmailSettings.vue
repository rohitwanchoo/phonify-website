<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()

const infoRows = [
  { label: 'Type', value: 'System' },
  { label: 'Driver Name', value: 'smtp' },
  { label: 'Host Name', value: 'smtp.sendgrid.net' },
  { label: 'Username', value: 'johndoe' },
  { label: 'Sender Email', value: 'demomail@phonify.com' },
  { label: 'Sender Name', value: 'Phonify Pvt Ltd' },
]

function goToAddSmtp() {
  router.push('/app/configuration/smtp-settings/add-smtp')
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
