<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

// Placeholder notification structure
interface Notification {
  id: number
  message: string
  isRead: boolean
  date: string
}

// Sample data
const notifications = ref<Notification[]>([
  { id: 1, message: 'Lorem ipsum dolor sit amet consectetur.', isRead: false, date: 'Today' },
  { id: 2, message: 'Sit magna lorem ac sed donec lectus.', isRead: false, date: 'Today' },
  { id: 3, message: 'Pellentesque habitant morbi tristique.', isRead: true, date: 'Today' },
  { id: 1, message: 'Lorem ipsum dolor sit amet consectetur.', isRead: false, date: 'Today' },
  { id: 2, message: 'Sit magna lorem ac sed donec lectus.', isRead: false, date: 'Today' },
  { id: 3, message: 'Pellentesque habitant morbi tristique.', isRead: true, date: 'Today' },

])

// Tab state
const activeTab = ref<'all' | 'unread'>('all')

// Computed values
const filteredNotifications = computed(() => {
  return activeTab.value === 'all'
    ? notifications.value
    : notifications.value.filter(n => !n.isRead)
})

const totalCount = computed(() => notifications.value.length)
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

// Mark all as read
function markAllAsRead() {
  notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
}
</script>

<template>
  <BaseHeader title="Notifications">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] text-gray-400 right-2" name="lucide:search" />
      </div>

      <Nuxt-link to="">
        <Button variant="outline" @click="markAllAsRead">
          <Icon class="!text-primary" name="lucide:check-check" />
          Mark All as Read
        </Button>
      </Nuxt-link>

      <Nuxt-link to="">
        <Button>
          <Icon class="!text-white" name="lucide:funnel" />
          Sort
        </Button>
      </Nuxt-link>
    </template>
  </BaseHeader>
  <!-- notification container -->
  <div class="border border-gray-200 rounded-xl h-full">
    <!-- Tabs -->
    <div class="w-full bg-[#FAFAFA] flex rounded-t-xl items-center border-b">
      <div
        class="w-[50%] h-[50px] flex items-center justify-center cursor-pointer border-b-2"
        :class="activeTab === 'all' ? 'border-[#00A086]' : 'border-transparent'"
        @click="activeTab = 'all'"
      >
        <p>All</p>
        <Icon class="text-black mx-1" name="lucide:dot" />
        <p class="font-light text-sm">
          {{ totalCount }}
        </p>
      </div>
      <div
        class="w-[50%] h-[50px] flex items-center justify-center cursor-pointer border-b-2"
        :class="activeTab === 'unread' ? 'border-[#00A086]' : 'border-transparent'"
        @click="activeTab = 'unread'"
      >
        <p>Unread</p>
        <Icon class="text-black mx-1" name="lucide:dot" />
        <p class="font-light text-sm">
          {{ unreadCount }}
        </p>
      </div>
    </div>

    <!-- Notifications -->
    <div class="pt-2 px-2 h-full overflow-y-auto">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="w-full min-h-[50px] flex justify-between items-center px-4 mb-2 rounded-md"
        :class="notification.isRead ? '' : 'bg-[#00A08608]'"
      >
        <div class="flex items-center text-primary text-sm">
          <Icon
            class="text-5xl mr-1"
            :class="notification.isRead ? 'text-white' : 'text-[#00A086]'"
            name="lucide:dot"
          />
          <Icon class="text-primary txt-md mr-2" name="lucide:bell-ring" />
          {{ notification.message }}
        </div>
        <div class="flex gap-4 items-center text-primary text-sm">
          {{ notification.date }}
          <Icon class="text-red-500 text-md cursor-pointer" name="lucide:trash-2" />
        </div>
      </div>
    </div>
  </div>
</template>
