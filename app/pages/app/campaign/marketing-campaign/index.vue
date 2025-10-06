<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AddCampaign from '@/components/campaign/marketing-campaign/AddCampaign.vue'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
// Dummy data for testing
const dummyCampaigns = [
  {
    id: 1,
    campaign_name: 'Email Marketing',
    description: 'Vibrant campaign focused on community engagement and local events.',
    status: 1,
  },
  {
    id: 2,
    campaign_name: 'New Year – Flash Marketing',
    description: 'Seasonal promotion highlighting unique products and services.',
    status: 1,
  },
  {
    id: 3,
    campaign_name: 'Billing – Marketing',
    description: 'Campaign aimed at boosting brand awareness through social media.',
    status: 1,
  },
  {
    id: 4,
    campaign_name: 'Spring Blossom Promotions',
    description: 'Aimed at promoting educational resources and workshops.',
    status: 1,
  },
  {
    id: 5,
    campaign_name: 'Summer Splash Sales',
    description: 'Local outreach initiative designed to foster connections.',
    status: 1,
  },
  {
    id: 6,
    campaign_name: 'Autumn Harvest Deals',
    description: 'Promotional campaign celebrating local artisans and crafts.',
    status: 1,
  },
  {
    id: 7,
    campaign_name: 'Winter Wonderland Offers',
    description: 'Campaign centered around eco–friendly products and sustainability.',
    status: 1,
  },
  {
    id: 8,
    campaign_name: 'Festive Cheer Campaign',
    description: 'Promotional effort to increase foot traffic in local businesses.',
    status: 1,
  },
  {
    id: 9,
    campaign_name: 'Holiday Spirit Promotions',
    description: 'Campaign focused on family–friendly events and activities.',
    status: 1,
  },
  {
    id: 10,
    campaign_name: 'New Year New You Campaign',
    description: 'Highlighting local cuisine and dining experiences.',
    status: 1,
  },
  {
    id: 11,
    campaign_name: 'Back to School Bonanza',
    description: 'Digital marketing campaign targeting young professionals.',
    status: 1,
  },
  {
    id: 12,
    campaign_name: 'Valentine\'s Day Specials',
    description: 'Promoting health and wellness through community events.',
    status: 1,
  },
]
const dummyLeads = dummyCampaigns
const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 4,
}

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')
const showAddCampaign = ref(false)

const router = useRouter()

// Pagination and filtering logic
const filteredList = computed(() => {
  if (!dummyLeads)
    return []
  const query = searchQuery.value.toLowerCase()
  return dummyLeads.filter(item =>
    item.api_name?.toLowerCase().includes(query)
    || item.campaign_name?.toLowerCase().includes(query)
    || item.method?.toLowerCase().includes(query)
    || item.status?.toLowerCase().includes(query),
  )
})

const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return filteredList.value.slice(start, end)
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}

watch(searchQuery, () => {
  pageStart.value = 0
})

const totalRows = computed(() => filteredList.value.length)
const currentPage = computed(() => Math.floor(pageStart.value / limit.value) + 1)
const lastPage = computed(() => Math.ceil(totalRows.value / limit.value))
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Marketing Campaign">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button @click="showAddCampaign = true">
          <Icon class="mr-1" name="lucide:plus" />
          Add Campaign
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CampaignMarketingCampaignTable
        :list="paginatedList"
        :meta="meta"
        :loading="false"
      />
    </div>
    <div v-if="totalRows" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
      <div class="flex-1 text-xs text-primary">
        <div class="flex items-center gap-x-2 justify-center sm:justify-start">
          Showing {{ currentPage }} to
          <span>
            <select v-model="limit" class="border rounded px-2 py-1 text-xs" @change="changeLimit(Number($event.target.value))">
              <option v-for="n in [10, 15, 20, 50]" :key="n" :value="n">{{ n }}</option>
            </select>
          </span>
          of {{ totalRows }} entries
        </div>
      </div>
      <div class="space-x-2">
        <TableServerPagination
          :total-items="Number(totalRows)"
          :current-page="Number(currentPage)"
          :items-per-page="Number(limit)"
          :last-page="Number(lastPage)"
          @page-change="changePage"
        />
      </div>
    </div>
  </div>
  <AddCampaign v-model:open="showAddCampaign" />
</template>
