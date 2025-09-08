<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { Button } from '@/components/ui/button'

const route = useRoute()
const id = route.query.id
const isEdit = computed(() => !!id)

const { stepper, formState, resetFormState: _resetFormState, transformCampaignToFormValues } = useCreateCampaign()

const breadcrumbs = [
  {
    label: 'Campaign',
    href: '/app/campaign',
  },
  {
    label: isEdit.value ? 'Update Campaign' : 'Create New Campaign',
    active: true,
  },
]

const { data: campaignById, status: campaignByIdStatus, refresh } = await useLazyAsyncData('get-campaign-by-id', () =>
  useApi().post('/campaign-by-id', {
    campaign_id: id,
  }), {
  transform: (res) => {
    return res[0]
  },
  immediate: false,
})

function setData() {
  if (isEdit.value) {
    refresh().then(() => {
      const action = campaignById.value?.no_agent_available_action
      if (action) {
        switch (action) {
          case 2:
            refreshNuxtData('get-voice-drop-options')
            break
          case 3:
            refreshNuxtData('get-inbound-ivr-options')
            break
        }
      }

      const amdDropAction = campaignById.value?.amd_drop_action
      if (amdDropAction) {
        switch (amdDropAction) {
          case 2:
            refreshNuxtData('get-audio-message-amd-list')
            break
          case 3:
            refreshNuxtData('get-voice-template-amd-list')
            break
        }
      }

      if (campaignById.value.time_based_calling)
        refreshNuxtData('get-call-timings-campaign')

      const values = transformCampaignToFormValues(campaignById.value)
      if (values?.caller_id === 'custom') {
        refreshNuxtData('get-custom-caller-id-list')
      }
      formState.value = values
    })
  }
}

onMounted(() => {
  setData()
})

const isPreview = computed(() => stepper.isCurrent('show-preview'))

// stepper.goTo('show-preview')
</script>

<template>
  <BaseHeader :title="isEdit ? 'Update Campaign' : 'Create New Campaign'" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button variant="outline" class="h-11">
        <icon name="material-symbols:save-rounded" size="18" />
        Save as Draft
      </Button>
    </template>
  </BaseHeader>
  <CampaignStepper :stepper="stepper">
    <component :is="stepper.current.value.component" :is-preview="isPreview" :data-loading="campaignByIdStatus === 'pending'" @reset-data="setData" @completed="(e: any) => stepper.goToNext()" @go-to="(e: any) => stepper.goTo(e)" />
  </CampaignStepper>
</template>
