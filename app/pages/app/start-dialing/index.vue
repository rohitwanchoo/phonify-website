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

const route = useRoute()
const { user } = useAuth()

const { callStatus, endCall, isRegistered, callerDetails: _callerDetails } = useSIPml5()
const { closeDialer } = useDialer()

const selectedTab = ref(route.query.tab as string || 'lead-details')

const selectedCampaign = ref()
const campaignId = useRouteQuery('campaign_id')

const disableTab = computed(() => {
  if (campaignId.value && callStatus.value === 'active') {
    return false
  }
  return true
})

const sidePanel = computed(() => [
  {
    title: 'Lead Details',
    value: 'lead-details',
    icon: 'material-symbols:person',
    link: selectedCampaign.value?.[0] ? `/app/start-dialing/lead-details?campaign_id=${selectedCampaign.value[0]}` : '/app/start-dialing/lead-details',
    disabled: false,
  },
  {
    title: 'Send SMS',
    value: 'send-sms',
    icon: 'material-symbols:chat',
    link: selectedCampaign.value?.[0] ? `/app/start-dialing/send-sms?campaign_id=${selectedCampaign.value[0]}` : '/app/start-dialing/send-sms',
    disabled: disableTab.value,
  },
  {
    title: 'Send Email',
    value: 'send-email',
    icon: 'material-symbols:mail',
    link: selectedCampaign.value?.[0] ? `/app/start-dialing/send-email?campaign_id=${selectedCampaign.value[0]}` : '/app/start-dialing/send-email',
    disabled: disableTab.value,
  },
  {
    title: 'Agent Script',
    value: 'agent-script',
    icon: 'material-symbols:script',
    link: selectedCampaign.value?.[0] ? `/app/start-dialing/agent-script?campaign_id=${selectedCampaign.value[0]}` : '/app/start-dialing/agent-script',
    disabled: true,
  },
  {
    title: 'Notes',
    value: 'notes',
    icon: 'material-symbols:description',
    link: selectedCampaign.value?.[0] ? `/app/start-dialing/notes?campaign_id=${selectedCampaign.value[0]}` : '/app/start-dialing/notes',
    disabled: true,
  },
  {
    title: 'Events',
    value: 'events',
    icon: 'material-symbols:event',
    link: selectedCampaign.value?.[0] ? `/app/start-dialing/events?campaign_id=${selectedCampaign.value[0]}` : '/app/start-dialing/events',
    disabled: true,
  },
])

const phoneType = [
  {
    label: 'Desktop Phone',
    value: 1,
  },
  {
    label: 'Web Phone',
    value: 2,
  },
  {
    label: 'Mobile App',
    value: 3,
  },
]

// Removed unused isActive helper to satisfy lint rules

// onMounted(() => {
//   if (route.path === '/app/start-dialing') {
//     navigateTo('/app/start-dialing/lead-details')
//   }
// })

const { data: campaignList, status: _campaignListStatus } = await useLazyAsyncData('campaign-list', () =>
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

const dialerMode = ref()
const dialerModeLoading = ref(false)
const isInitialDialerModeLoad = ref(true) // Add this flag

// Set dialerMode from extensionData when available
watch(extensionData, (data) => {
  if (data?.dialer_mode) {
    dialerMode.value = Number(data.dialer_mode)
    // Reset the flag after initial load
    nextTick(() => {
      isInitialDialerModeLoad.value = false
    })
  }
}, { immediate: true })

watch(dialerMode, (newVal) => {
  // Only call API if it's not the initial load and there's a value
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
        message: response.message,
        type: 'success',
      })
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: error?.message,
      type: 'error',
    })
  }
  finally {
    dialerModeLoading.value = false
  }
}

watch(leadData, (val) => {
  if (!val.lead_id) {
    endCall()
    closeDialer()
    navigateTo('/app/start-dialing?tab=lead-details')
  }
})

const initiateLoading = ref(false)

function initiateCampaign() {
  initiateLoading.value = true
  useApi().post('/extension-login', {
    campaign_id: selectedCampaign.value?.[0],
  }).then((res) => {
    showToast({ type: 'success', message: res.message })
    if (callStatus?.value === 'active') {
      refreshLeadData()
    }
  }).catch((err) => {
    handleError(err)
  }).finally(() => {
    initiateLoading.value = false
  })
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

function setRouteForTabChange(val: any) {
  if (!val)
    return
  navigateTo({ name: route.name as string, params: route.params, query: { ...route.query, tab: val } })
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <!-- HEADER -->
    <BaseHeader>
      <template #actions>
        <div class="flex gap-3 items-center">
          <DsCombobox
            v-model="selectedCampaign"
            :options="campaignList"
            value-key="id"
            label-key="title"
            placeholder="Select a Campaign"
            class="lg:min-w-[300px] !h-11"
            search-placeholder="Search Agent Campaigns"
          />

          <Select v-model="dialerMode">
            <SelectTrigger class="lg:min-w-[300px] !h-11">
              <SelectValue placeholder="Select Dialer Mode" class="text-sm placeholder:text-gray-600" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-if="extensionStatus === 'pending' || dialerModeLoading" class="text-center justify-center" :value="null" disabled>
                  <Icon name="eos-icons:loading" />
                </SelectItem>
                <template v-else>
                  <SelectItem v-for="(item, index) in phoneType" :key="index" :value="item.value">
                    {{ item.label }}
                  </SelectItem>
                </template>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button :loading="initiateLoading" :disabled="!selectedCampaign || initiateLoading" class="h-11" @click="setRouteForInitCampaign">
            Submit
          </Button>
        </div>
      </template>
    </BaseHeader>

    <div class="h-[calc(100vh-180px)] ">
      <Tabs v-model="selectedTab" class="gap-0 w-full flex h-full flex-row items-stretch mt-6" orientation="vertical" @update:model-value="setRouteForTabChange">
        <div class=" bg-primary rounded-l-lg p-1 h-full">
          <TabsList class="flex flex-col justify-start w-[300px] bg-primary h-full !gap-y-[20px]">
            <TabsTrigger
              v-for="(item, index) in sidePanel" :key="index" :value="item.value"
              :disabled="item.disabled"

              class="flex items-center w-full !max-h-[48px] justify-start gap-3 p-3 rounded bg-primary text-white data-[state=active]:bg-white data-[state=active]:text-primary "
            >
              <Icon :name="item.icon" size="24" />
              {{ item.title }}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="lead-details" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto">
          <StartDialingLeadDetails :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>
        <TabsContent value="send-sms" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto">
          <StartDialingSendSms :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>
        <TabsContent value="send-email" class="flex-1 h-full min-h-0 bg-[#FAFAFA] rounded-r-lg overflow-y-auto">
          <StartDialingSendEmail :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
