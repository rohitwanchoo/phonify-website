<script setup lang="ts">
import { AlertCircle, Calendar, Clock, Phone, PhoneCall, User } from 'lucide-vue-next'
import moment from 'moment'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Callback {
  id: number
  leadName: string
  phoneNumber: string
  scheduledTime: string
  agentName: string
  campaignName: string
  notes?: string
  isOverdue: boolean
}

const { data: callbacks, status } = await useLazyAsyncData('dashboard-callbacks', async () => {
  try {
    const response = await useApi().post('/callback', {
      startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    })

    const callbackList = response.data?.callbacks || response.data || []
    return processCallbacks(callbackList)
  }
  catch {
    return []
  }
})

function processCallbacks(data: any[]): Callback[] {
  if (!Array.isArray(data))
    return []

  const now = moment()

  return data
    .map((item: any) => {
      const scheduledTime = moment(item.scheduled_time || item.callback_time || item.time)
      return {
        id: item.id || item.callback_id,
        leadName: item.lead_name || item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Unknown',
        phoneNumber: item.phone_number || item.phone || item.number || '-',
        scheduledTime: scheduledTime.format('YYYY-MM-DD HH:mm:ss'),
        agentName: item.agent_name || item.agent || 'Unassigned',
        campaignName: item.campaign_name || item.campaign || '-',
        notes: item.notes || item.description,
        isOverdue: scheduledTime.isBefore(now),
      }
    })
    .sort((a, b) => {
      // Overdue first, then by scheduled time
      if (a.isOverdue && !b.isOverdue)
        return -1
      if (!a.isOverdue && b.isOverdue)
        return 1
      return moment(a.scheduledTime).diff(moment(b.scheduledTime))
    })
    .slice(0, 8)
}

const isLoading = computed(() => status.value === 'pending')
const overdueCount = computed(() => (callbacks.value || []).filter(c => c.isOverdue).length)
const upcomingCount = computed(() => (callbacks.value || []).filter(c => !c.isOverdue).length)

function formatTime(dateString: string): string {
  return moment(dateString).format('h:mm A')
}

function getTimeFromNow(dateString: string): string {
  return moment(dateString).fromNow()
}

function handleDial(callback: Callback) {
  // Emit event or navigate to dialer with this callback
  navigateTo(`/app/start-dialing?phone=${callback.phoneNumber}`)
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-2">
        <Calendar class="w-5 h-5 text-purple-600" />
        <h3 class="text-lg font-semibold text-gray-900">
          Today's Callbacks
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <Badge v-if="overdueCount > 0" variant="destructive" class="text-xs">
          {{ overdueCount }} Overdue
        </Badge>
        <Badge variant="secondary" class="text-xs">
          {{ upcomingCount }} Upcoming
        </Badge>
      </div>
    </div>

    <!-- Callback List -->
    <div class="max-h-[400px] overflow-y-auto divide-y">
      <!-- Loading State -->
      <template v-if="isLoading">
        <div v-for="i in 4" :key="i" class="p-4 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div class="w-16 h-8 bg-gray-200 rounded" />
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="!callbacks?.length">
        <div class="p-8 text-center text-gray-500">
          <Calendar class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p class="font-medium">
            No callbacks scheduled for today
          </p>
          <p class="text-sm">
            Callbacks will appear here when scheduled
          </p>
        </div>
      </template>

      <!-- Callback Items -->
      <template v-else>
        <div
          v-for="callback in callbacks"
          :key="callback.id"
          class="p-4 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-red-50': callback.isOverdue }"
        >
          <div class="flex items-center gap-3">
            <!-- Status Icon -->
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full"
              :class="callback.isOverdue ? 'bg-red-100' : 'bg-purple-100'"
            >
              <AlertCircle v-if="callback.isOverdue" class="w-5 h-5 text-red-600" />
              <Clock v-else class="w-5 h-5 text-purple-600" />
            </div>

            <!-- Callback Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900 truncate">{{ callback.leadName }}</span>
                <Badge v-if="callback.isOverdue" variant="destructive" class="text-[10px] px-1.5 py-0">
                  Overdue
                </Badge>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <Phone class="w-3 h-3" />
                  {{ callback.phoneNumber }}
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  {{ formatTime(callback.scheduledTime) }}
                </span>
              </div>
              <div class="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <User class="w-3 h-3" />
                  {{ callback.agentName }}
                </span>
                <span>{{ getTimeFromNow(callback.scheduledTime) }}</span>
              </div>
            </div>

            <!-- Dial Button -->
            <Button
              size="sm"
              :variant="callback.isOverdue ? 'destructive' : 'default'"
              class="shrink-0"
              @click="handleDial(callback)"
            >
              <PhoneCall class="w-4 h-4 mr-1" />
              Dial
            </Button>
          </div>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <div v-if="callbacks?.length" class="p-3 border-t bg-gray-50 text-center">
      <NuxtLink to="/app/report/callback" class="text-sm text-primary hover:underline">
        View All Callbacks
      </NuxtLink>
    </div>
  </div>
</template>
