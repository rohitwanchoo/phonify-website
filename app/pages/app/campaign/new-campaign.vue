<script setup lang="ts">
import { Button } from '~/components/ui/button'

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
    campaign_id: route.query.id,
  }), {
  transform: (res) => {
    return res
  },
  immediate: false,
})

function setData() {
  if (route.query.id) {
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

      const redirectTo = campaignById.value?.redirect_to
      if (redirectTo) {
        switch (redirectTo) {
          case '1':
            refreshNuxtData('get-audio-message-amd-list')
            break
          case '2':
            refreshNuxtData('get-voice-template-amd-list')
            break
          case '3':
            refreshNuxtData('get-voice-drop-options')
            break
          case '4':
            refreshNuxtData('get-ring-group-list')
            break
          case '5':
            refreshNuxtData('get-inbound-ivr-options')
            break
          case '6':
            refreshNuxtData('get-voice-ai-options')
            break
        }
      }

      if (campaignById.value.time_based_calling)
        refreshNuxtData('get-call-timings-campaign')

      const values = transformCampaignToFormValues(campaignById.value)
      if (values?.caller_id === 'custom') {
        refreshNuxtData('get-custom-caller-id-list')
      }
      const allValues = {
        ...values,
        redirect_to: Number(values.redirect_to),
        redirect_to_dropdown: Number(values.redirect_to_dropdown),
        no_agent_dropdown_action: Number(values.no_agent_dropdown_action),
        call_schedule_id: values.call_schedule_id,
        call_ratio: String(values.call_ratio),
        duration: values.duration === 0 ? '' : values.duration
        // custom_caller_id: values.custom_caller_id ? values.custom_caller_id : null,
      }
      if (values?.custom_caller_id === 'null') {
        delete allValues?.custom_caller_id
      }

      formState.value = allValues
    })
  }
}

onMounted(() => {
  setData()
})

const isPreview = computed(() => stepper.isCurrent('show-preview'))
const currentStep = computed(() => stepper.stepNames.value[stepper.index.value])

// watch currentStep
watch(currentStep, (val) => {
  if (val === 'create-campaign' || val === 'show-preview') {
    setData()
  }
})

function goToNext() {
  // if (stepper.isCurrent('select-list'))
  //   refresh()
  stepper.goToNext()
}
</script>

<template>
  <BaseHeader :title="isEdit ? 'Update Campaign' : 'Create New Campaign'" :breadcrumbs="breadcrumbs">
    <template #actions>
      <div class="flex items-center gap-3">
        <NuxtLink to="/app/campaign">
          <Button variant="outline" class="h-10">
            <Icon name="lucide:arrow-left" size="16" class="mr-2" />
            Back to Campaigns
          </Button>
        </NuxtLink>
      </div>
    </template>
  </BaseHeader>

  <!-- Edit Mode Indicator -->
  <div v-if="isEdit && campaignByIdStatus === 'success'" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
    <Icon name="lucide:info" class="h-5 w-5 text-blue-600" />
    <p class="text-sm text-blue-700">
      You are editing an existing campaign. Changes will be saved when you click Save or Continue.
    </p>
  </div>

  <CampaignStepper :stepper="stepper">
    <component :is="stepper.current.value.component" :is-preview="isPreview" :data-loading="campaignByIdStatus === 'pending'" @reset-data="setData" @completed="(e: any) => goToNext()" @go-to="(e: any) => stepper.goTo(e)" />
  </CampaignStepper>
</template>
