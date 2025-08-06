<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { Button } from '@/components/ui/button'

const route = useRoute()
const id = route.query.id
const isEdit = computed(() => !!id)

const { stepper, formState, resetFormState } = useCreateCampaign()

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
const { data: campaignDeposition, refresh: campaignDepositionRefresh } = await useLazyAsyncData('campaign-deposition-by-id', () =>
  useApi().post('/campaign-disposition', {
    campaign_id: id,
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: true,
})

const callerIds = [
  {
    id: 0,
    value: 'area_code',
    name: 'Area code',
  },
  {
    id: 1,
    value: 'custom',
    name: 'Custom (Enabled for Custom CLI)',
  },
  {
    id: 2,
    value: 'area_code_random',
    name: 'Area Code and Randomizer',
  },
]

onMounted(() => {
  if (isEdit.value) {
    refresh().then(() => {
      // console.log(campaignById.value)

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

      const values = {
        status: campaignById.value.status,
        title: campaignById.value.title,
        country_code: campaignById.value.country_code,
        description: campaignById.value.description,
        // caller_id: String(campaignById.value?.caller_id),
        caller_id: String(callerIds.find(item => item.value === campaignById.value?.caller_id)?.id),
        dial_mode: campaignById.value.dial_mode,
        group_id: campaignById.value.group_id,
        call_ratio: campaignById.value.call_ratio,
        duration: campaignById.value.duration,
        no_agent_available_action: campaignById.value?.no_agent_available_action,
        automated_duration: campaignById.value.automated_duration === '1',
        amd: campaignById.value.amd === '1',
        amd_drop_action: campaignById.value.amd_drop_action,
        time_based_calling: campaignById.value.time_based_calling === 1,
        email: Number(campaignById.value.email),
        sms: campaignById.value.sms === '1',
        send_report: campaignById.value.send_report === 1,
        call_transfer: campaignById.value.call_transfer === '1',
        hopper_mode: campaignById.value.hopper_mode,
        custom_caller_id: String(campaignById.value.custom_caller_id),
        disposition_id: campaignDeposition.value.map(item => item.disposition_id),

      }

      if (values?.caller_id === '1') {
        refreshNuxtData('get-custom-caller-id-list')
      }
      formState.value = values
      // formState.value = campaignById.value
      // formState.value.custom_caller_id = String(campaignById.value.custom_caller_id)
    })
  }
})

// stepper.goTo('select-list')
</script>

<template>
  <BaseHeader :title="isEdit ? 'Update Campaign'  :'Create New Campaign'" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button variant="outline" class="h-11">
        <icon name="material-symbols:save-rounded" size="18" />
        Save as Draft
      </Button>
    </template>
  </BaseHeader>
  <CampaignStepper :stepper="stepper">
    <component :is="stepper.current.value.component" :data-loading="campaignByIdStatus === 'pending'" @completed="(e: any) => stepper.goToNext()" @go-to="(e: any) => stepper.goTo(e)" />
  </CampaignStepper>
</template>
