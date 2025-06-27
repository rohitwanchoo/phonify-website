<script setup lang="ts">
import { Icon } from '#components'
import { ref } from 'vue'
import NotificationSheet from '@/components/configuration/company-settings/NotificationSheet.vue'

const notifications = [
  {
    icon: 'material-symbols:list',
    text: 'Notification for list uploaded/deleted',
  },
  {
    icon: 'material-symbols:person',
    text: 'Notification for extension create/delete',
  },
  {
    icon: 'material-symbols:campaign',
    text: 'Notification for campaign low leads',
  },
  {
    icon: 'material-symbols:call',
    text: 'Daily call report',
  },
  {
    icon: 'material-symbols:group',
    text: 'Notification for lead recycle',
  },
  {
    icon: 'material-symbols:public',
    text: 'IP Whitelisting notification',
  },
  {
    icon: 'material-symbols:fax',
    text: 'Fax Notification',
  },
  {
    icon: 'material-symbols:phone-callback',
    text: 'Callback Notification',
  },
]

const showSheet = ref(false)
</script>

<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between mb-4 mt-2 pb-1">
      <h2 class="text-base font-normal text-gray-900 dark:text-white">
        Notification Parameters
      </h2>
    </div>
    <div class="border-b border-gray-200 mb-4 -mx-4" />

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="(item, idx) in notifications"
        :key="idx"
        class="flex items-center justify-between px-4 py-5 bg-[#FAFAFA] rounded-md cursor-pointer"
        @click="showSheet = true"
      >
        <div class="flex items-center gap-3">
          <Icon :name="item.icon" class="text-[#162D3A]" size="18" />
          <span class="text-sm text-[#162D3AB2] font-normal">{{ item.text }}</span>
        </div>
        <Icon name="material-symbols:chevron-right" size="18" />
      </div>
    </div>
    <NotificationSheet v-model:open="showSheet" />
  </div>
</template>
