<script setup lang="ts">
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

const { callStatus, callerDetails, endCall, isRegistered } = useSIPml5()
const { closeDialer } = useDialer()

const selectedTab = ref(route.query.tab as string || 'lead-details')

const selectedCampaign = ref()

const sidePanel = computed(() => [
  {
    title: 'Lead Details',
    value: 'lead-details',
    icon: 'material-symbols:person',
    link: selectedCampaign.value ? `/app/start-dialing/lead-details?campaign_id=${selectedCampaign.value}` : '/app/start-dialing/lead-details',
    disabled: false,
  },
  {
    title: 'Send SMS',
    value: 'send-sms',
    icon: 'material-symbols:chat',
    link: selectedCampaign.value ? `/app/start-dialing/send-sms?campaign_id=${selectedCampaign.value}` : '/app/start-dialing/send-sms',
    disabled: false,
  },
  {
    title: 'Send Email',
    value: 'send-email',
    icon: 'material-symbols:mail',
    link: selectedCampaign.value ? `/app/start-dialing/send-email?campaign_id=${selectedCampaign.value}` : '/app/start-dialing/send-email',
    disabled: false,
  },
  {
    title: 'Agent Script',
    value: 'agent-script',
    icon: 'material-symbols:script',
    link: selectedCampaign.value ? `/app/start-dialing/agent-script?campaign_id=${selectedCampaign.value}` : '/app/start-dialing/agent-script',
    disabled: true,
  },
  {
    title: 'Notes',
    value: 'notes',
    icon: 'material-symbols:description',
    link: selectedCampaign.value ? `/app/start-dialing/notes?campaign_id=${selectedCampaign.value}` : '/app/start-dialing/notes',
    disabled: true,
  },
  {
    title: 'Events',
    value: 'events',
    icon: 'material-symbols:event',
    link: selectedCampaign.value ? `/app/start-dialing/events?campaign_id=${selectedCampaign.value}` : '/app/start-dialing/events',
    disabled: true,
  },
])

// onMounted(() => {
//   if (route.path === '/app/start-dialing') {
//     navigateTo('/app/start-dialing/lead-details')
//   }
// })

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
    campaign_id: selectedCampaign.value,
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
        campaign_id: selectedCampaign.value,
      },
    })
    initiateCampaign()
  }
}

onMounted(() => {
  if (route.query.campaign_id) {
    selectedCampaign.value = Number(route.query.campaign_id)
    initiateCampaign()
  }
})

// const leadDataTemp = {
//   success: true,
//   message: 'lead detail.',
//   number: '7622132802',
//   lead_id: 735448,
//   list_id: 202,
//   data: {
//     option_1: {
//       label: 'First Name',
//       value: 'Easify',
//       is_dialing: 0,
//       is_visible: 1,
//       is_editable: 0,
//       alternate_phone: null,
//     },
//     option_2: {
//       label: 'Last Name',
//       value: 'Two',
//       is_dialing: 0,
//       is_visible: 1,
//       is_editable: 0,
//       alternate_phone: null,
//     },
//     option_3: {
//       label: 'Mobile',
//       value: '7622132802',
//       is_dialing: 1,
//       is_visible: 1,
//       is_editable: 0,
//       alternate_phone: null,
//     },
//   },
// }
function setRouteForTabChange(val: string) {
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
          <Select v-model="selectedCampaign">
            <SelectTrigger class="lg:min-w-[300px] !h-11">
              <SelectValue placeholder="Select a Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-if="campaignListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                <Icon name="eos-icons:loading" />
              </SelectItem>
              <!-- if empty campaign list -->
              <SelectItem v-else-if="campaignList.length === 0" class="text-center justify-center" :value="null" disabled>
                No campaigns available
              </SelectItem>
              <template v-else>
                <SelectItem v-for="option in campaignList" :key="option.id" :value="option.id">
                  {{ option.title }}
                </SelectItem>
              </template>
            </SelectContent>
          </Select>
          <Select default-value="web-phone">
            <SelectTrigger class="lg:min-w-[300px] !h-11">
              <SelectValue placeholder="Web Phone" class="text-xs" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="web-phone">
                  Web Phone
                </SelectItem>
                <!-- <SelectItem value="mobile-app">
                  Mobile App
                </SelectItem>
                <SelectItem value="desk-phone">
                  Desk Phone
                </SelectItem> -->
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button :loading="initiateLoading" :disabled="!selectedCampaign || initiateLoading" class="h-11" @click="setRouteForInitCampaign">
            Submit
          </Button>
        </div>
      </template>
    </BaseHeader>

    <div class="h-full max-h-[calc(100vh-166px)]">
      <Tabs v-model="selectedTab" class="gap-0 w-full flex flex-row h-full overflow-y-auto mt-6 " orientation="vertical" @update:model-value="setRouteForTabChange">
        <div class=" bg-primary rounded-l-lg p-1">
          <TabsList class="flex flex-col justify-start w-[300px] bg-primary h-max !gap-y-[20px]">
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
        <TabsContent value="lead-details" class="bg-[#FAFAFA] rounded-r-lg">
          <StartDialingLeadDetails :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>
        <TabsContent value="send-sms" class="bg-[#FAFAFA] rounded-r-lg">
          <StartDialingSendSms :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>
        <TabsContent value="send-email" class="bg-[#FAFAFA] rounded-r-lg">
          <StartDialingSendEmail :lead-data="leadData" :lead-data-status="leadDataStatus" @refresh-lead-data="refreshLeadData" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
