<script setup lang="ts">
import { Check, ChevronsUpDown, Filter, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Campaign {
  id: number
  title: string
  status: number
  totalLeads: number
  dialedLeads: number
}

const emit = defineEmits<{
  campaignChange: [campaignId: number | null]
}>()

const open = ref(false)
const selectedCampaign = ref<Campaign | null>(null)

const { data: campaigns, status } = await useLazyAsyncData('dashboard-campaigns-list', async () => {
  try {
    const response = await useApi().get('/campaigns')
    return (response.data || response || []).map((c: any) => ({
      id: c.id,
      title: c.title || c.name,
      status: c.status,
      totalLeads: c.total_leads || c.totalLeads || 0,
      dialedLeads: c.dialed_leads || c.dialedLeads || 0,
    })) as Campaign[]
  }
  catch {
    return []
  }
})

const isLoading = computed(() => status.value === 'pending')

const activeCampaigns = computed(() => {
  if (!campaigns.value)
    return []
  return campaigns.value.filter(c => c.status === 1)
})

const inactiveCampaigns = computed(() => {
  if (!campaigns.value)
    return []
  return campaigns.value.filter(c => c.status !== 1)
})

function selectCampaign(campaign: Campaign) {
  selectedCampaign.value = campaign
  open.value = false
  emit('campaignChange', campaign.id)
}

function clearSelection() {
  selectedCampaign.value = null
  emit('campaignChange', null)
}

function getProgress(dialed: number, total: number): number {
  if (total === 0)
    return 0
  return Math.round((dialed / total) * 100)
}
</script>

<template>
  <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
    <div class="flex items-center gap-2 text-sm text-gray-600">
      <Filter class="w-4 h-4" />
      <span class="font-medium">Filter by Campaign:</span>
    </div>

    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="w-[280px] justify-between"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <Icon name="eos-icons:loading" class="w-4 h-4" />
            Loading...
          </span>
          <span v-else-if="selectedCampaign" class="truncate">
            {{ selectedCampaign.title }}
          </span>
          <span v-else class="text-gray-500">
            All Campaigns
          </span>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search campaigns..." />
          <CommandList>
            <CommandEmpty>No campaign found.</CommandEmpty>

            <!-- All Campaigns Option -->
            <CommandGroup>
              <CommandItem
                value="all"
                class="cursor-pointer"
                @select="clearSelection"
              >
                <Check
                  :class="cn(
                    'mr-2 h-4 w-4',
                    !selectedCampaign ? 'opacity-100' : 'opacity-0',
                  )"
                />
                <span>All Campaigns</span>
              </CommandItem>
            </CommandGroup>

            <!-- Active Campaigns -->
            <CommandGroup v-if="activeCampaigns.length" heading="Active Campaigns">
              <CommandItem
                v-for="campaign in activeCampaigns"
                :key="campaign.id"
                :value="campaign.title"
                class="cursor-pointer"
                @select="selectCampaign(campaign)"
              >
                <Check
                  :class="cn(
                    'mr-2 h-4 w-4',
                    selectedCampaign?.id === campaign.id ? 'opacity-100' : 'opacity-0',
                  )"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="truncate">{{ campaign.title }}</span>
                    <Badge variant="success" class="ml-2 text-[10px]">
                      Active
                    </Badge>
                  </div>
                  <div class="text-xs text-gray-500 mt-0.5">
                    {{ formatWithCommas(campaign.dialedLeads) }}/{{ formatWithCommas(campaign.totalLeads) }} leads
                    ({{ getProgress(campaign.dialedLeads, campaign.totalLeads) }}%)
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>

            <!-- Inactive Campaigns -->
            <CommandGroup v-if="inactiveCampaigns.length" heading="Inactive Campaigns">
              <CommandItem
                v-for="campaign in inactiveCampaigns"
                :key="campaign.id"
                :value="campaign.title"
                class="cursor-pointer opacity-60"
                @select="selectCampaign(campaign)"
              >
                <Check
                  :class="cn(
                    'mr-2 h-4 w-4',
                    selectedCampaign?.id === campaign.id ? 'opacity-100' : 'opacity-0',
                  )"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="truncate">{{ campaign.title }}</span>
                    <Badge variant="secondary" class="ml-2 text-[10px]">
                      Inactive
                    </Badge>
                  </div>
                  <div class="text-xs text-gray-500 mt-0.5">
                    {{ formatWithCommas(campaign.dialedLeads) }}/{{ formatWithCommas(campaign.totalLeads) }} leads
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <!-- Selected Campaign Badge -->
    <div v-if="selectedCampaign" class="flex items-center gap-2">
      <Badge variant="default" class="flex items-center gap-1">
        {{ selectedCampaign.title }}
        <button class="ml-1 hover:bg-white/20 rounded" @click="clearSelection">
          <X class="w-3 h-3" />
        </button>
      </Badge>
      <span class="text-xs text-gray-500">
        {{ getProgress(selectedCampaign.dialedLeads, selectedCampaign.totalLeads) }}% complete
      </span>
    </div>
  </div>
</template>
