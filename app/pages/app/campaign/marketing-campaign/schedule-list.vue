<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import AddEmailSchedule from '~/components/campaign/marketing-campaign/AddEmailSchedule.vue'
import AddTextSchedule from '~/components/campaign/marketing-campaign/AddTextSchedule.vue'
import { Input } from '~/components/ui/input'
import { computed, ref } from 'vue'

const showAddEmailSchedule = ref(false)
const showAddTextSchedule = ref(false)

const route = useRoute()
const campaignName = computed(() => route.query.name || 'Schedule List') // 👈 this

const breadcrumbs = [
  {
    label: 'Marketing Campaign',
    href: '/app/campaign/marketing-campaign',
  },
  {
    label: 'Schedule-List',
    href: '/app/campaign/marketing-campaign/schedule-list',
    active: true,
  },
]
</script>


<template>
  <div class="flex flex-col h-[calc(100vh-110px)] overflow-auto">
    <div class="flex-1 overflow-y-auto">
      <!-- Header with breadcrumb and buttons -->
      <BaseHeader :title="campaignName" :breadcrumbs="breadcrumbs">
        <template #actions>
          <!-- Search -->
          <div class="relative mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>

          <!-- Add Buttons -->
          <Button class="mt-4 md:mt-0 hover:bg-white text-black bg-white border border-black" @click="showAddEmailSchedule = true">
            <Icon name="lucide:plus" class="w-4 h-4" />
             Email Schedule
          </Button>
          <Button class="mt-4 md:mt-0 text-black hover:bg-white bg-white border border-black" @click="showAddTextSchedule = true">
            <Icon name="lucide:plus" class="w-4 h-4" />
           Text Schedule
          </Button>
          <!-- Modals -->
          <AddEmailSchedule v-model:open="showAddEmailSchedule" />
          <AddTextSchedule v-model:open="showAddTextSchedule" />
        </template>
      </BaseHeader>

      <!-- Table -->
      <CampaignMarketingCampaignTableScheduleListTable />
    </div>
  </div>
</template>

