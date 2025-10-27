<script setup lang="ts">
import { Button } from '@/components/ui/button'

const route = useRoute()

const leadID = route.params.id

const listId = route.query.list_id

// get lead detail with ID from params
const { data: leadData, status: leadStatus } = await useLazyAsyncData('lead-details', () =>
  useApi().post('/get-data-for-edit-lead-page', {
    lead_id: leadID,
    parent_id: listId,
  }), {
  transform: res => res.data.leadData,
})

const leadNumber = ref('')
// get lead activity data
const { data: leadActivityData, status: leadActivityStatus, refresh: refreshLeadActivity } = await useLazyAsyncData('lead-activity', () =>
  useApi().post('/get-cdr', {
    phone_number: leadNumber.value,
  }), {
  immediate: false,
})

// if leadStatus === success and leadData.length > 0 then refresh leadActivityData
watch(leadStatus, async (newStatus) => {
  if (newStatus === 'success' && Object.keys(leadData.value).length > 0) {
    const isDialingObject = Object.values(leadData.value).find((item: any) => item?.is_dialing === 1)
    if (isDialingObject) {
      leadNumber.value = (isDialingObject as any).value
      await refreshLeadActivity()
    }
  }
})

const leadDispositionData = ref()

// watch leadStatus
watch(leadStatus, async (newStatus) => {
  if (newStatus !== 'pending' && leadData.value?.phone_number) {
    // const { data: leadActivity } = await useApi().post('/get-cdr', {
    //   phone_number: leadData.value.phone_number,
    // })
    // leadActivityData.value = leadActivity

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

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
    <div class="lg:col-span-4">
      <LeadManagementLeadDetails :data="leadData" :loading="leadStatus === 'pending'" />
    </div>
    <div class="lg:col-span-8">
      <LeadManagementLeadLeadTabs :activity-loading="leadActivityStatus === 'pending' || leadStatus === 'pending'" :activity-data="leadActivityData" :lead-data="leadData" />
    </div>
  </div>
</template>
