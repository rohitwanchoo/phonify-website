<script setup lang="ts">
import { Button } from '@/components/ui/button'

const route = useRoute()

// get lead detail with ID from params
const { data: leadData, status: leadStatus } = await useLazyAsyncData('lead-details', () =>
  useApi().get(`/lead/${route.params.id}`), {
  transform: res => res.data,
})

// define leadActivityData manually
const leadActivityData = ref()
const leadDispositionData = ref()

// watch leadStatus
watch(leadStatus, async (newStatus) => {
  if (newStatus !== 'pending' && leadData.value?.phone_number) {
    const { data: leadActivity } = await useApi().post('/get-cdr', {
      phone_number: leadData.value.phone_number,
    })
    leadActivityData.value = leadActivity

    const { data: disposition } = await useApi().post('/search-recycle-rule', {
      phone_number: leadData.value.phone_number,
    })
    leadDispositionData.value = disposition
  }
})

// Lead full name
const leadFullName = computed(() => {
  if (!leadData.value)
    return ''
  return `${leadData.value.first_name ?? ''} ${leadData.value.last_name ?? ''}`.trim()
})

const breadcrumbs = [
  {
    label: 'Lead',
    href: '/app/lead-management/lead',
    active: false,
  },
  {
    label: 'Lead Activity',
    active: true,
  },
]
</script>

<template>
  <BaseHeader :title="leadFullName" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button class="h-8 md:h-11 px-2 md:px-4 ">
        <Icon name="icons:export" class="text-sm" />
        Export
      </Button>
    </template>
  </BaseHeader>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-4">
      <LeadManagementLeadDetails :data="leadData" />
    </div>
    <div class="lg:col-span-8">
      <LeadManagementLeadLeadTabs :activity-data="leadActivityData" :lead-data="leadData" />
    </div>
  </div>
</template>
