<script setup lang="ts">
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
  debugger
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
  if (stepper.isCurrent('select-list'))
    refresh()
  stepper.goToNext()
}
</script>

<template>
  <BaseHeader :title="isEdit ? 'Update Campaign' : 'Create New Campaign'" :breadcrumbs="breadcrumbs">
    <!-- <template #actions>
      <Button variant="outline" class="h-11">
        <icon name="material-symbols:save-rounded" size="18" />
        Save as Draft
      </Button>
    </template> -->
  </BaseHeader>
  <CampaignStepper :stepper="stepper">
    <component :is="stepper.current.value.component" :is-preview="isPreview" :data-loading="campaignByIdStatus === 'pending'" @reset-data="setData" @completed="(e: any) => goToNext()" @go-to="(e: any) => stepper.goTo(e)" />
  </CampaignStepper>
</template>
