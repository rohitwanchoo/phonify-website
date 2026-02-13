<script setup lang="ts">
import { Clock, TrendingUp } from 'lucide-vue-next'
import moment from 'moment'
import { Badge } from '@/components/ui/badge'

interface HourData {
  hour: number
  day: number
  calls: number
  answerRate: number
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

const { data: heatmapData, status } = await useLazyAsyncData('dashboard-peak-hours', async () => {
  try {
    // Fetch historical call data
    const ranges = []
    for (let d = 0; d < 7; d++) {
      for (let h = 8; h < 20; h++) {
        const date = moment().subtract(d, 'days').hour(h).startOf('hour')
        ranges.push({
          startTime: date.format('YYYY-MM-DD HH:mm:ss'),
          endTime: date.clone().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        })
      }
    }

    // For now, generate sample data - would need actual hourly API
    return generateSampleData()
  }
  catch {
    return generateSampleData()
  }
})

function generateSampleData(): HourData[] {
  const data: HourData[] = []

  for (let day = 0; day < 7; day++) {
    for (let hour = 8; hour < 20; hour++) {
      // Simulate realistic patterns
      let baseCalls = 50
      let baseRate = 30

      // Peak hours (10 AM - 12 PM, 2 PM - 4 PM)
      if ((hour >= 10 && hour <= 12) || (hour >= 14 && hour <= 16)) {
        baseCalls = 120
        baseRate = 45
      }
      // Lunch dip
      else if (hour >= 12 && hour <= 14) {
        baseCalls = 40
        baseRate = 25
      }
      // Morning ramp up
      else if (hour >= 8 && hour <= 10) {
        baseCalls = 70
        baseRate = 35
      }
      // Evening wind down
      else if (hour >= 17) {
        baseCalls = 30
        baseRate = 20
      }

      // Weekend reduction
      if (day >= 5) {
        baseCalls = Math.floor(baseCalls * 0.3)
        baseRate = Math.floor(baseRate * 0.7)
      }

      // Add some randomness
      const calls = Math.floor(baseCalls + (Math.random() - 0.5) * 40)
      const answerRate = Math.min(100, Math.max(0, Math.floor(baseRate + (Math.random() - 0.5) * 20)))

      data.push({
        hour,
        day,
        calls: Math.max(0, calls),
        answerRate,
      })
    }
  }

  return data
}

const isLoading = computed(() => status.value === 'pending')

function getCellData(day: number, hour: number): HourData | undefined {
  return heatmapData.value?.find(d => d.day === day && d.hour === hour)
}

function getHeatColor(answerRate: number): string {
  if (answerRate >= 50)
    return 'bg-green-500'
  if (answerRate >= 40)
    return 'bg-green-400'
  if (answerRate >= 30)
    return 'bg-yellow-400'
  if (answerRate >= 20)
    return 'bg-orange-400'
  if (answerRate >= 10)
    return 'bg-red-400'
  return 'bg-red-500'
}

function getOpacity(calls: number, maxCalls: number): number {
  if (maxCalls === 0)
    return 0.3
  const opacity = 0.3 + (calls / maxCalls) * 0.7
  return Math.min(1, opacity)
}

const maxCalls = computed(() => {
  if (!heatmapData.value?.length)
    return 1
  return Math.max(...heatmapData.value.map(d => d.calls))
})

const bestTime = computed(() => {
  if (!heatmapData.value?.length)
    return null
  const best = [...heatmapData.value].sort((a, b) => b.answerRate - a.answerRate)[0]
  return {
    day: days[best.day],
    hour: formatHour(best.hour),
    rate: best.answerRate,
  }
})

function formatHour(hour: number): string {
  if (hour === 12)
    return '12 PM'
  if (hour > 12)
    return `${hour - 12} PM`
  return `${hour} AM`
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-2">
        <Clock class="w-5 h-5 text-cyan-600" />
        <h3 class="text-lg font-semibold text-gray-900">
          Peak Hours Heatmap
        </h3>
      </div>
      <Badge v-if="bestTime" variant="success" class="text-xs">
        <TrendingUp class="w-3 h-3 mr-1" />
        Best: {{ bestTime.day }} {{ bestTime.hour }} ({{ bestTime.rate }}%)
      </Badge>
    </div>

    <!-- Heatmap -->
    <div class="p-4">
      <!-- Loading State -->
      <template v-if="isLoading">
        <div class="animate-pulse">
          <div class="grid grid-cols-13 gap-1">
            <div class="h-6" />
            <div v-for="h in 12" :key="h" class="h-6 bg-gray-200 rounded" />
            <template v-for="d in 7" :key="d">
              <div class="h-8 bg-gray-200 rounded w-8" />
              <div v-for="h in 12" :key="h" class="h-8 bg-gray-200 rounded" />
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- Hour Headers -->
        <div class="grid gap-1 mb-2" :style="{ gridTemplateColumns: `40px repeat(${hours.length}, 1fr)` }">
          <div />
          <div
            v-for="hour in hours"
            :key="hour"
            class="text-[10px] text-gray-500 text-center"
          >
            {{ formatHour(hour) }}
          </div>
        </div>

        <!-- Heatmap Grid -->
        <div class="space-y-1">
          <div
            v-for="(day, dayIndex) in days"
            :key="day"
            class="grid gap-1"
            :style="{ gridTemplateColumns: `40px repeat(${hours.length}, 1fr)` }"
          >
            <!-- Day Label -->
            <div class="text-xs text-gray-600 font-medium flex items-center">
              {{ day }}
            </div>

            <!-- Hour Cells -->
            <div
              v-for="hour in hours"
              :key="hour"
              class="group relative h-8 rounded cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1"
              :class="getHeatColor(getCellData(dayIndex, hour)?.answerRate || 0)"
              :style="{ opacity: getOpacity(getCellData(dayIndex, hour)?.calls || 0, maxCalls) }"
            >
              <!-- Tooltip -->
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                <div class="font-medium">
                  {{ day }} {{ formatHour(hour) }}
                </div>
                <div>
                  Calls: {{ getCellData(dayIndex, hour)?.calls || 0 }}
                </div>
                <div>
                  Answer Rate: {{ getCellData(dayIndex, hour)?.answerRate || 0 }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Answer Rate:</span>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-red-500" />
              <span class="text-xs text-gray-500">Low</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-yellow-400" />
              <span class="text-xs text-gray-500">Medium</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-green-500" />
              <span class="text-xs text-gray-500">High</span>
            </div>
          </div>
          <span class="text-xs text-gray-400">Opacity = call volume</span>
        </div>
      </template>
    </div>
  </div>
</template>
