<script setup lang="ts">
import { Button } from '~/components/ui/button'

const emit = defineEmits(['goTo'])
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
      <CampaignPreviewCampaignDetails />
      <CampaignPreviewCallerDetails />
      <CampaignPreviewTimeBasedCalling />
      <CampaignPreviewOtherDetails />
      <CampaignPreviewSendDetails />
      <CampaignPreviewAssociatedList @on-edit="emit('goTo', 'select-list')" />
      <!-- <div @click="emit('goTo', 'select-list')">
        dfa
      </div> -->
    </div>
    <!-- <div class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4">
      <Button class="w-full h-[52px]" type="submit" @click="onSubmit">
        Continue
      </Button>
    </div> -->
  </div>
</template>
