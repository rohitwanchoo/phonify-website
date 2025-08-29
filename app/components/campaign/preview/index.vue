<script setup lang="ts">
import { Button } from '~/components/ui/button'

const emit = defineEmits(['goTo'])

const { formState, transformCampaignToFormValues } = useCreateCampaign()

const route = useRoute()
const id = route.query.id

// const { data: campaignById, status: campaignByIdStatus, refresh } = await useLazyAsyncData('get-campaign-by-id-preview', () =>
//   useApi().post('/campaign-by-id', {
//     campaign_id: id,
//   }), {
//   transform: (res) => {
//     return res[0]
//   },
//   immediate: true,
// })

const { data: campaignById } = useNuxtData('get-campaign-by-id')

const { data: campaignDeposition } = useNuxtData('campaign-deposition-by-id')

function updateCampaign(values: any) {
  const campaignForm = transformCampaignToFormValues(campaignById.value, campaignDeposition.value)
  formState.value = campaignForm
  const payload = {
    campaign_id: Number(id),
    ...values,
    ...formState.value,

    // ...campaignById.value,
  }

  useApi().post('/edit-campaign', payload).then((response) => {
    showToast(response.message)
    // refresh()
  }).catch((error) => {
    showToast(error.message)
  })
}
</script>

<template>
  <div class=" relative h-[calc(100vh-190px)] overflow-y-auto">
    <div class="m-5 space-y-[16px]">
      <div class="flex items-center justify-between">
        <div class="font-medium text-[20px]">
          Preview Campaign
        </div>
        <div class="flex items-center gap-x-1 text-green-600 text-[16px]">
          <Icon name="stash:circle-dot" size="20" />
          Active
        </div>
      </div>
      <CampaignPreviewCampaignDetails :loading="!campaignById" :campaign="campaignById" @update="updateCampaign" />
      <CampaignPreviewCallerDetails />
      <CampaignPreviewTimeBasedCalling />
      <CampaignPreviewOtherDetails />
      <CampaignPreviewSendDetails />
      <CampaignPreviewAssociatedList @on-edit="emit('goTo', 'select-list')" />
    </div>
    <div class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4">
      <Button class="w-full h-[52px] items-center" type="submit" @click="onSubmit">
        <Icon name="mdi:phone" size="18" />
        Start Dialing
      </Button>
    </div>
  </div>
</template>
