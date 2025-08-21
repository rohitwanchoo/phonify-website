<script setup lang="ts">
import { Button } from '@/components/ui/button'

const route = useRoute()

const leadID = route.params.id

const listId = route.query.list_id

const { leadFilteredData, leadStatus, listHeaders, leadData } = useLeadDetails(Number(leadID), Number(listId))

// get lead detail with ID from params
// const { data: leadData, status: leadStatus } = await useLazyAsyncData('lead-details', () =>
//   useApi().post('/get-data-for-edit-lead-page', {
//     lead_id: 568334,
//     parent_id: listId.value,
//   }), {
//   transform: res => res.data.leadData,
// })

// const { user } = useAuth()

// // get list headers
// const { data: listHeaders, status: listHeaderStatus } = await useLazyAsyncData('leads-list-headers', () =>
//   useApi().post('/list-header', {
//     id: user.value?.id,
//     list_data: [listId.value],
//   }), {
//   transform: res => res.data,
// })

// // Computed property that filters lead data based on matching headers
// // Returns array of lead data items that have matching titles in the list headers
// // Returns empty array if either leadData or listHeaders is not available
// const leadFilteredData = computed(() => {
//   if (leadData.value && listHeaders.value)
//     return Object.values(leadData.value).filter((item: any) => listHeaders.value.some((header: any) => header.title === item.title))
//   else
//     return []
// })

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
  {{ route.query }}
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
      <LeadManagementLeadDetails :data="leadFilteredData" :loading="leadStatus === 'pending'" />
    </div>
    <div class="lg:col-span-8">
      <LeadManagementLeadLeadTabs :activity-data="leadActivityData" :lead-data="leadData" />
    </div>
  </div>
</template>
