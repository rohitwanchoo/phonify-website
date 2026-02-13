<script setup lang="ts">
import moment from 'moment'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

interface Campaign {
  id?: number
  title?: string
  description?: string
  dial_mode?: string
  status?: number
  time_based_calling?: number
  call_time_start?: string
  call_time_end?: string
  caller_id?: string
  custom_caller_id?: number
  country_code?: string
  rowList?: string
  send_crm?: string
  email?: string
  sms?: string
  hopper_count?: number
  send_report?: number
  total_leads: number
  dialed_leads: number
  created_date?: string
  schedule_name?: string
  created_at?: string
  group_name?: string
  voip_configuration_name?: string
}

const props = defineProps<{
  campaign?: Campaign
}>()

const callerIds: Record<string, string> = {
  area_code: 'Area Code',
  custom: 'Custom CLI',
  area_code_random: 'Area Code + Randomizer',
}

const dialModes: Record<string, { label: string, color: string }> = {
  super_power_dial: { label: 'Super Power Dial', color: 'bg-blue-100 text-blue-700' },
  predictive_dial: { label: 'Predictive Dial', color: 'bg-purple-100 text-purple-700' },
  outbound_ai: { label: 'Outbound AI', color: 'bg-green-100 text-green-700' },
}

const open = defineModel<boolean>()
const activeTab = ref('overview')

const progressPercentage = computed(() => {
  if (!props.campaign?.total_leads) return 0
  return Math.round((props.campaign.dialed_leads / props.campaign.total_leads) * 100)
})

function editCampaign() {
  if (props.campaign?.id) {
    open.value = false
    navigateTo({ path: '/app/campaign/new-campaign', query: { id: props.campaign.id } })
  }
}

function startDialing() {
  if (props.campaign?.id) {
    open.value = false
    navigateTo({ path: '/app/start-dialing', query: { tab: 'lead-details', campaign_id: props.campaign.id } })
  }
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="min-w-[520px] max-w-[520px] gap-0 p-0 flex flex-col">
      <!-- Header -->
      <SheetHeader class="bg-gradient-to-r from-[#162D3A] to-[#1e3a4c] px-6 py-5">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <SheetTitle class="text-white text-lg font-semibold">
                {{ campaign?.title || 'Campaign Details' }}
              </SheetTitle>
              <Badge
                :class="campaign?.status === 1 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'"
                class="border"
              >
                {{ campaign?.status === 1 ? 'Active' : 'Inactive' }}
              </Badge>
            </div>
            <p class="text-gray-300 text-sm line-clamp-2">
              {{ campaign?.description || 'No description' }}
            </p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-3 mt-4">
          <div class="bg-white/10 rounded-lg p-3">
            <p class="text-gray-300 text-xs">Total Leads</p>
            <p class="text-white text-xl font-semibold">{{ formatWithCommas(campaign?.total_leads || 0) }}</p>
          </div>
          <div class="bg-white/10 rounded-lg p-3">
            <p class="text-gray-300 text-xs">Dialed</p>
            <p class="text-white text-xl font-semibold">{{ formatWithCommas(campaign?.dialed_leads || 0) }}</p>
          </div>
          <div class="bg-white/10 rounded-lg p-3">
            <p class="text-gray-300 text-xs">Hoppers</p>
            <p class="text-white text-xl font-semibold">{{ campaign?.hopper_count || 0 }}</p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="flex justify-between text-xs text-gray-300 mb-1">
            <span>Progress</span>
            <span>{{ progressPercentage }}%</span>
          </div>
          <Progress :model-value="progressPercentage" class="h-2 bg-white/20" />
        </div>
      </SheetHeader>

      <!-- Content with Tabs -->
      <div class="flex-1 overflow-y-auto">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="communication"
              class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              Communication
            </TabsTrigger>
          </TabsList>

          <!-- Overview Tab -->
          <TabsContent value="overview" class="p-6 space-y-6 m-0">
            <!-- Dial Mode -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm">
                  <Icon name="ic:outline-local-phone" class="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-500">Dial Mode</p>
                  <p class="font-medium text-gray-900">
                    {{ dialModes[campaign?.dial_mode || '']?.label || campaign?.dial_mode?.replace(/_/g, ' ') || 'N/A' }}
                  </p>
                </div>
              </div>
              <Badge :class="dialModes[campaign?.dial_mode || '']?.color || 'bg-gray-100 text-gray-700'">
                {{ dialModes[campaign?.dial_mode || '']?.label || 'Unknown' }}
              </Badge>
            </div>

            <!-- Key Details Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 border rounded-lg">
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                  <Icon name="lucide:flag" class="h-4 w-4" />
                  <span class="text-xs">Country Code</span>
                </div>
                <p class="font-medium text-gray-900">+{{ campaign?.country_code || 'N/A' }}</p>
              </div>

              <div class="p-4 border rounded-lg">
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                  <Icon name="clarity:user-line" class="h-4 w-4" />
                  <span class="text-xs">Caller ID</span>
                </div>
                <p class="font-medium text-gray-900">{{ callerIds[campaign?.caller_id || ''] || 'N/A' }}</p>
              </div>

              <div class="p-4 border rounded-lg">
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                  <Icon name="lucide:list" class="h-4 w-4" />
                  <span class="text-xs">Lists Associated</span>
                </div>
                <p class="font-medium text-gray-900">{{ campaign?.rowList || '0' }}</p>
              </div>

              <div class="p-4 border rounded-lg">
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                  <Icon name="lucide:calendar-days" class="h-4 w-4" />
                  <span class="text-xs">Created</span>
                </div>
                <p class="font-medium text-gray-900">
                  {{ campaign?.created_at ? moment(campaign.created_at, 'YYYY-MM-DD HH:mm:ss').format('MMM DD, YYYY') : 'N/A' }}
                </p>
              </div>
            </div>

            <!-- Custom Caller ID if applicable -->
            <div v-if="campaign?.custom_caller_id && campaign?.caller_id === 'custom'" class="p-4 border rounded-lg">
              <div class="flex items-center gap-2 text-gray-500 mb-1">
                <Icon name="lucide:user-round-cog" class="h-4 w-4" />
                <span class="text-xs">Custom Caller ID</span>
              </div>
              <p class="font-medium text-gray-900">{{ formatNumber(String(campaign?.custom_caller_id)) }}</p>
            </div>
          </TabsContent>

          <!-- Settings Tab -->
          <TabsContent value="settings" class="p-6 space-y-4 m-0">
            <!-- Time Based Calling -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <Icon name="material-symbols:clock-loader-60" class="h-5 w-5 text-gray-500" />
                <div>
                  <p class="font-medium text-gray-900">Time Based Calling</p>
                  <p v-if="campaign?.time_based_calling === 1 && campaign?.schedule_name" class="text-xs text-gray-500">
                    Schedule: {{ campaign.schedule_name }}
                  </p>
                </div>
              </div>
              <Badge :variant="campaign?.time_based_calling === 1 ? 'default' : 'secondary'">
                {{ campaign?.time_based_calling === 1 ? 'Enabled' : 'Disabled' }}
              </Badge>
            </div>

            <!-- Hopper Settings -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <Icon name="material-symbols-light:filter-alt-outline" class="h-5 w-5 text-gray-500" />
                <div>
                  <p class="font-medium text-gray-900">Hopper Count</p>
                  <p class="text-xs text-gray-500">Leads in queue for dialing</p>
                </div>
              </div>
              <span class="text-lg font-semibold text-gray-900">{{ campaign?.hopper_count || 0 }}</span>
            </div>

            <!-- Send to CRM -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <Icon name="lucide:rocket" class="h-5 w-5 text-gray-500" />
                <p class="font-medium text-gray-900">Send to CRM</p>
              </div>
              <Badge :variant="campaign?.send_crm === '1' ? 'default' : 'secondary'">
                {{ campaign?.send_crm === '1' ? 'Yes' : 'No' }}
              </Badge>
            </div>

            <!-- Send Report -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <Icon name="icon-park-solid:notepad" class="h-5 w-5 text-gray-500" />
                <p class="font-medium text-gray-900">Send Report</p>
              </div>
              <Badge :variant="campaign?.send_report === 1 ? 'default' : 'secondary'">
                {{ campaign?.send_report === 1 ? 'Yes' : 'No' }}
              </Badge>
            </div>
          </TabsContent>

          <!-- Communication Tab -->
          <TabsContent value="communication" class="p-6 space-y-4 m-0">
            <!-- Email -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <Icon name="lucide:mail" class="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Email</p>
                  <p class="text-xs text-gray-500">Send emails to leads</p>
                </div>
              </div>
              <Badge :variant="campaign?.email === '1' ? 'default' : 'secondary'" :class="campaign?.email === '1' ? 'bg-blue-600' : ''">
                {{ campaign?.email === '1' ? 'With User Email' : 'Disabled' }}
              </Badge>
            </div>

            <!-- SMS -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-50 rounded-lg">
                  <Icon name="lucide:message-square-text" class="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">SMS</p>
                  <p class="text-xs text-gray-500">Send SMS to leads</p>
                </div>
              </div>
              <Badge :variant="campaign?.sms === '1' ? 'default' : 'secondary'" :class="campaign?.sms === '1' ? 'bg-green-600' : ''">
                {{ campaign?.sms === '1' ? 'Enabled' : 'Disabled' }}
              </Badge>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Footer Actions -->
      <div class="border-t p-4 bg-gray-50 flex gap-3">
        <Button variant="outline" class="flex-1" @click="editCampaign">
          <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
          Edit Campaign
        </Button>
        <Button class="flex-1" :disabled="campaign?.status !== 1" @click="startDialing">
          <Icon name="material-symbols:call" class="mr-2 h-4 w-4" />
          Start Dialing
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
