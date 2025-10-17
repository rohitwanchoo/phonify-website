<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const { session } = useUserSession()
const { callStatus, callerDetails, endCall, isRegistered } = useSIPml5()
const { closeDialer } = useDialer()

const selectedTab = ref()

const show = computed(() => {
  const baseRoute = '/app/start-dialing'
  const sidePanel = route.path.startsWith(baseRoute)
  return sidePanel
})

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
    disabled: true,
  },
  {
    title: 'Send Email',
    value: 'send-email',
    icon: 'material-symbols:mail',
    link: selectedCampaign.value ? `/app/start-dialing/send-email?campaign_id=${selectedCampaign.value}` : '/app/start-dialing/send-email',
    disabled: true,
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

function isActive(link: string) {
  const base = link.split('?')[0]
  return base ? route.path.startsWith(base) : false
}

onMounted(() => {
  if (route.path === '/app/start-dialing') {
    navigateTo('/app/start-dialing/lead-details')
  }
})

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
    navigateTo('/app/start-dialing/lead-details')
  }
})

// watch(() => callStatus?.value, (currentState) => {
//   // call status active
//   if (currentState === 'active') {
//     setTimeout(() => {
//       refreshLeadData()
//     }, 2000)
//     // Small delay to ensure UI transitions smoothly
//     // nextTick(() => {
//     //   openDisposition.value = true
//     // })
//   }
// }, { immediate: true })

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
      message: 'Webphone is not registered. Please refresh the page and try again.',
      type: 'error',
    })
    return
  }
  if (selectedCampaign.value) {
    await navigateTo({
      query: {
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

// function initiateCampaign() {
//   if (selectedCampaign.value) {
//     initiateLoading.value = true
//     $fetch('https://api.voiptella.com/extension-login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${session.value?.token}`,
//       },
//       body: JSON.stringify({
//         campaign_id: selectedCampaign.value,
//       }),
//     }).then((res: any) => {
//       showToast({ type: 'success', message: res.message })
//     }).catch((err) => {
//       handleError(err)
//     }).finally(() => {
//       initiateLoading.value = false
//     })
//   }
// }
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
          <Button :loading="initiateLoading" :disabled="!selectedCampaign" class="h-11" @click="setRouteForInitCampaign">
            Submit
          </Button>
        </div>
      </template>
    </BaseHeader>

    <!-- <div class="flex max-h-[calc(100vh-166px)] h-full overflow-y-auto mt-6">
      <div v-if="show" class="lg:min-w-[300px] p-2 bg-primary flex flex-col gap-5 rounded-l-[20px] overflow-y-auto">
        <NuxtLink
          v-for="(item, index) in sidePanel"
          :key="index"
          :data-cy="`${item.title}-navigate`"
          :to="!item.disabled ? item.link : null"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:text-primary"
          :class="[
            isActive(item.link) ? 'bg-white text-primary' : 'bg-primary text-white',
            item.disabled && 'opacity-50 cursor-not-allowed',
          ]"
        >
          <Icon :name="item.icon" size="24" />
          <span class="text-sm">
            {{ item.title }}
          </span>
        </NuxtLink>
      </div>

      <div class="h-full w-full overflow-y-auto">
        <NuxtPage />
      </div>
    </div> -->
    <div class="h-full max-h-[calc(100vh-166px)]">
      <Tabs v-model="selectedTab" default-value="lead-details" class="gap-0 w-full flex flex-row h-full overflow-y-auto mt-6 " orientation="vertical">
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
      </Tabs>
    </div>
  </div>
</template>
