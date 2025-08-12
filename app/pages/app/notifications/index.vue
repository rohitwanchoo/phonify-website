<script setup lang="ts">
import moment from 'moment'
import { computed, ref } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const { data: notificationList, status, pending } = await useLazyAsyncData('notification-list', () =>
  useApi().get('/notifications', {}), {
  transform: (res) => {
    const sortedArray = Object.values(res.data).sort((a: any, b: any) => a.display_order - b.display_order)
    return sortedArray
  },
})

// Tab state
const activeTab = ref<'all' | 'unread'>('all')

const searchQuery = ref('')

const totalCount = computed(() => notificationList.value?.length || 0)
const unreadCount = computed(() => notificationList.value?.is_read?.length || 0)

// Mark all as read
// function markAllAsRead() {
//   notifications.value = notifications.value.map(n => ({ ...n, read_at: new Date().toISOString() }))
// }

// Formate date
function formatDate(dateStr: string): string {
  const date = moment(dateStr)

  if (date.isSame(moment(), 'day'))
    return 'Today'
  if (date.isSame(moment().subtract(1, 'day'), 'day'))
    return 'Yesterday'

  return date.format('DD MMM, YYYY')
}

const filteredNotifications = computed(() => {
  if (!notificationList.value)
    return []

  return notificationList.value.filter((n: any) => {
    const matchesTab = activeTab.value === 'all' || !n.isRead
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesTab && matchesSearch
  })
})
</script>

<template>
  <BaseHeader title="Notifications">
    <template #actions>
      <BaseInputSearch v-model="searchQuery" placeholder="Search Notifications" class="w-[300px]" />

      <Nuxt-link to="">
        <Button variant="outline" class="h-11" @click="markAllAsRead">
          <Icon class=" text-primary" name="material-symbols:done-all" size="20" />
          Mark All as Read
        </Button>
      </Nuxt-link>

      <Nuxt-link to="">
        <Button class="h-11">
          <Icon class=" text-[#E8EAED]" size="20" name="material-symbols:filter-alt-outline" />
          Sort
        </Button>
      </Nuxt-link>
    </template>
  </BaseHeader>
  <!-- notification container -->
  <div class="border border-gray-200 rounded-xl h-full mt-4">
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
          {{ unreadCount || 0 }}
        </p>
      </div>
    </div>

    <!-- Notifications -->
    <div class="pt-2 px-2 h-full overflow-y-auto">
      <div
        v-if="pending"
      >
        <div
          v-for="n in 10"
          :key="n"
        >
          <Skeleton class="w-full min-h-[50px] flex justify-between items-center px-4 mb-2 rounded-md" />
        </div>
      </div>
      <div
        v-for="notification in filteredNotifications"
        v-else
        :key="notification?.id"
        class="w-full min-h-[50px] flex justify-between items-center px-4 mb-2 rounded-md"
        :class="notification?.isRead ? '' : 'bg-[#00A08608]'"
      >
        <div class="flex items-center text-primary text-sm">
          <div
            class="size-2 rounded-full mr-2"
            :class="notification?.isRead ? 'bg-white' : 'bg-[#00A086]'"
            name="lucide:dot"
          />
          <Icon class="text-primary text-xl mr-2" name="material-symbols:notifications-active" />
          {{ notification?.name }}
        </div>
        <div class="flex gap-4 items-center text-primary text-sm">
          {{ formatDate(notification?.updated_at) }}
          <Icon class="text-red-600 text-xl cursor-pointer" name="material-symbols:delete" />
        </div>
      </div>
    </div>
  </div>
</template>
