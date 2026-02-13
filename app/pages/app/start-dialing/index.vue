<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const { user } = useAuth()

const { callStatus, endCall, isRegistered } = useSIPml5()
const { closeDialer } = useDialer()

const selectedTab = ref(route.query.tab as string || 'lead-details')

const selectedCampaign = ref<number[] | undefined>()
const campaignId = useRouteQuery('campaign_id')

// Track if a campaign is actively being worked
const isActiveCampaign = computed(() => !!campaignId.value)

const disableTab = computed(() => {
  if (campaignId.value && callStatus.value === 'active') {
    return false
  }
  return true
})

// Get selected campaign details for display
const selectedCampaignDetails = computed(() => {
  if (!selectedCampaign.value?.[0] || !campaignList.value) return null
  return campaignList.value.find((c: { id: number }) => c.id === selectedCampaign.value?.[0])
})

// Helper to build tab links
function buildTabLink(tabValue: string) {
  const base = `/app/start-dialing/${tabValue}`
  return selectedCampaign.value?.[0] ? `${base}?campaign_id=${selectedCampaign.value[0]}` : base
}

const sidePanel = computed(() => [
  {
    title: 'Lead Details',
    value: 'lead-details',
    icon: 'material-symbols:person',
    disabled: false,
  },
  {
    title: 'Send SMS',
    value: 'send-sms',
    icon: 'material-symbols:chat',
    disabled: disableTab.value,
  },
  {
    title: 'Send Email',
    value: 'send-email',
    icon: 'material-symbols:mail',
    disabled: disableTab.value,
  },
  {
    title: 'Agent Script',
    value: 'agent-script',
    icon: 'material-symbols:script',
    disabled: disableTab.value,
  },
  {
    title: 'Notes',
    value: 'notes',
    icon: 'material-symbols:description',
    disabled: disableTab.value,
  },
  {
    title: 'Events',
    value: 'events',
    icon: 'material-symbols:event',
    disabled: disableTab.value,
  },
])

const phoneType = [
  { label: 'Desktop Phone', value: 1 },
  { label: 'Web Phone', value: 2 },
  { label: 'Mobile App', value: 3 },
]

const { data: campaignList, status: campaignListStatus } = await useLazyAsyncData('campaign-list', () =>
  useApi().post('/agent-campaign'), {
  transform: res => res.data,
  immediate: true,
})

const { data: leadData, status: leadDataStatus, refresh: refreshLeadData } = await useLazyAsyncData('lead-details', () =>
  useApi().post(`/get-lead`), {
  transform: res => res,
  immediate: false,
})

const { data: extensionData, status: extensionStatus } = await useLazyAsyncData('extension-data', () =>
  useApi().get(`/extension/${user.value?.id}`), {
  transform: res => res.data,
  immediate: true,
})

// Notes data - using local server API
const notesData = ref<Array<{ id: number, note: string, created_at: string, user_name?: string }>>([])
const notesStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function refreshNotes() {
  if (!leadData.value?.lead_id) {
    return
  }

  notesStatus.value = 'pending'
  try {
    // Use local notes API
    const response = await $fetch('/api/notes/get', {
      method: 'POST',
      body: { lead_id: leadData.value.lead_id },
    })
    notesData.value = (response as any)?.data || []
    notesStatus.value = 'success'
  }
  catch (error: any) {
    console.error('Error fetching notes:', error)
    notesStatus.value = 'success'
    notesData.value = []
  }
}

// Events/Activity data - use existing CDR API
const eventsData = ref<Array<{ id: number, type?: string, title?: string, action?: string, description?: string, details?: string, created_at?: string, date?: string }>>([])
const eventsStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function refreshEvents() {
  if (!leadData.value?.number) {
    return
  }

  eventsStatus.value = 'pending'
  try {
    // Use existing CDR endpoint for call history
    const phoneNumber = leadData.value.number.replace(/(?!^\+)\D/g, '')
    const response = await useApi().post('/get-cdr', { phone_number: phoneNumber })
    // Transform CDR data to events format
    const cdrData = response?.data || response || []
    eventsData.value = Array.isArray(cdrData)
      ? cdrData.map((item: any, index: number) => ({
          id: item.id || index,
          type: 'call',
          title: item.disposition || 'Call',
          action: item.direction || 'Outbound',
          description: `Duration: ${item.duration || '0'}s`,
          details: item.notes || '',
          created_at: item.call_date || item.created_at || '',
          date: item.call_date || item.created_at || '',
        }))
      : []
    eventsStatus.value = 'success'
  }
  catch {
    eventsStatus.value = 'success' // Don't show error state
    eventsData.value = []
  }
}

// Agent Script data
const scriptData = ref<{ content?: string, script?: string } | null>(null)
const scriptStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function fetchScript() {
  if (!campaignId.value) {
    return
  }

  scriptStatus.value = 'pending'
  try {
    const response = await useApi().post('/get-agent-script', { campaign_id: campaignId.value })
    scriptData.value = response?.data || response || null
    scriptStatus.value = 'success'
  }
  catch {
    // Script might not be configured - fail gracefully
    scriptStatus.value = 'success'
    scriptData.value = null
  }
}

// Refresh notes and events when lead changes
watch(() => leadData.value?.lead_id, (newLeadId) => {
  if (newLeadId) {
    refreshNotes()
    refreshEvents()
  }
})

// Refresh script when campaign changes
watch(campaignId, (newCampaignId) => {
  if (newCampaignId) {
    fetchScript()
  }
}, { immediate: true })

const dialerMode = ref<number>()
const dialerModeLoading = ref(false)
const isInitialDialerModeLoad = ref(true)

// Set dialerMode from extensionData when available
watch(extensionData, (data) => {
  if (data?.dialer_mode) {
    dialerMode.value = Number(data.dialer_mode)
    nextTick(() => {
      isInitialDialerModeLoad.value = false
    })
  }
}, { immediate: true })

watch(dialerMode, (newVal) => {
  if (newVal && !isInitialDialerModeLoad.value) {
    handleDialerModeChange(newVal)
  }
})

async function handleDialerModeChange(mode: number) {
  dialerModeLoading.value = true
  try {
    const response = await useApi().post('/change-dialer-mode-extension', {
      dialer_mode: mode,
    })
    if (response.success) {
      showToast({
        message: response.message || 'Dialer mode updated successfully',
        type: 'success',
      })
    } else {
      showToast({
        message: response.message || 'Failed to update dialer mode',
        type: 'error',
      })
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message
      || error?.message
      || 'Failed to update dialer mode. Please try again.'
    showToast({
      message: errorMessage,
      type: 'error',
    })
  } finally {
    dialerModeLoading.value = false
  }
}

watch(leadData, (val) => {
  if (!val?.lead_id) {
    endCall()
    closeDialer()
    navigateTo('/app/start-dialing?tab=lead-details')
  }
})

const initiateLoading = ref(false)

async function initiateCampaign() {
  initiateLoading.value = true
  try {
    const res = await useApi().post('/extension-login', {
      campaign_id: selectedCampaign.value?.[0],
    })
    showToast({
      type: 'success',
      message: res.message || 'Campaign started successfully',
    })
    if (callStatus?.value === 'active') {
      refreshLeadData()
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message
      || error?.message
      || 'Failed to start campaign. Please try again.'
    showToast({
      message: errorMessage,
      type: 'error',
    })
  } finally {
    initiateLoading.value = false
  }
}

async function setRouteForInitCampaign() {
  if (!isRegistered.value) {
    showToast({
      message: 'Webphone is not registered. Please register it first.',
      type: 'warning',
    })
    return
  }
  if (selectedCampaign.value) {
    await navigateTo({
      query: {
        ...route.query,
        campaign_id: selectedCampaign.value[0],
      },
    })
    initiateCampaign()
  }
}

onMounted(() => {
  if (route.query.campaign_id) {
    selectedCampaign.value = [Number(route.query.campaign_id)]
    initiateCampaign()
  }
})

function setRouteForTabChange(val: string) {
  if (!val) return
  navigateTo({ name: route.name as string, params: route.params, query: { ...route.query, tab: val } })
}

// Notes functionality
const newNote = ref('')
const noteSaving = ref(false)

async function saveNote() {
  if (!newNote.value.trim() || !leadData.value?.lead_id) {
    return
  }

  noteSaving.value = true
  try {
    // Use local notes API
    const response = await $fetch('/api/notes/save', {
      method: 'POST',
      body: {
        lead_id: leadData.value.lead_id,
        note: newNote.value.trim(),
        user_name: user.value?.name || user.value?.email || 'Agent',
      },
    })

    if ((response as any)?.success) {
      showToast({ message: 'Note saved successfully', type: 'success' })
      newNote.value = ''
      refreshNotes()
    }
    else {
      showToast({
        message: (response as any)?.message || 'Failed to save note',
        type: 'error',
      })
    }
  }
  catch (error: any) {
    console.error('Error saving note:', error)
    showToast({
      message: error?.data?.message || error?.message || 'Failed to save note',
      type: 'error',
    })
  }
  finally {
    noteSaving.value = false
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <!-- HEADER -->
    <BaseHeader>
      <template #actions>
        <div class="flex gap-3 items-center flex-wrap">
          <!-- Active Campaign Indicator -->
          <div v-if="isActiveCampaign && selectedCampaignDetails" class="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span class="text-sm text-green-700 font-medium">{{ selectedCampaignDetails.title }}</span>
          </div>

          <DsCombobox
            v-model="selectedCampaign"
            :options="campaignList"
            value-key="id"
            label-key="title"
            :placeholder="campaignListStatus === 'pending' ? 'Loading campaigns...' : 'Select a Campaign'"
            class="lg:min-w-[300px] !h-11"
            search-placeholder="Search Agent Campaigns"
            :disabled="campaignListStatus === 'pending'"
          />

          <Select v-model="dialerMode">
            <SelectTrigger class="lg:min-w-[200px] !h-11">
              <SelectValue placeholder="Select Dialer Mode" class="text-sm placeholder:text-gray-600" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-if="extensionStatus === 'pending' || dialerModeLoading" class="text-center justify-center" :value="0" disabled>
                  <Icon name="eos-icons:loading" class="animate-spin" />
                </SelectItem>
                <template v-else>
                  <SelectItem v-for="item in phoneType" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </SelectItem>
                </template>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            :loading="initiateLoading"
            :disabled="!selectedCampaign || initiateLoading"
            class="h-11 min-w-[140px]"
            @click="setRouteForInitCampaign"
          >
            <Icon v-if="!initiateLoading" name="material-symbols:play-arrow" size="20" />
            {{ isActiveCampaign ? 'Restart Dialing' : 'Start Dialing' }}
          </Button>
        </div>
      </template>
    </BaseHeader>

    <div class="h-[calc(100vh-180px)]">
      <Tabs v-model="selectedTab" class="gap-0 w-full flex h-full flex-row items-stretch mt-6" orientation="vertical" @update:model-value="setRouteForTabChange">
        <div class="bg-primary rounded-l-lg p-1 h-full">
          <TabsList class="flex flex-col justify-start w-[300px] bg-primary h-full !gap-y-[20px]">
            <TabsTrigger
              v-for="item in sidePanel"
              :key="item.value"
              :value="item.value"
              :disabled="item.disabled"
              class="flex items-center w-full !max-h-[48px] justify-start gap-3 p-3 rounded bg-primary text-white data-[state=active]:bg-white data-[state=active]:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon :name="item.icon" size="24" />
              {{ item.title }}
              <Badge v-if="item.disabled && item.value !== 'lead-details'" variant="outline" class="ml-auto text-xs bg-white/10 text-white border-white/20">
                Active call required
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <!-- Lead Details Tab -->
        <TabsContent value="lead-details" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto">
          <StartDialingLeadDetails :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>

        <!-- Send SMS Tab -->
        <TabsContent value="send-sms" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto">
          <StartDialingSendSms :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>

        <!-- Send Email Tab -->
        <TabsContent value="send-email" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto">
          <StartDialingSendEmail :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>

        <!-- Agent Script Tab -->
        <TabsContent value="agent-script" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto p-5">
          <div v-if="scriptStatus === 'pending'" class="animate-pulse space-y-4">
            <div class="h-6 bg-gray-200 rounded w-1/3" />
            <div class="h-4 bg-gray-200 rounded w-full" />
            <div class="h-4 bg-gray-200 rounded w-5/6" />
            <div class="h-4 bg-gray-200 rounded w-4/6" />
          </div>
          <div v-else-if="scriptData" class="bg-white border border-gray-100 rounded-lg p-5">
            <h3 class="text-lg font-medium text-primary mb-4 flex items-center gap-2">
              <Icon name="material-symbols:script" size="24" />
              Agent Script
            </h3>
            <div class="prose prose-sm max-w-none text-gray-700" v-html="scriptData.content || scriptData.script || 'No script content available.'" />
          </div>
          <div v-else class="text-center py-10">
            <Icon name="material-symbols:script" size="48" class="text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No script available for this campaign.</p>
          </div>
        </TabsContent>

        <!-- Notes Tab -->
        <TabsContent value="notes" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto p-5">
          <div class="bg-white border border-gray-100 rounded-lg p-5 mb-4">
            <h3 class="text-lg font-medium text-primary mb-4 flex items-center gap-2">
              <Icon name="material-symbols:add-notes" size="24" />
              Add Note
            </h3>
            <textarea
              v-model="newNote"
              class="w-full min-h-[100px] text-primary text-sm leading-[150%] p-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Type your note here..."
            />
            <div class="mt-3 flex justify-end">
              <Button :loading="noteSaving" :disabled="!newNote.trim() || noteSaving" @click="saveNote">
                <Icon name="material-symbols:save" size="18" />
                Save Note
              </Button>
            </div>
          </div>

          <!-- Notes List -->
          <div class="bg-white border border-gray-100 rounded-lg p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-primary flex items-center gap-2">
                <Icon name="material-symbols:description" size="24" />
                Previous Notes
              </h3>
              <span v-if="notesData?.length" class="text-xs text-gray-400">{{ notesData.length }} note{{ notesData.length !== 1 ? 's' : '' }}</span>
            </div>
            <div v-if="notesStatus === 'pending'" class="animate-pulse space-y-3">
              <div v-for="n in 3" :key="n" class="p-3 bg-gray-50 rounded-lg">
                <div class="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                <div class="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
            <div v-else-if="notesData?.length" class="space-y-3 max-h-[400px] overflow-y-auto">
              <div v-for="note in notesData" :key="note.id" class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-500">{{ note.created_at || note.date }}</span>
                  <span v-if="note.user_name" class="text-xs text-gray-400">by {{ note.user_name }}</span>
                </div>
                <p class="text-sm text-gray-700">{{ note.note || note.content }}</p>
              </div>
            </div>
            <div v-else class="text-center py-6">
              <Icon name="material-symbols:notes" size="32" class="text-gray-300 mx-auto mb-2" />
              <p class="text-gray-500 text-sm">No notes yet. Add one above!</p>
            </div>
          </div>
        </TabsContent>

        <!-- Events Tab -->
        <TabsContent value="events" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto p-5">
          <div class="bg-white border border-gray-100 rounded-lg p-5">
            <h3 class="text-lg font-medium text-primary mb-4 flex items-center gap-2">
              <Icon name="material-symbols:event" size="24" />
              Activity Timeline
            </h3>
            <div v-if="eventsStatus === 'pending'" class="animate-pulse space-y-4">
              <div v-for="n in 5" :key="n" class="flex gap-3">
                <div class="h-8 w-8 bg-gray-200 rounded-full" />
                <div class="flex-1">
                  <div class="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                  <div class="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>
            <div v-else-if="eventsData?.length" class="relative">
              <!-- Timeline line -->
              <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div class="space-y-4">
                <div v-for="event in eventsData" :key="event.id" class="flex gap-4 relative">
                  <!-- Timeline dot -->
                  <div class="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-green-100': event.type === 'call',
                      'bg-blue-100': event.type === 'sms' || event.type === 'email',
                      'bg-yellow-100': event.type === 'disposition',
                      'bg-gray-100': !event.type
                    }"
                  >
                    <Icon
                      :name="event.type === 'call' ? 'material-symbols:call' :
                             event.type === 'sms' ? 'material-symbols:chat' :
                             event.type === 'email' ? 'material-symbols:mail' :
                             event.type === 'disposition' ? 'material-symbols:check-circle' :
                             'material-symbols:event'"
                      size="16"
                      :class="{
                        'text-green-600': event.type === 'call',
                        'text-blue-600': event.type === 'sms' || event.type === 'email',
                        'text-yellow-600': event.type === 'disposition',
                        'text-gray-600': !event.type
                      }"
                    />
                  </div>
                  <div class="flex-1 pb-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-900">{{ event.title || event.action }}</span>
                      <span class="text-xs text-gray-500">{{ event.created_at || event.date }}</span>
                    </div>
                    <p v-if="event.description || event.details" class="text-sm text-gray-600 mt-1">
                      {{ event.description || event.details }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10">
              <Icon name="material-symbols:event" size="48" class="text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">No activity recorded yet.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
