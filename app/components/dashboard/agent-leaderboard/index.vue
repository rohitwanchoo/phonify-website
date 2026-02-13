<script setup lang="ts">
import { Clock, Minus, Phone, Target, TrendingDown, TrendingUp, Trophy } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface AgentPerformance {
  id: number
  name: string
  extension: string
  avatar?: string
  totalCalls: number
  connectedCalls: number
  avgDuration: string
  avgDurationSeconds: number
  connectRate: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

const props = withDefaults(defineProps<{
  loading?: boolean
}>(), {
  loading: false,
})

// Fetch agent performance data
const { data: agentData, status } = await useLazyAsyncData('agent-leaderboard-data', () =>
  useApi().post('/cdr-call-agent-count', {}), {
  transform: (res) => {
    const agents = res.data?.agents || res.data?.data || []
    return processAgentData(agents)
  },
})

function processAgentData(agents: any[]): AgentPerformance[] {
  if (!agents || !Array.isArray(agents))
    return []

  return agents
    .map((agent: any, index: number) => {
      const totalCalls = Number(agent.total_calls || agent.totalCalls || agent.OUT || 0) + Number(agent.IN || 0)
      const connectedCalls = Number(agent.connected_calls || agent.connectedCalls || agent.answered || 0)
      const avgDurationSeconds = Number(agent.avg_duration || agent.avgDuration || agent.avg_talk_time || 0)
      const connectRate = totalCalls > 0 ? Math.round((connectedCalls / totalCalls) * 100) : 0

      // Calculate trend (mock for now - would need historical data)
      const trendValue = Math.floor(Math.random() * 20) - 10
      const trend = trendValue > 2 ? 'up' : trendValue < -2 ? 'down' : 'stable'

      return {
        id: agent.id || agent.user_id || index,
        name: agent.name || agent.agent_name || `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || `Agent ${index + 1}`,
        extension: agent.extension || agent.ext || '-',
        avatar: agent.avatar || agent.profile_image,
        totalCalls,
        connectedCalls,
        avgDuration: formatDuration(avgDurationSeconds),
        avgDurationSeconds,
        connectRate,
        trend,
        trendValue: Math.abs(trendValue),
      } as AgentPerformance
    })
    .filter((agent: AgentPerformance) => agent.totalCalls > 0)
    .sort((a: AgentPerformance, b: AgentPerformance) => b.totalCalls - a.totalCalls)
    .slice(0, 10) // Top 10 agents
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0)
    return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getRankBadgeClass(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-yellow-500 text-white'
    case 2:
      return 'bg-gray-400 text-white'
    case 3:
      return 'bg-amber-700 text-white'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}

function getTrendIcon(trend: 'up' | 'down' | 'stable') {
  switch (trend) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    default:
      return Minus
  }
}

function getTrendClass(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return 'text-green-600'
    case 'down':
      return 'text-red-500'
    default:
      return 'text-gray-400'
  }
}

function getConnectRateColor(rate: number): string {
  if (rate >= 70)
    return 'bg-green-500'
  if (rate >= 50)
    return 'bg-yellow-500'
  return 'bg-red-500'
}

const isLoading = computed(() => props.loading || status.value === 'pending')
const agents = computed(() => agentData.value || [])
const maxCalls = computed(() => {
  if (!agents.value.length)
    return 1
  return Math.max(...agents.value.map((a: AgentPerformance) => a.totalCalls))
})
</script>

<template>
  <div class="border rounded-lg bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-2">
        <Trophy class="w-5 h-5 text-yellow-500" />
        <h3 class="text-lg font-semibold text-gray-900">
          Agent Performance Leaderboard
        </h3>
      </div>
      <Badge variant="secondary" class="text-xs">
        Top {{ agents.length }} Agents
      </Badge>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b">
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
          <Phone class="w-3 h-3" />
          <span>Total Calls</span>
        </div>
        <div v-if="isLoading" class="text-lg font-bold">
          <Icon name="eos-icons:loading" class="w-5 h-5" />
        </div>
        <div v-else class="text-lg font-bold text-gray-900">
          {{ formatWithCommas(agents.reduce((sum: number, a: AgentPerformance) => sum + a.totalCalls, 0)) }}
        </div>
      </div>
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
          <Target class="w-3 h-3" />
          <span>Avg Connect Rate</span>
        </div>
        <div v-if="isLoading" class="text-lg font-bold">
          <Icon name="eos-icons:loading" class="w-5 h-5" />
        </div>
        <div v-else class="text-lg font-bold text-gray-900">
          {{ agents.length ? Math.round(agents.reduce((sum: number, a: AgentPerformance) => sum + a.connectRate, 0) / agents.length) : 0 }}%
        </div>
      </div>
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
          <Clock class="w-3 h-3" />
          <span>Avg Duration</span>
        </div>
        <div v-if="isLoading" class="text-lg font-bold">
          <Icon name="eos-icons:loading" class="w-5 h-5" />
        </div>
        <div v-else class="text-lg font-bold text-gray-900">
          {{ agents.length ? formatDuration(Math.round(agents.reduce((sum: number, a: AgentPerformance) => sum + a.avgDurationSeconds, 0) / agents.length)) : '00:00' }}
        </div>
      </div>
    </div>

    <!-- Leaderboard List -->
    <div class="divide-y max-h-[500px] overflow-y-auto">
      <!-- Loading State -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="p-4 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-gray-200 rounded-full" />
            <div class="w-10 h-10 bg-gray-200 rounded-full" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div class="w-20 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="!agents.length">
        <div class="p-8 text-center text-gray-500">
          <Trophy class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p class="font-medium">
            No agent data available
          </p>
          <p class="text-sm">
            Agent performance will appear here once calls are made
          </p>
        </div>
      </template>

      <!-- Agent Rows -->
      <template v-else>
        <div
          v-for="(agent, index) in agents"
          :key="agent.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <!-- Rank Badge -->
            <div
              class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
              :class="getRankBadgeClass(index + 1)"
            >
              {{ index + 1 }}
            </div>

            <!-- Avatar -->
            <Avatar class="h-10 w-10">
              <AvatarImage
                v-if="agent.avatar"
                :src="agent.avatar"
                :alt="agent.name"
              />
              <AvatarFallback class="bg-primary/10 text-primary font-medium">
                {{ getInitials(agent.name) }}
              </AvatarFallback>
            </Avatar>

            <!-- Agent Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900 truncate">{{ agent.name }}</span>
                <Badge v-if="index === 0" variant="warning" class="text-[10px] px-1.5 py-0">
                  Top Performer
                </Badge>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-500">
                <span>Ext: {{ agent.extension }}</span>
                <span class="flex items-center gap-1">
                  <component :is="getTrendIcon(agent.trend)" class="w-3 h-3" :class="getTrendClass(agent.trend)" />
                  <span :class="getTrendClass(agent.trend)">{{ agent.trendValue }}%</span>
                </span>
              </div>
            </div>

            <!-- Metrics -->
            <div class="hidden md:flex items-center gap-6">
              <!-- Total Calls with Progress Bar -->
              <div class="w-32">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500">Calls</span>
                  <span class="font-semibold text-gray-900">{{ formatWithCommas(agent.totalCalls) }}</span>
                </div>
                <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full transition-all duration-500"
                    :style="{ width: `${(agent.totalCalls / maxCalls) * 100}%` }"
                  />
                </div>
              </div>

              <!-- Connect Rate -->
              <div class="w-24 text-center">
                <div class="text-xs text-gray-500 mb-1">
                  Connect Rate
                </div>
                <div class="flex items-center justify-center gap-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="getConnectRateColor(agent.connectRate)"
                  />
                  <span class="font-semibold text-gray-900">{{ agent.connectRate }}%</span>
                </div>
              </div>

              <!-- Avg Duration -->
              <div class="w-20 text-right">
                <div class="text-xs text-gray-500 mb-1">
                  Avg Time
                </div>
                <span class="font-semibold text-gray-900">{{ agent.avgDuration }}</span>
              </div>
            </div>

            <!-- Mobile Metrics -->
            <div class="md:hidden text-right">
              <div class="font-semibold text-gray-900">
                {{ formatWithCommas(agent.totalCalls) }}
              </div>
              <div class="text-xs text-gray-500">
                calls
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <div v-if="agents.length" class="p-3 border-t bg-gray-50 text-center">
      <NuxtLink to="/app/report/agent-activity" class="text-sm text-primary hover:underline">
        View Full Agent Report
      </NuxtLink>
    </div>
  </div>
</template>
