<script setup lang="ts">
import { Bell, Calendar, MessageSquare, PhoneOutgoing, User, Voicemail } from 'lucide-vue-next'
import moment from 'moment'
import { Badge } from '@/components/ui/badge'

interface ActivityItem {
  id: string
  type: 'call_connected' | 'call_ended' | 'callback_scheduled' | 'sms_sent' | 'voicemail' | 'agent_login' | 'campaign_complete'
  title: string
  description: string
  timestamp: string
  agent?: string
  icon: any
  iconColor: string
  iconBg: string
}

const { data: activities, status, refresh } = await useLazyAsyncData('dashboard-activity-feed', async () => {
  try {
    const [liveCallRes, callbackRes] = await Promise.all([
      useApi().post('/live-call', {}),
      useApi().post('/callback', {
        startTime: moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }),
    ])

    const activityList: ActivityItem[] = []

    // Add live calls as activities
    const liveCalls = Array.isArray(liveCallRes.data) ? liveCallRes.data : []
    liveCalls.slice(0, 5).forEach((call: any, index: number) => {
      activityList.push({
        id: `call-${call.id || index}`,
        type: 'call_connected',
        title: 'Call Connected',
        description: `${call.agent_name || 'Agent'} connected with ${call.caller_id || call.phone || 'customer'}`,
        timestamp: call.start_time || moment().subtract(index * 2, 'minutes').format(),
        agent: call.agent_name,
        icon: PhoneOutgoing,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100',
      })
    })

    // Add callbacks as activities
    const callbacks = Array.isArray(callbackRes.data) ? callbackRes.data : []
    callbacks.slice(0, 3).forEach((cb: any, index: number) => {
      activityList.push({
        id: `callback-${cb.id || index}`,
        type: 'callback_scheduled',
        title: 'Callback Scheduled',
        description: `New callback scheduled for ${cb.lead_name || 'customer'} at ${moment(cb.scheduled_time).format('h:mm A')}`,
        timestamp: cb.created_at || moment().subtract(index * 5 + 10, 'minutes').format(),
        agent: cb.agent_name,
        icon: Calendar,
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-100',
      })
    })

    // Add some simulated activities for demo
    const simulatedActivities: ActivityItem[] = [
      {
        id: 'sms-1',
        type: 'sms_sent',
        title: 'SMS Sent',
        description: 'Follow-up message sent to +1-555-0123',
        timestamp: moment().subtract(8, 'minutes').format(),
        agent: 'Sarah Wilson',
        icon: MessageSquare,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
      },
      {
        id: 'voicemail-1',
        type: 'voicemail',
        title: 'New Voicemail',
        description: 'Voicemail received from +1-555-0456',
        timestamp: moment().subtract(15, 'minutes').format(),
        icon: Voicemail,
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-100',
      },
      {
        id: 'login-1',
        type: 'agent_login',
        title: 'Agent Logged In',
        description: 'Mike Johnson started their shift',
        timestamp: moment().subtract(20, 'minutes').format(),
        agent: 'Mike Johnson',
        icon: User,
        iconColor: 'text-gray-600',
        iconBg: 'bg-gray-100',
      },
    ]

    return [...activityList, ...simulatedActivities]
      .sort((a, b) => moment(b.timestamp).diff(moment(a.timestamp)))
      .slice(0, 10)
  }
  catch {
    return []
  }
}, {
  server: false,
})

// Auto-refresh every 30 seconds
const refreshInterval = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  refreshInterval.value = setInterval(() => {
    refresh()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

const isLoading = computed(() => status.value === 'pending')

function getTimeAgo(timestamp: string): string {
  return moment(timestamp).fromNow()
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-2">
        <Bell class="w-5 h-5 text-orange-600" />
        <h3 class="text-lg font-semibold text-gray-900">
          Live Activity Feed
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span class="text-xs text-gray-500">Live</span>
      </div>
    </div>

    <!-- Activity List -->
    <div class="max-h-[400px] overflow-y-auto">
      <!-- Loading State -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="p-4 border-b animate-pulse">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div class="w-12 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="!activities?.length">
        <div class="p-8 text-center text-gray-500">
          <Bell class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p class="font-medium">
            No recent activity
          </p>
          <p class="text-sm">
            Activity will appear here as events occur
          </p>
        </div>
      </template>

      <!-- Activity Items -->
      <template v-else>
        <div
          v-for="(activity, index) in activities"
          :key="activity.id"
          class="p-4 hover:bg-gray-50 transition-colors"
          :class="{ 'border-b': index < activities.length - 1 }"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div
              class="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
              :class="activity.iconBg"
            >
              <component :is="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900 text-sm">{{ activity.title }}</span>
                <Badge v-if="index === 0" variant="secondary" class="text-[10px] px-1.5 py-0">
                  New
                </Badge>
              </div>
              <p class="text-sm text-gray-600 truncate">
                {{ activity.description }}
              </p>
              <div v-if="activity.agent" class="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <User class="w-3 h-3" />
                {{ activity.agent }}
              </div>
            </div>

            <!-- Timestamp -->
            <span class="text-xs text-gray-400 shrink-0">
              {{ getTimeAgo(activity.timestamp) }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <div class="p-3 border-t bg-gray-50 flex items-center justify-between">
      <span class="text-xs text-gray-500">Updates every 30 seconds</span>
      <button class="text-xs text-primary hover:underline" @click="refresh()">
        Refresh Now
      </button>
    </div>
  </div>
</template>
