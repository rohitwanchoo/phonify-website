import { computed } from 'vue'

interface LeadItem {
  id: number
  title: string
  is_dialing: number
  column_name?: string
  value: string
}

interface ListHeader {
  column_name: string
  title: string
}

export function useLeadDetails(leadId: number, parentId: number) {
  const { user } = useAuth()

  // get lead detail
  const { data: leadData, status: leadStatus } = useLazyAsyncData(
    `lead-details-${leadId}`,
    () =>
      useApi().post('/get-data-for-edit-lead-page', {
        lead_id: leadId,
        parent_id: parentId,
      }),
    {
      transform: (res: any) => res.data.leadData as Record<string, LeadItem>,
    },
  )

  // get list headers
  const { data: listHeaders, status: listHeaderStatus } = useLazyAsyncData(
    `leads-list-headers-${parentId}`,
    () =>
      useApi().post('/list-header', {
        id: user.value?.id,
        list_data: [parentId],
      }),
    {
      transform: (res: any) => res.data as ListHeader[],
    },
  )

  // Computed property that filters lead data based on matching headers
  const leadFilteredData = computed<LeadItem[]>(() => {
    if (leadData.value && listHeaders.value) {
      return Object.values(leadData.value).filter((item: LeadItem) =>
        listHeaders.value?.some(
          (header: ListHeader) => header.title.trim().toLowerCase() === item.title.trim().toLowerCase(),
        ),
      )
    }
    return []
  })

  return {
    leadData,
    leadStatus,
    listHeaders,
    listHeaderStatus,
    leadFilteredData,
  }
}
