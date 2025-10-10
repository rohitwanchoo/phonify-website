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

const route = useRoute()
// TODO: remove this after demo
const { session } = useUserSession()

const show = computed(() => {
  const baseRoute = '/app/start-dialing'
  const sidePanel = route.path.startsWith(baseRoute)
  return sidePanel
})

const selectedCampaign = ref()

const sidePanel = ref([
  {
    title: 'Lead Details',
    icon: 'material-symbols:person',
    link: '/app/start-dialing/lead-details',
  },
  {
    title: 'Send SMS',
    icon: 'material-symbols:chat',
    link: '/app/start-dialing/send-sms',
  },
  {
    title: 'Send Email',
    icon: 'material-symbols:mail',
    link: '/app/start-dialing/send-email',
  },
  {
    title: 'Agent Script',
    icon: 'material-symbols:script',
    link: '/app/start-dialing/agent-script',
  },
  {
    title: 'Notes',
    icon: 'material-symbols:description',
    link: '/app/start-dialing/notes',
  },
  {
    title: 'Events',
    icon: 'material-symbols:event',
    link: '/app/start-dialing/events',
  },
])

const isActive = (link: string) => route.path.startsWith(link)

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

const initiateLoading = ref(false)

function initiateCampaign() {
  if (selectedCampaign.value) {
    initiateLoading.value = true
    useApi().post('/extension-login', {
      campaign_id: selectedCampaign.value,
    }).then((res) => {
      showToast({ type: 'success', message: res.message })
    }).catch((err) => {
      handleError(err)
    }).finally(() => {
      initiateLoading.value = false
    })
  }
}

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
                <SelectItem value="mobile-app">
                  Mobile App
                </SelectItem>
                <SelectItem value="desk-phone">
                  Desk Phone
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button :loading="initiateLoading" :disabled="!selectedCampaign" class="h-11" @click="initiateCampaign">
            Submit
          </Button>
        </div>
      </template>
    </BaseHeader>

    <div v-if="selectedCampaign" class="flex max-h-[calc(100vh-166px)] h-full overflow-y-auto mt-6">
      <div v-if="show" class="lg:min-w-[300px] p-2 bg-primary flex flex-col gap-5 rounded-l-[20px] overflow-y-auto">
        <NuxtLink
          v-for="(item, index) in sidePanel"
          :key="index"
          :data-cy="`${item.title}-navigate`"
          :to="item.link"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:text-primary"
          :class="isActive(item.link) ? 'bg-white text-primary' : 'bg-primary text-white'"
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
    </div>
  </div>
</template>
